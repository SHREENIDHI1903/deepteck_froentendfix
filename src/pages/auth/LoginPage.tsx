import { useState, useEffect } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { authApi } from "@/lib/api";
import { PublicLanguageSelector } from "@/components/shared/PublicLanguageSelector";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function LoginPage() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const { signIn, isAuthenticated, isLoading, user, updateProfile } = useAuth();
  const { toast, dismiss } = useToast();

  const [email, setEmail] = useState(searchParams.get("email") || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showReactivationDialog, setShowReactivationDialog] = useState(false);
  const [reactivationForm, setReactivationForm] = useState({ firstName: "", lastName: "", username: "" });
  const [updateLoading, setUpdateLoading] = useState(false);
  const [pendingReactivationToken, setPendingReactivationToken] = useState<string | null>(null);

  // Redirect if already logged in (handles page reload from language switch)
  useEffect(() => {
    const isGoogleReactivate = searchParams.get("googleReactivate") === "true";
    if (!isLoading && isAuthenticated && user && !loading && !showReactivationDialog && !isGoogleReactivate) {
      const target = user.role === "admin" ? "/admin" : "/dashboard";
      navigate(target, { replace: true });
    }
  }, [isLoading, isAuthenticated, user, navigate, loading, showReactivationDialog, searchParams]);

  // Handle redirects with error params (e.g. from Google Auth suspension)
  useEffect(() => {
    const errorParam = searchParams.get("error");
    if (errorParam === "suspended") {
      toast({
        title: "Account Suspended",
        description: "Your account is currently suspended.",
        variant: "destructive",
      });
      // Clean up URL
      navigate("/login", { replace: true });
    } else if (errorParam === "banned") {
      toast({
        title: "Account Banned",
        description: "Your account has been permanently banned.",
        variant: "destructive",
      });
      navigate("/login", { replace: true });
    }
  }, [searchParams, toast, navigate]);

  // Handle Google Reactivation signal (pre-reactivation dialog)
  useEffect(() => {
    if (searchParams.get("showReactivation") === "true") {
      const storedData = sessionStorage.getItem("reactivationData");
      if (storedData) {
        try {
          const { accessToken, suggestedData } = JSON.parse(storedData);
          setPendingReactivationToken(accessToken);
          setReactivationForm({
            firstName: suggestedData.firstName || "",
            lastName: suggestedData.lastName || "",
            username: suggestedData.username || ""
          });
          setShowReactivationDialog(true);
          sessionStorage.removeItem("reactivationData");
        } catch (e) {
          console.error("Failed to parse reactivation data", e);
        }
      }
      // Clean URL
      navigate("/login", { replace: true });
    }
  }, [searchParams, navigate]);

  // Handle post-reactivation flow (legacy - for email login)
  useEffect(() => {
    if (searchParams.get("googleReactivate") === "true") {
      // User is already authenticated via CallbackPage (token in localStorage)
      // but we need to show the dialog
      if (user) {
        setReactivationForm({
          firstName: user.first_name || "",
          lastName: user.last_name || "",
          username: user.username || ""
        });
        setShowReactivationDialog(true);
      }
    }
  }, [searchParams, user]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const authData = await signIn(email, password);

      // Dismiss any previous toasts before showing new ones
      dismiss();

      const adminInvite = searchParams.get("adminInvite");
      if (adminInvite) {
        const token = localStorage.getItem("token");
        if (token) {
          const accept = await authApi.acceptAdminInvite(token, adminInvite);
          if (accept.success && accept.data?.tokens?.accessToken) {
            localStorage.setItem("token", accept.data.tokens.accessToken);
            toast({
              title: "Admin access granted",
              description: "Your account has been upgraded to admin.",
            });
            // Force reload so AuthContext re-hydrates with the new token/role.
            window.location.assign("/admin");
            return;
          }
        }
      }

      if (authData?.isReactivated) {
        setReactivationForm({
          firstName: authData.user.first_name || "",
          lastName: authData.user.last_name || "",
          username: authData.user.username || ""
        });
        setShowReactivationDialog(true);
      } else {
        toast({
          title: "Welcome back!",
          description: "You have successfully logged in.",
        });
        navigate("/dashboard");
      }
    } catch (error: any) {
      if (error?.code === 'USER_SUSPENDED') {
        toast({
          title: "Account Suspended",
          description: error.message || "Your account is currently suspended.",
          variant: "destructive",
        });
      } else if (error?.code === 'USER_BANNED') {
        toast({
          title: "Account Banned",
          description: error.message || "Your account has been permanently banned.",
          variant: "destructive",
        });
      } else if (error?.code === 'REPORT_THRESHOLD_REACHED') {
        toast({
          title: "Account Restricted",
          description: error.message || "Your account is under review due to multiple reports.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: error.message || "Invalid credentials. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReactivationUpdate = async () => {
    if (!reactivationForm.firstName || !reactivationForm.lastName || !reactivationForm.username) {
      toast({ title: "Error", description: "All fields are required", variant: "destructive" });
      return;
    }

    // Strict Validation
    if (reactivationForm.username.length < 3) {
      toast({ title: "Error", description: "Username must be at least 3 characters", variant: "destructive" });
      return;
    }
    if (/^\d+$/.test(reactivationForm.username)) {
      toast({ title: "Error", description: "Username cannot be only numbers", variant: "destructive" });
      return;
    }

    setUpdateLoading(true);
    try {
      // If we have a pending reactivation token (Google OAuth flow), call reactivation endpoint
      if (pendingReactivationToken) {
        const response = await fetch(`${API_BASE_URL}/auth/reactivate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            access_token: pendingReactivationToken,
            firstName: reactivationForm.firstName,
            lastName: reactivationForm.lastName,
            username: reactivationForm.username
          })
        });

        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.message || "Reactivation failed");
        }

        // Store token and redirect
        localStorage.setItem("token", data.data.tokens.accessToken);
        setShowReactivationDialog(false);
        setPendingReactivationToken(null);
        toast({ title: "Welcome back!", description: "Your account has been reactivated." });
        window.location.href = "/dashboard";
      } else {
        // Email login flow - user is already authenticated, just update profile
        await updateProfile({
          first_name: reactivationForm.firstName,
          last_name: reactivationForm.lastName,
          username: reactivationForm.username
        });
        setShowReactivationDialog(false);
        toast({ title: "Success", description: "Profile updated successfully!" });
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to reactivate account", variant: "destructive" });
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ intent: "login" }),
      });

      const data = await response.json();

      if (data.success && data.data?.url) {
        window.location.href = data.data.url;
      } else {
        throw new Error(data.message || "Failed to initiate Google sign-in");
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Google sign-in failed.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 relative py-6">
      <div className="absolute top-3 right-4 z-50 flex flex-col items-end">
        <PublicLanguageSelector />
        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground bg-background/80 rounded px-2 py-1 shadow-sm border border-border">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-primary/70" fill="none" viewBox="0 0 24 24" stroke="currentColor"><circle cx="12" cy="12" r="10" strokeWidth="2" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 16v-4m0-4h.01" /></svg>
          <span>Switch language from here</span>
        </div>
      </div>

      <div className="w-full max-w-md">
        <div className="text-center mb-4">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg gradient-primary">
              <span className="text-base font-bold text-primary-foreground">A</span>
            </div>
            <span className="font-display text-xl font-bold">{"Asteai Deeptech"}</span>
          </Link>
        </div>

        <Card className="animate-scale-in p-2">
          <CardHeader className="text-center pb-2">
            <CardTitle className="font-display text-xl">
              Welcome back
            </CardTitle>
            <CardDescription className="text-sm">
              {"Enter your credentials to access your account."}
              <br />
              <span className="text-[11px] mt-1 inline-block">
                Your account type (Buyer/Expert) was set during registration
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-2">
              <div className="space-y-2">
                <Label htmlFor="email">
                  Email <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">
                  Password <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Link
                  to={`/forgot-password${email ? `?email=${encodeURIComponent(email)}` : ''}`}
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {"Sign In"}
              </Button>

              <div className="mt-2 text-center text-xs text-muted-foreground">
                or
              </div>

              <div className="mt-1 space-y-2">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 12-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  {"Continue with Google"}
                </Button>
              </div>
            </form>

            <div className="mt-3 space-y-1">
              <div className="text-center text-xs text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  to={`/register${email ? `?email=${encodeURIComponent(email)}` : ''}`}
                  className="text-primary hover:underline font-medium"
                >
                  Sign up
                </Link>
              </div>

              <div className="flex items-center justify-center gap-4 pt-3 border-t">
                <div className="text-center flex-1">
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    👔 Buyer Account
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Post projects, hire experts
                  </p>
                </div>
                <div className="h-10 w-px bg-border"></div>
                <div className="text-center flex-1">
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    🎓 Expert Account
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Browse projects, get hired
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <p className="mt-3 text-center text-[11px] text-muted-foreground">
          By logging in, you agree to our{" "}
          <Link to="/terms" className="hover:underline text-primary">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="hover:underline text-primary">
            Privacy Policy
          </Link>
        </p>
      </div>

      <AlertDialog open={showReactivationDialog} onOpenChange={(open) => {
        if (!open && pendingReactivationToken) {
          // User is canceling the reactivation dialog
          setPendingReactivationToken(null);
        }
        setShowReactivationDialog(open);
      }}>
        <AlertDialogContent onEscapeKeyDown={(e) => pendingReactivationToken && e.preventDefault()}>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingReactivationToken ? "Reactivate Your Account?" : "Welcome Back!"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingReactivationToken ? (
                <>
                  Your account is currently deactivated.
                  <br />
                  Enter your details below to reactivate and continue.
                </>
              ) : (
                <>
                  Your account has been successfully reactivated.
                  <br />
                  Please confirm your details to continue to your dashboard.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={reactivationForm.firstName}
                  onChange={(e) => setReactivationForm(prev => ({ ...prev, firstName: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={reactivationForm.lastName}
                  onChange={(e) => setReactivationForm(prev => ({ ...prev, lastName: e.target.value }))}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={reactivationForm.username}
                onChange={(e) => {
                  const val = e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 15);
                  setReactivationForm(prev => ({ ...prev, username: val }));
                }}
                maxLength={15}
              />
              <p className="text-[11px] text-muted-foreground">
                3-15 characters, alphanumeric, can't be only numbers.
              </p>
            </div>
          </div>

          <AlertDialogFooter>
            <Button onClick={handleReactivationUpdate} disabled={updateLoading}>
              {updateLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                pendingReactivationToken ? 'Reactivate & Continue' : 'Save & Continue'
              )}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div >
  );
}
