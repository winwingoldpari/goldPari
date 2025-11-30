interface BgRoundProps {
  className?: string;
}

export const BgRound = ({ className = '' }: BgRoundProps) => {
  return (
    <div
      className={`rounded-full blur-[90px] 2xl:w-[823px] 2xl:h-[823px] w-[590px] h-[590px] ${className}`}
      style={{
        background: 'radial-gradient(50% 50% at 50% 50%, rgba(237, 199, 0, 1) 15%, rgba(204, 158, 21, 1) 100%) repeat scroll 0 0 transparent'
      }}
    />
  );
};  