import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Pie, PieChart, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { recordResult } from "@/lib/storage";

const COLORS = ["#22c55e", "#ef4444"]; // green, red

const Diabetes = () => {
  const [result, setResult] = useState<null | { prob: number; positive: boolean }>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    
    const features = [
      Number(fd.get("pregnancies") || 0),
      Number(fd.get("glucose") || 0),
      Number(fd.get("bp") || 0),
      Number(fd.get("skin") || 0),
      Number(fd.get("insulin") || 0),
      Number(fd.get("bmi") || 0),
      Number(fd.get("pedigree") || 0),
      Number(fd.get("age") || 0)
    ];

    try {
      const response = await fetch('http://localhost:5001/api/diabetes/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ features }),
      });

      if (!response.ok) {
        throw new Error('Prediction failed');
      }

      const data = await response.json();
      const positive = data.label === 1;
      const prob = data.probability;

      setResult({ prob, positive });
      recordResult("diabetes", positive);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to get prediction. Please make sure the backend server is running.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100/80 via-teal-100/80 to-emerald-100/80 backdrop-blur-2xl relative overflow-hidden">
      <style>{`
        @keyframes float-medical {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); opacity: 0.1; }
          25% { transform: translateY(-20px) rotate(5deg) scale(1.1); opacity: 0.2; }
          50% { transform: translateY(-10px) rotate(-3deg) scale(0.9); opacity: 0.15; }
          75% { transform: translateY(-15px) rotate(2deg) scale(1.05); opacity: 0.25; }
        }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.3); }
          50% { box-shadow: 0 0 40px rgba(99, 102, 241, 0.6); }
        }
        
        @keyframes slide-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .float-medical { animation: float-medical 6s ease-in-out infinite; }
        .pulse-glow { animation: pulse-glow 3s ease-in-out infinite; }
        .slide-in-up { animation: slide-in-up 0.6s ease-out; }
      `}</style>
      
      {/* Floating background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-16 h-16 bg-blue-400/30 rounded-full blur-xl float-medical" style={{ animationDelay: '0s' }}></div>
        <div className="absolute top-20 right-20 w-12 h-12 bg-teal-400/30 rounded-full blur-xl float-medical" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-20 left-20 w-20 h-20 bg-emerald-400/30 rounded-full blur-xl float-medical" style={{ animationDelay: '4s' }}></div>
        <div className="absolute bottom-10 right-10 w-14 h-14 bg-blue-500/30 rounded-full blur-xl float-medical" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-18 h-18 bg-teal-500/30 rounded-full blur-xl float-medical" style={{ animationDelay: '3s' }}></div>
        <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-emerald-500/30 rounded-full blur-xl float-medical" style={{ animationDelay: '5s' }}></div>
      </div>

      <div className="container mx-auto py-10 relative z-10">
        <Helmet>
          <title>Diabetes Prediction | AI Health Diagnosis Platform</title>
          <meta name="description" content="Predict diabetes with modern AI using key medical inputs." />
          <link rel="canonical" href="/diabetes" />
        </Helmet>

        <div className="text-center mb-8 slide-in-up">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-emerald-600 rounded-full mb-4 shadow-lg pulse-glow">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-700 to-emerald-600 bg-clip-text text-transparent">Diabetes Prediction</h1>
          <p className="text-emerald-700 text-lg">AI-powered diabetes risk assessment using medical indicators</p>
        </div>

        <form onSubmit={onSubmit} className="grid gap-8 md:grid-cols-2">
          <Card className="border-0 bg-gradient-to-br from-white/80 to-blue-50/80 backdrop-blur-lg shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 pulse-glow slide-in-up border border-white/20" style={{ animationDelay: '0.2s' }}>
          <CardHeader>
            <CardTitle>Medical Inputs</CardTitle>
            <CardDescription>Enter your measurements</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div>
              <Label htmlFor="preg">Pregnancies</Label>
              <Input id="preg" name="pregnancies" type="number" min={0} />
            </div>
            <div>
              <Label htmlFor="glucose">Glucose</Label>
              <Input id="glucose" name="glucose" type="number" required />
            </div>
            <div>
              <Label htmlFor="bp">Blood Pressure</Label>
              <Input id="bp" name="bp" type="number" />
            </div>
            <div>
              <Label htmlFor="skin">Skin Thickness</Label>
              <Input id="skin" name="skin" type="number" />
            </div>
            <div>
              <Label htmlFor="insulin">Insulin</Label>
              <Input id="insulin" name="insulin" type="number" />
            </div>
            <div>
              <Label htmlFor="bmi">BMI</Label>
              <Input id="bmi" name="bmi" step="0.1" type="number" required />
            </div>
            <div>
              <Label htmlFor="pedigree">Diabetes Pedigree Function</Label>
              <Input id="pedigree" name="pedigree" step="0.01" type="number" required />
            </div>
            <div>
              <Label htmlFor="age">Age</Label>
              <Input id="age" name="age" type="number" required />
            </div>
          </CardContent>
        </Card>

          <Card className="border-0 bg-gradient-to-br from-white/80 to-emerald-50/80 backdrop-blur-lg shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 slide-in-up border border-white/20" style={{ animationDelay: '0.4s' }}>
          <CardHeader>
            <CardTitle>Actions</CardTitle>
            <CardDescription>Submit to run prediction</CardDescription>
          </CardHeader>
          <CardContent className="flex items-end gap-3">
            <Button type="submit" className="bg-gradient-to-r from-blue-500 to-emerald-600 hover:from-blue-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">Predict</Button>
            <Button type="reset" variant="outline" onClick={() => setResult(null)} className="hover:scale-105 transition-transform duration-300">Reset</Button>
          </CardContent>
          </Card>
        </form>

        {result && (
          <Card className="mt-8 border-0 bg-gradient-to-br from-white/80 to-blue-50/80 backdrop-blur-lg shadow-2xl slide-in-up border border-white/20" style={{ animationDelay: '0.6s' }}>
          <CardHeader>
            <CardTitle>Results</CardTitle>
            <CardDescription>Prediction probability</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div>
              <div className="text-xl font-semibold mb-2">
                {result.positive ? "✅ Diabetes Detected" : "❌ No Diabetes"}
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Advice: Maintain a healthy diet, exercise regularly, and consult a healthcare professional for guidance.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button asChild variant={result.positive ? "destructive" : "secondary"}>
                  <a href="https://www.practo.com/bangalore/diabetologist?utm_source=opd_google_Pmax&utm_medium=&utm_campaign=22055233835&gad_source=1&gad_campaignid=22055283002&gbraid=0AAAAADgl2cJ5kEcCnARoraoCWWNAMhCCl&gclid=Cj0KCQjwzOvEBhDVARIsADHfJJSDF4WrhRYcLIcX_51MYo0udCjDiqMjcwqR9jrkZqOj44xi5MRW8MQaAl_QEALw_wcB" target="_blank" rel="noreferrer">
                    {result.positive ? "Consult Diabetologist Now" : "Consult Diabetologist"}
                  </a>
                </Button>
                <Button variant="ghost" onClick={() => setResult(null)}>Try Again</Button>
              </div>
            </div>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie dataKey="value" data={[{ name: "Negative", value: 1 - result.prob }, { name: "Positive", value: result.prob }]} cx="50%" cy="50%" outerRadius={90} label>
                    <Cell fill={COLORS[0]} />
                    <Cell fill={COLORS[1]} />
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Diabetes;
