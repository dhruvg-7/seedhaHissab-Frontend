import { Badge } from '@/components/ui/badge';
import { ResultIcon } from './result-icon';
import type { SearchResult } from '@/lib/search-types';

function formatAmount(val: number) {
  return (
    '₹\u202f' +
    new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(val)
  );
}

function formatTimestamp(ts: string) {
  return new Date(ts).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

interface Props {
  result: SearchResult;
  onClick: () => void;
}

export function SearchResultCard({ result, onClick }: Props) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-start gap-3 px-3 py-2.5 hover:bg-muted/50 transition-colors text-left rounded-md"
    >
      <ResultIcon type={result.type} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-medium text-foreground truncate">{result.title}</p>
          {result.amount != null && (
            <span className="text-xs font-semibold text-foreground whitespace-nowrap tabular-nums">
              {formatAmount(result.amount)}
            </span>
          )}
        </div>
        {result.subtitle && (
          <p className="text-xs text-muted-foreground truncate mt-0.5">{result.subtitle}</p>
        )}
        <div className="flex items-center gap-1.5 mt-1 flex-wrap">
          {result.visibilityScope === 'PRIVATE' && (
            <Badge variant="outline" className="text-xs py-0 px-1.5 h-4 font-normal">
              Private
            </Badge>
          )}
          {result.badge && (
            <Badge variant="secondary" className="text-xs py-0 px-1.5 h-4 font-normal">
              {result.badge}
            </Badge>
          )}
          {result.timestamp && (
            <span className="text-xs text-muted-foreground">
              {formatTimestamp(result.timestamp)}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}
