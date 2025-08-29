import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/ui/navbar";
import { Link, useNavigate } from "react-router-dom"; // Import useNavigate
import { PlusCircle, Mail, BarChart3, Shield, Zap, Users } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";
import { useAuth } from "@/context/AuthContext";

const API_URL = "http://localhost:5000/api";

export default function Landing() {
  const { isAuthenticated, isLoading } = useAuth(); // Use isLoading from context
  const navigate = useNavigate(); // Add the useNavigate hook

  const handleConnectGmail = () => {
    if (isAuthenticated) {
      navigate('/dashboard/gmail');
    } else {
      window.location.href = `${API_URL}/auth/google`;
    }
  };

  // This function will decide where to go when the button is clicked
  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-gradient-hero bg-clip-text text-transparent">
                  Track your job applications automatically or manually
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Never lose track of a job application again. Add applications manually or sync automatically from your Gmail. All in one beautiful dashboard.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                {/* UPDATED: Changed from a Link to a Button with an onClick handler */}
                <Button 
                  size="lg" 
                  className="bg-gradient-primary hover:shadow-hover transition-all duration-300"
                  onClick={handleGetStarted}
                  disabled={isLoading} // Disable button while checking auth status
                >
                  Get Started Free
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-primary/20 hover:bg-primary/5"
                  onClick={handleConnectGmail}
                >
                  Connect Gmail
                </Button>
              </div>
            </div>
            <div className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last">
              <img
                src={heroImage}
                alt="Job tracking dashboard"
                className="w-full h-full object-cover shadow-soft"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section (No changes needed here) */}
      <section id="features" className="py-20 lg:py-32 bg-secondary/30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Everything you need to track jobs
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Whether you prefer manual entry or automated Gmail sync, TrAppl has you covered.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
            <Card className="bg-gradient-card shadow-card hover:shadow-hover transition-all duration-300">
              <CardHeader className="flex flex-col items-center space-y-2 pb-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <PlusCircle className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Manual Tracking</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription>
                  Add job applications manually with our intuitive form. Perfect for applications submitted directly on company websites.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-card shadow-card hover:shadow-hover transition-all duration-300">
              <CardHeader className="flex flex-col items-center space-y-2 pb-4">
                <div className="rounded-full bg-accent/10 p-3">
                  <Mail className="h-6 w-6 text-accent" />
                </div>
                <CardTitle>Gmail Integration</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription>
                  Automatically import job applications from your Gmail. We scan for application confirmations and extract key details.
                </CardDescription>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-card shadow-card hover:shadow-hover transition-all duration-300">
              <CardHeader className="flex flex-col items-center space-y-2 pb-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <BarChart3 className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Unified Dashboard</CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription>
                  Track status, progress, and analytics in one beautiful dashboard. Filter, search, and organize your applications efficiently.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col justify-center space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Why choose TrAppl?
              </h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-accent mt-1" />
                  <div>
                    <h3 className="font-semibold">Secure & Private</h3>
                    <p className="text-muted-foreground text-sm">Your data is encrypted and never shared with third parties.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Zap className="h-5 w-5 text-accent mt-1" />
                  <div>
                    <h3 className="font-semibold">Lightning Fast</h3>
                    <p className="text-muted-foreground text-sm">Built for speed with modern technology and optimized performance.</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Users className="h-5 w-5 text-accent mt-1" />
                  <div>
                    <h3 className="font-semibold">Made for Job Seekers</h3>
                    <p className="text-muted-foreground text-sm">Designed by job seekers, for job seekers. Every feature serves a purpose.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col space-y-4">
              <Card className="p-6 bg-gradient-card shadow-card">
                <div className="text-2xl font-bold text-primary">2,500+</div>
                <div className="text-muted-foreground">Job applications tracked</div>
              </Card>
              <Card className="p-6 bg-gradient-card shadow-card">
                <div className="text-2xl font-bold text-accent">95%</div>
                <div className="text-muted-foreground">Accuracy in Gmail parsing</div>
              </Card>
              <Card className="p-6 bg-gradient-card shadow-card">
                <div className="text-2xl font-bold text-primary">50+</div>
                <div className="text-muted-foreground">Happy job seekers</div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-gradient-hero">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center text-white">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
                Ready to organize your job search?
              </h2>
              <p className="max-w-[600px] text-white/80 md:text-xl">
                Join hundreds of job seekers who have streamlined their application tracking with TrAppl.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button 
                size="lg" 
                variant="secondary" 
                className="bg-white text-primary hover:bg-white/90"
                onClick={handleGetStarted}
                disabled={isLoading}
              >
                Start Free Today
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
              Built with ❤️ for job seekers everywhere.
            </p>
          </div>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
            <Link to="/contact" className="hover:text-foreground transition-colors">Contact</Link>
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
