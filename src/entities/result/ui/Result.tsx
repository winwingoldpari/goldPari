import { useState } from 'react';
import { Title } from '@/shared/ui';
import { BannerList } from './BannerList';
import { DownloadAllButton } from './DownloadAllButton';

interface BannerItem {
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
  category?: {
    id: string;
    title: string;
  };
  loc?: {
    id: string;
    title: string;
  };
}

export const Result = ({ data, promocode }: { data: BannerItem[]; promocode: string }) => {
  const [stageRefs, setStageRefs] = useState<{ [key: string]: any }>({});

  const handleStageRefs = (refs: { [key: string]: any }) => {
    setStageRefs(refs);
  };

  return (
    <div className="relative overflow-hidden bg-[linear-gradient(90deg,#232121_0%,#000_100%)] rounded-[40px] flex flex-col md:p-14 p-6 justify-center mt-16">
      <Title
        descriptionBg="gradient"
        title={data.length ? 'RESULTS' : 'No RESULTS'}
        description={data.length ? 'Download the banners' : 'fill the filter'}
      />
      
      <BannerList 
        data={data} 
        promocode={promocode} 
        onStageRefs={handleStageRefs}
      />
      
      <DownloadAllButton 
        data={data} 
        stageRefs={stageRefs}
      />
    </div>
  );
};
