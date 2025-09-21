import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, MapPin, Car, Gauge, Camera, 
  CheckCircle, X, Clock, Eye, AlertTriangle 
} from 'lucide-react';
import { Violation } from '../context/ViolationContext';

interface ViolationCardProps {
  violation: Violation;
  onStatusUpdate: (id: number, status: 'confirmed' | 'dismissed') => void;
}

export default function ViolationCard({ violation, onStatusUpdate }: ViolationCardProps) {
  const [showImage, setShowImage] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-400 bg-yellow-400/10';
      case 'confirmed': return 'text-green-400 bg-green-400/10';
      case 'dismissed': return 'text-red-400 bg-red-400/10';
      default: return 'text-slate-400 bg-slate-400/10';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock;
      case 'confirmed': return CheckCircle;
      case 'dismissed': return X;
      default: return AlertTriangle;
    }
  };

  const StatusIcon = getStatusIcon(violation.status);
  const speedDiff = violation.speed - violation.speedLimit;

  return (
    <>
      <motion.div
        className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6 hover:border-blue-500/30 transition-all group"
        whileHover={{ y: -2 }}
        layout
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-500 rounded-xl flex items-center justify-center">
              <Car className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">
                {violation.licensePlate}
              </h3>
              <p className="text-slate-400 text-sm">{violation.vehicle}</p>
            </div>
          </div>
          
          <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(violation.status)}`}>
            <StatusIcon className="w-3 h-3" />
            <span className="capitalize">{violation.status}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <div className="flex items-center space-x-2 text-sm">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span className="text-slate-300">
              {new Date(violation.timestamp).toLocaleString()}
            </span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm">
            <MapPin className="w-4 h-4 text-slate-400" />
            <span className="text-slate-300">{violation.location}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm">
            <Gauge className="w-4 h-4 text-slate-400" />
            <span className="text-slate-300">
              <span className={speedDiff > 15 ? 'text-red-400' : speedDiff > 5 ? 'text-yellow-400' : 'text-white'}>
                {violation.speed} mph
              </span>
              <span className="text-slate-500"> / {violation.speedLimit} mph</span>
            </span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm">
            <Camera className="w-4 h-4 text-slate-400" />
            <span className="text-slate-300">
              {(violation.confidence * 100).toFixed(1)}% confidence
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <motion.button
              onClick={() => setShowImage(true)}
              className="px-3 py-1 bg-blue-600/20 text-blue-300 rounded-lg text-sm hover:bg-blue-600/30 transition-colors flex items-center space-x-1"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Eye className="w-3 h-3" />
              <span>View Evidence</span>
            </motion.button>
            
            <div className={`px-2 py-1 rounded text-xs font-medium ${
              speedDiff > 15 ? 'bg-red-500/20 text-red-300' : 
              speedDiff > 5 ? 'bg-yellow-500/20 text-yellow-300' : 
              'bg-blue-500/20 text-blue-300'
            }`}>
              +{speedDiff} mph over
            </div>
          </div>

          {violation.status === 'pending' && (
            <div className="flex items-center space-x-2">
              <motion.button
                onClick={() => onStatusUpdate(violation.id, 'dismissed')}
                className="px-3 py-1 bg-red-600/20 text-red-300 rounded-lg text-sm hover:bg-red-600/30 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Dismiss
              </motion.button>
              <motion.button
                onClick={() => onStatusUpdate(violation.id, 'confirmed')}
                className="px-3 py-1 bg-green-600/20 text-green-300 rounded-lg text-sm hover:bg-green-600/30 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Confirm
              </motion.button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Evidence Modal */}
      <AnimatePresence>
        {showImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowImage(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-slate-800 rounded-2xl overflow-hidden max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-slate-700">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-white">
                    Evidence - {violation.licensePlate}
                  </h3>
                  <button
                    onClick={() => setShowImage(false)}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div className="p-6">
                <img
                  src={violation.imageUrl}
                  alt={`Evidence for ${violation.licensePlate}`}
                  className="w-full h-auto rounded-lg"
                />
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-slate-400">Timestamp:</span>
                    <span className="text-white ml-2">
                      {new Date(violation.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Location:</span>
                    <span className="text-white ml-2">{violation.location}</span>
                  </div>
                  <div>
                    <span className="text-slate-400">Speed:</span>
                    <span className="text-white ml-2">
                      {violation.speed} mph ({speedDiff}+ over limit)
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400">Confidence:</span>
                    <span className="text-white ml-2">
                      {(violation.confidence * 100).toFixed(1)}%
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}