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
        <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-16 overflow-hidden">
          <div className="container mx-auto px-4 text-center relative z-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-500 bg-clip-text text-transparent font-extrabold">
                أسرع
              </span>{" "}
              طريقة للحصول على تأشيرة سفرك
            </h1>
            <Button 
              onClick={() => handleFormOpen()}
              size="lg"
              className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-lg px-8 py-4 rounded-full shadow-xl transform hover:scale-105 transition-all duration-300 mb-8"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              احصل على تأشيرتك الآن
            </Button>
            
            {/* Hero Image */}
            <div className="max-w-md mx-auto">
              <img
                src="/visa-hero-image.png"
                alt="خدمات الفيزا"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full blur-xl"></div>
            <div className="absolute top-20 -left-20 w-60 h-60 bg-gradient-to-br from-indigo-400/10 to-purple-500/10 rounded-full blur-2xl"></div>
            <div className="absolute bottom-10 right-1/4 w-32 h-32 bg-gradient-to-br from-teal-400/20 to-blue-500/20 rounded-full blur-xl"></div>
          </div>
        </section>

        {/* Visa Cards Section */}
        <section className="py-16 bg-gradient-to-b from-slate-50 to-blue-50/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">وجهات شهيرة</h2>
              <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                اختر وجهتك المفضلة واحصل على تأشيرتك بأسرع وقت ممكن
              </p>
            </div>
            
            <VisaCards onCountrySelect={handleFormOpen} />
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-16 bg-gradient-to-b from-blue-50/50 to-indigo-50/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">لماذا تختار خدماتنا؟</h2>
            </div>
            
            <div className="max-w-5xl mx-auto">
              <div className="bg-gradient-to-br from-white to-blue-50/50 rounded-3xl shadow-2xl border border-blue-100/50 p-8 backdrop-blur-sm">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    "تقديم بسيط وسهل يُنجز خلال وقت قصير جداً.",
                    "تدقيق شامل للطلب لزيادة فرص القبول من المحاولة الأولى.",
                    "يمكنك التقديم في أي وقت على مدار الساعة (24/7).",
                    "ننجز عنك جميع التفاصيل المعقدة لتسافر بلا قلق.",
                    "دعم متواصل عبر الدردشة، الواتساب، والبريد الإلكتروني.",
                    "إمكانية حفظ الطلب ومتابعه لاحقاً.",
                    "خيارات دفع متعددة.",
                    "أكثر من 366 عميل راضٍ وسعيد بخدمتنا."
                  ].map((feature, index) => (
                    <div key={index} className="flex items-start gap-3 text-right group">
                      <div className="flex-shrink-0 w-7 h-7 bg-gradient-to-br from-emerald-500 to-green-600 rounded-full flex items-center justify-center mt-0.5 shadow-lg group-hover:shadow-emerald-200 transition-all duration-300">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <p className="text-sm leading-relaxed text-slate-700 font-medium group-hover:text-slate-800 transition-colors duration-300">
                        {feature}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-2xl mx-auto">
              <h3 className="text-2xl font-bold text-white mb-6">
                تبحث عن عرض سفر مميز؟
              </h3>
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white text-lg px-8 py-4 rounded-full shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <a href="/">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  اضغط هنا
                </a>
              </Button>
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