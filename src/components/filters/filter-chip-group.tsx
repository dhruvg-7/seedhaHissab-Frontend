import { X } from 'lucide-react';

export interface FilterChip {
  key: string;
  label: string;
  onRemove: () => void;
}

interface Props {
  chips: FilterChip[];
}

export function FilterChipGroup({ chips }: Props) {
  if (chips.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {chips.map((chip) => (
        <span
          key={chip.key}
          className="inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary border border-primary/20 font-medium"
        >
          {chip.label}
          <button
            onClick={chip.onRemove}
            className="ml-0.5 text-primary/60 hover:text-primary transition-colors"
            aria-label={`Remove filter: ${chip.label}`}
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
    </div>
  );
}
