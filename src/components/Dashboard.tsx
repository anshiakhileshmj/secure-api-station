import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { 
  Home, Shield, Settings, CreditCard, User, ChevronDown, ChevronsRight, 
  Moon, Sun, Bell, Search, AlertTriangle, Activity, Globe, Eye, EyeOff, 
  Copy, RotateCcw, Trash2, Plus, Download, FileText, Key, Lock, 
  Smartphone, BarChart3, LineChart, AlertCircle, CheckCircle, Info, 
  MoreVertical, TrendingUp, Users, DollarSign, Calendar, Clock, MapPin, 
  Filter, ExternalLink, Zap, Building2, Mail, Phone, CreditCard as CardIcon,
  HelpCircle, LogOut, Palette, Volume2, Shield as ShieldIcon, Database,
  Code, Terminal, BookOpen, Star, Award, Target, Layers, Workflow
} from 'lucide-react';
import { toast } from 'sonner';
import ApiAnalytics from './ApiAnalytics';
import NotificationDropdown from './NotificationDropdown';
import DashboardSidebar from './DashboardSidebar';
import ApiTester from './ApiTester';
import ApiDocumentation from './ApiDocumentation';
import Profile from './Profile';

interface ApiKey {
  id: string;
  name: string;
  key?: string;
  key_hash: string;
  partner_id: string;
  user_id: string;
  is_active: boolean;
  expires_at: string | null;
  last_used_at: string | null;
  created_at: string;
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
  const { user, signOut } = useAuth();
  const [activeSection, setActiveSection] = useState('overview');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [developerProfile, setDeveloperProfile] = useState<DeveloperProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [newKeyName, setNewKeyName] = useState('');
  const [isCreatingKey, setIsCreatingKey] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Settings state
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: false,
    security: true
  });
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('UTC');

  // Profile state
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    website: '',
    phone: '',
    bio: ''
  });

  useEffect(() => {
    if (user) {
      fetchApiKeys();
      fetchDeveloperProfile();
      initializeProfileData();
    }
  }, [user]);

  const initializeProfileData = () => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        email: user.email || '',
        firstName: user.user_metadata?.first_name || '',
        lastName: user.user_metadata?.last_name || '',
        company: user.user_metadata?.company_name || '',
        phone: user.user_metadata?.phone || ''
      }));
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

  const hashApiKey = async (key: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(key);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  const createApiKey = async () => {
    if (!newKeyName.trim()) {
      toast.error('Please enter a name for your API key');
      return;
    }

    setIsCreatingKey(true);
    try {
      const newKey = generateApiKey();
      const keyHash = await hashApiKey(newKey);

      const { data, error } = await supabase
        .from('api_keys')
        .insert({
          name: newKeyName.trim(),
          key: newKey,
          key_hash: keyHash,
          partner_id: developerProfile?.partner_id || user?.id,
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
      setIsCreatingKey(false);
    }
  };

  const rotateApiKey = async (keyId: string) => {
    try {
      const newKey = generateApiKey();
      const keyHash = await hashApiKey(newKey);

      const { data, error } = await supabase
        .from('api_keys')
        .update({
          key: newKey,
          key_hash: keyHash,
          last_used_at: null
        })
        .eq('id', keyId)
        .eq('user_id', user?.id)
        .select()
        .single();

      if (error) throw error;

      setApiKeys(prev => prev.map(key => key.id === keyId ? data : key));
      toast.success('API key rotated successfully!');
    } catch (error) {
      console.error('Error rotating API key:', error);
      toast.error('Failed to rotate API key');
    }
  };

  const revokeApiKey = async (keyId: string) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .update({ is_active: false })
        .eq('id', keyId)
        .eq('user_id', user?.id);

      if (error) throw error;

      setApiKeys(prev => prev.map(key => 
        key.id === keyId ? { ...key, is_active: false } : key
      ));
      toast.success('API key revoked successfully!');
    } catch (error) {
      console.error('Error revoking API key:', error);
      toast.error('Failed to revoke API key');
    }
  };

  const reactivateApiKey = async (keyId: string) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .update({ is_active: true })
        .eq('id', keyId)
        .eq('user_id', user?.id);

      if (error) throw error;

      setApiKeys(prev => prev.map(key => 
        key.id === keyId ? { ...key, is_active: true } : key
      ));
      toast.success('API key reactivated successfully!');
    } catch (error) {
      console.error('Error reactivating API key:', error);
      toast.error('Failed to reactivate API key');
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys(prev => {
      const newSet = new Set(prev);
      if (newSet.has(keyId)) {
        newSet.delete(keyId);
      } else {
        newSet.add(keyId);
      }
      return newSet;
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getActiveApiKey = () => {
    const activeKey = apiKeys.find(key => key.is_active);
    return activeKey?.key || null;
  };

  const renderOverview = () => (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-slate-50 to-blue-50 border border-slate-200 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Welcome back, {user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'Developer'}
            </h1>
            <p className="text-slate-600 mt-1">
              Monitor your API usage, manage keys, and track compliance metrics
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              <CheckCircle className="h-3 w-3 mr-1" />
              API Active
            </Badge>
            <Button variant="outline" size="sm">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Docs
            </Button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600">Total Requests</p>
                <p className="text-3xl font-bold text-blue-900">12,847</p>
                <p className="text-xs text-blue-600 mt-1 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12% from last month
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">Success Rate</p>
                <p className="text-3xl font-bold text-green-900">99.2%</p>
                <p className="text-xs text-green-600 mt-1 flex items-center">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Excellent performance
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600">Active Keys</p>
                <p className="text-3xl font-bold text-orange-900">{apiKeys.filter(k => k.is_active).length}</p>
                <p className="text-xs text-orange-600 mt-1 flex items-center">
                  <Key className="h-3 w-3 mr-1" />
                  {apiKeys.length} total keys
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Key className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200 hover:shadow-lg transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600">Avg Response</p>
                <p className="text-3xl font-bold text-purple-900">142ms</p>
                <p className="text-xs text-purple-600 mt-1 flex items-center">
                  <Zap className="h-3 w-3 mr-1" />
                  Fast & reliable
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600" />
            Quick Actions
          </CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-blue-50 hover:border-blue-200"
              onClick={() => setActiveSection('keys')}
            >
              <Plus className="h-6 w-6 text-blue-600" />
              <span className="font-medium">Create API Key</span>
              <span className="text-xs text-muted-foreground">Generate new credentials</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-green-50 hover:border-green-200"
              onClick={() => setActiveSection('test')}
            >
              <Terminal className="h-6 w-6 text-green-600" />
              <span className="font-medium">Test API</span>
              <span className="text-xs text-muted-foreground">Try your endpoints</span>
            </Button>
            
            <Button 
              variant="outline" 
              className="h-auto p-4 flex flex-col items-center gap-2 hover:bg-purple-50 hover:border-purple-200"
              onClick={() => window.open('/docs', '_blank')}
            >
              <BookOpen className="h-6 w-6 text-purple-600" />
              <span className="font-medium">View Docs</span>
              <span className="text-xs text-muted-foreground">API documentation</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-slate-600" />
              Recent Transactions
            </CardTitle>
            <CardDescription>Latest API requests and responses</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-full">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">POST /v1/check</p>
                      <p className="text-xs text-muted-foreground">2 minutes ago</p>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    200 OK
                  </Badge>
                </div>
              ))}
              <Button variant="ghost" size="sm" className="w-full">
                View all transactions
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              Active Alerts
            </CardTitle>
            <CardDescription>Security and compliance notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <div className="flex-1">
                  <p className="font-medium text-sm text-amber-800">High Risk Transaction</p>
                  <p className="text-xs text-amber-600">Sanctioned wallet detected</p>
                </div>
                <Badge variant="outline" className="bg-amber-100 text-amber-700 border-amber-300">
                  HIGH
                </Badge>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <Info className="h-4 w-4 text-blue-600" />
                <div className="flex-1">
                  <p className="font-medium text-sm text-blue-800">Rate Limit Warning</p>
                  <p className="text-xs text-blue-600">Approaching monthly limit</p>
                </div>
                <Badge variant="outline" className="bg-blue-100 text-blue-700 border-blue-300">
                  INFO
                </Badge>
              </div>
              
              <Button variant="ghost" size="sm" className="w-full">
                View all alerts
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderApiKeys = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">API Keys</h2>
          <p className="text-slate-600 mt-1">Manage your API credentials and access tokens</p>
        </div>
        <Button 
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Key
        </Button>
      </div>

      {/* Create Key Form */}
      {showCreateForm && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-lg">Create New API Key</CardTitle>
            <CardDescription>Generate a new API key for your application</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="keyName">Key Name</Label>
              <Input
                id="keyName"
                placeholder="e.g., Production App, Development, Mobile App"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                className="max-w-md"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={createApiKey}
                disabled={isCreatingKey || !newKeyName.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isCreatingKey ? 'Creating...' : 'Create Key'}
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
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                    <div className="h-6 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : apiKeys.length === 0 ? (
          <Card className="border-dashed border-2 border-slate-300">
            <CardContent className="p-12 text-center">
              <Key className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">No API Keys</h3>
              <p className="text-slate-600 mb-4">Create your first API key to start using our services</p>
              <Button 
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Key
              </Button>
            </CardContent>
          </Card>
        ) : (
          apiKeys.map((apiKey) => (
            <Card key={apiKey.id} className={`transition-all duration-200 hover:shadow-md ${
              apiKey.is_active ? 'border-green-200 bg-green-50/30' : 'border-red-200 bg-red-50/30'
            }`}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="font-semibold text-lg text-slate-900">{apiKey.name}</h3>
                      <Badge variant={apiKey.is_active ? "default" : "secondary"} className={
                        apiKey.is_active 
                          ? "bg-green-100 text-green-800 border-green-300" 
                          : "bg-red-100 text-red-800 border-red-300"
                      }>
                        {apiKey.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Label className="text-sm font-medium text-slate-700 min-w-[80px]">API Key:</Label>
                        <div className="flex items-center gap-2 flex-1">
                          <code className="bg-slate-100 px-3 py-1 rounded font-mono text-sm flex-1">
                            {visibleKeys.has(apiKey.id) 
                              ? apiKey.key 
                              : `${apiKey.key?.substring(0, 8)}${'•'.repeat(24)}`
                            }
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleKeyVisibility(apiKey.id)}
                            className="p-2"
                          >
                            {visibleKeys.has(apiKey.id) ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(apiKey.key || '', 'API key')}
                            className="p-2"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Label className="text-sm font-medium text-slate-700 min-w-[80px]">Partner ID:</Label>
                        <div className="flex items-center gap-2 flex-1">
                          <code className="bg-slate-100 px-3 py-1 rounded font-mono text-sm flex-1">
                            {apiKey.partner_id}
                          </code>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(apiKey.partner_id, 'Partner ID')}
                            className="p-2"
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-slate-600">Created:</span>
                          <span className="ml-2 font-medium">{formatDate(apiKey.created_at)}</span>
                        </div>
                        <div>
                          <span className="text-slate-600">Last Used:</span>
                          <span className="ml-2 font-medium">
                            {apiKey.last_used_at ? formatDate(apiKey.last_used_at) : 'Never'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-600">Rate Limit:</span>
                          <span className="ml-2 font-medium">{apiKey.rate_limit_per_minute}/min</span>
                        </div>
                        <div>
                          <span className="text-slate-600">Expires:</span>
                          <span className="ml-2 font-medium">
                            {apiKey.expires_at ? formatDate(apiKey.expires_at) : 'Never'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => rotateApiKey(apiKey.id)}
                      className="hover:bg-blue-50"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Rotate
                    </Button>
                    
                    {apiKey.is_active ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => revokeApiKey(apiKey.id)}
                        className="hover:bg-red-50 hover:border-red-200 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Revoke
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => reactivateApiKey(apiKey.id)}
                        className="hover:bg-green-50 hover:border-green-200 hover:text-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Reactivate
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* API Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-600" />
            API Information
          </CardTitle>
          <CardDescription>Base URLs and endpoint information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Base URL</Label>
              <div className="flex items-center gap-2">
                <code className="bg-slate-100 px-3 py-2 rounded font-mono text-sm flex-1">
                  https://resumeak.onrender.com
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard('https://resumeak.onrender.com', 'Base URL')}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium">Documentation</Label>
              <div className="flex items-center gap-2">
                <code className="bg-slate-100 px-3 py-2 rounded font-mono text-sm flex-1">
                  /docs
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open('/docs', '_blank')}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
        <p className="text-slate-600 mt-1">Manage your account preferences and security settings</p>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                General Preferences
              </CardTitle>
              <CardDescription>Configure your dashboard appearance and behavior</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Theme</Label>
                  <p className="text-sm text-muted-foreground">Choose your preferred color scheme</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant={theme === 'light' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTheme('light')}
                  >
                    <Sun className="h-4 w-4 mr-2" />
                    Light
                  </Button>
                  <Button
                    variant={theme === 'dark' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTheme('dark')}
                  >
                    <Moon className="h-4 w-4 mr-2" />
                    Dark
                  </Button>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Language</Label>
                  <p className="text-sm text-muted-foreground">Select your preferred language</p>
                </div>
                <select 
                  value={language} 
                  onChange={(e) => setLanguage(e.target.value)}
                  className="border border-input bg-background px-3 py-2 text-sm rounded-md"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Timezone</Label>
                  <p className="text-sm text-muted-foreground">Set your local timezone for accurate timestamps</p>
                </div>
                <select 
                  value={timezone} 
                  onChange={(e) => setTimezone(e.target.value)}
                  className="border border-input bg-background px-3 py-2 text-sm rounded-md"
                >
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                  <option value="Europe/London">London</option>
                  <option value="Asia/Tokyo">Tokyo</option>
                </select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Choose how you want to be notified about important events</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive updates via email</p>
                </div>
                <Switch 
                  checked={notifications.email}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, email: checked }))}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">Browser push notifications</p>
                </div>
                <Switch 
                  checked={notifications.push}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, push: checked }))}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">SMS Alerts</Label>
                  <p className="text-sm text-muted-foreground">Critical alerts via SMS</p>
                </div>
                <Switch 
                  checked={notifications.sms}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, sms: checked }))}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-sm font-medium">Security Alerts</Label>
                  <p className="text-sm text-muted-foreground">Suspicious activity notifications</p>
                </div>
                <Switch 
                  checked={notifications.security}
                  onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, security: checked }))}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldIcon className="h-5 w-5" />
                Security Settings
              </CardTitle>
              <CardDescription>Manage your account security and access controls</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-100 rounded-full">
                      <Lock className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Enable 2FA
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Key className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">API Key Rotation</p>
                      <p className="text-sm text-muted-foreground">Automatically rotate keys every 90 days</p>
                    </div>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-full">
                      <Globe className="h-4 w-4 text-purple-600" />
                    </div>
                    <div>
                      <p className="font-medium">IP Restrictions</p>
                      <p className="text-sm text-muted-foreground">Limit API access to specific IP addresses</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Configure
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Billing & Usage
              </CardTitle>
              <CardDescription>Manage your subscription and view usage details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-900">Free Plan</h3>
                    <p className="text-blue-700">1,000 requests per month</p>
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    Upgrade Plan
                  </Button>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Usage this month</span>
                    <span>247 / 1,000</span>
                  </div>
                  <div className="w-full bg-blue-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '24.7%' }}></div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Available Plans</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border-2 border-blue-200 bg-blue-50">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <h5 className="font-semibold">Starter</h5>
                        <p className="text-2xl font-bold mt-2">$29<span className="text-sm font-normal">/mo</span></p>
                        <p className="text-sm text-muted-foreground mt-1">10,000 requests</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-2 border-green-200 bg-green-50">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <h5 className="font-semibold">Professional</h5>
                        <p className="text-2xl font-bold mt-2">$99<span className="text-sm font-normal">/mo</span></p>
                        <p className="text-sm text-muted-foreground mt-1">100,000 requests</p>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border-2 border-purple-200 bg-purple-50">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <h5 className="font-semibold">Enterprise</h5>
                        <p className="text-2xl font-bold mt-2">Custom</p>
                        <p className="text-sm text-muted-foreground mt-1">Unlimited requests</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Profile</h2>
        <p className="text-slate-600 mt-1">Manage your personal information and developer profile</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Picture & Basic Info */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="h-24 w-24">
                <AvatarImage src="" />
                <AvatarFallback className="bg-blue-100 text-blue-600 text-xl font-semibold">
                  {(profileData.firstName?.[0] || '') + (profileData.lastName?.[0] || '') || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <p className="font-medium">{profileData.firstName} {profileData.lastName}</p>
                <p className="text-sm text-muted-foreground">{profileData.email}</p>
              </div>
              <Button variant="outline" size="sm" className="w-full">
                <Upload className="h-4 w-4 mr-2" />
                Upload Photo
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Profile Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Personal Information
            </CardTitle>
            <CardDescription>Update your personal and company details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  value={profileData.firstName}
                  onChange={(e) => setProfileData(prev => ({ ...prev, firstName: e.target.value }))}
                  placeholder="John"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  value={profileData.lastName}
                  onChange={(e) => setProfileData(prev => ({ ...prev, lastName: e.target.value }))}
                  placeholder="Doe"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={profileData.email}
                  onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="john@company.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="company"
                  value={profileData.company}
                  onChange={(e) => setProfileData(prev => ({ ...prev, company: e.target.value }))}
                  placeholder="Acme Corp"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="website"
                  value={profileData.website}
                  onChange={(e) => setProfileData(prev => ({ ...prev, website: e.target.value }))}
                  placeholder="https://company.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  value={profileData.phone}
                  onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            <Button className="bg-blue-600 hover:bg-blue-700">
              Save Changes
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Developer Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Developer Information
          </CardTitle>
          <CardDescription>Your developer account details and API limits</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Partner ID</Label>
              <div className="flex items-center gap-2">
                <code className="bg-slate-100 px-2 py-1 rounded text-sm font-mono">
                  {developerProfile?.partner_id || 'Loading...'}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(developerProfile?.partner_id || '', 'Partner ID')}
                >
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Current Plan</Label>
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                {developerProfile?.api_usage_plan || 'Free'}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">Monthly Limit</Label>
              <p className="font-semibold">
                {developerProfile?.monthly_request_limit?.toLocaleString() || '1,000'} requests
              </p>
            </div>
            
            <div className="space-y-2">
              <Label className="text-sm font-medium text-muted-foreground">API Keys</Label>
              <p className="font-semibold">
                {apiKeys.filter(k => k.is_active).length} active
              </p>
            </div>
          </div>
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
      case 'analytics':
        return <ApiAnalytics />;
      case 'test':
        return <ApiTester apiKey={getActiveApiKey()} />;
      case 'docs':
        return <ApiDocumentation apiKey={getActiveApiKey() || ''} />;
      case 'profile':
        return renderProfile();
      case 'settings':
        return renderSettings();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <DashboardSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search..."
                  className="pl-10 w-80 bg-slate-50 border-slate-200"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" className="text-slate-600 hover:text-slate-900">
                <HelpCircle className="h-4 w-4 mr-2" />
                Help
              </Button>
              
              <NotificationDropdown />
              
              <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-blue-100 text-blue-600 text-sm">
                    {(user?.user_metadata?.first_name?.[0] || '') + (user?.user_metadata?.last_name?.[0] || '') || user?.email?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-slate-900">
                    {user?.user_metadata?.first_name || user?.email?.split('@')[0] || 'User'}
                  </p>
                  <p className="text-xs text-slate-500">Developer</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;