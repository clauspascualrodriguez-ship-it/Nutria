import React, { useState, useRef, useEffect } from 'react';
import { X, Camera, Barcode, CheckCircle2, Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PantryItem, StorageLocation } from '../../types';

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onItemAdded?: (item: PantryItem) => void;
}

export const BarcodeScannerModal: React.FC<BarcodeScannerModalProps> = ({
  isOpen,
  onClose,
  onItemAdded,
}) => {
  const { t, language, addPantryItem } = useApp();
  const isEs = language === 'es';

  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [scannedCode, setScannedCode] = useState<string>('');
  const [manualCode, setManualCode] = useState<string>('');
  const [detectedItem, setDetectedItem] = useState<any | null>(null);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanningIntervalRef = useRef<number | null>(null);

  // Popular sample barcodes for testing
  const sampleBarcodes = [
    { code: '8480000100012', label: isEs ? '🥛 Leche Entera Hacendado' : '🥛 Whole Milk Hacendado' },
    { code: '8480000200021', label: isEs ? '🥚 Huevos Camperos (12 uds)' : '🥚 Free-Range Eggs (12 pcs)' },
    { code: '8480000300038', label: isEs ? '🍚 Arroz Redondo (1 kg)' : '🍚 Round Rice (1 kg)' },
    { code: '8480000400045', label: isEs ? '🥫 Tomate Frito Casero' : '🥫 Fried Tomato Sauce' },
    { code: '8480000500052', label: isEs ? '🍗 Pechuga Pollo (500 g)' : '🍗 Chicken Breast (500 g)' },
    { code: '8480000600069', label: isEs ? '🥣 Yogur Griego Natural' : '🥣 Greek Natural Yogurt' },
    { code: '8480000700076', label: isEs ? '🫒 Aceite Oliva Virgen Extra' : '🫒 Olive Oil Extra Virgin' },
  ];

  // Start Camera
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error(isEs ? 'Cámara no soportada en este navegador' : 'Camera not supported in browser');
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setCameraActive(true);

        // Native BarcodeDetector if available
        if ('BarcodeDetector' in window) {
          const barcodeDetector = new (window as any).BarcodeDetector({
            formats: ['ean_13', 'ean_8', 'qr_code', 'code_128', 'upc_a'],
          });

          scanningIntervalRef.current = window.setInterval(async () => {
            if (videoRef.current && videoRef.current.readyState === 4) {
              try {
                const barcodes = await barcodeDetector.detect(videoRef.current);
                if (barcodes.length > 0) {
                  const rawVal = barcodes[0].rawValue;
                  if (rawVal) {
                    handleCodeLookup(rawVal);
                  }
                }
              } catch (e) {
                // Ignore detection frame error
              }
            }
          }, 600);
        }
      }
    } catch (err: any) {
      console.warn('Camera stream error:', err);
      setCameraError(
        isEs
          ? 'No se pudo acceder a la cámara (puede requerir permisos o estar en un entorno sin cámara). Puedes probar los códigos de ejemplo o escribir uno.'
          : 'Could not access camera. You can try the sample barcodes below or type one manually.'
      );
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (scanningIntervalRef.current) {
      clearInterval(scanningIntervalRef.current);
      scanningIntervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
      setDetectedItem(null);
      setSuccessMessage(null);
    }
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  // Code Lookup
  const handleCodeLookup = async (code: string) => {
    if (!code) return;
    setIsSearching(true);
    setScannedCode(code);
    stopCamera();

    try {
      const res = await fetch('/api/barcode-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ barcode: code }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.found && data.item) {
          setDetectedItem(data.item);
          return;
        }
      }
      throw new Error('Network or server unavailable, using client database');
    } catch (err) {
      // Client-side fallback dictionary for static web app deployment
      const LOCAL_BARCODES: Record<string, any> = {
        '8480000100012': { barcode: '8480000100012', name: 'Leche Entera Hacendado (1L)', nameEn: 'Whole Milk Hacendado (1L)', category: 'Lácteos', defaultLocation: 'fridge', shelfLifeDays: 7, estimatedPrice: 0.96, unit: 'L', defaultQuantity: 1, brand: 'Hacendado' },
        '8480000200021': { barcode: '8480000200021', name: 'Huevos Camperos Clase M/L (12 uds)', nameEn: 'Free-Range Eggs M/L (12 pcs)', category: 'Lácteos y Huevos', defaultLocation: 'fridge', shelfLifeDays: 21, estimatedPrice: 2.35, unit: 'ud', defaultQuantity: 12, brand: 'Hacendado' },
        '8480000300038': { barcode: '8480000300038', name: 'Arroz Redondo Extra (1 kg)', nameEn: 'Round Rice Extra (1 kg)', category: 'Cereales y Pasta', defaultLocation: 'pantry', shelfLifeDays: 365, estimatedPrice: 1.35, unit: 'kg', defaultQuantity: 1, brand: 'Hacendado' },
        '8480000400045': { barcode: '8480000400045', name: 'Tomate Frito Estilo Casero (350 g)', nameEn: 'Fried Tomato Sauce (350 g)', category: 'Conservas', defaultLocation: 'pantry', shelfLifeDays: 180, estimatedPrice: 1.15, unit: 'ud', defaultQuantity: 1, brand: 'Hacendado' },
        '8480000500052': { barcode: '8480000500052', name: 'Pechuga de Pollo Fileteada (500 g)', nameEn: 'Sliced Chicken Breast (500 g)', category: 'Carnicería', defaultLocation: 'fridge', shelfLifeDays: 4, estimatedPrice: 3.85, unit: 'g', defaultQuantity: 500, brand: 'Mercadona' },
        '8480000600069': { barcode: '8480000600069', name: 'Yogur Griego Natural (Pack 4x125g)', nameEn: 'Natural Greek Yogurt (4x125g)', category: 'Lácteos', defaultLocation: 'fridge', shelfLifeDays: 14, estimatedPrice: 1.60, unit: 'pack', defaultQuantity: 1, brand: 'Hacendado' },
        '8480000700076': { barcode: '8480000700076', name: 'Aceite de Oliva Virgen Extra (1L)', nameEn: 'Extra Virgin Olive Oil (1L)', category: 'Aceites y Condimentos', defaultLocation: 'pantry', shelfLifeDays: 360, estimatedPrice: 7.95, unit: 'L', defaultQuantity: 1, brand: 'Hacendado' },
        '8480000800083': { barcode: '8480000800083', name: 'Atún Claro en Aceite de Oliva (Pack 3x80g)', nameEn: 'Light Tuna in Olive Oil (3x80g)', category: 'Conservas', defaultLocation: 'pantry', shelfLifeDays: 730, estimatedPrice: 2.75, unit: 'pack', defaultQuantity: 1, brand: 'Hacendado' },
        '8480000900090': { barcode: '8480000900090', name: 'Lentejas Pardinas Secas (1 kg)', nameEn: 'Brown Lentils (1 kg)', category: 'Legumbres', defaultLocation: 'pantry', shelfLifeDays: 540, estimatedPrice: 1.85, unit: 'kg', defaultQuantity: 1, brand: 'Hacendado' },
        '8480001000103': { barcode: '8480001000103', name: 'Espinacas Frescas Lavadas (300 g)', nameEn: 'Fresh Washed Spinach (300 g)', category: 'Verduras', defaultLocation: 'fridge', shelfLifeDays: 5, estimatedPrice: 1.29, unit: 'g', defaultQuantity: 300, brand: 'Florette' },
        '8480001100110': { barcode: '8480001100110', name: 'Guisantes Finos Congelados (1 kg)', nameEn: 'Fine Frozen Peas (1 kg)', category: 'Congelados', defaultLocation: 'freezer', shelfLifeDays: 365, estimatedPrice: 1.55, unit: 'kg', defaultQuantity: 1, brand: 'Hacendado' },
        '8480001200127': { barcode: '8480001200127', name: 'Queso Gouda en Lonchas (200 g)', nameEn: 'Sliced Gouda Cheese (200 g)', category: 'Lácteos', defaultLocation: 'fridge', shelfLifeDays: 20, estimatedPrice: 1.75, unit: 'g', defaultQuantity: 200, brand: 'Hacendado' },
      };

      if (LOCAL_BARCODES[code]) {
        setDetectedItem(LOCAL_BARCODES[code]);
      } else {
        setDetectedItem({
          barcode: code,
          name: `Alimento (#${code.slice(-4)})`,
          nameEn: `Food Item (#${code.slice(-4)})`,
          category: 'Despensa',
          defaultLocation: 'pantry',
          shelfLifeDays: 14,
          estimatedPrice: 1.50,
          unit: 'ud',
          defaultQuantity: 1,
        });
      }
    } finally {
      setIsSearching(false);
    }
  };

  // Add detected item to pantry
  const handleConfirmAdd = () => {
    if (!detectedItem) return;

    const shelfDays = detectedItem.shelfLifeDays || 14;
    const expDate = new Date();
    expDate.setDate(expDate.getDate() + shelfDays);

    const newItemData = {
      name: isEs ? detectedItem.name : detectedItem.nameEn || detectedItem.name,
      category: detectedItem.category,
      quantity: detectedItem.defaultQuantity || 1,
      unit: (detectedItem.unit as any) || 'ud',
      location: (detectedItem.defaultLocation as StorageLocation) || 'pantry',
      expirationDate: expDate.toISOString().split('T')[0],
      estimatedPrice: detectedItem.estimatedPrice || 1.5,
      barcode: detectedItem.barcode,
      brand: detectedItem.brand || '',
    };

    addPantryItem(newItemData);
    setSuccessMessage(t.pantry.barcodeModal.addToPantrySuccess);

    setTimeout(() => {
      setSuccessMessage(null);
      setDetectedItem(null);
      onClose();
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-[#FFFEFC] w-full max-w-lg rounded-3xl shadow-2xl border border-[#F2E8D9] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between p-4 px-6 border-b border-[#F2E8D9] bg-[#FFF9F0]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#654735] text-[#FFF9F0] flex items-center justify-center shadow-xs">
              <Barcode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#654735] leading-tight">
                {t.pantry.barcodeModal.title}
              </h2>
              <p className="text-xs text-[#9A765B]">{t.pantry.barcodeModal.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#9A765B] hover:text-[#654735] hover:bg-[#F2E8D9] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Success Flash */}
          {successMessage && (
            <div className="p-4 bg-[#EAF2E8] border border-[#A8B89A] text-[#3D5A2B] rounded-2xl flex items-center gap-3 animate-in zoom-in-95">
              <CheckCircle2 className="w-6 h-6 shrink-0 text-[#6C8B56]" />
              <p className="text-sm font-semibold">{successMessage}</p>
            </div>
          )}

          {/* Camera Viewfinder Area */}
          <div className="relative rounded-2xl overflow-hidden bg-[#2D1F17] aspect-video flex flex-col items-center justify-center border-2 border-dashed border-[#E5D5C5] shadow-inner">
            <video
              ref={videoRef}
              className={`w-full h-full object-cover ${cameraActive ? 'block' : 'hidden'}`}
              playsInline
              muted
            />

            {cameraActive && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                {/* Scanner Target Box with Laser Line */}
                <div className="w-3/4 h-1/2 border-2 border-[#F4E3A5] rounded-xl relative shadow-[0_0_15px_rgba(244,227,165,0.4)]">
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-red-500 shadow-[0_0_8px_#ef4444] animate-pulse"></div>
                  <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] uppercase font-bold tracking-wider text-[#F4E3A5] bg-[#2D1F17]/80 px-2 py-0.5 rounded">
                    {isEs ? 'Alinea el código' : 'Align Barcode'}
                  </span>
                </div>
              </div>
            )}

            {!cameraActive && (
              <div className="p-6 text-center text-[#FFF9F0] space-y-2">
                <Camera className="w-10 h-10 mx-auto text-[#F4E3A5] opacity-80" />
                <p className="text-xs text-[#E5D5C5] max-w-xs mx-auto">
                  {cameraError || (isEs ? 'Cámara no activa. Puedes usar los códigos de prueba o escribir uno.' : 'Camera inactive. Try the test codes or enter a barcode.')}
                </p>
                <button
                  type="button"
                  onClick={startCamera}
                  className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#FFF9F0] text-[#654735] text-xs font-bold hover:bg-[#F2E8D9] transition-colors shadow-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  {isEs ? 'Reintentar cámara' : 'Retry camera'}
                </button>
              </div>
            )}
          </div>

          {/* Detected Item Card */}
          {detectedItem && (
            <div className="p-4 rounded-2xl bg-[#FFF9F0] border-2 border-[#A8B89A] space-y-3 animate-in fade-in">
              <div className="flex items-start justify-between">
                <div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#6C8B56] bg-[#EAF2E8] px-2.5 py-0.5 rounded-full mb-1">
                    <Sparkles className="w-3 h-3" />
                    {t.pantry.barcodeModal.itemDetected}
                  </span>
                  <h4 className="text-base font-bold text-[#654735]">
                    {isEs ? detectedItem.name : detectedItem.nameEn || detectedItem.name}
                  </h4>
                  <p className="text-xs text-[#9A765B]">
                    {detectedItem.category} • {detectedItem.defaultLocation === 'fridge' ? '❄️ Nevera' : detectedItem.defaultLocation === 'freezer' ? '🧊 Congelador' : '🥫 Despensa'}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-base font-extrabold text-[#654735]">
                    {detectedItem.estimatedPrice?.toFixed(2)} €
                  </span>
                  <p className="text-[10px] text-[#9A765B]">
                    {t.pantry.barcodeModal.shelfLifeNote.replace('{days}', String(detectedItem.shelfLifeDays))}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleConfirmAdd}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-[#654735] text-[#FFF9F0] font-bold text-sm hover:bg-[#533726] shadow-md transition-all active:scale-98 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#A8B89A]" />
                  {isEs ? 'Añadir a mi Despensa' : 'Add to my Pantry'}
                </button>
                <button
                  type="button"
                  onClick={() => setDetectedItem(null)}
                  className="py-2.5 px-3 rounded-xl border border-[#E5D5C5] text-[#9A765B] font-semibold text-xs hover:bg-[#F2E8D9]"
                >
                  {t.common.cancel}
                </button>
              </div>
            </div>
          )}

          {/* Sample Supermarket Barcodes */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-[#654735] block">
              {t.pantry.barcodeModal.demoCodesTitle}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {sampleBarcodes.map((sample) => (
                <button
                  key={sample.code}
                  type="button"
                  onClick={() => handleCodeLookup(sample.code)}
                  className="text-left p-2.5 rounded-xl border border-[#F2E8D9] bg-[#FFFEFC] hover:border-[#654735] hover:bg-[#FFF9F0] transition-colors flex items-center justify-between text-xs font-medium text-[#654735] group"
                >
                  <span className="truncate">{sample.label}</span>
                  <span className="text-[10px] text-[#9A765B] font-mono group-hover:text-[#654735] ml-2">
                    {sample.code.slice(-5)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Manual Barcode Input */}
          <div className="pt-2 border-t border-[#F2E8D9] space-y-2">
            <label className="text-xs font-bold text-[#654735] block">
              {t.pantry.barcodeModal.manualInputLabel}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={manualCode}
                onChange={(e) => setManualCode(e.target.value)}
                placeholder={t.pantry.barcodeModal.manualInputPlaceholder}
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-[#E5D5C5] bg-[#FFFEFC] text-sm text-[#654735] focus:outline-none focus:ring-2 focus:ring-[#A8B89A] font-mono"
              />
              <button
                type="button"
                disabled={!manualCode || isSearching}
                onClick={() => handleCodeLookup(manualCode)}
                className="px-4 py-2.5 rounded-xl bg-[#654735] text-[#FFF9F0] text-xs font-bold hover:bg-[#533726] disabled:opacity-50 transition-colors shrink-0"
              >
                {isSearching ? t.common.loading : t.pantry.barcodeModal.scanBtn}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#FFF9F0] border-t border-[#F2E8D9] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl border border-[#E5D5C5] text-xs font-bold text-[#654735] hover:bg-[#F2E8D9] transition-colors"
          >
            {t.pantry.barcodeModal.close}
          </button>
        </div>
      </div>
    </div>
  );
};
