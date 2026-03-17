import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  ClipboardList, 
  Map, 
  ChevronLeft, 
  ChevronRight,
  CheckCircle,
  Clock
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const staffNavItems = [
  {
    href: '/staff/assigned',
    label: 'Assigned Issues',
    icon: ClipboardList,
    description: 'Your department issues',
  },
  {
    href: '/staff/map',
    label: 'Map View',
    icon: Map,
    description: 'Visualize locations',
  },
];

export function StaffSidebar() {
  const location = useLocation();
  const { user } = useAuth();
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
            <div>
              <span className="text-sm font-semibold text-sidebar-foreground">Staff Panel</span>
              {user?.department && (
                <p className="text-xs text-sidebar-foreground/50">{user.department}</p>
              )}
            </div>
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
          {staffNavItems.map((item) => (
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

        {/* Work summary (when not collapsed) */}
        {!collapsed && (
          <div className="border-t border-sidebar-border p-4">
            <div className="rounded-lg bg-sidebar-accent/50 p-3">
              <p className="text-xs font-medium text-sidebar-foreground/70">Your Activity</p>
              <div className="mt-2 space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <Clock className="h-3.5 w-3.5 text-status-pending" />
                  <span className="text-sidebar-foreground">8 Pending</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <CheckCircle className="h-3.5 w-3.5 text-status-resolved" />
                  <span className="text-sidebar-foreground">12 Resolved this week</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
