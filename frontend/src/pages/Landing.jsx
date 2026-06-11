import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, BrainCircuit, Target, CheckCircle, Zap, LayoutDashboard, CheckSquare, Activity, Loader2, TrendingUp, Heart } from 'lucide-react';
import Card from '../components/ui/Card';
import { useAuthStore } from '../store/useAuthStore';

const Landing = () => {
  const navigate = useNavigate();
  const { loginAsDemo } = useAuthStore();
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  const handleDemoLogin = async () => {
    setIsDemoLoading(true);
    const success = await loginAsDemo();
    if (success) {
      navigate('/dashboard');
    }
    setIsDemoLoading(false);
  };
  return (
    <div className="min-h-screen bg-background text-textPrimary overflow-hidden selection:bg-primary/30 font-sans">
      
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto z-50 relative">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-sm">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight">Actify</span>
        </div>
        <div className="flex items-center gap-6">
          <Link to="/login" className="text-sm font-medium bg-primary text-white px-5 py-2 rounded-lg hover:bg-primary/90 transition-all shadow-sm hover:shadow active:scale-95">
            Log in
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-40 px-6 overflow-hidden">
        {/* Animated Background Gradients */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/4 -translate-y-1/4 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[100px] mix-blend-screen animate-pulse-slow" style={{ animationDelay: '2s' }} />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface/50 border border-border backdrop-blur-md mb-8">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
              <span className="text-xs font-medium text-textSecondary uppercase tracking-wider">Actify is now live</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
              Understand How You Work.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Improve How You Perform.</span>
            </h1>
            
            <p className="text-lg md:text-xl text-textSecondary mb-10 max-w-2xl mx-auto leading-relaxed">
              AI-powered behavioral productivity analysis that helps you focus better and achieve more. Don't just manage tasks—master your habits.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup" className="group relative inline-flex items-center justify-center gap-2 bg-textPrimary text-background px-8 py-3.5 rounded-lg text-sm font-semibold overflow-hidden transition-all shadow-sm hover:shadow active:scale-95">
                <span className="relative z-10 flex items-center gap-2">
                  Get Started <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
              <button onClick={handleDemoLogin} disabled={isDemoLoading} className="px-8 py-3.5 rounded-lg text-sm font-semibold text-textPrimary border border-border bg-surface hover:bg-surface/80 transition-colors shadow-sm flex items-center justify-center gap-2 disabled:opacity-50">
                {isDemoLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "View Live Demo"}
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Dashboard Preview / Mockup */}
      <section className="relative -mt-20 pb-32 px-6 z-20">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="max-w-6xl mx-auto rounded-xl border border-border bg-surface/50 p-2 md:p-3 backdrop-blur-xl shadow-2xl shadow-primary/5 overflow-hidden"
        >
          <div className="aspect-[16/9] w-full rounded-lg bg-background border border-border flex flex-col overflow-hidden relative shadow-inner">
            {/* Window Header */}
            <div className="h-10 w-full border-b border-border bg-surface flex items-center px-4">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-danger/80"/>
                <div className="w-3 h-3 rounded-full bg-warning/80"/>
                <div className="w-3 h-3 rounded-full bg-success/80"/>
              </div>
            </div>
            {/* Dashboard Abstract Representation */}
            <div className="flex flex-1 overflow-hidden p-6 gap-6 bg-grid-white/[0.02]">
              {/* Sidebar Mock */}
              <div className="w-48 hidden md:flex flex-col gap-3 border-r border-border pr-6">
                <div className="h-10 w-full bg-surface/80 rounded-lg flex items-center px-3 gap-3 border border-border/50 text-primary">
                  <LayoutDashboard className="w-4 h-4" />
                  <div className="h-3 w-16 bg-primary/30 rounded" />
                </div>
                <div className="h-10 w-full hover:bg-surface/50 rounded-lg flex items-center px-3 gap-3 transition-colors text-textSecondary">
                  <CheckSquare className="w-4 h-4" />
                  <div className="h-3 w-12 bg-textSecondary/30 rounded" />
                </div>
                <div className="h-10 w-full hover:bg-surface/50 rounded-lg flex items-center px-3 gap-3 transition-colors text-textSecondary">
                  <Activity className="w-4 h-4" />
                  <div className="h-3 w-14 bg-textSecondary/30 rounded" />
                </div>
              </div>
              {/* Main Content Mock */}
              <div className="flex-1 flex flex-col gap-6">
                {/* Top Widgets */}
                <div className="grid grid-cols-4 gap-4 h-24">
                  <div className="bg-surface rounded-xl border border-border p-4 flex flex-col justify-between">
                    <div className="flex justify-between items-center">
                      <div className="h-2 w-16 bg-textSecondary/40 rounded" />
                      <TrendingUp className="w-4 h-4 text-primary" />
                    </div>
                    <div className="text-xl font-bold">85%</div>
                  </div>
                  <div className="bg-surface rounded-xl border border-border p-4 flex flex-col justify-between">
                    <div className="flex justify-between items-center">
                      <div className="h-2 w-16 bg-textSecondary/40 rounded" />
                      <Target className="w-4 h-4 text-success" />
                    </div>
                    <div className="text-xl font-bold">92%</div>
                  </div>
                  <div className="bg-surface rounded-xl border border-border p-4 flex flex-col justify-between">
                    <div className="flex justify-between items-center">
                      <div className="h-2 w-16 bg-textSecondary/40 rounded" />
                      <Zap className="w-4 h-4 text-warning" />
                    </div>
                    <div className="text-xl font-bold">78%</div>
                  </div>
                  <div className="bg-surface rounded-xl border border-border p-4 flex flex-col justify-between">
                    <div className="flex justify-between items-center">
                      <div className="h-2 w-16 bg-textSecondary/40 rounded" />
                      <CheckCircle className="w-4 h-4 text-secondary" />
                    </div>
                    <div className="text-xl font-bold">12</div>
                  </div>
                </div>
                {/* Big Chart & List */}
                <div className="flex-1 flex gap-6">
                  <div className="flex-[2] bg-gradient-to-br from-surface to-background rounded-xl border border-border relative overflow-hidden p-5 flex flex-col">
                    <div className="h-3 w-32 bg-textSecondary/40 rounded mb-6" />
                    <div className="flex-1 border-b border-l border-border/50 relative flex items-end px-4 gap-2">
                      <div className="w-1/6 h-[30%] bg-primary/20 rounded-t border-t border-primary/50" />
                      <div className="w-1/6 h-[50%] bg-primary/30 rounded-t border-t border-primary/60" />
                      <div className="w-1/6 h-[80%] bg-primary/50 rounded-t border-t border-primary/80" />
                      <div className="w-1/6 h-[40%] bg-primary/30 rounded-t border-t border-primary/60" />
                      <div className="w-1/6 h-[90%] bg-primary/60 rounded-t border-t border-primary" />
                      <div className="absolute bottom-0 w-full h-full bg-gradient-to-t from-primary/5 to-transparent pointer-events-none" />
                    </div>
                  </div>
                  <div className="flex-1 bg-surface rounded-xl border border-border flex flex-col p-5 gap-4">
                    <div className="h-3 w-24 bg-textSecondary/40 rounded mb-2" />
                    <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border">
                      <div className="w-4 h-4 rounded-full border-2 border-textSecondary/50" />
                      <div className="h-2 w-20 bg-textPrimary/70 rounded" />
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border">
                      <div className="w-4 h-4 rounded-full bg-success flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                      <div className="h-2 w-24 bg-textSecondary/50 rounded line-through" />
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-background rounded-lg border border-border">
                      <div className="w-4 h-4 rounded-full border-2 border-textSecondary/50" />
                      <div className="h-2 w-16 bg-textPrimary/70 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Overview */}
      <section id="features" className="py-32 bg-surface/30 border-t border-border relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Built for deep work</h2>
            <p className="text-lg text-textSecondary max-w-2xl mx-auto">Everything you need to analyze your habits, eliminate distractions, and enter the flow state.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<BrainCircuit />}
              title="Behavioral Analytics"
              description="Our insights engine analyzes your task completion rates and focus times to tell you exactly when you are most productive."
            />
            <FeatureCard 
              icon={<Target />}
              title="Smart Tasks"
              description="Organize your life into workspaces. From simple to-do lists to prioritized tasks, Actify adapts to your workflow."
            />
            <FeatureCard 
              icon={<CheckCircle />}
              title="Focus & Habits"
              description="Built-in timers and streak trackers that sync directly with your behavioral analytics dashboard."
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 border-t border-border bg-background">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-16">Loved by top performers</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-8 text-left text-textPrimary relative hover:-translate-y-1 transition-transform">
              <p className="text-base leading-relaxed text-textSecondary relative z-10 mb-6 italic">
                "Actify didn't just organize my tasks; the AI insights showed me that I was constantly losing focus around 2 PM. I shifted my deep work to mornings and my coding productivity skyrocketed."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center text-white font-bold text-sm">RS</div>
                <div>
                  <div className="font-semibold text-sm">Rohan Sinha</div>
                  <div className="text-xs text-textSecondary">Software Engineer</div>
                </div>
              </div>
            </Card>
            <Card className="p-8 text-left text-textPrimary relative hover:-translate-y-1 transition-transform">
              <p className="text-base leading-relaxed text-textSecondary relative z-10 mb-6 italic">
                "The focus timer combined with the behavioral tracking is a game changer. It automatically analyzes my campaign scheduling habits and tells me when I'm most consistent."
              </p>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-secondary to-primary flex items-center justify-center text-white font-bold text-sm">PS</div>
                <div>
                  <div className="font-semibold text-sm">Priya Sharma</div>
                  <div className="text-xs text-textSecondary">Digital Marketer</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-surface py-16 text-center text-textSecondary flex flex-col items-center justify-center">
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-tr from-primary/20 to-secondary/20 border border-primary/10">
            <Zap className="w-4 h-4 text-primary" />
          </div>
          <span className="text-xl font-bold text-textPrimary tracking-tight">Actify</span>
        </div>
        
        <div className="flex flex-col items-center gap-4">
          <div className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-background border border-border shadow-sm hover:shadow-md transition-shadow">
            <span className="text-sm font-medium text-textSecondary">Made with</span>
            <Heart className="w-4 h-4 text-danger fill-danger/20 animate-pulse" />
            <span className="text-sm font-medium text-textSecondary">by</span>
            <span className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary tracking-wide">Mayur Patel</span>
          </div>
          <p className="text-xs text-textSecondary/60 mt-2">© {new Date().getFullYear()} Actify Productivity Platform. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => (
  <Card hover className="p-8 group text-left">
    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
      {React.cloneElement(icon, { className: "w-6 h-6" })}
    </div>
    <h3 className="text-xl font-bold mb-3 tracking-tight">{title}</h3>
    <p className="text-sm text-textSecondary leading-relaxed">{description}</p>
  </Card>
);

export default Landing;
