import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FlightSearchRequest {
  from: string;
  to: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  class: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { from, to, departureDate, returnDate, passengers, class: travelClass }: FlightSearchRequest = await req.json();

    // Use OpenAI to generate realistic flight search results
    const prompt = `
    Generate realistic flight search results for the following criteria:
    - From: ${from}
    - To: ${to}
    - Departure Date: ${departureDate}
    ${returnDate ? `- Return Date: ${returnDate}` : '- One-way trip'}
    - Passengers: ${passengers}
    - Class: ${travelClass}

    Please provide 5-8 realistic flights with the following information for each:
    - Airline name (use real airlines that operate in these regions)
    - Flight number
    - Departure airport code and city
    - Arrival airport code and city
    - Departure time and date
    - Arrival time and date
    - Flight duration
    - Number of stops (0 for direct, 1-2 for connecting)
    - Price per person in appropriate currency
    - Booking provider (Skyscanner, Kayak, Expedia, etc.)
    - Travel class description
    - Baggage allowance

    Format the response as a valid JSON object with a "flights" array.
    Make sure times, durations, and prices are realistic.
    Include a mix of direct and connecting flights with appropriate price differences.
    Use real airport codes if possible.
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
            content: 'You are a flight booking assistant that provides realistic flight search results. Always respond with valid JSON format using real airline names and airport codes.' 
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
    let flightResults;
    try {
      flightResults = JSON.parse(aiResponse);
    } catch (e) {
      // Fallback data if JSON parsing fails
      flightResults = {
        flights: [
          {
            id: "1",
            airline: "طيران الإمارات",
            flightNumber: "EK123",
            departure: {
              airport: "RUH",
              city: from,
              time: "14:30",
              date: departureDate
            },
            arrival: {
              airport: "DXB",
              city: to,
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
          }
        ]
      };
    }

    // Add IDs and booking URLs if missing
    if (flightResults.flights) {
      flightResults.flights = flightResults.flights.map((flight: any, index: number) => ({
        ...flight,
        id: flight.id || `flight_${index + 1}`,
        bookingUrl: flight.bookingUrl || "https://skyscanner.com",
      }));
    }

    return new Response(JSON.stringify(flightResults), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in search-flights function:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to search flights',
      message: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});