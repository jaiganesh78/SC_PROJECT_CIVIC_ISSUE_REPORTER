import { useState, useEffect, useCallback } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  X, 
  Check, 
  MapPin, 
  Loader2,
  Navigation,
  AlertCircle
} from 'lucide-react';
import { GeoLocation } from '@/types';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with bundlers
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom pin icon for location picker
const pickerIcon = L.divIcon({
  className: 'custom-marker',
  html: `
    <div class="animate-bounce-slow">
      <svg width="40" height="50" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 0C7.164 0 0 7.164 0 16c0 12 16 24 16 24s16-12 16-24c0-8.836-7.164-16-16-16z" fill="hsl(var(--primary))"/>
        <circle cx="16" cy="16" r="6" fill="white"/>
      </svg>
    </div>
  `,
  iconSize: [40, 50],
  iconAnchor: [20, 50],
});

interface LocationPickerProps {
  onLocationSelect: (location: GeoLocation) => void;
  onCancel: () => void;
  initialLocation?: GeoLocation;
}

// Component to handle map clicks
function MapClickHandler({ 
  onLocationChange 
}: { 
  onLocationChange: (lat: number, lng: number) => void 
}) {
  useMapEvents({
    click: (e) => {
      onLocationChange(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

// Component to recenter map
function MapCenterUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  
  return null;
}

export function LocationPicker({ 
  onLocationSelect, 
  onCancel, 
  initialLocation 
}: LocationPickerProps) {
  const [selectedLocation, setSelectedLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(initialLocation || null);
  
  const [placeName, setPlaceName] = useState<string>(initialLocation?.place || '');
  const [isLoadingPlace, setIsLoadingPlace] = useState(false);
  const [isLocatingUser, setIsLocatingUser] = useState(false);
  const [error, setError] = useState<string>('');
  
  // Default center (Bangalore, India)
  const defaultCenter: [number, number] = [12.9716, 77.5946];
  const [mapCenter, setMapCenter] = useState<[number, number]>(
    initialLocation 
      ? [initialLocation.latitude, initialLocation.longitude] 
      : defaultCenter
  );

  // Reverse geocode to get place name
  const reverseGeocode = useCallback(async (lat: number, lng: number) => {
    setIsLoadingPlace(true);
    setPlaceName('');
    
    try {
      // Using Nominatim for reverse geocoding (free, no API key required)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'en',
          },
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        const place = data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        setPlaceName(place);
      } else {
        setPlaceName(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
      }
    } catch (err) {
      console.error('Reverse geocoding failed:', err);
      setPlaceName(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    } finally {
      setIsLoadingPlace(false);
    }
  }, []);

  const handleLocationChange = useCallback((lat: number, lng: number) => {
    setSelectedLocation({ latitude: lat, longitude: lng });
    reverseGeocode(lat, lng);
  }, [reverseGeocode]);

  const handleDetectCurrentLocation = useCallback(() => {
    setIsLocatingUser(true);
    setError('');

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setIsLocatingUser(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setSelectedLocation({ latitude, longitude });
        setMapCenter([latitude, longitude]);
        reverseGeocode(latitude, longitude);
        setIsLocatingUser(false);
      },
      (err) => {
        setError('Failed to detect location. Please enable GPS or select manually.');
        setIsLocatingUser(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, [reverseGeocode]);

  const handleConfirm = () => {
    if (selectedLocation && placeName) {
      onLocationSelect({
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
        place: placeName,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-card px-4 py-3">
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="mr-2 h-4 w-4" />
          Cancel
        </Button>
        <h2 className="font-semibold">Select Location</h2>
        <Button 
          size="sm" 
          onClick={handleConfirm}
          disabled={!selectedLocation || !placeName || isLoadingPlace}
        >
          <Check className="mr-2 h-4 w-4" />
          Confirm
        </Button>
      </div>

      {/* Instruction */}
      <div className="bg-primary/10 px-4 py-2 text-center">
        <p className="text-sm text-primary">
          <MapPin className="mr-1 inline-block h-4 w-4" />
          Tap on the map to select the issue location
        </p>
      </div>

      {/* Error alert */}
      {error && (
        <Alert variant="destructive" className="mx-4 mt-2">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Map */}
      <div className="relative flex-1">
        <MapContainer
          center={mapCenter}
          zoom={15}
          className="h-full w-full"
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MapClickHandler onLocationChange={handleLocationChange} />
          <MapCenterUpdater center={mapCenter} />
          
          {selectedLocation && (
            <Marker
              position={[selectedLocation.latitude, selectedLocation.longitude]}
              icon={pickerIcon}
            />
          )}
        </MapContainer>

        {/* Detect Current Location button */}
        <Button
          variant="secondary"
          size="sm"
          className="absolute bottom-20 right-4 z-[1000] shadow-lg"
          onClick={handleDetectCurrentLocation}
          disabled={isLocatingUser}
        >
          {isLocatingUser ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Navigation className="mr-2 h-4 w-4" />
          )}
          {isLocatingUser ? 'Detecting...' : 'Use Current Location'}
        </Button>
      </div>

      {/* Selected Location Info */}
      <div className="border-t border-border bg-card p-4">
        {selectedLocation ? (
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Selected Location</p>
              {isLoadingPlace ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span>Getting address...</span>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground line-clamp-2">{placeName}</p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-2 text-muted-foreground">
            <MapPin className="mr-2 h-4 w-4" />
            <span className="text-sm">No location selected</span>
          </div>
        )}
      </div>
    </div>
  );
}
