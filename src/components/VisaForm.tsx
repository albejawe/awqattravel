import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, X } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface VisaFormProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCountry?: string;
}

const allCountries = [
  "الكويت", "السعودية", "الإمارات العربية المتحدة", "قطر", "البحرين", "عُمان", "العراق", "الأردن", "لبنان", "سوريا",
  "مصر", "ليبيا", "تونس", "الجزائر", "المغرب", "السودان", "اليمن", "فلسطين", "الولايات المتحدة الأمريكية", "كندا",
  "المملكة المتحدة", "فرنسا", "ألمانيا", "إيطاليا", "إسبانيا", "هولندا", "بلجيكا", "سويسرا", "النمسا", "السويد",
  "النرويج", "الدنمارك", "فنلندا", "أستراليا", "نيوزيلندا", "اليابان", "كوريا الجنوبية", "الصين", "الهند", "تايلاند",
  "ماليزيا", "سنغافورة", "إندونيسيا", "الفلبين", "فيتنام", "تركيا", "إيران", "أفغانستان", "باكستان", "بنغلاديش",
  "روسيا", "أوكرانيا", "بولندا", "التشيك", "المجر", "رومانيا", "بلغاريا", "كرواتيا", "صربيا", "البوسنة والهرسك",
  "الجبل الأسود", "مقدونيا الشمالية", "ألبانيا", "مولدوفا", "بيلاروسيا", "ليتوانيا", "لاتفيا", "إستونيا", "البرازيل", "الأرجنتين",
  "شيلي", "كولومبيا", "بيرو", "الإكوادور", "فنزويلا", "أوروغواي", "باراغواي", "بوليفيا", "غيانا", "سورينام", "المكسيك",
  "غواتيمالا", "بليز", "هندوراس", "السلفادور", "نيكاراغوا", "كوستاريكا", "بنما", "جامايكا", "كوبا", "جمهورية الدومينيكان",
  "هايتي", "بربادوس", "ترينيداد وتوباغو", "جنوب أفريقيا", "نيجيريا", "كينيا", "إثيوبيا", "غانا", "تنزانيا"
];

// Priority order for popular destinations
const priorityOrder = [
  "شنغن",
  "الولايات المتحدة الأمريكية",
  "كندا",
  "المملكة المتحدة",
  "أستراليا",
  "نيوزيلندا",
  "الإمارات العربية المتحدة",
  "السعودية",
  "تركيا",
  "مصر",
  "الأردن",
  "لبنان"
];

// Sort countries by priority
const sortedCountries = [...allCountries].sort((a, b) => {
  const indexA = priorityOrder.indexOf(a);
  const indexB = priorityOrder.indexOf(b);
  
  if (indexA !== -1 && indexB !== -1) return indexA - indexB;
  if (indexA !== -1) return -1;
  if (indexB !== -1) return 1;
  return 0;
});

// Add "غير محدد" and "شنغن" at the beginning
const countries = ["غير محدد", "شنغن", ...sortedCountries];

const visaTypes = ["سياحة", "عمل", "دراسة", "غير ذلك"];
const travelerNumbers = Array.from({ length: 10 }, (_, i) => (i + 1).toString());

const VisaForm = ({ isOpen, onClose, selectedCountry = "" }: VisaFormProps) => {
  const [formData, setFormData] = useState({
    nationality: "الكويت",
    destination: selectedCountry,
    visaType: "",
    travelDate: null as Date | null,
    duration: "",
    travelers: "",
    phone: "",
    email: "",
    hasPreviousVisa: "",
    howDidYouKnowUs: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation - only phone and destination are required
    if (!formData.phone || !formData.destination) {
      toast({
        title: "خطأ",
        description: "رقم الهاتف والوجهة مطلوبان",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Show loading message
      toast({
        title: "جاري التقديم…",
        description: "يرجى الانتظار أثناء حفظ البيانات"
      });

      // Prepare data for Google Apps Script using FormData with English headers
      const submitData = new FormData();
      submitData.append('Nationality', formData.nationality);
      submitData.append('Destination', formData.destination);
      submitData.append('Visa Type', formData.visaType || "غير محدد");
      submitData.append('Expected Travel Date', formData.travelDate ? format(formData.travelDate, "yyyy-MM-dd") : "غير محدد");
      submitData.append('Duration', formData.duration || "غير محدد");
      submitData.append('Number of Travelers', formData.travelers || "غير محدد");
      submitData.append('Phone Number', formData.phone);
      submitData.append('Email', formData.email || "غير محدد");
      submitData.append('Do you have a previous visa?', formData.hasPreviousVisa || "غير محدد");
      submitData.append('How did you know us?', formData.howDidYouKnowUs || "غير محدد");

      // Submit to Google Apps Script first
      const response = await fetch("https://script.google.com/macros/s/AKfycbyNW42cjrnOF30RvgyrdRQC1e7GFAmCLm3-gqP_JsaRZ19diFlFpPtDSaIPRxTvtnol/exec", {
        method: "POST",
        body: submitData
      });

      // Check if submission was successful
      if (!response.ok) {
        throw new Error('فشل في حفظ البيانات');
      }

      // Show success message
      toast({
        title: "تم التقديم بنجاح، جاري التوجيه للواتساب",
        description: "سيتم تحويلك إلى واتساب خلال ثواني"
      });

      // Prepare data for WhatsApp message
      const dataForWhatsApp = {
        nationality: formData.nationality,
        destination: formData.destination,
        visaType: formData.visaType || "غير محدد",
        travelDate: formData.travelDate ? format(formData.travelDate, "yyyy-MM-dd") : "غير محدد",
        duration: formData.duration || "غير محدد",
        travelers: formData.travelers || "غير محدد",
        phone: formData.phone,
        email: formData.email || "غير محدد",
        hasPreviousVisa: formData.hasPreviousVisa || "غير محدد",
        howDidYouKnowUs: formData.howDidYouKnowUs || "غير محدد"
      };

      // Prepare WhatsApp message
      const whatsappMessage = `
مرحباً، أود طلب خدمة تأشيرة بالتفاصيل التالية:

📍 الجنسية: ${dataForWhatsApp.nationality}
🎯 الوجهة: ${dataForWhatsApp.destination}
📋 نوع التأشيرة: ${dataForWhatsApp.visaType}
📅 تاريخ السفر المتوقع: ${dataForWhatsApp.travelDate}
⏱️ المدة: ${dataForWhatsApp.duration}
👥 عدد المسافرين: ${dataForWhatsApp.travelers}
📱 رقم الهاتف: ${dataForWhatsApp.phone}
📧 البريد الإلكتروني: ${dataForWhatsApp.email}
✅ تأشيرة سابقة: ${dataForWhatsApp.hasPreviousVisa}
💡 كيف تعرفت علينا: ${dataForWhatsApp.howDidYouKnowUs}

أرجو المتابعة مع طلبي، شكراً.
      `.trim();

      // Only redirect to WhatsApp after successful Google Sheet submission
      const whatsappUrl = `https://wa.me/96522289080?text=${encodeURIComponent(whatsappMessage)}`;
      window.open(whatsappUrl, '_blank');

      // Close form
      onClose();

    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "حدث خطأ",
        description: "حدث خطأ أثناء الإرسال، يرجى المحاولة مرة أخرى",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold">طلب تأشيرة سفر</DialogTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Nationality */}
            <div className="space-y-2 text-right">
              <Label className="text-right block mb-2 font-semibold">الجنسية</Label>
              <Select value={formData.nationality} onValueChange={(value) => setFormData(prev => ({ ...prev, nationality: value }))}>
                <SelectTrigger className="text-right">
                  <SelectValue placeholder="اختر الجنسية" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>{country}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Destination */}
            <div className="space-y-2 text-right">
              <Label className="text-right block mb-2 font-semibold">الوجهة <span className="text-red-500">*</span></Label>
              <Select value={formData.destination} onValueChange={(value) => setFormData(prev => ({ ...prev, destination: value }))}>
                <SelectTrigger className="text-right">
                  <SelectValue placeholder="اختر الوجهة" />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country} value={country}>{country}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Visa Type */}
            <div className="space-y-2 text-right">
              <Label className="text-right block mb-2 font-semibold">نوع التأشيرة</Label>
              <Select value={formData.visaType} onValueChange={(value) => setFormData(prev => ({ ...prev, visaType: value }))}>
                <SelectTrigger className="text-right">
                  <SelectValue placeholder="اختر نوع التأشيرة" />
                </SelectTrigger>
                <SelectContent>
                  {visaTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Travel Date */}
            <div className="space-y-2 text-right">
              <Label className="text-right block mb-2 font-semibold">تاريخ السفر المتوقع</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-right font-normal",
                      !formData.travelDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="ml-2 h-4 w-4" />
                    {formData.travelDate ? format(formData.travelDate, "PPP", { locale: ar }) : "اختر التاريخ"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.travelDate || undefined}
                    onSelect={(date) => {
                      setFormData(prev => ({ ...prev, travelDate: date || null }));
                      // Close the popover automatically after selection
                      setTimeout(() => {
                        const popoverTrigger = document.querySelector('[data-state="open"]');
                        if (popoverTrigger) {
                          (popoverTrigger as HTMLElement).click();
                        }
                      }, 100);
                    }}
                    initialFocus
                    disabled={(date) => date < new Date()}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Duration */}
            <div className="space-y-2 text-right">
              <Label className="text-right block mb-2 font-semibold">المدة</Label>
              <Input
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                placeholder="مثال: 10 أيام، شهر واحد"
                className="text-right"
                dir="rtl"
              />
            </div>

            {/* Number of Travelers */}
            <div className="space-y-2 text-right">
              <Label className="text-right block mb-2 font-semibold">عدد المسافرين</Label>
              <Select value={formData.travelers} onValueChange={(value) => setFormData(prev => ({ ...prev, travelers: value }))}>
                <SelectTrigger className="text-right">
                  <SelectValue placeholder="اختر العدد" />
                </SelectTrigger>
                <SelectContent>
                  {travelerNumbers.map((num) => (
                    <SelectItem key={num} value={num}>{num}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Phone */}
          <div className="space-y-2 text-right">
            <Label className="text-right block mb-2 font-semibold">رقم الهاتف <span className="text-red-500">*</span></Label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="مثال: +96522289080"
              className="text-right"
              dir="rtl"
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-2 text-right">
            <Label className="text-right block mb-2 font-semibold">البريد الإلكتروني</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="example@email.com"
              className="text-right"
              dir="rtl"
            />
          </div>

          {/* Previous Visa */}
          <div className="space-y-2 text-right">
            <Label className="text-right block mb-2 font-semibold">هل لديك تأشيرة سابقة؟</Label>
            <Select value={formData.hasPreviousVisa} onValueChange={(value) => setFormData(prev => ({ ...prev, hasPreviousVisa: value }))}>
              <SelectTrigger className="text-right">
                <SelectValue placeholder="اختر الإجابة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="نعم">نعم</SelectItem>
                <SelectItem value="لا">لا</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* How did you know us */}
          <div className="space-y-2 text-right">
            <Label className="text-right block mb-2 font-semibold">كيف تعرفت علينا؟</Label>
            <Input
              value={formData.howDidYouKnowUs}
              onChange={(e) => setFormData(prev => ({ ...prev, howDidYouKnowUs: e.target.value }))}
              placeholder="مثال: من خلال صديق، إعلان، وسائل التواصل الاجتماعي"
              className="text-right"
              dir="rtl"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1" size="lg">
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  جاري التقديم…
                </div>
              ) : "التقديم الآن"}
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="flex-1" size="lg">
              إلغاء
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default VisaForm;