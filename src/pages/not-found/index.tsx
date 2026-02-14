import { Title } from '@/shared/ui'
import bgImg from '@/shared/assets/not-found.png?url'
export default function NotFoundPage() {
  return (
    <>
      <div className="absolute top-0 left-0 h-full w-full">
        <img src={bgImg} alt="" className="w-full h-full object-cover"/>
      </div>
      <section className='relative z-10 flex items-center'>
        <Title title="Error 404" descriptionBg="notFound" description="The page you are looking for does not exist or has been deleted" />
      </section>
    </>
  )
}


