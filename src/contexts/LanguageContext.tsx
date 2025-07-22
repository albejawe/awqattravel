import React, { createContext, useContext, useState, useEffect } from 'react';

interface LanguageContextType {
  language: 'ar' | 'en';
  direction: 'rtl' | 'ltr';
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations = {
  ar: {
    // Header
    'language.toggle': 'ع',
    
    // Hero
    'hero.title': 'رحلات فاخرة',
    'hero.subtitle': 'في عالم الدهب، نأخذك في رحلة فاخرة لا تشبه أي رحلة أخرى',
    'hero.description': 'اكتشف أجمل الوجهات السياحية مع باقات مميزة وخدمات فاخرة',
    'hero.cta': 'اكتشف أقوى العروض',
    
    // Travel Offers
    'offers.title': 'عروض السفر',
    'offers.subtitle': 'اختر وجهتك المفضلة من مجموعة متنوعة من الباقات السياحية',
    'offers.chooseDestination': 'اختر وجهتك المفضلة',
    'offers.loading': 'جاري تحميل العروض...',
    'offers.availableOffers': 'عرض متاح',
    'offers.categoryOffers': 'عروض',
    'offers.backToCategories': 'العودة للفئات',
    'offers.viewDetails': 'التفاصيل',
    'offers.bookNow': 'احجز الآن',
    'offers.download': 'تحميل',
    'offers.share': 'مشاركة',
    'offers.whatsapp': 'تواصل عبر الواتساب',
    'offers.close': 'إغلاق',
    'offers.priceDetails': 'الأسعار:',
    'offers.single': 'السعر للشخص في الغرفة المفردة',
    'offers.double': 'السعر للشخص في الغرفة الثنائية',
    'offers.triple': 'السعر للشخص في الغرفة الثلاثية',
    'offers.quad': 'السعر للشخص في الغرفة الرباعية',
    'offers.penta': 'السعر للشخص في الغرفة الخماسية',
    'offers.currency': 'د.أ',
    'offers.rating': 'التقييم',
    'offers.days': 'أيام',
    'offers.offersFound': 'تم العثور على',
    'offers.offer': 'عرض',
    
    // Footer
    'footer.whatsapp': 'تواصل عبر الواتساب',
    'footer.address': 'عمان - الصويفية - شارع زهران',
    'footer.company': 'الدهب للسياحة والسفر - ALDahab Travel & Tourism',
    'footer.rights': 'جميع الحقوق محفوظة.',
    'footer.aboutUs': 'من نحن',
    
    // About Page
    'about.title': 'من نحن؟',
    'about.companyName': 'الدهب للسياحة والسفر',
    'about.description1': 'في عالم السفر، نتفرد بتقديم خدمات ذات خبرة عالية، حيث نعتني بأدق التفاصيل لضمان تجربة سفر فاخرة ومريحة.',
    'about.description2': 'في عالم الدهب، نأخذك في رحلة فاخرة لا تشبه أي رحلة أخرى.',
    'about.services.tourism': 'برامج سياحية',
    'about.services.tourism.desc': 'برامج مصممة بعناية لتقديم تجربة فريدة',
    'about.services.hotels': 'حجوزات فنادق',
    'about.services.hotels.desc': 'احجز إقامتك بسهولة بما يناسب احتياجاتك',
    'about.services.flights': 'تذاكر طيران',
    'about.services.flights.desc': 'حجوزات فعّالة وموثوقة لضمان وصولك إلى وجهتك',
    'about.whyChoose': 'لماذا تختار الدهب للسياحة؟',
    'about.luxury': 'رفاهية لا مثيل لها',
    'about.luxury.desc': 'خدمات فاخرة تضمن راحتك وسعادتك',
    'about.experience': 'خبرة واحترافية',
    'about.experience.desc': 'فريق متخصص بسنوات من الخبرة',
    'about.unique': 'تجربة فريدة',
    'about.unique.desc': 'رحلات مصممة خصيصاً لاحتياجاتك',
    'about.support': 'خدمة على مدار الساعة',
    'about.support.desc': 'دعم مستمر قبل وأثناء وبعد الرحلة',
    'about.startJourney': 'ابدأ رحلتك معنا',
    'about.contactText': 'تواصل معنا اليوم ودعنا نخطط لرحلة أحلامك',
    'about.contactButton': 'تواصل معنا عبر الواتساب'
  },
  en: {
    // Header
    'language.toggle': 'en',
    
    // Hero
    'hero.title': 'Luxury Travel',
    'hero.subtitle': 'In the world of gold, we take you on a luxury journey like no other',
    'hero.description': 'Discover the most beautiful tourist destinations with exclusive packages and luxury services',
    'hero.cta': 'Discover Our Best Offers',
    
    // Travel Offers
    'offers.title': 'Travel Offers',
    'offers.subtitle': 'Choose your favorite destination from a variety of tourist packages',
    'offers.chooseDestination': 'Choose Your Favorite Destination',
    'offers.loading': 'Loading offers...',
    'offers.availableOffers': 'available offers',
    'offers.categoryOffers': 'Offers for',
    'offers.backToCategories': 'Back to Categories',
    'offers.viewDetails': 'View Details',
    'offers.bookNow': 'Book Now',
    'offers.download': 'Download',
    'offers.share': 'Share',
    'offers.whatsapp': 'Contact via WhatsApp',
    'offers.close': 'Close',
    'offers.priceDetails': 'Prices:',
    'offers.single': 'Price per person in single room',
    'offers.double': 'Price per person in double room',
    'offers.triple': 'Price per person in triple room',
    'offers.quad': 'Price per person in quad room',
    'offers.penta': 'Price per person in penta room',
    'offers.currency': 'JD',
    'offers.rating': 'Rating',
    'offers.days': 'days',
    'offers.offersFound': 'Found',
    'offers.offer': 'offers',
    
    // Footer
    'footer.whatsapp': 'Contact via WhatsApp',
    'footer.address': 'Amman - Sweifieh - Zahran Street',
    'footer.company': 'Al Dahab Travel & Tourism - الدهب للسياحة والسفر',
    'footer.rights': 'All rights reserved.',
    'footer.aboutUs': 'About Us',
    
    // About Page
    'about.title': 'About Us',
    'about.companyName': 'Al Dahab Travel & Tourism',
    'about.description1': 'In the world of travel, we excel at providing high-expertise services, taking care of the finest details to ensure a luxurious and comfortable travel experience.',
    'about.description2': 'In the world of Al Dahab, we take you on a luxury journey like no other.',
    'about.services.tourism': 'Tourism Programs',
    'about.services.tourism.desc': 'Carefully designed programs to provide a unique experience',
    'about.services.hotels': 'Hotel Reservations',
    'about.services.hotels.desc': 'Book your stay easily to suit your needs',
    'about.services.flights': 'Flight Tickets',
    'about.services.flights.desc': 'Efficient and reliable bookings to ensure you reach your destination',
    'about.whyChoose': 'Why Choose Al Dahab Travel?',
    'about.luxury': 'Unmatched Luxury',
    'about.luxury.desc': 'Luxury services that ensure your comfort and happiness',
    'about.experience': 'Experience and Professionalism',
    'about.experience.desc': 'Specialized team with years of experience',
    'about.unique': 'Unique Experience',
    'about.unique.desc': 'Trips designed specifically for your needs',
    'about.support': '24/7 Service',
    'about.support.desc': 'Continuous support before, during and after the trip',
    'about.startJourney': 'Start Your Journey With Us',
    'about.contactText': 'Contact us today and let us plan your dream trip',
    'about.contactButton': 'Contact us via WhatsApp'
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [direction, setDirection] = useState<'rtl' | 'ltr'>('rtl');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as 'ar' | 'en' || 'ar';
    setLanguage(savedLanguage);
    setDirection(savedLanguage === 'ar' ? 'rtl' : 'ltr');
    document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = savedLanguage;
  }, []);

  const toggleLanguage = () => {
    const newLanguage = language === 'ar' ? 'en' : 'ar';
    const newDirection = newLanguage === 'ar' ? 'rtl' : 'ltr';
    
    setLanguage(newLanguage);
    setDirection(newDirection);
    localStorage.setItem('language', newLanguage);
    document.documentElement.dir = newDirection;
    document.documentElement.lang = newLanguage;
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, direction, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};