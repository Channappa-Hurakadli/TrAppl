import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/ui/navbar";
import { Link } from "react-router-dom";
import { Check, Star } from "lucide-react";

export default function Pricing() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header */}
      <section className="py-20 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl bg-gradient-hero bg-clip-text text-transparent">
                Simple, transparent pricing
              </h1>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Choose the plan that works best for your job search journey. Always know what you'll pay.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-20 lg:pb-32">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
            
            {/* Free Plan */}
            <Card className="bg-gradient-card shadow-card hover:shadow-hover transition-all duration-300">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl">Free</CardTitle>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <CardDescription>Perfect for getting started</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Up to 50 job applications</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Manual entry</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Basic dashboard</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Email support</span>
                  </div>
                </div>
                <Button className="w-full mt-6" variant="outline" asChild>
                  <Link to="/signup">Get Started Free</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="bg-gradient-card shadow-card hover:shadow-hover transition-all duration-300 border-primary relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-primary text-white px-3 py-1 rounded-full text-xs flex items-center space-x-1">
                  <Star className="h-3 w-3" />
                  <span>Most Popular</span>
                </div>
              </div>
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl">Pro</CardTitle>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-4xl font-bold">$12</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <CardDescription>For serious job seekers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Unlimited job applications</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Gmail integration</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Advanced analytics</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Priority support</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Export data</span>
                  </div>
                </div>
                <Button className="w-full mt-6 bg-gradient-primary hover:shadow-hover transition-all duration-300" asChild>
                  <Link to="/signup">Start Pro Trial</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Enterprise Plan */}
            <Card className="bg-gradient-card shadow-card hover:shadow-hover transition-all duration-300">
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-2xl">Enterprise</CardTitle>
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-4xl font-bold">$29</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <CardDescription>For teams and organizations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Everything in Pro</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Team collaboration</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Custom integrations</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">24/7 phone support</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Check className="h-4 w-4 text-green-600" />
                    <span className="text-sm">SLA guarantee</span>
                  </div>
                </div>
                <Button className="w-full mt-6" variant="outline" asChild>
                  <Link to="/contact">Contact Sales</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 lg:py-32 bg-secondary/30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
              Frequently Asked Questions
            </h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
              Have questions? We have answers.
            </p>
          </div>
          
          <div className="grid gap-6 lg:grid-cols-2 max-w-4xl mx-auto">
            <Card className="bg-gradient-card shadow-card p-6">
              <h3 className="font-semibold mb-2">Can I change plans anytime?</h3>
              <p className="text-sm text-muted-foreground">
                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </Card>
            
            <Card className="bg-gradient-card shadow-card p-6">
              <h3 className="font-semibold mb-2">Is my data secure?</h3>
              <p className="text-sm text-muted-foreground">
                Absolutely. We use enterprise-grade encryption and never share your data with third parties.
              </p>
            </Card>
            
            <Card className="bg-gradient-card shadow-card p-6">
              <h3 className="font-semibold mb-2">Do you offer refunds?</h3>
              <p className="text-sm text-muted-foreground">
                Yes, we offer a 30-day money-back guarantee on all paid plans. No questions asked.
              </p>
            </Card>
            
            <Card className="bg-gradient-card shadow-card p-6">
              <h3 className="font-semibold mb-2">How does Gmail integration work?</h3>
              <p className="text-sm text-muted-foreground">
                We securely scan your Gmail for job application confirmations and automatically extract key details.
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}