import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(email, password);
      // Navigation happens automatically in AuthLayout
    } catch (err) {
      setError('Invalid email or password. Try demo accounts below.');
    }
  };

  const handleDemoLogin = async (demoEmail: string) => {
    setError('');
    try {
      await login(demoEmail, 'demo');
    } catch (err) {
      setError('Failed to login');
    }
  };

  return (
    <div className="flex min-h-screen w-full">
      {/* Left side - Form */}
      <div className="flex w-full flex-col justify-center px-4 sm:px-6 lg:w-1/2 lg:px-8">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Leaf className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold">CivicReport</span>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Welcome back</CardTitle>
              <CardDescription>
                Sign in to your account to continue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign in'
                  )}
                </Button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-2 text-muted-foreground">Demo Accounts</span>
                  </div>
                </div>

                <div className="mt-4 grid gap-2">
                  <Button 
                    variant="outline" 
                    onClick={() => handleDemoLogin('citizen@demo.com')}
                    disabled={isLoading}
                    className="justify-start"
                  >
                    <span className="mr-2">👤</span>
                    Citizen - citizen@demo.com
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleDemoLogin('staff@demo.com')}
                    disabled={isLoading}
                    className="justify-start"
                  >
                    <span className="mr-2">🏢</span>
                    Staff - staff@demo.com
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => handleDemoLogin('admin@demo.com')}
                    disabled={isLoading}
                    className="justify-start"
                  >
                    <span className="mr-2">🛡️</span>
                    Admin - admin@demo.com
                  </Button>
                </div>
              </div>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                Don't have an account?{' '}
                <Link to="/register" className="font-medium text-primary hover:underline">
                  Register
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Right side - Hero */}
      <div className="hidden bg-primary lg:flex lg:w-1/2 lg:flex-col lg:justify-center lg:p-12">
        <div className="mx-auto max-w-lg text-primary-foreground">
          <h1 className="text-4xl font-bold">
            Report civic issues. Track progress. Build better communities.
          </h1>
          <p className="mt-4 text-lg text-primary-foreground/80">
            Join thousands of citizens actively improving their neighborhoods by 
            reporting and tracking civic issues in real-time.
          </p>
          <div className="mt-8 grid gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-foreground/20">
                ✓
              </div>
              <div>
                <p className="font-medium">Easy Reporting</p>
                <p className="text-sm text-primary-foreground/70">
                  Snap a photo and submit in seconds
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-foreground/20">
                ✓
              </div>
              <div>
                <p className="font-medium">Real-time Tracking</p>
                <p className="text-sm text-primary-foreground/70">
                  Follow your issue from report to resolution
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-foreground/20">
                ✓
              </div>
              <div>
                <p className="font-medium">Community Voting</p>
                <p className="text-sm text-primary-foreground/70">
                  Prioritize issues that matter most
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
