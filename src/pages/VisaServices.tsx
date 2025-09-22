import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VisaCards from "@/components/VisaCards";
import VisaForm from "@/components/VisaForm";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const VisaServices = () => {
  const { direction } = useLanguage();
  const [showForm, setShowForm] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");

  const handleFormOpen = (country = "") => {
    setSelectedCountry(country);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedCountry("");
  };

  return (
    <div className="min-h-screen" dir={direction}>
      <Header />
      
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary to-primary/80 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              خدمات الفيزا - شركة أوقات للسياحة والسفر
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold mb-8">
              أسرع طريقة للحصول على تأشيرة سفرك
            </h2>
            <Button 
              onClick={() => handleFormOpen()}
              size="lg"
              variant="secondary"
              className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-4"
            >
              احصل على تأشيرتك الآن
            </Button>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
            <div className="absolute top-20 -left-20 w-60 h-60 bg-white/5 rounded-full blur-2xl"></div>
            <div className="absolute bottom-10 right-1/4 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          </div>
        </section>

        {/* Visa Cards Section */}
        <section className="py-16 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">الوجهات المتاحة</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                اختر وجهتك المفضلة واحصل على تأشيرتك بأسرع وقت ممكن
              </p>
            </div>
            
            <VisaCards onCountrySelect={handleFormOpen} />
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">لماذا تختار خدماتنا؟</h2>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">سرعة في الإنجاز</h3>
                <p className="text-muted-foreground">نحرص على إنجاز معاملاتك في أسرع وقت ممكن</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">ضمان الجودة</h3>
                <p className="text-muted-foreground">فريق محترف ومتخصص في خدمات التأشيرات</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 109.75 9.75A9.75 9.75 0 0012 2.25z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">دعم مستمر</h3>
                <p className="text-muted-foreground">خدمة عملاء متاحة على مدار الساعة لمساعدتك</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Visa Form Modal */}
      {showForm && (
        <VisaForm 
          isOpen={showForm}
          onClose={handleFormClose}
          selectedCountry={selectedCountry}
        />
      )}

      <Footer />
    </div>
  );
};

export default VisaServices;