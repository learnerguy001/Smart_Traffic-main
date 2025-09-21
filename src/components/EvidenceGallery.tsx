import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Eye, Download, Calendar, MapPin, X } from 'lucide-react';
import { useViolations } from '../context/ViolationContext';

export default function EvidenceGallery() {
  const { violations } = useViolations();
  const [selectedImage, setSelectedImage] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'location' | 'speed'>('date');

  const filteredViolations = violations
    .filter(violation => 
      violation.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      violation.location.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
        case 'location':
          return a.location.localeCompare(b.location);
        case 'speed':
          return b.speed - a.speed;
        default:
          return 0;
      }
    });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Evidence Gallery</h2>
        <p className="text-slate-400 text-sm md:text-base">Browse and manage violation evidence photos</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by license plate or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg pl-10 pr-4 py-2 text-sm md:text-base text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
            />
          </div>

          <div className="flex items-center space-x-2 w-full md:w-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-sm md:text-base text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 flex-1 md:flex-none"
            >
              <option value="date">Sort by Date</option>
              <option value="location">Sort by Location</option>
              <option value="speed">Sort by Speed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {[
          { label: 'Total Evidence', value: violations.length },
          { label: 'High Speed', value: violations.filter(v => v.speed > 70).length },
          { label: 'This Week', value: violations.filter(v => 
            new Date(v.timestamp) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
          ).length },
          { label: 'Confirmed', value: violations.filter(v => v.status === 'confirmed').length },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-3 md:p-4 text-center"
          >
            <div className="text-xl md:text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-slate-400 text-xs md:text-sm">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Evidence Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
        {filteredViolations.map((violation, index) => (
          <motion.div
            key={violation.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="group cursor-pointer"
            onClick={() => setSelectedImage(violation)}
          >
            <div className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl overflow-hidden hover:border-blue-500/30 transition-all group-hover:transform group-hover:scale-105">
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={violation.imageUrl}
                  alt={`Evidence ${violation.licensePlate}`}
                  className="w-full h-full object-cover transition-transform group-hover:scale-110"
                />
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Eye className="w-8 h-8 text-white" />
                </div>

                {/* Status Badge */}
                <div className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${
                  violation.status === 'confirmed' ? 'bg-green-500/80 text-green-100' :
                  violation.status === 'pending' ? 'bg-yellow-500/80 text-yellow-100' :
                  'bg-red-500/80 text-red-100'
                }`}>
                  {violation.status}
                </div>

                {/* Speed Badge */}
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium">
                  {violation.speed} mph
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-white">{violation.licensePlate}</h3>
                  <span className="text-blue-400 text-sm">
                    {(violation.confidence * 100).toFixed(0)}%
                  </span>
                </div>

                <div className="space-y-1 text-sm text-slate-400">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">{violation.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(violation.timestamp).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-slate-800 rounded-2xl overflow-hidden max-w-6xl w-full max-h-[90vh] flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="p-6 border-b border-slate-700 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-1">
                    Evidence: {selectedImage.licensePlate}
                  </h3>
                  <p className="text-slate-400">{selectedImage.location}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <button className="p-2 bg-blue-600/20 text-blue-300 rounded-lg hover:bg-blue-600/30 transition-colors">
                    <Download className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setSelectedImage(null)}
                    className="p-2 bg-slate-700 text-slate-400 rounded-lg hover:bg-slate-600 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 grid md:grid-cols-3 overflow-hidden">
                {/* Image */}
                <div className="md:col-span-2 p-6 flex items-center justify-center bg-slate-900/50">
                  <img
                    src={selectedImage.imageUrl}
                    alt={`Evidence for ${selectedImage.licensePlate}`}
                    className="max-w-full max-h-full object-contain rounded-lg"
                  />
                </div>

                {/* Details */}
                <div className="p-6 bg-slate-800/50 space-y-6">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-4">Violation Details</h4>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="text-slate-400 text-sm">License Plate</label>
                        <p className="text-white font-medium">{selectedImage.licensePlate}</p>
                      </div>
                      
                      <div>
                        <label className="text-slate-400 text-sm">Vehicle</label>
                        <p className="text-white">{selectedImage.vehicle}</p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="text-slate-400 text-sm">Speed</label>
                          <p className="text-red-400 font-semibold">{selectedImage.speed} mph</p>
                        </div>
                        <div>
                          <label className="text-slate-400 text-sm">Limit</label>
                          <p className="text-white">{selectedImage.speedLimit} mph</p>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-slate-400 text-sm">Location</label>
                        <p className="text-white">{selectedImage.location}</p>
                      </div>
                      
                      <div>
                        <label className="text-slate-400 text-sm">Timestamp</label>
                        <p className="text-white">
                          {new Date(selectedImage.timestamp).toLocaleString()}
                        </p>
                      </div>
                      
                      <div>
                        <label className="text-slate-400 text-sm">Confidence</label>
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-slate-700 rounded-full h-2 overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                              style={{ width: `${selectedImage.confidence * 100}%` }}
                            />
                          </div>
                          <span className="text-blue-400 text-sm font-medium">
                            {(selectedImage.confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                      
                      <div>
                        <label className="text-slate-400 text-sm">Status</label>
                        <div className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          selectedImage.status === 'confirmed' ? 'bg-green-500/20 text-green-300' :
                          selectedImage.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-red-500/20 text-red-300'
                        }`}>
                          {selectedImage.status.charAt(0).toUpperCase() + selectedImage.status.slice(1)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}