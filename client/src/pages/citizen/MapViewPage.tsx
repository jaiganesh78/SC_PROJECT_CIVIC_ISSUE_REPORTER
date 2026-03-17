import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { IssueMap } from '@/components/map/IssueMap';
import { MapLegend } from '@/components/map/MapLegend';
import { MapFilters } from '@/components/map/MapFilters';
import { IssueDetailModal } from '@/components/issues/IssueDetailModal';
import { Button } from '@/components/ui/button';
import { Filter, List, Plus, X, Focus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { demoIssues, filterIssues } from '@/data/demoIssues';
import { IssueFilters, Issue } from '@/types';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function MapViewPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<IssueFilters>({});
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get focused issue ID from URL params
  const focusedIssueId = searchParams.get('issueId');
  
  // Find the focused issue
  const focusedIssue = useMemo(() => {
    if (!focusedIssueId) return null;
    return demoIssues.find(issue => issue.id === focusedIssueId) || null;
  }, [focusedIssueId]);

  // Calculate map center and zoom based on focused issue
  const mapCenter: [number, number] = focusedIssue 
    ? [focusedIssue.latitude, focusedIssue.longitude]
    : [12.9716, 77.5946]; // Bangalore center
  
  const mapZoom = focusedIssue ? 16 : 12;

  // If there's a focused issue, show only that issue initially
  const displayedIssues = useMemo(() => {
    if (focusedIssue) {
      return [focusedIssue];
    }
    return filterIssues(demoIssues, filters);
  }, [focusedIssue, filters]);

  const handleIssueClick = (issue: Issue) => {
    setSelectedIssue(issue);
    setIsModalOpen(true);
  };

  const handleClearFocus = () => {
    setSearchParams({});
  };

  return (
    <MainLayout requireAuth allowedRoles={['citizen']}>
      <div className="relative h-[calc(100vh-4rem)]">
        {/* Map */}
        <IssueMap
          issues={displayedIssues}
          center={mapCenter}
          zoom={mapZoom}
          onIssueClick={handleIssueClick}
          highlightedIssueId={focusedIssueId || undefined}
          className="h-full w-full"
        />

        {/* Focused Issue Alert */}
        {focusedIssue && (
          <div className="absolute left-1/2 top-4 z-[1000] -translate-x-1/2">
            <Alert className="glass-panel flex items-center gap-3 border-primary/30 bg-primary/10 pr-2">
              <Focus className="h-4 w-4 text-primary" />
              <AlertDescription className="text-sm">
                Showing: <strong>{focusedIssue.summary}</strong>
              </AlertDescription>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 shrink-0"
                onClick={handleClearFocus}
              >
                <X className="h-4 w-4" />
              </Button>
            </Alert>
          </div>
        )}

        {/* Floating controls */}
        <div className="absolute left-4 right-4 top-4 z-[1000] flex items-start justify-between gap-4">
          {/* Left side - Legend */}
          <MapLegend className="hidden sm:block" />

          {/* Right side - Actions */}
          <div className="flex flex-col items-end gap-2">
            <div className="flex gap-2">
              {!focusedIssue && (
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
              )}
              <Button variant="secondary" size="sm" asChild className="glass-panel">
                <Link to="/issues">
                  <List className="mr-2 h-4 w-4" />
                  List View
                </Link>
              </Button>
              <Button size="sm" asChild>
                <Link to="/report">
                  <Plus className="mr-2 h-4 w-4" />
                  Report
                </Link>
              </Button>
            </div>

            {/* Filters panel */}
            {showFilters && !focusedIssue && (
              <MapFilters
                filters={filters}
                onFiltersChange={setFilters}
                onClose={() => setShowFilters(false)}
                className="w-80 animate-slide-in-right"
              />
            )}
          </div>
        </div>

        {/* Issue count indicator */}
        <div className="absolute bottom-4 left-4 z-[1000] glass-panel rounded-lg px-4 py-2">
          <p className="text-sm font-medium">
            <span className="text-primary">{displayedIssues.length}</span> 
            {focusedIssue ? ' issue focused' : ' issues on map'}
          </p>
        </div>

        {/* Mobile legend toggle */}
        <div className="absolute bottom-4 right-4 z-[1000] sm:hidden">
          <MapLegend />
        </div>
      </div>

      {/* Issue Detail Modal */}
      <IssueDetailModal
        issue={selectedIssue}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </MainLayout>
  );
}
