
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { ArrowUpIcon, ArrowDownIcon, Activity, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ApiUsageData {
  date: string;
  requests: number;
  successful: number;
  failed: number;
}

interface RelayLogData {
  id: number;
  partner_id: string;
  chain: string;
  from_addr: string;
  to_addr: string;
  risk_score: number;
  risk_band: string;
  decision: string;
  reasons: string[];
  tx_hash: string;
  created_at: string;
}

interface AnalyticsMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  avgResponseTime: number;
  activeApiKeys: number;
  requestsToday: number;
  successRate: number;
  topEndpoint: string;
}

const ApiAnalytics = () => {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<AnalyticsMetrics>({
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    avgResponseTime: 0,
    activeApiKeys: 0,
    requestsToday: 0,
    successRate: 0,
    topEndpoint: '/v1/check'
  });
  const [usageData, setUsageData] = useState<ApiUsageData[]>([]);
  const [recentLogs, setRecentLogs] = useState<RelayLogData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('7');

  // Fetch analytics data
  const fetchAnalytics = async () => {
    if (!user) return;

    try {
      // Get user's API keys
      const { data: apiKeys } = await supabase
        .from('api_keys')
        .select('id, partner_id, is_active')
        .eq('user_id', user.id);

      if (!apiKeys) return;

      const activeKeys = apiKeys.filter(key => key.is_active);
      const partnerIds = apiKeys.map(key => key.partner_id).filter(Boolean);

      // Get API usage data
      const daysAgo = parseInt(timeRange);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysAgo);

      const { data: usage } = await supabase
        .from('api_usage')
        .select('*')
        .in('api_key_id', apiKeys.map(k => k.id))
        .gte('timestamp', startDate.toISOString())
        .order('timestamp', { ascending: true });

      // Get relay logs
      const { data: relayLogs } = await supabase
        .from('relay_logs')
        .select('*')
        .in('partner_id', partnerIds)
        .order('created_at', { ascending: false })
        .limit(10);

      // Process usage data for chart
      const dailyUsage = processUsageData(usage || [], daysAgo);
      setUsageData(dailyUsage);

      // Calculate metrics
      const totalRequests = usage?.length || 0;
      const successfulRequests = usage?.filter(u => u.status_code && u.status_code < 400).length || 0;
      const failedRequests = totalRequests - successfulRequests;
      const avgResponseTime = usage?.reduce((acc, u) => acc + (u.response_time_ms || 0), 0) / totalRequests || 0;
      
      const today = new Date().toDateString();
      const requestsToday = usage?.filter(u => new Date(u.timestamp).toDateString() === today).length || 0;
      
      const successRate = totalRequests > 0 ? (successfulRequests / totalRequests) * 100 : 0;

      setMetrics({
        totalRequests,
        successfulRequests,
        failedRequests,
        avgResponseTime: Math.round(avgResponseTime),
        activeApiKeys: activeKeys.length,
        requestsToday,
        successRate: Math.round(successRate),
        topEndpoint: '/v1/check'
      });

      setRecentLogs(relayLogs || []);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const processUsageData = (usage: any[], days: number): ApiUsageData[] => {
    const dateMap = new Map<string, { requests: number; successful: number; failed: number }>();
    
    // Initialize with empty data for each day
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      dateMap.set(dateStr, { requests: 0, successful: 0, failed: 0 });
    }

    // Fill with actual data
    usage.forEach(u => {
      const dateStr = new Date(u.timestamp).toISOString().split('T')[0];
      const existing = dateMap.get(dateStr);
      if (existing) {
        existing.requests++;
        if (u.status_code && u.status_code < 400) {
          existing.successful++;
        } else {
          existing.failed++;
        }
      }
    });

    return Array.from(dateMap.entries()).map(([date, data]) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      ...data
    }));
  };

  // Real-time subscription
  useEffect(() => {
    fetchAnalytics();

    // Set up real-time subscription for API usage
    const channel = supabase
      .channel('api-analytics')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'api_usage'
        },
        () => {
          fetchAnalytics();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'relay_logs'
        },
        () => {
          fetchAnalytics();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, timeRange]);

  const getChangeColor = (value: number) => {
    if (value > 0) return 'text-green-600';
    if (value < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  const getChangeIcon = (value: number) => {
    if (value > 0) return <ArrowUpIcon className="h-3 w-3" />;
    if (value < 0) return <ArrowDownIcon className="h-3 w-3" />;
    return null;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="h-8 bg-muted rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalRequests.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              <span>All time requests</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Today's Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.requestsToday.toLocaleString()}</div>
            <div className="flex items-center text-xs mt-1">
              <span className="text-muted-foreground">Requests today</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.successRate}%</div>
            <div className="flex items-center text-xs mt-1">
              <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
              <span className="text-muted-foreground">Successful requests</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.avgResponseTime}ms</div>
            <div className="flex items-center text-xs mt-1">
              <Clock className="h-3 w-3 text-blue-500 mr-1" />
              <span className="text-muted-foreground">Average latency</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <Tabs defaultValue="requests" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="requests">API Requests</TabsTrigger>
            <TabsTrigger value="logs">Recent Activity</TabsTrigger>
          </TabsList>
          <div className="flex items-center space-x-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="text-sm border rounded px-2 py-1"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 3 months</option>
            </select>
          </div>
        </div>

        <TabsContent value="requests">
          <Card>
            <CardHeader>
              <CardTitle>API Usage Over Time</CardTitle>
              <CardDescription>
                Track your API requests and success rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={{
                  requests: {
                    label: "Total Requests",
                    color: "hsl(var(--chart-1))",
                  },
                  successful: {
                    label: "Successful",
                    color: "hsl(var(--chart-2))",
                  },
                  failed: {
                    label: "Failed",
                    color: "hsl(var(--chart-3))",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={usageData}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Area
                      type="monotone"
                      dataKey="requests"
                      stackId="1"
                      stroke="var(--color-requests)"
                      fill="var(--color-requests)"
                      fillOpacity={0.3}
                    />
                    <Area
                      type="monotone"
                      dataKey="successful"
                      stackId="2"
                      stroke="var(--color-successful)"
                      fill="var(--color-successful)"
                      fillOpacity={0.3}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Recent Relay Activity</CardTitle>
              <CardDescription>
                Latest AML compliance checks and decisions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentLogs.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No recent activity found.
                  </div>
                ) : (
                  recentLogs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-full ${
                          log.decision === 'ALLOW' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}>
                          {log.decision === 'ALLOW' ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                        </div>
                        <div>
                          <div className="font-medium">
                            {log.chain.toUpperCase()} Transaction
                          </div>
                          <div className="text-sm text-muted-foreground">
                            To: {log.to_addr.slice(0, 10)}...{log.to_addr.slice(-8)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={log.decision === 'ALLOW' ? 'default' : 'destructive'}>
                          {log.decision}
                        </Badge>
                        <div className="text-xs text-muted-foreground mt-1">
                          Risk: {log.risk_band}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ApiAnalytics;
