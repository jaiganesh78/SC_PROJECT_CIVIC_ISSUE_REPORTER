import { useAuth } from '@/contexts/AuthContext';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Calendar,
  Star,
  Building2
} from 'lucide-react';
import { format } from 'date-fns';

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) return null;

  const roleConfig = {
    citizen: { label: 'Citizen', color: 'bg-primary/10 text-primary' },
    department_staff: { label: 'Department Staff', color: 'bg-status-assigned/10 text-status-assigned' },
    admin: { label: 'Administrator', color: 'bg-status-verified/10 text-status-verified' },
  };

  return (
    <MainLayout requireAuth>
      <div className="container max-w-3xl py-8">
        <h1 className="mb-8 text-3xl font-bold">Profile</h1>

        {/* Profile card */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col items-center gap-6 sm:flex-row">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl font-bold">{user.name}</h2>
                <p className="text-muted-foreground">{user.email}</p>
                <div className="mt-2 flex flex-wrap justify-center gap-2 sm:justify-start">
                  <Badge className={roleConfig[user.role].color}>
                    <Shield className="mr-1 h-3 w-3" />
                    {roleConfig[user.role].label}
                  </Badge>
                  {user.department && (
                    <Badge variant="outline">
                      <Building2 className="mr-1 h-3 w-3" />
                      {user.department}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Details */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <User className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Full Name</p>
                  <p className="font-medium">{user.name}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">{user.email}</p>
                </div>
              </div>

              {user.phone && (
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Phone</p>
                    <p className="font-medium">{user.phone}</p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Member Since</p>
                  <p className="font-medium">
                    {format(new Date(user.created_at), 'MMMM d, yyyy')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {user.role === 'citizen' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Trust Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <Star className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{user.trust_score || 100}</p>
                    <p className="text-sm text-muted-foreground">out of 100</p>
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">
                  Your trust score reflects the authenticity of your reports. 
                  Accurate reports improve your score, while fake reports lower it.
                </p>
                <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div 
                    className="h-full bg-primary transition-all"
                    style={{ width: `${user.trust_score || 100}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {user.role === 'department_staff' && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Department Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Issues Resolved</p>
                  <p className="text-2xl font-bold">47</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Average Resolution Time</p>
                  <p className="text-2xl font-bold">2.3 days</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Verification Rate</p>
                  <p className="text-2xl font-bold">94%</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Edit form */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Edit Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="editName">Full Name</Label>
                  <Input id="editName" defaultValue={user.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="editPhone">Phone Number</Label>
                  <Input id="editPhone" defaultValue={user.phone || ''} />
                </div>
              </div>
              <Button type="submit">Save Changes</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
