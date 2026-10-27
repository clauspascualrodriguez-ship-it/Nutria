import React from 'react';
import { X, Download, Share, PlusSquare, Smartphone, CheckCircle2, Sparkles, ExternalLink } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { useApp } from '../../context/AppContext';
import { NutriaMascot } from '../NutriaMascot';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const { language } = useApp();
  const isEs = language === 'es';

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (isInstallable) {
      const ok = await install();
      if (ok) {
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-[#FFFEFC] w-full max-w-md rounded-3xl shadow-2xl border border-[#F2E8D9] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 px-6 border-b border-[#F2E8D9] bg-[#FFF9F0] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#654735] text-[#FFF9F0] flex items-center justify-center shadow-xs">
              <Download className="w-4 h-4 text-[#F4E3A5]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#654735]">
                {isEs ? 'Descargar Nutria como App' : 'Download Nutria as App'}
              </h3>
              <p className="text-[11px] text-[#9A765B]">
                {isEs ? 'En tu móvil u ordenador sin pasar por la App Store' : 'On your phone or desktop directly'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#9A765B] hover:text-[#654735] hover:bg-[#F2E8D9] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Mascot with cart & App Icon Preview */}
          <div className="text-center space-y-2">
            <div className="relative inline-block">
              <NutriaMascot mood="shopping" size="md" className="mx-auto drop-shadow-md" />
              <span className="absolute -bottom-2 right-2 px-2 py-0.5 rounded-full bg-[#654735] text-[#FFF9F0] font-bold text-[10px] shadow-sm">
                App PWA
              </span>
            </div>
            <h4 className="text-base font-extrabold text-[#654735]">
              {isEs
                ? '¡Instala Nutria en la pantalla de inicio!'
                : 'Install Nutria to your Home Screen!'}
            </h4>
            <p className="text-xs text-[#9A765B] max-w-xs mx-auto leading-relaxed">
              {isEs
                ? 'Se abrirá a pantalla completa como una app nativa, con el icono de la nutria y su carretito.'
                : 'Opens full-screen like a native app with the cute otter icon.'}
            </p>
          </div>

          {/* Quick Install Action for Chrome / Android / Desktop */}
          {isInstallable && (
            <button
              type="button"
              onClick={handleInstallClick}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#654735] text-[#FFF9F0] font-bold text-sm hover:bg-[#533726] shadow-md transition-all active:scale-98 flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4 text-[#F4E3A5]" />
              <span>{isEs ? 'Instalar ahora con 1 toque' : 'Install now with 1 click'}</span>
            </button>
          )}

          {/* Instructions for iPhone / iPad (Safari) */}
          <div className="p-4 rounded-2xl bg-[#FFF9F0] border border-[#E8C8A0] space-y-3">
            <div className="flex items-center gap-2 text-xs font-extrabold text-[#654735]">
              <Smartphone className="w-4 h-4 text-[#8C6D1F]" />
              <span>
                {isEs
                  ? '📱 En iPhone / iPad (Safari):'
                  : '📱 On iPhone / iPad (Safari):'}
              </span>
            </div>

            <ol className="space-y-2 text-xs text-[#654735] pl-1">
              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[#654735] text-[#FFF9F0] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <span>
                  {isEs ? (
                    <>
                      Toca el botón <strong>Compartir</strong> (<Share className="w-3.5 h-3.5 inline mx-0.5 text-blue-600" /> cuadrado con flecha hacia arriba en la barra de Safari).
                    </>
                  ) : (
                    <>
                      Tap the <strong>Share</strong> button (<Share className="w-3.5 h-3.5 inline mx-0.5 text-blue-600" /> icon with arrow up in Safari).
                    </>
                  )}
                </span>
              </li>

              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[#654735] text-[#FFF9F0] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <span>
                  {isEs ? (
                    <>
                      Baja y pulsa en <strong>"Añadir a la pantalla de inicio"</strong> (o <em>"Afegir a la pantalla d'inici"</em>).
                    </>
                  ) : (
                    <>
                      Scroll down and tap <strong>"Add to Home Screen"</strong>.
                    </>
                  )}
                </span>
              </li>

              <li className="flex items-start gap-2">
                <span className="w-5 h-5 rounded-full bg-[#654735] text-[#FFF9F0] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <span>
                  {isEs
                    ? 'Pulsa "Añadir" arriba a la derecha. ¡Y ya tendrás Nutria en tu pantalla como cualquier app!'
                    : 'Tap "Add" in the top right. Nutria will be on your screen like a native app!'}
                </span>
              </li>
            </ol>
          </div>

          {/* Android / Chrome Manual Steps (if prompt was dismissed) */}
          <div className="p-4 rounded-2xl bg-[#FFFEFC] border border-[#F2E8D9] space-y-2 text-xs text-[#654735]">
            <span className="font-extrabold block text-[#9A765B]">
              {isEs ? '🤖 En Android / Google Chrome:' : '🤖 On Android / Chrome:'}
            </span>
            <p className="text-[11px] leading-relaxed">
              {isEs
                ? 'Toca los tres puntos ⋮ en la esquina superior derecha del navegador y selecciona "Instalar aplicación" o "Añadir a pantalla de inicio".'
                : 'Tap the three dots ⋮ in the browser menu and select "Install app" or "Add to Home Screen".'}
            </p>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-2 gap-2 text-[11px] text-[#9A765B] pt-1">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#6C8B56]" />
              {isEs ? 'Sin descargas pesadas' : 'No heavy downloads'}
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#6C8B56]" />
              {isEs ? 'Funciona sin conexión' : 'Works offline'}
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#6C8B56]" />
              {isEs ? 'Pantalla completa' : 'Full-screen mode'}
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#6C8B56]" />
              {isEs ? 'Actualizaciones al vuelo' : 'Auto-updates'}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FFF9F0] border-t border-[#F2E8D9] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl border border-[#E5D5C5] text-xs font-bold text-[#654735] hover:bg-[#F2E8D9] transition-colors"
          >
            {isEs ? 'Entendido' : 'Got it'}
          </button>
        </div>
      </div>
    </div>
  );
};
