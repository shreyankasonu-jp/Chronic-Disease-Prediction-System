import { Helmet } from "react-helmet-async";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100/80 via-teal-100/80 to-emerald-100/80 backdrop-blur-2xl relative overflow-hidden">
      <Helmet>
        <title>About | AI Health Diagnosis Platform</title>
        <meta name="description" content="Learn about our chronic disease prediction platform and its AI models." />
        <link rel="canonical" href="/about" />
      </Helmet>

      {/* Enhanced floating background elements matching navbar */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-24 h-24 bg-blue-600/60 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '0s', animationDuration: '4s' }}></div>
        <div className="absolute top-40 right-32 w-20 h-20 bg-teal-600/60 rounded-full blur-2xl animate-bounce" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>
        <div className="absolute bottom-32 left-32 w-28 h-28 bg-emerald-600/60 rounded-full blur-2xl animate-ping" style={{ animationDelay: '4s', animationDuration: '6s' }}></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-blue-700/60 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
        <div className="absolute top-1/2 left-1/4 w-22 h-22 bg-teal-700/60 rounded-full blur-2xl animate-bounce" style={{ animationDelay: '3s', animationDuration: '5s' }}></div>
        <div className="absolute top-1/3 right-1/3 w-18 h-18 bg-emerald-700/60 rounded-full blur-2xl animate-ping" style={{ animationDelay: '5s', animationDuration: '4s' }}></div>
        <div className="absolute bottom-1/3 left-1/3 w-16 h-16 bg-blue-800/60 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2.5s', animationDuration: '6s' }}></div>
        <div className="absolute top-1/4 left-1/2 w-14 h-14 bg-teal-800/60 rounded-full blur-2xl animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '5s' }}></div>
      </div>

      <div className="container mx-auto px-4 pt-24 pb-16 relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-600 via-teal-600 to-emerald-600 rounded-full mb-8 shadow-2xl animate-pulse">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-6xl font-bold mb-8 bg-gradient-to-r from-blue-700 via-teal-600 to-emerald-700 bg-clip-text text-transparent">
            About Our Platform
          </h1>
          <p className="text-2xl text-blue-700 max-w-4xl mx-auto leading-relaxed">
            Revolutionizing healthcare with AI-powered chronic disease prediction
          </p>
        </div>

        {/* Disease Cards */}
        <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-3 mb-16">
          {/* Pneumonia Card */}
          <Card className="border-0 bg-gradient-to-br from-white/80 to-blue-50/80 backdrop-blur-lg shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 border border-white/20">
            <CardHeader className="text-center p-8">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <CardTitle className="text-3xl text-blue-800 mb-4">Pneumonia Detection</CardTitle>
              <CardDescription className="text-blue-700 text-lg">Advanced CNN models for chest X-ray analysis</CardDescription>
            </CardHeader>
            <CardContent className="text-center p-8 pt-0">
              <p className="text-blue-700 leading-relaxed text-lg">
                Our deep learning model analyzes chest X-rays with <span className="font-bold text-blue-600 text-2xl">92.6% accuracy</span>, providing instant pneumonia detection with visual heatmaps for medical professionals.
              </p>
            </CardContent>
          </Card>

          {/* Stroke Card */}
          <Card className="border-0 bg-gradient-to-br from-white/80 to-teal-50/80 backdrop-blur-lg shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 border border-white/20">
            <CardHeader className="text-center p-8">
              <div className="w-20 h-20 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <CardTitle className="text-3xl text-teal-800 mb-4">Stroke Risk Assessment</CardTitle>
              <CardDescription className="text-teal-700 text-lg">Comprehensive health metrics evaluation</CardDescription>
            </CardHeader>
            <CardContent className="text-center p-8 pt-0">
              <p className="text-teal-700 leading-relaxed text-lg">
                Using logistic regression with <span className="font-bold text-teal-600 text-2xl">85% accuracy</span>, our system evaluates multiple health factors to predict stroke risk and recommend preventive measures.
              </p>
            </CardContent>
          </Card>

          {/* Diabetes Card */}
          <Card className="border-0 bg-gradient-to-br from-white/80 to-purple-50/80 backdrop-blur-lg shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 border border-white/20">
            <CardHeader className="text-center p-8">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <CardTitle className="text-3xl text-purple-800 mb-4">Diabetes Prediction</CardTitle>
              <CardDescription className="text-purple-700 text-lg">Random Forest algorithm for precise detection</CardDescription>
            </CardHeader>
            <CardContent className="text-center p-8 pt-0">
              <p className="text-purple-700 leading-relaxed text-lg">
                Our Random Forest model achieves <span className="font-bold text-purple-600 text-2xl">88% accuracy</span> in diabetes prediction using key medical indicators and lifestyle factors for early intervention.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Mission Section */}
        <Card className="border-0 bg-gradient-to-br from-white/80 to-blue-50/80 backdrop-blur-lg shadow-2xl border border-white/20">
          <CardContent className="p-16 text-center">
            <h2 className="text-5xl font-bold mb-10 bg-gradient-to-r from-blue-800 to-teal-700 bg-clip-text text-transparent">
              Our Mission
            </h2>
            <p className="text-2xl text-blue-800 max-w-4xl mx-auto leading-relaxed mb-16">
              We're dedicated to democratizing healthcare through cutting-edge AI technology. Our platform provides healthcare professionals and patients with powerful tools for early disease detection, enabling timely interventions and better health outcomes.
            </p>
            <div className="grid gap-12 md:grid-cols-3 text-center">
              <div className="p-8">
                <div className="text-6xl font-bold text-blue-600 mb-4">92.6%</div>
                <div className="text-lg text-blue-700 font-medium">Pneumonia Detection Accuracy</div>
              </div>
              <div className="p-8">
                <div className="text-6xl font-bold text-teal-600 mb-4">85%</div>
                <div className="text-lg text-teal-700 font-medium">Stroke Risk Assessment Accuracy</div>
              </div>
              <div className="p-8">
                <div className="text-6xl font-bold text-purple-600 mb-4">88%</div>
                <div className="text-lg text-purple-700 font-medium">Diabetes Prediction Accuracy</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;
