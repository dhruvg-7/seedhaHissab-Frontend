import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ActivityFeed } from '@/components/activity/activity-feed';
import { usePersonalActivity } from '@/hooks/use-activity';
import type { ActivityItem } from '@/lib/activity-types';
import {
  ActivityFilterPanel,
  ACTIVITY_FILTERS_DEFAULT,
  type ActivityFilters,
} from '@/components/filters/activity-filter-panel';

const PAGE_LIMIT = 30;

export default function PersonalActivityPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<ActivityFilters>(ACTIVITY_FILTERS_DEFAULT);
  const [page, setPage] = useState(0);
  const [accumulated, setAccumulated] = useState<ActivityItem[]>([]);

  const { data, isFetching } = usePersonalActivity({
    page,
    limit: PAGE_LIMIT,
    type: filters.type === 'ALL' ? undefined : filters.type,
    visibilityScope: filters.visibilityScope === 'ALL' ? undefined : filters.visibilityScope,
    createdAfter: filters.createdAfter,
    createdBefore: filters.createdBefore,
  });

  const filterKey = `${filters.type}|${filters.visibilityScope}|${filters.createdAfter ?? ''}|${filters.createdBefore ?? ''}`;
  const [lastFilterKey, setLastFilterKey] = useState(filterKey);
  if (lastFilterKey !== filterKey) {
    setLastFilterKey(filterKey);
    setPage(0);
    setAccumulated([]);
  }

  if (data && data.page === page) {
    const seen = new Set(accumulated.map((i) => i.activityKey));
    const newOnes = data.items.filter((i) => !seen.has(i.activityKey));
    if (newOnes.length > 0) {
      setAccumulated((prev) => (page === 0 ? data.items : [...prev, ...newOnes]));
    } else if (page === 0 && accumulated.length === 0 && data.items.length > 0) {
      setAccumulated(data.items);
    }
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-6">
      <div className="mb-4 flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate('/personal')}
          data-testid="back-to-personal"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-xl font-semibold">Activity</h1>
          <p className="text-sm text-muted-foreground">Your personal finance narrative</p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <CardTitle className="text-base">What you did</CardTitle>
            <ActivityFilterPanel
              filters={filters}
              onChange={(f) => {
                setFilters(f);
                setPage(0);
              }}
              showPrivateFilter={false}
            />
          </div>
        </CardHeader>
        <CardContent>
          <ActivityFeed
            items={accumulated}
            loading={isFetching && accumulated.length === 0}
            emptyMessage="Your personal activity will appear here as you record transactions and reminders."
          />
          {data?.hasMore && (
            <div className="mt-4 flex justify-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => p + 1)}
                disabled={isFetching}
                data-testid="activity-load-more"
              >
                <ChevronDown className="mr-1 h-4 w-4" />
                {isFetching ? 'Loading…' : 'Load more'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
