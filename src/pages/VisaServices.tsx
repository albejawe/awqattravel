import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import VisaCards from "@/components/VisaCards";
import VisaForm from "@/components/VisaForm";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { CheckCircle, Clock, Shield, Headphones, FileText, CreditCard, Users, Star } from "lucide-react";

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

  const features = [
    {
      icon: Clock,
      text: "تقديم بسيط وسهل يُنجز خلال وقت قصير جداً."
    },
    {
      icon: CheckCircle,
      text: "تدقيق شامل للطلب لزيادة فرص القبول من المحاولة الأولى."
    },
    {
      icon: Shield,
      text: "يمكنك التقديم في أي وقت على مدار الساعة (24/7)."
    },
    {
      icon: FileText,
      text: "ننجز عنك جميع التفاصيل المعقدة لتسافر بلا قلق."
    },
    {
      icon: Headphones,
      text: "دعم متواصل عبر الدردشة، الواتساب، والبريد الإلكتروني."
    },
    {
      icon: Star,
      text: "إمكانية حفظ الطلب ومتابعته لاحقاً."
    },
    {
      icon: CreditCard,
      text: "خيارات دفع متعددة."
    },
    {
      icon: Users,
      text: "أكثر من 366 عميل راضٍ وسعيد بخدمتنا."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50" dir={direction}>
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500 rounded-full filter blur-3xl"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-500 rounded-full filter blur-3xl"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="text-center lg:text-right space-y-8">
              <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-amber-400 via-orange-500 to-red-500 bg-clip-text text-transparent drop-shadow-lg">
                  أسرع
                </span>
                <span className="text-slate-800 block mt-2">
                  طريقة للحصول على
                </span>
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent block">
                  تأشيرة سفرك
                </span>
              </h1>
              
              <p className="text-xl text-slate-600 max-w-lg mx-auto lg:mx-0">
                احصل على تأشيرتك بأسرع وقت وأعلى معدل قبول مع خدمة عملاء متميزة على مدار الساعة
              </p>
              
              <Button 
                onClick={() => handleFormOpen()}
                size="lg"
                className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-600 text-white text-xl px-10 py-6 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 group"
              >
                <CheckCircle className="w-6 h-6 ml-3 group-hover:rotate-12 transition-transform duration-300" />
                احصل على تأشيرتك الآن
              </Button>
            </div>
            
            {/* Hero Image */}
            <div className="relative">
              <div className="relative z-10 max-w-md mx-auto lg:mx-0">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 via-indigo-400/20 to-purple-400/20 rounded-3xl blur-xl transform rotate-6"></div>
                <img
                  src="/visa-hero-image.png"
                  alt="خدمات الفيزا"
                  className="relative z-10 w-full h-auto rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
                />
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              وجهات شهيرة
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              اختر وجهتك المفضلة واحصل على تأشيرتك بأسرع وقت ممكن مع ضمان أعلى معدلات القبول
            </p>
          </div>
          
          <div className="flex justify-end mb-8">
            <VisaCards onCountrySelect={handleFormOpen} />
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 to-blue-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
              لماذا تختار خدماتنا؟
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              نوفر لك أفضل تجربة للحصول على التأشيرة بأسرع وقت وأعلى جودة
            </p>
          </div>
          
          <div className="max-w-6xl mx-auto">
            <div className="relative">
              {/* Background Decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50 to-indigo-100 rounded-3xl shadow-2xl border border-blue-200/50"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-blue-500/5 rounded-3xl"></div>
              
              <div className="relative z-10 p-8 md:p-12">
                <div className="grid md:grid-cols-2 gap-8">
                  {features.map((feature, index) => {
                    const IconComponent = feature.icon;
                    return (
                      <div key={index} className="flex items-start gap-4 group hover:transform hover:scale-105 transition-all duration-300">
                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-emerald-200 group-hover:rotate-6 transition-all duration-300">
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        <p className="text-right leading-relaxed text-slate-700 font-medium group-hover:text-slate-800 transition-colors duration-300 text-lg">
                          {feature.text}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-700 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:50px_50px]"></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="max-w-3xl mx-auto space-y-8">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
              تبحث عن عرض سفر مميز؟
            </h3>
            <p className="text-xl text-blue-100 mb-8">
              اكتشف عروضنا المتنوعة للعمرة والسياحة بأفضل الأسعار
            </p>
            <Button
              asChild
              size="lg"
              className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600 text-white text-xl px-10 py-6 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 group border-0"
            >
              <a href="/">
                <Star className="w-6 h-6 ml-3 group-hover:rotate-12 transition-transform duration-300" />
                اضغط هنا
              </a>
            </Button>
          </div>
        </div>
      </section>

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