import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Eye, CheckCircle, X, Clock, AlertTriangle } from 'lucide-react';
import { useViolations } from '../context/ViolationContext';
import ViolationCard from './ViolationCard';

export default function Dashboard() {
  const { violations, updateViolation } = useViolations();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'confirmed' | 'dismissed'>('all');

  const filteredViolations = violations.filter(violation => {
    const matchesSearch = 
      violation.licensePlate.toLowerCase().includes(searchTerm.toLowerCase()) ||
      violation.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      violation.vehicle.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || violation.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleStatusUpdate = (id: number, status: 'confirmed' | 'dismissed') => {
    updateViolation(id, { status });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-white mb-2">Violation Dashboard</h2>
          <p className="text-slate-400 text-sm md:text-base">Review and manage detected traffic violations</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by license plate, location, or vehicle..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-700/50 border border-slate-600/50 rounded-lg pl-10 pr-4 py-2 text-sm md:text-base text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="bg-slate-700/50 border border-slate-600/50 rounded-lg px-3 py-2 text-sm md:text-base text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 flex-1 md:flex-none"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="dismissed">Dismissed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Violations List */}
      <div className="space-y-4">
        {filteredViolations.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <AlertTriangle className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <p className="text-slate-400">No violations found matching your criteria</p>
          </motion.div>
        ) : (
          filteredViolations.map((violation, index) => (
            <motion.div
              key={violation.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ViolationCard
                violation={violation}
                onStatusUpdate={handleStatusUpdate}
              />
            </motion.div>
          ))
        )}
      </div>

    </motion.div>
  );
}
