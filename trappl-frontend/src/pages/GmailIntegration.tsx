import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AppSidebar } from "@/components/AppSidebar";
import { Mail, RefreshCw, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useJobs } from "@/context/JobContext";
import api from "@/services/api";

const API_URL = "http://localhost:5000/api";

export default function GmailIntegration() {
  const { user } = useAuth();
  const { fetchJobs } = useJobs(); // Get the function to refresh jobs
  const [isLoading, setIsLoading] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const { toast } = useToast();

  // A user's Gmail is considered connected if they have a googleId on their user object.
  // This happens automatically when they sign up or log in with Google.
  const isConnected = !!user?.googleId;

  const handleConnectGmail = () => {
    // This redirects to the same Google OAuth flow used for signup.
    // The backend will handle storing the refresh token needed for background sync.
    window.location.href = `${API_URL}/auth/google`;
  };

  const handleDisconnect = async () => {
    setIsDisconnecting(true);
    try {
        await api.post('/auth/disconnect');
        toast({
            title: "Gmail Disconnected",
            description: "Your account has been disconnected from Google. Please log in again.",
        });
        // Log the user out to force a refresh of their user state.
        // This ensures the UI updates correctly to the "Not Connected" view.
        // logout();
    } catch (error: any) {
        toast({
            title: "Disconnect Failed",
            description: error.response?.data?.message || "Could not disconnect your Google account.",
            variant: "destructive",
        });
    } finally {
        setIsDisconnecting(false);
    }
  };

  const handleSyncNow = async () => {
    setIsLoading(true);
    try {
      const { data } = await api.post('/jobs/sync');
      
      // After a successful sync, refresh the jobs list in our app
      await fetchJobs();

      toast({
        title: "Sync Complete",
        description: data.message || "Your jobs have been synced from Gmail.",
      });
    } catch (error: any) {
      toast({
        title: "Sync Failed",
        description: error.response?.data?.message || "An error occurred during sync. Make sure your Google account is connected.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <AppSidebar />
        
        <main className="flex-1 p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Gmail Integration</h1>
            <p className="text-muted-foreground">Automatically import job applications from your Gmail</p>
          </div>

          <Card className="mb-6 bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Gmail Connection
              </CardTitle>
              <CardDescription>
                Connect your Gmail account to automatically import job application confirmations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!isConnected ? (
                <div className="text-center py-6">
                  <div className="mb-4">
                    <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                      <Mail className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Connect Your Gmail</h3>
                    <p className="text-muted-foreground mb-6">
                      We'll scan your Gmail for job application confirmations and automatically add them to your dashboard.
                    </p>
                  </div>
                  <Button 
                    onClick={handleConnectGmail}
                    className="bg-gradient-primary hover:shadow-hover transition-all duration-300"
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Connect Gmail
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-medium text-green-800 dark:text-green-300">Gmail Connected</p>
                        <p className="text-sm text-green-600 dark:text-green-400">{user?.email}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={handleDisconnect} disabled={isDisconnecting}>
                      {isDisconnecting ? "Disconnecting..." : "Disconnect"}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Manual Sync</p>
                      <p className="text-sm text-muted-foreground">
                        Scan your inbox for new applications right now.
                      </p>
                    </div>
                    <Button 
                      onClick={handleSyncNow}
                      disabled={isLoading}
                      variant="outline"
                    >
                      {isLoading ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Syncing...
                        </>
                      ) : (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4" />
                          Sync Now
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* How it works */}
          <Card className="mt-6 shadow-card">
            <CardHeader>
              <CardTitle>How Gmail Integration Works</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="text-center">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Scan Emails</h3>
                  <p className="text-sm text-muted-foreground">
                    We scan your Gmail for job application confirmations and rejection emails.
                  </p>
                </div>
                <div className="text-center">
                  <div className="mx-auto w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-3">
                    <RefreshCw className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="font-semibold mb-2">Extract Data</h3>
                  <p className="text-sm text-muted-foreground">
                    We automatically extract company name, position, and application date.
                  </p>
                </div>
                <div className="text-center">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-3">
                    <CheckCircle className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Add to Dashboard</h3>
                  <p className="text-sm text-muted-foreground">
                    Applications are automatically added to your dashboard for tracking.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
        </main>
      </div>
    </div>
  );
}






