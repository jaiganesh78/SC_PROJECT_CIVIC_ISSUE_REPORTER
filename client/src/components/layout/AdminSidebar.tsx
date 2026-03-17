import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Shield, 
  FileWarning, 
  Map, 
  BarChart3, 
  ChevronLeft, 
  ChevronRight,
  Settings
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const adminNavItems = [
  {
    href: '/admin/pending',
    label: 'Pending Verification',
    icon: Shield,
    description: 'Review resolved issues',
  },
  {
    href: '/admin/fake-reports',
    label: 'Fake Reports',
    icon: FileWarning,
    description: 'Staff-flagged issues',
  },
  {
    href: '/admin/map',
    label: 'Global Map',
    icon: Map,
    description: 'View all issues',
  },
  {
    href: '/admin/analytics',
    label: 'Analytics',
    icon: BarChart3,
    description: 'System statistics',
  },
  {
    href: '/admin/settings',
    label: 'Settings',
    icon: Settings,
    description: 'System configuration',
  },
];

export function AdminSidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        'hidden border-r border-sidebar-border bg-sidebar transition-all duration-300 lg:flex lg:flex-col',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex h-14 items-center justify-between border-b border-sidebar-border px-4">
          {!collapsed && (
            <span className="text-sm font-semibold text-sidebar-foreground">Admin Panel</span>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-sidebar-foreground"
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-2">
          {adminNavItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors',
                location.pathname === item.href
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                  : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && (
                <div className="flex flex-col">
                  <span className="font-medium">{item.label}</span>
                  <span className="text-xs text-sidebar-foreground/50">{item.description}</span>
                </div>
              )}
            </Link>
          ))}
        </nav>

        {/* Stats summary (when not collapsed) */}
        {!collapsed && (
          <div className="border-t border-sidebar-border p-4">
            <div className="rounded-lg bg-sidebar-accent/50 p-3">
              <p className="text-xs font-medium text-sidebar-foreground/70">Quick Stats</p>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="font-semibold text-sidebar-foreground">24</p>
                  <p className="text-sidebar-foreground/50">Pending</p>
                </div>
                <div>
                  <p className="font-semibold text-sidebar-foreground">5</p>
                  <p className="text-sidebar-foreground/50">Flagged</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
