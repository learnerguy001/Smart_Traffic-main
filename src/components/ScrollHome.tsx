import React, { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Play, Zap, Shield, Camera, BarChart3, CheckCircle, Upload, FileVideo, Volume2 } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import VideoUploader from './VideoUploader';
import Hero from './Hero';

gsap.registerPlugin(ScrollTrigger);

interface ScrollHomeProps {
  onUploadComplete: () => void;
  isProcessing: boolean;
}

export default function ScrollHome({ onUploadComplete, isProcessing }: ScrollHomeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const uploaderRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const heroY = useTransform(smoothProgress, [0, 0.33], [0, -200]);
  const heroOpacity = useTransform(smoothProgress, [0, 0.33], [1, 0]);
  const uploaderY = useTransform(smoothProgress, [0.2, 0.66], [100, -100]);
  const featuresY = useTransform(smoothProgress, [0.5, 1], [200, -50]);
  const videoY = useTransform(smoothProgress, [0.4, 0.8], [0, -100]);
  const videoScale = useTransform(smoothProgress, [0.4, 0.8], [1, 1.1]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero section animations
      gsap.fromTo('.hero-title', 
        { y: 100, opacity: 0 },
        { 
          y: 0, 
          opacity: 1, 
          duration: 1.2, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Upload section parallax
      gsap.fromTo('.upload-card',
        { y: 150, opacity: 0, scale: 0.8 },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1.5,
          ease: "power3.out",
          scrollTrigger: {
            trigger: uploaderRef.current,
            start: "top 70%",
            end: "bottom 30%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Features stagger animation
      gsap.fromTo('.feature-card',
        { y: 150, opacity: 0, rotateX: 60, scale: 0.8 },
        {
          y: 0,
          opacity: 1,
          rotateX: 0,
          scale: 1,
          duration: 1,
          ease: "power3.out",
          stagger: 0.2,
          scrollTrigger: {
            trigger: featuresRef.current,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );

      // Video parallax effect
      gsap.to('.crash-video', {
        yPercent: -30,
        scale: 1.1,
        ease: "none",
        scrollTrigger: {
          trigger: '.features-section',
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      });

      // Parallax background elements
      gsap.to('.parallax-bg', {
        yPercent: -50,
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

  const features = [
    { 
      icon: Camera, 
      title: 'AI-Powered Detection', 
      description: 'Advanced computer vision for real-time violation detection',
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      icon: Zap, 
      title: 'Instant Processing', 
      description: 'Process video footage in real-time with 99.9% accuracy',
      color: 'from-purple-500 to-pink-500'
    },
    { 
      icon: Shield, 
      title: 'Secure Evidence', 
      description: 'Tamper-proof evidence collection and storage',
      color: 'from-green-500 to-emerald-500'
    },
    { 
      icon: BarChart3, 
      title: 'Smart Analytics', 
      description: 'Comprehensive reporting and trend analysis',
      color: 'from-orange-500 to-red-500'
    },
  ];

  return (
    <div ref={containerRef} className="relative">
      {/* Parallax Background */}
      <div className="parallax-bg fixed inset-0 -z-10 overflow-hidden">
        {/* Hero Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.9)), url('https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop')`
          }}
        />
        
        {/* Upload Section Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-0"
          style={{
            backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.85), rgba(15, 23, 42, 0.9)), url('https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop')`,
            transform: 'translateY(100vh)'
          }}
        />
        
        {/* Features Section Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-0"
          style={{
            backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.85)), url('https://images.pexels.com/photos/544542/pexels-photo-544542.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop')`,
            transform: 'translateY(200vh)'
          }}
        />
      </div>

      {/* Section 1: Hero */}
      <motion.section 
        ref={heroRef}
        style={{ y: heroY, opacity: heroOpacity }}
        className="min-h-screen flex items-center justify-center relative overflow-hidden"
      >
        <div className="hero-title text-center px-4 max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Smart Traffic
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                Controller
              </span>
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-slate-300 max-w-4xl mx-auto leading-relaxed">
              Revolutionary AI-powered traffic enforcement system that processes video footage to detect 
              speeding violations and license plates with unprecedented accuracy and speed.
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-16">
            {[
              { value: '99.9%', label: 'Accuracy Rate' },
              { value: '24/7', label: 'Monitoring' },
              { value: '<1s', label: 'Processing Time' },
              { value: '500+', label: 'Cities Deployed' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-2">
                  {stat.value}
                </div>
                <div className="text-slate-400 text-sm md:text-base uppercase tracking-wide">
                  {stat.label}
                </div>
              </motion.div>
            ))}
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

      {/* Section 2: Video Upload */}
      <motion.section 
        ref={uploaderRef}
        style={{ y: uploaderY }}
        className="min-h-screen flex items-center justify-center py-20"
      >
        <div className="upload-card w-full max-w-6xl mx-auto px-4">
          <VideoUploader 
            onUploadComplete={onUploadComplete}
            isProcessing={isProcessing}
          />
        </div>
      </motion.section>

      {/* Section 3: Features */}
      <motion.section 
        ref={featuresRef}
        className="features-section min-h-screen flex items-center justify-center py-20 relative overflow-hidden"
        style={{ y: featuresY }}
      >
        {/* Background Video */}
        <motion.div 
          className="crash-video absolute inset-0 -z-10"
          style={{ y: videoY, scale: videoScale }}
        >
          <div className="relative w-full h-full">
            <video
              autoPlay
              muted
              loop
              playsInline
              className="w-full h-full object-cover"
              poster="https://images.pexels.com/photos/1236678/pexels-photo-1236678.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
            >
              <source src="https://videos.pexels.com/video-files/2103099/2103099-uhd_3840_2160_25fps.mp4" type="video/mp4" />
              <source src="https://videos.pexels.com/video-files/3571264/3571264-uhd_3840_2160_30fps.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-blue-950/60 via-blue-950/80 to-blue-950/90" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-950/40 via-transparent to-blue-950/40" />
          </div>
        </motion.div>

        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16 relative z-10"
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 drop-shadow-2xl">
              Powerful Features
            </h2>
            <p className="text-lg md:text-xl text-slate-200 max-w-3xl mx-auto drop-shadow-lg">
              Advanced AI technology meets intuitive design for the ultimate traffic enforcement solution
            </p>
            
            {/* Video Control Indicator */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1, duration: 0.5 }}
              className="flex items-center justify-center mt-8 space-x-2 text-white/80"
            >
              <Volume2 className="w-4 h-4" />
              <span className="text-sm">Live Traffic Analysis</span>
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 relative z-10">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="feature-card group relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-cyan-600/10 rounded-2xl blur-xl group-hover:blur-lg transition-all" />
                  <div className="relative bg-slate-900/70 backdrop-blur-md border border-slate-600/50 rounded-2xl p-6 md:p-8 hover:border-blue-400/50 transition-all group-hover:transform group-hover:-translate-y-4 group-hover:scale-105 shadow-2xl">
                    <div className="mb-6">
                      <div className={`w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                        <Icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                      </div>
                      <h3 className="text-lg md:text-xl font-semibold text-white mb-3 drop-shadow-sm">
                        {feature.title}
                      </h3>
                      <p className="text-slate-300 text-sm md:text-base leading-relaxed drop-shadow-sm">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          
          {/* Floating Elements */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-blue-400/20 rounded-full"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.2, 0.8, 0.2],
                  scale: [0.5, 1.2, 0.5],
                }}
                transition={{
                  duration: 4 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 3,
                }}
              />
            ))}
          </div>
        </div>
      </motion.section>
    </div>
  );
}