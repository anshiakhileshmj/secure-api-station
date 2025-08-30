
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard, 
  Key, 
  User, 
  Settings, 
  Moon, 
  LogOut,
  Building2,
  ChevronLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

interface DashboardSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const DashboardSidebar = ({ activeSection, onSectionChange, isCollapsed, onToggleCollapse }: DashboardSidebarProps) => {
  const { user, signOut } = useAuth();
  const location = useLocation();

  const navigationItems = [
    {
      category: 'MAIN',
      items: [
        { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'keys', label: 'API Keys', icon: Key },
      ]
    },
    {
      category: 'ACCOUNT',
      items: [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'settings', label: 'Settings', icon: Settings },
      ]
    }
  ];

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className={`h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="font-semibold text-gray-900">Relay API</h2>
                <p className="text-xs text-gray-500">AML Compliance</p>
              </div>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="p-1 h-8 w-8"
          >
            <ChevronLeft className={`w-4 h-4 transition-transform duration-200 ${isCollapsed ? 'rotate-180' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-6">
        {navigationItems.map((category) => (
          <div key={category.category} className="mb-6">
            {!isCollapsed && (
              <h3 className="px-6 text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">
                {category.category}
              </h3>
            )}
            <nav className={`space-y-1 ${isCollapsed ? 'px-2' : 'px-3'}`}>
              {category.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => onSectionChange(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-700 border-r-2 border-emerald-500'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    } ${isCollapsed ? 'justify-center' : ''}`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon className="w-5 h-5" />
                    {!isCollapsed && item.label}
                  </button>
                );
              })}
            </nav>
          </div>
        ))}

        {/* Dark Mode Toggle */}
        {!isCollapsed && (
          <div className="px-6 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Moon className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">Dark mode</span>
              </div>
              <Switch />
            </div>
          </div>
        )}
        
        {/* Dark Mode Toggle - Collapsed */}
        {isCollapsed && (
          <div className="px-2 mb-6">
            <div className="flex justify-center">
              <Button
                variant="ghost"
                size="sm"
                className="p-2"
                title="Dark mode"
              >
                <Moon className="w-5 h-5 text-gray-600" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* User Profile & Logout */}
      <div className={`p-4 border-t border-gray-200 ${isCollapsed ? 'px-2' : 'p-6'}`}>
        {!isCollapsed && (
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-gray-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.email?.split('@')[0] || 'User'}
              </p>
              <p className="text-xs text-gray-500">Developer</p>
            </div>
          </div>
        )}
        
        <Button
          variant="ghost"
          onClick={handleSignOut}
          className={`w-full text-gray-600 hover:text-gray-900 hover:bg-gray-50 ${
            isCollapsed ? 'justify-center p-2' : 'justify-start'
          }`}
          title={isCollapsed ? 'Log out' : undefined}
        >
          <LogOut className="w-4 h-4" />
          {!isCollapsed && <span className="ml-2">Log out</span>}
        </Button>
      </div>
    </div>
  );
};

export default DashboardSidebar;
