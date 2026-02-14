import { useRef } from 'react';
import { BannerItem } from './BannerItem';

interface BannerItemData {
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
}

interface BannerListProps {
  data: BannerItemData[];
  promocode: string;
  promoCodes: string[];
  onStageRefs: (refs: { [key: string]: any }) => void;
}

export const BannerList = ({ data, promocode, promoCodes, onStageRefs }: BannerListProps) => {
  const stageRefs = useRef<{ [key: string]: any }>({});

  const handleStageRef = (id: string, ref: any) => {
    stageRefs.current[id] = ref;
    onStageRefs(stageRefs.current);
  };

  if (data.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full my-12">
      {data.map((item) => (
        <BannerItem
          key={item.id}
          id={item.id}
          title={item.title}
          image={item.image}
          promocode={promocode}
          promoCodes={promoCodes}
          onStageRef={handleStageRef}
        />
      ))}
    </div>
  );
};
