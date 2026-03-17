import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { IssueMap } from '@/components/map/IssueMap';
import { MapLegend } from '@/components/map/MapLegend';
import { MapFilters } from '@/components/map/MapFilters';
import { Button } from '@/components/ui/button';
import { Filter, List } from 'lucide-react';
import { Link } from 'react-router-dom';
import { demoIssues, filterIssues } from '@/data/demoIssues';
import { IssueFilters, Issue } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export default function StaffMapViewPage() {
  const { user } = useAuth();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<IssueFilters>({});

  // Filter to only show department's issues
  const departmentIssues = demoIssues.filter(
    issue => issue.assigned_department === user?.department ||
             ['assigned', 'in_progress'].includes(issue.status)
  );

  const filteredIssues = filterIssues(departmentIssues, filters);

  return (
    <MainLayout requireAuth allowedRoles={['department_staff']}>
      <div className="relative h-[calc(100vh-4rem)]">
        {/* Map */}
        <IssueMap
          issues={filteredIssues}
          center={[12.9716, 77.5946]}
          zoom={12}
          className="h-full w-full"
        />

        {/* Controls */}
        <div className="absolute left-4 right-4 top-4 z-[1000] flex items-start justify-between gap-4">
          <MapLegend className="hidden sm:block" />

          <div className="flex flex-col items-end gap-2">
            <div className="flex gap-2">
              <Button
                variant={showFilters ? 'default' : 'secondary'}
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="glass-panel"
              >
                <Filter className="mr-2 h-4 w-4" />
                Filters
              </Button>
              <Button variant="secondary" size="sm" asChild className="glass-panel">
                <Link to="/staff/assigned">
                  <List className="mr-2 h-4 w-4" />
                  List View
                </Link>
              </Button>
            </div>

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

        {/* Department indicator */}
        <div className="absolute bottom-4 left-4 z-[1000] glass-panel rounded-lg px-4 py-2">
          <p className="text-sm">
            <span className="font-medium text-primary">{user?.department}</span>
            <span className="text-muted-foreground"> • {filteredIssues.length} issues</span>
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
