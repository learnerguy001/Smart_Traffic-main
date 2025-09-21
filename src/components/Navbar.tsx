import React from 'react';
import { motion } from 'framer-motion';
import { Camera, BarChart3, Image, Home, Shield } from 'lucide-react';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: 'home' | 'dashboard') => void;
}

export default function Navbar({ currentView, onNavigate }: NavbarProps) {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  ];

  return (
    <nav className="bg-slate-900/80 backdrop-blur-lg border-b border-slate-700/50 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div 
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative">
              <Shield className="w-8 h-8 text-blue-400" />
              <motion.div
                className="absolute inset-0 bg-blue-400/20 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">TrafficAI</h1>
              <p className="text-xs text-blue-300">Smart Controller</p>
            </div>
          </motion.div>

          {/* Navigation */}
          <div className="flex items-center space-x-1">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;
              
              return (
                <motion.button
                  key={item.id}
                  onClick={() => onNavigate(item.id as any)}
                  className={`relative px-4 py-2 rounded-lg flex items-center space-x-2 transition-all ${
                    isActive 
                      ? 'text-white bg-blue-600/20 border border-blue-500/30' 
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 bg-blue-500/10 rounded-lg"
                      layoutId="activeNav"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Status Indicator */}
          <motion.div
            className="flex items-center space-x-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center space-x-2 px-3 py-1 bg-red-500/10 border border-red-500/30 rounded-full">
              <motion.div
                className="w-2 h-2 bg-red-400 rounded-full"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <span className="text-red-300 text-sm font-medium">Live</span>
            </div>
          </motion.div>
        </div>
      </div>
    </nav>
  );
}