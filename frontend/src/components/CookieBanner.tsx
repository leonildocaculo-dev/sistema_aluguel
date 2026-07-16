"use client";

import React, { useState, useEffect } from 'react';
import { X, ChevronDown, ChevronUp } from 'lucide-react';

export function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('cookie_consent', 'all');
    setIsVisible(false);
  };

  const handleReject = () => {
    localStorage.setItem('cookie_consent', 'essential');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-8 md:w-[400px] bg-surface border border-white/10 p-5 rounded-2xl shadow-2xl z-50">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-white font-semibold text-sm">Privacidade e Cookies</h3>
        <button onClick={handleReject} className="text-gray-400 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>
      <p className="text-xs text-gray-400 mb-4 leading-relaxed">
        Utilizamos cookies essenciais para o funcionamento do site. Gostaríamos também de utilizar cookies não essenciais para melhorar a sua experiência. Concorda com a utilização destes cookies?
      </p>

      <div className="flex flex-col gap-2 mb-4">
        <button 
          onClick={() => setShowDetails(!showDetails)}
          className="text-xs text-gray-400 hover:text-white flex items-center transition-colors w-max"
        >
          {showDetails ? <ChevronUp className="w-3 h-3 mr-1" /> : <ChevronDown className="w-3 h-3 mr-1" />}
          Ver Mais
        </button>

        {showDetails && (
          <div className="bg-black/20 rounded-lg p-3 space-y-3 mt-2 border border-white/5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-300">Essenciais</p>
                <p className="text-[10px] text-gray-500">Necessários para o funcionamento do site (Sempre ativos).</p>
              </div>
              <input type="checkbox" checked disabled className="rounded border-gray-600 bg-gray-700 text-primary-500" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-300">Estatísticos</p>
                <p className="text-[10px] text-gray-500">Ajudam-nos a perceber como os utilizadores interagem.</p>
              </div>
              <input type="checkbox" defaultChecked className="rounded border-gray-600 bg-gray-700 text-primary-500 focus:ring-primary-500" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-gray-300">Marketing</p>
                <p className="text-[10px] text-gray-500">Utilizados para rastrear visitantes pelos sites.</p>
              </div>
              <input type="checkbox" defaultChecked className="rounded border-gray-600 bg-gray-700 text-primary-500 focus:ring-primary-500" />
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-3">
        <button 
          onClick={handleAcceptAll}
          className="flex-1 bg-primary-600 hover:bg-primary-500 text-white text-xs font-medium py-2 rounded-lg transition-colors"
        >
          Aceitar Todos
        </button>
        <button 
          onClick={handleReject}
          className="flex-1 bg-transparent hover:bg-white/5 border border-white/10 text-white text-xs font-medium py-2 rounded-lg transition-colors"
        >
          Rejeitar
        </button>
      </div>
    </div>
  );
}
