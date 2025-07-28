import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Search, MapPin, Calendar, Users, Clock, DollarSign, Filter, Plane } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { supabase } from "@/integrations/supabase/client";

interface FlightResult {
  id: string;
  airline: string;
  flightNumber: string;
  departure: {
    airport: string;
    city: string;
    time: string;
    date: string;
  };
  arrival: {
    airport: string;
    city: string;
    time: string;
    date: string;
  };
  duration: string;
  stops: number;
  price: number;
  currency: string;
  provider: string;
  bookingUrl: string;
  class: string;
  baggage: string;
}

const AdminFlights = () => {
  const navigate = useNavigate();
  const [searchResults, setSearchResults] = useState<FlightResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState<'price-low' | 'price-high' | 'duration' | 'departure'>('price-low');
  
  // Search form state
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState("1");
  const [isRoundTrip, setIsRoundTrip] = useState(true);
  const [travelClass, setTravelClass] = useState("economy");

  const searchFlights = async () => {
    if (!from.trim() || !to.trim() || !departureDate) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    if (isRoundTrip && !returnDate) {
      toast({
        title: "خطأ",
        description: "يرجى تحديد تاريخ العودة للرحلة ذهاب وعودة",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Call AI-powered flight search API
      const { data, error } = await supabase.functions.invoke('search-flights', {
        body: {
          from,
          to,
          departureDate,
          returnDate: isRoundTrip ? returnDate : null,
          passengers: parseInt(passengers),
          class: travelClass,
        }
      });

      if (error) {
        throw new Error('فشل في البحث عن الرحلات');
      }

      setSearchResults(data.flights || []);
      
      toast({
        title: "تم البحث",
        description: `تم العثور على ${data.flights?.length || 0} رحلة`,
      });
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في البحث عن الرحلات. تأكد من الاتصال بالإنترنت",
        variant: "destructive",
      });
      
      // Mock data for demo purposes
      const mockResults: FlightResult[] = [
        {
          id: "1",
          airline: "طيران الإمارات",
          flightNumber: "EK123",
          departure: {
            airport: "RUH",
            city: "الرياض",
            time: "14:30",
            date: departureDate
          },
          arrival: {
            airport: "DXB",
            city: "دبي",
            time: "16:45",
            date: departureDate
          },
          duration: "2h 15m",
          stops: 0,
          price: 850,
          currency: "SAR",
          provider: "Skyscanner",
          bookingUrl: "https://skyscanner.com",
          class: "درجة اقتصادية",
          baggage: "حقيبة 23 كجم"
        },
        {
          id: "2",
          airline: "طيران ناس",
          flightNumber: "XY456",
          departure: {
            airport: "RUH",
            city: "الرياض",
            time: "08:15",
            date: departureDate
          },
          arrival: {
            airport: "DXB",
            city: "دبي",
            time: "10:30",
            date: departureDate
          },
          duration: "2h 15m",
          stops: 0,
          price: 650,
          currency: "SAR",
          provider: "Kayak",
          bookingUrl: "https://kayak.com",
          class: "درجة اقتصادية",
          baggage: "حقيبة يد فقط"
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
      case 'duration':
        return a.duration.localeCompare(b.duration);
      case 'departure':
        return a.departure.time.localeCompare(b.departure.time);
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
            <h1 className="text-2xl font-bold">البحث عن الرحلات</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-6 space-y-6">
        {/* Search Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              البحث عن الرحلات
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Trip Type */}
              <div className="flex items-center space-x-2">
                <Switch 
                  id="round-trip" 
                  checked={isRoundTrip}
                  onCheckedChange={setIsRoundTrip}
                />
                <Label htmlFor="round-trip">رحلة ذهاب وعودة</Label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="from">من</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="from"
                      placeholder="مدينة المغادرة..."
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="to">إلى</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="to"
                      placeholder="مدينة الوصول..."
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="departure">تاريخ المغادرة</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="departure"
                      type="date"
                      value={departureDate}
                      onChange={(e) => setDepartureDate(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {isRoundTrip && (
                  <div className="space-y-2">
                    <Label htmlFor="return">تاريخ العودة</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="return"
                        type="date"
                        value={returnDate}
                        onChange={(e) => setReturnDate(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="passengers">عدد المسافرين</Label>
                  <Select value={passengers} onValueChange={setPassengers}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6].map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} {num === 1 ? 'مسافر' : 'مسافرين'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="class">درجة السفر</Label>
                  <Select value={travelClass} onValueChange={setTravelClass}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="economy">اقتصادية</SelectItem>
                      <SelectItem value="premium">اقتصادية مميزة</SelectItem>
                      <SelectItem value="business">درجة رجال الأعمال</SelectItem>
                      <SelectItem value="first">الدرجة الأولى</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator className="my-4" />

              <Button 
                onClick={searchFlights} 
                disabled={loading}
                className="w-full md:w-auto"
              >
                <Search className="w-4 h-4 mr-2" />
                {loading ? 'جاري البحث...' : 'البحث عن الرحلات'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {searchResults.length > 0 && (
          <>
            {/* Sort Controls */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                النتائج ({searchResults.length} رحلة)
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
                    <SelectItem value="duration">مدة الرحلة</SelectItem>
                    <SelectItem value="departure">وقت المغادرة</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Flight Results */}
            <div className="grid gap-4">
              {sortedResults.map((flight) => (
                <Card key={flight.id} className="overflow-hidden">
                  <CardContent className="p-6">
                    <div className="flex flex-col lg:flex-row justify-between items-start gap-4">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Plane className="w-5 h-5 text-primary" />
                            <span className="font-semibold">{flight.airline}</span>
                            <Badge variant="outline">{flight.flightNumber}</Badge>
                          </div>
                          <Badge variant={flight.stops === 0 ? "default" : "secondary"}>
                            {flight.stops === 0 ? "مباشر" : `${flight.stops} توقف`}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-center">
                            <div className="text-2xl font-bold">{flight.departure.time}</div>
                            <div className="text-sm text-muted-foreground">{flight.departure.airport}</div>
                            <div className="text-sm text-muted-foreground">{flight.departure.city}</div>
                          </div>

                          <div className="flex-1 mx-8 text-center">
                            <div className="relative">
                              <div className="border-t border-dashed border-muted-foreground"></div>
                              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-background px-2">
                                <Clock className="w-4 h-4 text-muted-foreground" />
                              </div>
                            </div>
                            <div className="text-sm text-muted-foreground mt-1">{flight.duration}</div>
                          </div>

                          <div className="text-center">
                            <div className="text-2xl font-bold">{flight.arrival.time}</div>
                            <div className="text-sm text-muted-foreground">{flight.arrival.airport}</div>
                            <div className="text-sm text-muted-foreground">{flight.arrival.city}</div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary">{flight.class}</Badge>
                          <Badge variant="secondary">{flight.baggage}</Badge>
                          <Badge variant="outline">{flight.provider}</Badge>
                        </div>
                      </div>

                      <div className="text-center lg:text-right">
                        <div className="text-3xl font-bold text-primary mb-1">
                          {flight.price} {flight.currency}
                        </div>
                        <div className="text-sm text-muted-foreground mb-4">للشخص الواحد</div>
                        <Button asChild className="w-full lg:w-auto">
                          <a 
                            href={flight.bookingUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            احجز الآن
                          </a>
                        </Button>
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
              <Plane className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                لم يتم البحث عن رحلات بعد. استخدم النموذج أعلاه للبحث عن أفضل الرحلات.
              </p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default AdminFlights;