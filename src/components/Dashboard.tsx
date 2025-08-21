
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { 
  Key, 
  Plus, 
  Copy, 
  RotateCcw, 
  Trash2, 
  Eye, 
  EyeOff, 
  AlertCircle,
  CheckCircle,
  Calendar,
  Activity 
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  key_hash: string;
  is_active: boolean;
  created_at: string;
  last_used_at: string | null;
  expires_at: string | null;
  rate_limit_per_minute: number;
}

const Dashboard = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (user) {
      fetchApiKeys();
    }
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
      toast({
        title: "Error",
        description: "Failed to fetch API keys",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createApiKey = async () => {
    if (!newKeyName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for your API key",
        variant: "destructive",
      });
      return;
    }

    setCreating(true);
    try {
      const { data, error } = await supabase.rpc('generate_api_key');
      
      if (error) throw error;
      
      const newKey = data;
      
      const { error: insertError } = await supabase
        .from('api_keys')
        .insert({
          user_id: user?.id,
          name: newKeyName,
          key: newKey,
          key_hash: await hashApiKey(newKey),
          is_active: true,
          rate_limit_per_minute: 60
        });

      if (insertError) throw insertError;

      await fetchApiKeys();
      setNewKeyName('');
      setShowCreateForm(false);
      
      toast({
        title: "Success",
        description: "API key created successfully",
      });
    } catch (error) {
      console.error('Error creating API key:', error);
      toast({
        title: "Error",
        description: "Failed to create API key",
        variant: "destructive",
      });
    } finally {
      setCreating(false);
    }
  };

  const hashApiKey = async (apiKey: string): Promise<string> => {
    const encoder = new TextEncoder();
    const data = encoder.encode(apiKey);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const copyToClipboard = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: `${keyName} copied to clipboard`,
    });
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

  const revokeApiKey = async (keyId: string, keyName: string) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .update({ is_active: false })
        .eq('id', keyId);

      if (error) throw error;

      await fetchApiKeys();
      toast({
        title: "Success",
        description: `${keyName} has been revoked`,
      });
    } catch (error) {
      console.error('Error revoking API key:', error);
      toast({
        title: "Error",
        description: "Failed to revoke API key",
        variant: "destructive",
      });
    }
  };

  const rotateApiKey = async (keyId: string, keyName: string) => {
    try {
      const { data: newKey, error: generateError } = await supabase.rpc('generate_api_key');
      
      if (generateError) throw generateError;

      const { error: updateError } = await supabase
        .from('api_keys')
        .update({ 
          key: newKey,
          key_hash: await hashApiKey(newKey)
        })
        .eq('id', keyId);

      if (updateError) throw updateError;

      await fetchApiKeys();
      toast({
        title: "Success",
        description: `${keyName} has been rotated`,
      });
    } catch (error) {
      console.error('Error rotating API key:', error);
      toast({
        title: "Error",
        description: "Failed to rotate API key",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-32 bg-muted rounded"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
            API Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your API keys and monitor usage
          </p>
        </div>
        
        <Button 
          onClick={() => setShowCreateForm(true)}
          className="btn-primary"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create API Key
        </Button>
      </div>

      {showCreateForm && (
        <Card className="card-glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5" />
              Create New API Key
            </CardTitle>
            <CardDescription>
              Generate a new API key for your applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="keyName">API Key Name</Label>
                <Input
                  id="keyName"
                  placeholder="e.g., Production App, Development"
                  value={newKeyName}
                  onChange={(e) => setNewKeyName(e.target.value)}
                  className="bg-muted/50 mt-2"
                />
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={createApiKey} 
                  disabled={creating}
                  className="btn-primary"
                >
                  {creating ? 'Creating...' : 'Create Key'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowCreateForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        {apiKeys.length === 0 ? (
          <Card className="card-glass">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Key className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No API Keys</h3>
              <p className="text-muted-foreground text-center mb-4">
                Create your first API key to start using the platform
              </p>
              <Button 
                onClick={() => setShowCreateForm(true)}
                className="btn-primary"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create API Key
              </Button>
            </CardContent>
          </Card>
        ) : (
          apiKeys.map((apiKey) => (
            <Card key={apiKey.id} className="card-glass">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Key className="h-5 w-5" />
                      {apiKey.name}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-4 mt-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Created {new Date(apiKey.created_at).toLocaleDateString()}
                      </span>
                      {apiKey.last_used_at && (
                        <span className="flex items-center gap-1">
                          <Activity className="h-4 w-4" />
                          Last used {new Date(apiKey.last_used_at).toLocaleDateString()}
                        </span>
                      )}
                    </CardDescription>
                  </div>
                  <Badge variant={apiKey.is_active ? "default" : "secondary"}>
                    {apiKey.is_active ? "Active" : "Revoked"}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <div>
                  <Label>API Key</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="api-key-display flex-1">
                      {visibleKeys.has(apiKey.id) 
                        ? apiKey.key 
                        : `${apiKey.key.substring(0, 8)}${'*'.repeat(24)}`
                      }
                    </div>
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
                      onClick={() => copyToClipboard(apiKey.key, apiKey.name)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Rate limit: {apiKey.rate_limit_per_minute} requests/minute
                  </span>
                  
                  <div className="flex gap-2">
                    {apiKey.is_active && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => rotateApiKey(apiKey.id, apiKey.name)}
                        >
                          <RotateCcw className="h-4 w-4 mr-1" />
                          Rotate
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => revokeApiKey(apiKey.id, apiKey.name)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Revoke
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Keep your API keys secure and never share them publicly. Rotate keys regularly for enhanced security.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default Dashboard;
