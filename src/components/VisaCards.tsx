import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Papa from "papaparse";

interface VisaCountry {
  imageUrl: string;
  title: string;
  description: string;
  visaType1: string;
  visaType2: string;
  visaType3: string;
  visaType4: string;
}

interface VisaCardsProps {
  onCountrySelect: (country: string) => void;
}

const VisaCards = ({ onCountrySelect }: VisaCardsProps) => {
  const [countries, setCountries] = useState<VisaCountry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vTq7ssqGSA3hxGBNKesITPb0xI0h7ah9u-8Z5gjgbAg9OWjk3cYNQmvrgD06pf6eDuVf4s5ry6PwbGI/pub?output=csv";
      
      const response = await fetch(csvUrl);
      const csvText = await response.text();
      
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const parsedData = results.data.map((row: any) => ({
            imageUrl: row["رابط الصورة"] || row["Image URL"] || "",
            title: row["العنوان"] || row["Title"] || "",
            description: row["الوصف"] || row["Description"] || "",
            visaType1: row["نوع الفيزا 1"] || row["Visa Type 1"] || "",
            visaType2: row["نوع الفيزا 2"] || row["Visa Type 2"] || "",
            visaType3: row["نوع الفيزا 3"] || row["Visa Type 3"] || "",
            visaType4: row["نوع الفيزا 4"] || row["Visa Type 4"] || "",
          }));
          
          // Filter and sort countries
          const filteredCountries = parsedData.filter(country => country.title);
          
          // Define priority order for most popular destinations
          const priorityOrder = [
            "شنغن",
            "الولايات المتحدة",
            "الولايات المتحدة الأمريكية",
            "أمريكا",
            "كندا",
            "بريطانيا",
            "المملكة المتحدة",
            "أستراليا",
            "ألمانيا",
            "فرنسا",
            "إيطاليا",
            "إسبانيا"
          ];
          
          // Sort countries by priority
          const sortedCountries = filteredCountries.sort((a, b) => {
            const aIndex = priorityOrder.findIndex(p => 
              a.title.includes(p) || p.includes(a.title)
            );
            const bIndex = priorityOrder.findIndex(p => 
              b.title.includes(p) || p.includes(b.title)
            );
            
            if (aIndex === -1 && bIndex === -1) return 0;
            if (aIndex === -1) return 1;
            if (bIndex === -1) return -1;
            return aIndex - bIndex;
          });
          
          setCountries(sortedCountries);
          setLoading(false);
        },
        error: (error) => {
          console.error("Error parsing CSV:", error);
          setLoading(false);
        }
      });
    } catch (error) {
      console.error("Error fetching countries:", error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl">
        {countries.map((country, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow duration-300 cursor-pointer group">
            <CardHeader className="p-0">
              {country.imageUrl && (
                <div className="relative overflow-hidden rounded-t-lg h-48">
                  <img
                    src={country.imageUrl}
                    alt={country.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.currentTarget.src = "https://via.placeholder.com/400x200?text=صورة+غير+متوفرة";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/70 transition-all duration-300"></div>
                </div>
              )}
            </CardHeader>
            
            <CardContent className="p-6">
              <CardTitle className="text-xl font-bold mb-3 text-right">
                {country.title}
              </CardTitle>
              
              <p className="text-muted-foreground mb-4 text-right leading-relaxed">
                {country.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4 justify-center">
                {country.visaType1 && (
                  <Badge className="text-sm bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 hover:from-blue-600 hover:to-blue-700">
                    {country.visaType1}
                  </Badge>
                )}
                {country.visaType2 && (
                  <Badge className="text-sm bg-gradient-to-r from-green-500 to-green-600 text-white border-0 hover:from-green-600 hover:to-green-700">
                    {country.visaType2}
                  </Badge>
                )}
                {country.visaType3 && (
                  <Badge className="text-sm bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 hover:from-purple-600 hover:to-purple-700">
                    {country.visaType3}
                  </Badge>
                )}
                {country.visaType4 && (
                  <Badge className="text-sm bg-gradient-to-r from-orange-500 to-orange-600 text-white border-0 hover:from-orange-600 hover:to-orange-700">
                    {country.visaType4}
                  </Badge>
                )}
              </div>
              
              <Button 
                onClick={() => onCountrySelect(country.title)}
                className="w-full"
                size="lg"
              >
                طلب التأشيرة الآن
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VisaCards;