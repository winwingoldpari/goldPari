import { Link } from "react-router-dom";

interface CardMenuProps{
  href?: string;
  title?: string;
  url?: string;
}

export const CardMenu = ({href = "/", title, url}: CardMenuProps) => {
  return (
    <Link to={href} className="2xl:pt-7.5 pt-7 bg-black-100 rounded-[45px] overflow-hidden relative 2xl:max-w-[404px] duration-300 hover:-translate-y-2 max-w-[282px] w-full 2xl:h-[375px] h-[261px] block">
      <img src={url} alt={title} className="absolute md:bottom-0 -bottom-10 left-0 w-full" />
      <div className="2xl:text-[48px] text-[33px] font-climate font-black text-white uppercase text-center leading-[1.03]">{title}</div>
    </Link>
  );
};
