import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radio, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useViolations } from '../context/ViolationContext';
import toast from 'react-hot-toast';

export default function LiveFeed() {
  const { violations, addViolation } = useViolations();
  const [isLive, setIsLive] = useState(true);

  useEffect(() => {
    if (!isLive) return;

    const interval = setInterval(() => {
      // Randomly generate a new violation for demo
      if (Math.random() > 0.7) { // 30% chance every 3 seconds
        const sampleLocations = [
          "Broadway & 5th Ave", "Main St & Oak Ave", "Highway 101 Mile 45",
          "Park Ave & Center St", "1st Street & Elm Ave"
        ];
        const samplePlates = [
          "DEF-7890", "GHI-3456", "JKL-9012", "MNO-4567", "PQR-8901"
        ];
        const sampleVehicles = [
          "Toyota Camry", "Honda Accord", "Ford F-150", "Chevrolet Malibu", "Nissan Altima"
        ];

        const newViolation = {
          timestamp: new Date().toISOString(),
          location: sampleLocations[Math.floor(Math.random() * sampleLocations.length)],
          speed: Math.floor(Math.random() * 40) + 40, // 40-80 mph
          speedLimit: Math.floor(Math.random() * 20) + 25, // 25-45 mph
          licensePlate: samplePlates[Math.floor(Math.random() * samplePlates.length)],
          vehicle: sampleVehicles[Math.floor(Math.random() * sampleVehicles.length)],
          imageUrl: `https://images.pexels.com/photos/${Math.floor(Math.random() * 900000) + 100000}/pexels-photo-${Math.floor(Math.random() * 900000) + 100000}.jpeg?auto=compress&cs=tinysrgb&w=600`,
          status: 'pending' as const,
          confidence: 0.85 + Math.random() * 0.14 // 0.85-0.99
        };

        addViolation(newViolation);
        toast.success(`New violation detected: ${newViolation.licensePlate}`, {
          icon: '🚨',
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isLive, addViolation]);

  const recentViolations = violations.slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 h-fit sticky top-24"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">Live Feed</h3>
          <p className="text-slate-400 text-sm">Real-time violation detection</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <motion.div
            className={`w-3 h-3 rounded-full ${isLive ? 'bg-red-400' : 'bg-gray-400'}`}
            animate={isLive ? { opacity: [0.5, 1, 0.5] } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <button
            onClick={() => setIsLive(!isLive)}
            className={`text-sm font-medium ${
              isLive ? 'text-red-400' : 'text-gray-400'
            }`}
          >
            {isLive ? 'LIVE' : 'PAUSED'}
          </button>
        </div>
      </div>

      {/* Live Status */}
      <div className="mb-6">
        <div className="flex items-center space-x-2 text-sm text-slate-300 mb-2">
          <Radio className="w-4 h-4 text-blue-400" />
          <span>Monitoring 12 cameras</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="bg-slate-700/50 rounded-lg p-2">
            <div className="text-green-400 font-semibold">
              {violations.filter(v => v.status === 'confirmed').length}
            </div>
            <div className="text-xs text-slate-400">Confirmed</div>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-2">
            <div className="text-yellow-400 font-semibold">
              {violations.filter(v => v.status === 'pending').length}
            </div>
            <div className="text-xs text-slate-400">Pending</div>
          </div>
          <div className="bg-slate-700/50 rounded-lg p-2">
            <div className="text-blue-400 font-semibold">{violations.length}</div>
            <div className="text-xs text-slate-400">Total</div>
          </div>
        </div>
      </div>

      {/* Recent Violations */}
      <div>
        <h4 className="text-sm font-medium text-white mb-3">Recent Violations</h4>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          <AnimatePresence>
            {recentViolations.map((violation, index) => {
              const StatusIcon = violation.status === 'confirmed' ? CheckCircle :
                                violation.status === 'pending' ? Clock : AlertTriangle;
              const statusColor = violation.status === 'confirmed' ? 'text-green-400' :
                                violation.status === 'pending' ? 'text-yellow-400' : 'text-red-400';

              return (
                <motion.div
                  key={violation.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-slate-700/30 rounded-lg p-3 border border-slate-600/30"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium text-sm">
                      {violation.licensePlate}
                    </span>
                    <StatusIcon className={`w-4 h-4 ${statusColor}`} />
                  </div>
                  
                  <div className="text-xs text-slate-400 mb-1">
                    {violation.location}
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">
                      {violation.speed} mph
                    </span>
                    <span className="text-slate-500">
                      {new Date(violation.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <div className="mt-2 h-1 bg-slate-600 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${violation.confidence * 100}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
          
          {recentViolations.length === 0 && (
            <div className="text-center py-6 text-slate-400">
              <Radio className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No recent violations</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}