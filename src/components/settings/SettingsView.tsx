import React, { useState } from 'react';
import { Globe, Users, Euro, RefreshCw, Download, CheckCircle2, ShieldCheck, Smartphone } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NutriaMascot } from '../NutriaMascot';
import { PWAInstallButton } from '../pwa/PWAInstallButton';

export const SettingsView: React.FC = () => {
  const {
    t,
    language,
    setLanguage,
    profile,
    updateProfile,
    resetToDemoData,
    pantryItems,
    shoppingList,
    recipes,
    expenses,
  } = useApp();

  const isEs = language === 'es';
  const [resetSuccess, setResetSuccess] = useState(false);
  const [showAppStoreGuide, setShowAppStoreGuide] = useState(false);
  const [showWebAppGuide, setShowWebAppGuide] = useState(false);

  const handleReset = () => {
    resetToDemoData();
    setResetSuccess(true);
    setTimeout(() => setResetSuccess(false), 2500);
  };

  const handleExportData = () => {
    const backup = {
      profile,
      pantryItems,
      shoppingList,
      recipes,
      expenses,
      exportDate: new Date().toISOString(),
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backup, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `nutria_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#654735] tracking-tight">
          {t.settings.title}
        </h1>
      </div>

      {/* PWA App Install Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-linear-to-r from-[#FFF5EA] to-[#FFF9F0] border-2 border-[#E8C8A0] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 text-center sm:text-left">
          <NutriaMascot mood="shopping" size="xs" className="shrink-0" />
          <div>
            <h2 className="text-base font-bold text-[#654735]">
              {isEs ? '📱 Publicar o descarregar Nutria' : '📱 Publish or download Nutria'}
            </h2>
            <p className="text-xs text-[#9A765B] mt-0.5">
              {isEs
                ? 'Publica la teva web app gratuïtament o instal·la-la a la pantalla del mòbil.'
                : 'Publish your web app for free or install it to your home screen.'}
            </p>
          </div>
        </div>
        <div className="w-full sm:w-auto shrink-0 flex flex-wrap items-center gap-2">
          <PWAInstallButton variant="compact" />
          <button
            type="button"
            onClick={() => setShowWebAppGuide(true)}
            className="px-3.5 py-1.5 rounded-xl border border-[#A8B89A] bg-[#6C8B56] text-[#FFF9F0] text-xs font-bold hover:bg-[#587345] transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <span>🌐</span>
            <span>{isEs ? 'Publicar Web App (Gratis)' : 'Publish Web App (Free)'}</span>
          </button>
          <button
            type="button"
            onClick={() => setShowAppStoreGuide(true)}
            className="px-3.5 py-1.5 rounded-xl border border-[#E5D5C5] bg-[#FFFEFC] text-[#654735] text-xs font-bold hover:bg-[#F2E8D9] transition-colors"
          >
            🍎 {isEs ? 'App Store' : 'App Store'}
          </button>
        </div>
      </div>

      {resetSuccess && (
        <div className="p-3.5 bg-[#EAF2E8] border border-[#A8B89A] text-[#3D5A2B] rounded-2xl flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-[#5F8747]" />
          <p className="text-xs font-bold">{t.settings.resetSuccess}</p>
        </div>
      )}

      {/* Language Setting Card */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#FFFEFC] border border-[#F2E8D9] shadow-2xs space-y-4">
        <div className="flex items-center gap-2.5">
          <Globe className="w-5 h-5 text-[#654735]" />
          <h2 className="text-base font-bold text-[#654735]">
            {t.settings.languageLabel}
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setLanguage('es')}
            className={`p-4 rounded-2xl border text-sm font-bold flex items-center justify-between transition-all ${
              language === 'es'
                ? 'bg-[#654735] text-[#FFF9F0] border-[#654735] shadow-xs'
                : 'bg-[#FFF9F0] text-[#654735] border-[#E5D5C5] hover:bg-[#F2E8D9]'
            }`}
          >
            <span>🇪🇸 Español (España)</span>
            {language === 'es' && <CheckCircle2 className="w-4 h-4 text-[#A8B89A]" />}
          </button>

          <button
            type="button"
            onClick={() => setLanguage('en')}
            className={`p-4 rounded-2xl border text-sm font-bold flex items-center justify-between transition-all ${
              language === 'en'
                ? 'bg-[#654735] text-[#FFF9F0] border-[#654735] shadow-xs'
                : 'bg-[#FFF9F0] text-[#654735] border-[#E5D5C5] hover:bg-[#F2E8D9]'
            }`}
          >
            <span>🇬🇧 English</span>
            {language === 'en' && <CheckCircle2 className="w-4 h-4 text-[#A8B89A]" />}
          </button>
        </div>
      </div>

      {/* Profile Settings */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#FFFEFC] border border-[#F2E8D9] shadow-2xs space-y-4">
        <h2 className="text-base font-bold text-[#654735]">
          {isEs ? 'Configuración del Hogar' : 'Household Settings'}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-[#654735] block mb-1">
              {t.settings.householdLabel}
            </label>
            <input
              type="number"
              min="1"
              max="10"
              value={profile.householdSize}
              onChange={(e) => updateProfile({ householdSize: parseInt(e.target.value, 10) || 1 })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5D5C5] text-sm font-bold text-[#654735]"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-[#654735] block mb-1">
              {t.settings.budgetLabel}
            </label>
            <input
              type="number"
              min="20"
              step="10"
              value={profile.budgetTarget}
              onChange={(e) => updateProfile({ budgetTarget: parseFloat(e.target.value) || 200 })}
              className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5D5C5] text-sm font-bold text-[#654735]"
            />
          </div>
        </div>
      </div>

      {/* Data Management & Backup */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#FFFEFC] border border-[#F2E8D9] shadow-2xs space-y-4">
        <h2 className="text-base font-bold text-[#654735]">
          {t.settings.dataManagement}
        </h2>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-[#FFF9F0] border border-[#E5D5C5] text-[#654735] text-xs font-bold hover:bg-[#F2E8D9] transition-all"
          >
            <RefreshCw className="w-4 h-4 text-[#9A765B]" />
            <span>{t.settings.resetDemoBtn}</span>
          </button>

          <button
            type="button"
            onClick={handleExportData}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-[#FFF9F0] border border-[#E5D5C5] text-[#654735] text-xs font-bold hover:bg-[#F2E8D9] transition-all"
          >
            <Download className="w-4 h-4 text-[#9A765B]" />
            <span>{t.settings.exportDataBtn}</span>
          </button>
        </div>
      </div>

      {/* Brand & Mascot About Footer */}
      <div className="p-6 rounded-3xl bg-[#FFF9F0] border border-[#E8C8A0] text-center space-y-3">
        <NutriaMascot mood="waving" size="sm" className="mx-auto" />
        <div>
          <h3 className="text-sm font-extrabold text-[#654735]">
            Nutria v1.0
          </h3>
          <p className="text-xs text-[#9A765B] mt-1 max-w-sm mx-auto">
            {t.tagline}
          </p>
        </div>
      </div>

      {/* App Store Guide Modal */}
      {showAppStoreGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#FFFEFC] w-full max-w-lg rounded-3xl shadow-2xl border border-[#F2E8D9] overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-4 px-6 border-b border-[#F2E8D9] bg-[#FFF9F0] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🍎</span>
                <div>
                  <h3 className="text-base font-bold text-[#654735]">
                    {isEs ? 'Publicar Nutria en la Apple App Store' : 'Publish Nutria to Apple App Store'}
                  </h3>
                  <p className="text-[11px] text-[#9A765B]">
                    {isEs ? 'Preparada con Capacitor y empaquetado nativo iOS' : 'Configured with Capacitor for native iOS packaging'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAppStoreGuide(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[#9A765B] hover:bg-[#F2E8D9]"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs text-[#654735] leading-relaxed">
              <div className="p-4 rounded-2xl bg-[#FFF9F0] border border-[#E8C8A0] space-y-2">
                <h4 className="font-extrabold text-sm text-[#654735] flex items-center gap-1.5">
                  <span>⚡</span>
                  <span>{isEs ? 'Método 1: PWABuilder (El más rápido)' : 'Method 1: PWABuilder (Fastest)'}</span>
                </h4>
                <p>
                  {isEs
                    ? 'Nutria ya está lista como PWA. Puedes usar la herramienta oficial de empaquetado de Microsoft:'
                    : 'Nutria is already fully PWA-compliant. You can use PWABuilder:'}
                </p>
                <ol className="list-decimal list-inside space-y-1 font-medium pl-1">
                  <li>{isEs ? 'Entra en pwabuilder.com' : 'Go to pwabuilder.com'}</li>
                  <li>
                    {isEs ? 'Pega la URL pública de la teva app (després de desplegar a Vercel o la URL d\'aquesta finestra):' : 'Paste your live app URL (after deploying to Vercel or this window\'s URL):'}
                    <code className="block mt-0.5 p-1.5 rounded bg-[#FFFEFC] border text-[10px] break-all font-mono text-[#654735]">
                      {typeof window !== 'undefined' ? window.location.origin : 'https://nutria-app.vercel.app'}
                    </code>
                  </li>
                  <li>{isEs ? 'Haz clic en "Package for Stores" y selecciona "iOS".' : 'Click "Package for Stores" and pick "iOS".'}</li>
                  <li>{isEs ? 'Te descargará el proyecto Xcode listo para firmar con tu cuenta de Apple Developer y subir a App Store Connect.' : 'Downloads an Xcode project ready to sign and upload to App Store Connect.'}</li>
                </ol>
              </div>

              <div className="p-4 rounded-2xl bg-[#FFFEFC] border border-[#F2E8D9] space-y-2">
                <h4 className="font-extrabold text-sm text-[#654735] flex items-center gap-1.5">
                  <span>💻</span>
                  <span>{isEs ? 'Método 2: Capacitor + Xcode (Proyecto iOS ya generado)' : 'Method 2: Capacitor + Xcode (iOS Project already generated)'}</span>
                </h4>
                <p>
                  {isEs
                    ? 'El proyecto Xcode nativo (/ios/App/App.xcodeproj) ya está creado, con el icono de la nutria y permisos de cámara listos. En tu Mac:'
                    : 'The native Xcode project (/ios/App/App.xcodeproj) is already created with the otter icon and camera permissions. On your Mac:'}
                </p>
                <pre className="p-2.5 rounded-xl bg-[#2D1F17] text-[#F4E3A5] font-mono text-[10px] overflow-x-auto">
                  npx cap open ios
                </pre>
                <p className="text-[11px] text-[#9A765B]">
                  {isEs
                    ? 'Se abrirá Xcode directamente. Selecciona tu cuenta de Apple Developer (requerida por Apple: 99 $/año) y pulsa Product > Archive > Distribute App a App Store Connect.'
                    : 'Xcode will open directly. Select your Apple Developer account ($99/year required by Apple) and click Product > Archive > Distribute App to App Store Connect.'}
                </p>
              </div>
            </div>

            <div className="p-4 bg-[#FFF9F0] border-t border-[#F2E8D9] flex justify-end">
              <button
                type="button"
                onClick={() => setShowAppStoreGuide(false)}
                className="px-5 py-2 rounded-xl bg-[#654735] text-[#FFF9F0] font-bold text-xs"
              >
                {isEs ? 'Tancar guia' : 'Close guide'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Web App Publishing Guide Modal */}
      {showWebAppGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-[#FFFEFC] rounded-3xl max-w-xl w-full max-h-[90vh] shadow-2xl border border-[#F2E8D9] flex flex-col overflow-hidden">
            <div className="p-5 border-b border-[#F2E8D9] bg-[#FFF9F0] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <NutriaMascot mood="celebrating" size="xs" />
                <h3 className="font-extrabold text-base text-[#654735]">
                  {isEs ? '🌐 Com publicar la Web App (100% Gratis)' : '🌐 How to publish the Web App (100% Free)'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowWebAppGuide(false)}
                className="p-1.5 rounded-full hover:bg-[#F2E8D9] text-[#9A765B]"
              >
                ✕
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs text-[#654735] leading-relaxed">
              <div className="p-4 rounded-2xl bg-[#EAF2E8] border border-[#A8B89A] space-y-2">
                <h4 className="font-extrabold text-sm text-[#3D5A2B] flex items-center gap-1.5">
                  <span>🚀</span>
                  <span>{isEs ? 'Pas 1: Vercel (Recomanat, 2 minuts)' : 'Step 1: Vercel (Recommended, 2 mins)'}</span>
                </h4>
                <p className="text-[#3D5A2B]">
                  {isEs
                    ? 'Ja hem deixat creats els fitxers de configuració (vercel.json i netlify.toml) perquè la teva Web App funcioni a la primera.'
                    : 'We already pre-configured vercel.json and netlify.toml so your Web App works out of the box.'}
                </p>
                <ol className="list-decimal list-inside space-y-1.5 font-medium pl-1 text-[#2D4520]">
                  <li>
                    {isEs
                      ? 'Exporta el projecte a GitHub fent clic al botó d\'exportació superior d\'AI Studio.'
                      : 'Export your project to GitHub using the export button at the top of AI Studio.'}
                  </li>
                  <li>
                    {isEs
                      ? 'Entra a vercel.com (inicia sessió gratuïta amb el teu GitHub).'
                      : 'Go to vercel.com and sign in with GitHub.'}
                  </li>
                  <li>
                    {isEs
                      ? 'Fes clic a "Add New Project" i tria el teu repositori Nutria.'
                      : 'Click "Add New Project" and select your Nutria repository.'}
                  </li>
                  <li>
                    {isEs
                      ? 'Fes clic a "Deploy". Vercel compilarà automàticament la teva web en 30 segons i et donarà un enllaç públic (ex: https://nutria-app.vercel.app).'
                      : 'Click "Deploy". Vercel will build your app in 30 seconds and generate a public live URL.'}
                  </li>
                </ol>
              </div>

              <div className="p-4 rounded-2xl bg-[#FFF9F0] border border-[#E8C8A0] space-y-2">
                <h4 className="font-extrabold text-sm text-[#654735] flex items-center gap-1.5">
                  <span>📲</span>
                  <span>{isEs ? 'Pas 2: Instal·lar a l\'iPhone / Android' : 'Step 2: Install on iPhone / Android'}</span>
                </h4>
                <p>
                  {isEs
                    ? 'Un cop tinguis el teu enllaç de Vercel:'
                    : 'Once you have your live Vercel link:'}
                </p>
                <div className="space-y-2 pl-1">
                  <div className="p-2.5 rounded-xl bg-[#FFFEFC] border border-[#E5D5C5]">
                    <span className="font-bold text-[#654735]">🍎 iPhone (Safari):</span>{' '}
                    {isEs
                      ? 'Toca el botó de Compartir (fletxa cap amunt) i tria "Afegir a la pantalla d\'inici".'
                      : 'Tap the Share button and select "Add to Home Screen".'}
                  </div>
                  <div className="p-2.5 rounded-xl bg-[#FFFEFC] border border-[#E5D5C5]">
                    <span className="font-bold text-[#654735]">🤖 Android (Chrome):</span>{' '}
                    {isEs
                      ? 'Toca els 3 punts de dalt i selecciona "Instal·la l\'aplicació".'
                      : 'Tap the 3 dots and select "Install app".'}
                  </div>
                </div>
                <p className="text-[11px] text-[#9A765B]">
                  {isEs
                    ? 'Tindràs la Nutria amb el carretó a la teva pantalla d\'inici funcionant com una app nativa, fins i tot offline!'
                    : 'You will have the Nutria mascot icon on your home screen working just like a native app!'}
                </p>
              </div>
            </div>

            <div className="p-4 bg-[#FFF9F0] border-t border-[#F2E8D9] flex justify-end">
              <button
                type="button"
                onClick={() => setShowWebAppGuide(false)}
                className="px-5 py-2 rounded-xl bg-[#654735] text-[#FFF9F0] font-bold text-xs"
              >
                {isEs ? 'Entès! Tancar' : 'Got it! Close'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
