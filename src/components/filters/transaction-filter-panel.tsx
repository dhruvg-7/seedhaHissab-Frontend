import { useState } from 'react';
import { SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FilterChipGroup, type FilterChip } from './filter-chip-group';
import { TRANSACTION_TYPE_LABELS, type TransactionType } from '@/lib/types';

export interface TransactionFilters {
  type?: TransactionType;
  createdAfter?: string;
  createdBefore?: string;
  minAmount?: number;
  maxAmount?: number;
  counterpartyName?: string;
}

const PROJECT_TX_TYPES: TransactionType[] = [
  'EXPENSE',
  'INCOME',
  'VENDOR_SUPPLY',
  'VENDOR_PAYMENT',
  'PARTNER_SETTLEMENT',
  'PROFIT_WITHDRAWAL',
];

interface Props {
  filters: TransactionFilters;
  onChange: (f: TransactionFilters) => void;
  availableTypes?: TransactionType[];
}

export function TransactionFilterPanel({
  filters,
  onChange,
  availableTypes = PROJECT_TX_TYPES,
}: Props) {
  const [open, setOpen] = useState(false);

  const activeCount = (
    [
      filters.type,
      filters.createdAfter,
      filters.createdBefore,
      filters.counterpartyName,
    ] as (string | undefined)[]
  ).filter(Boolean).length +
    (filters.minAmount != null ? 1 : 0) +
    (filters.maxAmount != null ? 1 : 0);

  const chips: FilterChip[] = [];
  if (filters.type)
    chips.push({
      key: 'type',
      label: TRANSACTION_TYPE_LABELS[filters.type],
      onRemove: () => onChange({ ...filters, type: undefined }),
    });
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
  if (filters.counterpartyName)
    chips.push({
      key: 'cp',
      label: `"${filters.counterpartyName}"`,
      onRemove: () => onChange({ ...filters, counterpartyName: undefined }),
    });

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setOpen((o) => !o)}
          data-testid="button-transaction-filters"
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
            data-testid="button-clear-tx-filters"
          >
            Clear all
          </Button>
        )}
      </div>

      {chips.length > 0 && <FilterChipGroup chips={chips} />}

      {open && (
        <div className="rounded-lg border border-border bg-card p-4 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-medium text-muted-foreground">Type</Label>
              <Select
                value={filters.type ?? '__ALL__'}
                onValueChange={(v) =>
                  onChange({
                    ...filters,
                    type: v === '__ALL__' ? undefined : (v as TransactionType),
                  })
                }
              >
                <SelectTrigger
                  className="h-8 text-sm"
                  data-testid="select-tx-type-filter"
                >
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__ALL__">All types</SelectItem>
                  {availableTypes.map((t) => (
                    <SelectItem key={t} value={t}>
                      {TRANSACTION_TYPE_LABELS[t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                From date
              </Label>
              <Input
                type="date"
                className="h-8 text-sm"
                value={filters.createdAfter ?? ''}
                onChange={(e) =>
                  onChange({ ...filters, createdAfter: e.target.value || undefined })
                }
                data-testid="input-tx-date-after"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                To date
              </Label>
              <Input
                type="date"
                className="h-8 text-sm"
                value={filters.createdBefore ?? ''}
                onChange={(e) =>
                  onChange({ ...filters, createdBefore: e.target.value || undefined })
                }
                data-testid="input-tx-date-before"
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
                data-testid="input-tx-min-amount"
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
                data-testid="input-tx-max-amount"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium text-muted-foreground">
                Counterparty / vendor
              </Label>
              <Input
                className="h-8 text-sm"
                placeholder="Search name…"
                value={filters.counterpartyName ?? ''}
                onChange={(e) =>
                  onChange({
                    ...filters,
                    counterpartyName: e.target.value || undefined,
                  })
                }
                data-testid="input-tx-counterparty"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
