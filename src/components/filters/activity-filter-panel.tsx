import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ActivityFilter } from '@/components/activity/activity-filter';
import { FilterChipGroup, type FilterChip } from './filter-chip-group';
import type { ActivityType, ActivityVisibilityScope } from '@/lib/activity-types';

export interface ActivityFilters {
  type: ActivityType | 'ALL';
  visibilityScope: ActivityVisibilityScope | 'ALL';
  createdAfter?: string;
  createdBefore?: string;
}

export const ACTIVITY_FILTERS_DEFAULT: ActivityFilters = {
  type: 'ALL',
  visibilityScope: 'ALL',
};

interface Props {
  filters: ActivityFilters;
  onChange: (f: ActivityFilters) => void;
  showPrivateFilter?: boolean;
}

/**
 * Extends the base ActivityFilter with date range controls and active-filter chips.
 * The backend now accepts createdAfter/createdBefore so we pass them through the hook.
 */
export function ActivityFilterPanel({
  filters,
  onChange,
  showPrivateFilter = true,
}: Props) {
  const chips: FilterChip[] = [];
  if (filters.createdAfter)
    chips.push({
      key: 'after',
      label: `From ${filters.createdAfter}`,
      onRemove: () => onChange({ ...filters, createdAfter: undefined }),
    });
  if (filters.createdBefore)
    chips.push({
      key: 'before',
      label: `To ${filters.createdBefore}`,
      onRemove: () => onChange({ ...filters, createdBefore: undefined }),
    });

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <ActivityFilter
          scope={filters.visibilityScope}
          onScopeChange={(s) => onChange({ ...filters, visibilityScope: s })}
          type={filters.type}
          onTypeChange={(t) => onChange({ ...filters, type: t })}
          showPrivateFilter={showPrivateFilter}
        />
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Label className="text-xs text-muted-foreground whitespace-nowrap sr-only">
              From
            </Label>
            <Input
              type="date"
              className="h-8 text-xs w-36"
              value={filters.createdAfter ?? ''}
              onChange={(e) =>
                onChange({ ...filters, createdAfter: e.target.value || undefined })
              }
              placeholder="From date"
              data-testid="input-activity-date-after"
            />
          </div>
          <span className="text-xs text-muted-foreground">–</span>
          <Input
            type="date"
            className="h-8 text-xs w-36"
            value={filters.createdBefore ?? ''}
            onChange={(e) =>
              onChange({ ...filters, createdBefore: e.target.value || undefined })
            }
            placeholder="To date"
            data-testid="input-activity-date-before"
          />
        </div>
      </div>
      {chips.length > 0 && <FilterChipGroup chips={chips} />}
    </div>
  );
}
