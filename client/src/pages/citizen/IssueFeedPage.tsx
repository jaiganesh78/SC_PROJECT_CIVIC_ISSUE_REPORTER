import { useState, useMemo } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { IssueCard } from '@/components/issues/IssueCard';
import { IssueDetailModal } from '@/components/issues/IssueDetailModal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Plus,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useIssues } from '@/hooks/useIssues';
import { useVoteIssue } from '@/hooks/useVoteIssue';
import { Issue } from '@/types';
import { useToast } from '@/hooks/use-toast';

export default function IssueFeedPage() {
  const { toast } = useToast();

  const { data: issues = [], isLoading } = useIssues();
  const voteMutation = useVoteIssue();

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'priority' | 'recent'>('priority');

  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleVote = async (issueId: string) => {
    try {
      await voteMutation.mutateAsync(issueId);

      toast({
        title: 'Vote recorded!',
        description: 'Priority updated',
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.response?.data?.message || 'Vote failed',
        variant: 'destructive',
      });
    }
  };

  const handleViewDetails = (issue: Issue) => {
    setSelectedIssue(issue);
    setIsModalOpen(true);
  };

  const filteredIssues = useMemo(() => {
    let filtered = [...issues];

    // 🔍 search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((issue: any) =>
        issue.description?.toLowerCase().includes(query) ||
        issue.category?.toLowerCase().includes(query) ||
        issue.place?.formatted?.toLowerCase().includes(query)
      );
    }

    // 🏷 category filter
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(
        (issue: any) => issue.category === categoryFilter
      );
    }

    // 📊 sort
    if (sortBy === 'priority') {
      filtered.sort((a: any, b: any) => b.priority_score - a.priority_score);
    } else {
      filtered.sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    return filtered;
  }, [issues, searchQuery, categoryFilter, sortBy]);

  // 🔥 LOADING STATE
  if (isLoading) {
    return (
      <MainLayout requireAuth allowedRoles={['user']}>
        <div className="flex justify-center py-10">
          <span>Loading issues...</span>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout requireAuth allowedRoles={['user']}>
      <div className="container py-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Issue Feed</h1>
            <p className="mt-1 text-muted-foreground">
              Browse and vote on civic issues in your area
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/map">
                <MapPin className="mr-2 h-4 w-4" />
                Map View
              </Link>
            </Button>
            <Button asChild>
              <Link to="/report">
                <Plus className="mr-2 h-4 w-4" />
                Report Issue
              </Link>
            </Button>
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-4 rounded-lg border border-border bg-card p-4 sm:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search issues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="garbage_overflow">Garbage Overflow</SelectItem>
              <SelectItem value="pothole">Pothole</SelectItem>
              <SelectItem value="water_stagnation">Water Stagnation</SelectItem>
              <SelectItem value="street_light_failure">Street Light</SelectItem>
              <SelectItem value="hospital_infrastructure">Hospital</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(v) => setSortBy(v as 'priority' | 'recent')}>
            <SelectTrigger className="w-full sm:w-36">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="priority">Priority</SelectItem>
              <SelectItem value="recent">Most Recent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <p className="mb-4 text-sm text-muted-foreground">
          Showing {filteredIssues.length} issues
        </p>

        <div className="space-y-4">
          {filteredIssues.length > 0 ? (
            filteredIssues.map((issue: any) => (
              <IssueCard
                key={issue._id}   // ✅ FIXED
                issue={issue}
                onVote={handleVote}
                onViewDetails={handleViewDetails}
                className="animate-fade-in"
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-border py-12">
              <SlidersHorizontal className="h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium">No issues found</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Try adjusting your filters or search query
              </p>
            </div>
          )}
        </div>
      </div>

      <IssueDetailModal
        issue={selectedIssue}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </MainLayout>
  );
}