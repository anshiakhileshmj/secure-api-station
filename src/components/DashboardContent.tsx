
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';

interface DashboardContentProps {
  activeSection: string;
  apiKeysCount: number;
}

const DashboardContent = ({ activeSection, apiKeysCount }: DashboardContentProps) => {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const renderOverview = () => (
    <div className="space-y-6">
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
            <span className="text-2xl font-bold">{apiKeysCount}</span>
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
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
      </div>
      <Card>
        <CardContent className="p-6">
          <p className="text-gray-500">Settings panel coming soon...</p>
        </CardContent>
      </Card>
    </div>
  );

  switch (activeSection) {
    case 'overview':
      return renderOverview();
    case 'settings':
      return renderSettings();
    default:
      return renderOverview();
  }
};

export default DashboardContent;
