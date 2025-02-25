import React, { useState } from 'react';
import { MapPin } from 'lucide-react';

function App() {
  const [coordinate1, setCoordinate1] = useState("26.86296° N, 81.04288° E");
  const [coordinate2, setCoordinate2] = useState("26.86343° N, 81.04136° E");
  const [distance, setDistance] = useState<number | null>(null);
  const [error, setError] = useState<string>('');

  const parseCoordinate = (coord: string) => {
    try {
      const latMatch = coord.match(/(\d+\.\d+)°\s*([NS])/i);
      const lngMatch = coord.match(/(\d+\.\d+)°\s*([EW])/i);
      
      if (!latMatch || !lngMatch) {
        throw new Error("Invalid coordinate format");
      }
      
      const lat = parseFloat(latMatch[1]) * (latMatch[2].toUpperCase() === 'N' ? 1 : -1);
      const lng = parseFloat(lngMatch[1]) * (lngMatch[2].toUpperCase() === 'E' ? 1 : -1);
      
      return { lat, lng };
    } catch (error) {
      throw new Error("Invalid coordinate format");
    }
  };

  const calculateDistance = () => {
    try {
      // Parse coordinates
      const point1 = parseCoordinate(coordinate1);
      const point2 = parseCoordinate(coordinate2);
      
      // Validate coordinates
      if (Math.abs(point1.lat) > 90 || Math.abs(point1.lng) > 180 || 
          Math.abs(point2.lat) > 90 || Math.abs(point2.lng) > 180) {
        setError('Coordinates out of range');
        return;
      }

      setError('');

      // Haversine formula
      const R = 6371e3; // Earth's radius in meters
      const φ1 = point1.lat * Math.PI/180;
      const φ2 = point2.lat * Math.PI/180;
      const Δφ = (point2.lat - point1.lat) * Math.PI/180;
      const Δλ = (point2.lng - point1.lng) * Math.PI/180;

      const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                Math.cos(φ1) * Math.cos(φ2) *
                Math.sin(Δλ/2) * Math.sin(Δλ/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

      const d = R * c;
      setDistance(Math.round(d * 100) / 100);
    } catch (error) {
      setError('Please enter valid coordinates in format: DD.DDDDD° N/S, DD.DDDDD° E/W');
    }
  };

  return (
    <div className="min-h-screen font-sans bg-gray-100 text-gray-800">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="flex justify-center sm:justify-between items-center mb-4 sm:mb-8">
          <h1 className="text-xl sm:text-3xl font-bold flex items-center gap-2">
            <MapPin className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
            <span className="hidden sm:inline">Distance Calculator</span>
            <span className="sm:hidden">Distance Calc</span>
          </h1>
        </div>

        {/* Main Content */}
        <div className="max-w-md sm:max-w-2xl mx-auto rounded-xl p-4 sm:p-6 shadow-lg bg-white">
          <div className="space-y-4 sm:space-y-6">
            {/* First Coordinate */}
            <div className="space-y-2 sm:space-y-3">
              <h2 className="text-base sm:text-lg font-semibold">First Coordinate</h2>
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <input
                    type="text"
                    value={coordinate1}
                    onChange={(e) => setCoordinate1(e.target.value)}
                    placeholder="DD.DDDDD° N/S, DD.DDDDD° E/W"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg border bg-gray-50 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>
            </div>

            {/* Second Coordinate */}
            <div className="space-y-2 sm:space-y-3">
              <h2 className="text-base sm:text-lg font-semibold">Second Coordinate</h2>
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <input
                    type="text"
                    value={coordinate2}
                    onChange={(e) => setCoordinate2(e.target.value)}
                    placeholder="DD.DDDDD° N/S, DD.DDDDD° E/W"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base rounded-lg border bg-gray-50 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>
            </div>

            {/* Calculate Button */}
            <button
              onClick={calculateDistance}
              className="w-full py-2 sm:py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200 font-medium text-sm sm:text-base"
            >
              Calculate Distance
            </button>

            {/* Error Message */}
            {error && (
              <div className="text-red-500 text-center mt-2 font-medium text-sm sm:text-base">
                {error}
              </div>
            )}

            {/* Result */}
            {distance !== null && !error && (
              <div className="mt-4 sm:mt-6 p-4 sm:p-6 rounded-lg text-center bg-blue-50">
                <p className="text-base sm:text-lg font-medium mb-3 sm:mb-4">Distance:</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="p-3 sm:p-4 rounded-lg bg-white shadow">
                    <p className="text-xs sm:text-sm text-gray-500">Meters</p>
                    <p className="text-xl sm:text-2xl font-bold">{distance.toLocaleString()}</p>
                  </div>
                  <div className="p-3 sm:p-4 rounded-lg bg-white shadow">
                    <p className="text-xs sm:text-sm text-gray-500">Kilometers</p>
                    <p className="text-xl sm:text-2xl font-bold">{(distance / 1000).toLocaleString(undefined, {maximumFractionDigits: 2})}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;