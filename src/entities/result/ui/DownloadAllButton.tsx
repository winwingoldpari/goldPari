import { useState } from 'react';
import DownloadIcon from '@/shared/assets/icons/download.svg?react';
import { Button } from '@/shared/ui';
import { createBannersZip } from '@/shared/lib/zip-utils';

interface BannerItemData {
  id: string;
  title: string;
  image?: {
    responsiveImage?: {
      width: number;
      height: number;
    };
  };
}

interface DownloadAllButtonProps {
  data: BannerItemData[];
  stageRefs: { [key: string]: any };
  promoCodes: string[];
}

export const DownloadAllButton = ({ data, stageRefs, promoCodes }: DownloadAllButtonProps) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadAll = async () => {
    if (data.length === 0) return;

    setIsDownloading(true);
    
    try {
      await createBannersZip(data, stageRefs, promoCodes);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  if (data.length === 0) {
    return null;
  }

  return (
    <div className="text-center">
      <Button
        onClick={handleDownloadAll}
        disabled={isDownloading}
        icon={<DownloadIcon />}
      >
        {isDownloading ? 'Creating Archive...' : 'Download ALL'}
      </Button>
    </div>
  );
};
