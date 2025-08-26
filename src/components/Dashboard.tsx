import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Copy, Eye, EyeOff, RotateCw, Trash2, Plus, User } from 'lucide-react';
import { toast } from 'sonner';
import Profile from './Profile';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

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
  const { user } = useAuth();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [developerProfile, setDeveloperProfile] = useState<DeveloperProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [keyToDelete, setKeyToDelete] = useState<ApiKey | null>(null);

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

    if (!developerProfile) {
      toast.error('Developer profile not found');
      return;
    }

    setCreating(true);
    try {
      const apiKey = generateApiKey();

      const { data, error } = await supabase
        .from('api_keys')
        .insert({
          name: newKeyName.trim(),
          key: apiKey,
          key_hash: await hashApiKey(apiKey),
          partner_id: developerProfile.partner_id, // Use permanent partner_id from profile
          user_id: user?.id,
          is_active: true,
          rate_limit_per_minute: 60
        })
        .select()
        .single();

      if (error) throw error;

      setApiKeys(prev => [data, ...prev]);
      setNewKeyName('');
      setShowCreateForm(false);
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

  const rotateApiKey = async (keyId: string, keyName: string) => {
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

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-32 bg-muted rounded"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  const activeApiKey = apiKeys.find(key => key.is_active && key.key);
  console.log('Active API key found:', activeApiKey ? 'Yes' : 'No');
  console.log('API keys:', apiKeys.map(k => ({ id: k.id, name: k.name, active: k.is_active, hasKey: !!k.key })));

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Relay API Dashboard</h1>
          <p className="text-muted-foreground">Manage API keys and test your deployed relay service</p>
          {developerProfile && (
            <p className="text-sm text-muted-foreground mt-2">
              Partner ID: <span className="font-mono bg-muted px-2 py-1 rounded">{developerProfile.partner_id}</span>
            </p>
          )}
        </div>
        <Button 
          onClick={() => setShowCreateForm(true)}
          className="bg-primary hover:bg-primary/90"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create API Key
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="keys">API Keys</TabsTrigger>
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
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
                  <Input 
                    value="https://resumeak.onrender.com" 
                    readOnly 
                    className="font-mono text-sm"
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => copyToClipboard("https://resumeak.onrender.com", "Base URL")}
                  >
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
              <div className="space-y-2">
                <Label>API Documentation</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    value="https://resumeak.onrender.com/docs" 
                    readOnly 
                    className="font-mono text-sm"
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open("https://resumeak.onrender.com/docs", "_blank")}
                  >
                    Open
                  </Button>
                </div>
              </div>
              {developerProfile && (
                <div className="space-y-2">
                  <Label>Partner ID</Label>
                  <div className="flex items-center gap-2">
                    <Input 
                      value={developerProfile.partner_id} 
                      readOnly 
                      className="font-mono text-sm"
                    />
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => copyToClipboard(developerProfile.partner_id, "Partner ID")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
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
        </TabsContent>

        <TabsContent value="keys" className="space-y-6">
          {/* Create API Key Form */}
          {showCreateForm && (
            <Card>
              <CardHeader>
                <CardTitle>Create New API Key</CardTitle>
                <CardDescription>Enter a name for your new API key</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="keyName">Key Name</Label>
                  <Input
                    id="keyName"
                    placeholder="e.g., Production App, Development, etc."
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Button 
                    onClick={createApiKey} 
                    disabled={creating}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {creating ? 'Creating...' : 'Create API Key'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setShowCreateForm(false);
                      setNewKeyName('');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* API Keys List */}
          <div className="space-y-4">
            {apiKeys.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">No API keys found. Create your first API key to get started.</p>
                </CardContent>
              </Card>
            ) : (
              apiKeys.map((apiKey) => (
                <Card key={apiKey.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {apiKey.name}
                          <Badge variant={apiKey.is_active ? "default" : "secondary"}>
                            {apiKey.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          Created {new Date(apiKey.created_at).toLocaleDateString()}
                          {apiKey.last_used_at && (
                            <> • Last used {new Date(apiKey.last_used_at).toLocaleDateString()}</>
                          )}
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => rotateApiKey(apiKey.id, apiKey.name)}
                        >
                          <RotateCw className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteClick(apiKey)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>API Key</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type={visibleKeys.has(apiKey.id) ? "text" : "password"}
                          value={apiKey.key}
                          readOnly
                          className="font-mono text-sm"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleKeyVisibility(apiKey.id)}
                        >
                          {visibleKeys.has(apiKey.id) ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(apiKey.key, "API key")}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Partner ID</Label>
                      <div className="flex items-center gap-2">
                        <Input
                          value={apiKey.partner_id}
                          readOnly
                          className="font-mono text-sm"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(apiKey.partner_id, "Partner ID")}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                      <div>
                        <strong>Rate Limit:</strong> {apiKey.rate_limit_per_minute} req/min
                      </div>
                      <div>
                        <strong>Key ID:</strong> {apiKey.id}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="profile">
          <Profile />
        </TabsContent>
      </Tabs>

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
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
