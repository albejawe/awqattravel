import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const {
    language,
    toggleLanguage
  } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-md shadow-elegant' : 'bg-white'}`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Empty left side */}
          <div className="flex items-center gap-4">
          </div>
          
          {/* Center spacer */}
          <div className="flex-1"></div>
          
          {/* Logo - moved to right */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <span className="text-primary-dark font-bold text-lg font-arabic">
              شركة أوقات للسياحة والسفر
            </span>
            <img src="/lovable-uploads/1ed71778-e792-40a8-8405-33112955d820.png" alt="شركة أوقات للسياحة والسفر" className="h-14 w-auto" />
          </div>
        </div>
      </div>
    </header>;
};
export default Header;