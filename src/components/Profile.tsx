
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Building, Globe, Mail } from 'lucide-react';
import { toast } from 'sonner';

interface DeveloperProfile {
  partner_id: string;
  company_name: string | null;
  website: string | null;
  api_usage_plan: string;
  monthly_request_limit: number;
}

const Profile = () => {
  const { user } = useAuth();
  const [developerProfile, setDeveloperProfile] = useState<DeveloperProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [website, setWebsite] = useState('');

  useEffect(() => {
    if (user) {
      fetchDeveloperProfile();
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
      setCompanyName(data.company_name || '');
      setWebsite(data.website || '');
    } catch (error) {
      console.error('Error fetching developer profile:', error);
      toast.error('Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async () => {
    if (!developerProfile) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('developer_profiles')
        .update({
          company_name: companyName.trim() || null,
          website: website.trim() || null,
        })
        .eq('user_id', user?.id);

      if (error) throw error;

      setDeveloperProfile(prev => prev ? {
        ...prev,
        company_name: companyName.trim() || null,
        website: website.trim() || null,
      } : null);

      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/4"></div>
          <div className="h-32 bg-muted rounded"></div>
          <div className="h-32 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Profile Settings</h2>
        <p className="text-muted-foreground">Manage your developer profile and account settings</p>
      </div>

      {/* Account Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Account Information
          </CardTitle>
          <CardDescription>Your basic account details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Email Address</Label>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <Input value={user?.email || ''} readOnly className="bg-muted" />
            </div>
          </div>
          {developerProfile && (
            <div className="space-y-2">
              <Label>Partner ID</Label>
              <Input 
                value={developerProfile.partner_id} 
                readOnly 
                className="font-mono text-sm bg-muted"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Company Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-5 w-5" />
            Company Information
          </CardTitle>
          <CardDescription>Update your company details (optional)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              placeholder="Enter your company name"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="website">Website</Label>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <Input
                id="website"
                placeholder="https://yourwebsite.com"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>
          </div>
          <Button 
            onClick={updateProfile} 
            disabled={saving}
            className="bg-primary hover:bg-primary/90"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>

      {/* API Usage Plan */}
      {developerProfile && (
        <Card>
          <CardHeader>
            <CardTitle>API Usage Plan</CardTitle>
            <CardDescription>Your current API usage plan and limits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Current Plan</Label>
                <div className="p-2 bg-muted rounded font-medium capitalize">
                  {developerProfile.api_usage_plan}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Monthly Request Limit</Label>
                <div className="p-2 bg-muted rounded font-medium">
                  {developerProfile.monthly_request_limit.toLocaleString()} requests
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Profile;
