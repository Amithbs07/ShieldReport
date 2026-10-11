import React, { useRef, useState, useEffect } from 'react';
import { ShieldCheck, Undo2, RotateCcw, Check, X, EyeOff, ZoomIn, ZoomOut } from 'lucide-react';

interface RedactionBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface DocumentRedactorProps {
  imageSrc: string;
  fileName: string;
  onSave: (sanitizedDataUrl: string) => void;
  onClose: () => void;
}

export const DocumentRedactor: React.FC<DocumentRedactorProps> = ({
  imageSrc,
  fileName,
  onSave,
  onClose
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [boxes, setBoxes] = useState<RedactionBox[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [currentBox, setCurrentBox] = useState<RedactionBox | null>(null);
  const [imgElement, setImgElement] = useState<HTMLImageElement | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  // Load Image into an HTMLImageElement
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setImgElement(img);
    };
    img.src = imageSrc;
  }, [imageSrc]);

  // Redraw canvas whenever imgElement, boxes, or currentBox change
  useEffect(() => {
    if (!canvasRef.current || !imgElement) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Match canvas dimensions to actual image dimensions
    canvas.width = imgElement.naturalWidth || imgElement.width || 800;
    canvas.height = imgElement.naturalHeight || imgElement.height || 600;

    // 1. Draw base image
    ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);

    // 2. Draw all existing blackout boxes
    ctx.fillStyle = '#05070A';
    boxes.forEach((box: RedactionBox) => {
      ctx.fillRect(box.x, box.y, box.w, box.h);
      // Subtle security border
      ctx.strokeStyle = '#2997FF';
      ctx.lineWidth = 2;
      ctx.strokeRect(box.x, box.y, box.w, box.h);
    });

    // 3. Draw active drawing box preview
    if (currentBox) {
      ctx.fillStyle = 'rgba(5, 7, 10, 0.85)';
      ctx.fillRect(currentBox.x, currentBox.y, currentBox.w, currentBox.h);
      ctx.strokeStyle = '#FF3B30';
      ctx.lineWidth = 2;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(currentBox.x, currentBox.y, currentBox.w, currentBox.h);
      ctx.setLineDash([]);
    }
  }, [imgElement, boxes, currentBox]);

  // Calculate mouse position relative to canvas coordinate space
  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const coords = getCanvasCoords(e);
    setIsDrawing(true);
    setStartPos(coords);
    setCurrentBox({ x: coords.x, y: coords.y, w: 0, h: 0 });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !startPos) return;
    const coords = getCanvasCoords(e);

    const x = Math.min(startPos.x, coords.x);
    const y = Math.min(startPos.y, coords.y);
    const w = Math.abs(coords.x - startPos.x);
    const h = Math.abs(coords.y - startPos.y);

    setCurrentBox({ x, y, w, h });
  };

  const handleMouseUp = () => {
    if (isDrawing && currentBox && currentBox.w > 5 && currentBox.h > 5) {
      setBoxes((prev: RedactionBox[]) => [...prev, currentBox]);
    }
    setIsDrawing(false);
    setStartPos(null);
    setCurrentBox(null);
  };

  const handleUndo = () => {
    setBoxes((prev: RedactionBox[]) => prev.slice(0, -1));
  };

  const handleReset = () => {
    setBoxes([]);
  };

  const handleApply = () => {
    if (!canvasRef.current || !imgElement) return;
    const canvas = document.createElement('canvas');
    canvas.width = imgElement.naturalWidth || 800;
    canvas.height = imgElement.naturalHeight || 600;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw base image
    ctx.drawImage(imgElement, 0, 0, canvas.width, canvas.height);

    // Burn solid pitch-black pixels irreversibly into canvas (no border, solid fill)
    ctx.fillStyle = '#000000';
    boxes.forEach((box: RedactionBox) => {
      ctx.fillRect(box.x, box.y, box.w, box.h);
    });

    // Export permanently sanitized PNG
    const sanitizedDataUrl = canvas.toDataURL('image/png', 0.95);
    onSave(sanitizedDataUrl);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      <div className="bg-[#0B0F19] border border-white/10 rounded-3xl max-w-5xl w-full h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in duration-200">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-white/[0.08] flex items-center justify-between bg-black/40">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-shield-blue/20 flex items-center justify-center text-shield-blue">
              <EyeOff className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-semibold text-white tracking-tight">Client-Side Document Redaction & Blackout</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-shield-green/15 text-shield-green border border-shield-green/30">
                  Zero Data Leakage
                </span>
              </div>
              <p className="text-xs text-apple-gray-400 mt-0.5">
                Drag to redact names, employee IDs, signatures, or faces. Blacked-out pixels are irreversibly burned in memory before upload.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-apple-gray-400 hover:text-white p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Toolbar */}
        <div className="px-5 py-3 border-b border-white/[0.06] bg-black/20 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-apple-gray-400 font-mono text-[11px] uppercase mr-1">Controls:</span>
            <button
              onClick={handleUndo}
              disabled={boxes.length === 0}
              className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] disabled:opacity-30 text-white font-medium flex items-center space-x-1.5 transition-all"
            >
              <Undo2 className="w-3.5 h-3.5" />
              <span>Undo Box</span>
            </button>
            <button
              onClick={handleReset}
              disabled={boxes.length === 0}
              className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] disabled:opacity-30 text-alert-red font-medium flex items-center space-x-1.5 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Clear All ({boxes.length})</span>
            </button>
          </div>

          <div className="flex items-center space-x-3 font-mono text-[11px] text-apple-gray-400">
            <span>Target: <strong className="text-white">{fileName}</strong></span>
            <span>•</span>
            <div className="flex items-center space-x-1 bg-white/[0.04] rounded-lg p-0.5">
              <button 
                onClick={() => setZoomLevel((z: number) => Math.max(0.6, z - 0.2))} 
                className="p-1 hover:text-white text-apple-gray-400"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="px-1 text-[10px] text-white font-mono">{Math.round(zoomLevel * 100)}%</span>
              <button 
                onClick={() => setZoomLevel((z: number) => Math.min(2.0, z + 0.2))} 
                className="p-1 hover:text-white text-apple-gray-400"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Interactive Canvas Workspace */}
        <div className="flex-1 overflow-auto p-6 flex items-center justify-center bg-[#070A0F]/60 select-none">
          <div 
            className="relative border border-white/10 rounded-xl overflow-hidden shadow-2xl transition-transform"
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}
          >
            <canvas
              ref={canvasRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              className="max-h-[60vh] max-w-full object-contain cursor-crosshair block"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-white/[0.08] bg-black/40 flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs font-mono text-apple-gray-400">
            <ShieldCheck className="w-4 h-4 text-shield-green" />
            <span>Blacked-out areas cannot be reversed or recovered after applying.</span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-apple-gray-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-shield-blue hover:bg-blue-500 shadow-apple-glow flex items-center space-x-1.5 transition-all active:scale-95"
            >
              <Check className="w-4 h-4" />
              <span>Apply & Burn Redaction ({boxes.length} zones)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
