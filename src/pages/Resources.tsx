// File: src/pages/ResourcesPage.tsx

import React, { useState, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowRight, Menu, X, BookOpen } from "lucide-react"; // I'll keep BookOpen as it fits well
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { useGetAllResourcesQuery } from "@/features/admin/adminApiService";
import { motion } from "framer-motion";
import img10 from "@/assets/img10.avif"; // Assuming this is used somewhere in the code
// [STEP 1] Define a TypeScript interface for the data coming from your backend
interface IResource {
  _id: string;
  category: string;
  title: string;
  content: string;
  imageUrl: string;
  readTime: number;
  isFeatured: boolean;
  createdAt: string;
}

// --- Reusable Components (with the fix applied) ---
const ResourcesNav = ({
  items,
  activeItem,
  onItemClick,
}: {
  items: string[];
  activeItem: string;
  onItemClick: (item: string) => void;
}) => {
  return (
    <div className="sticky top-16 z-40 bg-subtle-bg/90 backdrop-blur-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex items-center gap-2 sm:gap-4 overflow-x-auto h-14">
          {items.map((item) => (
            <button
              key={item}
              onClick={() => onItemClick(item)}
              className={`flex-shrink-0 px-3 py-2 text-sm font-semibold h-full flex items-center border-b-2 transition-all duration-200 ${activeItem === item ? "border-primary text-primary" : "border-transparent text-secondary-text hover:text-primary hover:border-primary/40"}`}
            >
              {item}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

// [FIXED] The structure of Button and Link is now correct
const FeaturedResourceCard = ({ resource }: { resource: any }) => (
  <div className="group block md:grid md:grid-cols-2 md:gap-12 items-center">
    <Link to={resource.path}>
      <div className="overflow-hidden rounded-2xl shadow-lift border border-gray-200 bg-subtle-bg">
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 min-h-[320px]"
          src={resource.imageUrl}
          alt={resource.title}
        />
      </div>
    </Link>
    <div className="mt-6 md:mt-0">
      <p className="text-sm font-bold text-primary uppercase tracking-wider">
        {resource.category}
      </p>
      <Link to={resource.path}>
        <h2 className="mt-3 text-3xl font-bold text-primary-text group-hover:text-primary transition-colors">
          {resource.title}
        </h2>
      </Link>
      <p className="mt-4 text-lg text-secondary-text leading-relaxed">
        {resource.description}
      </p>

      {/* The Link is now the direct child of the Button */}
      <Button
        asChild
        variant="link"
        className="p-0 h-auto text-primary font-semibold group mt-6 text-md"
      >
        <Link to={resource.path}>
          Read Article
          <ArrowRight className="inline-block w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
        </Link>
      </Button>
    </div>
  </div>
);

// [FIXED] The structure of Button and Link is now correct
const ResourceCard = ({ resource }: { resource: any }) => (
  <div className="group flex flex-col h-full bg-background rounded-2xl shadow-card overflow-hidden border border-gray-200 hover:shadow-lift hover:-translate-y-1.5 transition-all duration-300">
    <Link to={resource.path} className="block overflow-hidden relative h-48">
      <img
        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
        src={resource.imageUrl}
        alt={resource.title}
      />
    </Link>
    <div className="p-6 flex flex-col flex-grow">
      <p className="text-xs font-bold text-primary uppercase tracking-wider">
        {resource.category}
      </p>
      <Link to={resource.path}>
        <h3 className="mt-2 text-lg font-bold text-primary-text flex-grow group-hover:text-primary transition-colors">
          {resource.title}
        </h3>
      </Link>
      <div className="flex-grow"></div>
      <div className="mt-4 flex justify-between items-center">
        <span className="text-sm text-secondary-text">
          {resource.readTime} min read
        </span>
        {/* The Link is now the direct child of the Button */}
        <Button
          asChild
          variant="link"
          className="p-0 h-auto text-sm text-primary font-semibold"
        >
          <Link to={resource.path}>
            Read More
            <ArrowRight className="inline-block w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
          </Link>
        </Button>
      </div>
    </div>
  </div>
);

// --- Main Page Component ---
const ResourcesPage = () => {
  const { data: apiResources, isLoading, isError } = useGetAllResourcesQuery();

  const resources = useMemo(() => {
    if (!apiResources) return [];
    return apiResources.map((res: IResource) => ({
      id: res._id,
      category: res.category,
      title: res.title,
      description:
        res.content?.replace(/<[^>]*>?/gm, "").substring(0, 150) + "..." ||
        "No description available.",
      imageUrl: res.imageUrl,
      path: `/resources/${res._id}`,
      readTime: res.readTime,
    }));
  }, [apiResources]);

  const navItems = [
    "All Resources",
    ...new Set(resources.map((r) => r.category)),
  ];
  const [activeFilter, setActiveFilter] = useState(navItems[0]);

  const filteredResources = useMemo(() => {
    if (activeFilter === "All Resources") return resources;
    return resources.filter((resource) => resource.category === activeFilter);
  }, [activeFilter, resources]);

  const featuredArticle = filteredResources[0];
  const otherArticles = filteredResources.slice(1);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <h2 className="text-2xl font-semibold text-primary-text">
          Loading Resources...
        </h2>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen bg-background">
        <h2 className="text-2xl font-semibold text-error">
          Failed to load resources.
        </h2>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen font-sans">
      <Header />
      <ResourcesNav
        items={navItems}
        activeItem={activeFilter}
        onItemClick={setActiveFilter}
      />
      <main>
        <section className="relative text-white overflow-hidden">
          <img
            src={img10}
            alt="Resource Library Background"
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/70 to-[#ff8c5a]/80 z-10" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="relative z-30 max-w-4xl mx-auto text-center py-20 sm:py-24 px-4"
          >
            <div className="inline-block p-4 bg-white/10 backdrop-blur-sm rounded-2xl mb-6 border border-white/20">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white drop-shadow-lg">
              Employer Resource Library
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-white/90 drop-shadow">
              Hiring made simple. Learn more about tools, hiring with
              TeacherConnect, trends, and more. It’s all here in our resource
              center.
            </p>
          </motion.div>
        </section>

        <div className="max-w-7xl mx-auto py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
          {filteredResources.length > 0 ? (
            <div className="space-y-20">
              {featuredArticle && (
                <section>
                  <FeaturedResourceCard resource={featuredArticle} />
                </section>
              )}
              {otherArticles.length > 0 && (
                <section>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {otherArticles.map((resource) => (
                      <ResourceCard key={resource.id} resource={resource} />
                    ))}
                  </div>
                </section>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold text-primary-text">
                No Resources Found
              </h3>
              <p className="text-secondary-text mt-2">
                There are currently no articles in the "{activeFilter}"
                category.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ResourcesPage;
