import { PropsWithChildren } from "react";
import Navbar from "./Navbar";
import MediBot from "../medibot/MediBot";

const AppLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <style>{`
        @keyframes navbar-float {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); opacity: 0.1; }
          25% { transform: translateY(-15px) rotate(2deg) scale(1.05); opacity: 0.2; }
          50% { transform: translateY(-8px) rotate(-1deg) scale(0.95); opacity: 0.15; }
          75% { transform: translateY(-12px) rotate(1deg) scale(1.02); opacity: 0.25; }
        }
        
        .navbar-float { animation: navbar-float 6s ease-in-out infinite; }
      `}</style>
      
      {/* Floating background elements for navbar */}
      <div className="absolute top-0 left-0 right-0 h-20 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-2 left-20 w-8 h-8 bg-blue-200/30 rounded-full blur-sm navbar-float" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-4 right-32 w-6 h-6 bg-teal-200/30 rounded-full blur-sm navbar-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1 left-1/2 w-4 h-4 bg-purple-200/30 rounded-full blur-sm navbar-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-3 right-20 w-5 h-5 bg-pink-200/30 rounded-full blur-sm navbar-float" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute top-2 left-1/3 w-3 h-3 bg-indigo-200/30 rounded-full blur-sm navbar-float" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-5 right-1/3 w-7 h-7 bg-cyan-200/30 rounded-full blur-sm navbar-float" style={{ animationDelay: '2.5s' }}></div>
      </div>
      
      <Navbar />
      <main className="flex-1 relative z-10" style={{ paddingTop: '64px' }}>
        {children}
      </main>
      <MediBot />
      <footer className="relative overflow-hidden border-t bg-gradient-to-r from-gray-50 via-blue-50 to-teal-50 py-12">
        <style>{`
          @keyframes footer-glow {
            0%, 100% { text-shadow: 0 0 10px rgba(59, 130, 246, 0.5); }
            50% { text-shadow: 0 0 20px rgba(59, 130, 246, 0.8); }
          }
          
          @keyframes footer-float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-3px); }
          }
          
          @keyframes sparkle {
            0%, 100% { opacity: 0; transform: scale(0); }
            50% { opacity: 1; transform: scale(1); }
          }
          
          .footer-glow { animation: footer-glow 3s ease-in-out infinite; }
          .footer-float { animation: footer-float 2s ease-in-out infinite; }
          .sparkle { animation: sparkle 2s ease-in-out infinite; }
        `}</style>
        
        {/* Floating background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-2 left-10 w-2 h-2 bg-blue-400 rounded-full sparkle" style={{ animationDelay: '0s' }}></div>
          <div className="absolute top-4 right-20 w-1 h-1 bg-teal-400 rounded-full sparkle" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-2 left-20 w-1.5 h-1.5 bg-purple-400 rounded-full sparkle" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-4 right-10 w-2 h-2 bg-pink-400 rounded-full sparkle" style={{ animationDelay: '1.5s' }}></div>
          <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-indigo-400 rounded-full sparkle" style={{ animationDelay: '0.3s' }}></div>
          <div className="absolute top-1/2 right-1/4 w-1.5 h-1.5 bg-cyan-400 rounded-full sparkle" style={{ animationDelay: '0.8s' }}></div>
        </div>

        <div className="container mx-auto text-center relative z-10">
          <div className="flex items-center justify-center mb-4 footer-float">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full flex items-center justify-center mr-3 shadow-lg">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
              Chronic Disease Prediction Platform
            </div>
          </div>
          
          <div className="text-sm text-gray-600 mb-2">
            © {new Date().getFullYear()} AI Health Diagnosis Platform
          </div>
          
          <div className="flex items-center justify-center gap-2 footer-glow">
            <span className="text-sm text-gray-500">Project by</span>
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-teal-400 rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-300"></div>
              <div className="relative px-4 py-2 bg-gradient-to-r from-blue-500 to-teal-500 rounded-lg text-white font-bold text-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                ✨ Shreyanka S ✨
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-xs text-gray-400">
            Empowering healthcare through AI innovation
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AppLayout;
