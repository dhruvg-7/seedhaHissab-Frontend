export type SearchResultType =
  | 'PROJECT'
  | 'TRANSACTION'
  | 'PERSONAL_TRANSACTION'
  | 'COUNTERPARTY'
  | 'CUSTOMER'
  | 'INSTALLMENT'
  | 'REMINDER'
  | 'MEMBER'
  | 'HIDDEN_PARTNER';

export type MatchedField =
  | 'NAME'
  | 'TITLE'
  | 'NOTE'
  | 'COUNTERPARTY'
  | 'AMOUNT'
  | 'EMAIL'
  | 'PURPOSE';

export interface SearchResult {
  id: string;
  type: SearchResultType;
  title: string;
  subtitle?: string;
  timestamp?: string;
  amount?: number;
  visibilityScope: 'OFFICIAL' | 'PRIVATE';
  linkedEntityType?: string;
  linkedEntityId?: string;
  badge?: string;
  status?: string;
  iconHint?: string;
  resultUrl?: string;
  matchedField?: MatchedField;
  score: number;
}

export interface GlobalSearchResponse {
  query: string;
  limit: number;
  offset: number;
  hasMore: boolean;
  total: number;
  results: SearchResult[];
}

export const SEARCH_TYPE_LABELS: Record<SearchResultType, string> = {
  PROJECT: 'Projects',
  TRANSACTION: 'Transactions',
  PERSONAL_TRANSACTION: 'Personal',
  COUNTERPARTY: 'Counterparties',
  CUSTOMER: 'Customers',
  INSTALLMENT: 'Installments',
  REMINDER: 'Reminders',
  MEMBER: 'Members',
  HIDDEN_PARTNER: 'Private',
};
