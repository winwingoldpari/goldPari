import { Button, Container, Title } from '@/shared/ui'
import { CardInfo } from './ui/CardInfo'
import IconArrow from "@/shared/assets/icons/arrow-right.svg?react";
import { Result } from '@/entities/result/ui/Result';
import { Loading } from '@/entities/result';
import { useSports } from '@/shared/hooks';
import { useState } from 'react';

export default function SportPage() {
  const { sports, loading } = useSports();
  const [promocode, setPromocode] = useState<string>('');
  return (
    <section className='w-full flex flex-col relative'>
      <Container>
        <Title title="Ad Creator" />
        <Button
          to="/"
          className='!bg-none !bg-black-100 !text-white !px-8'
          icon={<IconArrow />}
        >
          back to menu
        </Button>

        <CardInfo onPromocodeChange={setPromocode} />
        {loading ? <Loading /> : <Result data={sports} promocode={promocode} />}
      </Container>
    </section>
  )
}

