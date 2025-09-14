import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { 
  LayoutDashboard, Key, User, Settings, Moon, LogOut, Building2, 
  ChevronLeft, ChevronRight, BarChart3, TestTube, BookOpen, 
  Shield, CreditCard, Bell, Palette, Database, Code, Activity
} from 'lucide-react';
  LayoutDashboard, Key, User, Settings, Moon, LogOut, Building2, 
  ChevronLeft, ChevronRight, BarChart3, TestTube, BookOpen, 
  Shield, CreditCard, Bell, Palette, Database, Code
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
interface DashboardSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}
const DashboardSidebar = ({
  activeSection,
  onSectionChange,
  isCollapsed,
  onToggleCollapse
}: DashboardSidebarProps) => {
  const {
    user,
    signOut
  } = useAuth();
  const location = useLocation();
  const navigationItems = [{
    category: 'OVERVIEW',
    items: [{
      id: 'overview',
      label: 'Dashboard',
      icon: LayoutDashboard
    }]
  }, {
    category: 'API MANAGEMENT',
    items: [{
      id: 'keys',
      label: 'API Keys',
      icon: Key
    }, {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3
    }, {
      id: 'test',
      label: 'API Tester',
      icon: TestTube
    }, {
      id: 'docs',
      label: 'Documentation',
      icon: BookOpen
    }]
  }, {
    category: 'ACCOUNT',
    items: [{
      id: 'profile',
      label: 'Profile',
      icon: User
    }, {
      id: 'settings',
      label: 'Settings',
      icon: Settings
    }, {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3
    }, {
      id: 'test',
      label: 'API Tester',
      icon: TestTube
    }, {
      id: 'docs',
      label: 'Documentation',
      icon: BookOpen
    }]
  }];
  const handleSignOut = async () => {
    await signOut();
  };
  return <div className={`h-screen bg-gradient-to-b from-slate-900 to-slate-800 border-r border-slate-700 flex flex-col transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'} relative shadow-2xl`}>
      {/* Header */}
      <div className={`${isCollapsed ? 'p-2' : 'p-4'} border-b border-slate-700`}>
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            {!isCollapsed && <div>
                <h2 className="font-semibold text-white">Relay API</h2>
                <p className="text-xs text-slate-400">AML Compliance</p>
              </div>}
          </div>
          {!isCollapsed && <Button variant="ghost" size="sm" onClick={onToggleCollapse} className="p-1 h-8 w-8 hover:bg-slate-700 text-slate-300">
              <ChevronLeft className="w-4 h-4" />
            </Button>}
        </div>
      </div>

      {/* Expand button when collapsed - positioned at top right of sidebar */}
      {isCollapsed && <Button variant="ghost" size="sm" onClick={onToggleCollapse} className="absolute top-4 right-2 p-1 h-6 w-6 z-10 hover:bg-slate-700 text-slate-300">
          <ChevronRight className="w-3 h-3" />
        </Button>}

      {/* Navigation */}
      <div className="flex-1 py-4">
        {navigationItems.map((category, categoryIndex) => <div key={category.category} className={`${categoryIndex > 0 ? 'mt-6' : ''}`}>
            {!isCollapsed && <h3 className="px-4 text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">
                {category.category}
              </h3>}
            <nav className={`space-y-1 ${isCollapsed ? 'px-2' : 'px-2'}`}>
              {category.items.map(item => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return <button key={item.id} onClick={() => onSectionChange(item.id)} className={`w-full flex items-center gap-3 px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${isActive ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg' : 'text-slate-300 hover:bg-slate-700 hover:text-white'} ${isCollapsed ? 'justify-center' : ''}`} title={isCollapsed ? item.label : undefined}>
                    <Icon className={`${isCollapsed ? 'w-5 h-5' : 'w-5 h-5'}`} />
                    {!isCollapsed && item.label}
                  </button>;
          })}
            </nav>
          </div>)}

        {/* Dark Mode Toggle */}
        {!isCollapsed && <div className="px-4 mt-6">
            
          </div>}
        
        {/* Dark Mode Toggle - Collapsed */}
        {isCollapsed && <div className="px-2 mt-6">
            <div className="flex justify-center">
              <Button variant="ghost" size="sm" className="p-3 hover:bg-slate-700" title="Dark mode">
                <Moon className="w-5 h-5 text-slate-300" />
              </Button>
            </div>
          </div>}
      </div>

      {/* User Profile & Logout */}
      <div className={`${isCollapsed ? 'p-2' : 'p-4'} border-t border-slate-700`}>
        {!isCollapsed && <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-slate-300" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.email?.split('@')[0] || 'User'}
              </p>
              <p className="text-xs text-slate-400">Developer</p>
            </div>
          </div>}
        
        <Button variant="ghost" onClick={handleSignOut} className={`w-full text-slate-300 hover:text-white hover:bg-slate-700 ${isCollapsed ? 'justify-center p-3' : 'justify-start'}`} title={isCollapsed ? 'Log out' : undefined}>
          <LogOut className="w-4 h-4" />
          {!isCollapsed && <span className="ml-2">Log out</span>}
        </Button>
      </div>
    </div>;
};
export default DashboardSidebar;