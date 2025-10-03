import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const Hero = () => {
  const { t, direction } = useLanguage();
  
  const scrollToOffers = () => {
    const offersSection = document.getElementById('offers');
    offersSection?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-elegant" dir={direction}>
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-gold opacity-10 blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-gradient-gold opacity-10 blur-3xl"></div>
      </div>
      
      <div className="container mx-auto px-4 text-center relative z-10 pt-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 font-arabic animate-fade-in">
            <span className="text-gold-gradient">{t('hero.title')}</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 font-arabic animate-slide-up" style={{ animationDelay: '0.2s' }}>
            {t('hero.subtitle')}
          </p>
          
          <div className="space-y-6">
            <Button 
              onClick={scrollToOffers}
              size="lg"
              className="btn-gold text-xl px-12 py-7 rounded-2xl font-arabic animate-bounce-in mx-auto shadow-elegant hover:shadow-glow transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
              style={{ animationDelay: '0.4s' }}
            >
              <span className="flex items-center gap-3">
                اكتشف عروضنا المميزة
                <ArrowDown className="h-6 w-6" />
              </span>
            </Button>
            
            <Button 
              onClick={() => window.location.href = '/visa-services'}
              size="lg"
              className="text-lg px-10 py-5 rounded-2xl font-arabic bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white shadow-2xl transition-all duration-300 transform hover:scale-105 animate-fade-in mx-auto flex items-center justify-center"
              style={{ animationDelay: '0.6s' }}
            >
              خدمات الفيزا من أوقات
            </Button>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gradient-gold rounded-full mt-2"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;