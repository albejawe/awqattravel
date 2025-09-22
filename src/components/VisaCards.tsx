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
          }));
          setCountries(parsedData.filter(country => country.title));
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
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300"></div>
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
            
            <div className="flex flex-wrap gap-2 mb-4 justify-end">
              {country.visaType1 && (
                <Badge variant="secondary" className="text-sm">
                  {country.visaType1}
                </Badge>
              )}
              {country.visaType2 && (
                <Badge variant="secondary" className="text-sm">
                  {country.visaType2}
                </Badge>
              )}
              {country.visaType3 && (
                <Badge variant="secondary" className="text-sm">
                  {country.visaType3}
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
  );
};

export default VisaCards;