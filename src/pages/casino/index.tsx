import { Container, Title, Button } from "@/shared/ui";
import { CardInfo } from "./ui/CardInfo";
import IconArrow from "@/shared/assets/icons/arrow-right.svg?react";
import { Loading, Result } from "@/entities/result";
import { useCasinos } from "@/shared/hooks";
import { useState } from "react";
import { BgRound } from "@/shared/ui/bg-round/bg-round";

export default function CasinoPage() {
  const { casinos, loading } = useCasinos();
  const [promocode, setPromocode] = useState<string>('');
  return (
    <section className='w-full flex flex-col relative mt-75'>
      <BgRound className="absolute top-6 right-0 left-0 bottom-0 mx-auto" />
      <BgRound className="absolute 2xl:top-[866px] top-[666px] 2xl:-right-[600px] -right-[400px] " />
      <BgRound className="absolute 2xl:top-[1266px] top-[1266px] 2xl:-left-[600px] -left-[400px] " />
      <Container>
        <Title title="Ad Creator" />
        <Button
          to="/"
          variant="secondary"
          className="px-8 lg:mt-0 mt-4"
          icon={<IconArrow />}
        >
          back to menu
        </Button>
        <CardInfo onPromocodeChange={setPromocode} />
        {loading ? <Loading /> : <Result data={casinos} promocode={promocode} />}
      </Container>
    </section>
  );
};
