import { CardMenu } from "@/shared/ui/card-menu/CardMenu";
import { Title } from "@/shared/ui";
import casinoUrl from '@/shared/assets/Casino.png?url'
import sportUrl from '@/shared/assets/Sport.png?url';
import bgImg from '@/shared/assets/BG.png?url'

export default function HomePage() {
  return (
    <>
      <div className="absolute top-0 left-0 h-full w-full">
        <img src={bgImg} alt="" className="w-full h-full object-cover"/>
      </div>
      <section className="flex flex-col justify-center gap-4 items-center uppercase w-full relative">
        <Title title="Ad Creator" description="Choose options" />
        <div className="flex md:flex-row flex-col 2xl:gap-[82px] md:gap-11 gap-5 w-full justify-center items-center px-4 my-11">
          <CardMenu title="CASINO" href="/casino" url={casinoUrl} />
          <CardMenu title="Sport" href="/sport" url={sportUrl} />
        </div>
      </section>
    </>
    
  )
}

