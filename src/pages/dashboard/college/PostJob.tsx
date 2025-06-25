import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  CheckCircle,
  Users,
  Briefcase,
  X,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from "@/components/Footer";
import EmployerHeader from "@/components/EmployerHeader";
import { useGetMyJobsQuery } from "@/features/api/employerJobApiService";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface PostedJob {
  _id: string;
  title: string;
  location: string;
  schoolName: string;
  status: "pending" | "approved" | "rejected";
  jobType: string;
  description: string;
  experienceLevel: string;
  yearsOfExperience: number;
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pending":
      return <Badge variant="secondary">Pending Review</Badge>;
    case "approved":
      return <Badge className="bg-green-600 text-white">Approved</Badge>;
    case "rejected":
      return <Badge variant="destructive">Rejected</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

const JobPostModal = ({ onClose }: { onClose: () => void }) => {
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Job submitted successfully! (This is a demo)");
    onClose();
  };

  const handleModalContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={handleModalContentClick}
      >
        <div className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold">Post a New Job</h2>
              <p className="text-sm text-gray-500">
                Fill out the details below to find your next great hire.
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-800"
            >
              <X size={24} />
            </button>
          </div>
          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div>
              <label htmlFor="jobTitle" className="font-medium">
                Job Title
              </label>
              <input
                type="text"
                id="jobTitle"
                name="jobTitle"
                required
                className="w-full mt-1 px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label htmlFor="location" className="font-medium">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                required
                className="w-full mt-1 px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label htmlFor="jobType" className="font-medium">
                Job Type
              </label>
              <select
                id="jobType"
                name="jobType"
                required
                className="w-full mt-1 px-3 py-2 border rounded-md"
              >
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Temporary</option>
              </select>
            </div>
            <div>
              <label htmlFor="description" className="font-medium">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={6}
                required
                className="w-full mt-1 px-3 py-2 border rounded-md"
              />
            </div>
            <div className="flex justify-end gap-4 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Post Job</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const JobDetailModal = ({
  job,
  onClose,
}: {
  job: PostedJob | null;
  onClose: () => void;
}) => {
  if (!job) return null;

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{job.title}</DialogTitle>
          <DialogDescription>
            {job.schoolName} • {job.location}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6">
          <div className="flex gap-2 flex-wrap">
            <Badge variant="outline">{job.jobType}</Badge>
            <Badge variant="outline">{job.experienceLevel}</Badge>
            <Badge variant="outline">
              {job.yearsOfExperience} years experience
            </Badge>
          </div>
          <div>
            <h4 className="font-semibold">Job Description</h4>
            <p className="text-sm text-gray-700 whitespace-pre-wrap">
              {job.description}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const PostedJobsSection = () => {
  const { data: jobs = [], isLoading, isError } = useGetMyJobsQuery();
  const [selectedJob, setSelectedJob] = useState<PostedJob | null>(null);

  const renderContent = () => {
    if (isLoading)
      return (
        <div className="flex justify-center items-center p-20">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      );
    if (isError)
      return (
        <div className="p-12 text-center bg-red-50 border rounded-lg">
          <AlertTriangle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-700">
            Error loading jobs
          </h3>
        </div>
      );
    if (jobs.length === 0)
      return (
        <div className="p-16 text-center border-2 border-dashed rounded-lg">
          <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold">No Jobs Posted Yet</h3>
        </div>
      );

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jobs.map((job) => (
          <Card key={job._id}>
            <CardHeader>
              <CardTitle className="text-lg">{job.title}</CardTitle>
              <CardDescription>
                {job.schoolName} • {job.location}
              </CardDescription>
              <div className="mt-2">{getStatusBadge(job.status)}</div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 line-clamp-3">
                {job.description}
              </p>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setSelectedJob(job)}
              >
                View Details
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold">Your Posted Jobs</h2>
          <p className="text-gray-600">All jobs you’ve created appear below</p>
        </div>
        {renderContent()}
      </div>
      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
        />
      )}
    </section>
  );
};

const PostJob = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <EmployerHeader />

      {/* HERO SECTION - Corrected to match the image */}
      <section className="py-20 sm:py-24 lg:py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 grid lg:grid-cols-2 gap-10 items-center">
          {/* Left Column */}
          <div>
            <h1 className="text-4xl font-extrabold text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.3)] mb-4">
              Let's hire your next great teacher. Fast.
            </h1>
            <p className="text-lg text-white [text-shadow:0_1px_3px_rgba(0,0,0,0.2)] mb-6">
              No matter the skills, experience, or qualifications, you'll find
              the right people on TeacherConnect.
            </p>
            <Button
              onClick={() => setIsFormOpen(true)}
              size="lg"
              className="bg-white text-gray-800 hover:bg-gray-100 shadow-sm border"
            >
              Post a Job for Free
            </Button>
            <div className="mt-6 space-y-2 text-gray-600">
              <div className="flex items-center gap-2">
                <CheckCircle className="text-green-500" />
                <span>10,000+ Active Teachers</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="text-green-500" />
                <span>Fast & Easy Posting</span>
              </div>
            </div>
          </div>

          {/* Right Column - Corrected to match the image */}
          <div className="hidden lg:flex justify-center">
            <div className="bg-white rounded-xl shadow-lg p-4 w-full max-w-xs">
              <p className="text-gray-700 font-medium">
                Connect with qualified educators.
              </p>
              <div className="mt-3 border-t pt-3">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                  <span>Verified Review</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PostedJobsSection />

      {isFormOpen && <JobPostModal onClose={() => setIsFormOpen(false)} />}
      <Footer />
    </div>
  );
};

export default PostJob;
