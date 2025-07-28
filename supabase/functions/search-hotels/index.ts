import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface HotelSearchRequest {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  rooms: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { destination, checkIn, checkOut, guests, rooms }: HotelSearchRequest = await req.json();

    // Use OpenAI to generate realistic hotel search results
    const prompt = `
    Generate a realistic hotel search result for the following criteria:
    - Destination: ${destination}
    - Check-in: ${checkIn}
    - Check-out: ${checkOut}
    - Guests: ${guests}
    - Rooms: ${rooms}

    Please provide 5-8 realistic hotels with the following information for each:
    - Hotel name (in Arabic if destination is Arabic, otherwise in English)
    - Location
    - Price per night in appropriate local currency
    - Rating (1-5 stars with decimals)
    - Description
    - Amenities list
    - Booking provider (Booking.com, Expedia, Hotels.com, etc.)
    - Image URL from Unsplash
    
    Format the response as a valid JSON object with a "hotels" array.
    Make sure prices are realistic for the destination and dates.
    Include a variety of price ranges from budget to luxury.
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: 'You are a travel booking assistant that provides realistic hotel search results. Always respond with valid JSON format.' 
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get response from OpenAI');
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Parse the AI response as JSON
    let hotelResults;
    try {
      hotelResults = JSON.parse(aiResponse);
    } catch (e) {
      // Fallback data if JSON parsing fails
      hotelResults = {
        hotels: [
          {
            id: "1",
            name: destination.includes('الرياض') || destination.includes('Riyadh') ? "فندق الريتز كارلتون الرياض" : "Luxury Hotel",
            location: destination,
            price: 800,
            currency: destination.includes('الرياض') || destination.includes('السعودية') ? "SAR" : "USD",
            rating: 4.5,
            image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300",
            amenities: ["مسبح", "سبا", "مطعم", "واي فاي مجاني"],
            provider: "Booking.com",
            bookingUrl: "https://booking.com",
            description: "فندق فاخر مع خدمات عالمية المستوى"
          }
        ]
      };
    }

    // Add IDs and booking URLs if missing
    if (hotelResults.hotels) {
      hotelResults.hotels = hotelResults.hotels.map((hotel: any, index: number) => ({
        ...hotel,
        id: hotel.id || `hotel_${index + 1}`,
        bookingUrl: hotel.bookingUrl || "https://booking.com",
      }));
    }

    return new Response(JSON.stringify(hotelResults), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in search-hotels function:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to search hotels',
      message: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});