import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/app/hooks";
import { selectCurrentUser } from "@/features/auth/authSlice";
import NavigationMenu from "./header/NavigationMenu";
import HeaderActions from "./header/HeaderActions";
import MobileMenu from "./header/MobileMenu";
import logo from "@/assets/logo.png";

const Header = () => {
  const { t } = useTranslation();
  const user = useAppSelector(selectCurrentUser);

  return (
    <header className="sticky top-0 z-50 w-full bg-background border-b border-border shadow-sm">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 1. INCREASED HEADER HEIGHT FROM h-16 to h-20 */}
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex-shrink-0">
              {/* 2. INCREASED LOGO HEIGHT FROM h-12 to h-16 */}
              <img
                src={logo}
                alt="TeacherConnect Logo"
                className="h-[200px] w-auto" // Now larger
              />
            </Link>
            <NavigationMenu />
          </div>

          <HeaderActions user={user} />
          <MobileMenu user={user} />
        </div>
      </div>
    </header>
  );
};

export default Header;
