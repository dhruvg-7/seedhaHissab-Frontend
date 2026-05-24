import {
  FolderKanban,
  ArrowLeftRight,
  User,
  Users,
  BookUser,
  CalendarClock,
  Bell,
  UserCheck,
  EyeOff,
} from 'lucide-react';
import type { SearchResultType } from '@/lib/search-types';

const ICON_MAP: Record<SearchResultType, React.ReactNode> = {
  PROJECT:              <FolderKanban className="w-4 h-4" />,
  TRANSACTION:          <ArrowLeftRight className="w-4 h-4" />,
  PERSONAL_TRANSACTION: <User className="w-4 h-4" />,
  COUNTERPARTY:         <Users className="w-4 h-4" />,
  CUSTOMER:             <BookUser className="w-4 h-4" />,
  INSTALLMENT:          <CalendarClock className="w-4 h-4" />,
  REMINDER:             <Bell className="w-4 h-4" />,
  MEMBER:               <UserCheck className="w-4 h-4" />,
  HIDDEN_PARTNER:       <EyeOff className="w-4 h-4" />,
};

const COLOR_MAP: Record<SearchResultType, string> = {
  PROJECT:              'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  TRANSACTION:          'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
  PERSONAL_TRANSACTION: 'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400',
  COUNTERPARTY:         'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
  CUSTOMER:             'bg-cyan-100 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400',
  INSTALLMENT:          'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
  REMINDER:             'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400',
  MEMBER:               'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
  HIDDEN_PARTNER:       'bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400',
};

interface Props {
  type: SearchResultType;
  className?: string;
}

export function ResultIcon({ type, className = '' }: Props) {
  return (
    <div
      className={`flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0 ${COLOR_MAP[type]} ${className}`}
    >
      {ICON_MAP[type]}
    </div>
  );
}
