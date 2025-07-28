import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { MapPin } from "lucide-react";

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
  const [open, setOpen] = useState(false);
  const [filteredCities, setFilteredCities] = useState<string[]>([]);

  useEffect(() => {
    if (value.length > 0) {
      const filtered = popularCities.filter(city =>
        city.toLowerCase().includes(value.toLowerCase()) ||
        city.includes(value)
      ).slice(0, 10);
      setFilteredCities(filtered);
    } else {
      setFilteredCities([]);
    }
  }, [value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={placeholder}
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setOpen(e.target.value.length > 0);
            }}
            onFocus={() => setOpen(value.length > 0)}
            className="pl-10"
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandGroup>
            {filteredCities.length === 0 && value.length > 0 && (
              <CommandEmpty>لا توجد مدن مطابقة</CommandEmpty>
            )}
            {filteredCities.map((city) => (
              <CommandItem
                key={city}
                onSelect={() => {
                  onChange(city);
                  setOpen(false);
                }}
              >
                <MapPin className="mr-2 h-4 w-4" />
                {city}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}