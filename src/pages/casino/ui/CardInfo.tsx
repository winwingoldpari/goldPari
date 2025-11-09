import { ChipsGroup, CustomSelect } from '@/shared/ui';
import { Input } from '@/shared/ui/input/Input';
import { useState } from 'react';
import imageUrl from "@/shared/assets/Wheel.png";
import { useFilters } from '@/shared/hooks';

export const CardInfo = ({ onPromocodeChange }: { onPromocodeChange: (promocode: string) => void }) => {
  const [promocode, setPromocode] = useState<string>('');
  const { 
    categories, 
    locations,
    selectedLocation, 
    setSelectedCategory, 
    setSelectedLocation 
  } = useFilters();

  const handlePromocodeChange = (value: string) => {
    setPromocode(value);
    onPromocodeChange(value);
  };
  return (
    <div className='mt-8 relative overflow-hidden bg-[linear-gradient(90deg,#232121_0%,#000_100%)]  rounded-[40px] flex lg:flex-row flex-col'>
      <div className="lg:w-1/2 relative shrink-0">
        <img src={imageUrl} className='absolute -bottom-[200px] left-0 w-full lg:block hidden max-w-[616px] right-0 mx-auto'/>
        <div className="uppercase md:text-[100px] text-[80px] text-white font-black text-center mt-2" style={{fontFamily: "Climate Crisis, sans-serif"}}>Casino</div>
      </div>
      <div className="flex flex-col md:gap-12 gap-8 flex-1 lg:w-1/2 lg:py-12 lg:pr-16">
        <ChipsGroup 
          label='Choose banner category'
          options={[
            ...categories.map((cat: { id: string; title: string }) => ({ label: cat.title, value: cat.id }))
          ]}
          onChange={(v) => setSelectedCategory(Array.isArray(v) ? String(v[0] || '') || null : String(v || '') || null)}
        />
        <div className="flex flex-col md:gap-6 gap-4">
          <div className="md:text-[32px] text-xl text-white font-medium leading-[100%]">Choose the GEO</div>
          <CustomSelect
            options={[
              ...locations.map((loc: { id: string; title: string }) => ({ label: loc.title, value: loc.id }))
            ]}
            placeholder="Select"
            value={selectedLocation || ''}
            onChange={(value) => setSelectedLocation(value ? String(value) : null)}
          />
        </div>
        <div className="flex flex-col md:gap-6 gap-4">
          <div className="md:text-[32px] text-xl text-white font-medium leading-[100%]">Enter the promocode</div>
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