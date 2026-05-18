import { useState } from 'react';
import { usePostHog } from '@posthog/react';
import DownloadIcon from '@/shared/assets/icons/download.svg?react';
import { Button } from '@/shared/ui';
import { createBannersZip } from '@/shared/lib/zip-utils';
import { getActiveFiltersSnapshot } from '@/shared/lib/analytics';
import type { StageRefs } from './BannerList';

interface BannerItemData {
  id: string;
  title?: string | null;
  image?: {
    responsiveImage?: {
      width: number;
      height: number;
    } | null;
  } | null;
}

interface DownloadAllButtonProps {
  data: BannerItemData[];
  stageRefs: StageRefs;
  promoCodes: string[];
  className?: string;
}

export const DownloadAllButton = ({ data, stageRefs, promoCodes, className = '' }: DownloadAllButtonProps) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const posthog = usePostHog();

  const handleDownloadAll = async () => {
    if (data.length === 0) return;

    setIsDownloading(true);

    try {
      await createBannersZip(data, stageRefs, promoCodes);
      posthog?.capture('banners_zip_downloaded', {
        banner_count: data.length,
        promocode_count: promoCodes.length,
        banner_titles: data.map((b) => b.title ?? null),
        ...getActiveFiltersSnapshot(),
      });
    } catch (error) {
      console.error('Download failed:', error);
      posthog?.captureException(error);
    } finally {
      setIsDownloading(false);
    }
  };

  if (data.length === 0) {
    return null;
  }

  return (
    <div className={`text-center ${className}`}>
      <Button
        onClick={handleDownloadAll}
        disabled={isDownloading}
        icon={<DownloadIcon className='md:w-auto md:h-auto w-4 h-4'/>}
      >
        {isDownloading ? 'Creating Archive...' : 'Download ALL'}
      </Button>
    </div>
  );
};
