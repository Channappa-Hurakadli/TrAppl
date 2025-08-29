import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";
import { Moon, Sun } from "lucide-react";
import { useAuth } from "@/context/AuthContext"; // Import useAuth

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate(); // Import and use the navigate hook
  const { isAuthenticated, isLoading } = useAuth(); // Get authentication state
  const isLanding = location.pathname === '/';
  const { theme, toggleTheme } = useTheme();

  const scrollToFeatures = (e: React.MouseEvent) => {
    e.preventDefault();
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // This handler decides where to navigate on click
  const handleGetStartedClick = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link to="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <span className="text-white font-bold text-lg">T</span>
          </div>
          <span className="font-bold text-xl">TrAppl</span>
        </Link>
        
        {isLanding && (
          <nav className="mx-6 flex items-center space-x-4 lg:space-x-6">
            <a href="#features" onClick={scrollToFeatures} className="text-sm font-medium transition-colors hover:text-primary">
              Features
            </a>
            <Link to="/pricing" className="text-sm font-medium transition-colors hover:text-primary">
              Pricing
            </Link>
          </nav>
        )}

        <div className="ml-auto flex items-center space-x-4">
          <Button variant="ghost" size="sm" onClick={toggleTheme}>
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
          
          {isLanding ? (
            // UPDATED: Replaced Link with a Button and onClick handler
            <Button onClick={handleGetStartedClick} disabled={isLoading}>
              Get Started
            </Button>
          ) : (
            <Button variant="outline" asChild>
              <Link to="/">Back to Home</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
