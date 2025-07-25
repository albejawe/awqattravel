import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const {
    language,
    toggleLanguage
  } = useLanguage();
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
          {/* Language Toggle */}
          
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <img src="/lovable-uploads/1ed71778-e792-40a8-8405-33112955d820.png" alt="شركة أوقات للسياحة والسفر" className="h-12 w-auto" />
            <span className="text-primary-dark font-bold text-sm font-arabic">
              شركة أوقات للسياحة والسفر
            </span>
          </div>
          
          {/* Spacer */}
          <div className="w-16"></div>
        </div>
      </div>
    </header>;
};
export default Header;