import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Sparkles, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify.');
      return;
    }

    setLoading(true);
    try {
      const { error: signUpError } = await signUp(email, password);
      if (signUpError) {
        setError(signUpError.message);
      } else {
        // Automatically logged in and directed straight into the workspace
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to create an account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-slate-50 to-indigo-50/40 p-4">
      <Card className="w-full max-w-md shadow-xl border border-slate-200/90 rounded-2xl bg-white/95 backdrop-blur-sm">
        <CardHeader className="space-y-3 pb-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-md shadow-indigo-600/25">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <CardTitle className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Create Your Account
            </CardTitle>
            <CardDescription className="text-sm text-slate-500 mt-1">
              Join DeadlineOS AI for autonomous study planning
            </CardDescription>
          </div>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 p-3 rounded-xl flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-bold text-slate-700">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="student@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="bg-slate-50/50"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-bold text-slate-700">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="bg-slate-50/50"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-xs font-bold text-slate-700">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Repeat password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
                className="bg-slate-50/50"
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 pt-4">
            <Button
              type="submit"
              className="w-full h-11 text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-600/25 flex items-center justify-center gap-2"
              disabled={loading}
            >
              <span>{loading ? 'Creating Account...' : 'Get Started Free'}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>

            <div className="text-xs text-center text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-bold hover:underline">
                Sign in
              </Link>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}