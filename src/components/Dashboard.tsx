"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Home, Shield, Settings, CreditCard, User, ChevronDown, ChevronsRight, Moon, Sun, Bell, Search, AlertTriangle, Activity, Globe, Eye, EyeOff, Copy, RotateCcw, Trash2, Plus, Download, FileText, Key, Lock, Smartphone, BarChart3, LineChart, AlertCircle, CheckCircle, Info, MoreVertical, TrendingUp, Users, DollarSign, Calendar, Clock, MapPin, Filter, ExternalLink, Zap, Play, Pause, RefreshCw, AlertOctagon } from 'lucide-react';
import { toast } from 'sonner';
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
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart as RechartsBarChart, Bar, PieChart, Pie, Cell, Area, AreaChart } from 'recharts';
import { format, subDays, startOfDay } from 'date-fns';
import ReactSelect from 'react-select';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';

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
const mockTransactions = [{
  id: "TXN001",
  amount: 50000,
  country: "US",
  riskScore: 85,
  status: "flagged",
  timestamp: "2024-01-15 14:30"
}, {
  id: "TXN002",
  amount: 25000,
  country: "UK",
  riskScore: 45,
  status: "approved",
  timestamp: "2024-01-15 14:25"
}, {
  id: "TXN003",
  amount: 75000,
  country: "RU",
  riskScore: 95,
  status: "blocked",
  timestamp: "2024-01-15 14:20"
}, {
  id: "TXN004",
  amount: 15000,
  country: "DE",
  riskScore: 25,
  status: "approved",
  timestamp: "2024-01-15 14:15"
}, {
  id: "TXN005",
  amount: 100000,
  country: "CN",
  riskScore: 78,
  status: "review",
  timestamp: "2024-01-15 14:10"
}];
const mockAlerts = [{
  id: "ALT001",
  severity: "high",
  reason: "Sanctions match detected",
  account: "ACC123",
  timestamp: "2024-01-15 14:30"
}, {
  id: "ALT002",
  severity: "medium",
  reason: "Unusual transaction pattern",
  account: "ACC456",
  timestamp: "2024-01-15 14:25"
}, {
  id: "ALT003",
  severity: "low",
  reason: "Geographic anomaly",
  account: "ACC789",
  timestamp: "2024-01-15 14:20"
}];
const continentRiskData = [{
  continent: "North America",
  riskScore: 35,
  transactions: 1250,
  color: "#22c55e"
}, {
  continent: "Europe",
  riskScore: 42,
  transactions: 980,
  color: "#eab308"
}, {
  continent: "Asia",
  riskScore: 78,
  transactions: 2100,
  color: "#ef4444"
}, {
  continent: "South America",
  riskScore: 55,
  transactions: 450,
  color: "#f97316"
}, {
  continent: "Africa",
  riskScore: 68,
  transactions: 320,
  color: "#ef4444"
}, {
  continent: "Australia",
  riskScore: 25,
  transactions: 180,
  color: "#22c55e"
}, {
  continent: "Antarctica",
  riskScore: 0,
  transactions: 0,
  color: "#6b7280"
}];

// Enhanced mock data for comprehensive dashboard
const mockRiskTrendData = [
  { date: '2024-01-01', risk: 45, volume: 1200 },
  { date: '2024-01-02', risk: 52, volume: 1350 },
  { date: '2024-01-03', risk: 38, volume: 1100 },
  { date: '2024-01-04', risk: 67, volume: 1800 },
  { date: '2024-01-05', risk: 55, volume: 1600 },
  { date: '2024-01-06', risk: 48, volume: 1400 },
  { date: '2024-01-07', risk: 72, volume: 1900 }
];

const mockTransactionTypes = [
  { type: 'Wire Transfer', count: 1250, risk: 65, color: '#ef4444' },
  { type: 'ACH Transfer', count: 980, risk: 35, color: '#22c55e' },
  { type: 'Credit Card', count: 750, risk: 45, color: '#eab308' },
  { type: 'Digital Wallet', count: 420, risk: 58, color: '#f97316' }
];

const mockSanctionsData = [
  { id: 'SANC001', name: 'John Doe', type: 'PEP', country: 'Russia', status: 'active', added: '2024-01-10' },
  { id: 'SANC002', name: 'ABC Corp', type: 'Entity', country: 'Iran', status: 'active', added: '2024-01-08' },
  { id: 'SANC003', name: 'Jane Smith', type: 'SDN', country: 'North Korea', status: 'monitoring', added: '2024-01-05' }
];

const mockCases = [
  { id: 'CASE001', title: 'Suspicious Wire Transfer Pattern', priority: 'high', status: 'investigating', assigned: 'Alice Johnson', created: '2024-01-15', transactions: 5 },
  { id: 'CASE002', title: 'PEP Match Verification', priority: 'medium', status: 'pending_review', assigned: 'Bob Wilson', created: '2024-01-14', transactions: 2 },
  { id: 'CASE003', title: 'Geographic Anomaly Investigation', priority: 'low', status: 'resolved', assigned: 'Carol Davis', created: '2024-01-12', transactions: 8 }
];

interface SidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  setActiveSection
}) => {
  const [open, setOpen] = useState(true);
  const menuItems = [{
    id: "dashboard",
    icon: Home,
    label: "Dashboard",
    hasSubmenu: true
  }, {
    id: "api",
    icon: Key,
    label: "API Management"
  }, {
    id: "settings",
    icon: Settings,
    label: "Settings"
  }, {
    id: "billing",
    icon: CreditCard,
    label: "Billing"
  }, {
    id: "profile",
    icon: User,
    label: "Profile"
  }];
  return <nav className={`sticky top-0 h-screen shrink-0 border-r transition-all duration-300 ease-in-out ${open ? 'w-64' : 'w-16'} border-border bg-background p-2 shadow-sm`}>
      <div className="mb-6 border-b border-border pb-4">
        <div className="flex cursor-pointer items-center justify-between rounded-md p-2 transition-colors hover:bg-muted">
          <div className="flex items-center gap-3">
            <div className="grid size-10 shrink-0 place-content-center rounded-lg bg-primary">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            {open && <div>
                <span className="block text-sm font-semibold text-foreground">AML Dashboard</span>
              </div>}
          </div>
          {open}
        </div>
      </div>

      <div className="space-y-1 mb-8">
        {menuItems.map(item => <button key={item.id} onClick={() => setActiveSection(item.id)} className={`relative flex h-11 w-full items-center rounded-md transition-all duration-200 ${activeSection === item.id ? "bg-primary/10 text-primary border-l-2 border-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}>
            <div className="grid h-full w-12 place-content-center">
              <item.icon className="h-4 w-4" />
            </div>
            {open && <span className="text-sm font-medium transition-opacity duration-200">
                {item.label}
              </span>}
          </button>)}
      </div>

      <button onClick={() => setOpen(!open)} className="absolute bottom-0 left-0 right-0 border-t border-border transition-colors hover:bg-muted">
        <div className="flex items-center p-3">
          <div className="grid size-10 place-content-center">
            <ChevronsRight className={`h-4 w-4 transition-transform duration-300 text-muted-foreground ${open ? "rotate-180" : ""}`} />
          </div>
          {open && <span className="text-sm font-medium text-muted-foreground transition-opacity duration-200">
              Hide
            </span>}
        </div>
      </button>
    </nav>;
};

const Dashboard = () => {
  const { user } = useAuth();
  
  // Load dark mode preference from localStorage on initialization
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  });
  
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
  
  // Enhanced filtering and search state
  const [transactionSearch, setTransactionSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [countryFilter, setCountryFilter] = useState('all');
  const [riskFilter, setRiskFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [isRealTimeEnabled, setIsRealTimeEnabled] = useState(true);
  const [sortBy, setSortBy] = useState('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Save preference to localStorage whenever it changes
    localStorage.setItem('darkMode', JSON.stringify(isDark));
  }, [isDark]);

  useEffect(() => {
    if (user) {
      fetchDeveloperProfile();
      fetchApiKeys();
    }
  }, [user]);

  const fetchDeveloperProfile = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from('developer_profiles').select('partner_id, company_name, website, api_usage_plan, monthly_request_limit').eq('user_id', user?.id).single();
      if (error) throw error;
      setDeveloperProfile(data);
    } catch (error) {
      console.error('Error fetching developer profile:', error);
      toast.error('Failed to fetch developer profile');
    }
  };
  const fetchApiKeys = async () => {
    try {
      const {
        data,
        error
      } = await supabase.from('api_keys').select('*').eq('user_id', user?.id).order('created_at', {
        ascending: false
      });
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
    const randomPart = Array.from(crypto.getRandomValues(new Uint8Array(16))).map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
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
      const {
        data: profile,
        error: profileError
      } = await supabase.from('developer_profiles').select('partner_id').eq('user_id', user?.id).single();
      if (profileError) throw profileError;
      const {
        data,
        error
      } = await supabase.from('api_keys').insert({
        name: newKeyName.trim(),
        key: apiKey,
        key_hash: await hashApiKey(apiKey),
        partner_id: profile.partner_id,
        user_id: user?.id,
        is_active: true,
        rate_limit_per_minute: 60
      }).select().single();
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
      const {
        error
      } = await supabase.from('api_keys').update({
        is_active: !currentStatus
      }).eq('id', keyId);
      if (error) throw error;
      setApiKeys(prev => prev.map(key => key.id === keyId ? {
        ...key,
        is_active: !currentStatus
      } : key));
      toast.success(`API key ${!currentStatus ? 'enabled' : 'disabled'} successfully!`);
    } catch (error) {
      console.error('Error toggling API key status:', error);
      toast.error('Failed to update API key status');
    }
  };
  const rotateApiKey = async (keyId: string) => {
    try {
      const newApiKey = generateApiKey();
      const {
        error
      } = await supabase.from('api_keys').update({
        key: newApiKey,
        key_hash: await hashApiKey(newApiKey),
        last_used_at: null
      }).eq('id', keyId);
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
      const {
        error
      } = await supabase.from('api_keys').delete().eq('id', keyToDelete.id);
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

  // Enhanced filtering and export functions
  const filteredTransactions = useMemo(() => {
    return mockTransactions.filter(tx => {
      const matchesSearch = transactionSearch === '' || 
        tx.id.toLowerCase().includes(transactionSearch.toLowerCase()) ||
        tx.country.toLowerCase().includes(transactionSearch.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || tx.status === statusFilter;
      const matchesCountry = countryFilter === 'all' || tx.country === countryFilter;
      const matchesRisk = riskFilter === 'all' || 
        (riskFilter === 'low' && tx.riskScore < 40) ||
        (riskFilter === 'medium' && tx.riskScore >= 40 && tx.riskScore < 70) ||
        (riskFilter === 'high' && tx.riskScore >= 70);
      
      return matchesSearch && matchesStatus && matchesCountry && matchesRisk;
    }).sort((a, b) => {
      const aValue = a[sortBy as keyof typeof a];
      const bValue = b[sortBy as keyof typeof b];
      const modifier = sortOrder === 'asc' ? 1 : -1;
      return aValue > bValue ? modifier : -modifier;
    });
  }, [transactionSearch, statusFilter, countryFilter, riskFilter, sortBy, sortOrder]);

  const exportToCSV = () => {
    const headers = ['Transaction ID', 'Amount', 'Country', 'Risk Score', 'Status', 'Timestamp'];
    const csvContent = [
      headers.join(','),
      ...filteredTransactions.map(tx => 
        [tx.id, tx.amount, tx.country, tx.riskScore, tx.status, tx.timestamp].join(',')
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    saveAs(blob, `transactions-${format(new Date(), 'yyyy-MM-dd')}.csv`);
    toast.success('Transactions exported to CSV');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('AML Transaction Report', 20, 20);
    doc.setFontSize(12);
    doc.text(`Generated on: ${format(new Date(), 'PPP')}`, 20, 35);
    
    let yPosition = 55;
    filteredTransactions.forEach((tx, index) => {
      if (yPosition > 270) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(`${tx.id} | $${tx.amount.toLocaleString()} | ${tx.country} | Risk: ${tx.riskScore} | ${tx.status}`, 20, yPosition);
      yPosition += 10;
    });
    
    doc.save(`aml-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
    toast.success('Report exported to PDF');
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
      review: "bg-blue-100 text-blue-800"
    };
    return variants[status as keyof typeof variants] || "bg-gray-100 text-gray-800";
  };

  const DashboardContent: React.FC = () => {
    return <div className="space-y-6">
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="alerts">Alerts</TabsTrigger>
            <TabsTrigger value="sanctions">Sanctions</TabsTrigger>
            <TabsTrigger value="heatmap">Risk Heatmap</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-100 hover:shadow-xl transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">Total Transactions</CardTitle>
                  <div className="h-10 w-10 bg-blue-500 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-gray-900">5,280</div>
                  <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" />
                    +12% from last month
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-rose-100 hover:shadow-xl transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">High Risk</CardTitle>
                  <div className="h-10 w-10 bg-red-500 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600">156</div>
                  <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3 rotate-180" />
                    -5% from last week
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-50 to-orange-100 hover:shadow-xl transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">Active Cases</CardTitle>
                  <div className="h-10 w-10 bg-amber-500 rounded-lg flex items-center justify-center">
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-amber-600">23</div>
                  <p className="text-sm text-blue-600 flex items-center gap-1 mt-1">
                    <Plus className="h-3 w-3" />
                    +3 new today
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-gradient-to-br from-emerald-50 to-green-100 hover:shadow-xl transition-all duration-300">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-700">Compliance Score</CardTitle>
                  <div className="h-10 w-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-emerald-600">98.5%</div>
                  <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3" />
                    +0.2% this month
                  </p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <Activity className="h-5 w-5 text-blue-500" />
                    Recent Transactions
                  </CardTitle>
                  <CardDescription>Latest transaction activity</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {mockTransactions.slice(0, 5).map(tx => <div key={tx.id} className="flex items-center justify-between p-3 rounded-lg bg-gray-50/50 hover:bg-gray-100/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <DollarSign className="h-5 w-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{tx.id}</p>
                            <p className="text-sm text-gray-600 flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {tx.country} • ${tx.amount.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right space-y-1">
                          <Badge className={getStatusBadge(tx.status) + " font-medium"}>{tx.status}</Badge>
                          <p className={`text-sm font-semibold ${getRiskColor(tx.riskScore)}`}>
                            Risk: {tx.riskScore}
                          </p>
                        </div>
                      </div>)}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <Bell className="h-5 w-5 text-red-500" />
                    Active Alerts
                  </CardTitle>
                  <CardDescription>Critical alerts requiring attention</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {mockAlerts.map(alert => <div key={alert.id} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50/50 hover:bg-gray-100/50 transition-colors">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                          alert.severity === 'high' ? 'bg-red-100' : 
                          alert.severity === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'
                        }`}>
                          <AlertCircle className={`h-5 w-5 ${
                            alert.severity === 'high' ? 'text-red-500' : 
                            alert.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                          }`} />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{alert.reason}</p>
                          <p className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                            <Users className="h-3 w-3" />
                            {alert.account} • <Clock className="h-3 w-3" /> {alert.timestamp}
                          </p>
                        </div>
                        <Badge variant={alert.severity === 'high' ? 'destructive' : 'secondary'} className="font-medium">
                          {alert.severity}
                        </Badge>
                      </div>)}
                  </div>
                </CardContent>
              </Card>
            </div>
            <ApiAnalytics />
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            {/* Real-time Transaction Feed Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold text-gray-900">Transaction Monitoring</h2>
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${isRealTimeEnabled ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                  <span className="text-sm text-gray-600">{isRealTimeEnabled ? 'Live Feed' : 'Paused'}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsRealTimeEnabled(!isRealTimeEnabled)}
                    className="ml-2"
                  >
                    {isRealTimeEnabled ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button onClick={exportToCSV} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
                <Button onClick={exportToPDF} variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
              </div>
            </div>

            {/* Advanced Filtering Panel */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <Filter className="h-5 w-5 text-blue-500" />
                  Advanced Filters & Search
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Transaction ID, Country..."
                        value={transactionSearch}
                        onChange={(e) => setTransactionSearch(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Status</label>
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="flagged">Flagged</SelectItem>
                        <SelectItem value="blocked">Blocked</SelectItem>
                        <SelectItem value="review">Under Review</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Risk Level</label>
                    <Select value={riskFilter} onValueChange={setRiskFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Risk Levels" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Risk Levels</SelectItem>
                        <SelectItem value="low">Low (0-39)</SelectItem>
                        <SelectItem value="medium">Medium (40-69)</SelectItem>
                        <SelectItem value="high">High (70+)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Country</label>
                    <Select value={countryFilter} onValueChange={setCountryFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="All Countries" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Countries</SelectItem>
                        <SelectItem value="US">United States</SelectItem>
                        <SelectItem value="UK">United Kingdom</SelectItem>
                        <SelectItem value="DE">Germany</SelectItem>
                        <SelectItem value="RU">Russia</SelectItem>
                        <SelectItem value="CN">China</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">
                      Showing {filteredTransactions.length} of {mockTransactions.length} transactions
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setTransactionSearch('');
                        setStatusFilter('all');
                        setCountryFilter('all');
                        setRiskFilter('all');
                      }}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Clear Filters
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Sort by:</span>
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="timestamp">Time</SelectItem>
                        <SelectItem value="amount">Amount</SelectItem>
                        <SelectItem value="riskScore">Risk Score</SelectItem>
                        <SelectItem value="country">Country</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    >
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Enhanced Transaction Table */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <Activity className="h-5 w-5 text-blue-500" />
                  Real-time Transaction Feed
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50/50">
                        <TableHead className="font-semibold text-gray-700">Transaction ID</TableHead>
                        <TableHead className="font-semibold text-gray-700">Amount</TableHead>
                        <TableHead className="font-semibold text-gray-700">Country</TableHead>
                        <TableHead className="font-semibold text-gray-700">Risk Score</TableHead>
                        <TableHead className="font-semibold text-gray-700">Status</TableHead>
                        <TableHead className="font-semibold text-gray-700">Timestamp</TableHead>
                        <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.map((tx, index) => (
                        <TableRow 
                          key={tx.id} 
                          className={`hover:bg-gray-50/50 transition-colors ${
                            isRealTimeEnabled && index === 0 ? 'bg-blue-50/30 animate-pulse' : ''
                          }`}
                        >
                          <TableCell className="font-mono font-medium text-gray-900">{tx.id}</TableCell>
                          <TableCell className="font-semibold text-gray-900">
                            ${tx.amount.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-4 bg-gray-200 rounded-sm flex items-center justify-center">
                                <span className="text-xs font-medium text-gray-600">{tx.country}</span>
                              </div>
                              {tx.country}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className={`h-2 w-16 rounded-full overflow-hidden bg-gray-200`}>
                                <div 
                                  className={`h-full transition-all duration-300 ${
                                    tx.riskScore >= 70 ? 'bg-red-500' : 
                                    tx.riskScore >= 40 ? 'bg-yellow-500' : 'bg-green-500'
                                  }`}
                                  style={{ width: `${tx.riskScore}%` }}
                                />
                              </div>
                              <span className={`font-semibold ${getRiskColor(tx.riskScore)}`}>
                                {tx.riskScore}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${getStatusBadge(tx.status)} font-medium`}>
                              {tx.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-600">{tx.timestamp}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <AlertTriangle className="h-4 w-4 mr-2" />
                                  Flag Transaction
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Shield className="h-4 w-4 mr-2" />
                                  Create Case
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Alert & Case Management</h2>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export Cases
                </Button>
                <Button size="sm" className="bg-red-500 hover:bg-red-600 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Alert
                </Button>
              </div>
            </div>

            {/* Alert Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-red-50 to-rose-100">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-red-700">Critical Alerts</p>
                      <p className="text-2xl font-bold text-red-600">12</p>
                    </div>
                    <AlertTriangle className="h-8 w-8 text-red-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg bg-gradient-to-br from-yellow-50 to-amber-100">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-yellow-700">Open Cases</p>
                      <p className="text-2xl font-bold text-yellow-600">8</p>
                    </div>
                    <FileText className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-100">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-700">Investigating</p>
                      <p className="text-2xl font-bold text-blue-600">15</p>
                    </div>
                    <Search className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-100">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-700">Resolved Today</p>
                      <p className="text-2xl font-bold text-green-600">23</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Active Alerts */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-red-50 to-orange-50 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <Bell className="h-5 w-5 text-red-500" />
                  Active Alerts
                </CardTitle>
                <CardDescription>Critical alerts requiring immediate attention</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {mockAlerts.map(alert => (
                    <div key={alert.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4 flex-1">
                          <div className={`p-2 rounded-lg ${
                            alert.severity === 'high' ? 'bg-red-100' : 
                            alert.severity === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'
                          }`}>
                            <AlertCircle className={`h-5 w-5 ${
                              alert.severity === 'high' ? 'text-red-500' : 
                              alert.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                            }`} />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant={alert.severity === 'high' ? 'destructive' : 'secondary'} className="font-medium">
                                {alert.severity.toUpperCase()}
                              </Badge>
                              <span className="font-mono text-sm text-gray-600">{alert.id}</span>
                              <span className="text-sm text-gray-500">•</span>
                              <span className="text-sm text-gray-500">{alert.timestamp}</span>
                            </div>
                            
                            <h3 className="font-semibold text-gray-900 mb-1">{alert.reason}</h3>
                            <p className="text-sm text-gray-600 mb-3">
                              Account: <span className="font-medium">{alert.account}</span>
                            </p>
                            
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline" className="hover:bg-blue-50">
                                <Eye className="h-4 w-4 mr-1" />
                                Investigate
                              </Button>
                              <Button size="sm" variant="outline" className="hover:bg-green-50">
                                <Shield className="h-4 w-4 mr-1" />
                                Create Case
                              </Button>
                              <Button size="sm" variant="outline" className="hover:bg-gray-50">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Dismiss
                              </Button>
                            </div>
                          </div>
                        </div>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Users className="h-4 w-4 mr-2" />
                              Assign Analyst
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Clock className="h-4 w-4 mr-2" />
                              Set Priority
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="h-4 w-4 mr-2" />
                              Export Details
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Case Management */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <FileText className="h-5 w-5 text-blue-500" />
                  Active Cases
                </CardTitle>
                <CardDescription>Ongoing compliance investigations</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {mockCases.map(caseItem => (
                    <div key={caseItem.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-all duration-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="font-mono text-sm font-medium text-blue-600">{caseItem.id}</span>
                            <Badge variant={
                              caseItem.priority === 'high' ? 'destructive' : 
                              caseItem.priority === 'medium' ? 'default' : 'secondary'
                            }>
                              {caseItem.priority} priority
                            </Badge>
                            <Badge variant="outline" className={
                              caseItem.status === 'resolved' ? 'bg-green-50 text-green-700' :
                              caseItem.status === 'investigating' ? 'bg-blue-50 text-blue-700' :
                              'bg-yellow-50 text-yellow-700'
                            }>
                              {caseItem.status.replace('_', ' ')}
                            </Badge>
                          </div>
                          
                          <h3 className="font-semibold text-gray-900 mb-2">{caseItem.title}</h3>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-3">
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>{caseItem.assigned}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{caseItem.created}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Activity className="h-4 w-4" />
                              <span>{caseItem.transactions} transactions</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>Last updated: 2h ago</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-1" />
                              View Details
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="h-4 w-4 mr-1" />
                              Generate Report
                            </Button>
                            {caseItem.status !== 'resolved' && (
                              <Button size="sm" variant="outline">
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Mark Resolved
                              </Button>
                            )}
                          </div>
                        </div>
                        
                        <div className="ml-4">
                          <div className={`w-3 h-3 rounded-full ${
                            caseItem.priority === 'high' ? 'bg-red-500' :
                            caseItem.priority === 'medium' ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sanctions" className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Sanctions & PEP Monitoring</h2>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export List
                </Button>
                <Button size="sm" className="bg-orange-500 hover:bg-orange-600 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add to Watchlist
                </Button>
              </div>
            </div>

            {/* Sanctions Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-50 to-red-100">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-700">Active Sanctions</p>
                      <p className="text-2xl font-bold text-orange-600">{mockSanctionsData.length}</p>
                    </div>
                    <Shield className="h-8 w-8 text-orange-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-violet-100">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-700">PEP Matches</p>
                      <p className="text-2xl font-bold text-purple-600">4</p>
                    </div>
                    <Users className="h-8 w-8 text-purple-500" />
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-100">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-700">Screening Today</p>
                      <p className="text-2xl font-bold text-blue-600">156</p>
                    </div>
                    <Search className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sanctions List */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <Shield className="h-5 w-5 text-orange-500" />
                  Sanctions Watchlist
                </CardTitle>
                <CardDescription>Active sanctions and PEP monitoring</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50/50">
                        <TableHead className="font-semibold text-gray-700">ID</TableHead>
                        <TableHead className="font-semibold text-gray-700">Name/Entity</TableHead>
                        <TableHead className="font-semibold text-gray-700">Type</TableHead>
                        <TableHead className="font-semibold text-gray-700">Country</TableHead>
                        <TableHead className="font-semibold text-gray-700">Status</TableHead>
                        <TableHead className="font-semibold text-gray-700">Date Added</TableHead>
                        <TableHead className="font-semibold text-gray-700">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockSanctionsData.map((item, index) => (
                        <TableRow key={item.id} className="hover:bg-gray-50/50 transition-colors">
                          <TableCell className="font-mono font-medium text-gray-900">{item.id}</TableCell>
                          <TableCell className="font-semibold text-gray-900">{item.name}</TableCell>
                          <TableCell>
                            <Badge variant={item.type === 'PEP' ? 'default' : 'secondary'} className={
                              item.type === 'PEP' ? 'bg-purple-100 text-purple-700' :
                              item.type === 'SDN' ? 'bg-red-100 text-red-700' :
                              'bg-orange-100 text-orange-700'
                            }>
                              {item.type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-4 bg-gray-200 rounded-sm flex items-center justify-center">
                                <span className="text-xs font-medium text-gray-600">{item.country.slice(0, 2)}</span>
                              </div>
                              {item.country}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className={`h-2 w-2 rounded-full ${
                                item.status === 'active' ? 'bg-red-500' : 'bg-yellow-500'
                              }`} />
                              <span className={`text-sm font-medium ${
                                item.status === 'active' ? 'text-red-700' : 'text-yellow-700'
                              }`}>
                                {item.status}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-gray-600">{item.added}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Bell className="h-4 w-4 mr-2" />
                                  Create Alert
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                  <Download className="h-4 w-4 mr-2" />
                                  Export Profile
                                </DropdownMenuItem>
                                <DropdownMenuItem className="text-red-600">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Remove
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Screening Activity */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <Activity className="h-5 w-5 text-blue-500" />
                  Recent Screening Activity
                </CardTitle>
                <CardDescription>Latest sanctions and PEP screening results</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="font-medium text-green-900">Batch screening completed</p>
                        <p className="text-sm text-green-700">156 records screened, 0 matches found</p>
                      </div>
                    </div>
                    <span className="text-sm text-green-600">2 minutes ago</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      <div>
                        <p className="font-medium text-yellow-900">Potential PEP match detected</p>
                        <p className="text-sm text-yellow-700">Customer: John Doe - Requires manual review</p>
                      </div>
                    </div>
                    <span className="text-sm text-yellow-600">15 minutes ago</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="h-5 w-5 text-red-500" />
                      <div>
                        <p className="font-medium text-red-900">Sanctions match confirmed</p>
                        <p className="text-sm text-red-700">Entity: ABC Corp - Transaction blocked automatically</p>
                      </div>
                    </div>
                    <span className="text-sm text-red-600">1 hour ago</span>
                  </div>
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
                  {continentRiskData.map(region => <div key={region.continent} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium">{region.continent}</h3>
                        <div className="w-4 h-4 rounded-full" style={{
                      backgroundColor: region.color
                    }} />
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
                    </div>)}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Analytics & Trends</h2>
              <div className="flex items-center gap-2">
                <Select defaultValue="7days">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24hours">24 Hours</SelectItem>
                    <SelectItem value="7days">7 Days</SelectItem>
                    <SelectItem value="30days">30 Days</SelectItem>
                    <SelectItem value="90days">90 Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                    Risk Score Trends
                  </CardTitle>
                  <CardDescription>7-day risk assessment trends</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsLineChart data={mockRiskTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#666"
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => format(new Date(value), 'MMM dd')}
                      />
                      <YAxis stroke="#666" tick={{ fontSize: 12 }} />
                      <Tooltip 
                        labelFormatter={(value) => format(new Date(value), 'PPP')}
                        formatter={(value: any, name: string) => [
                          name === 'risk' ? `${value}% Risk` : `${value} Transactions`,
                          name === 'risk' ? 'Average Risk Score' : 'Transaction Volume'
                        ]}
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="risk" 
                        stroke="#ef4444" 
                        strokeWidth={3}
                        dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, fill: '#dc2626' }}
                      />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <BarChart3 className="h-5 w-5 text-emerald-500" />
                    Transaction Volume
                  </CardTitle>
                  <CardDescription>Daily transaction processing volume</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsBarChart data={mockRiskTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#666"
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => format(new Date(value), 'MMM dd')}
                      />
                      <YAxis stroke="#666" tick={{ fontSize: 12 }} />
                      <Tooltip 
                        labelFormatter={(value) => format(new Date(value), 'PPP')}
                        formatter={(value: any) => [`${value} transactions`, 'Volume']}
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Bar 
                        dataKey="volume" 
                        fill="#10b981"
                        radius={[4, 4, 0, 0]}
                      />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <Activity className="h-5 w-5 text-orange-500" />
                    Transaction Types Distribution
                  </CardTitle>
                  <CardDescription>Breakdown by transaction method</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={mockTransactionTypes}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ type, percent }) => `${type} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="count"
                      >
                        {mockTransactionTypes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: any, name: string, props: any) => [
                          `${value} transactions`,
                          props.payload.type
                        ]}
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-t-lg">
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <AlertOctagon className="h-5 w-5 text-purple-500" />
                    Risk vs Volume Correlation
                  </CardTitle>
                  <CardDescription>Risk score compared to transaction volume</CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={mockRiskTrendData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis 
                        dataKey="date" 
                        stroke="#666"
                        tick={{ fontSize: 12 }}
                        tickFormatter={(value) => format(new Date(value), 'MMM dd')}
                      />
                      <YAxis stroke="#666" tick={{ fontSize: 12 }} />
                      <Tooltip 
                        labelFormatter={(value) => format(new Date(value), 'PPP')}
                        formatter={(value: any, name: string) => [
                          name === 'risk' ? `${value}% Risk` : `${value} Transactions`,
                          name === 'risk' ? 'Risk Score' : 'Volume'
                        ]}
                        contentStyle={{
                          backgroundColor: 'white',
                          border: '1px solid #e2e8f0',
                          borderRadius: '8px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="volume"
                        stackId="1"
                        stroke="#8b5cf6"
                        fill="#8b5cf6"
                        fillOpacity={0.3}
                      />
                      <Area
                        type="monotone"
                        dataKey="risk"
                        stackId="2"
                        stroke="#ef4444"
                        fill="#ef4444"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Performance Metrics */}
            <Card className="border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-t-lg">
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  Performance Metrics
                </CardTitle>
                <CardDescription>Key performance indicators for compliance monitoring</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">2.3s</div>
                    <div className="text-sm text-gray-600">Avg. Processing Time</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">99.2%</div>
                    <div className="text-sm text-gray-600">Detection Accuracy</div>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">156</div>
                    <div className="text-sm text-gray-600">False Positives Today</div>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">98.8%</div>
                    <div className="text-sm text-gray-600">System Uptime</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>;
  };

  const ApiManagementContent: React.FC = () => {
    return <div className="space-y-6">
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <Key className="h-5 w-5 text-emerald-500" />
                  API Key Management
                </CardTitle>
                <CardDescription className="text-gray-600">Manage your API keys and monitor usage securely</CardDescription>
              </div>
              <Button onClick={() => setShowCreateDialog(true)} className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 text-white shadow-lg hover:shadow-xl transition-all duration-300">
                <Plus className="h-4 w-4 mr-2" />
                Create New API Key
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {apiKeys.length === 0 ? <div className="text-center py-12">
                  <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Key className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-lg">No API keys found</p>
                  <p className="text-gray-400 text-sm">Create your first API key to get started with our platform</p>
                </div> : apiKeys.map(apiKey => <div key={apiKey.id} className="border-0 rounded-xl p-6 bg-gradient-to-r from-gray-50 to-slate-50 hover:from-gray-100 hover:to-slate-100 transition-all duration-300 shadow-sm hover:shadow-md">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <Key className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{apiKey.name}</h3>
                          <p className="text-sm text-gray-500">Partner ID: {apiKey.partner_id}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={apiKey.is_active ? "default" : "outline"} className={apiKey.is_active ? "bg-emerald-100 text-emerald-700 border-emerald-200" : ""}>
                          {apiKey.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center justify-between mb-4 p-3 bg-white rounded-lg border border-gray-200">
                      <code className="text-sm text-gray-800 font-mono flex-1 mr-3">
                        {visibleKeys.has(apiKey.id) ? apiKey.key : maskApiKey(apiKey.key)}
                      </code>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" onClick={() => copyToClipboard(apiKey.key, "API key")} className="h-8 w-8 p-0 hover:bg-blue-50 hover:border-blue-200">
                          <Copy className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => toggleKeyVisibility(apiKey.id)} className="h-8 w-8 p-0 hover:bg-gray-50">
                          {visibleKeys.has(apiKey.id) ? <EyeOff className="h-4 w-4 text-gray-600" /> : <Eye className="h-4 w-4 text-gray-600" />}
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>Created: {formatDate(apiKey.created_at)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>Last used: {apiKey.last_used_at ? formatDate(apiKey.last_used_at) : "Never"}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <label className="flex items-center gap-3 text-sm cursor-pointer">
                        <input type="checkbox" checked={apiKey.is_active} onChange={() => toggleKeyStatus(apiKey.id, apiKey.is_active)} className="rounded border-gray-300 text-emerald-500 focus:ring-emerald-500" />
                        <span className="font-medium text-gray-700">Enabled</span>
                      </label>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button size="sm" variant="outline" className="h-8 w-8 p-0 hover:bg-gray-50">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-white border border-gray-200 shadow-lg">
                          <DropdownMenuItem onClick={() => rotateApiKey(apiKey.id)} className="hover:bg-blue-50">
                            <RotateCcw className="h-4 w-4 mr-2 text-blue-600" />
                            Rotate API Key
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDeleteClick(apiKey)} className="text-red-600 hover:text-red-700 hover:bg-red-50">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete API Key
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>)}
            </div>
          </CardContent>
        </Card>
      </div>;
  };

  const SettingsContent: React.FC = () => {
    return <div className="space-y-6">
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
          <CardContent>
            <div className="flex gap-4">
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
            </div>
          </CardContent>
        </Card>
      </div>;
  };

  const BillingContent: React.FC = () => {
    return <div className="space-y-6">
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
              {[{
              date: "2024-01-01",
              amount: "$299.00",
              status: "Paid"
            }, {
              date: "2023-12-01",
              amount: "$299.00",
              status: "Paid"
            }, {
              date: "2023-11-01",
              amount: "$299.00",
              status: "Paid"
            }].map((invoice, i) => <div key={i} className="flex items-center justify-between border-b pb-2">
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
                </div>)}
            </div>
          </CardContent>
        </Card>
      </div>;
  };

  const ProfileContent: React.FC = () => {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">First Name</label>
                <Input defaultValue="John" />
              </div>
              <div>
                <label className="text-sm font-medium">Last Name</label>
                <Input defaultValue="Doe" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <Input defaultValue="john.doe@company.com" />
            </div>
            <div>
              <label className="text-sm font-medium">Company</label>
              <Input defaultValue="Acme Corp" />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity Log</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { action: "API key created", time: "2 hours ago" },
                { action: "Password changed", time: "1 day ago" },
                { action: "Login from new device", time: "3 days ago" },
                { action: "Profile updated", time: "1 week ago" },
              ].map((activity, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-sm">{activity.action}</span>
                  <span className="text-sm text-muted-foreground">{activity.time}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
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
    return <div className="min-h-screen bg-gray-50">
        <div className="animate-pulse space-y-4 p-8">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-32 bg-muted rounded"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>;
  }
  return <div className={`flex min-h-screen w-full ${isDark ? 'dark' : ''}`}>
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
            <div className="flex items-center gap-2">
              <Button 
                onClick={() => window.open('https://api.stablepe.com', '_blank')}
                className="bg-black hover:bg-gray-800 text-white"
              >
                <FileText className="h-4 w-4 mr-2" />
                Check Documentation
              </Button>
              <Button variant="outline" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
              </Button>
              <Button variant="outline" size="icon" onClick={() => setIsDark(!isDark)}>
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
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
              <Input id="keyName" placeholder="e.g., Production API Key" value={newKeyName} onChange={e => setNewKeyName(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
            setShowCreateDialog(false);
            setNewKeyName('');
          }}>
              Cancel
            </Button>
            <Button onClick={createApiKey} disabled={creating} className="bg-black hover:bg-gray-800 text-white">
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
            <AlertDialogAction onClick={deleteApiKey} className="bg-red-600 text-white hover:bg-red-700">
              Delete API Key
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>;
};

export default Dashboard;
