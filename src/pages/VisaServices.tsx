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
              خدمات الفيزا من اوقات
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
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
              {[
                "تقديم بسيط وسهل يُنجز خلال وقت قصير جداً.",
                "تدقيق شامل للطلب لزيادة فرص القبول من المحاولة الأولى.",
                "يمكنك التقديم في أي وقت على مدار الساعة (24/7).",
                "ننجز عنك جميع التفاصيل المعقدة لتسافر بلا قلق.",
                "دعم متواصل عبر الدردشة، الواتساب، والبريد الإلكتروني.",
                "إمكانية حفظ الطلب ومتابعته لاحقاً.",
                "خيارات دفع متعددة.",
                "أكثر من 366 عميل راضٍ وسعيد بخدمتنا."
              ].map((feature, index) => (
                <div key={index} className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 p-4 rounded-lg border-2 border-green-200 dark:border-green-700/50 hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <div className="flex items-start gap-3 text-right">
                    <div className="flex-shrink-0 w-6 h-6 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mt-0.5">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 font-medium">
                      {feature}
                    </p>
                  </div>
                </div>
              ))}
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