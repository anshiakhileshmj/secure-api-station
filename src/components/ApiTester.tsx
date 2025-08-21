
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, AlertTriangle, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ApiTesterProps {
  apiKey: string | null;
}

const SANCTIONED_TEST_ADDRESSES = [
  '0x4f47bc496083c727c5fbe3ce9cdf2b0f6496270c',
  '0x983a81ca6FB1e441266D2FbcB7D8E530AC2E05A2',
  '0xb6f5ec1a0a9cd1526536d3f0426c429529471f40'
];

const CLEAN_TEST_ADDRESS = '0x742d35Cc6645C0532979A1f8A4D5fB2C61a8BaF6';

export default function ApiTester({ apiKey }: ApiTesterProps) {
  const [endpoint, setEndpoint] = useState<'check' | 'relay'>('check');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [customAddress, setCustomAddress] = useState('');
  const [selectedTestAddress, setSelectedTestAddress] = useState('');

  const testCheckEndpoint = async (toAddress: string) => {
    if (!apiKey) {
      setError('No API key available');
      toast.error('No API key found. Please create an API key first.');
      return;
    }

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      console.log('Making API request with key:', apiKey.substring(0, 10) + '...');
      console.log('Testing address:', toAddress);
      
      const response = await fetch('https://resumeak.onrender.com/v1/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          chain: 'ethereum',
          to: toAddress,
          from: '0x742d35Cc6645C0532979A1f8A4D5fB2C61a8BaF6',
          value: '1000000000000000000',
          asset: 'ETH'
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorData}`);
      }

      const data = await response.json();
      setResult(data);
      
      if (data.allowed) {
        toast.success('Transaction allowed');
      } else {
        toast.error('Transaction blocked');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      toast.error(`API test failed: ${errorMessage}`);
      console.error('API test error:', err);
    } finally {
      setLoading(false);
    }
  };

  const testRelayEndpoint = async () => {
    if (!apiKey) {
      setError('No API key available');
      toast.error('No API key found. Please create an API key first.');
      return;
    }

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      console.log('Making relay API request with key:', apiKey.substring(0, 10) + '...');
      
      const response = await fetch('https://resumeak.onrender.com/v1/relay', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          chain: 'ethereum',
          rawTx: '0x02f86d0182012c8459682f008459682f0e825208942f389ce8bd8ff92de3402ffce4691d17fc4f653587038d7ea4c680008080c001a0123456789abcdef123456789abcdef123456789abcdef123456789abcdef1234a0123456789abcdef123456789abcdef123456789abcdef123456789abcdef1234',
          idempotencyKey: `test-${Date.now()}`
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorData}`);
      }

      const data = await response.json();
      setResult(data);
      
      if (data.allowed) {
        toast.success('Relay successful');
      } else {
        toast.error('Relay blocked');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      toast.error(`API test failed: ${errorMessage}`);
      console.error('Relay API test error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTest = () => {
    const addressToTest = customAddress || selectedTestAddress;
    
    if (endpoint === 'check') {
      if (!addressToTest) {
        toast.error('Please select a test address or enter a custom one');
        return;
      }
      testCheckEndpoint(addressToTest);
    } else {
      testRelayEndpoint();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Endpoint Tester</CardTitle>
        <CardDescription>
          Test the /v1/check and /v1/relay endpoints with your API key
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!apiKey && (
          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <p className="text-yellow-800 text-sm">⚠️ No API key available. Please create an active API key first to test the endpoints.</p>
          </div>
        )}
        
        <div className="space-y-2">
          <Label>Select Endpoint to Test</Label>
          <div className="flex gap-2">
            <Button
              variant={endpoint === 'check' ? 'default' : 'outline'}
              onClick={() => setEndpoint('check')}
              size="sm"
            >
              /v1/check
            </Button>
            <Button
              variant={endpoint === 'relay' ? 'default' : 'outline'}
              onClick={() => setEndpoint('relay')}
              size="sm"
            >
              /v1/relay
            </Button>
          </div>
        </div>

        {endpoint === 'check' && (
          <>
            <div className="space-y-2">
              <Label>Test Address Selection</Label>
              <Select value={selectedTestAddress} onValueChange={setSelectedTestAddress}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a test address" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={CLEAN_TEST_ADDRESS}>
                    {CLEAN_TEST_ADDRESS.substring(0, 20)}... (Clean Address)
                  </SelectItem>
                  {SANCTIONED_TEST_ADDRESSES.map((address) => (
                    <SelectItem key={address} value={address}>
                      {address.substring(0, 20)}... (⚠️ Sanctioned)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="custom-address">Or Enter Custom Address</Label>
              <Input
                id="custom-address"
                placeholder="0x..."
                value={customAddress}
                onChange={(e) => setCustomAddress(e.target.value)}
              />
            </div>

            {(selectedTestAddress || customAddress) && (
              <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Testing address:</strong> {customAddress || selectedTestAddress}
                  {SANCTIONED_TEST_ADDRESSES.includes(customAddress || selectedTestAddress) && (
                    <Badge variant="destructive" className="ml-2">Sanctioned</Badge>
                  )}
                </p>
              </div>
            )}
          </>
        )}

        {endpoint === 'relay' && (
          <div className="bg-orange-50 border border-orange-200 p-3 rounded-lg">
            <p className="text-sm text-orange-800">
              <AlertTriangle className="h-4 w-4 inline mr-1" />
              <strong>Note:</strong> The relay endpoint uses a test transaction that will be rejected by the network. 
              This is for testing the risk assessment only.
            </p>
          </div>
        )}

        <Button onClick={handleTest} disabled={loading || !apiKey} className="w-full">
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Testing...
            </>
          ) : (
            `Test ${endpoint === 'check' ? '/v1/check' : '/v1/relay'} Endpoint`
          )}
        </Button>

        {result && (
          <div className="space-y-3 mt-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <Label className="text-sm font-medium">API Response:</Label>
              <pre className="text-xs mt-1 overflow-x-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
            {result.allowed !== undefined && (
              <div className="flex items-center gap-2">
                <Badge variant={result.allowed ? "default" : "destructive"}>
                  {result.allowed ? (
                    <>
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Allowed
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Blocked
                    </>
                  )}
                </Badge>
                {result.risk_band && (
                  <Badge variant="outline">
                    {result.risk_band} Risk
                  </Badge>
                )}
                {result.risk_score !== undefined && (
                  <Badge variant="secondary">
                    Score: {result.risk_score}
                  </Badge>
                )}
              </div>
            )}
            {result.reasons && result.reasons.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                <Label className="text-sm font-medium">Reasons:</Label>
                <ul className="text-sm mt-1 space-y-1">
                  {result.reasons.map((reason: string, index: number) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="w-1 h-1 bg-yellow-600 rounded-full"></span>
                      {reason}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 p-3 rounded-lg">
            <p className="text-red-800 text-sm">
              <AlertTriangle className="h-4 w-4 inline mr-1" />
              <strong>Error:</strong> {error}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
