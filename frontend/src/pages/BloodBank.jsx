import { useState } from 'react';

function BloodBank() {
  const [userLocation, setUserLocation] = useState(null);
  const [bloodBanks] = useState([
    { id: 1, name: "District Hospital Blood Bank", address: "Tilakwadi, Belagavi", phone: "0831-2405678", distance: "2.3 km", bloodGroups: "All groups available" },
    { id: 2, name: "KLE Blood Bank", address: "Nehru Nagar, Belagavi", phone: "0831-2444444", distance: "3.1 km", bloodGroups: "A+, B+, O+, AB+" },
    { id: 3, name: "BIMS Blood Bank", address: "Hindalga Road, Belagavi", phone: "0831-2555555", distance: "4.5 km", bloodGroups: "All groups available" },
    { id: 4, name: "Ashwini Blood Bank", address: "Shahapur, Belagavi", phone: "0831-2666666", distance: "5.2 km", bloodGroups: "O+, A+, B+" },
  ]);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          alert("Unable to get location. Please enable location services.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-3 bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">
          🩸 Find Nearest Blood Bank
        </h1>
        <p className="text-gray-600">Locate blood banks near you in Belagavi</p>
      </div>

      <button onClick={getUserLocation} className="btn-primary mb-6">
        📍 Get My Location
      </button>

      {userLocation && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-emerald-800">
            ✓ Location detected: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
          </p>
        </div>
      )}

      <div className="grid gap-4">
        {bloodBanks.map(bank => (
          <div key={bank.id} className="card hover:shadow-2xl transition-all">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-xl font-bold text-gray-800">{bank.name}</h3>
              <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold">
                {bank.distance}
              </span>
            </div>
            
            <div className="space-y-2 mb-4">
              <p className="text-gray-600 flex items-start">
                <span className="mr-2">📍</span>
                <span>{bank.address}</span>
              </p>
              <p className="text-gray-600 flex items-center">
                <span className="mr-2">📞</span>
                <a href={`tel:${bank.phone}`} className="text-blue-600 hover:underline">{bank.phone}</a>
              </p>
              <p className="text-gray-600 flex items-center">
                <span className="mr-2">🩸</span>
                <span className="text-sm">{bank.bloodGroups}</span>
              </p>
            </div>
            
            <div className="flex gap-3">
              <a
                href={`https://www.google.com/maps/search/${encodeURIComponent(bank.name + " " + bank.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                View on Map →
              </a>
              <a
                href={`tel:${bank.phone}`}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors"
              >
                Call Now
              </a>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="font-bold text-yellow-800 mb-2">⚠️ Emergency Blood Requirement?</h3>
        <p className="text-sm text-yellow-700">
          For urgent blood requirements, call 108 (Ambulance) or contact the nearest hospital directly.
        </p>
      </div>
    </div>
  );
}

export default BloodBank;
