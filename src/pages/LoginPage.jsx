import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import { BookOpen, Check, ShieldCheck, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [email, setEmail] = useState('member@slpcurriculum.com');
  const [password, setPassword] = useState('password123');
  const [displayName, setDisplayName] = useState('Sarah Johnson, CCC-SLP');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegisterMode) {
        await register(email, password, displayName);
      } else {
        await login(email, password);
      }
      navigate('/');
    } catch (err) {
      console.error('Auth error:', err);
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = () => {
    setEmail('member@slpcurriculum.com');
    setPassword('password123');
    setIsRegisterMode(false);
    setError(null);
  };

  const handleAdminFill = () => {
    setEmail('admin@slpcurriculum.com');
    setPassword('password123');
    setIsRegisterMode(false);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Logo & Heading */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-white mb-2 shadow-xs">
            <BookOpen className="w-6 h-6" />
          </div>
          <h1 className="font-heading text-3xl font-bold text-text">
            The SLP Curriculum
          </h1>
          <p className="text-sm text-text-muted">
            Better Lives for SLPs: Headless Member Portal
          </p>
        </div>

        {/* Auth Card */}
        <Card className="p-8 bg-surface border border-border shadow-xs space-y-6">
          <div className="border-b border-border pb-4 flex items-center justify-between gap-2">
            <h2 className="font-heading text-lg font-bold text-text">
              {isRegisterMode ? 'Create Member Account' : 'Member Sign In'}
            </h2>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleDemoFill}
                className="text-xs font-semibold text-primary hover:underline cursor-pointer"
              >
                Member Demo
              </button>
              <span className="text-stone-300">|</span>
              <button
                type="button"
                onClick={handleAdminFill}
                className="text-xs font-semibold text-tertiary hover:underline cursor-pointer"
              >
                Admin / VA Demo
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded bg-red-50 border border-error/30 text-xs text-error font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegisterMode && (
              <Input
                label="Full Name & Clinical Credentials"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g. Sarah Johnson, CCC-SLP"
                required
              />
            )}

            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="therapist@speechtherapy.org"
              required
            />

            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
              className="w-full mt-2 font-semibold"
            >
              {loading
                ? 'Validating Member Access...'
                : isRegisterMode
                ? 'Register & Enter Library'
                : 'Sign In to Dashboard'}
            </Button>
          </form>

          {/* Toggle Register / Login */}
          <div className="text-center pt-2 border-t border-border">
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                setError(null);
              }}
              className="text-xs text-stone-600 hover:text-primary transition-colors cursor-pointer"
            >
              {isRegisterMode
                ? 'Already have an active membership? Sign in here'
                : 'Need to create an account? Register as a therapist'}
            </button>
          </div>
        </Card>

        {/* MemberPress Security Notice */}
        <div className="text-center text-xs text-stone-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Synchronized with MemberPress &amp; Rumahweb MySQL Database</span>
        </div>
      </div>
    </div>
  );
}
