import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AppSidebar } from "@/components/AppSidebar";
import { JobEditModal } from "@/components/JobEditModal";
import { Plus, Search, Filter, Calendar, Building, MapPin, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { useJobs } from "@/context/JobContext";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";


// Define the structure of a Job object, matching the backend model
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

const statusColors = {
  "Applied": "bg-blue-100 text-blue-800",
  "Interview": "bg-yellow-100 text-yellow-800",
  "Offer": "bg-green-100 text-green-800",
  "Rejected": "bg-red-100 text-red-800"
};

export default function Dashboard() {
  const { jobs, loading, updateJob, deleteJob } = useJobs();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sourceFilter, setSourceFilter] = useState("all");
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { toast } = useToast();

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || job.status === statusFilter;
    const matchesSource = sourceFilter === "all" || job.source === sourceFilter;
    
    return matchesSearch && matchesStatus && matchesSource;
  });

  const stats = {
    total: jobs.length,
    applied: jobs.filter(j => j.status === "Applied").length,
    interview: jobs.filter(j => j.status === "Interview").length,
    offers: jobs.filter(j => j.status === "Offer").length
  };

  const handleEditJob = (job: Job) => {
    setEditingJob(job);
    setIsEditModalOpen(true);
  };

  const handleSaveJob = (updatedJob: Job) => {
    updateJob(updatedJob._id, updatedJob)
      .then(() => {
        toast({
          title: "Job Updated",
          description: "Your job application has been updated successfully.",
        });
      })
      .catch(() => {
        // Error toast is already handled in the context
      });
  };
  
  
  const handleDeleteJob = async (jobId: string) => {
    try {
      // The deleteJob function from the context handles the API call and state update
      await deleteJob(jobId);
    } catch (error) {
       // Error toast is already handled in the context
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <AppSidebar />
        
        <main className="flex-1 p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">Track and manage your job applications</p>
            </div>
            <Link to="/dashboard/add-job">
              <Button className="bg-gradient-primary hover:shadow-hover transition-all duration-300">
                <Plus className="mr-2 h-4 w-4" />
                Add Job
              </Button>
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
            <Card className="bg-gradient-card shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-card shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Applied</CardTitle>
                <Calendar className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{stats.applied}</div>
                <p className="text-xs text-muted-foreground">Pending response</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-card shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Interviews</CardTitle>
                <Calendar className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{stats.interview}</div>
                <p className="text-xs text-muted-foreground">In progress</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-card shadow-card">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Offers</CardTitle>
                <Calendar className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{stats.offers}</div>
                <p className="text-xs text-muted-foreground">Received</p>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6 shadow-card">
            <CardHeader>
              <CardTitle className="text-lg">Job Applications</CardTitle>
              <CardDescription>Manage and track all your job applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search companies or positions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <Filter className="mr-2 h-4 w-4" />
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="Applied">Applied</SelectItem>
                    <SelectItem value="Interview">Interview</SelectItem>
                    <SelectItem value="Offer">Offer</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={sourceFilter} onValueChange={setSourceFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    <SelectItem value="Manual">Manual</SelectItem>
                    <SelectItem value="Gmail">Gmail</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-28 w-full rounded-lg" />
                  <Skeleton className="h-28 w-full rounded-lg" />
                  <Skeleton className="h-28 w-full rounded-lg" />
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredJobs.map((job) => (
                    <Card key={job._id} className="hover:shadow-hover transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2 flex-wrap">
                              <h3 className="font-semibold text-lg">{job.position}</h3>
                              <Badge className={statusColors[job.status as keyof typeof statusColors]}>
                                {job.status}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {job.source}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3 flex-wrap">
                               <div className="flex items-center gap-1.5"><Building className="h-4 w-4" />{job.company}</div>
                               <div className="flex items-center gap-1.5"><MapPin className="h-4 w-4" />{job.location || 'N/A'}</div>
                               <div className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />{new Date(job.appliedDate).toLocaleDateString()}</div>
                            </div>
                            <p className="text-sm text-muted-foreground">{job.notes}</p>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditJob(job)}
                            >
                              Edit
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="icon">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete this job application.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteJob(job._id)}>
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {!loading && filteredJobs.length === 0 && (
                <div className="text-center py-12">
                  <h3 className="text-lg font-semibold">No Jobs Found</h3>
                  <p className="text-muted-foreground mt-1">
                    {jobs.length > 0 ? "No jobs match your current filters." : "Click 'Add Job' to start tracking!"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </main>
      </div>

      <JobEditModal
        job={editingJob}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingJob(null);
        }}
        onSave={handleSaveJob}
      />
    </div>
  );
}
