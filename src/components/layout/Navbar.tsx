import { NavLink, useNavigate } from "react-router-dom";
import { Stethoscope, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const navItems = [
  { label: "Home", to: "/" },
  { label: "Pneumonia", to: "/pneumonia" },
  { label: "Stroke", to: "/stroke" },
  { label: "Diabetes", to: "/diabetes" },
  { label: "Dashboard", to: "/dashboard" },
  { label: "About", to: "/about" },
];

export const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="fixed top-0 z-50 w-full">
      {/* Floating background with glass morphism - bright design */}
      <div className="absolute inset-0 backdrop-blur-2xl border-b bg-gradient-to-r from-blue-100/80 via-teal-100/80 to-emerald-100/80 border-blue-300/50"></div>

      {/* Animated floating particles in navbar */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-2 left-20 w-3 h-3 bg-blue-600/80 rounded-full animate-pulse blur-sm" style={{ animationDelay: '0s', animationDuration: '3s' }}></div>
        <div className="absolute top-4 left-40 w-2 h-2 bg-teal-600/80 rounded-full animate-bounce blur-sm" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
        <div className="absolute top-1 right-32 w-4 h-4 bg-emerald-600/80 rounded-full animate-ping blur-sm" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>
        <div className="absolute top-3 right-20 w-2.5 h-2.5 bg-blue-700/80 rounded-full animate-pulse blur-sm" style={{ animationDelay: '0.5s', animationDuration: '3.5s' }}></div>
        <div className="absolute top-2 left-1/2 w-1.5 h-1.5 bg-teal-700/80 rounded-full animate-bounce blur-sm" style={{ animationDelay: '1.5s', animationDuration: '4.5s' }}></div>
        <div className="absolute top-4 left-1/3 w-3.5 h-3.5 bg-emerald-700/80 rounded-full animate-ping blur-sm" style={{ animationDelay: '2.5s', animationDuration: '6s' }}></div>
        <div className="absolute top-1 right-1/3 w-2 h-2 bg-blue-800/80 rounded-full animate-pulse blur-sm" style={{ animationDelay: '3s', animationDuration: '4s' }}></div>
      </div>

      <div className="container mx-auto flex h-16 items-center justify-between relative z-10">
        <NavLink to="/" className="flex items-center gap-3 group">
          <style>{`
            @keyframes logo-dance {
              0%, 100% { transform: rotate(0deg) scale(1) translateY(0px); }
              25% { transform: rotate(-8deg) scale(1.15) translateY(-3px); }
              50% { transform: rotate(8deg) scale(1.1) translateY(-2px); }
              75% { transform: rotate(-5deg) scale(1.12) translateY(-4px); }
            }
            
            @keyframes logo-glow {
              0%, 100% { 
                box-shadow: 0 0 25px rgba(59, 130, 246, 0.8), 
                           0 0 50px rgba(20, 184, 166, 0.6),
                           0 0 75px rgba(139, 92, 246, 0.4); 
              }
              50% { 
                box-shadow: 0 0 35px rgba(59, 130, 246, 1), 
                           0 0 70px rgba(20, 184, 166, 0.8),
                           0 0 100px rgba(139, 92, 246, 0.6); 
              }
            }
            
            @keyframes text-shimmer {
              0% { background-position: -200% 0; }
              100% { background-position: 200% 0; }
            }
            
            @keyframes rainbow-border {
              0%, 100% { border-color: rgba(59, 130, 246, 0.8); }
              25% { border-color: rgba(20, 184, 166, 0.8); }
              50% { border-color: rgba(139, 92, 246, 0.8); }
              75% { border-color: rgba(236, 72, 153, 0.8); }
            }
            
            .logo-dance { animation: logo-dance 4s ease-in-out infinite; }
            .logo-glow { animation: logo-glow 3s ease-in-out infinite; }
            .rainbow-border { animation: rainbow-border 4s linear infinite; }
            .text-shimmer {
              background: linear-gradient(90deg, #1e40af, #3b82f6, #0d9488, #059669, #1e40af);
              background-size: 300% 100%;
              animation: text-shimmer 4s linear infinite;
              -webkit-background-clip: text;
              background-clip: text;
              -webkit-text-fill-color: transparent;
            }
          `}</style>
          <div className="relative">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-teal-600 via-emerald-600 to-blue-700 text-white shadow-2xl logo-dance logo-glow group-hover:scale-125 transition-all duration-500 border-2 rainbow-border">
              <Stethoscope className="h-7 w-7" aria-hidden />
            </div>
            {/* Enhanced floating particles around logo */}
            <div className="absolute -top-2 -right-2 w-3 h-3 bg-gradient-to-r from-blue-400 to-teal-400 rounded-full animate-ping shadow-lg"></div>
            <div className="absolute -bottom-2 -left-2 w-2.5 h-2.5 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full animate-pulse shadow-lg"></div>
            <div className="absolute top-1/2 -right-3 w-2 h-2 bg-gradient-to-r from-teal-400 to-emerald-400 rounded-full animate-bounce shadow-lg"></div>
            <div className="absolute -top-1 left-1/2 w-1.5 h-1.5 bg-gradient-to-r from-blue-400 to-teal-500 rounded-full animate-pulse shadow-lg"></div>
            <div className="absolute bottom-1/2 -left-3 w-2.5 h-2.5 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full animate-ping shadow-lg"></div>
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-shimmer group-hover:scale-110 transition-transform duration-500 drop-shadow-lg">
              AI Health Diagnosis
            </span>
            <span className="text-xs bg-gradient-to-r from-teal-600 to-blue-600 bg-clip-text text-transparent group-hover:from-blue-600 group-hover:to-emerald-600 transition-all duration-500 font-medium">
              Chronic Disease Prediction
            </span>
          </div>
        </NavLink>

        {isAuthenticated && (
          <nav className="hidden gap-3 md:flex">
            <style>{`
              @keyframes nav-glow {
                0%, 100% { 
                  box-shadow: 0 0 15px rgba(59, 130, 246, 0.4),
                             0 0 30px rgba(20, 184, 166, 0.3); 
                }
                50% { 
                  box-shadow: 0 0 25px rgba(59, 130, 246, 0.7),
                             0 0 50px rgba(20, 184, 166, 0.5); 
                }
              }
              
              @keyframes nav-float {
                0%, 100% { transform: translateY(0px) scale(1); }
                50% { transform: translateY(-4px) scale(1.05); }
              }
              
              @keyframes nav-rainbow {
                0%, 100% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
              }
              
              .nav-item-active {
                animation: nav-glow 3s ease-in-out infinite;
                background: linear-gradient(45deg, #1e40af, #3b82f6, #0d9488, #059669);
                background-size: 300% 300%;
                animation: nav-glow 3s ease-in-out infinite, nav-rainbow 4s ease infinite;
              }
              
              .nav-item-hover:hover {
                animation: nav-float 0.4s ease-in-out;
              }
              
              .nav-glass {
                backdrop-filter: blur(12px);
                background: rgba(255, 255, 255, 0.3);
                border: 1px solid rgba(255, 255, 255, 0.4);
              }
            `}</style>
            {navItems.map((item, index) => (
              <NavLink
                key={item.to}
                to={item.to}
                end
                className={({ isActive }) =>
                  `px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-500 relative overflow-hidden group nav-item-hover ${isActive
                    ? 'text-blue-900 shadow-2xl nav-item-active border-2 border-blue-300/60'
                    : 'nav-glass hover:bg-blue-100/40 hover:text-blue-800 hover:shadow-xl hover:scale-110 hover:border-blue-300/60 border-blue-200/40 border'
                  }`
                }
                style={{
                  animationDelay: `${index * 0.15}s`
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-purple-400/20 to-teal-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-pink-400/10 to-yellow-400/10 opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
                <span className="relative z-10 drop-shadow-sm">{item.label}</span>

                {/* Floating mini particles for each nav item */}
                <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-300"></div>
                <div className="absolute -bottom-1 -left-1 w-1 h-1 bg-teal-400 rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300"></div>
              </NavLink>
            ))}
          </nav>
        )}

        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-2 text-sm backdrop-blur-md rounded-lg px-3 py-2 border shadow-lg bg-blue-100/40 border-blue-200/40">
                <div className="relative">
                  <User className="h-4 w-4 text-blue-600" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                <span className="font-semibold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">Admin</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="relative overflow-hidden group hover:scale-110 transition-all duration-500 hover:shadow-2xl border-2 backdrop-blur-md border-red-400/60 bg-red-50/20 hover:border-red-500 hover:bg-red-100/30"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-red-400/20 to-pink-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <LogOut className="h-4 w-4 mr-2 group-hover:rotate-45 transition-transform duration-500 text-red-600" />
                <span className="relative z-10 font-semibold bg-gradient-to-r from-red-700 to-pink-700 bg-clip-text text-transparent">Logout</span>

                {/* Logout button particles */}
                <div className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-red-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-300"></div>
                <div className="absolute -bottom-1 -left-1 w-1 h-1 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-300"></div>
              </Button>
            </>
          ) : (
            <Button asChild variant="outline" className="backdrop-blur-md hover:scale-110 transition-all duration-500 shadow-lg bg-blue-100/40 border-blue-200/40 hover:bg-blue-200/50">
              <NavLink to="/login" className="font-semibold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
                Login
              </NavLink>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
