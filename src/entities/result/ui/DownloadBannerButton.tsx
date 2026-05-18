import DownloadIcon from '@/shared/assets/icons/download.svg?react';

interface DownloadBannerButtonProps {
  title?: string | null;
  onClick: () => void;
}

export const DownloadBannerButton = ({ title, onClick }: DownloadBannerButtonProps) => (
  <button
    type="button"
    className="absolute md:right-3 md:top-3 top-1 right-1 border-none outline-0 xl:p-1.5 bg-yellow-100 md:rounded-xl rounded-[4px] hover:bg-green-200 transition-colors"
    aria-label={`Download banner for ${title}`}
    onClick={onClick}
  >
    <DownloadIcon className="md:w-12 md:h-12 w-4 h-4 pointer-events-none" />
  </button>
);
