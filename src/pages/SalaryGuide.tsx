import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Briefcase, ArrowRight, Wallet, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import img9 from "@/assets/img9.avif"; // Assuming this is used somewhere in the code

// --- TYPE DEFINITIONS ---
interface Career {
  _id: string;
  jobTitle: string;
  category: string;
  averageSalary: number;
}
type ButtonProps = React.ComponentProps<"button">;
type InputProps = React.ComponentProps<"input">;

// --- IN-FILE PLACEHOLDER COMPONENTS ---
const Button: React.FC<ButtonProps> = ({ children, className, ...props }) => (
  <button
    className={`inline-flex items-center justify-center rounded-full font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${className}`}
    {...props}
  >
    {children}
  </button>
);

const Input: React.FC<InputProps> = ({ className, ...props }) => (
  <input
    className={`block w-full rounded-full border-gray-300 shadow-sm focus:border-primary focus:ring-primary ${className}`}
    {...props}
  />
);

// --- MAIN PAGE COMPONENT ---
const categoryThemes: {
  [key: string]: { color: string; iconBg: string; border: string };
} = {
  Technology: {
    color: "primary",
    iconBg: "bg-primary/10",
    border: "border-primary",
  },
  Teacher: {
    color: "success",
    iconBg: "bg-success/10",
    border: "border-success",
  },
  Academics: {
    color: "primary-text",
    iconBg: "bg-primary-text/10",
    border: "border-primary-text",
  },
  Default: {
    color: "primary-text",
    iconBg: "bg-primary-text/10",
    border: "border-primary-text",
  },
};

const SalaryGraph: React.FC<{ colorClass?: string }> = ({
  colorClass = "bg-primary/60",
}) => (
  <div className="flex items-end gap-1 h-10">
    <div className={`w-3 h-3 rounded-t-sm ${colorClass} opacity-40`}></div>
    <div className={`w-3 h-8 rounded-t-sm ${colorClass} opacity-80`}></div>
    <div className={`w-3 h-6 rounded-t-sm ${colorClass} opacity-60`}></div>
    <div className={`w-3 h-10 rounded-t-sm ${colorClass}`}></div>
  </div>
);

const SkeletonCard: React.FC = () => (
  <div className="bg-background p-6 rounded-2xl border border-gray-200 animate-pulse">
    <div className="flex items-center gap-4 mb-4">
      <div className="w-12 h-12 bg-subtle-bg rounded-lg"></div>
      <div className="flex-1 space-y-2">
        <div className="h-5 w-3/4 bg-subtle-bg rounded"></div>
        <div className="h-4 w-1/2 bg-subtle-bg rounded"></div>
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-4 w-1/3 bg-subtle-bg rounded"></div>
      <div className="h-8 w-1/2 bg-subtle-bg rounded-lg"></div>
    </div>
  </div>
);

const SalaryCard: React.FC<{ career: Career }> = ({ career }) => {
  const theme = categoryThemes[career.category] || categoryThemes.Default;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Link
        to={`/career/${career._id}/salaries`}
        className="group block h-full"
      >
        <div
          className={`bg-background rounded-2xl border border-gray-200 hover:shadow-lift hover:-translate-y-1.5 transition-all duration-300 h-full flex flex-col overflow-hidden shadow-card hover:border-${theme.color}`}
        >
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${theme.iconBg}`}>
                <Briefcase className={`w-6 h-6 text-${theme.color}`} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-primary-text group-hover:text-primary">
                  {career.jobTitle}
                </h3>
                <p className="text-sm text-secondary-text">{career.category}</p>
              </div>
            </div>
            <div className="flex items-end justify-between gap-4 mt-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-secondary-text">
                  Average Salary
                </p>
                <p className="text-2xl font-extrabold text-primary-text">
                  ₹{career.averageSalary.toLocaleString("en-IN")}
                </p>
              </div>
              <SalaryGraph colorClass={`bg-${theme.color}`} />
            </div>
          </div>
          <div
            className={`mt-auto border-t border-gray-200 p-4 bg-subtle-bg text-sm font-semibold text-center text-${theme.color} opacity-0 group-hover:opacity-100 transition-opacity`}
          >
            View Details <ArrowRight className="inline w-4 h-4" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const SalaryGuide: React.FC = () => {
  const mockCareers: Career[] = [
    {
      _id: "1",
      jobTitle: "Mathematics Teacher",
      category: "Teacher",
      averageSalary: 799998,
    },
    {
      _id: "2",
      jobTitle: "Software Developer",
      category: "Technology",
      averageSalary: 450000,
    },
    {
      _id: "3",
      jobTitle: "Hindi Teacher",
      category: "Teacher",
      averageSalary: 300000,
    },
    {
      _id: "4",
      jobTitle: "Science Teacher",
      category: "Teacher",
      averageSalary: 40000,
    },
    {
      _id: "5",
      jobTitle: "GK Teacher",
      category: "Teacher",
      averageSalary: 40000,
    },
    {
      _id: "6",
      jobTitle: "Academic Coordinator",
      category: "Academics",
      averageSalary: 550000,
    },
  ];
  const {
    data: careers = mockCareers,
    isLoading,
    isError,
  } = { data: mockCareers, isLoading: false, isError: false };

  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = useMemo(
    () => ["All", ...new Set(careers?.map((c) => c.category) || [])],
    [careers]
  );
  const filteredCareers = useMemo(() => {
    if (activeCategory === "All") return careers;
    return careers?.filter((c) => c.category === activeCategory);
  }, [careers, activeCategory]);

  return (
    <div className="bg-background text-primary-text min-h-screen flex flex-col font-sans">
      <Header />
      <main className="flex-grow">
        <div className="relative text-white overflow-hidden">
          <img
            src={img9}
            alt="Professional work environment"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/70 via-primary/60 to-[#ff8c5a]/70"></div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20 md:py-28"
          >
            <div className="inline-block p-4 bg-white/10 backdrop-blur-sm rounded-2xl mb-6 border border-white/20">
              <Wallet className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
              Discover Your Earning Potential
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto">
              Compare salaries for thousands of jobs and take the next step in
              your career.
            </p>
            <form className="mt-10 max-w-xl mx-auto">
              <div className="relative">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/50 w-5 h-5" />
                <Input
                  placeholder="Search job title or category..."
                  className="h-14 pl-14 pr-32 text-md bg-white/10 text-white placeholder:text-white/60 rounded-full border-2 border-white/20 focus:ring-2 focus:ring-white/50"
                />
                <Button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-11 px-6 bg-white text-primary hover:bg-subtle-bg"
                >
                  Search
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-primary-text tracking-tight">
              Popular Job Profiles
            </h2>
            <p className="text-md text-secondary-text mt-2">
              Browse average salaries by job role in your industry.
            </p>
          </div>
          <div className="flex justify-center flex-wrap gap-3 mb-12">
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-5 py-2 transition-all duration-300 ${activeCategory === category ? "bg-primary text-white shadow-lift" : "bg-subtle-bg text-secondary-text hover:bg-gray-200"}`}
              >
                {category}
              </Button>
            ))}
          </div>
          {isError && (
            <div className="text-center p-8 bg-error/10 rounded-lg text-error">
              Failed to load salary data.
            </div>
          )}
          <AnimatePresence>
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {isLoading &&
                Array.from({ length: 6 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              {filteredCareers &&
                filteredCareers.map((career) => (
                  <SalaryCard key={career._id} career={career} />
                ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default SalaryGuide;
