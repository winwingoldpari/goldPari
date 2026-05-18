import LoaderIcon from '@/shared/assets/loader.svg?react';

export const Loading = () => (
  <div>
    <div className="my-20 flex items-center justify-center">
      <LoaderIcon className="origin-center animate-[spin_2.5s_linear_infinite]" />
    </div>
  </div>
);
