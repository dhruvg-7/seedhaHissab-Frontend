import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { setToken } from '@/lib/auth';
import { setDemoMode } from '@/lib/demo';
import api from '@/lib/api';
import { LayoutGrid } from 'lucide-react';

export default function DemoPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api.post('/demo/login')
      .then(({ data }: { data: { token: string } }) => {
        if (cancelled) return;
        setToken(data.token);
        setDemoMode(true);
        navigate('/projects', { replace: true });
      })
      .catch(() => {
        if (!cancelled) setError('Could not start demo. Please try again.');
      });
    return () => { cancelled = true; };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6 text-center px-4">
      <div className="flex items-center gap-2">
        <img src="/logo.png" alt="SeedhaHissab" className="w-10 h-10 object-contain" />
        <span className="text-xl font-semibold tracking-tight text-foreground">SeedhaHissab</span>
      </div>

      {error ? (
        <div className="space-y-3">
          <p className="text-destructive text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:opacity-90"
          >
            Retry
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground text-sm justify-center">
            <span className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            Loading demo account…
          </div>
          <p className="text-xs text-muted-foreground">Setting up sample project data</p>
        </div>
      )}
    </div>
  );
}
