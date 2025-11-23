import bgImg from '@/shared/assets/not-found.png?url'
export default function NotFoundPage() {
  return (
    <>
      <div className="absolute top-0 left-0 h-full w-full">
        <img src={bgImg} alt="" className="w-full h-full object-cover"/>
      </div>
      <section className='relative z-10 flex items-center'>
        <div className="flex flex-col gap-0 items-center px-4">
          <div className="md:text-[95px] text-[58px] leading-none font-[900] text-white uppercase">Error 404</div>
          <div className="inline bg-black py-2.5 px-7 text-white uppercase md:text-[25px] text-xl font-semibold rounded-[30px] leading-none max-w-[780px] text-center">
            The page you are looking for does<br />
            not exist or has been deleted.
          </div>
        </div>
      </section>
    </>
  )
}


