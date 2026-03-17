import { useEffect } from 'react';
import L from 'leaflet';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Issue, IssueCategory, getPriorityLevel } from '@/types';
import { IssuePopupContent } from './IssuePopupContent';
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

// Category colors for markers
const categoryColors: Record<IssueCategory, string> = {
  garbage_overflow: '#22c55e',
  pothole: '#a16207',
  water_stagnation: '#0ea5e9',
  street_light_failure: '#eab308',
  hospital_infrastructure: '#ef4444',
  other: '#6b7280',
};

// Create custom marker icons based on category
function createCategoryIcon(
  category: IssueCategory, 
  priorityScore: number,
  isHighlighted: boolean = false
): L.DivIcon {
  const color = categoryColors[category];
  const priorityLevel = getPriorityLevel(priorityScore);
  
  let animationClass = '';
  if (isHighlighted) {
    animationClass = 'animate-pulse-fast';
  } else if (priorityLevel === 'high') {
    animationClass = 'animate-pulse-slow';
  } else if (priorityLevel === 'critical') {
    animationClass = 'animate-pulse-fast';
  }

  // Larger size for highlighted pins
  const size = isHighlighted ? 48 : 32;
  const height = isHighlighted ? 60 : 40;

  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div class="relative ${animationClass}">
        <svg width="${size}" height="${height}" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16 0C7.164 0 0 7.164 0 16c0 12 16 24 16 24s16-12 16-24c0-8.836-7.164-16-16-16z" fill="${color}" ${isHighlighted ? 'stroke="white" stroke-width="2"' : ''}/>
          <circle cx="16" cy="16" r="8" fill="white" fill-opacity="0.9"/>
        </svg>
        ${isHighlighted ? '<div class="absolute -inset-2 rounded-full border-2 border-primary animate-ping opacity-75"></div>' : ''}
      </div>
    `,
    iconSize: [size, height],
    iconAnchor: [size / 2, height],
    popupAnchor: [0, -height],
  });
}

interface IssueMapProps {
  issues: Issue[];
  center?: [number, number];
  zoom?: number;
  onIssueClick?: (issue: Issue) => void;
  highlightedIssueId?: string;
  className?: string;
}

// Component to handle map updates
function MapUpdater({ center, zoom }: { center?: [number, number]; zoom?: number }) {
  const map = useMap();
  
  useEffect(() => {
    if (center) {
      map.setView(center, zoom || map.getZoom());
    }
  }, [center, zoom, map]);
  
  return null;
}

export function IssueMap({ 
  issues, 
  center = [20.5937, 78.9629], // Default to India center
  zoom = 5,
  onIssueClick,
  highlightedIssueId,
  className = 'h-[500px] w-full'
}: IssueMapProps) {
  return (
    <div className={className}>
      <MapContainer
        center={center}
        zoom={zoom}
        className="h-full w-full rounded-lg"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater center={center} zoom={zoom} />
        
        {issues.map((issue) => (
          <Marker
            key={issue.id}
            position={[issue.latitude, issue.longitude]}
            icon={createCategoryIcon(
              issue.category, 
              issue.priority_score,
              issue.id === highlightedIssueId
            )}
            eventHandlers={{
              click: () => onIssueClick?.(issue),
            }}
          >
            <Popup maxWidth={320} minWidth={280}>
              <IssuePopupContent issue={issue} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
