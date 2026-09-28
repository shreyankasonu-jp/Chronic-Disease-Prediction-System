import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Lock, AlertCircle, Stethoscope, Heart, Activity, Pill, Thermometer, Syringe, Shield, Plus } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Floating medical icons data
const floatingIcons = [
  { Icon: Stethoscope, delay: 0, duration: 6, size: 28, color: "text-blue-400" },
  { Icon: Activity, delay: 1, duration: 7, size: 26, color: "text-green-400" },
  { Icon: Pill, delay: 2, duration: 9, size: 20, color: "text-blue-500" },
  { Icon: Thermometer, delay: 3, duration: 6, size: 22, color: "text-teal-400" },
  { Icon: Syringe, delay: 4, duration: 8, size: 24, color: "text-blue-400" },
  { Icon: Shield, delay: 5, duration: 7, size: 26, color: "text-blue-600" },
  { Icon: Activity, delay: 6, duration: 5, size: 20, color: "text-emerald-400" },
  { Icon: Stethoscope, delay: 7, duration: 7, size: 22, color: "text-cyan-400" },
  { Icon: Thermometer, delay: 8, duration: 8, size: 18, color: "text-blue-300" },
  { Icon: Shield, delay: 9, duration: 6, size: 24, color: "text-teal-500" },
];

const FloatingIcon = ({ Icon, delay, duration, size, color }: any) => {
  const randomX = Math.random() * 100;
  const randomY = Math.random() * 100;
  
  return (
    <div
      className={`absolute ${color} opacity-20 pointer-events-none`}
      style={{
        left: `${randomX}%`,
        top: `${randomY}%`,
        animation: `float ${duration}s ease-in-out infinite`,
        animationDelay: `${delay}s`,
      }}
    >
      <Icon size={size} />
    </div>
  );
};

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const success = await login(username, password);
    
    if (success) {
      navigate("/");
    } else {
      setError("Invalid credentials. Please try again.");
    }
    
    setLoading(false);
  };

  return (
    <>
      <style>{`
        @keyframes float {
          0%, 100% { 
            transform: translateY(0px) rotate(0deg) scale(1); 
            opacity: 0.15;
          }
          25% { 
            transform: translateY(-25px) rotate(5deg) scale(1.1); 
            opacity: 0.25;
          }
          50% { 
            transform: translateY(-15px) rotate(-5deg) scale(0.9); 
            opacity: 0.3;
          }
          75% { 
            transform: translateY(-20px) rotate(3deg) scale(1.05); 
            opacity: 0.2;
          }
        }
        
        @keyframes gentlePulse {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(1.05); }
        }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-gentle-pulse {
          animation: gentlePulse 4s ease-in-out infinite;
        }
        
        .animate-slide-in-up {
          animation: slideInUp 0.6s ease-out;
        }
      `}</style>
      
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100/80 via-teal-100/80 to-emerald-100/80 backdrop-blur-2xl relative overflow-hidden">
        <Helmet>
          <title>Login | AI Health Diagnosis Platform</title>
          <meta name="description" content="Login to access the AI Health Diagnosis Platform." />
          <link rel="canonical" href="/login" />
        </Helmet>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating medical icons */}
        {floatingIcons.map((iconData, index) => (
          <FloatingIcon key={index} {...iconData} />
        ))}
        
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-600/70 rounded-full mix-blend-multiply filter blur-xl animate-gentle-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-64 h-64 bg-teal-600/70 rounded-full mix-blend-multiply filter blur-xl animate-gentle-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-emerald-600/70 rounded-full mix-blend-multiply filter blur-xl animate-gentle-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Main decorative icons */}
      <div className="absolute top-10 left-10 opacity-10">
        <Stethoscope size={120} className="text-blue-600 animate-pulse" />
      </div>
      <div className="absolute bottom-10 right-10 opacity-10">
        <Activity size={100} className="text-teal-500 animate-pulse" style={{ animationDuration: '3s' }} />
      </div>

      <div className="glass rounded-2xl p-8 w-full max-w-md animate-slide-in-up relative z-10 backdrop-blur-lg bg-white/80 shadow-2xl border border-white/20 hover:shadow-3xl transition-all duration-300">
        <Card className="border-0 shadow-none bg-transparent">
          <CardHeader>
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-teal-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                <Stethoscope className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-center text-2xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              AI Health Diagnosis
            </CardTitle>
            <p className="text-center text-blue-700 mt-2 font-medium">
              Please sign in to continue
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative group">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-blue-500 transition-colors" />
                <Input 
                  type="text" 
                  placeholder="Username" 
                  className="pl-10 border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/70 backdrop-blur-sm" 
                  aria-label="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div className="relative group">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-blue-500 transition-colors" />
                <Input 
                  type="password" 
                  placeholder="Password" 
                  className="pl-10 border-2 border-blue-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 bg-white/70 backdrop-blur-sm" 
                  aria-label="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-500 to-teal-600 hover:from-blue-600 hover:to-teal-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200" 
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Signing in...
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>
            
            <div className="text-center text-sm text-muted-foreground mt-4">
              <div className="bg-gradient-to-r from-blue-50 to-teal-50 p-4 rounded-lg border border-blue-200 shadow-sm">
                <div className="flex items-center justify-center mb-2">
                  <Shield className="w-4 h-4 text-blue-600 mr-2" />
                  <p className="font-medium text-blue-800">Demo Credentials</p>
                </div>
                <p className="text-blue-600">Username: <strong className="text-blue-800">admin</strong></p>
                <p className="text-blue-600">Password: <strong className="text-blue-800">admin</strong></p>
              </div>
            </div>
            
            <div className="text-center text-sm text-muted-foreground">
              By continuing you agree to our <NavLink to="/about" className="story-link">terms</NavLink>.
            </div>
          </CardContent>
        </Card>
      </div>
      </div>
    </>
  );
};

export default Login;
