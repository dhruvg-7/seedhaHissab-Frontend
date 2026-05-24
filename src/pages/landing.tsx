import { Link } from 'react-router-dom';
import { isAuthenticated } from '@/lib/auth';
import { useTheme } from '@/components/theme-provider';
import { Moon, Sun, ArrowRight, Check, Play } from 'lucide-react';

const appPath = () => (isAuthenticated() ? '/projects' : '/login');

const FEATURES = [
  {
    icon: '📁',
    title: 'Shared Projects',
    desc: 'Track income, expenses, members and settlements in one shared ledger. Everyone sees the same numbers.',
  },
  {
    icon: '👤',
    title: 'Personal Ledger',
    desc: 'Lend money, borrow money, remember who owes whom. No more awkward "bhai tu kitna dega" conversations.',
  },
  {
    icon: '📅',
    title: 'Installments & Receivables',
    desc: 'Create installment schedules for customers. Track pending, overdue, and received — before you forget.',
  },
  {
    icon: '⏱️',
    title: 'Activity Timeline',
    desc: 'See exactly what changed, who recorded it, and when. Disputes end here.',
  },
  {
    icon: '🔐',
    title: 'Role-Based Collaboration',
    desc: 'Owner, Editor, Accountant, Viewer. The right people see the right things.',
  },
  {
    icon: '🔔',
    title: 'Reminders',
    desc: 'Tie follow-ups to real money. Get reminded before a payment slips through the cracks.',
  },
  {
    icon: '🕐',
    title: 'Version History',
    desc: 'Every edit creates a record. Nothing disappears silently. The full story is always there.',
  },
  {
    icon: '🤝',
    title: 'Internal Share Tracking',
    desc: 'Track internal profit splits within a partner\'s share — without touching the official accounting.',
  },
  {
    icon: '⚖️',
    title: 'Partner Settlements',
    desc: 'Know exactly what each partner contributed, what profit they\'re owed, and what\'s outstanding.',
  },
];

const FLOW_STEPS = [
  { n: '01', label: 'Create a project', sub: 'Name it. That\'s it.' },
  { n: '02', label: 'Invite your team', sub: 'Assign roles. Control access.' },
  { n: '03', label: 'Record every rupee', sub: 'Income, expense, credit, payment.' },
  { n: '04', label: 'Track receivables', sub: 'Installments. Who hasn\'t paid yet.' },
  { n: '05', label: 'Settle with partners', sub: 'Auto-computed. No disputes.' },
  { n: '06', label: 'History preserved', sub: 'Always. Even after edits.' },
];

const FOR_WHO = [
  { emoji: '🏗️', type: 'Builders & Contractors', pain: 'Running three sites, five vendors, and twelve phone calls about payments that haven\'t come.' },
  { emoji: '🧾', type: 'Freelancers', pain: 'Tracking who owes what after months of "I\'ll pay next week."' },
  { emoji: '👨‍👩‍👧', type: 'Family Businesses', pain: 'Splitting profits without starting a family argument.' },
  { emoji: '🏪', type: 'Small Businesses', pain: 'Running operations out of WhatsApp groups and Excel sheets.' },
  { emoji: '📦', type: 'Traders & Shopkeepers', pain: 'Balancing credit given to customers vs. credit taken from suppliers.' },
  { emoji: '🤝', type: 'Small Teams', pain: 'Everyone knows the money\'s there. Nobody knows where it went.' },
];

const COMPARISON = [
  ['Feature', 'WhatsApp / Excel / Memory', 'SeedhaHissab'],
  ['Edit history', '❌ Gone forever', '✅ Full version chain'],
  ['Who did what', '❌ No idea', '✅ Actor on every entry'],
  ['Vendor balances', '❌ Spreadsheet formulas', '✅ Auto-computed ledger'],
  ['Pending payments', '❌ Memory + regret', '✅ Installment tracker'],
  ['Partner profit share', '❌ Excel arguments', '✅ Live settlement'],
  ['Collaboration', '❌ Forward screenshots', '✅ Role-based access'],
  ['Reminders', '❌ Sticky notes', '✅ Tied to actual money'],
  ['Audit trail', '❌ None', '✅ Immutable record'],
];

export default function LandingPage() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background text-foreground font-sans antialiased">

      {/* ── NAV ── */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="SeedhaHissab" className="w-6 h-6 object-contain" />
            <span className="font-semibold text-base tracking-tight">SeedhaHissab</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
            <Link
              to="/demo"
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-medium px-3 py-1.5 rounded-md border border-border hover:bg-muted/50 transition-colors text-foreground"
            >
              <Play className="w-3 h-3 fill-current" />
              Try Demo
            </Link>
            <Link
              to={appPath}
              className="text-sm font-medium text-primary hover:underline underline-offset-4 transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ── */}
      <section
        className="relative overflow-hidden py-24 sm:py-36 px-4"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--border)) 1px, transparent 0)`,
          backgroundSize: '28px 28px',
        }}
      >
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground mb-8 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Built from real operational problems
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-tight mb-6">
            Every project has money.
            <br />
            <span className="text-primary">Most of it gets lost in conversations.</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
            SeedhaHissab keeps the complete financial picture — across projects, people, and time.
            For builders, contractors, and teams who can't afford to forget.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/demo"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 transition-opacity shadow-md"
            >
              <Play className="w-4 h-4 fill-current" />
              Try Demo — No Sign Up
            </Link>
            <Link
              to={appPath}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-border bg-card text-foreground font-medium text-sm hover:bg-muted/50 transition-colors"
            >
              Create Account
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <p className="text-xs text-muted-foreground mt-3">Demo loads instantly with real sample data — no account needed</p>
        </div>

        {/* Gradient fade bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent pointer-events-none" />
      </section>

      {/* ── CHAOS → CLARITY ── */}
      <section className="py-20 px-4 bg-card border-y border-border">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-muted-foreground text-center mb-12 font-medium">
            The current reality
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
            {['WhatsApp messages', 'Excel formulas', 'Phone calls', 'Memory', 'Notebooks'].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className="px-4 py-2.5 rounded-lg border border-border bg-background text-sm text-muted-foreground line-through decoration-destructive">
                  {item}
                </div>
                {i < 4 && <div className="hidden sm:block text-border text-xl font-light">→</div>}
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-3 mt-10">
            <div className="text-muted-foreground text-sm">leads to</div>
            <div className="flex flex-wrap justify-center gap-3">
              {['Missed payments', 'Profit disputes', 'Forgotten installments', 'Vendor confusion', 'Partner arguments'].map((pain, i) => (
                <span key={i} className="px-3 py-1.5 rounded-md bg-destructive/10 text-destructive text-sm font-medium border border-destructive/20">
                  {pain}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 mt-10">
            <div className="text-2xl">↓</div>
            <div className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-base shadow-lg">
              SeedhaHissab — one place for all of it
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-muted-foreground text-center mb-3 font-medium">
            What you can actually do
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-foreground mb-3 tracking-tight">
            Real features. Shipped.
          </h2>
          <p className="text-muted-foreground text-center mb-14 text-base max-w-xl mx-auto">
            No marketing fluff. Everything listed here works today.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="group p-5 rounded-xl border border-border bg-card hover:border-primary/30 hover:shadow-sm transition-all duration-200"
              >
                <div className="text-2xl mb-3">{f.icon}</div>
                <h3 className="font-semibold text-foreground mb-2 text-sm">{f.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 px-4 bg-card border-y border-border">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-muted-foreground text-center mb-3 font-medium">
            The product story
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-foreground mb-14 tracking-tight">
            Simple by design
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FLOW_STEPS.map((s, i) => (
              <div key={i} className="flex gap-4 items-start">
                <span className="text-3xl font-bold text-primary/20 tracking-tight font-mono leading-none mt-0.5">
                  {s.n}
                </span>
                <div>
                  <p className="font-semibold text-foreground text-sm">{s.label}</p>
                  <p className="text-muted-foreground text-sm mt-0.5">{s.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOR WHO ── */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-muted-foreground text-center mb-3 font-medium">
            Built for people who don't have ERP teams
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-foreground mb-3 tracking-tight">
            If money is messy, this is for you.
          </h2>
          <p className="text-muted-foreground text-center mb-14 text-base max-w-xl mx-auto">
            We didn't build for accountants. We built for the people accountants charge too much.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {FOR_WHO.map((w, i) => (
              <div key={i} className="p-5 rounded-xl border border-border bg-card">
                <div className="text-2xl mb-3">{w.emoji}</div>
                <h3 className="font-semibold text-foreground mb-2 text-sm">{w.type}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed italic">"{w.pain}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPARISON ── */}
      <section className="py-24 px-4 bg-card border-y border-border">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs uppercase tracking-widest text-muted-foreground text-center mb-3 font-medium">
            Why different
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-foreground mb-14 tracking-tight">
            The honest comparison
          </h2>
          <div className="rounded-xl border border-border overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {COMPARISON[0].map((col, i) => (
                    <th
                      key={i}
                      className={`px-4 py-3 text-left font-semibold ${i === 0 ? 'text-muted-foreground w-1/3' : i === 1 ? 'text-muted-foreground' : 'text-primary'}`}
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARISON.slice(1).map((row, i) => (
                  <tr key={i} className={`border-b border-border last:border-0 ${i % 2 === 0 ? '' : 'bg-muted/20'}`}>
                    <td className="px-4 py-3 text-foreground font-medium">{row[0]}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row[1]}</td>
                    <td className="px-4 py-3 text-foreground">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── HONESTY ── */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-6 font-medium">
            A note on honesty
          </p>
          <blockquote className="text-xl sm:text-2xl font-medium text-foreground leading-relaxed mb-6 tracking-tight">
            "SeedhaHissab is still evolving. Every feature comes from a real operational problem someone actually faced — not a product roadmap meeting."
          </blockquote>
          <p className="text-muted-foreground text-base leading-relaxed">
            We won't claim "10,000 businesses trust us." We will claim that the features
            listed here work, the data model is sound, and nothing gets silently deleted.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            {['No fake metrics', 'No dark patterns', 'No surprise deletions', 'No magic numbers'].map((t, i) => (
              <span key={i} className="flex items-center gap-1.5 text-sm text-muted-foreground border border-border rounded-full px-3 py-1">
                <Check className="w-3.5 h-3.5 text-emerald-500" /> {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── DEMO CTA ── */}
      <section className="py-20 px-4 border-t border-border bg-primary/5">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl border border-primary/20 bg-card p-8 sm:p-12 text-center shadow-sm">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-3 py-1 text-xs font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              Live demo — real data, real flows
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight mb-4">
              See it before you commit to anything.
            </h2>
            <p className="text-muted-foreground text-base max-w-xl mx-auto mb-8 leading-relaxed">
              The demo loads a real construction project — vendor ledgers, partner settlements, overdue installments, the works. Explore freely. Reset whenever you want.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to="/demo"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-base hover:opacity-90 transition-opacity shadow-md w-full sm:w-auto"
              >
                <Play className="w-5 h-5 fill-current" />
                Open Live Demo
              </Link>
              <Link
                to={appPath}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-border text-foreground font-medium text-base hover:bg-muted/50 transition-colors w-full sm:w-auto"
              >
                Create Free Account
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
            <div className="flex flex-wrap justify-center gap-6 mt-8 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" /> No signup required</span>
              <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" /> Full feature access</span>
              <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" /> Reset data anytime</span>
              <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-500" /> Shared demo account</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="py-24 px-4 border-t border-border">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-5 leading-tight">
            Run your money with fewer surprises.
          </h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Projects, people, payments — all in one place. No setup fee. No team of 10 required.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              to="/demo"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-border text-foreground font-semibold text-base hover:bg-muted/50 transition-colors"
            >
              <Play className="w-4 h-4 fill-current" />
              Try Demo First
            </Link>
            <Link
              to={appPath}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-base hover:opacity-90 transition-opacity shadow-lg"
            >
              Open SeedhaHissab
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <p className="text-muted-foreground text-xs mt-4">Free to start. No credit card.</p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-border py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="SeedhaHissab" className="w-5 h-5 object-contain" />
            <span className="font-medium text-foreground">SeedhaHissab</span>
          </div>
          <p>Built after living through messy accounting.</p>
          <div className="flex items-center gap-4">
            <Link to="/demo" className="hover:text-foreground transition-colors">
              Try Demo
            </Link>
            <Link to={appPath} className="hover:text-foreground transition-colors font-medium">
              Open App →
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
