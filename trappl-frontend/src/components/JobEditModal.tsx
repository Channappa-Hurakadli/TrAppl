import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Save } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

// Interface now matches the backend and JobContext
interface Job {
  _id: string;
  company: string;
  position: string;
  appliedDate: string;
  status: string;
  source: string;
  notes: string;
  location: string;
}

interface JobEditModalProps {
  job: Job | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedJob: Job) => void;
}

export function JobEditModal({ job, isOpen, onClose, onSave }: JobEditModalProps) {
  // Initialize state for the form data
  const [formData, setFormData] = useState({
    company: '',
    position: '',
    appliedDate: new Date(),
    status: '',
    notes: '',
    location: ''
  });
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const { toast } = useToast();

  // Use useEffect to update form data when the 'job' prop changes
  useEffect(() => {
    if (job) {
      setFormData({
        company: job.company || "",
        position: job.position || "",
        // Ensure appliedDate is a valid Date object
        appliedDate: new Date(job.appliedDate || new Date()),
        status: job.status || "",
        notes: job.notes || "",
        location: job.location || ""
      });
    }
  }, [job]); // This effect runs whenever the 'job' prop changes

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!job) return;

    if (!formData.company || !formData.position || !formData.status) {
      toast({
        title: "Missing Fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Construct the updated job object with the correct _id
    const updatedJob: Job = {
      ...job, // This carries over _id and source
      company: formData.company,
      position: formData.position,
      appliedDate: formData.appliedDate.toISOString(), // Send in standard ISO format
      status: formData.status,
      notes: formData.notes,
      location: formData.location
    };

    onSave(updatedJob);
    onClose();
  };

  if (!job) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Job Application</DialogTitle>
          <DialogDescription>
            Update the details of your job application
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="edit-company">Company *</Label>
              <Input
                id="edit-company"
                value={formData.company}
                onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-position">Position *</Label>
              <Input
                id="edit-position"
                value={formData.position}
                onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                required
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Applied Date *</Label>
              <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.appliedDate && "text-muted-foreground"
                    )}
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
                      if (date) {
                        setFormData(prev => ({ ...prev, appliedDate: date }));
                        setIsCalendarOpen(false);
                      }
                    }}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status *</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
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
            <Label htmlFor="edit-location">Location</Label>
            <Input
              id="edit-location"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
              placeholder="e.g., San Francisco, CA"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-notes">Notes</Label>
            <Textarea
              id="edit-notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Add any additional notes..."
              rows={3}
            />
          </div>

          <div className="flex gap-4 justify-end">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="bg-gradient-primary hover:shadow-hover transition-all duration-300"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
