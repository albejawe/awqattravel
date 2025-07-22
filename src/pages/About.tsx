import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle, 
  Facebook, 
  Instagram,
  Building2,
  Users,
  Award,
  Shield,
  Star,
  Clock,
  Globe,
  Heart,
  ArrowRight
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const About = () => {
  const { t, direction, language } = useLanguage();
  
  const handleWhatsAppContact = (number: string = "962777799212") => {
    const message = "أرغب بالاستفسار عن خدماتكم";
    const whatsappUrl = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handlePhoneCall = (number: string) => {
    window.open(`tel:${number}`, '_self');
  };

  const handleMapClick = (url: string) => {
    window.open(url, '_blank');
  };

  const handleSocialClick = (url: string) => {
    window.open(url, '_blank');
  };

  const branches = [
    {
      name: language === 'ar' ? "فرع الصويفية" : "Swaifyeh Branch",
      address: language === 'ar' ? "عمان - الصويفية - شارع زهران" : "Amman - Swaifyeh - Zahran Street",
      phones: ["96265826688", "962770826688", "962770836688"],
      whatsapp: ["962777799212"],
      mapUrl: "https://maps.app.goo.gl/x8dpVPm9seYa7ECL6"
    },
    {
      name: language === 'ar' ? "فرع الشارق الأوسط" : "Middle East Branch",
      address: language === 'ar' ? "عمان - الشارق الأوسط" : "Amman - Middle East",
      phones: ["96264166060", "962779933608", "962779933609"],
      whatsapp: ["962779933608", "962779933609"],
      mapUrl: "https://maps.app.goo.gl/69kQvFkDqv9PRZfN6"
    }
  ];

  const socialMedia = [
    {
      platform: "Facebook",
      url: "https://web.facebook.com/Dahabjo2021?_rdc=1&_rdr#",
      icon: Facebook,
      color: "text-blue-600"
    },
    {
      platform: "Instagram", 
      url: "https://www.instagram.com/gold_travel.jo/?hl=ar",
      icon: Instagram,
      color: "text-pink-600"
    }
  ];

  const features = [
    {
      icon: Award,
      title: language === 'ar' ? "خبرة عريقة" : "Rich Experience",
      description: language === 'ar' ? "سنين عديدة في مجال السياحة والسفر" : "Many years in tourism and travel",
      color: "text-yellow-600"
    },
    {
      icon: Users,
      title: language === 'ar' ? "فريق متخصص" : "Specialized Team",
      description: language === 'ar' ? "فريق من الخبراء المتخصصين في تنظيم الرحلات" : "Team of experts specialized in organizing trips",
      color: "text-blue-600"
    },
    {
      icon: Shield,
      title: language === 'ar' ? "موثوقية تامة" : "Complete Reliability",
      description: language === 'ar' ? "شركة مرخصة ومعتمدة من وزارة السياحة" : "Licensed and accredited company by Ministry of Tourism",
      color: "text-green-600"
    },
    {
      icon: Clock,
      title: language === 'ar' ? "خدمة 24/7" : "24/7 Service",
      description: language === 'ar' ? "دعم عملاء متواصل طوال الأسبوع" : "Continuous customer support throughout the week",
      color: "text-purple-600"
    },
    {
      icon: Globe,
      title: language === 'ar' ? "وجهات متنوعة" : "Diverse Destinations",
      description: language === 'ar' ? "أكثر من 50 وجهة سياحية حول العالم" : "More than 50 tourist destinations around the world",
      color: "text-orange-600"
    },
    {
      icon: Heart,
      title: language === 'ar' ? "رضا العملاء" : "Customer Satisfaction",
      description: language === 'ar' ? "أكثر من 10,000 عميل راضٍ عن خدماتنا" : "More than 10,000 customers satisfied with our services",
      color: "text-red-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-elegant" dir={direction}>
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-gold opacity-95"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.1%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20"></div>
        <div className="relative container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <Badge className="mb-6 text-lg px-6 py-2 bg-white/20 text-white border-white/30 hover:bg-white/30 font-arabic">
              {language === 'ar' ? "الذهب للسياحة والسفر" : "Gold Travel & Tourism"}
            </Badge>
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white font-arabic leading-tight">
              {language === 'ar' ? "رحلات استثنائية" : "Exceptional Trips"}
              <span className="block text-4xl md:text-6xl mt-2 text-yellow-200">
                {language === 'ar' ? "ذكريات لا تُنسى" : "Unforgettable Memories"}
              </span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90 font-arabic leading-relaxed max-w-3xl mx-auto">
              {language === 'ar' 
                ? "منذ سنين عديدة، نحن نصنع أجمل اللحظات ونقدم تجارب سفر فريدة تبقى في القلب إلى الأبد"
                : "For many years, we have been creating the most beautiful moments and providing unique travel experiences that remain in the heart forever"
              }
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Button 
                variant="outline"
                onClick={() => window.location.href = '/'}
                className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-primary px-8 py-4 text-lg font-arabic rounded-full backdrop-blur-sm"
              >
                <ArrowRight className="ml-2 h-5 w-5" />
                {language === 'ar' ? "تصفح العروض" : "Browse Offers"}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* About Content */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          
          {/* Company Story */}
          <div className="max-w-6xl mx-auto mb-20">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-primary-dark font-arabic">
                {language === 'ar' ? "قصة نجاح عريقة" : "A Legacy Success Story"}
              </h2>
              <div className="w-24 h-1 bg-gradient-gold mx-auto mb-8"></div>
              <p className="text-xl text-muted-foreground font-arabic leading-relaxed max-w-4xl mx-auto">
                {language === 'ar' 
                  ? "شركة الذهب للسياحة والسفر، رائدة في مجال السياحة والسفر في الأردن والشرق الأوسط"
                  : "Gold Travel & Tourism Company, a leader in tourism and travel in Jordan and the Middle East"
                }
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Card className="golden-card p-8 h-full shadow-gold">
                  <CardContent className="p-0">
                    <h3 className="text-2xl font-bold mb-6 text-primary-dark font-arabic">
                      {language === 'ar' ? "رؤيتنا" : "Our Vision"}
                    </h3>
                    <p className="text-lg leading-relaxed mb-6 font-arabic text-muted-foreground">
                      {language === 'ar' 
                        ? "أن نكون الخيار الأول للمسافرين في المنطقة من خلال تقديم خدمات سياحية متميزة وتجارب سفر لا تُنسى تلبي تطلعات عملائنا وتفوق توقعاتهم."
                        : "To be the first choice for travelers in the region by providing distinguished tourism services and unforgettable travel experiences that meet our customers' aspirations and exceed their expectations."
                      }
                    </p>
                    <p className="text-lg leading-relaxed font-arabic text-muted-foreground">
                      {language === 'ar'
                        ? "نسعى لأن نكون الجسر الذي يربط بين أحلام المسافرين والوجهات الساحرة حول العالم."
                        : "We strive to be the bridge that connects travelers' dreams with charming destinations around the world."
                      }
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <Card className="golden-card p-8 h-full shadow-gold">
                  <CardContent className="p-0">
                    <h3 className="text-2xl font-bold mb-6 text-primary-dark font-arabic">
                      {language === 'ar' ? "مهمتنا" : "Our Mission"}
                    </h3>
                    <p className="text-lg leading-relaxed mb-6 font-arabic text-muted-foreground">
                      {language === 'ar'
                        ? "تقديم خدمات سياحية شاملة ومتكاملة تشمل تنظيم الرحلات السياحية، حجز الفنادق، تذاكر الطيران، والخدمات اللوجستية بأعلى معايير الجودة والاحترافية."
                        : "Providing comprehensive and integrated tourism services including organizing tourist trips, hotel reservations, flight tickets, and logistical services with the highest standards of quality and professionalism."
                      }
                    </p>
                    <p className="text-lg leading-relaxed font-arabic text-muted-foreground">
                      {language === 'ar'
                        ? "نؤمن بأن كل رحلة هي قصة جديدة، ونحن هنا لنكتب معكم أجمل الفصول."
                        : "We believe that every trip is a new story, and we are here to write the most beautiful chapters with you."
                      }
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mb-20">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-primary-dark font-arabic">
                {language === 'ar' ? "لماذا تختارنا؟" : "Why Choose Us?"}
              </h2>
              <div className="w-24 h-1 bg-gradient-gold mx-auto mb-8"></div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="golden-card p-8 text-center group hover:shadow-gold-strong transition-all duration-300 transform hover:scale-105">
                  <CardContent className="p-0">
                    <div className={`w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-elegant flex items-center justify-center ${feature.color} shadow-lg`}>
                      <feature.icon size={32} />
                    </div>
                    <h3 className="text-xl font-bold mb-4 text-primary-dark font-arabic">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground font-arabic leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div className="mb-20">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 text-primary-dark font-arabic">
                {language === 'ar' ? "تواصل معنا" : "Contact Us"}
              </h2>
              <div className="w-24 h-1 bg-gradient-gold mx-auto mb-8"></div>
              <p className="text-xl text-muted-foreground font-arabic">
                {language === 'ar' 
                  ? "نحن هنا لخدمتكم في فرعينا المتميزين"
                  : "We are here to serve you in our two distinguished branches"
                }
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {branches.map((branch, index) => (
                <Card key={index} className="golden-card p-8 shadow-gold hover:shadow-gold-strong transition-all duration-300">
                  <CardContent className="p-0">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-gradient-gold rounded-full flex items-center justify-center text-white ml-4">
                        <Building2 size={24} />
                      </div>
                      <h3 className="text-2xl font-bold text-primary-dark font-arabic">
                        {branch.name}
                      </h3>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start">
                        <MapPin className="text-primary ml-3 mt-1 flex-shrink-0" size={20} />
                        <div>
                          <p className="font-arabic text-muted-foreground">{branch.address}</p>
                          <Button 
                            variant="link" 
                            className="p-0 h-auto text-primary hover:text-primary-dark font-arabic"
                            onClick={() => handleMapClick(branch.mapUrl)}
                          >
                            {language === 'ar' ? "عرض على الخريطة" : "View on Map"}
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <Phone className="text-primary ml-3 mt-1 flex-shrink-0" size={20} />
                        <div className="flex-1">
                          <p className="font-semibold font-arabic text-primary-dark mb-2">
                            {language === 'ar' ? "الهاتف:" : "Phone:"}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {branch.phones.map((phone, phoneIndex) => (
                              <Button
                                key={phoneIndex}
                                variant="outline"
                                size="sm"
                                className="font-arabic text-sm"
                                onClick={() => handlePhoneCall(phone)}
                              >
                                {phone}+
                              </Button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {branch.whatsapp && (
                        <div className="flex items-start">
                          <MessageCircle className="text-green-600 ml-3 mt-1 flex-shrink-0" size={20} />
                          <div className="flex-1">
                            <p className="font-semibold font-arabic text-primary-dark mb-2">
                              {language === 'ar' ? "واتساب:" : "WhatsApp:"}
                            </p>
                            <div className="flex flex-wrap gap-2">
                              {branch.whatsapp.map((whatsapp, whatsappIndex) => (
                                <Button
                                  key={whatsappIndex}
                                  className="bg-green-600 hover:bg-green-700 text-white font-arabic text-sm"
                                  size="sm"
                                  onClick={() => handleWhatsAppContact(whatsapp)}
                                >
                                  <MessageCircle className="ml-1 h-4 w-4" />
                                  {whatsapp}+
                                </Button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Email and Social Media */}
            <div className="grid md:grid-cols-2 gap-8 mt-8">
              <Card className="golden-card p-8 shadow-gold">
                <CardContent className="p-0 text-center">
                  <div className="w-16 h-16 bg-gradient-gold rounded-full flex items-center justify-center text-white mx-auto mb-4">
                    <Mail size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-primary-dark font-arabic">
                    {language === 'ar' ? "البريد الإلكتروني" : "Email"}
                  </h3>
                  <Button
                    variant="link"
                    className="text-lg text-primary hover:text-primary-dark font-arabic"
                    onClick={() => window.open('mailto:info@aldahabtravel.com')}
                  >
                    info@aldahabtravel.com
                  </Button>
                </CardContent>
              </Card>

              <Card className="golden-card p-8 shadow-gold">
                <CardContent className="p-0 text-center">
                  <div className="w-16 h-16 bg-gradient-gold rounded-full flex items-center justify-center text-white mx-auto mb-4">
                    <Globe size={24} />
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-primary-dark font-arabic">
                    {language === 'ar' ? "تابعونا على" : "Follow Us"}
                  </h3>
                  <div className="flex justify-center gap-4">
                    {socialMedia.map((social, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="lg"
                        className={`${social.color} border-current hover:bg-current hover:text-white transition-all duration-300`}
                        onClick={() => handleSocialClick(social.url)}
                      >
                        <social.icon size={24} />
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <Card className="golden-card p-12 shadow-gold-strong bg-gradient-elegant">
              <CardContent className="p-0">
                <div className="max-w-3xl mx-auto">
                  <Star className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
                  <h2 className="text-3xl md:text-4xl font-bold mb-6 text-primary-dark font-arabic">
                    {language === 'ar' ? "ابدأ رحلتك معنا اليوم" : "Start Your Journey With Us Today"}
                  </h2>
                  <p className="text-xl mb-8 text-muted-foreground font-arabic leading-relaxed">
                    {language === 'ar'
                      ? "دعنا نخطط لك رحلة العمر. فريقنا من الخبراء جاهز لتحويل أحلامك إلى واقع مليء بالذكريات الجميلة"
                      : "Let us plan the trip of a lifetime for you. Our team of experts is ready to turn your dreams into reality filled with beautiful memories"
                    }
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <Button
                      onClick={() => handleWhatsAppContact("962777799212")}
                      className="bg-gradient-gold hover:bg-gradient-gold-dark text-white font-bold px-8 py-4 text-lg font-arabic rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                    >
                      <MessageCircle className="ml-2 h-5 w-5" />
                      {language === 'ar' ? "احجز رحلتك الآن" : "Book Your Trip Now"}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => window.location.href = '/'}
                      className="border-primary text-primary hover:bg-primary hover:text-white px-8 py-4 text-lg font-arabic rounded-full"
                    >
                      <ArrowRight className="ml-2 h-5 w-5" />
                      {language === 'ar' ? "اكتشف العروض" : "Discover Offers"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;