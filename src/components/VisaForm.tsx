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
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface VisaFormProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCountry?: string;
}

const countries = [
  "الكويت", "السعودية", "الإمارات العربية المتحدة", "قطر", "البحرين", "عُمان", "العراق", "الأردن", "لبنان", "سوريا",
  "مصر", "ليبيا", "تونس", "الجزائر", "المغرب", "السودان", "اليمن", "فلسطين", "الولايات المتحدة الأمريكية", "كندا",
  "المملكة المتحدة", "فرنسا", "ألمانيا", "إيطاليا", "إسبانيا", "هولندا", "بلجيكا", "سويسرا", "النمسا", "السويد",
  "النرويج", "الدنمارك", "فنلندا", "أستراليا", "نيوزيلندا", "اليابان", "كوريا الجنوبية", "الصين", "الهند", "تايلاند",
  "ماليزيا", "سنغافورة", "إندونيسيا", "الفلبين", "فيتنام", "تركيا", "إيران", "أفغانستان", "باكستان", "بنغلاديش",
  "روسيا", "أوكرانيا", "بولندا", "التشيك", "المجر", "رومانيا", "بلغاريا", "كرواتيا", "صربيا", "البوسنة والهرسك",
  "الجبل الأسود", "مقدونيا الشمالية", "ألبانيا", "مولدوفا", "بيلاروسيا", "ليتوانيا", "لاتفيا", "إستونيا", "البرازيل", "الأرجنتين",
  "شيلي", "كولومبيا", "بيرو", "الإكوادور", "فنزويلا", "أوروغواي", "باراغواي", "بوليفيا", "غيانا", "سورينام", "المكسيك",
  "غواتيمالا", "بليز", "هندوراس", "السلفادور", "نيكاراغوا", "كوستاريكا", "بنما", "جامايكا", "كوبا", "جمهورية الدومينيكان",
  "هايتي", "بربادوس", "ترينيداد وتوباغو", "جنوب أفريقيا", "نيجيريا", "كينيا", "إثيوبيا", "غانا", "المغرب", "تنزانيا"
];

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
    hasPreviousVisa: ""
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
      // Prepare data for Google Apps Script
      const submitData = {
        nationality: formData.nationality,
        destination: formData.destination,
        visaType: formData.visaType || "غير محدد",
        travelDate: formData.travelDate ? format(formData.travelDate, "yyyy-MM-dd") : "غير محدد",
        duration: formData.duration || "غير محدد",
        travelers: formData.travelers || "غير محدد",
        phone: formData.phone,
        email: formData.email || "غير محدد",
        hasPreviousVisa: formData.hasPreviousVisa || "غير محدد"
      };

      // Submit to Google Apps Script
      const response = await fetch("https://script.google.com/macros/s/AKfycbzrDGsBjkzLIiO3EZU4zfg8lbQQhxu_1por0lkvEkDI0x5XNuEIMGPv07hs-3qxo-eX/exec", {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData)
      });

      toast({
        title: "تم الإرسال بنجاح",
        description: "سيتم تحويلك إلى واتساب للمتابعة"
      });

      // Prepare WhatsApp message
      const whatsappMessage = `
مرحباً، أود طلب خدمة تأشيرة بالتفاصيل التالية:

📍 الجنسية: ${submitData.nationality}
🎯 الوجهة: ${submitData.destination}
📋 نوع التأشيرة: ${submitData.visaType}
📅 تاريخ السفر المتوقع: ${submitData.travelDate}
⏱️ المدة: ${submitData.duration}
👥 عدد المسافرين: ${submitData.travelers}
📱 رقم الهاتف: ${submitData.phone}
📧 البريد الإلكتروني: ${submitData.email}
✅ تأشيرة سابقة: ${submitData.hasPreviousVisa}

أرجو المتابعة مع طلبي، شكراً.
      `.trim();

      // Redirect to WhatsApp
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
            <div className="space-y-2">
              <Label>الجنسية</Label>
              <Select value={formData.nationality} onValueChange={(value) => setFormData(prev => ({ ...prev, nationality: value }))}>
                <SelectTrigger>
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
            <div className="space-y-2">
              <Label>الوجهة <span className="text-red-500">*</span></Label>
              <Select value={formData.destination} onValueChange={(value) => setFormData(prev => ({ ...prev, destination: value }))}>
                <SelectTrigger>
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
            <div className="space-y-2">
              <Label>نوع التأشيرة</Label>
              <Select value={formData.visaType} onValueChange={(value) => setFormData(prev => ({ ...prev, visaType: value }))}>
                <SelectTrigger>
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
            <div className="space-y-2">
              <Label>تاريخ السفر المتوقع</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.travelDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.travelDate ? format(formData.travelDate, "yyyy-MM-dd") : "اختر التاريخ"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.travelDate || undefined}
                    onSelect={(date) => setFormData(prev => ({ ...prev, travelDate: date || null }))}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label>المدة</Label>
              <Input
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                placeholder="مثال: 10 أيام، شهر واحد"
              />
            </div>

            {/* Number of Travelers */}
            <div className="space-y-2">
              <Label>عدد المسافرين</Label>
              <Select value={formData.travelers} onValueChange={(value) => setFormData(prev => ({ ...prev, travelers: value }))}>
                <SelectTrigger>
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
          <div className="space-y-2">
            <Label>رقم الهاتف <span className="text-red-500">*</span></Label>
            <Input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="مثال: +96522289080"
              required
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label>البريد الإلكتروني</Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              placeholder="example@email.com"
            />
          </div>

          {/* Previous Visa */}
          <div className="space-y-2">
            <Label>هل لديك تأشيرة سابقة؟</Label>
            <Select value={formData.hasPreviousVisa} onValueChange={(value) => setFormData(prev => ({ ...prev, hasPreviousVisa: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="اختر الإجابة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="نعم">نعم</SelectItem>
                <SelectItem value="لا">لا</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isSubmitting} className="flex-1" size="lg">
              {isSubmitting ? "جاري الإرسال..." : "التقديم الآن"}
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