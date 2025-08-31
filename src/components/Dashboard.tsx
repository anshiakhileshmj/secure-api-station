import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Copy, Eye, EyeOff, Trash2, Plus, Edit, RotateCw, MoreHorizontal } from 'lucide-react';
import { toast } from 'sonner';
import ProfileSettings from './ProfileSettings';
import DashboardSidebar from './DashboardSidebar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

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

const Dashboard = () => {
  const {
    user
  } = useAuth();
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
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
    if (user) {
      fetchDeveloperProfile();
      fetchApiKeys();
    }
  }, [user]);

  const handleToggleCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

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

  if (loading) {
    return <div className="flex h-screen">
        <div className="w-64 bg-gray-50 animate-pulse"></div>
        <div className="flex-1 p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/4"></div>
            <div className="h-32 bg-muted rounded"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </div>
      </div>;
  }

  const renderOverview = () => <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Monitor your AML-compliant transaction relay service</p>
      </div>

      {/* API Endpoints Info */}
      <Card>
        <CardHeader>
          <CardTitle>Deployed Relay API</CardTitle>
          <CardDescription>Your AML-compliant transaction relay service is live</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Base URL</Label>
            <div className="flex items-center gap-2">
              <Input value="https://resumeak.onrender.com" readOnly className="font-mono text-sm" />
              <Button variant="outline" size="sm" onClick={() => copyToClipboard("https://resumeak.onrender.com", "Base URL")}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Check Endpoint</Label>
              <code className="block p-2 bg-muted rounded text-sm">
                POST /v1/check
              </code>
              <p className="text-xs text-muted-foreground">
                Pre-flight AML check without transaction execution
              </p>
            </div>
            <div className="space-y-2">
              <Label>Relay Endpoint</Label>
              <code className="block p-2 bg-muted rounded text-sm">
                POST /v1/relay
              </code>
              <p className="text-xs text-muted-foreground">
                Execute transaction through AML-compliant relay
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">API Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm">Online</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active API Keys</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold">{apiKeys.filter(k => k.is_active).length}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Rate Limit</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-sm">60 req/min per key</span>
          </CardContent>
        </Card>
      </div>
    </div>;

  const renderApiKeys = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">API Keys</h1>
          <p className="text-gray-600 mt-1">Manage your production API keys for authentication</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="bg-emerald-600 hover:bg-emerald-700">
          <Plus className="h-4 w-4 mr-2" />
          Create API Key
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-medium text-gray-700 w-1/4">Name</TableHead>
                <TableHead className="font-medium text-gray-700 w-2/5">API Key</TableHead>
                <TableHead className="font-medium text-gray-700 w-1/6">Created</TableHead>
                <TableHead className="font-medium text-gray-700 w-1/6 text-center">Enabled</TableHead>
                <TableHead className="font-medium text-gray-700 w-16"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiKeys.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                    No API keys found. Create your first API key to get started.
                  </TableCell>
                </TableRow>
              ) : (
                apiKeys.map((apiKey) => (
                  <TableRow key={apiKey.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div className="font-medium text-gray-900">{apiKey.name}</div>
                      <div className="text-sm text-gray-500">
                        Last used: {apiKey.last_used_at ? formatDate(apiKey.last_used_at) : "Never"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 max-w-md">
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono flex-1 truncate">
                          {visibleKeys.has(apiKey.id) ? apiKey.key : maskApiKey(apiKey.key)}
                        </code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(apiKey.key, "API key")}
                          className="h-7 w-7 p-0 flex-shrink-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleKeyVisibility(apiKey.id)}
                          className="h-7 w-7 p-0 flex-shrink-0"
                        >
                          {visibleKeys.has(apiKey.id) ? <EyeOff className="h-3 w-3" /> : <Eye className="h-3 w-3" />}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {formatDate(apiKey.created_at)}
                    </TableCell>
                    <TableCell className="text-center">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={apiKey.is_active}
                          onChange={() => toggleKeyStatus(apiKey.id, apiKey.is_active)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                      </label>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-32">
                          <DropdownMenuItem onClick={() => rotateApiKey(apiKey.id)}>
                            <RotateCw className="h-4 w-4 mr-2" />
                            Rotate
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteClick(apiKey)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return renderOverview();
      case 'keys':
        return renderApiKeys();
      case 'profile':
        return <ProfileSettings />;
      case 'settings':
        return <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
            </div>
            <Card>
              <CardContent className="p-6">
                <p className="text-gray-500">Settings panel coming soon...</p>
              </CardContent>
            </Card>
          </div>;
      default:
        return renderOverview();
    }
  };

  return <div className="flex h-screen bg-gray-50">
      <DashboardSidebar activeSection={activeSection} onSectionChange={setActiveSection} isCollapsed={sidebarCollapsed} onToggleCollapse={handleToggleCollapse} />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
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
            <Button onClick={createApiKey} disabled={creating} className="bg-emerald-600 hover:bg-emerald-700">
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
