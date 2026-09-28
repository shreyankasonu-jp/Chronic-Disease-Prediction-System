import { useEffect, useMemo, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CircularProgress from "@/components/common/CircularProgress";
import { UploadCloud, Image as ImageIcon, FileWarning } from "lucide-react";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { recordResult } from "@/lib/storage";
import { NavLink } from "react-router-dom";

const ACCEPTED = ["image/jpeg", "image/png", "image/jpg", "application/dicom", "application/dicom+json", "application/dicom+binary"];

const Pneumonia = () => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [confidence, setConfidence] = useState<number | null>(null);
  const [detected, setDetected] = useState<boolean | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!file) return setPreview(null);
    if (file.type.startsWith("image/")) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      return () => URL.revokeObjectURL(url);
    }
    setPreview(null);
  }, [file]);

  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  };
  const handleFile = (f: File) => {
    if (!ACCEPTED.includes(f.type) && !f.name.toLowerCase().endsWith(".dcm")) {
      alert("Unsupported file. Please upload JPG, PNG, or DICOM.");
      return;
    }
    setFile(f);
  };

  const runAnalysis = async () => {
    if (!file) return;
    setProcessing(true);
    setDetected(null);
    setConfidence(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('http://localhost:5001/api/pneumonia/predict', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Prediction failed');
      }

      const data = await response.json();
      const detected = data.label === 1;
      const confidence = Math.round(data.confidence * 100);

      setConfidence(confidence);
      setDetected(detected);
      recordResult("pneumonia", detected);
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to get prediction. Please make sure the backend server is running.');
    } finally {
      setProcessing(false);
    }
  };

  const heatmapCanvas = useMemo(() => {
    if (!preview) return null;
    const canvas = document.createElement("canvas");
    const img = new Image();
    img.src = preview;
    return { canvas, img };
  }, [preview]);

  useEffect(() => {
    if (!heatmapCanvas || !resultRef.current) return;
    const container = resultRef.current.querySelector(".heatmap-container") as HTMLDivElement | null;
    if (!container) return;

    const { canvas, img } = heatmapCanvas;
    const draw = () => {
      const w = container.clientWidth;
      const h = Math.round((img.height / img.width) * w) || container.clientHeight;
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      // fake heatmap blobs
      for (let i = 0; i < 6; i++) {
        const x = Math.random() * w;
        const y = Math.random() * h;
        const radius = (Math.random() * 0.15 + 0.08) * Math.min(w, h);
        const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
        grad.addColorStop(0, "rgba(255,0,0,0.35)");
        grad.addColorStop(1, "rgba(255,0,0,0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      container.innerHTML = "";
      container.appendChild(canvas);
    };
    img.onload = draw;
    if (img.complete) draw();
    const onResize = () => draw();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [heatmapCanvas]);

  const downloadPdf = async () => {
    if (!resultRef.current) return;
    const input = resultRef.current;
    const canvas = await html2canvas(input, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const ratio = Math.min(pageWidth / canvas.width, pageHeight / canvas.height);
    const imgWidth = canvas.width * ratio;
    const imgHeight = canvas.height * ratio;
    pdf.addImage(imgData, "PNG", (pageWidth - imgWidth) / 2, 40, imgWidth, imgHeight);
    pdf.save("pneumonia-report.pdf");
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
          0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
          50% { box-shadow: 0 0 40px rgba(59, 130, 246, 0.6); }
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
          <title>Pneumonia Detection | AI Health Diagnosis Platform</title>
          <meta name="description" content="Upload X-ray images and run AI analysis for pneumonia detection." />
          <link rel="canonical" href="/pneumonia" />
        </Helmet>

        <div className="text-center mb-8 slide-in-up">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mb-4 shadow-lg pulse-glow">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-700 to-teal-600 bg-clip-text text-transparent">Pneumonia Detection</h1>
          <p className="text-blue-700 text-lg">Advanced AI analysis for chest X-ray diagnosis</p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <Card className="border-0 bg-gradient-to-br from-white/80 to-blue-50/80 backdrop-blur-lg shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 pulse-glow slide-in-up border border-white/20" style={{ animationDelay: '0.2s' }}>
            <CardHeader>
              <CardTitle>Upload Chest X-ray</CardTitle>
              <CardDescription>Drag and drop or click to upload JPG, PNG, or DICOM files.</CardDescription>
            </CardHeader>
            <CardContent>
              <label
                onDragOver={(e) => e.preventDefault()}
                onDrop={onDrop}
                className="flex min-h-48 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center hover-scale animate-enter"
              >
                <input
                  type="file"
                  accept=".jpg,.jpeg,.png,.dcm"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
                />
                <UploadCloud className="h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">Drag & drop your X-ray here or click to browse</p>
                <p className="text-xs text-muted-foreground">Accepted: JPG, PNG, DICOM</p>
              </label>

              <div className="mt-4">
                {file ? (
                  <div className="flex items-center gap-3 text-sm">
                    {preview ? (
                      <ImageIcon className="h-4 w-4" />
                    ) : (
                      <FileWarning className="h-4 w-4 text-destructive" />
                    )}
                    <span>{file.name}</span>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">No file selected yet.</div>
                )}
              </div>

              <div className="mt-6 flex gap-3">
                <Button onClick={runAnalysis} disabled={!file || processing} variant="glow">
                  {processing ? "Analyzing..." : "Run AI Analysis"}
                </Button>
                <Button asChild variant="outline">
                  <NavLink to="/dashboard">Go to Dashboard</NavLink>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card ref={resultRef} className="border-0 bg-gradient-to-br from-white/80 to-teal-50/80 backdrop-blur-lg shadow-2xl hover:shadow-3xl transition-all duration-500 slide-in-up border border-white/20" style={{ animationDelay: '0.4s' }}>
            <CardHeader>
              <CardTitle>Results</CardTitle>
              <CardDescription>AI model output and visualization</CardDescription>
            </CardHeader>
            <CardContent>
            {!processing && detected === null && (
              <div className="text-muted-foreground">Run analysis to see results.</div>
            )}

            {processing && (
              <div className="flex flex-col items-center gap-4">
                <div className="h-24 w-24 rounded-full border-4 border-primary border-t-transparent animate-spin" aria-label="Loading" />
                <div className="text-sm text-muted-foreground">Processing image...</div>
              </div>
            )}

            {!processing && detected !== null && confidence !== null && (
              <div className="space-y-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <h2 className="text-2xl font-semibold">
                      {detected ? "✅ Pneumonia Detected" : "❌ No Pneumonia"}
                    </h2>
                    <p className="text-sm text-muted-foreground">..</p>
                  </div>
                  <CircularProgress value={confidence} label="Confidence" color={detected ? "destructive" : "primary"} />
                </div>

                {preview && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Grad-CAM Heatmap</div>
                    <div className="heatmap-container relative w-full overflow-hidden rounded-xl border" aria-label="Grad-CAM heatmap" />
                  </div>
                )}

                <div className="space-y-2">
                  <div className="text-sm font-medium">Recommendation</div>
                  <p className="text-sm text-muted-foreground">
                    {detected
                      ? "Pneumonia indicators detected. Please consult a medical professional for a comprehensive evaluation."
                      : "No strong pneumonia indicators detected. If symptoms persist, seek professional advice."}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Button onClick={downloadPdf} variant="outline">Download PDF Medical Report</Button>
                  <Button asChild variant={detected ? "destructive" : "secondary"}>
                    <a href="https://www.practo.com/bangalore/pulmonologist" target="_blank" rel="noreferrer">
                      {detected ? "Consult Pulmonologist Now" : "Consult Pulmonologist"}
                    </a>
                  </Button>
                  <Button variant="ghost" onClick={() => { setFile(null); setDetected(null); setConfidence(null); }}>Try Again</Button>
                  <Button asChild variant="link">
                    <NavLink to="/dashboard">View Dashboard</NavLink>
                  </Button>
                </div>
              </div>
            )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Pneumonia;
