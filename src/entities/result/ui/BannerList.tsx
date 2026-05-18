import { useRef } from 'react';
import type Konva from 'konva';
import type { MobcashEntry } from '@/shared/store/app-store';
import { useAppStore } from '@/shared/store';
import { MOBCASH_CATEGORY_NAME } from '@/shared/lib/mobcash';
import { isEventsCategory } from '@/shared/lib/event';
import { getEventCopy } from '@/shared/lib/event-i18n';
import { BannerItem } from './BannerItem';

export type StageRefs = Record<string, Konva.Stage>;

interface BannerItemData {
  id: string;
  title?: string | null;
  kind?: 'casino' | 'sport' | 'universal';
  _publishedAt?: string | null;
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

interface BannerListProps {
  data: BannerItemData[];
  promocode: string;
  promoCodes: string[];
  promocodeEnabled?: boolean;
  language?: string | null;
  mobcashEntry?: MobcashEntry | null;
  onStageRefs: (refs: StageRefs) => void;
}

export const BannerList = ({
  data,
  promocode,
  promoCodes,
  promocodeEnabled = true,
  language = null,
  mobcashEntry = null,
  onStageRefs,
}: BannerListProps) => {
  const stageRefs = useRef<StageRefs>({});
  const eventCopies = useAppStore((s) => s.eventCopies);

  const handleStageRef = (id: string, ref: Konva.Stage) => {
    stageRefs.current[id] = ref;
    onStageRefs(stageRefs.current);
  };

  if (data.length === 0) {
    return null;
  }

  const eventCopy = getEventCopy(language, eventCopies);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full my-12">
      {data.map((item) => {
        const categoryTitle = item.category?.title ?? null;
        const isMobcash = categoryTitle?.toLowerCase() === MOBCASH_CATEGORY_NAME;
        const isEvents = isEventsCategory(categoryTitle);
        return (
          <BannerItem
            key={item.id}
            id={item.id}
            title={item.title}
            image={item.image}
            publishedAt={item._publishedAt}
            promocode={promocode}
            promoCodes={promoCodes}
            promocodeEnabled={promocodeEnabled}
            language={language}
            isMobcash={isMobcash}
            mobcashEntry={isMobcash ? mobcashEntry : null}
            isEvents={isEvents}
            eventCopy={isEvents ? eventCopy : null}
            onStageRef={handleStageRef}
          />
        );
      })}
    </div>
  );
};
