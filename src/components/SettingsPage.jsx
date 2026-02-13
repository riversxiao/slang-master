import React from 'react';
import { ArrowLeft, Trash2, Info, Github, Mail } from 'lucide-react';

const SettingsPage = ({ onBack, onResetProgress }) => {
  return (
    <div className="w-full h-full flex flex-col items-center">
      {/* Header */}
      <div className="w-full flex items-center justify-between mb-8 px-2">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 font-bold text-slate-700 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
          Back
        </button>
        <h2 className="text-2xl font-black text-slate-900">Settings</h2>
        <div className="w-6"></div> {/* Spacer for centering */}
      </div>

      <div className="w-full space-y-6">
        {/* Progress Section */}
        <section className="bg-white p-6 rounded-3xl border-4 border-slate-900 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="text-xl font-black mb-4 flex items-center gap-2">
            <Trash2 className="w-6 h-6 text-red-500" />
            Data Management
          </h3>
          <p className="text-slate-600 mb-6 font-medium text-sm">
            Want to start over? This will clear all your learning progress and mastered slangs. This action cannot be undone.
          </p>
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to reset all progress?')) {
                onResetProgress();
              }
            }}
            className="w-full py-4 bg-red-100 text-red-700 font-bold rounded-xl border-2 border-red-200 hover:bg-red-200 active:bg-red-300 transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 className="w-5 h-5" />
            Reset All Progress
          </button>
        </section>

        {/* About Section */}
        <section className="bg-white p-6 rounded-3xl border-4 border-slate-900 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <h3 className="text-xl font-black mb-4 flex items-center gap-2">
            <Info className="w-6 h-6 text-indigo-500" />
            About Slang Master
          </h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b-2 border-slate-100 pb-3">
              <span className="font-bold text-slate-600">Version</span>
              <span className="font-black text-slate-900 bg-slate-100 px-3 py-1 rounded-lg">v1.2.0 (MVP)</span>
            </div>
            
            <div className="flex justify-between items-center border-b-2 border-slate-100 pb-3">
              <span className="font-bold text-slate-600">Developer</span>
              <span className="font-bold text-slate-900">Trae AI Team</span>
            </div>

            <div className="pt-2">
              <p className="text-sm text-slate-500 font-medium leading-relaxed mb-4">
                Slang Master helps you learn authentic English slang through interactive flashcards. Built with React & Capacitor.
              </p>
              
              <div className="flex gap-3">
                <a href="#" className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors">
                  <Github className="w-4 h-4" />
                  GitHub
                </a>
                <a href="mailto:support@slangmaster.app" className="flex-1 py-3 bg-indigo-100 text-indigo-700 rounded-xl font-bold flex items-center justify-center gap-2 border-2 border-indigo-200 hover:bg-indigo-200 transition-colors">
                  <Mail className="w-4 h-4" />
                  Contact
                </a>
              </div>
            </div>
          </div>
        </section>
        
        <p className="text-center text-xs font-bold text-slate-400 pt-4">
          © 2024 Slang Master. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default SettingsPage;