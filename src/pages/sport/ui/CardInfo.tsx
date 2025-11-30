import { ChipsGroup, CustomSelect } from '@/shared/ui';
import { Input } from '@/shared/ui/input/Input';
import { useState } from 'react';
import imageUrl from "@/shared/assets/ball.png";
import { useFilters } from '@/shared/hooks';

export const CardInfo = ({ onPromocodeChange }: { onPromocodeChange: (promocode: string) => void }) => {
  const [promocode, setPromocode] = useState<string>('');
  const {
    sportTypes,
    categorySports,
    locations,
    selectedLocation,
    setSelectedSportType,
    setSelectedCategory,
    setSelectedLocation
  } = useFilters();

  const handlePromocodeChange = (value: string) => {
    setPromocode(value);
    onPromocodeChange(value);
  };
  return (
    <div className='mt-8 relative overflow-hidden bg-[linear-gradient(90deg,#232121_0%,#000_100%)] rounded-[40px] flex lg:flex-row flex-col md:p-0 p-5'>
      <div className="lg:w-1/2 relative shrink-0">
        <img src={imageUrl} className='absolute 2xl:-bottom-[85px] -bottom-[230px] left-0 w-full lg:block hidden 2xl:max-w-[627px] max-w-[598px] right-0 mx-auto'/>
        <div className="uppercase 2xl:text-[100px] md:text-[60px] text-[40px] text-white font-black text-center lg:mt-4 mt-2" style={{fontFamily: "Climate Crisis, sans-serif"}}>Sport</div>
      </div>
      <div className="flex flex-col 2xl:gap-12 gap-6 flex-1 lg:w-1/2 2xl:py-12 lg:py-8 lg:pr-16 p-6">
        <ChipsGroup
          label='Choose sport type'
          options={[
            ...sportTypes.map((sport: { id: string; title: string }) => ({ label: sport.title, value: sport.id }))
          ]}
          onChange={(v) => setSelectedSportType(Array.isArray(v) ? String(v[0] || '') || null : String(v || '') || null)}
        />
        <ChipsGroup
          label='Choose banner category'
          options={[
            ...categorySports.map((category: { id: string; title: string }) => ({ label: category.title, value: category.id }))
          ]}
          onChange={(v) => setSelectedCategory(Array.isArray(v) ? String(v[0] || '') || null : String(v || '') || null)}
        />
        <div className="flex flex-col 2xl:gap-6 gap-4">
          <div className="2xl:text-[32px] text-xl text-white font-medium leading-[100%] uppercase">Choose the GEO</div>
          <CustomSelect
            options={locations.map((location: { id: string; title: string }) => ({ label: location.title, value: location.id }))}
            placeholder="Select"
            value={selectedLocation}
            onChange={(v) => setSelectedLocation(Array.isArray(v) ? String(v[0] || '') || null : String(v || '') || null)}
          />
        </div>
        <div className="flex flex-col 2xl:gap-6 gap-4">
          <div className="2xl:text-[32px] text-xl text-white font-medium leading-[100%] uppercase">Enter the promocode</div>
          <Input 
            placeholder='Type here'
            value={promocode}
            onChange={(e) => handlePromocodeChange(e.target.value)}
          />
        </div>  
      </div>
    </div>
  );
};