import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { 
  Home, 
  Key, 
  Settings, 
  CreditCard, 
  User, 
  Activity, 
  AlertTriangle, 
  FileText, 
  CheckCircle, 
  Plus, 
  Copy, 
  Eye, 
  EyeOff, 
  Trash2, 
  RefreshCw, 
  Bell,
  ChevronLeft,
  ChevronRight,
  Moon,
  Sun
} from 'lucide-react';
import { cn } from '@/lib/utils';
import ApiAnalytics from '@/components/ApiAnalytics';
import ApiTester from '@/components/ApiTester';
import ApiDocumentation from '@/components/ApiDocumentation';
import Profile from '@/components/Profile';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  key_hash: string;
  created_at: string;
  last_used_at: string | null;
  is_active: boolean;
  rate_limit_per_minute: number;
}

interface DeveloperProfile {
  partner_id: string;
  company_name: string | null;
  website: string | null;
  api_usage_plan: string;
  monthly_request_limit: number;
}

// Production ready - no mock data

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
    { id: "profile", icon: User, label: "Profile" }
  ];

  return (
    <nav className={cn(
      "bg-card border-r border-border h-full transition-all duration-300 ease-in-out",
      open ? "w-64" : "w-16"
    )}>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">AML</span>
          </div>
          {open && <span className="font-semibold text-lg">AML Monitor</span>}
        </div>
        
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors",
                  activeSection === item.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                )}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {open && <span className="truncate">{item.label}</span>}
              </button>
            );
          })}
        </div>
      </div>
      
      <button
        onClick={() => setOpen(!open)}
        className="absolute bottom-4 left-4 p-2 rounded-lg bg-accent hover:bg-accent/80 transition-colors"
      >
        <div className="flex items-center gap-2">
          {open ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
          {open && <span className="text-sm font-medium text-muted-foreground transition-opacity duration-200">Hide</span>}
        </div>
      </button>
    </nav>
  );
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
  
  const [activeSection, setActiveSection] = useState("dashboard");
  const [selectedTab, setSelectedTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newKeyName, setNewKeyName] = useState("");
  const [creating, setCreating] = useState(false);
  const [newKey, setNewKey] = useState<string | null>(null);
  const [showNewKeyDialog, setShowNewKeyDialog] = useState(false);
  const [keyToDelete, setKeyToDelete] = useState<string | null>(null);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [developerProfile, setDeveloperProfile] = useState<DeveloperProfile | null>(null);
  
  // Toggle dark mode and save preference
  const toggleDarkMode = () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(newDarkMode));
  };

  useEffect(() => {
    if (user) {
      fetchApiKeys();
      fetchDeveloperProfile();
    }
    setLoading(false);
  }, [user]);

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
    }
  };

  const fetchDeveloperProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('developer_profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setDeveloperProfile(data);
    } catch (error) {
      console.error('Error fetching developer profile:', error);
    }
  };

  const generateApiKey = () => {
    const prefix = 'wm_';
    const randomBytes = new Uint8Array(16);
    crypto.getRandomValues(randomBytes);
    const key = prefix + Array.from(randomBytes, byte => byte.toString(16).padStart(2, '0')).join('').toUpperCase();
    return key;
  };

  const hashApiKey = async (key: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(key);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const createApiKey = async () => {
    if (!newKeyName.trim()) {
      toast.error('Please enter a name for the API key');
      return;
    }

    setCreating(true);
    try {
      const apiKey = generateApiKey();
      const keyHash = await hashApiKey(apiKey);
      
      const { data, error } = await supabase
        .from('api_keys')
        .insert({
          user_id: user?.id,
          name: newKeyName.trim(),
          key: apiKey,
          key_hash: keyHash,
          partner_id: developerProfile?.partner_id
        })
        .select()
        .single();

      if (error) throw error;

      setNewKey(apiKey);
      setShowNewKeyDialog(true);
      setShowCreateDialog(false);
      setNewKeyName("");
      await fetchApiKeys();
      toast.success('API key created successfully');
    } catch (error) {
      console.error('Error creating API key:', error);
      toast.error('Failed to create API key');
    } finally {
      setCreating(false);
    }
  };

  const deleteApiKey = async (keyId: string) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', keyId);

      if (error) throw error;

      await fetchApiKeys();
      toast.success('API key deleted successfully');
    } catch (error) {
      console.error('Error deleting API key:', error);
      toast.error('Failed to delete API key');
    }
    setKeyToDelete(null);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
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
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">No data available</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">High Risk</CardTitle>
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-500">0</div>
                  <p className="text-xs text-muted-foreground">No data available</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">0</div>
                  <p className="text-xs text-muted-foreground">No data available</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Compliance Score</CardTitle>
                  <CheckCircle className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-500">100%</div>
                  <p className="text-xs text-muted-foreground">Ready for production</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-32 text-muted-foreground">
                    <p>No recent transactions to display</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Active Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center h-32 text-muted-foreground">
                    <p>No active alerts</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="transactions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
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
                    <TableRow>
                      <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                        No transactions to display
                      </TableCell>
                    </TableRow>
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
                <div className="flex items-center justify-center h-32 text-muted-foreground">
                  <p>No alerts to manage</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="heatmap" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Global Risk Heatmap</CardTitle>
                <CardDescription>Risk assessment by continent</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  <p>Risk heatmap will be displayed here based on real data</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <ApiAnalytics />
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  const ApiManagementContent: React.FC = () => {
    return (
      <div className="space-y-6">
        <Tabs defaultValue="keys" className="space-y-6">
          <TabsList>
            <TabsTrigger value="keys">API Keys</TabsTrigger>
            <TabsTrigger value="testing">Testing</TabsTrigger>
            <TabsTrigger value="docs">Documentation</TabsTrigger>
          </TabsList>

          <TabsContent value="keys" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>API Key Management</CardTitle>
                  <CardDescription>Manage your API keys and monitor usage</CardDescription>
                </div>
                <Button onClick={() => setShowCreateDialog(true)} className="bg-black hover:bg-gray-800 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Create New API Key
                </Button>
              </CardHeader>
              <CardContent>
                {apiKeys.length === 0 ? (
                  <div className="flex items-center justify-center h-32 text-muted-foreground">
                    <p>No API keys created yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {apiKeys.map((apiKey) => (
                      <div key={apiKey.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-medium">{apiKey.name}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <code className="text-sm bg-muted px-2 py-1 rounded">
                              {visibleKeys.has(apiKey.id) ? apiKey.key : '•'.repeat(20)}
                            </code>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleKeyVisibility(apiKey.id)}
                            >
                              {visibleKeys.has(apiKey.id) ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => copyToClipboard(apiKey.key)}
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <span>Created: {new Date(apiKey.created_at).toLocaleDateString()}</span>
                            {apiKey.last_used_at && (
                              <span>Last used: {new Date(apiKey.last_used_at).toLocaleDateString()}</span>
                            )}
                            <Badge variant={apiKey.is_active ? "default" : "secondary"}>
                              {apiKey.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setKeyToDelete(apiKey.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="testing" className="space-y-6">
            <ApiTester apiKey={apiKeys.length > 0 ? apiKeys[0].key : null} />
          </TabsContent>

          <TabsContent value="docs" className="space-y-6">
            <ApiDocumentation apiKey={apiKeys.length > 0 ? apiKeys[0].key : 'your-api-key'} />
          </TabsContent>
        </Tabs>
      </div>
    );
  };

  const SettingsContent: React.FC = () => {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize your dashboard appearance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Dark Mode</h3>
                <p className="text-sm text-muted-foreground">Toggle dark mode theme</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={toggleDarkMode}
                className="flex items-center gap-2"
              >
                {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                {isDark ? 'Light' : 'Dark'}
              </Button>
            </div>
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
            <CardTitle>Billing Information</CardTitle>
            <CardDescription>Manage your subscription and billing details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-32 text-muted-foreground">
              <p>Billing management coming soon</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const ProfileContent: React.FC = () => {
    return <Profile />;
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
            </div>
          </div>

          {/* Content */}
          {renderContent()}
        </div>

        {/* Create API Key Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New API Key</DialogTitle>
              <DialogDescription>
                Create a new API key to access the AML monitoring services.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="keyName">API Key Name</Label>
                <Input
                  id="keyName"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  placeholder="e.g., Production API Key"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setShowCreateDialog(false);
                setNewKeyName("");
              }}>
                Cancel
              </Button>
              <Button onClick={createApiKey} disabled={creating} className="bg-black hover:bg-gray-800 text-white">
                {creating ? 'Creating...' : 'Create API Key'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Show New API Key Dialog */}
        <Dialog open={showNewKeyDialog} onOpenChange={setShowNewKeyDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>API Key Created Successfully</DialogTitle>
              <DialogDescription>
                Your new API key has been created. Make sure to copy it now as you won't be able to see it again.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex items-center gap-2 p-4 bg-muted rounded-lg">
                <code className="flex-1 text-sm">{newKey}</code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => newKey && copyToClipboard(newKey)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => {
                setShowNewKeyDialog(false);
                setNewKey(null);
              }}>
                Done
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!keyToDelete} onOpenChange={() => setKeyToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete API Key</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete this API key? This action cannot be undone and will immediately revoke access for this key.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => keyToDelete && deleteApiKey(keyToDelete)} className="bg-red-600 hover:bg-red-700">
                Delete API Key
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default Dashboard;