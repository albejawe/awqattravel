import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapPin, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface CityAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

const popularCities = [
  "الرياض", "جدة", "مكة المكرمة", "المدينة المنورة", "الدمام", "الطائف", "بريدة", "تبوك",
  "دبي", "أبو ظبي", "الشارقة", "عجمان", "الفجيرة", "رأس الخيمة", "أم القيوين",
  "الدوحة", "الكويت", "المنامة", "مسقط", "عمان", "بيروت", "دمشق", "بغداد",
  "القاهرة", "الإسكندرية", "شرم الشيخ", "الغردقة", "أسوان", "الأقصر",
  "لندن", "باريس", "روما", "مدريد", "برلين", "أمستردام", "براغ", "فيينا",
  "إسطنبول", "أنقرة", "أنطاليا", "بودروم", "كابادوكيا",
  "نيويورك", "لوس أنجلوس", "ميامي", "لاس فيغاس", "شيكاغو", "سان فرانسيسكو",
  "طوكيو", "أوساكا", "كيوتو", "هيروشيما", "نارا",
  "بانكوك", "بوكيت", "شيانغ ماي", "باتايا", "كرابي",
  "كوالالمبور", "لانكاوي", "بينانغ", "جوهور باهرو",
  "سنغافورة", "جاكرتا", "بالي", "يوجياكارتا",
  "مومباي", "نيودلهي", "غوا", "جايبور", "كيرالا", "أغرا"
];

export function CityAutocomplete({ value, onChange, placeholder }: CityAutocompleteProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredCities, setFilteredCities] = useState<string[]>([]);

  useEffect(() => {
    if (value.length > 0) {
      const filtered = popularCities.filter(city =>
        city.toLowerCase().includes(value.toLowerCase()) ||
        city.includes(value)
      ).slice(0, 8);
      setFilteredCities(filtered);
      setIsOpen(filtered.length > 0);
    } else {
      setFilteredCities([]);
      setIsOpen(false);
    }
  }, [value]);

  const handleCitySelect = (city: string) => {
    onChange(city);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => {
            if (filteredCities.length > 0) {
              setIsOpen(true);
            }
          }}
          className="pl-10"
        />
      </div>
      
      {isOpen && filteredCities.length > 0 && (
        <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-popover border rounded-md shadow-md">
          <ScrollArea className="max-h-60">
            <div className="p-1">
              {filteredCities.map((city) => (
                <Button
                  key={city}
                  variant="ghost"
                  className="w-full justify-start h-auto p-2 text-right"
                  onClick={() => handleCitySelect(city)}
                >
                  <MapPin className="ml-2 h-4 w-4 text-muted-foreground" />
                  <span>{city}</span>
                  {value === city && <Check className="mr-2 h-4 w-4" />}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
}