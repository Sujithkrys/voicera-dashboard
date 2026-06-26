import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { createClient } from "@supabase/supabase-js";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card";
import { AlertCircle, ArrowLeft, CheckCircle2, ChevronRight, Activity } from "lucide-react";
import { Alert, AlertDescription } from "../components/ui/alert";

const BACKEND_URL = 'https://voicera-dashboard-production.up.railway.app';
const SUPABASE_URL = 'https://zlqefahavxdqfhpejqyd.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpscWVmYWhhdnhkcWZocGVqcXlkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxNzE3NTYsImV4cCI6MjA5Nzc0Nzc1Nn0.IoR3jrcbt1QGSaxLzUt1tqePpQ6a1ORnUPFhZHnimyQ';
export const _supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("signUp");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const hash = location.hash;
    const isRecovery = hash.includes('type=recovery') || hash.includes('recovery');

    if (isRecovery) {
      setActiveTab('newPassword');
    } else if (urlParams.get('activated') === 'true') {
      setSuccessMsg('✓ Account activated successfully! You can now sign in below.');
      setActiveTab('signIn');
    } else if (urlParams.get('error') === 'activation_failed') {
      setErrorMsg('The activation link is invalid, expired, or has already been used.');
      setActiveTab('signUp');
    }
  }, [location]);

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    const formData = new FormData(e.currentTarget);
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirm = formData.get("confirm") as string;

    if (password !== confirm) {
      setErrorMsg('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          company_name: fullName,
          company_email: email,
          password: password,
          domain: email.split('@')[1] || ''
        })
      });
      
      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.detail || 'Failed to create account.');
        setIsLoading(false);
        return;
      }

      setSuccessMsg('✓ Account created! Please check your email to activate your account.');
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setErrorMsg('Unable to connect to authentication server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.detail || 'Invalid email or password.');
        setIsLoading(false);
        return;
      }

      localStorage.setItem('voicera_token', data.access_token);
      localStorage.setItem('voicera_backend_token', data.access_token);
      localStorage.setItem('voicera_email', data.user.email);
      localStorage.setItem('voicera_name', data.user.full_name);
      localStorage.setItem('voicera_client_id', data.client.id);
      localStorage.setItem('voicera_company', data.client.company_name);
      localStorage.setItem('voicera_role', data.user.role);

      setSuccessMsg('✓ Signed in successfully! Redirecting...');
      setTimeout(() => {
        navigate('/');
      }, 800);
    } catch (err) {
      setErrorMsg('Unable to connect to authentication server. Please try again.');
      setIsLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    const email = (new FormData(e.currentTarget)).get("email") as string;
    if (!email) {
      setErrorMsg('Please enter your work email.');
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await _supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin + '/login'
      });

      if (error) {
        setErrorMsg(error.message);
      } else {
        setSuccessMsg('Password reset email sent. Check your inbox.');
      }
    } catch (err) {
      setErrorMsg('Unable to complete request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");
    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirm = formData.get("confirm") as string;

    if (password !== confirm) {
      setErrorMsg('Passwords do not match.');
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await _supabase.auth.updateUser({ password });
      if (error) {
        setErrorMsg(error.message);
        return;
      }
      setSuccessMsg('✓ Password updated successfully! You can now sign in.');
      navigate('/login', { replace: true });
      setActiveTab('signIn');
    } catch (err) {
      setErrorMsg('Unable to update password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-muted/40">
      {/* Left Brand Pane */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 p-12 bg-zinc-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="z-10">
          <Button variant="ghost" className="text-zinc-400 hover:text-white hover:bg-white/10 -ml-4 mb-8" onClick={() => navigate('/')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back home
          </Button>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/20">
              <Activity className="w-5 h-5" />
            </div>
            <span className="font-bold text-2xl tracking-tight">Voicera</span>
          </div>
        </div>

        <div className="z-10 max-w-lg mt-24 mb-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-8">
            <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(129,140,248,0.8)]" />
            Start free, no card
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight leading-[1.15] mb-6">
            500 free minutes.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
              Live in under an hour.
            </span>
          </h1>
          <p className="text-lg text-zinc-400 leading-relaxed mb-12">
            Trusted by support teams at fintechs, marketplaces, and SaaS leaders. No credit card required to start.
          </p>
          
          <div className="flex gap-12">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Setup time</span>
              <span className="text-2xl font-bold">~12 <span className="text-base font-medium text-zinc-400">min</span></span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Free credits</span>
              <span className="text-2xl font-bold">500 <span className="text-base font-medium text-zinc-400">min</span></span>
            </div>
          </div>
        </div>
        
        <div className="z-10 text-sm text-zinc-600">
          © {new Date().getFullYear()} Voicera Inc.
        </div>
      </div>

      {/* Right Form Pane */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight mb-2">
              {activeTab === 'signUp' ? 'Create an account' : 
               activeTab === 'signIn' ? 'Welcome back' : 
               activeTab === 'reset' ? 'Reset password' : 'Set new password'}
            </h2>
            <p className="text-muted-foreground">
              {activeTab === 'signUp' ? 'Get started in a couple of minutes.' : 
               activeTab === 'signIn' ? 'Sign in to access your dashboard.' : 
               activeTab === 'reset' ? "We'll send a recovery link to your inbox." : 'Choose a strong secure password for your account.'}
            </p>
          </div>

          {errorMsg && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{errorMsg}</AlertDescription>
            </Alert>
          )}

          {successMsg && (
            <Alert className="mb-6 border-green-500/20 bg-green-500/10 text-green-600">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription>{successMsg}</AlertDescription>
            </Alert>
          )}

          {activeTab === 'reset' ? (
             <form onSubmit={handleReset} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="reset-email">Work email</Label>
                <Input id="reset-email" name="email" type="email" placeholder="name@company.com" required />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>
              <div className="text-center mt-4">
                <Button variant="link" onClick={() => setActiveTab('signIn')} className="text-muted-foreground">
                  Back to sign in
                </Button>
              </div>
            </form>
          ) : activeTab === 'newPassword' ? (
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password">New password</Label>
                <Input id="new-password" name="password" type="password" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-confirm">Confirm new password</Label>
                <Input id="new-confirm" name="confirm" type="password" required />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Updating...' : 'Update Password'}
              </Button>
            </form>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8">
                <TabsTrigger value="signIn">Sign In</TabsTrigger>
                <TabsTrigger value="signUp">Sign Up</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signUp">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full name</Label>
                    <Input id="signup-name" name="fullName" placeholder="Jane Doe" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Work email</Label>
                    <Input id="signup-email" name="email" type="email" placeholder="jane@company.com" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <Input id="signup-password" name="password" type="password" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-confirm">Confirm password</Label>
                      <Input id="signup-confirm" name="confirm" type="password" required />
                    </div>
                  </div>
                  <Button type="submit" className="w-full mt-2" disabled={isLoading}>
                    {isLoading ? 'Creating account...' : 'Create account'}
                    {!isLoading && <ChevronRight className="w-4 h-4 ml-2" />}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signIn">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">Work email</Label>
                    <Input id="signin-email" name="email" type="email" placeholder="jane@company.com" required />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="signin-password">Password</Label>
                      <Button variant="link" className="p-0 h-auto text-xs font-normal" onClick={() => setActiveTab('reset')} type="button">
                        Forgot password?
                      </Button>
                    </div>
                    <Input id="signin-password" name="password" type="password" required />
                  </div>
                  <Button type="submit" className="w-full mt-2" disabled={isLoading}>
                    {isLoading ? 'Signing in...' : 'Sign In'}
                    {!isLoading && <ChevronRight className="w-4 h-4 ml-2" />}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>
    </div>
  );
}
