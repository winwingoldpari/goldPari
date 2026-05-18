import { Title } from '@/shared/ui'
import bgImg from '@/shared/assets/not-found.png?url'
import { BgRound } from '@/shared/ui/bg-round/bg-round'
export default function NotFoundPage() {
  return (
    <>
      <div className="absolute top-0 left-0 h-full w-full md:block hidden">
        <img src={bgImg} alt="" className="w-full h-full object-cover"/>
      </div>
      <BgRound className="absolute top-0 bottom-0 right-0 left-0 m-auto md:hidden" />
      <section className='relative z-10 flex items-center flex-col justify-center px-3.5'>
        <Title title="Error 404" descriptionBg="notFound" />
        <div className="md:mt-7.5 mt-4 md:text-[24px] font-semibold text-[18px] text-white text-center">
          The page you are looking for does not exist 
          <br/> or has been deleted
        </div>
      </section>
    </>
  )
}


