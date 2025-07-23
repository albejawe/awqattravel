import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MessageCircle, 
  Play, 
  Info, 
  Download, 
  Share2, 
  Calendar,
  MapPin,
  Star,
  ChevronLeft,
  ChevronRight,
  X,
  Building2,
  Plane
} from "lucide-react";
import Papa from "papaparse";
import Notification from "./Notification";
import ImageGallery from "./ImageGallery";
import VideoModal from "./VideoModal";
import html2canvas from "html2canvas";
import { useLanguage } from "@/contexts/LanguageContext";

interface TravelOffer {
  category: string;
  title: string;
  description: string;
  price: string;
  duration: string;
  location: string;
  images: string[];
  videoUrl?: string;
  details: string;
  rating: number;
  originalPrice?: string;
  discount?: string;
  hotel: string;
  airline: string;
  priceDetails: {
    single?: string;
    double?: string;
    triple?: string;
    quad?: string;
    penta?: string;
  };
  dynamicPrices?: {
    [key: string]: {
      value: string;
      displayName: string;
    };
  };
}

const TravelOffers = () => {
  const { t, direction } = useLanguage();
  const [offers, setOffers] = useState<TravelOffer[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [showNotification, setShowNotification] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState<TravelOffer | null>(null);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [galleryInitialIndex, setGalleryInitialIndex] = useState(0);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState("");
  const [selectedVideoTitle, setSelectedVideoTitle] = useState("");
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchOffers();
    
    // التحقق من معاملات URL
    const urlParams = new URLSearchParams(window.location.search);
    const offerParam = urlParams.get('offer');
    const categoryParam = urlParams.get('category');
    
    if (categoryParam) {
      setSelectedCategory(decodeURIComponent(categoryParam));
    }
  }, []);

  const fetchOffers = async () => {
    try {
      const response = await fetch(
        "https://docs.google.com/spreadsheets/d/e/2PACX-1vSb5LJUCZ515nV3viDkhB8_UeR--ddYsOk_HhrgHW-549EfRsZFK0DugpjifPmW3N2hniJ83HscMuy9/pub?output=csv"
      );
      const csvText = await response.text();
      
      Papa.parse(csvText, {
        header: true,
        complete: (results) => {
          const parsedOffers: TravelOffer[] = results.data
            .filter((row: any) => row["الوجهه"] && row["الوجهه"].trim() !== "") // تصفية الصفوف الفارغة
            .map((row: any) => {
              // جمع الصور من الأعمدة المختلفة
              const images = [];
              for (let i = 1; i <= 5; i++) {
                const imageUrl = row[`صورة رقم ${i}`];
                if (imageUrl && imageUrl.trim()) {
                  images.push(imageUrl.trim());
                }
              }

              // جمع أسعار جميع الأنواع (مع دعم الأسماء المتغيرة)
              const priceDetails: any = {};
              const dynamicPrices: any = {};
              
              // الأسعار الثابتة
              if (row["السعر للفردي"]) priceDetails.single = row["السعر للفردي"];
              if (row["السعر للمزدوج"]) priceDetails.double = row["السعر للمزدوج"];
              if (row["السعر للثلاثي"]) priceDetails.triple = row["السعر للثلاثي"];
              if (row["السعر للرباعي"]) priceDetails.quad = row["السعر للرباعي"];
              if (row["السعر للخماسي"]) priceDetails.penta = row["السعر للخماسي"];

              // البحث عن أعمدة الأسعار الديناميكية
              Object.keys(row).forEach(columnName => {
                if (columnName.includes("سعر") && 
                    !["السعر للفردي", "السعر للمزدوج", "السعر للثلاثي", "السعر للرباعي", "السعر للخماسي"].includes(columnName) &&
                    row[columnName] && row[columnName].trim()) {
                  
                  // تحديد التسمية بناءً على اسم العمود
                  let displayName = columnName;
                  
                  console.log('Processing column:', columnName);
                  console.log('Available columns:', Object.keys(row));
                  console.log('التسمية 2 value:', row["التسمية 2"]);
                  
                  if (columnName === "سعر السياحة 1" && row["التسمية 1"]) {
                    displayName = row["التسمية 1"];
                  } else if (columnName === "سعر السياحة 2" && row["التسمية 2"]) {
                    console.log('Setting displayName for سعر السياحة 2 to:', row["التسمية 2"]);
                    displayName = row["التسمية 2"];
                  } else if (columnName === "سعر السياحة 3" && row["التسمية 3"]) {
                    displayName = row["التسمية 3"];
                  } else if (columnName === "سعر السياحة 4" && row["التسمية 4"]) {
                    displayName = row["التسمية 4"];
                  } else if (columnName === "سعر السياحة 5" && row["التسمية 5"]) {
                    displayName = row["التسمية 5"];
                  }
                  
                  console.log('Final displayName for', columnName, ':', displayName);
                  
                  dynamicPrices[columnName] = {
                    value: row[columnName],
                    displayName: displayName
                  };
                }
              });

              // تحديد السعر المعروض أولاً
              let displayPrice = "";
              if (priceDetails.double) {
                displayPrice = `${priceDetails.double} د.ك`;
              } else if (priceDetails.single) {
                displayPrice = `${priceDetails.single} د.ك`;
              } else if (Object.keys(dynamicPrices).length > 0) {
                // استخدام أول سعر ديناميكي إذا لم توجد أسعار ثابتة
                const firstDynamicPrice = Object.values(dynamicPrices)[0] as any;
                displayPrice = `${firstDynamicPrice.value} د.ك`;
              }

              return {
                category: row["الوجهه"] || "عام",
                title: row["اسم العرض"] || row["الوجهه"] || "",
                description: row["عدد ايام البرنامج"] && row["عدد ايام البرنامج"] !== "" 
                  ? `رحلة ${row["عدد ايام البرنامج"]} أيام إلى ${row["الوجهه"]} مع ${row["الطيران"] || "طيران ممتاز"}`
                  : `رحلة إلى ${row["الوجهه"]} مع ${row["الطيران"] || "طيران ممتاز"}`,
                price: displayPrice,
                duration: row["عدد ايام البرنامج"] && row["عدد ايام البرنامج"] !== "" ? row["عدد ايام البرنامج"] : "",
                location: row["الوجهه"] || "",
                hotel: row["القندق"] || "",
                airline: row["الطيران"] || "",
                images: images,
                videoUrl: row["الفيديو"],
                priceDetails: priceDetails,
                dynamicPrices: dynamicPrices,
                details: row["تفاصيل العرض"] || `رحلة رائعة إلى ${row["الوجهه"]} تشمل الإقامة في ${row["القندق"]} والطيران مع ${row["الطيران"]}.
                
تفاصيل الرحلة:
- تاريخ الذهاب: ${row["تاريخ الذهاب"]} في تمام ${row["وقت الذهاب"]}
- تاريخ العودة: ${row["تاريخ العودة"]} في تمام ${row["وقت العودة"]}
${row["عدد ايام البرنامج"] && row["عدد ايام البرنامج"] !== "" ? `- مدة الرحلة: ${row["عدد ايام البرنامج"]} أيام` : ""}

الأسعار:
${priceDetails.single ? `- السعر للفرد: ${priceDetails.single} د.ك` : ""}
${priceDetails.double ? `- السعر للمزدوج: ${priceDetails.double} د.ك` : ""}
${priceDetails.triple ? `- السعر للثلاثي: ${priceDetails.triple} د.ك` : ""}
${priceDetails.quad ? `- السعر للرباعي: ${priceDetails.quad} د.ك` : ""}
${priceDetails.penta ? `- السعر للخماسي: ${priceDetails.penta} د.ك` : ""}
${Object.keys(dynamicPrices).map(key => `- ${dynamicPrices[key].displayName}: ${dynamicPrices[key].value} د.ك`).join('\n')}`,
                rating: parseFloat(row["Score"]) || 5
              };
            });

          setOffers(parsedOffers);
          
          const uniqueCategories = Array.from(
            new Set(parsedOffers.map(offer => offer.category))
          );
          setCategories(uniqueCategories);
          
          setShowNotification(true);
          setLoading(false);
          
          // التحقق من عرض محدد في URL
          const urlParams = new URLSearchParams(window.location.search);
          const offerParam = urlParams.get('offer');
          
          if (offerParam) {
            const targetOffer = parsedOffers.find(offer => 
              offer.title === decodeURIComponent(offerParam)
            );
            if (targetOffer) {
              setSelectedCategory(targetOffer.category);
            }
          }
        }
      });
    } catch (error) {
      console.error("Error fetching offers:", error);
      setLoading(false);
    }
  };

  const filteredOffers = selectedCategory 
    ? offers.filter(offer => offer.category === selectedCategory)
    : offers;

  const handleBookNow = (offer: TravelOffer) => {
    const message = `أرغب بحجز عرض: ${offer.title}`;
    const whatsappUrl = `https://wa.me/96522289080?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleShareOffer = async (offer: TravelOffer) => {
    const shareUrl = `${window.location.origin}/?offer=${encodeURIComponent(offer.title)}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: offer.title,
          text: offer.description,
          url: shareUrl,
        });
      } catch (error) {
        copyToClipboard(shareUrl);
      }
    } else {
      copyToClipboard(shareUrl);
    }
  };

  const handleShareCategory = async (category: string) => {
    const shareUrl = `${window.location.origin}/?category=${encodeURIComponent(category)}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `عروض ${category}`,
          text: `اكتشف عروض السفر المميزة إلى ${category}`,
          url: shareUrl,
        });
      } catch (error) {
        copyToClipboard(shareUrl);
      }
    } else {
      copyToClipboard(shareUrl);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Show copied notification
  };

  const downloadOffer = async (offer: TravelOffer) => {
    const cardElement = document.querySelector(`[data-offer-id="${offer.title}"]`) as HTMLElement;
    if (!cardElement) return;

    try {
      // إخفاء الأزرار مؤقتاً
      const buttons = cardElement.querySelectorAll('.offer-buttons');
      buttons.forEach(btn => {
        (btn as HTMLElement).style.display = 'none';
      });

      // انتظار وقت قصير للتأكد من إخفاء الأزرار
      await new Promise(resolve => setTimeout(resolve, 200));

      // Create a proxy function to handle CORS images
      const loadImageAsDataURL = async (imageUrl: string): Promise<string> => {
        try {
          // Try to use a CORS proxy for external images
          const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(imageUrl)}`;
          
          const response = await fetch(proxyUrl);
          const blob = await response.blob();
          
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        } catch (error) {
          console.warn('CORS proxy failed, using original URL:', error);
          return imageUrl; // Fallback to original URL
        }
      };

      // Process all images in the card
      const images = cardElement.querySelectorAll('img');
      for (const img of Array.from(images)) {
        if (img.src.startsWith('http') && !img.src.includes('data:')) {
          try {
            const dataURL = await loadImageAsDataURL(img.src);
            img.src = dataURL;
            // Wait for the image to load
            await new Promise(resolve => {
              if (img.complete) {
                resolve(null);
              } else {
                img.onload = () => resolve(null);
                img.onerror = () => resolve(null);
              }
            });
          } catch (error) {
            console.warn('Could not convert image:', img.src, error);
          }
        }
      }
      
      // انتظار إضافي للتأكد من تحميل جميع الصور
      await new Promise(resolve => setTimeout(resolve, 500));

      const canvas = await html2canvas(cardElement, {
        backgroundColor: '#ffffff',
        scale: 2,
        useCORS: false,
        allowTaint: true,
        logging: false,
        imageTimeout: 0,
        onclone: (clonedDoc) => {
          const clonedElement = clonedDoc.querySelector(`[data-offer-id="${offer.title}"]`);
          if (clonedElement) {
            const clonedButtons = clonedElement.querySelectorAll('.offer-buttons');
            clonedButtons.forEach(btn => {
              (btn as HTMLElement).style.display = 'none';
            });
          }
        }
      });

      // إظهار الأزرار مرة أخرى
      buttons.forEach(btn => {
        (btn as HTMLElement).style.display = '';
      });

      const link = document.createElement('a');
      link.download = `${offer.title}-عرض.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    } catch (error) {
      console.error('Error downloading offer:', error);
      // إظهار الأزرار في حالة وجود خطأ
      const buttons = cardElement.querySelectorAll('.offer-buttons');
      buttons.forEach(btn => {
        (btn as HTMLElement).style.display = '';
      });
    }
  };

  const handleVideoPlay = (videoUrl: string, title: string) => {
    setSelectedVideoUrl(videoUrl);
    setSelectedVideoTitle(title);
    setShowVideoModal(true);
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
      );
    }
    
    return (
      <div className="flex items-center">
        {stars}
        <span className="text-sm text-muted-foreground mr-2 font-arabic">
          ({rating})
        </span>
      </div>
    );
  };

  const openImageGallery = (images: string[], index: number = 0) => {
    setGalleryImages(images);
    setGalleryInitialIndex(index);
    setShowImageGallery(true);
  };

  const ImageSlider = ({ images, offerTitle }: { images: string[], offerTitle: string }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const nextImage = () => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    if (!images.length) return null;

    return (
      <div className="relative group">
        <div 
          className="w-full h-64 overflow-hidden rounded-t-xl cursor-pointer"
          onClick={() => openImageGallery(images, currentImageIndex)}
        >
          <img
            src={images[currentImageIndex]}
            alt={`${offerTitle} - صورة ${currentImageIndex + 1}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.preventDefault();
                prevImage();
              }}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={(e) => {
                e.preventDefault();
                nextImage();
              }}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-arabic text-muted-foreground">{t('offers.loading')}</p>
        </div>
      </div>
    );
  }

  return (
    <section id="offers" className="py-20" dir={direction}>
      <div className="container mx-auto px-4">
        {/* Categories */}
        {!selectedCategory && (
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-8 font-arabic text-gold-gradient">
              {t('offers.chooseDestination')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categories.map((category) => {
                const categoryOffers = offers.filter(offer => offer.category === category);
                const firstOfferImage = categoryOffers[0]?.images[0];
                
                return (
                  <Card
                    key={category}
                    className="card-gold cursor-pointer group overflow-hidden relative"
                    onClick={() => setSelectedCategory(category)}
                  >
                    <div className="relative h-48 overflow-hidden">
                      {firstOfferImage ? (
                        <img
                          src={firstOfferImage}
                          alt={category}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-gold flex items-center justify-center">
                          <span className="text-white text-4xl">🌍</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-b from-primary/40 via-primary/60 to-black/80"></div>
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <h3 className="text-2xl font-bold font-arabic mb-2 group-hover:text-primary transition-colors">
                          {category}
                        </h3>
                        <div className="flex items-center justify-between">
                          <p className="text-white/90 font-arabic text-sm">
                            {categoryOffers.length} {t('offers.availableOffers')}
                          </p>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleShareCategory(category);
                            }}
                            className="text-white hover:bg-white/20"
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Offers */}
        {selectedCategory && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold font-arabic text-gold-gradient">
                {t('offers.categoryOffers')} {selectedCategory}
              </h2>
              <Button
                variant="outline"
                onClick={() => setSelectedCategory("")}
                className="btn-gold-outline font-arabic"
              >
                {t('offers.backToCategories')}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredOffers.map((offer, index) => (
                <Card key={index} className="card-gold overflow-hidden group" data-offer-id={offer.title}>
                  <div className="relative">
                    <ImageSlider images={offer.images} offerTitle={offer.title} />
                    {offer.videoUrl && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleVideoPlay(offer.videoUrl!, offer.title)}
                        className="btn-gold-outline absolute bottom-4 left-4"
                      >
                        <Play className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  
                  <CardContent className="p-6">
                    {/* العنوان وعدد الأيام */}
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-xl font-bold font-arabic">
                        {offer.title}
                      </h3>
                      {offer.duration && offer.duration !== "" && offer.duration !== "undefined" && (
                        <span className="text-sm text-primary font-arabic bg-primary/10 px-2 py-1 rounded">
                          {offer.duration} {t('offers.days')}
                        </span>
                      )}
                    </div>

                    {/* اسم الفندق والتقييم */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center">
                        <Building2 className="h-4 w-4 text-primary ml-2" />
                        <span className="text-muted-foreground font-arabic text-sm">
                          {offer.hotel}
                        </span>
                      </div>
                      {renderStars(offer.rating)}
                    </div>

                    {/* اسم الطيران */}
                    <div className="mb-4">
                      <div className="flex items-center">
                        <Plane className="h-4 w-4 text-primary ml-2" />
                        <span className="text-muted-foreground font-arabic text-sm">
                          {offer.airline}
                        </span>
                      </div>
                    </div>

                    {/* الأسعار */}
                    <div className="mb-4 bg-muted/50 rounded-lg p-3">
                      <h4 className="text-sm font-bold font-arabic text-primary mb-2">{t('offers.priceDetails')}</h4>
                      <div className="space-y-2">
                        {offer.priceDetails.single && (
                          <div className="flex justify-between items-center bg-background rounded px-2 py-1">
                            <span className="font-arabic text-sm font-medium">{t('offers.single')}</span>
                            <span className="font-arabic font-bold text-primary">{offer.priceDetails.single} {t('offers.currency')}</span>
                          </div>
                        )}
                        {offer.priceDetails.double && (
                          <div className="flex justify-between items-center bg-background rounded px-2 py-1">
                            <span className="font-arabic text-sm font-medium">{t('offers.double')}</span>
                            <span className="font-arabic font-bold text-primary">{offer.priceDetails.double} {t('offers.currency')}</span>
                          </div>
                        )}
                        {offer.priceDetails.triple && (
                          <div className="flex justify-between items-center bg-background rounded px-2 py-1">
                            <span className="font-arabic text-sm font-medium">{t('offers.triple')}</span>
                            <span className="font-arabic font-bold text-primary">{offer.priceDetails.triple} {t('offers.currency')}</span>
                          </div>
                        )}
                        {offer.priceDetails.quad && (
                          <div className="flex justify-between items-center bg-background rounded px-2 py-1">
                            <span className="font-arabic text-sm font-medium">{t('offers.quad')}</span>
                            <span className="font-arabic font-bold text-primary">{offer.priceDetails.quad} {t('offers.currency')}</span>
                          </div>
                        )}
                        {offer.priceDetails.penta && (
                          <div className="flex justify-between items-center bg-background rounded px-2 py-1">
                            <span className="font-arabic text-sm font-medium">{t('offers.penta')}</span>
                            <span className="font-arabic font-bold text-primary">{offer.priceDetails.penta} {t('offers.currency')}</span>
                          </div>
                        )}
                        {/* عرض الأسعار الديناميكية */}
                        {offer.dynamicPrices && Object.keys(offer.dynamicPrices).map((priceKey) => (
                          <div key={priceKey} className="flex justify-between items-center bg-background rounded px-2 py-1">
                            <span className="font-arabic text-sm font-medium">
                              {offer.dynamicPrices![priceKey].displayName}
                            </span>
                            <span className="font-arabic font-bold text-primary">
                              {offer.dynamicPrices![priceKey].value} {t('offers.currency')}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* الأزرار */}
                    <div className="offer-buttons space-y-2">
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          onClick={() => handleBookNow(offer)}
                          className="btn-gold text-sm font-arabic"
                        >
                          <MessageCircle className="h-4 w-4 mr-1" />
                          {t('offers.bookNow')}
                        </Button>
                        
                        <Button
                          onClick={() => setSelectedOffer(offer)}
                          className="btn-gold text-sm font-arabic"
                        >
                          <Info className="h-4 w-4 mr-1" />
                          {t('offers.viewDetails')}
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          onClick={() => downloadOffer(offer)}
                          className="btn-gold-outline text-sm font-arabic"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          {t('offers.download')}
                        </Button>
                        
                        <Button
                          variant="outline"
                          onClick={() => handleShareOffer(offer)}
                          className="btn-gold-outline text-sm font-arabic"
                        >
                          <Share2 className="h-4 w-4 mr-1" />
                          {t('offers.share')}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Notification */}
      <Notification
        message={`${t('offers.offersFound')} ${offers.length} ${t('offers.offer')}`}
        show={showNotification}
        onHide={() => setShowNotification(false)}
      />

      {/* Image Gallery */}
      <ImageGallery
        images={galleryImages}
        isOpen={showImageGallery}
        onClose={() => setShowImageGallery(false)}
        initialIndex={galleryInitialIndex}
      />

      {/* Video Modal */}
      <VideoModal
        isOpen={showVideoModal}
        onClose={() => setShowVideoModal(false)}
        videoUrl={selectedVideoUrl}
        title={selectedVideoTitle}
      />

      {/* Offer Details Modal */}
      {selectedOffer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-2xl font-bold font-arabic">{selectedOffer.title}</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedOffer(null)}
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
              <p className="text-muted-foreground font-arabic whitespace-pre-line">
                {selectedOffer.details}
              </p>
              <div className="mt-6 flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedOffer(null)}
                  className="font-arabic"
                >
                  {t('offers.close')}
                </Button>
                <Button
                  onClick={() => {
                    handleBookNow(selectedOffer);
                    setSelectedOffer(null);
                  }}
                  className="btn-gold font-arabic"
                >
                  {t('offers.bookNow')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </section>
  );
};

export default TravelOffers;