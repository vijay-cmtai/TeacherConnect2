import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Search,
  Star,
  Megaphone,
  Loader2,
  X,
  Building,
  Calendar,
  ThumbsUp,
  MessageSquare,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import img8 from "@/assets/img8.avif"; // Placeholder image for the header

// --- PLACEHOLDER COMPONENTS (Included for a single-file solution) ---

const Button: React.FC<React.ComponentProps<"button">> = ({
  children,
  className,
  ...props
}) => (
  <button
    className={`inline-flex items-center justify-center rounded-full font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${className}`}
    {...props}
  >
    {children}
  </button>
);
const Input: React.FC<React.ComponentProps<"input">> = ({
  className,
  ...props
}) => (
  <input
    className={`block w-full rounded-full border-gray-300 shadow-sm focus:border-primary focus:ring-primary ${className}`}
    {...props}
  />
);
const Card: React.FC<{ className?: string; children: React.ReactNode }> = ({
  className,
  children,
}) => <div className={className}>{children}</div>;
const CardContent: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className, children }) => <div className={className}>{children}</div>;
const CardHeader: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className, children }) => <div className={className}>{children}</div>;
const CardTitle: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className, children }) => (
  <h3 className={`font-bold ${className}`}>{children}</h3>
);

// --- TYPE DEFINITIONS ---
interface Company {
  _id: string;
  name: string;
  logo?: { url: string };
  averageRating: number;
  reviewCount: number;
}
interface Review {
  id: number;
  author: string;
  rating: number;
  title: string;
  content: string;
  date: string;
  likes: number;
  pros: string;
  cons: string;
}
interface CompanyWithDetails extends Company {
  reviews: Review[];
}

// --- Star Rendering Helper ---
const renderStars = (rating: number, size = "w-4 h-4") => (
  <div className="flex items-center">
    {[...Array(5)].map((_, index) => (
      <Star
        key={index}
        className={`${size} ${index < rating ? "text-amber-400 fill-amber-400" : "text-slate-300"}`}
      />
    ))}
  </div>
);

// =========================================================================
// --- [NEW] COMPANY DETAILS MODAL COMPONENT ---
// =========================================================================
const CompanyDetailsModal: React.FC<{
  company: CompanyWithDetails;
  onClose: () => void;
}> = ({ company, onClose }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="relative bg-subtle-bg rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-background/50 hover:bg-background/80 transition-colors z-10"
        >
          <X className="w-5 h-5 text-primary-text" />
        </button>

        {/* --- Modal Header --- */}
        <div className="relative bg-primary-text text-white p-8">
          <img
            src={img8}
            alt="Office"
            className="absolute inset-0 w-full h-full object-cover opacity-10"
          />
          <div className="relative flex flex-col md:flex-row items-center gap-6">
            <img
              src={
                company.logo?.url ||
                `https://ui-avatars.com/api/?name=${company.name.charAt(0)}&background=FF6B2C&color=FFFFFF`
              }
              alt={`${company.name} logo`}
              className="w-24 h-24 rounded-2xl border-4 border-white/20 bg-white object-contain"
            />
            <div>
              <h1 className="text-3xl font-extrabold text-white">
                {company.name}
              </h1>
              <div className="flex items-center gap-3 mt-2">
                {renderStars(company.averageRating, "w-5 h-5")}
                <span className="text-xl font-bold text-white">
                  {company.averageRating.toFixed(1)}
                </span>
                <span className="text-white/70">
                  ({company.reviewCount} Reviews)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* --- Modal Content (Reviews) --- */}
        <div className="p-8">
          <h2 className="text-2xl font-bold text-primary-text mb-6">Reviews</h2>
          <div className="space-y-6">
            {company.reviews.map((review) => (
              <Card
                key={review.id}
                className="bg-background border border-gray-200 shadow-sm"
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg text-primary-text">
                        {review.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1 text-sm text-secondary-text">
                        <Building className="w-4 h-4" />
                        <span>{review.author}</span>
                        <span className="text-gray-400">|</span>
                        <Calendar className="w-4 h-4" />
                        <span>{review.date}</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {renderStars(review.rating)}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-secondary-text leading-relaxed mb-4">
                    {review.content}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="p-3 bg-success/10 rounded-lg">
                      <h5 className="font-medium text-success mb-2">Pros</h5>
                      <p className="text-sm text-primary-text">{review.pros}</p>
                    </div>
                    <div className="p-3 bg-error/10 rounded-lg">
                      <h5 className="font-medium text-error mb-2">Cons</h5>
                      <p className="text-sm text-primary-text">{review.cons}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200 flex items-center gap-4">
                    <button className="flex items-center gap-1.5 text-sm text-secondary-text hover:text-primary">
                      <ThumbsUp className="w-4 h-4" />
                      Helpful ({review.likes})
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// --- MAIN PAGE COMPONENT ---
const CompanyReviews = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredStars, setHoveredStars] = useState(0);
  const [selectedCompany, setSelectedCompany] =
    useState<CompanyWithDetails | null>(null);

  const mockCompanies: Company[] = [
    {
      _id: "1",
      name: "Delhi Public School, R.K. Puram",
      logo: { url: "" },
      averageRating: 4.5,
      reviewCount: 128,
    },
    {
      _id: "2",
      name: "Kendriya Vidyalaya, Sector 8",
      logo: { url: "" },
      averageRating: 4.2,
      reviewCount: 97,
    },
    {
      _id: "3",
      name: "Ryan International School",
      logo: { url: "" },
      averageRating: 3.8,
      reviewCount: 75,
    },
    {
      _id: "4",
      name: "Modern School, Barakhamba Road",
      logo: { url: "" },
      averageRating: 4.8,
      reviewCount: 150,
    },
  ];
  const {
    data: allPopularCompanies = mockCompanies,
    isLoading,
    isError,
  } = { data: mockCompanies, isLoading: false, isError: false };

  const handleCardClick = (company: Company) => {
    // In a real app, you would fetch the full details and reviews for this company
    // For this demo, we'll use mock reviews
    const mockReviews: Review[] = [
      {
        id: 1,
        author: "Former Teacher",
        rating: 5,
        title: "Excellent work environment",
        content: "Management is very supportive.",
        date: "2024-03-15",
        likes: 25,
        pros: "Supportive admin",
        cons: "High workload",
      },
      {
        id: 2,
        author: "Current Teacher",
        rating: 4,
        title: "Good school, demanding",
        content: "Students are great, but the workload can be heavy.",
        date: "2024-02-20",
        likes: 18,
        pros: "Great students",
        cons: "Long hours",
      },
    ];
    setSelectedCompany({ ...company, reviews: mockReviews });
  };

  const filteredCompanies = useMemo(() => {
    if (!searchQuery) return allPopularCompanies;
    return allPopularCompanies.filter((c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allPopularCompanies, searchQuery]);

  const renderInteractiveStars = () => (
    <div
      className="flex items-center space-x-1"
      onMouseLeave={() => setHoveredStars(0)}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <Link
          key={star}
          to={`/review/new?stars=${star}`}
          onMouseEnter={() => setHoveredStars(star)}
          className="p-1.5"
        >
          <Star
            className={`w-8 h-8 transition-colors ${star <= hoveredStars ? "text-amber-400 fill-amber-400" : "text-white/40"}`}
          />
        </Link>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-subtle-bg font-sans text-primary-text">
      <Header />
      <main>
        <div className="relative bg-primary-text overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=2070&auto=format&fit=crop"
            alt="People working"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/70 to-primary/80"></div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative max-w-screen-lg mx-auto px-4 py-20 lg:py-28"
          >
            <div className="w-full lg:w-4/5 mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-extrabold text-white">
                Find Great Places to Work
              </h1>
              <p className="mt-4 text-lg text-white/80 max-w-2xl mx-auto">
                Get insider access to company reviews from teachers like you.
              </p>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="mt-10 max-w-xl mx-auto"
              >
                <div className="relative">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/60 w-5 h-5" />
                  <Input
                    id="company-search"
                    type="text"
                    placeholder="School name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-16 pl-14 pr-40 bg-white/10 text-white placeholder:text-white/70 border-2 border-white/20 rounded-full"
                  />
                  <Button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-12 px-6 bg-white text-primary"
                  >
                    Find Schools
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>

        <div className="bg-subtle-bg py-16 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8">
                <h2 className="text-3xl font-bold text-primary-text mb-8">
                  Popular Schools & Institutions
                </h2>
                {isLoading && (
                  <div className="flex justify-center p-12">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                )}
                {isError && (
                  <p className="text-center text-error">
                    Failed to load schools.
                  </p>
                )}
                {!isLoading && !isError && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredCompanies.map((company) => (
                      <div
                        key={company._id}
                        className="group block cursor-pointer"
                        onClick={() => handleCardClick(company)}
                      >
                        <Card className="bg-background rounded-xl border border-gray-200 group-hover:shadow-lift group-hover:-translate-y-1 transition-all duration-300 h-full">
                          <CardContent className="p-6 flex flex-col h-full">
                            <div className="flex-grow">
                              <div className="flex items-start space-x-4">
                                <img
                                  src={
                                    company.logo?.url ||
                                    `https://ui-avatars.com/api/?name=${company.name.charAt(0)}&background=random`
                                  }
                                  alt={`${company.name} logo`}
                                  className="w-16 h-16 rounded-lg border border-gray-200 object-contain"
                                />
                                <div className="flex-1">
                                  <h3 className="text-lg font-bold text-primary-text group-hover:text-primary transition-colors leading-tight">
                                    {company.name}
                                  </h3>
                                  <div className="flex items-center gap-2 mt-1.5">
                                    {company.reviewCount > 0 ? (
                                      <>
                                        <span className="text-sm font-bold text-primary-text">
                                          {company.averageRating.toFixed(1)}
                                        </span>
                                        {renderStars(company.averageRating)}
                                        <span className="text-sm text-secondary-text ml-1">
                                          ({company.reviewCount})
                                        </span>
                                      </>
                                    ) : (
                                      <span className="text-sm text-secondary-text">
                                        No reviews yet
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="mt-6 pt-5 border-t border-gray-200 flex items-center justify-between text-sm font-medium">
                              <span className="text-primary group-hover:underline">
                                Read Reviews
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <aside className="lg:col-span-4 lg:sticky lg:top-24 h-fit">
                <Card className="rounded-2xl shadow-xl text-white bg-gradient-to-br from-primary to-[#ff8c5a]">
                  <CardContent className="p-8">
                    <div className="flex flex-col items-center text-center">
                      <div className="p-3 bg-white/10 rounded-full mb-4">
                        <Megaphone className="w-7 h-7 text-white" />
                      </div>
                      <h3 className="text-xl font-bold mb-1">
                        Do you work at a school?
                      </h3>
                      <p className="text-white/80 mb-6">
                        Help others find their dream job. Rate your institution.
                      </p>
                      {renderInteractiveStars()}
                    </div>
                  </CardContent>
                </Card>
              </aside>
            </div>
          </div>
        </div>
      </main>
      <Footer />

      {/* --- [NEW] This will render the modal when a company is selected --- */}
      <AnimatePresence>
        {selectedCompany && (
          <CompanyDetailsModal
            company={selectedCompany}
            onClose={() => setSelectedCompany(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default CompanyReviews;
