import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { authApi } from "@/lib/api";
import { Loader2, Eye, EyeOff } from "lucide-react";

function parseHashTokens(hash: string): {
  accessToken?: string;
  refreshToken?: string;
  type?: string;
  errorDescription?: string;
} {
  const raw = hash.startsWith("#") ? hash.slice(1) : hash;
  const params = new URLSearchParams(raw);

  return {
    accessToken: params.get("access_token") || undefined,
    refreshToken: params.get("refresh_token") || undefined,
    type: params.get("type") || undefined,
    errorDescription: params.get("error_description") || undefined,
  };
}

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;

    const { accessToken, refreshToken, type, errorDescription } =
      parseHashTokens(hash);

    // clear hash AFTER reading it
    if (hash) {
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search
      );
    }

    if (errorDescription) {
      toast({
        title: "Reset link error",
        description: decodeURIComponent(errorDescription),
        variant: "destructive",
      });
      return;
    }

    if (type !== "recovery") {
      toast({
        title: "Invalid link",
        description: "Please request a new password reset.",
        variant: "destructive",
      });
      return;
    }

    setAccessToken(accessToken ?? null);
    setRefreshToken(refreshToken ?? null);
  }, [toast]);

  const canSubmit = useMemo(() => {
    if (!accessToken || !refreshToken) return false;
    if (!password || password.length < 6) return false;
    if (password !== confirmPassword) return false;
    return true;
  }, [accessToken, refreshToken, password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!accessToken || !refreshToken) {
      toast({
        title: "Invalid Link Title",
        description: "Missing Tokens",
        variant: "destructive",
      });
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Passwords Mismatch",
        description: "Reenter Password",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await authApi.resetPassword({
        accessToken,
        refreshToken,
        password,
      });
      toast({
        title: "Password Updated",
        description: res.message || "Can Login",
      });
      navigate("/login");
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed To Reset",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary">
              <span className="text-xl font-bold text-primary-foreground">
                A
              </span>
            </div>
            <span className="font-display text-2xl font-bold">
              {"Asteai Deeptech"}
            </span>
          </Link>
        </div>

        <Card className="animate-scale-in">
          <CardHeader className="text-center">
            <CardTitle className="font-display text-2xl">{"Reset Password"}</CardTitle>
            <CardDescription>{"Enter your new password below"}</CardDescription>
          </CardHeader>
          <CardContent>
            {!accessToken || !refreshToken ? (
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {"Invalid Link"}
                </p>
                <Button asChild className="w-full">
                  <Link to="/forgot-password">{"Request New Link"}</Link>
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">{"New Password"}</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">{"Confirm Password"}</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading || !canSubmit}
                >
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {"Submit"}
                </Button>
              </form>
            )}

            <div className="mt-6 text-center text-sm text-muted-foreground">
              <Link
                to="/login"
                className="text-primary hover:underline font-medium"
              >
                {"Back To Login"}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
