import DownloadIcon from '@/shared/assets/icons/download.svg?react'
import { Stage, Layer, Image, Text } from 'react-konva';
import { useRef, useEffect, useState, useLayoutEffect, useCallback } from 'react';
import { loadImage } from '@/shared/lib/image-loader';
import { handleImageError, showSuccess } from '@/shared/lib/toast';
import { 
  calculateImageScale, 
  calculatePromoDimensions, 
  getTargetSize, 
  prepareContextsForHQ,
  createDataURL,
  MAX_EXPORT_RATIO
} from '@/shared/lib/konva-utils';

interface BannerItemProps {
  id: string;
  title: string;
  image?: {
    url: string;
    alt?: string;
    responsiveImage?: {
      width: number;
      height: number;
    };
  };
  promocode: string;
  promoCodes: string[];
  onStageRef: (id: string, ref: any) => void;
}

export const BannerItem = ({ 
  id, 
  title, 
  image, 
  promocode, 
  promoCodes,
  onStageRef 
}: BannerItemProps) => {
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);
  const [imageScale, setImageScale] = useState({ scaleX: 1, scaleY: 1, x: 0, y: 0 });
  const [stageSize, setStageSize] = useState(400);
  const [promoDims, setPromoDims] = useState({ w: 0, h: 0 });

  const stageRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const promoTextRef = useRef<any>(null);

  const { promoFontSize, bottomPad } = calculatePromoDimensions(stageSize);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const setIfChanged = (next: number) => {
      setStageSize((prev) => (prev !== next ? next : prev));
    };

    setIfChanged(el.offsetWidth);

    let raf = 0;
    const schedule = (next: number) => {
      if (raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setIfChanged(next));
    };

    let ro: ResizeObserver | null = null;
    const hasWindow = typeof window !== 'undefined';
    if (hasWindow && 'ResizeObserver' in window) {
      ro = new ResizeObserver((entries) => {
        const entry = entries[0];
        const width = Math.round(entry.contentRect.width);
        schedule(width);
      });
      ro.observe(el);
    } else if (hasWindow) {
      const onResize = () => setIfChanged(el.offsetWidth);
      window.addEventListener('resize', onResize);
      return () => {
        window.removeEventListener('resize', onResize);
      };
    } else {
      return;
    }

    return () => {
      if (raf) cancelAnimationFrame(raf);
      ro?.disconnect();
    };
  }, []);

  useEffect(() => {
    if (image?.url) {
      const loadImageAsync = async () => {
        try {
          const img = await loadImage(image.url);
          setImageElement(img);
        } catch (error) {
          console.error('Failed to load image:', image.url, error);
          handleImageError(error, image.url);
        }
      };
      
      loadImageAsync();
    }
  }, [image?.url]);

  useEffect(() => {
    if (imageElement && stageSize > 0) {
      const scale = calculateImageScale(imageElement, stageSize);
      setImageScale((prev) => (
        prev.scaleX !== scale.scaleX ||
        prev.scaleY !== scale.scaleY ||
        prev.x !== scale.x ||
        prev.y !== scale.y
          ? scale
          : prev
      ));
    }
  }, [imageElement, stageSize]);

  const latestOnStageRef = useRef(onStageRef);
  useEffect(() => {
    latestOnStageRef.current = onStageRef;
  }, [onStageRef]);

  const setStageNode = useCallback((node: any) => {
    stageRef.current = node;
    if (node) {
      latestOnStageRef.current(id, node);
    }
  }, [id]);

  useLayoutEffect(() => {
    if (!promoTextRef.current) return;

    const node = promoTextRef.current as any;

    const w = node.width();
    const h = node.height();
    setPromoDims((prev) => (prev.w !== w || prev.h !== h ? { w, h } : prev));

    node.getLayer()?.batchDraw();
  }, [promocode, promoFontSize]);

  const sanitizeFilePart = (value: string) =>
    value.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 40);

  const createFileName = (code: string | null, index: number, total: number) => {
    if (total <= 1) {
      return `${title}-banner.png`;
    }
    const titleSafe = sanitizeFilePart(title) || 'banner';
    const codeSafe = code ? sanitizeFilePart(code) : '';
    const codePart = codeSafe ? `_${codeSafe}` : '';
    return `${titleSafe}_${index + 1}${codePart}.png`;
  };

  const capturePromoState = () => {
    const node = promoTextRef.current as any;
    if (!node) return null;

    return {
      text: node.text(),
      offsetX: node.offsetX(),
      y: node.y(),
      visible: node.visible(),
    };
  };

  const applyPromoText = (code: string | null) => {
    const node = promoTextRef.current as any;
    if (!node) return;

    const nextText = code ?? '';
    node.text(nextText);
    const w = node.width();
    const h = node.height();
    node.offsetX(w / 2);
    node.y(stageSize - bottomPad - h);
    node.visible(Boolean(nextText));
    node.getLayer()?.batchDraw();
  };

  const restorePromoState = (state: { text: string; offsetX: number; y: number; visible: boolean } | null) => {
    const node = promoTextRef.current as any;
    if (!node || !state) return;
    node.text(state.text);
    node.offsetX(state.offsetX);
    node.y(state.y);
    node.visible(state.visible);
    node.getLayer()?.batchDraw();
  };

  const handleDownload = () => {
    if (!stageRef.current) return;

    prepareContextsForHQ(stageRef.current);

    const { w: targetW } = getTargetSize(imageElement, image?.responsiveImage);
    const pixelRatio = Math.max(1, Math.min(MAX_EXPORT_RATIO, targetW / stageSize));

    const codes = promoCodes.length > 0 ? promoCodes : (promocode ? [promocode] : []);
    const total = codes.length || 1;

    if (codes.length <= 1) {
      const dataURL = createDataURL(stageRef.current, pixelRatio);
      const link = document.createElement('a');
      link.download = createFileName(codes[0] ?? null, 0, total);
      link.href = dataURL;
      link.click();
      showSuccess(`Banner "${title}" downloaded successfully!`);
      return;
    }

    const original = capturePromoState();

    codes.forEach((code, index) => {
      applyPromoText(code);
      const dataURL = createDataURL(stageRef.current, pixelRatio);
      const link = document.createElement('a');
      link.download = createFileName(code, index, total);
      link.href = dataURL;
      link.click();
    });

    restorePromoState(original);
    showSuccess(`Downloaded ${codes.length} banners for "${title}"!`);
  };

  return (
    <div ref={containerRef} className="relative aspect-square w-full">
      <Stage 
        ref={setStageNode} 
        width={stageSize} 
        height={stageSize} 
        className="w-full h-full rounded-2xl overflow-hidden"
      >
        <Layer>
          {imageElement && (
            <Image
              image={imageElement}
              x={imageScale.x}
              y={imageScale.y}
              scaleX={imageScale.scaleX}
              scaleY={imageScale.scaleY}
            />
          )}

          <Text
            ref={promoTextRef}
            name="promo-text"
            text={promocode}
            x={stageSize / 2}
            y={stageSize - bottomPad - promoDims.h}
            fontSize={promoFontSize}
            fontFamily='Montserrat'
            fontStyle="800"
            fill="#000"
            align="center"
            offsetX={promoDims.w / 2}
            offsetY={0}
            visible={Boolean(promocode)}
          />
        </Layer>
      </Stage>

      <button
        type="button"
        className="absolute right-3 top-3 border-none outline-0 2xl:p-1.5 bg-yellow-100 rounded-xl hover:bg-green-200 transition-colors"
        aria-label={`Download banner for ${title}`}
        onClick={handleDownload}
      >
        <DownloadIcon className="w-12 h-12" />
      </button>
    </div>
  );
};
