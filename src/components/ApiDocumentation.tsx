import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Copy, ExternalLink, BookOpen, Code, Terminal, Zap, Shield, Key } from 'lucide-react';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ApiDocumentationProps {
  apiKey: string;
}

const ApiDocumentation: React.FC<ApiDocumentationProps> = ({ apiKey }) => {
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const checkExample = `curl -X POST "https://resumeak.onrender.com/v1/check" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -d '{
    "chain": "ethereum",
    "to": "0x742b15b5c3c4f1b0c5b7f7d4b5f7d4b5f7d4b5f7",
    "from": "0x123b15b5c3c4f1b0c5b7f7d4b5f7d4b5f7d4b5f7",
    "value": "1000000000000000000",
    "asset": "ETH"
  }'`;

  const relayExample = `curl -X POST "https://resumeak.onrender.com/v1/relay" \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${apiKey}" \\
  -d '{
    "chain": "ethereum",
    "rawTx": "0x02f8b20182019684773594008504a817c80082ea6094742b15b5c3c4f1b0c5b7f7d4b5f7d4b5f7d4b5f7880de0b6b3a764000080c080a01234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdefa01234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
    "idempotencyKey": "unique-key-123"
  }'`;

  const jsExample = `const response = await fetch('https://resumeak.onrender.com/v1/check', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ${apiKey}'
  },
  body: JSON.stringify({
    chain: 'ethereum',
    to: '0x742b15b5c3c4f1b0c5b7f7d4b5f7d4b5f7d4b5f7',
    from: '0x123b15b5c3c4f1b0c5b7f7d4b5f7d4b5f7d4b5f7',
    value: '1000000000000000000',
    asset: 'ETH'
  })
});

const data = await response.json();
console.log(data);`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">API Documentation</h2>
          <p className="text-slate-600 mt-1">Complete guide to integrating with our AML API</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => window.open("/docs", "_blank")}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Interactive Docs
        </Button>
      </div>

      {/* Quick Start Guide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600" />
            Quick Start
          </CardTitle>
          <CardDescription>
            Get started with our AML API in minutes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto mb-3">
                <Key className="h-6 w-6 text-blue-600" />
              </div>
              <h4 className="font-medium mb-2">1. Get API Key</h4>
              <p className="text-sm text-muted-foreground">Create an API key in the Keys section</p>
            </div>
            
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="p-3 bg-green-100 rounded-full w-fit mx-auto mb-3">
                <Code className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-medium mb-2">2. Make Request</h4>
              <p className="text-sm text-muted-foreground">Send POST requests to our endpoints</p>
            </div>
            
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="p-3 bg-purple-100 rounded-full w-fit mx-auto mb-3">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
              <h4 className="font-medium mb-2">3. Get Results</h4>
              <p className="text-sm text-muted-foreground">Receive AML compliance decisions</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Endpoints */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="h-5 w-5 text-slate-600" />
            Available Endpoints
          </CardTitle>
          <CardDescription>Complete list of API endpoints and their usage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border border-slate-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">POST</Badge>
                <code className="font-mono text-sm">/v1/check</code>
                <Badge variant="secondary" className="ml-auto">Primary</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Pre-flight AML compliance check without executing the transaction
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="font-medium">Rate Limit:</span> 60/min
                </div>
                <div>
                  <span className="font-medium">Response Time:</span> ~150ms
                </div>
                <div>
                  <span className="font-medium">Success Rate:</span> 99.9%
                </div>
              </div>
            </div>

            <div className="border border-slate-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">POST</Badge>
                <code className="font-mono text-sm">/v1/relay</code>
                <Badge variant="secondary" className="ml-auto">Advanced</Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Execute transactions through AML-compliant relay with automatic blocking
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="font-medium">Rate Limit:</span> 60/min
                </div>
                <div>
                  <span className="font-medium">Response Time:</span> ~300ms
                </div>
                <div>
                  <span className="font-medium">Success Rate:</span> 99.5%
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Code Examples */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5 text-slate-600" />
            Code Examples
          </CardTitle>
          <CardDescription>Ready-to-use code snippets for popular languages</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="javascript" className="space-y-4">
            <TabsList>
              <TabsTrigger value="javascript">JavaScript</TabsTrigger>
              <TabsTrigger value="curl">cURL</TabsTrigger>
              <TabsTrigger value="python">Python</TabsTrigger>
            </TabsList>
            
            <TabsContent value="javascript" className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Fetch API Example</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(jsExample, "JavaScript code")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <pre className="bg-slate-50 p-4 rounded-lg text-sm overflow-x-auto border">
                  {jsExample}
                </pre>
              </div>
            </TabsContent>
            
            <TabsContent value="curl" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Check Endpoint</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(checkExample, "cURL command")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <pre className="bg-slate-50 p-4 rounded-lg text-sm overflow-x-auto border">
                    {checkExample}
                  </pre>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Relay Endpoint</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(relayExample, "cURL command")}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                  <pre className="bg-slate-50 p-4 rounded-lg text-sm overflow-x-auto border">
                    {relayExample}
                  </pre>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="python" className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Python Requests Example</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(`import requests

url = "https://resumeak.onrender.com/v1/check"
headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer ${apiKey}"
}
data = {
    "chain": "ethereum",
    "to": "0x742b15b5c3c4f1b0c5b7f7d4b5f7d4b5f7d4b5f7",
    "from": "0x123b15b5c3c4f1b0c5b7f7d4b5f7d4b5f7d4b5f7",
    "value": "1000000000000000000",
    "asset": "ETH"
}

response = requests.post(url, json=data, headers=headers)
result = response.json()
print(result)`, "Python code")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <pre className="bg-slate-50 p-4 rounded-lg text-sm overflow-x-auto border">
{`import requests

url = "https://resumeak.onrender.com/v1/check"
headers = {
    "Content-Type": "application/json",
    "Authorization": f"Bearer ${apiKey}"
}
data = {
    "chain": "ethereum",
    "to": "0x742b15b5c3c4f1b0c5b7f7d4b5f7d4b5f7d4b5f7",
    "from": "0x123b15b5c3c4f1b0c5b7f7d4b5f7d4b5f7d4b5f7",
    "value": "1000000000000000000",
    "asset": "ETH"
}

response = requests.post(url, json=data, headers=headers)
result = response.json()
print(result)`}
                </pre>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Response Examples */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-slate-600" />
            Response Examples
          </CardTitle>
          <CardDescription>Understanding different API response formats</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="success" className="space-y-4">
            <TabsList>
              <TabsTrigger value="success">Success</TabsTrigger>
              <TabsTrigger value="blocked">Blocked</TabsTrigger>
              <TabsTrigger value="error">Error</TabsTrigger>
            </TabsList>
            
            <TabsContent value="success" className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">200 OK</Badge>
                  <span className="text-sm font-medium">Transaction Allowed</span>
                </div>
                <pre className="bg-slate-50 p-4 rounded-lg text-sm border">
{`{
  "allowed": true,
  "risk_band": "LOW",
  "risk_score": 15,
  "txHash": "0xabc123...", // Only for /v1/relay
  "reasons": [],
  "status": null // "alert" or "blocked" if applicable
}`}
                </pre>
              </div>
            </TabsContent>

            <TabsContent value="blocked" className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">403 Forbidden</Badge>
                  <span className="text-sm font-medium">Transaction Blocked</span>
                </div>
                <pre className="bg-slate-50 p-4 rounded-lg text-sm border">
{`{
  "allowed": false,
  "risk_band": "HIGH",
  "risk_score": 85,
  "reasons": ["High risk score threshold"],
  "status": "blocked"
}`}
                </pre>
              </div>
            </TabsContent>
            
            <TabsContent value="error" className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">400 Bad Request</Badge>
                  <span className="text-sm font-medium">Invalid Request</span>
                </div>
                <pre className="bg-slate-50 p-4 rounded-lg text-sm border">
{`{
  "detail": "Invalid 'to' address format. Expected 0x-prefixed EVM address.",
  "status_code": 400
}`}
                </pre>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiDocumentation;