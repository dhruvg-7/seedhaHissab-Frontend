import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, ArrowLeft, TrendingUp, TrendingDown, DollarSign, Users, Wallet, AlertTriangle, Lock, Activity, UserCog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { apiGet, apiPost } from '@/lib/api';
import { AuthGuard } from '@/components/auth-guard';
import { Layout } from '@/components/layout';
import { TransactionList } from '@/components/transaction-list';
import { VendorLedgerTable } from '@/components/vendor-ledger-table';
import { PartnerSettlementTable } from '@/components/partner-settlement-table';
import { RemindersWidget } from '@/components/reminders/reminders-widget';
import { InstallmentsWidget } from '@/components/installments/installments-widget';
import { InstallmentForm } from '@/components/installments/installment-form';
import { useInstallmentSummary } from '@/hooks/use-installments';
import type { Project, Partner, Vendor, ProjectSummaryResponse } from '@/lib/types';
import { motion } from 'framer-motion';

function formatAmount(val: number) {
  return new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(val);
}

export default function ProjectDashboardPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [partnerDialogOpen, setPartnerDialogOpen] = useState(false);
  const [vendorDialogOpen, setVendorDialogOpen] = useState(false);
  const [installmentDialogOpen, setInstallmentDialogOpen] = useState(false);
  const [partnerName, setPartnerName] = useState('');
  const [partnerShare, setPartnerShare] = useState('');
  const [vendorSearch, setVendorSearch] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [vendorPhone, setVendorPhone] = useState('');
  const [vendorAbout, setVendorAbout] = useState('');
  const [debouncedVendorSearch, setDebouncedVendorSearch] = useState('');

  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ['project', projectId],
    queryFn: () => apiGet<Project>(`/projects/${projectId}`),
    enabled: !!projectId,
  });

  const { data: summary, isLoading: summaryLoading } = useQuery({
    queryKey: ['project-summary', projectId],
    queryFn: () => apiGet<ProjectSummaryResponse>(`/projects/${projectId}/summary`),
    enabled: !!projectId,
  });

  const { data: partners } = useQuery({
    queryKey: ['partners', projectId],
    queryFn: () => apiGet<Partner[]>(`/projects/${projectId}/partners`),
    enabled: !!projectId,
  });

  const { data: vendors } = useQuery({
    queryKey: ['vendors', projectId],
    queryFn: () => apiGet<Vendor[]>(`/projects/${projectId}/vendors`),
    enabled: !!projectId,
  });

  useEffect(() => {
    const handle = window.setTimeout(() => setDebouncedVendorSearch(vendorSearch.trim()), 250);
    return () => window.clearTimeout(handle);
  }, [vendorSearch]);

  const { data: vendorMatches, isFetching: vendorSearchLoading } = useQuery({
    queryKey: ['vendor-search', debouncedVendorSearch],
    queryFn: () => apiGet<Vendor[]>('/vendors/search', { q: debouncedVendorSearch || undefined }),
    enabled: vendorDialogOpen,
  });

  const { data: installmentSummary } = useInstallmentSummary(projectId);

  const addPartnerMutation = useMutation({
    mutationFn: (data: { name: string; sharePercentage: number }) =>
      apiPost<Partner>(`/projects/${projectId}/partners`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners', projectId] });
      setPartnerDialogOpen(false);
      setPartnerName('');
      setPartnerShare('');
      toast({ title: 'Partner added' });
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to add partner';
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    },
  });

  const addVendorMutation = useMutation({
    mutationFn: (data: { name: string; phoneNumber?: string; about?: string }) =>
      apiPost<Vendor>(`/projects/${projectId}/vendors`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors', projectId] });
      queryClient.invalidateQueries({ queryKey: ['vendor-search'] });
      setVendorDialogOpen(false);
      setVendorName('');
      setVendorPhone('');
      setVendorAbout('');
      setVendorSearch('');
      toast({ title: 'Vendor added' });
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to add vendor';
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    },
  });

  const attachVendorMutation = useMutation({
    mutationFn: (vendorId: string) => apiPost<Vendor>(`/projects/${projectId}/vendors/${vendorId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vendors', projectId] });
      queryClient.invalidateQueries({ queryKey: ['vendor-search'] });
      setVendorDialogOpen(false);
      setVendorSearch('');
      setVendorName('');
      setVendorPhone('');
      setVendorAbout('');
      toast({ title: 'Vendor attached' });
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Failed to attach vendor';
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    },
  });

  return (
    <AuthGuard>
      <Layout>
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate('/projects')} data-testid="button-back">
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <div className="flex-1 min-w-0">
              {projectLoading ? (
                <Skeleton className="h-7 w-48" />
              ) : (
                <h1 className="text-2xl font-semibold tracking-tight truncate" data-testid="text-project-name">{project?.name}</h1>
              )}
              {project?.description && (
                <p className="text-sm text-muted-foreground mt-0.5">{project.description}</p>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                data-testid="button-project-members"
                onClick={() => navigate(`/projects/${projectId}/members`)}
              >
                <UserCog className="w-4 h-4 mr-2" />
                Members
              </Button>
              <Button
                variant="outline"
                data-testid="button-project-activity"
                onClick={() => navigate(`/projects/${projectId}/activity`)}
              >
                <Activity className="w-4 h-4 mr-2" />
                Activity
              </Button>
              <Button
                data-testid="button-add-transaction"
                onClick={() => navigate(`/projects/${projectId}/transactions/new`)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Transaction
              </Button>
            </div>
          </div>

          {summaryLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-24" />)}
            </div>
          ) : summary && (
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardContent className="py-4 px-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Total Income</p>
                      <p className="text-xl font-semibold mt-1 text-emerald-600 dark:text-emerald-400" data-testid="text-total-income">
                        {formatAmount(summary.totalIncome)}
                      </p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-emerald-500/30" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="py-4 px-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Total Expense</p>
                      <p className="text-xl font-semibold mt-1 text-rose-600 dark:text-rose-400" data-testid="text-total-expense">
                        {formatAmount(summary.totalExpense)}
                      </p>
                    </div>
                    <TrendingDown className="w-8 h-8 text-rose-500/30" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="py-4 px-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Net Profit</p>
                      <p className={`text-xl font-semibold mt-1 ${Number(summary.profit) >= 0 ? 'text-primary' : 'text-rose-600 dark:text-rose-400'}`} data-testid="text-profit">
                        {formatAmount(summary.profit)}
                      </p>
                    </div>
                    <DollarSign className="w-8 h-8 text-primary/20" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          <Tabs defaultValue="transactions">
            <TabsList data-testid="tabs-project">
              <TabsTrigger value="transactions" data-testid="tab-transactions">Transactions</TabsTrigger>
              <TabsTrigger value="vendors" data-testid="tab-vendors">Vendors</TabsTrigger>
              <TabsTrigger value="partners" data-testid="tab-partners">Partners</TabsTrigger>
              <TabsTrigger value="settlement" data-testid="tab-settlement">Settlement</TabsTrigger>
            </TabsList>

            <TabsContent value="transactions" className="mt-4 space-y-4">
              {installmentSummary &&
                (Number(installmentSummary.totalExpected) > 0 ||
                  Number(installmentSummary.totalReceived) > 0) && (
                <motion.div
                  className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card>
                    <CardContent className="py-4 px-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                            Receivables
                          </p>
                          <p
                            className="text-xl font-semibold mt-1"
                            data-testid="text-receivable-expected"
                          >
                            {formatAmount(Number(installmentSummary.totalExpected))}
                          </p>
                        </div>
                        <Wallet className="w-8 h-8 text-primary/20" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="py-4 px-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                            Pending
                          </p>
                          <p
                            className="text-xl font-semibold mt-1 text-amber-600 dark:text-amber-400"
                            data-testid="text-receivable-pending"
                          >
                            {formatAmount(Number(installmentSummary.totalPending))}
                          </p>
                        </div>
                        <DollarSign className="w-8 h-8 text-amber-500/30" />
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="py-4 px-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                            Overdue
                          </p>
                          <p
                            className="text-xl font-semibold mt-1 text-rose-600 dark:text-rose-400"
                            data-testid="text-receivable-overdue"
                          >
                            {formatAmount(Number(installmentSummary.totalOverdue))}
                          </p>
                        </div>
                        <AlertTriangle className="w-8 h-8 text-rose-500/30" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
              <InstallmentsWidget
                projectId={projectId!}
                onCreateClick={() => setInstallmentDialogOpen(true)}
              />
              <RemindersWidget
                projectId={projectId}
                title="Project reminders"
                testIdPrefix="project-reminders"
              />
              <TransactionList projectId={projectId!} />
            </TabsContent>

            <TabsContent value="vendors" className="mt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-medium">Vendors</h2>
                  <Button
                    size="sm"
                    variant="outline"
                    data-testid="button-add-vendor"
                    onClick={() => setVendorDialogOpen(true)}
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Add Vendor
                  </Button>
                </div>
                <VendorLedgerTable projectId={projectId!} />
              </div>
            </TabsContent>

            <TabsContent value="partners" className="mt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="font-medium">Partners</h2>
                  <Button
                    size="sm"
                    variant="outline"
                    data-testid="button-add-partner"
                    onClick={() => setPartnerDialogOpen(true)}
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Add Partner
                  </Button>
                </div>
                {partners && partners.length > 0 ? (
                  <div className="space-y-2">
                    {partners.map(p => (
                      <Card key={p.id}>
                        <CardContent className="py-3 px-4 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Users className="w-4 h-4 text-muted-foreground" />
                            <span className="font-medium" data-testid={`text-partner-name-${p.id}`}>{p.name}</span>
                          </div>
                          <Badge variant="secondary" data-testid={`text-partner-share-${p.id}`}>{p.sharePercentage}% share</Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">No partners yet</p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="settlement" className="mt-4 space-y-3">
              <PartnerSettlementTable projectId={projectId!} />
              <div className="rounded-md border border-dashed border-muted-foreground/30 px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-start gap-2">
                  <Lock className="w-4 h-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                  <div className="text-xs text-muted-foreground max-w-md">
                    <strong>Splitting your own share privately?</strong>{' '}
                    Track silent investors, family or off-the-books partners
                    on a private page. Nothing here changes the official
                    settlement above.
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  data-testid="button-open-private-ownership"
                  onClick={() => navigate(`/projects/${projectId}/private-ownership`)}
                >
                  Open private view
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <Dialog open={partnerDialogOpen} onOpenChange={setPartnerDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Partner</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div className="space-y-1.5">
                <Label>Partner name</Label>
                <Input
                  data-testid="input-partner-name"
                  value={partnerName}
                  onChange={e => setPartnerName(e.target.value)}
                  placeholder="e.g. Rahul Sharma"
                />
              </div>
              <div className="space-y-1.5">
                <Label>Share percentage</Label>
                <Input
                  type="number"
                  data-testid="input-partner-share"
                  value={partnerShare}
                  onChange={e => setPartnerShare(e.target.value)}
                  placeholder="e.g. 50"
                  min={0}
                  max={100}
                />
              </div>
              <Button
                className="w-full"
                data-testid="button-save-partner"
                disabled={addPartnerMutation.isPending || !partnerName.trim() || !partnerShare}
                onClick={() => addPartnerMutation.mutate({ name: partnerName.trim(), sharePercentage: Number(partnerShare) })}
              >
                {addPartnerMutation.isPending ? 'Adding...' : 'Add Partner'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {projectId && (
          <InstallmentForm
            open={installmentDialogOpen}
            onOpenChange={setInstallmentDialogOpen}
            projectId={projectId}
          />
        )}

        <Dialog open={vendorDialogOpen} onOpenChange={setVendorDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Attach or Add Vendor</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-2">
              <div className="space-y-1.5">
                <Label>Search existing vendors</Label>
                <Input
                  data-testid="input-vendor-search"
                  value={vendorSearch}
                  onChange={e => setVendorSearch(e.target.value)}
                  placeholder="Search by vendor name"
                />
              </div>

              {vendorSearch.trim() && (
                <div className="space-y-2 rounded-md border p-3">
                  {vendorSearchLoading ? (
                    <p className="text-sm text-muted-foreground">Searching vendors...</p>
                  ) : (vendorMatches ?? []).length > 0 ? (
                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                      {vendorMatches?.map((vendor) => (
                        <div key={vendor.id} className="flex items-start justify-between gap-3 rounded-md border bg-background px-3 py-2">
                          <div className="min-w-0">
                            <p className="font-medium truncate">{vendor.name}</p>
                            {(vendor.phoneNumber || vendor.about) && (
                              <p className="text-xs text-muted-foreground truncate">
                                {vendor.phoneNumber && vendor.phoneNumber}
                                {vendor.phoneNumber && vendor.about && ' · '}
                                {vendor.about && vendor.about}
                              </p>
                            )}
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={attachVendorMutation.isPending}
                            onClick={() => attachVendorMutation.mutate(vendor.id)}
                          >
                            Attach
                          </Button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">No existing vendor matches. Add it below.</p>
                  )}
                </div>
              )}

              <div className="space-y-3 rounded-md border p-3 bg-muted/20">
                <div className="space-y-1.5">
                  <Label>Add new vendor</Label>
                  <Input
                    data-testid="input-vendor-name"
                    value={vendorName}
                    onChange={e => setVendorName(e.target.value)}
                    placeholder="e.g. Steel Supplier Co."
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>Phone number (optional)</Label>
                  <Input
                    data-testid="input-vendor-phone"
                    value={vendorPhone}
                    onChange={e => setVendorPhone(e.target.value)}
                    placeholder="98xxxxxxx"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label>About / description (optional)</Label>
                  <Textarea
                    data-testid="input-vendor-about"
                    value={vendorAbout}
                    onChange={e => setVendorAbout(e.target.value)}
                    placeholder="e.g. Local steel and fabrication supplier"
                    rows={3}
                  />
                </div>
                <Button
                  className="w-full"
                  data-testid="button-save-vendor"
                  disabled={addVendorMutation.isPending || !vendorName.trim()}
                  onClick={() => addVendorMutation.mutate({
                    name: vendorName.trim(),
                    phoneNumber: vendorPhone.trim() || undefined,
                    about: vendorAbout.trim() || undefined,
                  })}
                >
                  {addVendorMutation.isPending ? 'Saving...' : 'Add Vendor'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </Layout>
    </AuthGuard>
  );
}
