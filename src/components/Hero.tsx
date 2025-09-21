import React from 'react';
import { motion } from 'framer-motion';
import { Play, Zap, Shield, Camera, BarChart3, CheckCircle } from 'lucide-react';

interface HeroProps {
  onStartDemo?: () => void;
}

export default function Hero({ onStartDemo = () => {} }: HeroProps) {
  const features = [
    { icon: Camera, title: 'AI-Powered Detection', description: 'Advanced computer vision for real-time violation detection' },
    { icon: Zap, title: 'Instant Processing', description: 'Process video footage in real-time with 99.9% accuracy' },
    { icon: Shield, title: 'Secure Evidence', description: 'Tamper-proof evidence collection and storage' },
    { icon: BarChart3, title: 'Smart Analytics', description: 'Comprehensive reporting and trend analysis' },
  ];

  const stats = [
    { value: '99.9%', label: 'Accuracy Rate' },
    { value: '24/7', label: 'Monitoring' },
    { value: '<1s', label: 'Processing Time' },
    { value: '500+', label: 'Cities Deployed' },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-center py-20">
      {/* Main Hero Section */}
      <div className="text-center mb-20">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Smart Traffic
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              Controller
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed px-4">
            Revolutionary AI-powered traffic enforcement system that processes video footage to detect 
            speeding violations and license plates with unprecedented accuracy and speed.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 md:mb-16 px-4"
        >
          <motion.button
            onClick={onStartDemo}
            className="group px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold text-base md:text-lg flex items-center space-x-3 hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-blue-500/25 hover:shadow-xl"
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Play className="w-5 h-5" />
            <span>Start Live Demo</span>
            <motion.div
              className="w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100"
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </motion.button>
          
          <motion.div
            className="flex items-center space-x-2 text-slate-300 text-sm md:text-base"
            whileHover={{ scale: 1.05 }}
          >
            <CheckCircle className="w-5 h-5 text-green-400" />
            <span>100% Free • No Installation Required</span>
          </motion.div>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mb-12 md:mb-20 px-4"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
              className="text-center"
            >
              <motion.div
                className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400 mb-2"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
              >
                {stat.value}
              </motion.div>
              <div className="text-slate-400 text-xs md:text-sm uppercase tracking-wide">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 px-4"
      >
        {features.map((feature, index) => {
          const Icon = feature.icon;
          return (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
              className="group relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-cyan-600/10 rounded-2xl blur-xl group-hover:blur-lg transition-all" />
              <div className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-4 md:p-6 hover:border-blue-500/30 transition-all group-hover:transform group-hover:-translate-y-2">
                <div className="mb-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <h3 className="text-base md:text-lg font-semibold text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}