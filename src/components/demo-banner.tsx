import { useState } from 'react';
import { isDemoMode, setDemoMode } from '@/lib/demo';
import { setToken } from '@/lib/auth';
import api from '@/lib/api';
import { RefreshCw, FlaskConical, X } from 'lucide-react';

export function DemoBanner() {
  const [resetting, setResetting] = useState(false);
  const [done, setDone] = useState(false);
  const [hidden, setHidden] = useState(false);

  if (!isDemoMode() || hidden) return null;

  async function handleReset() {
    setResetting(true);
    setDone(false);
    try {
      const { data } = await api.post('/demo/reset');
      setToken(data.token);
      setDemoMode(true);
      setDone(true);
      setTimeout(() => {
        window.location.href = '/projects';
      }, 800);
    } catch {
      setResetting(false);
    }
  }

  return (
    <div className="relative bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-800 px-4 py-2">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200 text-sm">
          <FlaskConical className="w-4 h-4 shrink-0" />
          <span className="font-medium">Demo Mode</span>
          <span className="text-amber-700/70 dark:text-amber-300/70 hidden sm:inline">
            — You're exploring sample data. Nothing here is real.
          </span>
        </div>

        <div className="flex items-center gap-2">
          {done && (
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              ✓ Reset complete
            </span>
          )}
          <button
            onClick={handleReset}
            disabled={resetting}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-md border border-amber-300 dark:border-amber-700 bg-amber-100 dark:bg-amber-900/50 text-amber-800 dark:text-amber-200 hover:bg-amber-200 dark:hover:bg-amber-900 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${resetting ? 'animate-spin' : ''}`} />
            {resetting ? 'Resetting…' : 'Reset Data'}
          </button>
          <button
            onClick={() => setHidden(true)}
            className="p-1 text-amber-500 hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
            aria-label="Dismiss demo banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
