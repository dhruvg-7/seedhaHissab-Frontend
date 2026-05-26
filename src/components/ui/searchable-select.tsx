import { useEffect, useId, useMemo, useState } from 'react';
import { Check, ChevronDown, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export interface SearchableSelectOption {
  value: string;
  label: string;
  description?: string;
}

interface SearchableSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: SearchableSelectOption[];
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  allowClear?: boolean;
  disabled?: boolean;
}

export function SearchableSelect({
  value,
  onValueChange,
  options,
  placeholder = 'Search...'
  ,
  searchPlaceholder = 'Type to search...'
  ,
  emptyText = 'No matches found',
  allowClear = true,
  disabled = false,
}: SearchableSelectProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const selected = useMemo(
    () => options.find(option => option.value === value),
    [options, value],
  );

  useEffect(() => {
    if (!open) {
      setQuery(selected?.label ?? '');
    }
  }, [open, selected?.label]);

  const filtered = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return options;
    return options.filter(option => {
      const haystack = `${option.label} ${option.description ?? ''}`.toLowerCase();
      return haystack.includes(trimmed);
    });
  }, [options, query]);

  const commit = (nextValue: string) => {
    onValueChange(nextValue);
    setOpen(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Input
          id={id}
          value={open ? query : selected?.label ?? query}
          onFocus={() => {
            if (disabled) return;
            setOpen(true);
            setQuery(selected?.label ?? '');
          }}
          onChange={(event) => {
            if (disabled) return;
            setOpen(true);
            setQuery(event.target.value);
          }}
          onBlur={() => {
            window.setTimeout(() => setOpen(false), 120);
          }}
          placeholder={placeholder}
          autoComplete="off"
          disabled={disabled}
          className={cn('pr-14', disabled && 'cursor-not-allowed')}
          aria-expanded={open}
          aria-autocomplete="list"
          role="combobox"
        />
        <div className="absolute inset-y-0 right-1 flex items-center gap-1">
          {allowClear && value && !disabled && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
              onMouseDown={event => event.preventDefault()}
              onClick={() => {
                onValueChange('');
                setQuery('');
                setOpen(false);
              }}
              aria-label="Clear selection"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
          <ChevronDown className="h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {open && !disabled && (
        <div className="absolute z-20 mt-1 w-full overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md">
          <div className="max-h-60 overflow-y-auto p-1">
            {filtered.length > 0 ? (
              filtered.map(option => {
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    className={cn(
                      'flex w-full items-start gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-muted/60',
                      isSelected && 'bg-primary/10 text-foreground',
                    )}
                    onMouseDown={event => event.preventDefault()}
                    onClick={() => commit(option.value)}
                  >
                    <Check className={cn('mt-0.5 h-4 w-4 shrink-0', isSelected ? 'opacity-100' : 'opacity-0')} />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium">{option.label}</span>
                      {option.description && (
                        <span className="block truncate text-xs text-muted-foreground">
                          {option.description}
                        </span>
                      )}
                    </span>
                  </button>
                );
              })
            ) : (
              <div className="px-3 py-4 text-sm text-muted-foreground">{emptyText}</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}