import { useMemo, useState } from 'react';
import { Title } from '@/shared/ui';
import { BannerList, type StageRefs } from './BannerList';
import { DownloadAllButton } from './DownloadAllButton';
import { NoContent } from './NoContent';
import { parsePromocodes } from '@/shared/lib/promocode';
import { useFilters, useMobcashSheet, useEventCopiesSheet } from '@/shared/hooks';
import { findMobcashEntry } from '@/shared/lib/mobcash';
import { useAppStore } from '@/shared/store';

interface BannerItem {
  id: string;
  title?: string | null;
  kind?: 'casino' | 'sport' | 'universal';
  category?: {
    id: string;
    title?: string | null;
  } | null;
  image?: {
    url: string;
    alt?: string | null;
    responsiveImage?: {
      width: number;
      height: number;
    } | null;
  } | null;
}

interface ResultProps {
  data: BannerItem[];
  promocode: string;
  promocodeEnabled?: boolean;
  filtersApplied?: boolean;
}

export const Result = ({ data, promocode, promocodeEnabled = true, filtersApplied = true }: ResultProps) => {
  useMobcashSheet();
  useEventCopiesSheet();

  const [stageRefs, setStageRefs] = useState<StageRefs>({});
  const promoCodes = useMemo(() => parsePromocodes(promocode), [promocode]);
  const displayPromocode = promoCodes[0] ?? '';

  const { locations, selectedLocation } = useFilters();
  const mobcashEntries = useAppStore((s) => s.mobcashEntries);

  const language = useMemo(
    () => locations.find((l) => l.id === selectedLocation)?.title ?? null,
    [locations, selectedLocation],
  );

  const mobcashEntry = useMemo(
    () => findMobcashEntry(displayPromocode, mobcashEntries),
    [displayPromocode, mobcashEntries],
  );

  const handleStageRefs = (refs: StageRefs) => {
    setStageRefs(refs);
  };

  if (!filtersApplied || !data.length) {
    return (
      <NoContent />
    );
  }

  return (
    <div className="relative overflow-hidden bg-[linear-gradient(90deg,#232121_0%,#000_100%)] rounded-[20px] flex flex-col 2xl:py-12 md:py-10 2xl:px-15 md:px-9 p-6 justify-center md:mt-16 mt-10">
      <Title
        descriptionBg="gradient"
        title="CONTENT"
      />
      <DownloadAllButton
        data={data}
        stageRefs={stageRefs}
        promoCodes={promoCodes}
        className='md:hidden mt-2'
      />
      <BannerList
        data={data}
        promocode={displayPromocode}
        promoCodes={promoCodes}
        promocodeEnabled={promocodeEnabled}
        language={language}
        mobcashEntry={mobcashEntry}
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
