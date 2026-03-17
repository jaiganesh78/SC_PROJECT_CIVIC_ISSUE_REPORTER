import { IssueCategory, IssueStatus, IssueFilters } from '@/types';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { X, Filter, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MapFiltersProps {
  filters: IssueFilters;
  onFiltersChange: (filters: IssueFilters) => void;
  onClose: () => void;
  className?: string;
}

const categories: { value: IssueCategory; label: string }[] = [
  { value: 'garbage_overflow', label: 'Garbage Overflow' },
  { value: 'pothole', label: 'Pothole' },
  { value: 'water_stagnation', label: 'Water Stagnation' },
  { value: 'street_light_failure', label: 'Street Light Failure' },
  { value: 'hospital_infrastructure', label: 'Hospital Infrastructure' },
  { value: 'other', label: 'Other' },
];

const statuses: { value: IssueStatus; label: string }[] = [
  { value: 'pending', label: 'Pending' },
  { value: 'assigned', label: 'Assigned' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'resolved', label: 'Resolved' },
  { value: 'verified', label: 'Verified' },
  { value: 'rejected', label: 'Rejected' },
];

export function MapFilters({ filters, onFiltersChange, onClose, className }: MapFiltersProps) {
  const handleCategoryToggle = (category: IssueCategory, checked: boolean) => {
    const currentCategories = filters.category || [];
    const newCategories = checked
      ? [...currentCategories, category]
      : currentCategories.filter((c) => c !== category);
    onFiltersChange({ ...filters, category: newCategories.length ? newCategories : undefined });
  };

  const handleStatusToggle = (status: IssueStatus, checked: boolean) => {
    const currentStatuses = filters.status || [];
    const newStatuses = checked
      ? [...currentStatuses, status]
      : currentStatuses.filter((s) => s !== status);
    onFiltersChange({ ...filters, status: newStatuses.length ? newStatuses : undefined });
  };

  const handlePriorityChange = (value: number[]) => {
    onFiltersChange({
      ...filters,
      priority_min: value[0],
      priority_max: value[1],
    });
  };

  const handleReset = () => {
    onFiltersChange({});
  };

  return (
    <div className={cn('glass-panel rounded-lg p-4', className)}>
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-primary" />
          <h3 className="font-semibold">Filters</h3>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" onClick={handleReset}>
            <RotateCcw className="mr-1 h-3 w-3" />
            Reset
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Categories */}
      <div className="mb-4">
        <Label className="mb-2 block text-sm font-medium">Categories</Label>
        <div className="grid grid-cols-2 gap-2">
          {categories.map((cat) => (
            <div key={cat.value} className="flex items-center gap-2">
              <Checkbox
                id={`cat-${cat.value}`}
                checked={filters.category?.includes(cat.value) ?? false}
                onCheckedChange={(checked) => handleCategoryToggle(cat.value, !!checked)}
              />
              <label
                htmlFor={`cat-${cat.value}`}
                className="text-sm text-muted-foreground cursor-pointer"
              >
                {cat.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Status */}
      <div className="mb-4">
        <Label className="mb-2 block text-sm font-medium">Status</Label>
        <div className="grid grid-cols-2 gap-2">
          {statuses.map((status) => (
            <div key={status.value} className="flex items-center gap-2">
              <Checkbox
                id={`status-${status.value}`}
                checked={filters.status?.includes(status.value) ?? false}
                onCheckedChange={(checked) => handleStatusToggle(status.value, !!checked)}
              />
              <label
                htmlFor={`status-${status.value}`}
                className="text-sm text-muted-foreground cursor-pointer"
              >
                {status.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Priority Range */}
      <div>
        <Label className="mb-2 block text-sm font-medium">
          Priority Score: {filters.priority_min ?? 0} - {filters.priority_max ?? 100}
        </Label>
        <Slider
          defaultValue={[filters.priority_min ?? 0, filters.priority_max ?? 100]}
          min={0}
          max={100}
          step={5}
          onValueChange={handlePriorityChange}
          className="mt-2"
        />
      </div>
    </div>
  );
}
