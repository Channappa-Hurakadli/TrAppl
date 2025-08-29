import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AppSidebar } from "@/components/AppSidebar";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Save, ArrowLeft } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Link, useNavigate } from "react-router-dom";
import { useJobs } from "@/context/JobContext";

export default function AddJob() {
  const [formData, setFormData] = useState({
    company: "",
    position: "",
    appliedDate: undefined as Date | undefined,
    status: "",
    notes: "",
    location: ""
  });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { addJob } = useJobs();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.company || !formData.position || !formData.appliedDate || !formData.status) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // The context will handle the API call and state update
      await addJob({
        ...formData,
        // Ensure appliedDate is correctly formatted for the backend
        appliedDate: formData.appliedDate.toISOString(),
      });
      
      toast({
        title: "Job Added",
        description: `${formData.position} at ${formData.company} has been added successfully.`,
      });
      navigate("/dashboard");
    } catch (error) {
      // Error toast is already handled in the JobContext
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <AppSidebar />
        
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link to="/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold">Add New Job</h1>
                <p className="text-muted-foreground">Add a new job application to track</p>
              </div>
            </div>
          </div>

          <Card className="max-w-2xl bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle>Job Application Details</CardTitle>
              <CardDescription>
                Fill in the details of your job application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="company">Company *</Label>
                    <Input id="company" value={formData.company} onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))} placeholder="e.g., Google" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="position">Position *</Label>
                    <Input id="position" value={formData.position} onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))} placeholder="e.g., Senior Frontend Developer" required />
                  </div>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                   <div className="space-y-2">
                    <Label>Applied Date *</Label>
                    <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn("w-full justify-start text-left font-normal", !formData.appliedDate && "text-muted-foreground")}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.appliedDate ? format(formData.appliedDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={formData.appliedDate}
                          onSelect={(date) => {
                            setFormData(prev => ({ ...prev, appliedDate: date as Date }));
                            setIsCalendarOpen(false);
                          }}
                          initialFocus
                          className="p-3 pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="status">Status *</Label>
                    <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                      <SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Applied">Applied</SelectItem>
                        <SelectItem value="Interview">Interview</SelectItem>
                        <SelectItem value="Offer">Offer</SelectItem>
                        <SelectItem value="Rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" value={formData.location} onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))} placeholder="e.g., San Francisco, CA" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea id="notes" value={formData.notes} onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))} placeholder="Add any additional notes about this application..." rows={4} />
                </div>

                <div className="flex gap-4">
                  <Button type="submit" className="bg-gradient-primary hover:shadow-hover transition-all duration-300" disabled={isLoading}>
                    <Save className="mr-2 h-4 w-4" />
                    {isLoading ? "Saving..." : "Save Job Application"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => navigate("/dashboard")}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
}
