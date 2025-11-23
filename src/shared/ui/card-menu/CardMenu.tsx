import { Link } from "react-router-dom";

interface CardMenuProps{
  href?: string;
  title?: string;
  url?: string;
}

export const CardMenu = ({href = "/", title, url}: CardMenuProps) => {
  return (
    <Link to={href} className="md:pt-10 pt-6 bg-black-100 rounded-[45px] overflow-hidden relative max-w-[404px] w-full md:h-[375px] h-[250px] block">
      <img src={url} alt={title} className="absolute md:bottom-0 -bottom-12 left-0 w-full" />
      <div className="md:text-[48px] text-[30px] font-black text-white uppercase text-center leading-[48px] -mt-2" style={{fontFamily: "Climate Crisis, sans-serif"}}>{title}</div>
    </Link>
  );
};
