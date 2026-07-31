import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function HealthStatus() {
  const [healthStatus, setHealthStatus] = useState('checking');
  const [lastPing, setLastPing] = useState(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch('/api/ping');
        const data = await response.json();
        setHealthStatus(data.status === 'ok' ? 'healthy' : 'unhealthy');
        setLastPing(new Date().toLocaleTimeString());
      } catch (error) {
        setHealthStatus('unhealthy');
      }
    };

    // Check health on mount
    checkHealth();

    // Check health every 30 seconds
    const interval = setInterval(checkHealth, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (healthStatus) {
      case 'healthy': return 'bg-green-400';
      case 'unhealthy': return 'bg-red-400';
      default: return 'bg-yellow-400';
    }
  };

  const getStatusText = () => {
    switch (healthStatus) {
      case 'healthy': return 'Backend Online';
      case 'unhealthy': return 'Backend Offline';
      default: return 'Checking...';
    }
  };

  return (
    <div className="fixed top-4 right-4 z-[999]">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="flex items-center gap-2 bg-black/80 backdrop-blur-sm px-3 py-2 rounded-lg border border-white/10"
        >
          <div className={`w-2 h-2 rounded-full ${getStatusColor()} ${healthStatus === 'healthy' ? 'animate-pulse' : ''}`} />
          <span className="text-xs text-white/80">
            {getStatusText()}
          </span>
          {lastPing && (
            <span className="text-[10px] text-white/50 hidden sm:block">
              • {lastPing}
            </span>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default HealthStatus;