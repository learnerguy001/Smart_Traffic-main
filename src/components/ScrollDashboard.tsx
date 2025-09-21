import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Dashboard from './Dashboard';
import LiveFeed from './LiveFeed';
import StatsPanel from './StatsPanel';
import EvidenceGallery from './EvidenceGallery';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollDashboard() {
  const containerRef = useRef<HTMLDivElement>(null);
  const dashboardRef = useRef<HTMLDivElement>(null);
  const evidenceRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const dashboardY = useTransform(smoothProgress, [0, 0.5], [0, -100]);
  const evidenceY = useTransform(smoothProgress, [0.3, 1], [100, 0]);
  const dashboardOpacity = useTransform(smoothProgress, [0, 0.5], [1, 0.3]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Dashboard section animations
      gsap.fromTo('.dashboard-stats', 
        { y: 100, opacity: 0, scale: 0.9 },
        { 
          y: 0, 
          opacity: 1, 
          scale: 1,
          duration: 1.2, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: dashboardRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Dashboard cards stagger
      gsap.fromTo('.dashboard-card',
        { y: 80, opacity: 0, rotateY: 15 },
        {
          y: 0,
          opacity: 1,
          rotateY: 0,
          duration: 1,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: dashboardRef.current,
            start: "top 70%",
            end: "bottom 30%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Evidence gallery animations
      gsap.fromTo('.evidence-header',
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: evidenceRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );

      gsap.fromTo('.evidence-item',
        { y: 100, opacity: 0, scale: 0.8, rotateX: 30 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          rotateX: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: evidenceRef.current,
            start: "top 70%",
            end: "bottom 30%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Parallax background
      gsap.to('.dashboard-parallax', {
        yPercent: -30,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative">
      {/* Parallax Background */}
      <div className="dashboard-parallax fixed inset-0 -z-10 overflow-hidden">
        {/* Dashboard Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.9)), url('https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop')`
          }}
        />
        
        {/* Evidence Section Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-0"
          style={{
            backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.85)), url('https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop')`,
            transform: 'translateY(100vh)'
          }}
        />
      </div>

      {/* Section 1: Dashboard */}
      <motion.section 
        ref={dashboardRef}
        style={{ y: dashboardY, opacity: dashboardOpacity }}
        className="min-h-screen py-20"
      >
        <div className="container mx-auto px-4">
          {/* Dashboard Header */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12 relative z-10"
          >
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-2xl">
              Traffic Control
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                Dashboard
              </span>
            </h1>
            <p className="text-lg md:text-xl text-slate-200 max-w-3xl mx-auto drop-shadow-lg">
              Real-time monitoring and analysis of traffic violations with advanced AI detection
            </p>
          </motion.div>

          {/* Stats Panel */}
          <div className="dashboard-stats mb-12">
            <StatsPanel />
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 dashboard-card">
              <Dashboard />
            </div>
            <div className="dashboard-card">
              <LiveFeed />
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-blue-400 rounded-full flex justify-center">
            <motion.div
              className="w-1 h-3 bg-blue-400 rounded-full mt-2"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </motion.section>

      {/* Section 2: Evidence Gallery */}
      <motion.section 
        ref={evidenceRef}
        style={{ y: evidenceY }}
        className="min-h-screen py-20"
      >
        <div className="container mx-auto px-4">
          {/* Evidence Header */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="evidence-header text-center mb-12 relative z-10"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 drop-shadow-2xl">
              Evidence
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                Gallery
              </span>
            </h2>
            <p className="text-lg md:text-xl text-slate-200 max-w-3xl mx-auto drop-shadow-lg">
              Comprehensive collection of violation evidence with advanced search and filtering
            </p>
          </motion.div>

          {/* Evidence Gallery */}
          <div className="evidence-item">
            <EvidenceGallery />
          </div>
          
          {/* Floating Animation Elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(15)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -40, 0],
                  opacity: [0.3, 0.9, 0.3],
                  scale: [0.8, 1.5, 0.8],
                }}
                transition={{
                  duration: 5 + Math.random() * 2,
                  repeat: Infinity,
                  delay: Math.random() * 4,
                }}
              />
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
}