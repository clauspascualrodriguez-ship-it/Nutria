import React, { useState } from 'react';
import { Download, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { useApp } from '../../context/AppContext';
import { PWAInstallModal } from './PWAInstallModal';

interface PWAInstallButtonProps {
  variant?: 'compact' | 'full';
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'compact',
  className = '',
}) => {
  const { isInstallable, isInstalled, install } = usePWAInstall();
  const { language } = useApp();
  const [showModal, setShowModal] = useState(false);
  const isEs = language === 'es';

  // If already running in standalone mode (from home screen), hide the install button
  if (isInstalled) {
    return null;
  }

  const handleClick = async () => {
    if (isInstallable) {
      try {
        const ok = await install();
        if (ok) return;
      } catch (e) {
        // Fallback to instructions modal
      }
    }
    setShowModal(true);
  };

  return (
    <>
      {variant === 'compact' ? (
        <button
          type="button"
          onClick={handleClick}
          title={isEs ? 'Descargar Nutria como aplicación' : 'Download Nutria as an app'}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#654735] text-[#FFF9F0] text-xs font-bold hover:bg-[#533726] transition-all shadow-xs active:scale-95 ${className}`}
        >
          <Download className="w-3.5 h-3.5 text-[#F4E3A5]" />
          <span>{isEs ? 'Instalar App' : 'Install App'}</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          className={`w-full py-3 px-4 rounded-2xl bg-[#654735] text-[#FFF9F0] font-bold text-xs hover:bg-[#533726] transition-all shadow-md active:scale-98 flex items-center justify-center gap-2 ${className}`}
        >
          <Download className="w-4 h-4 text-[#F4E3A5]" />
          <span>
            {isEs
              ? 'Descargar Nutria en mi dispositivo (PWA)'
              : 'Download Nutria on my device (PWA)'}
          </span>
        </button>
      )}

      <PWAInstallModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </>
  );
};
