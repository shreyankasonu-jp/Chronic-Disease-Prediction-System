import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pie, PieChart, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Legend } from "recharts";
import { getStats } from "@/lib/storage";
import { NavLink } from "react-router-dom";

const COLORS = ["#22c55e", "#ef4444"]; // green, red

const Dashboard = () => {
  const stats = getStats();

  const pieData = (s: { positive: number; negative: number }) => [
    { name: "Negative", value: s.negative },
    { name: "Positive", value: s.positive },
  ];

  const history = [
    ...stats.pneumonia.history.map(h => ({ ...h })),
    ...stats.stroke.history.map(h => ({ ...h })),
    ...stats.diabetes.history.map(h => ({ ...h })),
  ];

  const barData = Object.values(
    history.reduce((acc, h) => {
      const key = `${h.date}`;
      if (!acc[key]) acc[key] = { date: h.date, pneumonia: 0, stroke: 0, diabetes: 0 };
      acc[key][h.disease] += 1;
      return acc;
    }, {} as Record<string, { date: string; pneumonia: number; stroke: number; diabetes: number }>)
  ).sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100/80 via-teal-100/80 to-emerald-100/80 backdrop-blur-2xl relative overflow-hidden">
      <style>{`
        @keyframes dashboard-float {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); opacity: 0.1; }
          25% { transform: translateY(-25px) rotate(3deg) scale(1.1); opacity: 0.2; }
          50% { transform: translateY(-15px) rotate(-2deg) scale(0.9); opacity: 0.15; }
          75% { transform: translateY(-20px) rotate(1deg) scale(1.05); opacity: 0.25; }
        }
        
        @keyframes card-glow {
          0%, 100% { box-shadow: 0 4px 20px rgba(59, 130, 246, 0.3); }
          50% { box-shadow: 0 8px 40px rgba(59, 130, 246, 0.6); }
        }
        
        @keyframes slide-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes counter-up {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        .dashboard-float { animation: dashboard-float 8s ease-in-out infinite; }
        .card-glow { animation: card-glow 4s ease-in-out infinite; }
        .slide-in-up { animation: slide-in-up 0.6s ease-out; }
        .counter-up { animation: counter-up 0.8s ease-out; }
      `}</style>
      
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-24 h-24 bg-blue-600/40 rounded-full blur-2xl dashboard-float" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-40 right-32 w-20 h-20 bg-teal-600/40 rounded-full blur-2xl dashboard-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-32 left-32 w-28 h-28 bg-emerald-600/40 rounded-full blur-2xl dashboard-float" style={{ animationDelay: '4s' }}></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-blue-700/40 rounded-full blur-2xl dashboard-float" style={{ animationDelay: '6s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-teal-700/40 rounded-full blur-2xl dashboard-float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/4 right-1/4 w-18 h-18 bg-blue-800/40 rounded-full blur-2xl dashboard-float" style={{ animationDelay: '3s' }}></div>
        <div className="absolute bottom-1/4 left-1/4 w-22 h-22 bg-emerald-700/40 rounded-full blur-2xl dashboard-float" style={{ animationDelay: '5s' }}></div>
      </div>

      <div className="container mx-auto py-16 relative z-10">
        <Helmet>
          <title>Dashboard | AI Health Diagnosis Platform</title>
          <meta name="description" content="Statistics of predictions across diseases with charts and quick actions." />
          <link rel="canonical" href="/dashboard" />
        </Helmet>

        {/* Hero Section */}
        <div className="text-center mb-12 slide-in-up">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-600 via-teal-600 to-emerald-600 rounded-full mb-6 shadow-2xl card-glow">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-700 via-teal-600 to-emerald-700 bg-clip-text text-transparent">
            Analytics Dashboard
          </h1>
          <p className="text-xl text-blue-700 max-w-3xl mx-auto">
            Comprehensive insights into your chronic disease predictions and health analytics
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-8 md:grid-cols-3 mb-12">
          <Card className="border-0 bg-gradient-to-br from-white/80 to-blue-50/80 backdrop-blur-lg shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 card-glow slide-in-up group border border-white/20" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <CardTitle className="text-2xl text-blue-800">Pneumonia</CardTitle>
              <CardDescription className="text-lg counter-up">{stats.pneumonia.total} tests completed</CardDescription>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer>
                <PieChart>
                  <Pie dataKey="value" data={pieData(stats.pneumonia)} cx="50%" cy="50%" outerRadius={90} label>
                    <Cell fill="#22c55e" />
                    <Cell fill="#ef4444" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-white/80 to-teal-50/80 backdrop-blur-lg shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 card-glow slide-in-up group border border-white/20" style={{ animationDelay: '0.4s' }}>
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <CardTitle className="text-2xl text-teal-800">Stroke Risk</CardTitle>
              <CardDescription className="text-lg counter-up">{stats.stroke.total} assessments done</CardDescription>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer>
                <PieChart>
                  <Pie dataKey="value" data={pieData(stats.stroke)} cx="50%" cy="50%" outerRadius={90} label>
                    <Cell fill="#22c55e" />
                    <Cell fill="#ef4444" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border-0 bg-gradient-to-br from-white/80 to-purple-50/80 backdrop-blur-lg shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 card-glow slide-in-up group border border-white/20" style={{ animationDelay: '0.6s' }}>
            <CardHeader className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <CardTitle className="text-2xl text-purple-800">Diabetes</CardTitle>
              <CardDescription className="text-lg counter-up">{stats.diabetes.total} predictions made</CardDescription>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer>
                <PieChart>
                  <Pie dataKey="value" data={pieData(stats.diabetes)} cx="50%" cy="50%" outerRadius={90} label>
                    <Cell fill="#22c55e" />
                    <Cell fill="#ef4444" />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Chart */}
        <Card className="border-0 bg-gradient-to-br from-white/80 to-blue-50/80 backdrop-blur-lg shadow-2xl slide-in-up border border-white/20" style={{ animationDelay: '0.8s' }}>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl bg-gradient-to-r from-blue-800 to-teal-700 bg-clip-text text-transparent">Cases Over Time</CardTitle>
            <CardDescription className="text-lg">Comprehensive analysis of daily health assessments</CardDescription>
          </CardHeader>
          <CardContent className="h-96">
            <ResponsiveContainer>
              <BarChart data={barData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Legend />
                <Tooltip />
                <Bar dataKey="pneumonia" fill="#3b82f6" name="Pneumonia" radius={[4, 4, 0, 0]} />
                <Bar dataKey="stroke" fill="#14b8a6" name="Stroke" radius={[4, 4, 0, 0]} />
                <Bar dataKey="diabetes" fill="#8b5cf6" name="Diabetes" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="mt-12 text-center slide-in-up" style={{ animationDelay: '1s' }}>
          <h3 className="text-2xl font-bold mb-6 text-blue-800">Quick Actions</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <NavLink to="/pneumonia">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                New Pneumonia Test
              </NavLink>
            </Button>
            <Button asChild className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <NavLink to="/stroke">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                New Stroke Assessment
              </NavLink>
            </Button>
            <Button asChild className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
              <NavLink to="/diabetes">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                New Diabetes Prediction
              </NavLink>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
