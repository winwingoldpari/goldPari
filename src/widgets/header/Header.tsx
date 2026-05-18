import { NavLink, useLocation } from 'react-router-dom';
import LogoIcon from '@/shared/assets/logo.svg?react';
import DownloadIcon from '@/shared/assets/icons/download.svg?react'
import { Button, Container } from '@/shared/ui'
import { useGlobalSettings } from '@/shared/hooks'

const KNOWN_ROUTES = ['/', '/sport', '/casino'];

export function Header() {
  const { starterPack, feedback } = useGlobalSettings();
  const { pathname } = useLocation();
  const isNotFound = !KNOWN_ROUTES.includes(pathname);
  return (
    <header className="2xl:py-12.5 md:py-15 pt-13.5 absolute top-0 left-0 w-full z-10">
      <Container>
        <div className={`flex items-center md:justify-between justify-center flex-wrap md:flex-row flex-col md:gap-5 ${isNotFound ? 'gap-5' : 'gap-[93px]'}`}>
          <NavLink
            to="/"
            aria-label="Casino Banner home"
          >
            <LogoIcon className="2xl:h-8 md:h-5.5 h-4 w-auto" aria-hidden />
          </NavLink>
          <div className="flex items-center md:gap-8.5 gap-5 text-xs">
            <Button
            href={feedback || "#feedback"}
            target="_blank"
            rel="noreferrer"
            variant="secondary"
            className='md:order-0 order-1'
          >
            Send feedback
          </Button>
            <Button
              href={starterPack || "#starter-pack"}
              download
              target="_blank"
              rel="noreferrer"
              className='md:order-1 order-0'
              icon={<DownloadIcon className='xl:w-auto xl:h-auto md:w-5 md:h-5 w-4 h-4'  />}
            >
              Starter Pack
            </Button>
          </div>
        </div>

      </Container>
    </header>
  )
}
