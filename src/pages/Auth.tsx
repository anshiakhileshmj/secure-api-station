
import React, { useState } from 'react';
import AuthForm from '@/components/AuthForm';

const Auth = () => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');

  const handleToggleMode = () => {
    setMode(mode === 'signin' ? 'signup' : 'signin');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <AuthForm mode={mode} onToggleMode={handleToggleMode} />
    </div>
  );
};

export default Auth;
