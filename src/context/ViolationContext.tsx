import React, { createContext, useContext, useState, useEffect } from 'react';
import { textToSpeech } from '../utils/elevenLabsApi';

export interface Violation {
  id: number;
  timestamp: string;
  location: string;
  speed: number;
  speedLimit: number;
  licensePlate: string;
  vehicle: string;
  imageUrl: string;
  status: 'pending' | 'confirmed' | 'dismissed';
  confidence: number;
}

interface ViolationContextType {
  violations: Violation[];
  addViolation: (violation: Omit<Violation, 'id'>) => void;
  updateViolation: (id: number, updates: Partial<Violation>) => void;
  getViolationStats: () => {
    total: number;
    pending: number;
    confirmed: number;
    dismissed: number;
    averageSpeed: number;
  };
}

const ViolationContext = createContext<ViolationContextType | undefined>(undefined);

export function ViolationProvider({ children }: { children: React.ReactNode }) {
  const [violations, setViolations] = useState<Violation[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('violations');
    if (stored) {
      setViolations(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('violations', JSON.stringify(violations));
  }, [violations]);

  const addViolation = (violation: Omit<Violation, 'id'>) => {
    const newViolation = {
      ...violation,
      id: Date.now(),
    };
    setViolations(prev => [newViolation, ...prev]);
    textToSpeech('New violation detected');
  };

  const updateViolation = (id: number, updates: Partial<Violation>) => {
    setViolations(prev => 
      prev.map(v => v.id === id ? { ...v, ...updates } : v)
    );
  };

  const getViolationStats = () => {
    const total = violations.length;
    const pending = violations.filter(v => v.status === 'pending').length;
    const confirmed = violations.filter(v => v.status === 'confirmed').length;
    const dismissed = violations.filter(v => v.status === 'dismissed').length;
    const averageSpeed = violations.reduce((acc, v) => acc + v.speed, 0) / total;

    return { total, pending, confirmed, dismissed, averageSpeed };
  };

  return (
    <ViolationContext.Provider value={{
      violations,
      addViolation,
      updateViolation,
      getViolationStats,
    }}>
      {children}
    </ViolationContext.Provider>
  );
}

export function useViolations() {
  const context = useContext(ViolationContext);
  if (!context) {
    throw new Error('useViolations must be used within a ViolationProvider');
  }
  return context;
}
