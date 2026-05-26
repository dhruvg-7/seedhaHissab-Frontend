import { useEffect, useRef, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Moon, Sun, LogOut, FolderKanban, User, Bell, ChevronDown, CircleUserRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';
import { getCurrentUserProfile, removeToken } from '@/lib/auth';
import { DemoBanner } from '@/components/demo-banner';
import { GlobalSearchBar } from '@/components/search/global-search-bar';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, setTheme } = useTheme();
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement | null>(null);
  const profile = getCurrentUserProfile();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  const isProjectsActive = location.pathname.startsWith('/projects');
  const isPersonalActive = location.pathname.startsWith('/personal');
  const isRemindersActive = location.pathname.startsWith('/reminders');

  return (
    <div className="min-h-screen bg-background">
      <DemoBanner />
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
          <Link to="/projects" className="flex items-center gap-2 font-semibold text-foreground hover:opacity-80 transition-opacity">
            <img src="/logo.png" alt="SeedhaHissab" className="w-6 h-6 object-contain" />
            <span className="text-lg tracking-tight">SeedhaHissab</span>
          </Link>
          <nav className="flex items-center gap-1 ml-2">
            <Link
              to="/projects"
              data-testid="nav-projects"
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-colors ${
                isProjectsActive
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <FolderKanban className="w-4 h-4" />
              <span className="hidden sm:inline">Projects</span>
            </Link>
            <Link
              to="/personal"
              data-testid="nav-personal"
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-colors ${
                isPersonalActive
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Personal</span>
            </Link>
            <Link
              to="/reminders"
              data-testid="nav-reminders"
              className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md transition-colors ${
                isRemindersActive
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              }`}
            >
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Reminders</span>
            </Link>
          </nav>
          <GlobalSearchBar />
          <div className="flex items-center gap-2 ml-auto">
            <Button
              variant="ghost"
              size="icon"
              data-testid="button-theme-toggle"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
            <div ref={profileRef} className="relative">
              <Button
                variant="ghost"
                className="gap-2 px-3"
                data-testid="button-profile-menu"
                onClick={() => setProfileOpen(v => !v)}
                aria-label="Profile menu"
              >
                <CircleUserRound className="w-4 h-4" />
                <span className="hidden sm:inline max-w-28 truncate text-left">
                  {profile.name ?? profile.email ?? 'Profile'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </Button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-lg border bg-popover p-2 shadow-lg z-50">
                  <div className="px-3 py-2 border-b border-border/60">
                    <p className="text-sm font-medium truncate">{profile.name ?? 'Unnamed user'}</p>
                    <p className="text-xs text-muted-foreground truncate">{profile.email ?? 'No email available'}</p>
                  </div>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-left text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                    onClick={handleLogout}
                    data-testid="button-logout"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {children}
      </main>
    </div>
  );
}
