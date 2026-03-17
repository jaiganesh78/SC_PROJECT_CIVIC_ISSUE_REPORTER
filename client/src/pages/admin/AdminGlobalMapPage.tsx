import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { IssueMap } from '@/components/map/IssueMap';
import { MapLegend } from '@/components/map/MapLegend';
import { MapFilters } from '@/components/map/MapFilters';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { demoIssues, filterIssues } from '@/data/demoIssues';
import { IssueFilters } from '@/types';

export default function AdminGlobalMapPage() {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<IssueFilters>({});

  const filteredIssues = filterIssues(demoIssues, filters);

  return (
    <MainLayout requireAuth allowedRoles={['admin']}>
      <div className="relative h-[calc(100vh-4rem)]">
        {/* Map */}
        <IssueMap
          issues={filteredIssues}
          center={[12.9716, 77.5946]}
          zoom={11}
          className="h-full w-full"
        />

        {/* Controls */}
        <div className="absolute left-4 right-4 top-4 z-[1000] flex items-start justify-between gap-4">
          <MapLegend className="hidden sm:block" />

          <div className="flex flex-col items-end gap-2">
            <Button
              variant={showFilters ? 'default' : 'secondary'}
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="glass-panel"
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
              {Object.keys(filters).length > 0 && (
                <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary-foreground text-xs text-primary">
                  {Object.keys(filters).length}
                </span>
              )}
            </Button>

            {showFilters && (
              <MapFilters
                filters={filters}
                onFiltersChange={setFilters}
                onClose={() => setShowFilters(false)}
                className="w-80 animate-slide-in-right"
              />
            )}
          </div>
        </div>

        {/* Issue count */}
        <div className="absolute bottom-4 left-4 z-[1000] glass-panel rounded-lg px-4 py-2">
          <p className="text-sm font-medium">
            <span className="text-primary">{filteredIssues.length}</span> total issues
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
