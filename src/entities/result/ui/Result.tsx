import { useMemo, useState } from 'react';
import { Title } from '@/shared/ui';
import { BannerList } from './BannerList';
import { DownloadAllButton } from './DownloadAllButton';
import { parsePromocodes } from '@/shared/lib/promocode';

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
  const promoCodes = useMemo(() => parsePromocodes(promocode), [promocode]);
  const displayPromocode = promoCodes[0] ?? '';

  const handleStageRefs = (refs: { [key: string]: any }) => {
    setStageRefs(refs);
  };

  return (
    <div className="relative overflow-hidden bg-[linear-gradient(90deg,#232121_0%,#000_100%)] rounded-[40px] flex flex-col 2xl:py-12 md:py-10 2xl:px-15 md:px-9 p-6 justify-center mt-16">
      <Title
        descriptionBg="gradient"
        title={data.length ? 'banners' : 'No RESULTS'}
        description={data.length ? '' : 'fill the filter'}
      />
      
      <BannerList 
        data={data} 
        promocode={displayPromocode} 
        promoCodes={promoCodes}
        onStageRefs={handleStageRefs}
      />
      
      <DownloadAllButton 
        data={data} 
        stageRefs={stageRefs}
        promoCodes={promoCodes}
      />
    </div>
  );
};
