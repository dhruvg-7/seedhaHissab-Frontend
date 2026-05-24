import { useState } from 'react';
import { SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FilterChipGroup, type FilterChip } from './filter-chip-group';

export interface InstallmentFilters {
  minAmount?: number;
  maxAmount?: number;
  dueAfter?: string;
  dueBefore?: string;
}

interface Props {
  filters: InstallmentFilters;
  onChange: (f: InstallmentFilters) => void;
}

export function InstallmentFilterPanel({ filters, onChange }: Props) {
  const [open, setOpen] = useState(false);

  const activeCount =
    (filters.dueAfter ? 1 : 0) +
    (filters.dueBefore ? 1 : 0) +
    (filters.minAmount != null ? 1 : 0) +
    (filters.maxAmount != null ? 1 : 0);

  const chips: FilterChip[] = [];
  if (filters.dueAfter)
    chips.push({
      key: 'after',
      label: `Due from ${filters.dueAfter}`,
      onRemove: () => onChange({ ...filters, dueAfter: undefined }),
    });
  if (filters.dueBefore)
    chips.push({
      key: 'before',
      label: `Due to ${filters.dueBefore}`,
      onRemove: () => onChange({ ...filters, dueBefore: undefined }),
    });
  if (filters.minAmount != null)
    chips.push({
      key: 'min',
      label: `Min ₹${filters.minAmount}`,
      onRemove: () => onChange({ ...filters, minAmount: undefined }),
    });
  if (filters.maxAmount != null)
    chips.push({
      key: 'max',
      label: `Max ₹${filters.maxAmount}`,
      onRemove: () => onChange({ ...filters, maxAmount: undefined }),
    });

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setOpen((o) => !o)}
          data-testid="button-installment-filters"
          className="h-8 gap-1.5"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          Filters
          {activeCount > 0 && (
            <span className="ml-0.5 bg-primary text-primary-foreground text-xs rounded-full w-4 h-4 flex items-center justify-center font-semibold leading-none">
              {activeCount}
            </span>
          )}
          {open ? (
            <ChevronUp className="w-3.5 h-3.5" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5" />
          )}
        </Button>
        {activeCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-muted-foreground text-xs"
            onClick={() => onChange({})}
            data-testid="button-clear-inst-filters"
          >
            Clear all
          </Button>
        )}
      </div>

      {chips.length > 0 && <FilterChipGroup chips={chips} />}

      {open && (
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Due from
              </Label>
              <Input
                type="date"
                className="h-8 text-sm"
                value={filters.dueAfter ?? ''}
                onChange={(e) =>
                  onChange({ ...filters, dueAfter: e.target.value || undefined })
                }
                data-testid="input-inst-due-after"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Due before
              </Label>
              <Input
                type="date"
                className="h-8 text-sm"
                value={filters.dueBefore ?? ''}
                onChange={(e) =>
                  onChange({ ...filters, dueBefore: e.target.value || undefined })
                }
                data-testid="input-inst-due-before"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Min amount (₹)
              </Label>
              <Input
                type="number"
                className="h-8 text-sm"
                min={0}
                placeholder="0"
                value={filters.minAmount ?? ''}
                onChange={(e) =>
                  onChange({
                    ...filters,
                    minAmount: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                data-testid="input-inst-min-amount"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Max amount (₹)
              </Label>
              <Input
                type="number"
                className="h-8 text-sm"
                min={0}
                placeholder="Any"
                value={filters.maxAmount ?? ''}
                onChange={(e) =>
                  onChange({
                    ...filters,
                    maxAmount: e.target.value ? Number(e.target.value) : undefined,
                  })
                }
                data-testid="input-inst-max-amount"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
