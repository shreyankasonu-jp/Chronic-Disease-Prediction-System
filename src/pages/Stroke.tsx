import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pie, PieChart, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { recordResult } from "@/lib/storage";

const COLORS = ["#22c55e", "#ef4444"]; // green, red

const Stroke = () => {
  const [result, setResult] = useState<null | { prob: number; positive: boolean }>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    
    // Map form values to the expected feature array for the stroke model
    const features = [
      fd.get("gender") === "male" ? 1 : 0, // gender (0=female, 1=male)
      Number(fd.get("age") || 0), // age
      fd.get("hypertension") === "yes" ? 1 : 0, // hypertension
      fd.get("heart") === "yes" ? 1 : 0, // heart_disease
      fd.get("married") === "yes" ? 1 : 0, // ever_married
      fd.get("work") === "govt_job" ? 0 : fd.get("work") === "never_worked" ? 1 : fd.get("work") === "private" ? 2 : fd.get("work") === "self_employed" ? 3 : 4, // work_type
      fd.get("residence") === "rural" ? 0 : 1, // residence_type
      Number(fd.get("glucose") || 0), // avg_glucose_level
      Number(fd.get("bmi") || 0), // bmi
      fd.get("smoking") === "never" ? 0 : fd.get("smoking") === "former" ? 1 : fd.get("smoking") === "current" ? 2 : 3 // smoking_status
    ];

    try {
      const response = await fetch('http://localhost:5001/api/stroke/predict', {
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
      recordResult("stroke", positive);
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
          0%, 100% { box-shadow: 0 0 20px rgba(20, 184, 166, 0.3); }
          50% { box-shadow: 0 0 40px rgba(20, 184, 166, 0.6); }
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
          <title>Stroke Prediction | AI Health Diagnosis Platform</title>
          <meta name="description" content="Predict your stroke risk using medical and lifestyle inputs." />
          <link rel="canonical" href="/stroke" />
        </Helmet>

        <div className="text-center mb-8 slide-in-up">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full mb-4 shadow-lg pulse-glow">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-700 to-emerald-600 bg-clip-text text-transparent">Stroke Risk Prediction</h1>
          <p className="text-teal-700 text-lg">Comprehensive health assessment for stroke risk evaluation</p>
        </div>

        <form onSubmit={onSubmit} className="grid gap-8 md:grid-cols-2">
          <Card className="border-0 bg-gradient-to-br from-white/80 to-teal-50/80 backdrop-blur-lg shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 pulse-glow slide-in-up border border-white/20" style={{ animationDelay: '0.2s' }}>
          <CardHeader>
            <CardTitle>Personal Info</CardTitle>
            <CardDescription>Basic demographic details</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div>
              <Label>Gender</Label>
              <Select name="gender">
                <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="age">Age</Label>
              <Input id="age" name="age" type="number" min={0} max={120} required />
            </div>
            <div>
              <Label>Ever Married</Label>
              <Select name="married">
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

          <Card className="border-0 bg-gradient-to-br from-white/80 to-emerald-50/80 backdrop-blur-lg shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 slide-in-up border border-white/20" style={{ animationDelay: '0.4s' }}>
          <CardHeader>
            <CardTitle>Health Metrics</CardTitle>
            <CardDescription>Vitals and lab values</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div>
              <Label>Hypertension</Label>
              <Select name="hypertension">
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Heart Disease</Label>
              <Select name="heart">
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="glucose">Average Glucose</Label>
              <Input id="glucose" name="glucose" type="number" step="0.1" required />
            </div>
            <div>
              <Label htmlFor="bmi">BMI</Label>
              <Input id="bmi" name="bmi" type="number" step="0.1" required />
            </div>
          </CardContent>
        </Card>

          <Card className="border-0 bg-gradient-to-br from-white/80 to-cyan-50/80 backdrop-blur-lg shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 md:col-span-2 slide-in-up border border-white/20" style={{ animationDelay: '0.6s' }}>
          <CardHeader>
            <CardTitle>Lifestyle</CardTitle>
            <CardDescription>Environment and habits</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-3">
            <div>
              <Label>Work Type</Label>
              <Select name="work">
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="govt_job">Govt Job</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="self_employed">Self Employed</SelectItem>
                  <SelectItem value="children">Children</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Residence Type</Label>
              <Select name="residence">
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="urban">Urban</SelectItem>
                  <SelectItem value="rural">Rural</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Smoking Status</Label>
              <Select name="smoking">
                <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="never">Never</SelectItem>
                  <SelectItem value="former">Former</SelectItem>
                  <SelectItem value="current">Current</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

          <div className="md:col-span-2 flex items-center gap-3 slide-in-up" style={{ animationDelay: '0.8s' }}>
            <Button type="submit" className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300">Predict</Button>
            <Button type="reset" variant="outline" className="hover:scale-105 transition-transform duration-300">Reset</Button>
          </div>
        </form>

        {result && (
          <Card className="mt-8 border-0 bg-gradient-to-br from-white/80 to-teal-50/80 backdrop-blur-lg shadow-2xl slide-in-up border border-white/20" style={{ animationDelay: '1s' }}>
          <CardHeader>
            <CardTitle>Results</CardTitle>
            <CardDescription>Prediction probability</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <div>
              <div className="text-xl font-semibold mb-2">
                {result.positive ? "✅ Stroke Risk" : "❌ No Stroke Risk"}
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Brief tips: Maintain a balanced diet, regular exercise, and monitor blood pressure and glucose.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button asChild variant={result.positive ? "destructive" : "secondary"}>
                  <a href="https://www.practo.com/bangalore/treatment-for-stroke?utm_source=opd_google_Pmax&utm_medium=&utm_campaign=21045690443&gad_source=1&gad_campaignid=21387241615&gbraid=0AAAAADgl2cI8W2vtFxgPegZJKDXbHDtY0&gclid=Cj0KCQjwzOvEBhDVARIsADHfJJSxyo3Y0k4P--4_0SGCkrBWndYMOhJBt4H1muDFCu7lNGcxYsR_fgYaArMEEALw_wcB" target="_blank" rel="noreferrer">
                    {result.positive ? "Consult Stroke Specialist Now" : "Consult Stroke Specialist"}
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

export default Stroke;
