import { IssueCategory } from '@/types';
import { cn } from '@/lib/utils';
import { Trash2, Construction, Droplets, Lightbulb, Building2, HelpCircle } from 'lucide-react';

const legendItems: { category: IssueCategory; label: string; color: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { category: 'garbage_overflow', label: 'Garbage', color: 'bg-category-garbage', icon: Trash2 },
  { category: 'pothole', label: 'Pothole', color: 'bg-category-pothole', icon: Construction },
  { category: 'water_stagnation', label: 'Water', color: 'bg-category-water', icon: Droplets },
  { category: 'street_light_failure', label: 'Street Light', color: 'bg-category-streetlight', icon: Lightbulb },
  { category: 'hospital_infrastructure', label: 'Hospital', color: 'bg-category-hospital', icon: Building2 },
  { category: 'other', label: 'Other', color: 'bg-category-other', icon: HelpCircle },
];

interface MapLegendProps {
  className?: string;
}

export function MapLegend({ className }: MapLegendProps) {
  return (
    <div className={cn('glass-panel rounded-lg p-3', className)}>
      <h4 className="mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
        Legend
      </h4>
      <div className="space-y-1.5">
        {legendItems.map((item) => (
          <div key={item.category} className="flex items-center gap-2">
            <div className={cn('h-3 w-3 rounded-full', item.color)} />
            <item.icon className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-xs text-foreground">{item.label}</span>
          </div>
        ))}
      </div>
      
      {/* Priority indicator */}
      <div className="mt-3 border-t border-border pt-2">
        <h4 className="mb-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Priority
        </h4>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-priority-low" />
            <span className="text-xs text-muted-foreground">Low (&lt;40)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-priority-medium" />
            <span className="text-xs text-muted-foreground">Medium (40-60)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-priority-high animate-pulse-slow" />
            <span className="text-xs text-muted-foreground">High (60-80)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-priority-critical animate-pulse-fast" />
            <span className="text-xs text-muted-foreground">Critical (&gt;80)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
