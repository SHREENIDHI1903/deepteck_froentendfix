import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function CallbackPage() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleCallback = async () => {
      // 1. Read intent from URL query params
      const searchParams = new URLSearchParams(window.location.search);
      const intent = searchParams.get("intent") || "login";

      // 2. Extract access_token from hash (Supabase returns tokens in hash)
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get("access_token");

      // Handle OAuth errors from hash
      const error = hashParams.get("error");
      const errorDescription = hashParams.get("error_description");

      if (error) {
        toast({
          title: "Error",
          description: errorDescription || "Authentication failed",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      // Validate access token exists
      if (!accessToken) {
        toast({
          title: "Error",
          description: "No authentication token received",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      try {
        // 3. POST { access_token, intent } to /auth/google/verify
        const response = await fetch(`${API_BASE_URL}/auth/google/verify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ access_token: accessToken, intent }),
        });

        const data = await response.json();

        // Handle deactivated account - redirect to login with reactivation data
        if (data.code === "ACCOUNT_DEACTIVATED") {
          // Store reactivation data and access token for the dialog
          sessionStorage.setItem("reactivationData", JSON.stringify({
            accessToken,
            suggestedData: data.data?.suggestedData || {}
          }));
          navigate("/login?showReactivation=true");
          return;
        }

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to verify authentication");
        }

        // 4. Handle response based on intent
        // For Google OAuth, the backend already creates/restores the user account
        // Both login and signup intents result in a fully authenticated user
        if (data.data?.tokens?.accessToken) {
          // Handle language preference before storing token
          const user = data.data.user;
          if (user?.preferred_language && user.preferred_language !== "en") {
            const lang = user.preferred_language;
            const cookieValue = `/en/${lang}`;
            document.cookie = `googtrans=${cookieValue}; path=/; domain=${window.location.hostname}`;
            document.cookie = `googtrans=${cookieValue}; path=/;`;
            sessionStorage.setItem("pendingLanguageChange", lang);
          }

          // Handle reactivation case - store token first, then redirect to show dialog
          if (data.data?.isReactivated) {
            localStorage.setItem("token", data.data.tokens.accessToken);
            window.location.assign(`/login?googleReactivate=true`);
            return;
          }

          // Store token and redirect to dashboard
          localStorage.setItem("token", data.data.tokens.accessToken);

          toast({
            title: "Welcome!",
            description: intent === "signup"
              ? "Successfully signed up with Google."
              : "Successfully signed in with Google.",
          });

          // Force reload to update auth context
          window.location.href = "/dashboard";
        } else {
          throw new Error("No access token in response");
        }
      } catch (error: any) {
        console.error("Callback error:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to complete sign-in",
          variant: "destructive",
        });
        localStorage.removeItem("token");
        navigate("/login");
      }
    };

    handleCallback();
  }, [navigate, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
        <h2 className="text-xl font-semibold mb-2">Completing sign-in...</h2>
        <p className="text-sm text-muted-foreground">
          Please wait while we set up your account
        </p>
      </div>
    </div>
  );
}
