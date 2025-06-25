// file: src/components/CollegeDashboard.js (NAYA AUR BEHTAR CODE)

import React, { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/app/hooks";
import { selectCurrentUser, logOut } from "@/features/auth/authSlice";

// [NEW] Naye imports
import { useLogoutMutation } from "@/features/auth/authApiService";
import { apiService } from "@/features/api/apiService";
import toast from "react-hot-toast";

import {
  GraduationCap,
  PlusCircle,
  ClipboardList,
  FileText,
  UserCheck,
  FileCheck,
  Settings,
  Home,
  Menu,
  X,
  LogOut as LogOutIcon, // Icon ka naam badal diya taaki 'logOut' action se conflict na ho
} from "lucide-react";
import { Button } from "@/components/ui/button";

const CollegeDashboard = () => {
  const user = useAppSelector(selectCurrentUser);
  const location = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // [NEW] Logout mutation hook ko initialize karein
  const [logoutUser] = useLogoutMutation();

  const menuItems = [
    {
      path: "/dashboard/college/profile",
      label: "Profile",
      icon: GraduationCap,
    },
    {
      path: "/dashboard/college/post-job",
      label: "Post New Job",
      icon: PlusCircle,
    },
    {
      path: "/dashboard/college/posts",
      label: "Manage Posts",
      icon: ClipboardList,
    },
    {
      path: "/dashboard/college/applications",
      label: "Applications",
      icon: FileText,
    },
    {
      path: "/dashboard/college/shortlist",
      label: "Shortlist Candidates",
      icon: UserCheck,
    },
    {
      path: "/dashboard/college/offer-letter",
      label: "Offer Letters",
      icon: FileCheck,
    },
    { path: "/dashboard/college/settings", label: "Settings", icon: Settings },
  ];

  const handleLinkClick = () => {
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
    }
  };

  // [NEW] Naya aur behtar logout function
  const handleSignOut = async () => {
    const loadingToast = toast.loading("Signing out..."); // Loading message dikhayein
    try {
      // 1. Backend API ko call karein logout ke liye
      await logoutUser({}).unwrap();

      // 2. Redux auth state ko clear karein
      dispatch(logOut());

      // 3. RTK Query ke poore cache ko reset karein (ye bahut zaroori hai)
      dispatch(apiService.util.resetApiState());

      // 4. Success message dikhayein
      toast.success("Signed out successfully.", { id: loadingToast });

      // 5. User ko login page par bhej dein
      navigate("/login");
    } catch (error) {
      // Agar koi error aaye to message dikhayein
      toast.error("Failed to sign out. Please try again.", {
        id: loadingToast,
      });
      console.error("Failed to logout:", error);
    }
  };

  return (
    <div className="h-screen bg-subtle-bg flex overflow-hidden">
      {/* --- SIDEBAR --- */}
      <div
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-background border-r border-gray-200 flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:relative md:translate-x-0
        `}
      >
        <div className="p-6 flex-grow flex flex-col overflow-y-hidden">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="font-semibold text-primary-text">
                  College Dashboard
                </h2>
                <p
                  className="text-sm text-secondary-text truncate"
                  title={user?.email}
                >
                  {user?.email}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 overflow-y-auto">
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="w-full justify-start"
            >
              <Link to="/" onClick={handleLinkClick}>
                <Home className="w-4 h-4 mr-3" />
                Back to Home
              </Link>
            </Button>
            {menuItems.map((item) => (
              <Button
                key={item.path}
                variant={
                  location.pathname.startsWith(item.path) ? "default" : "ghost"
                }
                size="sm"
                asChild
                className="w-full justify-start"
              >
                <Link to={item.path} onClick={handleLinkClick}>
                  <item.icon className="w-4 h-4 mr-3" />
                  {item.label}
                </Link>
              </Button>
            ))}
          </nav>

          {/* Sign Out Button at the bottom */}
          <div className="mt-auto pt-6 border-t border-gray-200">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-500 hover:bg-red-500/10 hover:text-red-600"
              onClick={handleSignOut} // [NEW] Naye function ko yahan call karein
            >
              <LogOutIcon className="w-4 h-4 mr-3" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* --- MAIN CONTENT --- */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="md:hidden bg-background border-b border-gray-200 p-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </Button>
          <h1 className="text-lg font-semibold">College Dashboard</h1>
          <div className="w-8"></div>
        </header>

        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default CollegeDashboard;
