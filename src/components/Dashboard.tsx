"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { 
  Home,
  Shield,
  Settings,
  CreditCard,
  User,
  ChevronDown,
  ChevronsRight,
  Moon,
  Sun,
  Bell,
  Search,
  AlertTriangle,
  Activity,
  Globe,
  Eye,
  EyeOff,
  Copy,
  RotateCcw,
  Trash2,
  Plus,
  Download,
  FileText,
  Key,
  Lock,
  Smartphone,
  BarChart3,
  LineChart,
  AlertCircle,
  CheckCircle,
  Info,
  MoreVertical
} from 'lucide-react';
import { toast } from 'sonner';
import ProfileSettings from './ProfileSettings';
import ApiAnalytics from './ApiAnalytics';
import NotificationDropdown from './NotificationDropdown';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  key_hash: string;
  partner_id: string;
  is_active: boolean;
  created_at: string;
  last_used_at: string | null;
  expires_at: string | null;
  rate_limit_per_minute: number;
}

interface DeveloperProfile {
  partner_id: string;
  company_name: string | null;
  website: string | null;
  api_usage_plan: string;
  monthly_request_limit: number;
}

// Mock data
const mockTransactions = [
  { id: "TXN001", amount: 50000, country: "US", riskScore: 85, status: "flagged", timestamp: "2024-01-15 14:30" },
  { id: "TXN002", amount: 25000, country: "UK", riskScore: 45, status: "approved", timestamp: "2024-01-15 14:25" },
  { id: "TXN003", amount: 75000, country: "RU", riskScore: 95, status: "blocked", timestamp: "2024-01-15 14:20" },
  { id: "TXN004", amount: 15000, country: "DE", riskScore: 25, status: "approved", timestamp: "2024-01-15 14:15" },
  { id: "TXN005", amount: 100000, country: "CN", riskScore: 78, status: "review", timestamp: "2024-01-15 14:10" },
];

const mockAlerts = [
  { id: "ALT001", severity: "high", reason: "Sanctions match detected", account: "ACC123", timestamp: "2024-01-15 14:30" },
  { id: "ALT002", severity: "medium", reason: "Unusual transaction pattern", account: "ACC456", timestamp: "2024-01-15 14:25" },
  { id: "ALT003", severity: "low", reason: "Geographic anomaly", account: "ACC789", timestamp: "2024-01-15 14:20" },
];

const continentRiskData = [
  { continent: "North America", riskScore: 35, transactions: 1250, color: "#22c55e" },
  { continent: "Europe", riskScore: 42, transactions: 980, color: "#eab308" },
  { continent: "Asia", riskScore: 78, transactions: 2100, color: "#ef4444" },
  { continent: "South America", riskScore: 55, transactions: 450, color: "#f97316" },
  { continent: "Africa", riskScore: 68, transactions: 320, color: "#ef4444" },
  { continent: "Australia", riskScore: 25, transactions: 180, color: "#22c55e" },
  { continent: "Antarctica", riskScore: 0, transactions: 0, color: "#6b7280" },
];

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSection, setActiveSection }) => {
  const [open, setOpen] = useState(true);

  const menuItems = [
    { id: "dashboard", icon: Home, label: "Dashboard", hasSubmenu: true },
    { id: "api", icon: Key, label: "API Management" },
    { id: "settings", icon: Settings, label: "Settings" },
    { id: "billing", icon: CreditCard, label: "Billing" },
    { id: "profile", icon: User, label: "Profile" },
  ];

  return (
    <nav
      className={`sticky top-0 h-screen shrink-0 border-r transition-all duration-300 ease-in-out ${
        open ? 'w-64' : 'w-16'
      } border-border bg-background p-2 shadow-sm`}
    >
      <div className="mb-6 border-b border-border pb-4">
        <div className="flex cursor-pointer items-center justify-between rounded-md p-2 transition-colors hover:bg-muted">
          <div className="flex items-center gap-3">
            <div className="grid size-10 shrink-0 place-content-center rounded-lg bg-primary">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            {open && (
              <div>
                <span className="block text-sm font-semibold text-foreground">AML Dashboard</span>
                <span className="block text-xs text-muted-foreground">Enterprise</span>
              </div>
            )}
          </div>
          {open && <ChevronDown className="h-4 w-4 text-muted-foreground" />}
        </div>
      </div>

      <div className="space-y-1 mb-8">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`relative flex h-11 w-full items-center rounded-md transition-all duration-200 ${
              activeSection === item.id
                ? "bg-primary/10 text-primary border-l-2 border-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <div className="grid h-full w-12 place-content-center">
              <item.icon className="h-4 w-4" />
            </div>
            {open && (
              <span className="text-sm font-medium transition-opacity duration-200">
                {item.label}
              </span>
            )}
          </button>
        ))}
      </div>

      <button
        onClick={() => setOpen(!open)}
        className="absolute bottom-0 left-0 right-0 border-t border-border transition-colors hover:bg-muted"
      >
        <div className="flex items-center p-3">
          <div className="grid size-10 place-content-center">
            <ChevronsRight
              className={`h-4 w-4 transition-transform duration-300 text-muted-foreground ${
                open ? "rotate-180" : ""
              }`}
            />
          </div>
          {open && (
            <span className="text-sm font-medium text-muted-foreground transition-opacity duration-200">
              Hide
            </span>
          )}
        </div>
      </button>
    </nav>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const [isDark, setIsDark] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [selectedTab, setSelectedTab] = useState("overview");
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [developerProfile, setDeveloperProfile] = useState<DeveloperProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [keyToDelete, setKeyToDelete] = useState<ApiKey | null>(null);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  useEffect(() => {
    if (user) {
      fetchDeveloperProfile();
      fetchApiKeys();
    }
  }, [user]);

  const fetchDeveloperProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('developer_profiles')
        .select('partner_id, company_name, website, api_usage_plan, monthly_request_limit')
        .eq('user_id', user?.id)
        .single();
      
      if (error) throw error;
      setDeveloperProfile(data);
    } catch (error) {
      console.error('Error fetching developer profile:', error);
      toast.error('Failed to fetch developer profile');
    }
  };

  const fetchApiKeys = async () => {
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setApiKeys(data || []);
    } catch (error) {
      console.error('Error fetching API keys:', error);
      toast.error('Failed to fetch API keys');
    } finally {
      setLoading(false);
    }
  };

  const generateApiKey = () => {
    const prefix = 'wm_';
    const randomPart = Array.from(crypto.getRandomValues(new Uint8Array(16)))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase();
    return prefix + randomPart;
  };

  const createApiKey = async () => {
    if (!newKeyName.trim()) {
      toast.error('Please enter a name for your API key');
      return;
    }

    setCreating(true);
    try {
      const apiKey = generateApiKey();
      const { data: profile, error: profileError } = await supabase
        .from('developer_profiles')
        .select('partner_id')
        .eq('user_id', user?.id)
        .single();
      
      if (profileError) throw profileError;

      const { data, error } = await supabase
        .from('api_keys')
        .insert({
          name: newKeyName.trim(),
          key: apiKey,
          key_hash: await hashApiKey(apiKey),
          partner_id: profile.partner_id,
          user_id: user?.id,
          is_active: true,
          rate_limit_per_minute: 60
        })
        .select()
        .single();
      
      if (error) throw error;

      setApiKeys(prev => [data, ...prev]);
      setNewKeyName('');
      setShowCreateDialog(false);
      toast.success('API key created successfully!');
    } catch (error) {
      console.error('Error creating API key:', error);
      toast.error('Failed to create API key');
    } finally {
      setCreating(false);
    }
  };

  const hashApiKey = async (key: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(key);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const toggleKeyVisibility = (keyId: string) => {
    const newVisible = new Set(visibleKeys);
    if (newVisible.has(keyId)) {
      newVisible.delete(keyId);
    } else {
      newVisible.add(keyId);
    }
    setVisibleKeys(newVisible);
  };

  const toggleKeyStatus = async (keyId: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .update({ is_active: !currentStatus })
        .eq('id', keyId);
      
      if (error) throw error;

      setApiKeys(prev => prev.map(key => 
        key.id === keyId ? { ...key, is_active: !currentStatus } : key
      ));
      toast.success(`API key ${!currentStatus ? 'enabled' : 'disabled'} successfully!`);
    } catch (error) {
      console.error('Error toggling API key status:', error);
      toast.error('Failed to update API key status');
    }
  };

  const rotateApiKey = async (keyId: string) => {
    try {
      const newApiKey = generateApiKey();
      const { error } = await supabase
        .from('api_keys')
        .update({
          key: newApiKey,
          key_hash: await hashApiKey(newApiKey),
          last_used_at: null
        })
        .eq('id', keyId);
      
      if (error) throw error;

      await fetchApiKeys();
      toast.success('API key rotated successfully!');
    } catch (error) {
      console.error('Error rotating API key:', error);
      toast.error('Failed to rotate API key');
    }
  };

  const handleDeleteClick = (apiKey: ApiKey) => {
    setKeyToDelete(apiKey);
    setDeleteDialogOpen(true);
  };

  const deleteApiKey = async () => {
    if (!keyToDelete) return;

    try {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', keyToDelete.id);
      
      if (error) throw error;

      setApiKeys(prev => prev.filter(key => key.id !== keyToDelete.id));
      toast.success('API key deleted successfully!');
      setDeleteDialogOpen(false);
      setKeyToDelete(null);
    } catch (error) {
      console.error('Error deleting API key:', error);
      toast.error('Failed to delete API key');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const maskApiKey = (key: string) => {
    if (key.length <= 8) return key;
    const prefix = key.substring(0, 3);
    const suffix = key.substring(key.length - 4);
    const masked = '*'.repeat(key.length - 7);
    return `${prefix}${masked}${suffix}`;
  };

  const getRiskColor = (score: number) => {
    if (score >= 70) return "text-red-500";
    if (score >= 40) return "text-yellow-500";
    return "text-green-500";
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      approved: "bg-green-100 text-green-800",
      flagged: "bg-yellow-100 text-yellow-800",
      blocked: "bg-red-100 text-red-800",
      review: "bg-blue-100 text-blue-800",
    };
    return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800";
  };

  const DashboardContent: React.FC = () => {
    return (
      <div className="space-y-6">
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="heatmap">Risk Heatmap</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5,280</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">High Risk</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-500">156</div>
                  <p className="text-xs text-muted-foreground">-5% from last week</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">23</div>
                  <p className="text-xs text-muted-foreground">+3 new today</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-500">98.5%</div>
                  <p className="text-xs text-muted-foreground">+0.2% this month</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockTransactions.slice(0, 5).map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{tx.id}</p>
                          <p className="text-sm text-muted-foreground">${tx.amount.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusBadge(tx.status)}>{tx.status}</Badge>
                          <p className={`text-sm font-medium ${getRiskColor(tx.riskScore)}`}>
                            Risk: {tx.riskScore}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Active Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockAlerts.map((alert) => (
                      <div key={alert.id} className="flex items-start space-x-3">
                        <AlertCircle className={`h-5 w-5 mt-0.5 ${
                          alert.severity === 'high' ? 'text-red-500' :
                          alert.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                        }`} />
                        <div className="flex-1">
                          <p className="font-medium">{alert.reason}</p>
                          <p className="text-sm text-muted-foreground">{alert.account}</p>
                        </div>
                        <Badge variant={alert.severity === 'high' ? 'destructive' : 'secondary'}>
                          {alert.severity}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
            <ApiAnalytics />
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Transaction Monitoring</CardTitle>
                <div className="flex gap-4">
                  <Input placeholder="Search transactions..." className="max-w-sm" />
                  <Select>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="flagged">Flagged</SelectItem>
                      <SelectItem value="blocked">Blocked</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead>Risk Score</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Timestamp</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockTransactions.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell className="font-medium">{tx.id}</TableCell>
                        <TableCell>${tx.amount.toLocaleString()}</TableCell>
                        <TableCell>{tx.country}</TableCell>
                        <TableCell className={getRiskColor(tx.riskScore)}>{tx.riskScore}</TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(tx.status)}>{tx.status}</Badge>
                        </TableCell>
                        <TableCell>{tx.timestamp}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Alert Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockAlerts.map((alert) => (
                    <div key={alert.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Badge variant={alert.severity === 'high' ? 'destructive' : 'secondary'}>
                            {alert.severity}
                          </Badge>
                          <span className="font-medium">{alert.id}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{alert.timestamp}</span>
                      </div>
                      <p className="text-sm">{alert.reason}</p>
                      <p className="text-sm text-muted-foreground">Account: {alert.account}</p>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="outline">Investigate</Button>
                        <Button size="sm" variant="outline">Dismiss</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="heatmap" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Regional Risk Heatmap</CardTitle>
                <CardDescription>Real-time risk assessment by continent</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {continentRiskData.map((region) => (
                    <div key={region.continent} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{region.continent}</h3>
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: region.color }}
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Risk Score</span>
                          <span className={`font-medium ${getRiskColor(region.riskScore)}`}>
                            {region.riskScore}
                          </span>
                        </div>
                        <Progress value={region.riskScore} className="h-2" />
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Transactions</span>
                          <span className="font-medium">{region.transactions.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Risk Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg">
                    <div className="text-center">
                      <LineChart className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">Risk trend chart would appear here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Transaction Volume</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">Volume chart would appear here</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  const ApiManagementContent: React.FC = () => {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>API Key Management</CardTitle>
                <CardDescription>Manage your API keys and monitor usage</CardDescription>
              </div>
              <Button onClick={() => setShowCreateDialog(true)} className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="h-4 w-4 mr-2" />
                Create New API Key
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {apiKeys.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No API keys found. Create your first API key to get started.
                </div>
              ) : (
                apiKeys.map((apiKey) => (
                  <div key={apiKey.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{apiKey.name}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant={apiKey.is_active ? "secondary" : "outline"}>
                          {apiKey.is_active ? "active" : "inactive"}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant="ghost">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-background border border-border">
                            <DropdownMenuItem onClick={() => rotateApiKey(apiKey.id)}>
                              <RotateCcw className="h-4 w-4 mr-2" />
                              Rotate API Key
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteClick(apiKey)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete API Key
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <code className="bg-muted px-2 py-1 rounded text-sm flex-1 mr-2">
                        {visibleKeys.has(apiKey.id) ? apiKey.key : maskApiKey(apiKey.key)}
                      </code>
                      <div className="flex items-center gap-1">
                        <Button size="sm" variant="outline" onClick={() => copyToClipboard(apiKey.key, "API key")}>
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => toggleKeyVisibility(apiKey.id)}>
                          {visibleKeys.has(apiKey.id) ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground mb-3">
                      <span>Created: {formatDate(apiKey.created_at)}</span>
                      <span>Last used: {apiKey.last_used_at ? formatDate(apiKey.last_used_at) : "Never"}</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <label className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={apiKey.is_active}
                          onChange={() => toggleKeyStatus(apiKey.id, apiKey.is_active)}
                          className="rounded"
                        />
                        Enabled
                      </label>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const SettingsContent: React.FC = () => {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Account Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive alerts via email</p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">SMS Alerts</p>
                <p className="text-sm text-muted-foreground">High-priority alerts via SMS</p>
              </div>
              <Switch />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Two-Factor Authentication</p>
                <p className="text-sm text-muted-foreground">Enhanced security for your account</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Security Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline">
              <Lock className="h-4 w-4 mr-2" />
              Change Password
            </Button>
            <Button variant="outline">
              <Smartphone className="h-4 w-4 mr-2" />
              Manage 2FA
            </Button>
            <Button variant="outline">
              <Globe className="h-4 w-4 mr-2" />
              IP Restrictions
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  };

  const BillingContent: React.FC = () => {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold">Enterprise Plan</h3>
                <p className="text-muted-foreground">$299/month</p>
              </div>
              <Badge>Active</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>API Calls Used</span>
                <span>45,230 / 100,000</span>
              </div>
              <Progress value={45} />
            </div>
            <div className="flex gap-2 mt-4">
              <Button>Upgrade Plan</Button>
              <Button variant="outline">View Usage</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Billing History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { date: "2024-01-01", amount: "$299.00", status: "Paid" },
                { date: "2023-12-01", amount: "$299.00", status: "Paid" },
                { date: "2023-11-01", amount: "$299.00", status: "Paid" },
              ].map((invoice, i) => (
                <div key={i} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">{invoice.date}</p>
                    <p className="text-sm text-muted-foreground">{invoice.amount}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{invoice.status}</Badge>
                    <Button size="sm" variant="outline">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const ProfileContent: React.FC = () => {
    return (
      <div className="space-y-6">
        <ProfileSettings />
      </div>
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardContent />;
      case "api":
        return <ApiManagementContent />;
      case "settings":
        return <SettingsContent />;
      case "billing":
        return <BillingContent />;
      case "profile":
        return <ProfileContent />;
      default:
        return <DashboardContent />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="animate-pulse space-y-4 p-8">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-32 bg-muted rounded"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex min-h-screen w-full ${isDark ? 'dark' : ''}`}>
      <div className="flex w-full bg-background text-foreground">
        <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
        
        <div className="flex-1 bg-background p-6 overflow-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {activeSection === "dashboard" && "AML Dashboard"}
                {activeSection === "api" && "API Management"}
                {activeSection === "settings" && "Settings"}
                {activeSection === "billing" && "Billing"}
                {activeSection === "profile" && "Profile"}
              </h1>
              <p className="text-muted-foreground mt-1">
                {activeSection === "dashboard" && "Monitor transactions and compliance in real-time"}
                {activeSection === "api" && "Manage your API keys and monitor usage"}
                {activeSection === "settings" && "Configure your account preferences"}
                {activeSection === "billing" && "Manage your subscription and billing"}
                {activeSection === "profile" && "Update your personal information"}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Quick search..." className="pl-10 w-64" />
              </div>
              <Button variant="outline" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsDark(!isDark)}
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="icon">
                <User className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Main Content */}
          {renderContent()}
        </div>
      </div>

      {/* Create API Key Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New API Key</DialogTitle>
            <DialogDescription>
              Enter a name for your new production API key
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="keyName">Key Name</Label>
              <Input
                id="keyName"
                placeholder="e.g., Production API Key"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateDialog(false);
                setNewKeyName('');
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={createApiKey}
              disabled={creating}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {creating ? 'Creating...' : 'Create API Key'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete API Key</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the API key "{keyToDelete?.name}"? 
              This action cannot be undone and will permanently remove the key from your account.
              Any applications using this key will lose access immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setKeyToDelete(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={deleteApiKey}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Delete API Key
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Dashboard;
