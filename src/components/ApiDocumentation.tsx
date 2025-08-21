
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Copy, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            API Integration Guide
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open("https://resumeak.onrender.com/docs", "_blank")}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Full Documentation
            </Button>
          </CardTitle>
          <CardDescription>
            Your API is deployed at <code>https://resumeak.onrender.com</code> and ready to use with your API keys.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Badge variant="outline">POST</Badge>
              <h4 className="font-medium">/v1/check</h4>
              <p className="text-sm text-muted-foreground">
                Check if a transaction would be allowed without actually executing it
              </p>
            </div>
            <div className="space-y-2">
              <Badge variant="outline">POST</Badge>
              <h4 className="font-medium">/v1/relay</h4>
              <p className="text-sm text-muted-foreground">
                Execute a transaction through the AML-compliant relay service
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>cURL Examples</CardTitle>
          <CardDescription>Test your API endpoints using these cURL commands</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
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
            <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
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
            <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
              {relayExample}
            </pre>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>JavaScript/TypeScript Example</CardTitle>
          <CardDescription>Integrate the API into your web application</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
            <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
              {jsExample}
            </pre>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Response Format</CardTitle>
          <CardDescription>Understanding API responses</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Success Response</h4>
            <pre className="bg-muted p-4 rounded-lg text-sm">
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

          <div className="space-y-2">
            <h4 className="font-medium text-sm">Blocked Response</h4>
            <pre className="bg-muted p-4 rounded-lg text-sm">
{`{
  "allowed": false,
  "risk_band": "HIGH",
  "risk_score": 85,
  "reasons": ["High risk score threshold"],
  "status": "blocked"
}`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApiDocumentation;
