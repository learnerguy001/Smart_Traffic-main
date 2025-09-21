import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Clock, CheckCircle, AlertTriangle, Car, MapPin, Gauge, Calendar } from 'lucide-react';
import { useViolations } from '../context/ViolationContext';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function StatsPanel() {
  const { violations, getViolationStats } = useViolations();
  const [animatedStats, setAnimatedStats] = useState({
    total: 0,
    pending: 0,
    confirmed: 0,
    dismissed: 0,
    averageSpeed: 0
  });

  const stats = getViolationStats();

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedStats(stats);
    }, 500);

    return () => clearTimeout(timer);
  }, [stats]);

  // Chart data
  const barChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Violations',
      data: [12, 8, 15, 9, 18, 6, 4],
      backgroundColor: 'rgba(59, 130, 246, 0.8)',
      borderColor: 'rgba(59, 130, 246, 1)',
      borderWidth: 1,
      borderRadius: 4,
    }]
  };

  const doughnutData = {
    labels: ['Confirmed', 'Pending', 'Dismissed'],
    datasets: [{
      data: [animatedStats.confirmed, animatedStats.pending, animatedStats.dismissed],
      backgroundColor: [
        'rgba(34, 197, 94, 0.8)',
        'rgba(251, 191, 36, 0.8)',
        'rgba(239, 68, 68, 0.8)'
      ],
      borderColor: [
        'rgba(34, 197, 94, 1)',
        'rgba(251, 191, 36, 1)',
        'rgba(239, 68, 68, 1)'
      ],
      borderWidth: 2,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#94a3b8',
        },
      },
      y: {
        grid: {
          color: 'rgba(148, 163, 184, 0.1)',
        },
        ticks: {
          color: '#94a3b8',
        },
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          color: '#f1f5f9',
          usePointStyle: true,
          padding: 20,
        },
      },
    },
  };

  const statCards = [
    {
      label: 'Total Violations',
      value: animatedStats.total,
      icon: Car,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400/10',
      change: '+12%',
      changeColor: 'text-green-400'
    },
    {
      label: 'Pending Review',
      value: animatedStats.pending,
      icon: Clock,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-400/10',
      change: '+3',
      changeColor: 'text-yellow-400'
    },
    {
      label: 'Confirmed',
      value: animatedStats.confirmed,
      icon: CheckCircle,
      color: 'text-green-400',
      bgColor: 'bg-green-400/10',
      change: '+5',
      changeColor: 'text-green-400'
    },
    {
      label: 'Average Speed',
      value: Math.round(animatedStats.averageSpeed || 0),
      unit: 'mph',
      icon: Gauge,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-400/10',
      change: '-2 mph',
      changeColor: 'text-green-400'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 md:p-6 hover:border-blue-500/30 transition-all group"
              whileHover={{ y: -4 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-10 h-10 md:w-12 md:h-12 ${stat.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-5 h-5 md:w-6 md:h-6 ${stat.color}`} />
                </div>
                {stat.change && (
                  <span className={`text-xs md:text-sm font-medium ${stat.changeColor}`}>
                    {stat.change}
                  </span>
                )}
              </div>
              
              <div className="space-y-1">
                <p className="text-slate-400 text-xs md:text-sm">{stat.label}</p>
                <div className="flex items-baseline space-x-1">
                  <motion.span
                    className="text-xl md:text-2xl font-bold text-white"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                  >
                    {stat.value}
                  </motion.span>
                  {stat.unit && (
                    <span className="text-slate-400 text-xs md:text-sm">{stat.unit}</span>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Violations Chart */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Weekly Violations</h3>
              <p className="text-slate-400 text-sm">Last 7 days trend</p>
            </div>
            <div className="flex items-center space-x-1 text-green-400 text-sm">
              <TrendingUp className="w-4 h-4" />
              <span>+15%</span>
            </div>
          </div>
          <div className="h-48">
            <Bar data={barChartData} options={chartOptions} />
          </div>
        </motion.div>

        {/* Status Distribution */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6"
        >
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white">Status Distribution</h3>
            <p className="text-slate-400 text-sm">Current violation status breakdown</p>
          </div>
          <div className="h-48">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-6"
      >
        <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
        <div className="space-y-3">
          {violations.slice(0, 3).map((violation, index) => (
            <motion.div
              key={violation.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 + index * 0.1 }}
              className="flex items-center space-x-3 p-3 bg-slate-700/30 rounded-lg"
            >
              <div className="w-8 h-8 bg-blue-500/20 rounded-full flex items-center justify-center">
                <Car className="w-4 h-4 text-blue-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="text-white font-medium">{violation.licensePlate}</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-400 text-sm">{violation.speed} mph</span>
                </div>
                <div className="flex items-center space-x-4 text-xs text-slate-500">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span>{violation.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(violation.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
              <div className={`px-2 py-1 rounded text-xs ${
                violation.status === 'confirmed' ? 'bg-green-500/20 text-green-300' :
                violation.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                'bg-red-500/20 text-red-300'
              }`}>
                {violation.status}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
}