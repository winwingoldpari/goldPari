interface TitleProps {
  title: string;
  description?: string;
  descriptionBg?: 'black' | 'gradient' | 'gray' | 'transparent' | 'notFound';
  descriptionBgClass?: string;
}

export const Title = ({
  title,
  description,
  descriptionBg = 'black',
  descriptionBgClass,
}: TitleProps) => {
  const wrap = 'flex flex-col gap-0 items-center px-4 relative z-10';
  const titleCls =
    '2xl:text-[70px] md:text-[56px] text-[36px] leading-[1] font-[900] text-white uppercase';

  const bgMap: Record<NonNullable<TitleProps['descriptionBg']>, string> = {
    black: 'bg-black  md:py-2.5 md:px-8 2xl:mt-1 md:mt-3 mt-2 leading-[0.87]',
    gradient: 'bg-[linear-gradient(90deg,#f2b705_0%,#8b0303_100%)] md:py-2.5 md:px-8 2xl:mt-1 md:mt-3 mt-2 leading-[0.87]',
    gray: 'bg-neutral-800',
    transparent: 'bg-transparent',
    notFound: 'bg-black 2xl:py-6 md:py-5 2xl:px-4.5 md:px-7.5 2xl:mt-1 md:mt-3 mt-2 leading-[1.2]',
  };

  const descBgCls = descriptionBgClass ?? bgMap[descriptionBg];

  return (
    <div className={wrap}>
      <div className={`${titleCls} font-climate`}>{title}</div>
      {Boolean(description) && (
        <div className={`inline ${descBgCls} text-white uppercase 2xl:text-[24px] text-base font-semibold 2xl:rounded-[30px] rounded-2xl  2xl:max-w-[770px] md:max-w-[550px] text-center whitespace-pre-line`}>
          {description}
        </div>
      )}
    </div>
  );
};
