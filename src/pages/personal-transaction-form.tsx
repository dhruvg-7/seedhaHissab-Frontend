import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { apiGet, apiPost, apiPut } from '@/lib/api';
import { AuthGuard } from '@/components/auth-guard';
import { Layout } from '@/components/layout';
import {
  COUNTERPARTY_REQUIRED_TYPES,
  PERSONAL_TYPE_OPTIONS,
  counterpartyHelperText,
  type PersonalTransactionType,
  type Transaction,
  type CounterpartyDirection,
  type Counterparty,
} from '@/lib/types';
import {
  POSITIVE_LEDGER_TYPES,
  NEGATIVE_LEDGER_TYPES,
  formatAmount,
} from '@/lib/ledger-format';
import { useCounterpartyBalance } from '@/hooks/use-personal-ledger';

interface FormPayload {
  type: PersonalTransactionType;
  amount: number;
  counterpartyId?: string;
  counterpartyName?: string;
  purpose?: string;
  transactionDate: string;
}

/**
 * Computes what the counterparty's net balance will be *after* this
 * transaction is saved. Mirrors PersonalLedgerSign on the backend.
 *
 * For edits on the same counterparty we reverse the previous version's
 * contribution first so the projection isn't double-counted.
 */
function projectBalance(opts: {
  currentNet: number;
  type: PersonalTransactionType;
  amount: number;
  prev: Transaction | null;
  counterpartyName: string;
}): { newNet: number; direction: CounterpartyDirection } {
  let baseline = opts.currentNet;

  // Only reverse the prev version's contribution when:
  //   (a) it's against the same counterparty (so the server's summary
  //       includes it), and
  //   (b) the prev version is ACTIVE — an OMITTED prev is already excluded
  //       from cpSummary.netBalance, so reversing would double-subtract.
  if (
    opts.prev
    && opts.prev.status === 'ACTIVE'
    && opts.prev.counterpartyName
    && opts.prev.counterpartyName.trim().toLowerCase()
       === opts.counterpartyName.trim().toLowerCase()
  ) {
    const prevAmt = Number(opts.prev.amount);
    if (POSITIVE_LEDGER_TYPES.has(opts.prev.type)) baseline -= prevAmt;
    else if (NEGATIVE_LEDGER_TYPES.has(opts.prev.type)) baseline += prevAmt;
  }

  const amt = Number.isFinite(opts.amount) ? opts.amount : 0;
  let newNet = baseline;
  if (POSITIVE_LEDGER_TYPES.has(opts.type)) newNet += amt;
  else if (NEGATIVE_LEDGER_TYPES.has(opts.type)) newNet -= amt;

  const direction: CounterpartyDirection =
    newNet > 0 ? 'THEY_OWE_ME'
    : newNet < 0 ? 'I_OWE_THEM'
    : 'SETTLED';

  return { newNet, direction };
}

function projectedLine(name: string, p: { newNet: number; direction: CounterpartyDirection }): string {
  if (p.direction === 'THEY_OWE_ME') {
    return `After this: ${name} will owe you ₹${formatAmount(p.newNet)}`;
  }
  if (p.direction === 'I_OWE_THEM') {
    return `After this: you'll owe ${name} ₹${formatAmount(Math.abs(p.newNet))}`;
  }
  return `After this: settled with ${name}`;
}

export default function PersonalTransactionFormPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { id: editingId } = useParams<{ id: string }>();
  const isEdit = Boolean(editingId);

  const [type, setType] = useState<PersonalTransactionType>('EXPENSE');
  const [amount, setAmount] = useState('');
  const [counterpartyId, setCounterpartyId] = useState('');
  const [counterpartyName, setCounterpartyName] = useState('');
  const [counterpartyPhone, setCounterpartyPhone] = useState('');
  const [counterpartyAbout, setCounterpartyAbout] = useState('');
  const [debouncedCounterpartySearch, setDebouncedCounterpartySearch] = useState('');
  const [purpose, setPurpose] = useState('');
  const [transactionDate, setTransactionDate] = useState(() => new Date().toISOString().slice(0, 10));

  const { data: history, isLoading: historyLoading } = useQuery({
    queryKey: ['personal-tx-history', editingId],
    queryFn: () => apiGet<Transaction[]>(`/personal/transactions/${editingId}/history`),
    enabled: isEdit,
  });

  const latest = useMemo(() => {
    if (!history?.length) return null;
    return [...history].sort((a, b) => b.version - a.version)[0];
  }, [history]);

  useEffect(() => {
    if (!latest) return;
    setType(latest.type as PersonalTransactionType);
    setAmount(String(latest.amount));
    setCounterpartyId(latest.counterpartyId ?? '');
    setCounterpartyName(latest.counterpartyName ?? '');
    setPurpose(latest.purpose ?? '');
    setTransactionDate(latest.transactionDate);
  }, [latest]);

  useEffect(() => {
    const handle = window.setTimeout(() => setDebouncedCounterpartySearch(counterpartyName.trim()), 250);
    return () => window.clearTimeout(handle);
  }, [counterpartyName]);

  useEffect(() => {
    if (!counterpartyId && counterpartyName.trim()) {
      setCounterpartyPhone('');
      setCounterpartyAbout('');
    }
  }, [counterpartyId, counterpartyName]);

  const { data: counterpartyMatches, isFetching: counterpartySearchLoading } = useQuery({
    queryKey: ['counterparty-search', debouncedCounterpartySearch],
    queryFn: () => apiGet<Counterparty[]>('/counterparties/search', {
      q: debouncedCounterpartySearch || undefined,
    }),
    enabled: debouncedCounterpartySearch.length > 0,
  });

  const counterpartyRequired = COUNTERPARTY_REQUIRED_TYPES.includes(type);
  const trimmedCp = counterpartyName.trim();
  const helper = counterpartyHelperText(type, counterpartyName);

  const selectCounterparty = (counterparty: Counterparty) => {
    setCounterpartyId(counterparty.id);
    setCounterpartyName(counterparty.name);
    setCounterpartyPhone(counterparty.phoneNumber ?? '');
    setCounterpartyAbout(counterparty.about ?? '');
  };

  const createCounterpartyMutation = useMutation({
    mutationFn: (payload: { name: string; phoneNumber?: string; about?: string }) =>
      apiPost<Counterparty>('/counterparties', payload),
    onSuccess: (created) => {
      selectCounterparty(created);
      queryClient.invalidateQueries({ queryKey: ['counterparty-search'] });
      toast({ title: 'Person added' });
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        || 'Failed to add person';
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    },
  });

  // Live projected balance for the entered counterparty.
  const { summary: cpSummary, isLoading: cpLoading } = useCounterpartyBalance(counterpartyName);
  const numericAmount = Number(amount);
  const showProjection =
    !!trimmedCp
    && Number.isFinite(numericAmount)
    && numericAmount > 0
    && (POSITIVE_LEDGER_TYPES.has(type) || NEGATIVE_LEDGER_TYPES.has(type));

  const projection = showProjection && cpSummary
    ? projectBalance({
        currentNet: cpSummary.netBalance,
        type,
        amount: numericAmount,
        prev: latest,
        counterpartyName: trimmedCp,
      })
    : null;

  const mutation = useMutation({
    mutationFn: (payload: FormPayload) =>
      isEdit
        ? apiPut<Transaction>(`/personal/transactions/${editingId}`, payload)
        : apiPost<Transaction>('/personal/transactions', payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personal-transactions'] });
      queryClient.invalidateQueries({ queryKey: ['personal-summary'] });
      queryClient.invalidateQueries({ queryKey: ['personal-counterparties'] });
      queryClient.invalidateQueries({ queryKey: ['personal-counterparty-ledger'] });
      queryClient.invalidateQueries({ queryKey: ['personal-tx-history'] });
      toast({ title: isEdit ? 'Transaction updated' : 'Transaction added' });
      navigate(-1);
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
        || `Failed to ${isEdit ? 'update' : 'add'} transaction`;
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    },
  });

  const isValid =
    amount.trim() !== '' &&
    Number(amount) > 0 &&
    !!transactionDate &&
    (!counterpartyRequired || trimmedCp.length > 0 || counterpartyId.length > 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    mutation.mutate({
      type,
      amount: Number(amount),
      counterpartyId: counterpartyId || undefined,
      counterpartyName: trimmedCp || undefined,
      purpose: purpose.trim() || undefined,
      transactionDate,
    });
  };

  return (
    <AuthGuard>
      <Layout>
        <div className="max-w-xl mx-auto space-y-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)} data-testid="button-personal-back">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h1 className="text-2xl font-semibold tracking-tight">
              {isEdit ? 'Edit Personal Transaction' : 'Add Personal Transaction'}
            </h1>
          </div>

          {isEdit && historyLoading ? (
            <Card>
              <CardContent className="pt-6 space-y-3">
                {[1, 2, 3, 4, 5].map(i => <Skeleton key={i} className="h-10" />)}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="personal-type">Type</Label>
                    <Select value={type} onValueChange={v => setType(v as PersonalTransactionType)}>
                      <SelectTrigger id="personal-type" data-testid="select-personal-type">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {PERSONAL_TYPE_OPTIONS.map(opt => (
                          <SelectItem
                            key={opt.value}
                            value={opt.value}
                            data-testid={`option-personal-${opt.value.toLowerCase()}`}
                          >
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="personal-amount">Amount</Label>
                    <Input
                      id="personal-amount"
                      data-testid="input-personal-amount"
                      type="number"
                      inputMode="decimal"
                      min={0}
                      step="0.01"
                      value={amount}
                      onChange={e => setAmount(e.target.value)}
                      placeholder="0.00"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="personal-counterparty-search">
                      Search existing people
                      <span className="text-muted-foreground font-normal ml-1">
                        {counterpartyRequired ? '(required)' : '(optional)'}
                      </span>
                    </Label>
                    <Input
                      id="personal-counterparty-search"
                      data-testid="input-personal-counterparty"
                      value={counterpartyName}
                      onChange={e => {
                        setCounterpartyId('');
                        setCounterpartyName(e.target.value);
                      }}
                      placeholder="Search by name, phone, or description"
                      maxLength={255}
                    />
                    {counterpartySearchLoading && counterpartyName.trim() && (
                      <p className="text-xs text-muted-foreground italic">Searching people...</p>
                    )}
                    {debouncedCounterpartySearch && (counterpartyMatches ?? []).length > 0 && (
                      <div className="rounded-md border bg-background p-2 space-y-2 max-h-48 overflow-y-auto">
                        {counterpartyMatches?.map((person) => (
                          <button
                            key={person.id}
                            type="button"
                            className="w-full text-left rounded-md border border-transparent hover:border-border hover:bg-muted/50 px-3 py-2"
                            onClick={() => selectCounterparty(person)}
                          >
                            <p className="font-medium truncate">{person.name}</p>
                            {(person.about || person.phoneNumber) && (
                              <p className="text-xs text-muted-foreground truncate mt-0.5">
                                {person.about && person.about}
                                {person.about && person.phoneNumber && ' · '}
                                {person.phoneNumber && person.phoneNumber}
                              </p>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                    {debouncedCounterpartySearch && (counterpartyMatches ?? []).length === 0 && (
                      <p className="text-xs text-muted-foreground">No saved people match. Add one below.</p>
                    )}
                    <div className="rounded-md border bg-muted/20 p-3 space-y-3">
                      <div className="space-y-1.5">
                        <Label htmlFor="new-counterparty-name">Add new person</Label>
                        <Input
                          id="new-counterparty-name"
                          data-testid="input-personal-counterparty-name"
                          value={counterpartyId ? counterpartyName : counterpartyName}
                          onChange={e => {
                            setCounterpartyId('');
                            setCounterpartyName(e.target.value);
                          }}
                          placeholder="Name"
                          maxLength={255}
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label htmlFor="new-counterparty-phone">Phone number</Label>
                          <Input
                            id="new-counterparty-phone"
                            data-testid="input-personal-counterparty-phone"
                            value={counterpartyPhone}
                            onChange={e => setCounterpartyPhone(e.target.value)}
                            placeholder="98xxxxxxx"
                            maxLength={255}
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="new-counterparty-about">About</Label>
                          <Input
                            id="new-counterparty-about"
                            data-testid="input-personal-counterparty-about"
                            value={counterpartyAbout}
                            onChange={e => setCounterpartyAbout(e.target.value)}
                            placeholder="Electrician"
                            maxLength={1024}
                          />
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        disabled={createCounterpartyMutation.isPending || !counterpartyName.trim()}
                        onClick={() => createCounterpartyMutation.mutate({
                          name: counterpartyName.trim(),
                          phoneNumber: counterpartyPhone.trim() || undefined,
                          about: counterpartyAbout.trim() || undefined,
                        })}
                      >
                        {createCounterpartyMutation.isPending ? 'Adding...' : 'Add New Person'}
                      </Button>
                    </div>
                    {helper && (
                      <p className="text-xs text-muted-foreground" data-testid="text-personal-helper">
                        {helper}
                      </p>
                    )}
                    {showProjection && cpLoading && (
                      <p className="text-xs text-muted-foreground italic">Calculating new balance...</p>
                    )}
                    {showProjection && projection && !cpLoading && (
                      <p
                        className={`text-xs font-medium ${
                          projection.direction === 'THEY_OWE_ME' ? 'text-emerald-600 dark:text-emerald-400'
                          : projection.direction === 'I_OWE_THEM' ? 'text-rose-600 dark:text-rose-400'
                          : 'text-muted-foreground'
                        }`}
                        data-testid="text-personal-projection"
                      >
                        {projectedLine(trimmedCp, projection)}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="personal-date">Date</Label>
                    <Input
                      id="personal-date"
                      data-testid="input-personal-date"
                      type="date"
                      value={transactionDate}
                      onChange={e => setTransactionDate(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="personal-purpose">
                      Purpose
                      <span className="text-muted-foreground font-normal ml-1">(optional)</span>
                    </Label>
                    <Textarea
                      id="personal-purpose"
                      data-testid="input-personal-purpose"
                      value={purpose}
                      onChange={e => setPurpose(e.target.value)}
                      placeholder="What was this for?"
                      rows={3}
                      maxLength={1024}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    data-testid="button-personal-save"
                    disabled={!isValid || mutation.isPending}
                  >
                    {mutation.isPending
                      ? (isEdit ? 'Saving...' : 'Adding...')
                      : (isEdit ? 'Save Changes' : 'Save Transaction')}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </Layout>
    </AuthGuard>
  );
}
