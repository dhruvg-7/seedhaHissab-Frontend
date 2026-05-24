import { useQuery } from '@tanstack/react-query';
import { apiGet } from '@/lib/api';
import type { GlobalSearchResponse, SearchResultType } from '@/lib/search-types';

export interface SearchParams {
  q: string;
  type?: SearchResultType;
  projectId?: string;
  visibilityScope?: 'OFFICIAL' | 'PRIVATE';
  limit?: number;
  offset?: number;
}

export function useSearch(params: SearchParams) {
  const enabled = params.q.trim().length >= 2;
  return useQuery({
    queryKey: ['search', params],
    queryFn: () =>
      apiGet<GlobalSearchResponse>('/search', {
        q: params.q.trim(),
        ...(params.type ? { type: params.type } : {}),
        ...(params.projectId ? { projectId: params.projectId } : {}),
        ...(params.visibilityScope ? { visibilityScope: params.visibilityScope } : {}),
        limit: params.limit ?? 10,
        offset: params.offset ?? 0,
      }),
    enabled,
    staleTime: 30_000,
    placeholderData: (prev) => prev,
  });
}
