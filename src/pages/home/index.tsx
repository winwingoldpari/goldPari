import { useState } from 'react';
import { Container, Loading, Title } from '@/shared/ui';
import { Result } from '@/entities/result';
import { useCasinos, useSports, useUniversals } from '@/shared/hooks';
import { BgRound } from '@/shared/ui/bg-round/bg-round';
import type { BannerEntry } from '@/shared/store/app-store';
import type { Mode } from './model/types';
import { useHomeModes } from './model/useHomeModes';
import { useUrlSyncedFilters } from './model/useUrlSyncedFilters';
import { HomeFilterPanel } from './ui/HomeFilterPanel';

type BannerWithKind = BannerEntry & { kind: Mode };

export default function HomePage() {
  const { modes } = useHomeModes();
  const [promocode, setPromocode] = useState<string>('');
  const [promocodeEnabled, setPromocodeEnabled] = useState<boolean>(true);

  useUrlSyncedFilters({
    promocode,
    setPromocode,
    promocodeEnabled,
    setPromocodeEnabled,
  });

  const { casinos, loading: casinosLoading } = useCasinos(modes.includes('casino'));
  const { sports, loading: sportsLoading } = useSports(modes.includes('sport'));
  const { universals, loading: universalsLoading } = useUniversals(modes.includes('universal'));

  const data: BannerWithKind[] = [
    ...(modes.includes('casino') ? casinos.map((c) => ({ ...c, kind: 'casino' as const })) : []),
    ...(modes.includes('sport') ? sports.map((s) => ({ ...s, kind: 'sport' as const })) : []),
    ...(modes.includes('universal') ? universals.map((u) => ({ ...u, kind: 'universal' as const })) : []),
  ];

  const loading = casinosLoading || sportsLoading || universalsLoading;
  const filtersApplied = modes.length > 0;

  return (
    <section className="w-full flex flex-col relative 2xl:mt-60 xl:mt-48 md:mt-40 mt-25.5">
      <BgRound className="absolute md:-top-16 -top-14 right-0 md:left-0 -left-44 bottom-0 mx-auto" />
      <BgRound className="absolute 2xl:top-[866px] md:top-[666px] top-[140px] 2xl:-right-[600px] md:-right-[400px] -right-[200px]" />
      <BgRound className="absolute 2xl:top-[1266px] md:top-[1266px] top-[400px] 2xl:-left-[600px] md:-left-[400px] -left-50" />
      <Container>
        <Title title="Ad Creator" />
        <HomeFilterPanel
          modes={modes}
          promocode={promocode}
          onPromocodeChange={setPromocode}
          promocodeEnabled={promocodeEnabled}
          onPromocodeEnabledChange={setPromocodeEnabled}
        />
        {loading ? (
          <Loading />
        ) : (
          <Result
            data={data}
            promocode={promocode}
            promocodeEnabled={promocodeEnabled}
            filtersApplied={filtersApplied}
          />
        )}
      </Container>
    </section>
  );
}
