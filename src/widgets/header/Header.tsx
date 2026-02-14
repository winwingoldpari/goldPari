import { NavLink } from 'react-router-dom';
import LogoIcon from '@/shared/assets/logo.svg?react';
import DownloadIcon from '@/shared/assets/icons/download.svg?react'
import { Button, Container } from '@/shared/ui'
import { useGlobalSettings } from '@/shared/hooks'

export function Header() {
  const { starterPack } = useGlobalSettings();
  return (
    <header className="md:px-7 px-4 md:py-13 py-3  absolute top-0 left-0 w-full z-10">
      <Container>
        <div className="flex items-center md:justify-between justify-center flex-wrap  gap-5">
          <NavLink
            to="/"
            aria-label="Casino Banner home"
          >
            <LogoIcon className="h-8 w-auto" aria-hidden />
          </NavLink>
          <div className="flex items-center gap-5 text-xs">
            <Button
            to="/"
            variant="secondary"
          >
            Send feedback
          </Button>
            <Button
              href={starterPack || "#starter-pack"}
              download
              target="_blank"
              rel="noreferrer"
              icon={<DownloadIcon className='2xl:w-auto 2xl:h-auto w-5 h-5'  />}
            >
              Starter Pack
            </Button>
          </div>
        </div>

      </Container>
    </header>
  )
}
