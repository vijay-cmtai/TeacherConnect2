import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, FileText, Lock, Mail, ChevronRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// --- PLACEHOLDER COMPONENTS ---
// In a real app, these would be imported from their respective files.
// They are styled to match the theme of the provided code.

// Using a placeholder image URL for demonstration
const img9 =
  "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop";

// --- REUSABLE SECTION COMPONENT for policy content ---

const PolicySection: React.FC<{
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}> = ({ icon: Icon, title, children }) => (
  <section className="mb-12">
    <div className="flex items-center gap-4 mb-4">
      <div className="flex-shrink-0 p-3 bg-primary/10 rounded-lg">
        <Icon className="w-6 h-6 text-primary" />
      </div>
      <h2 className="text-2xl md:text-3xl font-bold text-primary-text tracking-tight">
        {title}
      </h2>
    </div>
    <div className="space-y-4 text-secondary-text leading-relaxed md:pl-16">
      {children}
    </div>
  </section>
);

// --- MAIN PRIVACY POLICY PAGE COMPONENT ---

const PrivacyPolicy = () => {
  return (
    <div className="bg-background text-primary-text min-h-screen flex flex-col font-sans">
      <Header />
      <main className="flex-grow">
        {/* --- Hero Section --- */}
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
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
              Privacy Policy
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto">
              Last Updated:{" "}
              {new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
              . Your privacy is our priority.
            </p>
          </motion.div>
        </div>

        {/* --- Policy Content Section --- */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
          <p className="text-lg text-secondary-text mb-16 text-center">
            Welcome to YourCompany's Privacy Policy. This policy explains how we
            collect, use, disclose, and safeguard your information when you
            visit our website. Please read this privacy policy carefully. If you
            do not agree with the terms of this privacy policy, please do not
            access the site.
          </p>

          <PolicySection icon={FileText} title="Information We Collect">
            <p>
              We may collect information about you in a variety of ways. The
              information we may collect on the Site includes:
            </p>
            <ul className="list-disc list-inside space-y-3">
              <li>
                <strong>Personal Data:</strong> Personally identifiable
                information, such as your name, email address, and telephone
                number, that you voluntarily give to us when you register with
                the Site or when you choose to participate in various activities
                related to the Site.
              </li>
              <li>
                <strong>Usage Data:</strong> Information our servers
                automatically collect when you access the Site, such as your IP
                address, browser type, operating system, and the pages you have
                viewed.
              </li>
            </ul>
          </PolicySection>

          <PolicySection icon={Lock} title="How We Use Your Information">
            <p>
              Having accurate information about you permits us to provide you
              with a smooth, efficient, and customized experience. Specifically,
              we may use information collected about you to:
            </p>
            <ul className="list-disc list-inside space-y-3">
              <li>Create and manage your account.</li>
              <li>
                Email you regarding your account or other relevant
                opportunities.
              </li>
              <li>
                Generate a personal profile to make future visits more
                personalized.
              </li>
              <li>
                Monitor and analyze usage and trends to improve your experience.
              </li>
            </ul>
          </PolicySection>

          <PolicySection
            icon={ChevronRight}
            title="Disclosure of Your Information"
          >
            <p>
              We may share information we have collected about you in certain
              situations. Your information may be disclosed as follows:
            </p>
            <ul className="list-disc list-inside space-y-3">
              <li>
                <strong>By Law or to Protect Rights:</strong> If we believe the
                release of information is necessary to respond to legal process,
                investigate potential violations of our policies, or protect the
                rights, property, and safety of others.
              </li>
              <li>
                <strong>Third-Party Service Providers:</strong> We may share
                your information with third parties that perform services for
                us, including data analysis, email delivery, and customer
                service.
              </li>
            </ul>
          </PolicySection>

          <PolicySection icon={Mail} title="Contact Us">
            <p>
              If you have questions or comments about this Privacy Policy,
              please do not hesitate to contact us.
            </p>
            <div className="mt-2">
              <a
                href="mailto:privacy@yourcompany.com"
                className="text-primary font-semibold hover:underline"
              >
                privacy@yourcompany.com
              </a>
            </div>
          </PolicySection>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrivacyPolicy;
