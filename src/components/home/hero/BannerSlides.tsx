
import { BannerType } from './types';
import BannerImage from "@/components/hero/BannerImage";
import { getGradientStyle } from '@/utils/gradientStyles';

interface BannerSlidesProps {
  slides: BannerType[];
  activeIndex: number;
  previousIndex: number | null;
  onVideoDurationChange?: (index: number, duration: number) => void;
}

export default function BannerSlides({ 
  slides, 
  activeIndex, 
  previousIndex,
  onVideoDurationChange
}: BannerSlidesProps) {

  return (
    <div className="relative w-full h-full">
      {slides.map((banner, index) => {
        const isActive = index === activeIndex;
        const isPrevious = index === previousIndex;
        
        return (
          <div
            key={banner.id}
            className={`absolute inset-0 w-full h-full transition-transform duration-500 ease-out ${
              isActive ? "translate-y-0 z-10" : 
              isPrevious ? "-translate-y-full z-0 hidden" : "translate-y-full z-0 hidden"
            }`}
          >
            {banner.type === 'color' || banner.image.startsWith('from-') || banner.image.includes('gradient') ? (
              <div 
                className="w-full h-full" 
                style={getGradientStyle(banner.image)}
              />
            ) : (
              <BannerImage
                src={banner.image}
                alt={banner.alt || "Banner image"}
                type={banner.type} // "image" or "video"
                isActive={isActive}
                className="w-full h-full object-cover"
                onVideoDurationChange={(duration) => onVideoDurationChange?.(index, duration)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
