import { Button } from "@/shared/ui";
import { useGlobalSettings } from "@/shared/hooks";

export const NoContent = () => {
  const { link, sendRequest } = useGlobalSettings();

  return (
    <div
      role="status"
      aria-live="polite"
      className="w-full relative z-1 flex flex-col max-w-[1080px] mx-auto items-center justify-center text-center 2xl:py-75 md:py-37.5 py-12"
    >
      <div className="font-climate uppercase 2xl:text-[70px] md:text-[56px] text-[32px] text-white font-black leading-[100%]">
        No content
      </div>
      <div className="md:mt-7.5 mt-4 md:text-[22px] font-semibold text-[18px] text-white">
        Check that the filters are filled in correctly. If no results appear, contact us to request creation using the button below. Note the content creation timelines via the{' '}
        <a href={link || '#'} className="text-white underline" target="_blank" rel="noreferrer">link</a>.
      </div>
      <Button
        href={sendRequest || '#'}
        target="_blank"
        rel="noreferrer"
        className="md:mt-12.5 mt-8"
      >
        send request
      </Button>
    </div>
  );
};
