import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Search, MapPin, Calendar, Users, Star, DollarSign, Filter } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { CityAutocomplete } from "@/components/CityAutocomplete";

interface HotelResult {
  id: string;
  name: string;
  location: string;
  price: number;
  currency: string;
  rating: number;
  image: string;
  amenities: string[];
  provider: string;
  bookingUrl: string;
  description: string;
}

const AdminHotels = () => {
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState<HotelResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState<'price-low' | 'price-high' | 'rating'>('price-low');
  
  // Search form state
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("2");
  const [rooms, setRooms] = useState("1");

  const searchHotels = async () => {
    if (!destination.trim() || !checkIn || !checkOut) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Call AI-powered hotel search API
      const { data, error } = await supabase.functions.invoke('search-hotels', {
        body: {
          destination,
          checkIn,
          checkOut,
          guests: parseInt(guests),
          rooms: parseInt(rooms),
        }
      });

      if (error) {
        throw new Error('فشل في البحث عن الفنادق');
      }

      setSearchResults(data.hotels || []);
      
      toast({
        title: "تم البحث",
        description: `تم العثور على ${data.hotels?.length || 0} فندق`,
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في البحث عن الفنادق. تأكد من الاتصال بالإنترنت",
        variant: "destructive",
      });
      
      // Mock data for demo purposes
      const mockResults: HotelResult[] = [
        {
          id: "1",
          name: "فندق الريتز كارلتون",
          location: "الرياض، المملكة العربية السعودية",
          price: 1200,
          currency: "SAR",
          rating: 4.8,
          image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300",
          amenities: ["مسبح", "سبا", "مطعم", "واي فاي مجاني"],
          provider: "Booking.com",
          bookingUrl: "https://booking.com",
          description: "فندق فاخر في قلب الرياض مع خدمات عالمية المستوى"
        },
        {
          id: "2",
          name: "منتجع الفور سيزونز",
          location: "الرياض، المملكة العربية السعودية",
          price: 950,
          currency: "SAR",
          rating: 4.6,
          image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=300",
          amenities: ["مسبح", "ملعب جولف", "مطعم", "خدمة الغرف"],
          provider: "Expedia",
          bookingUrl: "https://expedia.com",
          description: "منتجع راقي مع إطلالات خلابة وخدمات متميزة"
        }
      ];
      setSearchResults(mockResults);
    } finally {
      setLoading(false);
    }
  };

  const sortedResults = [...searchResults].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button 
              onClick={() => navigate("/admin")} 
              variant="outline" 
              size="sm"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              العودة للوحة الإدارة
            </Button>
            <h1 className="text-2xl font-bold">البحث عن الفنادق</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6 space-y-6">
        {/* Search Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              البحث عن الفنادق
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="space-y-2">
                <Label htmlFor="destination">الوجهة</Label>
                <CityAutocomplete
                  value={destination}
                  onChange={setDestination}
                  placeholder="أدخل اسم المدينة..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="checkin">تاريخ الوصول</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="checkin"
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="checkout">تاريخ المغادرة</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="checkout"
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="guests">عدد الأشخاص</Label>
                <Select value={guests} onValueChange={setGuests}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? 'شخص' : 'أشخاص'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="rooms">عدد الغرف</Label>
                <Select value={rooms} onValueChange={setRooms}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[1, 2, 3, 4].map((num) => (
                      <SelectItem key={num} value={num.toString()}>
                        {num} {num === 1 ? 'غرفة' : 'غرف'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Separator className="my-4" />

            <Button 
              onClick={searchHotels} 
              disabled={loading}
              className="w-full md:w-auto"
            >
              <Search className="w-4 h-4 mr-2" />
              {loading ? 'جاري البحث...' : 'البحث عن الفنادق'}
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        {searchResults.length > 0 && (
          <>
            {/* Sort Controls */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                النتائج ({searchResults.length} فندق)
              </h2>
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price-low">السعر من الأقل للأعلى</SelectItem>
                    <SelectItem value="price-high">السعر من الأعلى للأقل</SelectItem>
                    <SelectItem value="rating">التقييم</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Hotel Results */}
            <div className="grid gap-4">
              {sortedResults.map((hotel) => (
                <Card key={hotel.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex flex-col md:flex-row">
                      <img
                        src={hotel.image}
                        alt={hotel.name}
                        className="w-full md:w-64 h-48 object-cover"
                      />
                      <div className="flex-1 p-6">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-xl font-semibold">{hotel.name}</h3>
                            <p className="text-muted-foreground flex items-center gap-1">
                              <MapPin className="w-4 h-4" />
                              {hotel.location}
                            </p>
                          </div>
                          <div className="text-left">
                            <div className="text-2xl font-bold">
                              {hotel.price} {hotel.currency}
                            </div>
                            <div className="text-sm text-muted-foreground">لكل ليلة</div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 mb-3">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{hotel.rating}</span>
                          <span className="text-sm text-muted-foreground">({hotel.provider})</span>
                        </div>

                        <p className="text-sm text-muted-foreground mb-3">
                          {hotel.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {hotel.amenities.map((amenity, index) => (
                            <Badge key={index} variant="secondary">
                              {amenity}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex justify-between items-center">
                          <Badge variant="outline">{hotel.provider}</Badge>
                          <Button asChild>
                            <a 
                              href={hotel.bookingUrl} 
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              احجز الآن
                            </a>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}

        {searchResults.length === 0 && !loading && (
          <Card>
            <CardContent className="text-center py-12">
              <Search className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                لم يتم البحث عن فنادق بعد. استخدم النموذج أعلاه للبحث عن أفضل الفنادق.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default AdminHotels;