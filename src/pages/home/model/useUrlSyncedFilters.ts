import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppStore } from '@/shared/store';
import type { UploadDate } from '@/shared/lib/upload-date';

interface Args {
  promocode: string;
  setPromocode: (s: string) => void;
  promocodeEnabled: boolean;
  setPromocodeEnabled: (b: boolean) => void;
}

export const useUrlSyncedFilters = ({
  promocode,
  setPromocode,
  promocodeEnabled,
  setPromocodeEnabled,
}: Args) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const selectedCategory = useAppStore((s) => s.selectedCategory);
  const selectedCasinoType = useAppStore((s) => s.selectedCasinoType);
  const selectedCategorySport = useAppStore((s) => s.selectedCategorySport);
  const selectedSportType = useAppStore((s) => s.selectedSportType);
  const selectedUniversalCategory = useAppStore((s) => s.selectedUniversalCategory);
  const selectedCreativeFormat = useAppStore((s) => s.selectedCreativeFormat);
  const selectedLocation = useAppStore((s) => s.selectedLocation);
  const selectedFormat = useAppStore((s) => s.selectedFormat);
  const selectedUploadDate = useAppStore((s) => s.selectedUploadDate);
  const selectedLanguage = useAppStore((s) => s.selectedLanguage);

  const setSelectedCategory = useAppStore((s) => s.setSelectedCategory);
  const setSelectedCasinoType = useAppStore((s) => s.setSelectedCasinoType);
  const setSelectedCategorySport = useAppStore((s) => s.setSelectedCategorySport);
  const setSelectedSportType = useAppStore((s) => s.setSelectedSportType);
  const setSelectedUniversalCategory = useAppStore((s) => s.setSelectedUniversalCategory);
  const setSelectedCreativeFormat = useAppStore((s) => s.setSelectedCreativeFormat);
  const setSelectedLocation = useAppStore((s) => s.setSelectedLocation);
  const setSelectedFormat = useAppStore((s) => s.setSelectedFormat);
  const setSelectedUploadDate = useAppStore((s) => s.setSelectedUploadDate);
  const setSelectedLanguage = useAppStore((s) => s.setSelectedLanguage);

  const hydrated = useRef(false);

  // ONE-SHOT hydration on mount
  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;

    const multi = (key: string): string[] | null => {
      const arr = searchParams.getAll(key).filter((v) => v.length > 0);
      return arr.length > 0 ? arr : null;
    };
    const single = (key: string): string | null => {
      const v = searchParams.get(key);
      return v && v.length > 0 ? v : null;
    };

    setSelectedCategory(multi('cat'));
    setSelectedCasinoType(multi('cType'));
    setSelectedCategorySport(multi('sCat'));
    setSelectedSportType(multi('sType'));
    setSelectedUniversalCategory(multi('uCat'));
    setSelectedCreativeFormat(multi('cFmt'));
    setSelectedLocation(single('loc'));
    setSelectedFormat(single('fmt'));
    setSelectedUploadDate(single('up') as UploadDate | null);
    setSelectedLanguage(single('lang'));

    const promoUrl = single('promo');
    if (promoUrl !== null) setPromocode(promoUrl);
    if (searchParams.get('noPromo') === '1') setPromocodeEnabled(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reactive write-back
  useEffect(() => {
    if (!hydrated.current) return;
    const params = new URLSearchParams();

    // Preserve mode params (managed by useHomeModes)
    searchParams.getAll('mode').forEach((m) => params.append('mode', m));

    const writeMulti = (key: string, value: string[] | null) => {
      value?.forEach((v) => params.append(key, v));
    };
    const writeSingle = (key: string, value: string | null) => {
      if (value !== null && value !== '') params.set(key, value);
    };

    writeMulti('cat', selectedCategory);
    writeMulti('cType', selectedCasinoType);
    writeMulti('sCat', selectedCategorySport);
    writeMulti('sType', selectedSportType);
    writeMulti('uCat', selectedUniversalCategory);
    writeMulti('cFmt', selectedCreativeFormat);
    writeSingle('loc', selectedLocation);
    writeSingle('fmt', selectedFormat);
    writeSingle('up', selectedUploadDate);
    writeSingle('lang', selectedLanguage);

    if (promocode) params.set('promo', promocode);
    if (!promocodeEnabled) params.set('noPromo', '1');

    setSearchParams(params, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedCategory, selectedCasinoType, selectedCategorySport,
    selectedSportType, selectedUniversalCategory, selectedCreativeFormat,
    selectedLocation, selectedFormat, selectedUploadDate, selectedLanguage,
    promocode, promocodeEnabled,
  ]);
};
