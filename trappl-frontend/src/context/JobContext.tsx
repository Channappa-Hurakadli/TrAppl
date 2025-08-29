import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import api from '@/services/api';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';

// Define the structure of a Job object
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

// Define the context type
interface JobContextType {
  jobs: Job[];
  loading: boolean;
  addJob: (jobData: Omit<Job, '_id' | 'source'>) => Promise<void>;
  updateJob: (jobId: string, jobData: Partial<Job>) => Promise<void>;
  deleteJob: (jobId: string) => Promise<void>;
  fetchJobs: () => void;
}

const JobContext = createContext<JobContextType | null>(null);

export const JobProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const fetchJobs = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const { data } = await api.get('/jobs');
      setJobs(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not fetch job applications.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, toast]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const addJob = async (jobData: Omit<Job, '_id' | 'source'>) => {
    try {
      const { data: newJob } = await api.post('/jobs', jobData);
      setJobs(prevJobs => [newJob, ...prevJobs]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add job application.",
        variant: "destructive",
      });
      throw error; // Re-throw error to be caught in the component
    }
  };

  const updateJob = async (jobId: string, jobData: Partial<Job>) => {
    try {
      const { data: updatedJob } = await api.put(`/jobs/${jobId}`, jobData);
      setJobs(prevJobs => prevJobs.map(job => (job._id === jobId ? updatedJob : job)));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update job application.",
        variant: "destructive",
      });
      throw error;
    }
  };
  
  const deleteJob = async (jobId: string) => {
     try {
      await api.delete(`/jobs/${jobId}`);
      setJobs(prevJobs => prevJobs.filter(job => job._id !== jobId));
       toast({
        title: "Job Deleted",
        description: "The job application has been removed.",
      });
    } catch (error) {
       toast({
        title: "Error",
        description: "Failed to delete job application.",
        variant: "destructive",
      });
      throw error;
    }
  };

  return (
    <JobContext.Provider value={{ jobs, loading, addJob, updateJob, deleteJob, fetchJobs }}>
      {children}
    </JobContext.Provider>
  );
};

// Custom hook to use the JobContext
export const useJobs = () => {
  const context = useContext(JobContext);
  if (!context) {
    throw new Error('useJobs must be used within a JobProvider');
  }
  return context;
};
