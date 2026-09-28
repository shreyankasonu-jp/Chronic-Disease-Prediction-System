import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-medical.jpg";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { NavLink } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const Index = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const title = "AI Health Diagnosis | AI-Powered Diagnosis";
  const description = "Detect pneumonia, stroke, and diabetes using advanced AI models in a modern, secure web app.";
  const canonical = "/";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "AI Health Diagnosis Platform",
    url: canonical,
    description,
  };

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const scrollTop = window.scrollY;
        const windowHeight = window.innerHeight;
        
        // Calculate which section should be visible based on scroll position
        const sectionHeight = windowHeight * 0.8; // Each section takes 80% of viewport
        const newSection = Math.floor(scrollTop / sectionHeight);
        
        setScrollY(scrollTop);
        setCurrentSection(Math.min(newSection, 5)); // Max 6 sections (0-5)
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative" style={{ height: '600vh' }}>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonical} />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <style>{`
        @keyframes slideInUp {
          from { 
            opacity: 0; 
            transform: translateY(50px); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0); 
          }
        }
        
        @keyframes slideInLeft {
          from { 
            opacity: 0; 
            transform: translateX(-50px); 
          }
          to { 
            opacity: 1; 
            transform: translateX(0); 
          }
        }
        
        @keyframes slideInRight {
          from { 
            opacity: 0; 
            transform: translateX(50px); 
          }
          to { 
            opacity: 1; 
            transform: translateX(0); 
          }
        }
        
        @keyframes scaleIn {
          from { 
            opacity: 0; 
            transform: scale(0.9); 
          }
          to { 
            opacity: 1; 
            transform: scale(1); 
          }
        }
        
        .section-enter {
          animation: slideInUp 0.6s ease-out forwards;
        }
        
        .section-enter-left {
          animation: slideInLeft 0.6s ease-out forwards;
        }
        
        .section-enter-right {
          animation: slideInRight 0.6s ease-out forwards;
        }
        
        .section-enter-scale {
          animation: scaleIn 0.6s ease-out forwards;
        }
      `}</style>

      {/* Background image that covers the entire scrollable area */}
      <div className="fixed inset-0 z-0">
        <img src={heroImg} alt="Futuristic medical illustration with doctor and X-ray" className="w-full h-full object-cover opacity-40" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-100/60 via-teal-100/30 to-transparent" aria-hidden />
      </div>

      {/* Fixed container for content */}
      <div className="fixed inset-0 flex items-center justify-center overflow-hidden">
        
        {/* Floating background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-10 w-16 h-16 bg-blue-200/30 rounded-full blur-xl animate-pulse" style={{ animationDelay: '0s', animationDuration: '4s' }}></div>
          <div className="absolute top-20 right-20 w-12 h-12 bg-teal-200/30 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>
          <div className="absolute bottom-20 left-20 w-20 h-20 bg-emerald-200/30 rounded-full blur-xl animate-pulse" style={{ animationDelay: '4s', animationDuration: '6s' }}></div>
          <div className="absolute bottom-10 right-10 w-14 h-14 bg-blue-300/30 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
          <div className="absolute top-1/2 left-1/4 w-18 h-18 bg-cyan-200/30 rounded-full blur-xl animate-pulse" style={{ animationDelay: '3s', animationDuration: '5s' }}></div>
          <div className="absolute top-1/3 right-1/3 w-16 h-16 bg-teal-300/30 rounded-full blur-xl animate-pulse" style={{ animationDelay: '5s', animationDuration: '4s' }}></div>
          <div className="absolute bottom-1/3 left-1/3 w-10 h-10 bg-emerald-200/30 rounded-full blur-xl animate-pulse" style={{ animationDelay: '2.5s', animationDuration: '6s' }}></div>
          <div className="absolute top-1/4 left-1/2 w-8 h-8 bg-blue-300/30 rounded-full blur-xl animate-pulse" style={{ animationDelay: '1.5s', animationDuration: '5s' }}></div>
        </div>

        {/* Section 0: Hero */}
        {currentSection === 0 && (
          <div className="absolute inset-0 bg-white/30 backdrop-blur-md">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center section-enter max-w-6xl px-8">
                <h1 className="text-4xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-blue-600 via-teal-600 to-purple-600 bg-clip-text text-transparent drop-shadow-lg">
                  Chronic Disease Prediction
                </h1>
                <p className="text-xl md:text-2xl text-blue-800 max-w-4xl mx-auto leading-relaxed mb-8 drop-shadow-md font-medium">
                  Detect pneumonia, stroke, and diabetes using advanced AI models. Modern, secure, and beautifully simple to use.
                </p>
                <div className="flex items-center justify-center gap-2 text-blue-700 animate-bounce drop-shadow-sm">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                  <span className="text-lg font-medium">Scroll to explore our services</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 1: Pneumonia */}
        {currentSection === 1 && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/20 backdrop-blur-md">
            <div className="max-w-2xl section-enter-left">
              <Card className="border-0 bg-gradient-to-br from-white/80 to-blue-50/80 backdrop-blur-lg shadow-2xl border border-white/20">
                <CardHeader className="text-center p-12">
                  <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <CardTitle className="text-4xl text-blue-800 mb-6">Pneumonia Detection</CardTitle>
                  <CardDescription className="text-blue-700 text-xl mb-8">Upload chest X-rays and get instant AI analysis</CardDescription>
                </CardHeader>
                <CardContent className="text-center p-12 pt-0">
                  <p className="text-blue-700 leading-relaxed text-xl mb-8">
                    Advanced CNN models analyze chest X-rays with <span className="font-bold text-blue-600 text-3xl">92.6% accuracy</span> for instant pneumonia detection.
                  </p>
                  <Button asChild className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 text-lg py-4">
                    <NavLink to="/pneumonia">Start Prediction</NavLink>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Section 2: Stroke */}
        {currentSection === 2 && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/20 backdrop-blur-md">
            <div className="max-w-2xl section-enter">
              <Card className="border-0 bg-gradient-to-br from-white/80 to-teal-50/80 backdrop-blur-lg shadow-2xl border border-white/20">
                <CardHeader className="text-center p-12">
                  <div className="w-24 h-24 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <CardTitle className="text-4xl text-teal-800 mb-6">Stroke Risk Assessment</CardTitle>
                  <CardDescription className="text-teal-700 text-xl mb-8">Comprehensive health metrics evaluation</CardDescription>
                </CardHeader>
                <CardContent className="text-center p-12 pt-0">
                  <p className="text-teal-700 leading-relaxed text-xl mb-8">
                    Logistic regression models evaluate health factors with <span className="font-bold text-teal-600 text-3xl">85% accuracy</span> for stroke risk prediction.
                  </p>
                  <Button asChild className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 text-lg py-4">
                    <NavLink to="/stroke">Start Assessment</NavLink>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Section 3: Diabetes */}
        {currentSection === 3 && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/20 backdrop-blur-md">
            <div className="max-w-2xl section-enter-right">
              <Card className="border-0 bg-gradient-to-br from-white/80 to-purple-50/80 backdrop-blur-lg shadow-2xl border border-white/20">
                <CardHeader className="text-center p-12">
                  <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <CardTitle className="text-4xl text-purple-800 mb-6">Diabetes Prediction</CardTitle>
                  <CardDescription className="text-purple-700 text-xl mb-8">Random Forest algorithm for precise detection</CardDescription>
                </CardHeader>
                <CardContent className="text-center p-12 pt-0">
                  <p className="text-purple-700 leading-relaxed text-xl mb-8">
                    Random Forest models achieve <span className="font-bold text-purple-600 text-3xl">88% accuracy</span> using key medical indicators for diabetes prediction.
                  </p>
                  <Button asChild className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 text-lg py-4">
                    <NavLink to="/diabetes">Start Prediction</NavLink>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Section 4: Consultation */}
        {currentSection === 4 && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/20 backdrop-blur-md p-8">
            <div className="max-w-5xl section-enter-scale">
              <Card className="border-0 bg-gradient-to-br from-white/80 to-blue-50/80 backdrop-blur-lg shadow-2xl border border-white/20">
                <CardContent className="p-16 text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full mb-8 shadow-lg">
                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent">
                    Need Medical Consultation?
                  </h2>
                  <p className="text-xl text-blue-700 mb-12">Connect with qualified specialists for professional medical advice</p>
                  
                  <div className="grid gap-8 md:grid-cols-3">
                    <div className="p-6 bg-gradient-to-br from-blue-50/80 to-blue-100/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/30">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-blue-800 mb-2">Pulmonologist</h3>
                      <p className="text-blue-700 mb-4">For lung and respiratory issues</p>
                      <Button asChild className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white">
                        <a href="https://www.practo.com/bangalore/pulmonologist" target="_blank" rel="noreferrer">
                          Book Consultation
                        </a>
                      </Button>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-teal-50/80 to-teal-100/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/30">
                      <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-teal-800 mb-2">Stroke Specialist</h3>
                      <p className="text-teal-700 mb-4">For stroke treatment and prevention</p>
                      <Button asChild className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white">
                        <a href="https://www.practo.com/bangalore/treatment-for-stroke?utm_source=opd_google_Pmax&utm_medium=&utm_campaign=21045690443&gad_source=1&gad_campaignid=21387241615&gbraid=0AAAAADgl2cI8W2vtFxgPegZJKDXbHDtY0&gclid=Cj0KCQjwzOvEBhDVARIsADHfJJSxyo3Y0k4P--4_0SGCkrBWndYMOhJBt4H1muDFCu7lNGcxYsR_fgYaArMEEALw_wcB" target="_blank" rel="noreferrer">
                          Book Consultation
                        </a>
                      </Button>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-purple-50/80 to-purple-100/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-white/30">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-purple-800 mb-2">Diabetologist</h3>
                      <p className="text-purple-700 mb-4">For diabetes management and care</p>
                      <Button asChild className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white">
                        <a href="https://www.practo.com/bangalore/diabetologist?utm_source=opd_google_Pmax&utm_medium=&utm_campaign=22055233835&gad_source=1&gad_campaignid=22055283002&gbraid=0AAAAADgl2cJ5kEcCnARoraoCWWNAMhCCl&gclid=Cj0KCQjwzOvEBhDVARIsADHfJJSDF4WrhRYcLIcX_51MYo0udCjDiqMjcwqR9jrkZqOj44xi5MRW8MQaAl_QEALw_wcB" target="_blank" rel="noreferrer">
                          Book Consultation
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Section 5: Final CTA */}
        {currentSection === 5 && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/20 backdrop-blur-md" style={{ paddingBottom: '200px' }}>
            <div className="max-w-4xl section-enter text-center bg-white/80 backdrop-blur-lg rounded-3xl p-12 border border-white/20 shadow-2xl">
              <h2 className="text-5xl font-bold mb-8 bg-gradient-to-r from-blue-600 via-teal-600 to-purple-600 bg-clip-text text-transparent drop-shadow-lg">
                Ready to Get Started?
              </h2>
              <p className="text-2xl text-blue-800 mb-12 max-w-3xl mx-auto leading-relaxed drop-shadow-md font-medium">
                Experience the future of healthcare with our AI-powered chronic disease prediction platform
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <Button asChild className="bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 text-lg px-8 py-4">
                  <NavLink to="/pneumonia">Start Pneumonia Detection</NavLink>
                </Button>
                <Button asChild className="bg-gradient-to-r from-teal-500 to-purple-500 hover:from-teal-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 text-lg px-8 py-4">
                  <NavLink to="/stroke">Assess Stroke Risk</NavLink>
                </Button>
                <Button asChild className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 text-lg px-8 py-4">
                  <NavLink to="/diabetes">Predict Diabetes</NavLink>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
