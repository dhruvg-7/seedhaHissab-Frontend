import { Loader2, SearchX } from 'lucide-react';
import { SearchResultCard } from './search-result-card';
import { SEARCH_TYPE_LABELS } from '@/lib/search-types';
import type { SearchResult, SearchResultType } from '@/lib/search-types';

interface Props {
  results: SearchResult[];
  isLoading: boolean;
  query: string;
  hasMore: boolean;
  onSelect: (result: SearchResult) => void;
}

export function SearchResultsDropdown({
  results,
  isLoading,
  query,
  hasMore,
  onSelect,
}: Props) {
  const grouped = new Map<SearchResultType, SearchResult[]>();
  for (const r of results) {
    if (!grouped.has(r.type)) grouped.set(r.type, []);
    grouped.get(r.type)!.push(r);
  }

  return (
    <div className="absolute top-full left-0 right-0 mt-1.5 bg-card border border-border rounded-xl shadow-xl z-50 max-h-[480px] overflow-y-auto">
      {isLoading ? (
        <div className="flex items-center justify-center gap-2 py-8 text-muted-foreground text-sm">
          <Loader2 className="w-4 h-4 animate-spin" />
          Searching…
        </div>
      ) : results.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-10 text-muted-foreground">
          <SearchX className="w-5 h-5" />
          <p className="text-sm">
            No results for{' '}
            <strong className="text-foreground font-medium">"{query}"</strong>
          </p>
        </div>
      ) : (
        <div className="py-2">
          {[...grouped.entries()].map(([type, items]) => (
            <div key={type} className="mb-1">
              <p className="px-3 pt-1.5 pb-0.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                {SEARCH_TYPE_LABELS[type]}
              </p>
              <div className="px-1">
                {items.map((r) => (
                  <SearchResultCard
                    key={`${r.type}:${r.id}`}
                    result={r}
                    onClick={() => onSelect(r)}
                  />
                ))}
              </div>
            </div>
          ))}
          {hasMore && (
            <div className="border-t border-border mt-1 px-3 py-2">
              <p className="text-xs text-muted-foreground text-center">
                More results available — refine your search to narrow down.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
