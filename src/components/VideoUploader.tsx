import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Camera, FileVideo, CheckCircle, Loader, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

interface VideoUploaderProps {
  onUploadComplete: () => void;
  isProcessing: boolean;
}

export default function VideoUploader({ onUploadComplete, isProcessing }: VideoUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileUpload(files[0]);
    }
  }, []);

  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('video/')) {
      toast.error('Please upload a video file');
      return;
    }

    setUploadedFile(file);
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          toast.success('Video uploaded successfully!');
          setTimeout(onUploadComplete, 500);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
  };

  if (isProcessing) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-4xl mx-auto"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Processing Video with AI
          </h2>
          <p className="text-slate-300">
            Analyzing traffic patterns and detecting violations...
          </p>
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-8">
          <div className="flex items-center justify-center mb-8">
            <motion.div
              className="relative"
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            >
              <Zap className="w-16 h-16 text-blue-400" />
              <motion.div
                className="absolute inset-0 bg-blue-400/20 rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>
          </div>

          <div className="space-y-4">
            {['Detecting vehicles...', 'Calculating speeds...', 'Reading license plates...', 'Generating reports...'].map((step, index) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.5 }}
                className="flex items-center space-x-3"
              >
                <motion.div
                  className="w-4 h-4 bg-blue-400 rounded-full"
                  animate={{ scale: [0.8, 1.2, 0.8] }}
                  transition={{ duration: 1, repeat: Infinity, delay: index * 0.2 }}
                />
                <span className="text-white">{step}</span>
                {index < 2 && <CheckCircle className="w-5 h-5 text-green-400 ml-auto" />}
                {index === 2 && <Loader className="w-5 h-5 text-blue-400 ml-auto animate-spin" />}
              </motion.div>
            ))}
          </div>

          <motion.div
            className="mt-8 bg-slate-700/50 rounded-lg p-4"
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 3 }}
          >
            <div className="flex justify-between text-sm text-slate-300 mb-2">
              <span>Processing Progress</span>
              <span>78%</span>
            </div>
            <div className="h-2 bg-slate-600 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                initial={{ width: 0 }}
                animate={{ width: "78%" }}
                transition={{ duration: 3 }}
              />
            </div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-4"
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
          Upload Traffic Video
        </h2>
        <p className="text-slate-200 text-sm md:text-base drop-shadow-sm">
          Upload your traffic footage and let our AI analyze it for violations
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {/* Upload Area */}
        <motion.div
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${
            isDragOver 
              ? 'border-blue-400 bg-blue-400/20 backdrop-blur-md' 
              : 'border-slate-500 hover:border-slate-400 bg-slate-900/50 backdrop-blur-sm'
          }`}
          onDragEnter={handleDragIn}
          onDragLeave={handleDragOut}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          whileHover={{ scale: 1.02 }}
        >
          <input
            type="file"
            accept="video/*"
            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          <AnimatePresence>
            {isUploading ? (
              <motion.div
                key="uploading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <Loader className="w-12 h-12 text-blue-400 mx-auto animate-spin" />
                <p className="text-white font-medium">Uploading...</p>
                <div className="bg-slate-700 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                    style={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p className="text-slate-400 text-sm">{Math.round(uploadProgress)}% complete</p>
              </motion.div>
            ) : uploadedFile ? (
              <motion.div
                key="uploaded"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                <CheckCircle className="w-12 h-12 text-green-400 mx-auto" />
                <div>
                  <p className="text-white font-medium">{uploadedFile.name}</p>
                  <p className="text-slate-400 text-sm">
                    {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <motion.button
                  onClick={() => {
                    setUploadedFile(null);
                    setUploadProgress(0);
                  }}
                  className="text-blue-400 hover:text-blue-300 text-sm"
                  whileHover={{ scale: 1.05 }}
                >
                  Upload different file
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="default"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-4"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Upload className="w-12 h-12 text-slate-400 mx-auto" />
                </motion.div>
                <div>
                  <p className="text-white font-medium mb-2">
                    Drop your video here or click to upload
                  </p>
                  <p className="text-slate-400 text-sm">
                    Supports MP4, AVI, MOV files up to 100MB
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Sample Videos */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white mb-4">
            Or try a sample video
          </h3>
          
          {[
            { 
              name: 'Highway Traffic', 
              duration: '2:34', 
              violations: 3,
              thumbnail: 'https://images.pexels.com/photos/544542/pexels-photo-544542.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
            },
            { 
              name: 'City Intersection', 
              duration: '1:45', 
              violations: 1,
              thumbnail: 'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
            },
            { 
              name: 'School Zone', 
              duration: '3:12', 
              violations: 5,
              thumbnail: 'https://images.pexels.com/photos/2116475/pexels-photo-2116475.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'
            },
          ].map((sample, index) => (
            <motion.button
              key={sample.name}
              onClick={() => {
                toast.success(`Processing ${sample.name}...`);
                setTimeout(onUploadComplete, 1000);
              }}
              className="w-full bg-slate-900/60 backdrop-blur-md border border-slate-600/50 rounded-lg p-4 text-left hover:border-blue-400/50 transition-all group shadow-lg"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.02, x: 10 }}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img 
                    src={sample.thumbnail} 
                    alt={sample.name}
                    className="w-12 h-8 object-cover rounded border border-slate-600"
                  />
                  <FileVideo className="absolute inset-0 w-4 h-4 m-auto text-white/80" />
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-medium">{sample.name}</h4>
                  <p className="text-slate-300 text-sm">
                    {sample.duration} • {sample.violations} violations detected
                  </p>
                </div>
                <Camera className="w-5 h-5 text-slate-300 group-hover:text-blue-400 transition-colors" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}