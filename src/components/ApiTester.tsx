
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ApiTesterProps {
  apiKey: string;
}

const ApiTester: React.FC<ApiTesterProps> = ({ apiKey }) => {
  const [loading, setLoading] = useState(false);
  const [testEndpoint, setTestEndpoint] = useState<'check' | 'relay'>('check');
  const [toAddress, setToAddress] = useState('0x742b15b5c3c4f1b0c5b7f7d4b5f7d4b5f7d4b5f7');
  const [fromAddress, setFromAddress] = useState('0x123b15b5c3c4f1b0c5b7f7d4b5f7d4b5f7d4b5f7');
  const [rawTx, setRawTx] = useState('0x02f8b20182019684773594008504a817c80082ea6094742b15b5c3c4f1b0c5b7f7d4b5f7d4b5f7d4b5f7880de0b6b3a764000080c080a01234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdefa01234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testCheckEndpoint = async () => {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch('https://resumeak.onrender.com/v1/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          chain: 'ethereum',
          to: toAddress,
          from: fromAddress,
          value: '1000000000000000000',
          asset: 'ETH'
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || `HTTP ${response.status}`);
      }

      setResult(data);
      toast.success('API test successful!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      toast.error(`API test failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const testRelayEndpoint = async () => {
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch('https://resumeak.onrender.com/v1/relay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          chain: 'ethereum',
          rawTx: rawTx,
          idempotencyKey: `test-${Date.now()}`
        })
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || `HTTP ${response.status}`);
      }

      setResult(data);
      toast.success('API test successful!');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      toast.error(`API test failed: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  const handleTest = () => {
    if (testEndpoint === 'check') {
      testCheckEndpoint();
    } else {
      testRelayEndpoint();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          API Endpoint Tester
        </CardTitle>
        <CardDescription>
          Test your API key with the deployed endpoints at resumeak.onrender.com
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Select Endpoint to Test</Label>
          <div className="flex gap-2">
            <Button
              variant={testEndpoint === 'check' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTestEndpoint('check')}
            >
              /v1/check
            </Button>
            <Button
              variant={testEndpoint === 'relay' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTestEndpoint('relay')}
            >
              /v1/relay
            </Button>
          </div>
        </div>

        {testEndpoint === 'check' ? (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="toAddress">To Address</Label>
                <Input
                  id="toAddress"
                  value={toAddress}
                  onChange={(e) => setToAddress(e.target.value)}
                  placeholder="0x..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fromAddress">From Address</Label>
                <Input
                  id="fromAddress"
                  value={fromAddress}
                  onChange={(e) => setFromAddress(e.target.value)}
                  placeholder="0x..."
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="rawTx">Raw Transaction (Hex)</Label>
            <Textarea
              id="rawTx"
              value={rawTx}
              onChange={(e) => setRawTx(e.target.value)}
              placeholder="0x02f8..."
              rows={3}
            />
          </div>
        )}

        <Button onClick={handleTest} disabled={loading} className="w-full">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Testing...
            </>
          ) : (
            `Test ${testEndpoint === 'check' ? '/v1/check' : '/v1/relay'} Endpoint`
          )}
        </Button>

        {result && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <Label className="text-green-600">Success Response</Label>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <pre className="text-sm overflow-x-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={result.allowed ? "default" : "destructive"}>
                {result.allowed ? "Allowed" : "Blocked"}
              </Badge>
              <Badge variant="outline">
                {result.risk_band} Risk
              </Badge>
              <Badge variant="secondary">
                Score: {result.risk_score}
              </Badge>
            </div>
          </div>
        )}

        {error && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-600" />
              <Label className="text-red-600">Error Response</Label>
            </div>
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ApiTester;
