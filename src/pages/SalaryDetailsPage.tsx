import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Briefcase,
  Settings,
  DollarSign,
  BrainCircuit,
  Search,
  TrendingUp,
  Sun,
} from "lucide-react";
import { motion } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// --- TYPE DEFINITIONS ---
interface CareerDetails {
  _id: string;
  category: string;
  jobTitle: string;
  averageSalary: number;
  salaryRange: { min: number; max: number };
  jobDescription: string;
  commonSkills: string[];
  relatedProfiles: { _id: string; jobTitle: string }[];
}
type ButtonProps = React.ComponentProps<"button"> & { asChild?: boolean };

// --- IN-FILE PLACEHOLDER COMPONENTS ---
const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => (
  <button
    className={`inline-flex items-center justify-center rounded-full font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Card: React.FC<{ className?: string; children: React.ReactNode }> = ({
  className,
  children,
}) => <div className={className}>{children}</div>;
const CardHeader: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className, children }) => <div className={className}>{children}</div>;
const CardTitle: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className, children }) => <h3 className={className}>{children}</h3>;
const CardContent: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className, children }) => <div className={className}>{children}</div>;

// --- REUSABLE UI COMPONENTS (Redesigned) ---
const IconWrapper: React.FC<{
  children: React.ReactNode;
  className: string;
}> = ({ children, className }) => (
  <div
    className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg ${className}`}
  >
    {children}
  </div>
);

const InfoCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}> = ({ icon, title, children }) => (
  <Card className="bg-background rounded-2xl border border-gray-200 shadow-card">
    <CardHeader className="flex flex-row items-center gap-4 space-y-0 p-6">
      {icon}
      <CardTitle className="font-bold text-primary-text">{title}</CardTitle>
    </CardHeader>
    <CardContent className="p-6 pt-0">{children}</CardContent>
  </Card>
);

const SalaryBar: React.FC<{ low: number; high: number; avg: number }> = ({
  low,
  high,
  avg,
}) => {
  const percentage = high > low ? ((avg - low) / (high - low)) * 100 : 50;
  const formatCurrency = (value: number) => `₹${(value / 100000).toFixed(1)}L`;
  return (
    <div className="w-full">
      <div className="relative h-2.5 bg-gray-200 rounded-full">
        <div
          className="absolute h-full rounded-full bg-primary"
          style={{ width: `${percentage}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 h-5 w-5 bg-white rounded-full border-4 border-primary ring-2 ring-white"
          style={{ left: `calc(${percentage}% - 10px)` }}
        />
      </div>
      <div className="flex justify-between mt-3 text-sm font-medium text-secondary-text">
        <span>{formatCurrency(low)}</span>
        <span className="font-bold text-primary-text">
          {formatCurrency(avg)}
        </span>
        <span>{formatCurrency(high)}</span>
      </div>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---
const SalaryDetailsPage = () => {
  const { careerPath: id } = useParams<{ careerPath: string }>();

  // Using Mock Data as the query hook is not available. Replace with your actual hook.
  const mockJobData: CareerDetails = {
    _id: "1",
    category: "Technology",
    jobTitle: "Software Developer",
    averageSalary: 1200000,
    salaryRange: { min: 800000, max: 2000000 },
    jobDescription:
      "A Software Developer is responsible for designing, developing, and maintaining software systems. This includes writing clean, scalable code, debugging issues, and collaborating with cross-functional teams to produce high-quality software solutions.",
    commonSkills: [
      "JavaScript",
      "React",
      "Node.js",
      "TypeScript",
      "SQL",
      "Git",
    ],
    relatedProfiles: [
      { _id: "2", jobTitle: "Frontend Developer" },
      { _id: "3", jobTitle: "Backend Developer" },
    ],
  };
  const {
    data: jobData = mockJobData,
    isLoading,
    isError,
  } = { data: mockJobData, isLoading: false, isError: false }; // Replace with your actual RTK Query hook: useGetSalaryGuideByIdQuery(id!, { skip: !id });

  if (isLoading || isError) {
    const message = isLoading ? "Loading Job Details..." : "Details Not Found";
    return (
      <div className="bg-background min-h-screen flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center text-center px-4">
          <div>
            <p
              className={`text-xl text-secondary-text ${isLoading && "animate-pulse"}`}
            >
              {message}
            </p>
            {isError && (
              <Button asChild className="mt-6 bg-primary text-white">
                <Link to="/salary-guide">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Salary Guide
                </Link>
              </Button>
            )}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-subtle-bg text-primary-text min-h-screen font-sans">
      <Header />
      <main>
        <div className="relative text-white overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2232&auto=format&fit=crop"
            alt="Salary Details Background"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/70 to-[#ff8c5a]/80"></div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
          >
            <div className="mb-8">
              <Link
                to="/salary-guide"
                className="inline-flex items-center gap-2 text-white/90 hover:text-white font-semibold transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Salary Guide
              </Link>
            </div>
            <div className="text-center">
              <p className="font-semibold text-white/90 mb-2">
                {jobData.category}
              </p>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
                {jobData.jobTitle}
              </h1>
              <p className="text-lg text-white/80 mt-3">
                Average Salary in India
              </p>
              <p className="text-5xl font-bold text-white mt-2">
                ₹{jobData.averageSalary.toLocaleString("en-IN")}
                <span className="text-xl font-normal text-white/70">
                  {" "}
                  /year
                </span>
              </p>
            </div>
          </motion.div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <InfoCard
                icon={
                  <IconWrapper className="bg-primary/10">
                    <DollarSign className="text-primary" />
                  </IconWrapper>
                }
                title="Salary Range"
              >
                <p className="text-secondary-text mb-6 text-sm">
                  Salaries for a {jobData.jobTitle} can range from ~₹
                  {jobData.salaryRange.min.toLocaleString("en-IN")} to ~₹
                  {jobData.salaryRange.max.toLocaleString("en-IN")} per year.
                </p>
                <SalaryBar
                  low={jobData.salaryRange.min}
                  high={jobData.salaryRange.max}
                  avg={jobData.averageSalary}
                />
              </InfoCard>
              <InfoCard
                icon={
                  <IconWrapper className="bg-primary/10">
                    <Briefcase className="text-primary" />
                  </IconWrapper>
                }
                title="Job Description"
              >
                <p className="text-secondary-text leading-relaxed text-sm">
                  {jobData.jobDescription}
                </p>
              </InfoCard>
              <InfoCard
                icon={
                  <IconWrapper className="bg-success/10">
                    <BrainCircuit className="text-success" />
                  </IconWrapper>
                }
                title="Common Skills"
              >
                <div className="flex flex-wrap gap-2">
                  {jobData.commonSkills.length > 0 ? (
                    jobData.commonSkills.map((skill) => (
                      <span
                        key={skill}
                        className="bg-success/10 text-success text-xs font-semibold px-3 py-1.5 rounded-full"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-secondary-text text-sm">
                      No specific skills listed.
                    </p>
                  )}
                </div>
              </InfoCard>
              <InfoCard
                icon={
                  <IconWrapper className="bg-warning/10">
                    <TrendingUp className="text-warning" />
                  </IconWrapper>
                }
                title="Career Outlook"
              >
                <p className="text-secondary-text leading-relaxed text-sm">
                  The demand for skilled {jobData.jobTitle}s continues to grow,
                  with opportunities for advancement into senior roles.
                  Continuous learning and specialization are key to long-term
                  success.
                </p>
              </InfoCard>
            </div>
            <div className="lg:col-span-1 space-y-8">
              <div className="relative bg-gradient-to-br from-primary to-[#ff8c5a] p-6 rounded-2xl shadow-lift text-white">
                <div className="flex items-center gap-3 mb-3">
                  <IconWrapper className="bg-white/20">
                    <Search className="text-white" />
                  </IconWrapper>
                  <h3 className="text-xl font-bold">Find Your Next Job</h3>
                </div>
                <p className="text-white/80 mb-4 text-sm">
                  Ready to take the next step? Find open positions for{" "}
                  {jobData.jobTitle} roles.
                </p>
                <Button className="w-full bg-white hover:bg-subtle-bg text-primary font-bold">
                  Search {jobData.jobTitle} Jobs
                </Button>
              </div>
              {jobData.relatedProfiles.length > 0 && (
                <InfoCard
                  icon={
                    <IconWrapper className="bg-gray-200">
                      <Settings className="text-secondary-text" />
                    </IconWrapper>
                  }
                  title="Related Profiles"
                >
                  <ul className="space-y-3">
                    {jobData.relatedProfiles.map((job) => (
                      <li key={job._id}>
                        <Link
                          to={`/career/${job._id}/salaries`}
                          className="font-semibold text-primary-text hover:text-primary hover:underline"
                        >
                          {job.jobTitle}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </InfoCard>
              )}
              <InfoCard
                icon={
                  <IconWrapper className="bg-sky-100">
                    <Sun className="text-sky-600" />
                  </IconWrapper>
                }
                title="A Day in the Life"
              >
                <ul className="space-y-2 text-secondary-text list-disc list-inside text-sm">
                  <li>Collaborating with team on project planning.</li>
                  <li>Writing and testing code for new features.</li>
                  <li>Debugging and resolving technical issues.</li>
                  <li>Participating in code reviews for quality.</li>
                </ul>
              </InfoCard>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SalaryDetailsPage;
