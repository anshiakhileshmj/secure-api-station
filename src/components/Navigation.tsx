import React from 'react';
import { Button } from '@/components/ui/button';
import { Shield, LogOut, Key } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
const Navigation = () => {
  const {
    user,
    signOut
  } = useAuth();
  const navigate = useNavigate();
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };
  return <nav className="border-b border-border bg-card/50 backdrop-blur-sm">
      
    </nav>;
};
export default Navigation;