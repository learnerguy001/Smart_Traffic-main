import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, BarChart3, Search, Upload, Shield, Zap } from 'lucide-react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import VideoUploader from './components/VideoUploader';
import Dashboard from './components/Dashboard';
import LiveFeed from './components/LiveFeed';
import StatsPanel from './components/StatsPanel';
import EvidenceGallery from './components/EvidenceGallery';
import ScrollHome from './components/ScrollHome';
import ScrollDashboard from './components/ScrollDashboard';
import { ViolationProvider } from './context/ViolationContext';
import ChatbotIcon from './components/ChatbotIcon';
import Chatbot from './components/Chatbot';

function App() {
  const [currentView, setCurrentView] = useState<'home' | 'dashboard'>('home');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  useEffect(() => {
    // Add some demo violations to localStorage on first load
    if (!localStorage.getItem('violations')) {
      const sampleViolations = [
        {
          id: 1,
          timestamp: new Date().toISOString(),
          location: "5th Ave & Broadway",
          speed: 67,
          speedLimit: 35,
          licensePlate: "ABC-1234",
          vehicle: "BMW 3-Series",
          imageUrl: "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg",
          status: "pending",
          confidence: 0.96
        },
        {
          id: 2,
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          location: "Main St & 2nd Ave",
          speed: 85,
          speedLimit: 45,
          licensePlate: "XYZ-9876",
          vehicle: "Mercedes C-Class",
          imageUrl: "https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg",
          status: "confirmed",
          confidence: 0.89
        },
        {
          id: 3,
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          location: "Highway 101 Mile 42",
          speed: 95,
          speedLimit: 65,
          licensePlate: "DEF-5555",
          vehicle: "Audi A4",
          imageUrl: "https://images.pexels.com/photos/544542/pexels-photo-544542.jpeg",
          status: "pending",
          confidence: 0.92
        }
      ];
      localStorage.setItem('violations', JSON.stringify(sampleViolations));
    }
  }, []);

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return (
          <ScrollHome 
            onUploadComplete={() => {
              setIsProcessing(true);
              setTimeout(() => {
                setIsProcessing(false);
                setCurrentView('dashboard');
              }, 3000);
            }}
            isProcessing={isProcessing}
          />
        );
      case 'dashboard':
        return <ScrollDashboard />;
      default:
        return <ScrollHome onUploadComplete={() => {}} isProcessing={false} />;
    }
  };

  return (
    <ViolationProvider>
      <div className="min-h-screen bg-blue-950 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-blue-900/30 to-cyan-900/20" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/30 via-blue-950 to-blue-950" />
        
        {/* Particle Effect */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.8, 0.3],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="relative z-10">
          <Navbar 
            currentView={currentView} 
            onNavigate={setCurrentView}
          />
          
          <main className="container mx-auto px-4 py-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentView}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {renderView()}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>

        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'rgba(15, 23, 42, 0.9)',
              color: '#f1f5f9',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              backdropFilter: 'blur(10px)',
            },
          }}
        />
        {!isChatbotOpen && <ChatbotIcon onClick={() => setIsChatbotOpen(true)} />}
        {isChatbotOpen && <Chatbot onClose={() => setIsChatbotOpen(false)} />}
      </div>
    </ViolationProvider>
  );
}

export default App;
