import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useSearchParams, Navigate, Outlet, useNavigate } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AddJob from "./pages/AddJob";
import GmailIntegration from "./pages/GmailIntegration";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { useAuth } from "./context/AuthContext";
import { useEffect } from "react";
import { ThemeProvider } from "@/context/ThemeContext";
import { JobProvider } from "@/context/JobContext";
import Pricing from "./pages/Pricing";
import { jwtDecode } from "jwt-decode";

const queryClient = new QueryClient();

// A component to handle the redirect from Google OAuth
const GoogleAuthHandler = () => {
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      try {
        const decoded: { id: string, name: string, email: string } = jwtDecode(token);
        
        const userData = {
          token,
          _id: decoded.id,
          name: decoded.name,
          email: decoded.email,
        };

        login(userData);
        
        // Navigate to the dashboard, replacing the current URL so the user can't go "back" to the token URL
        navigate('/dashboard', { replace: true });

      } catch (error) {
        console.error("Failed to decode token from URL:", error);
        navigate('/login', { replace: true });
      }
    }
  }, [searchParams, login, navigate]);

  return null; // This component renders nothing
};

// UPDATED: This component now handles the initial loading state
const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // While the app is checking for a token, show a loading indicator
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  // After checking, either show the content or redirect to login
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <JobProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <GoogleAuthHandler />
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              <Route element={<ProtectedRoute />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboard/add-job" element={<AddJob />} />
                <Route path="/dashboard/gmail" element={<GmailIntegration />} />
                <Route path="/dashboard/settings" element={<Settings />} />
                <Route path='/pricing' element={<Pricing/>} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </JobProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
