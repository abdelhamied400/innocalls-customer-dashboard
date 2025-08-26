"use client";
import Image from "next/image";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselDots,
  CarouselItem,
} from "@/components/ui/carousel";
import FeatureCard from "@/components/FeatureCard";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import DotGrid from "@/components/DotGrid";
import { useLocale, useTranslations } from "next-intl";
import { locales, LocaleSlug } from "@/i18n/config";
import Autoplay from "embla-carousel-autoplay";

const AuthBanner = () => {
  const locale = useLocale() as LocaleSlug;
  const { dir } = locales[locale];

  const t = useTranslations("auth.banner");

  const items = [
    {
      title: t("features.phoneSystem.title"),
      description: t("features.phoneSystem.description"),
      image: "/assets/icons/features/phone-rotate.svg",
    },
    {
      title: t("features.ivrRouting.title"),
      description: t("features.ivrRouting.description"),
      image: "/assets/icons/features/call.svg",
    },
    {
      title: t("features.reporting.title"),
      description: t("features.reporting.description"),
      image: "/assets/icons/features/chart.svg",
    },
  ];

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="auth-banner bg-[#3888E7] text-white flex justify-center items-center h-full relative overflow-hidden">
      {/* Dotted background accents */}
      <DotGrid
        className="absolute top-2 end-0 opacity-20"
        dotClassName="bg-white/50"
        count={15}
      />

      <DotGrid
        className="absolute bottom-0 start-0 opacity-20 grid-cols-4 gap-6"
        dotClassName="bg-white/30 w-8 h-8"
        count={12}
      />

      <div className="flex flex-col justify-between h-full max-h-[90vh] w-full max-w-5xl mx-auto">
        {/* Logo */}
        <div className="mb-8 px-12">
          <div className="bg-white p-4 rounded-xl inline-block shadow-md">
            <Image
              src="/assets/images/logo-wbg.png"
              alt="Logo"
              width={100}
              height={100}
              className="object-contain"
            />
          </div>
        </div>

        {/* Title & Subtitle */}
        <div className="text-start max-w-2xl space-y-4 px-12">
          <h1
            className="text-4xl font-bold leading-tight"
            dangerouslySetInnerHTML={{ __html: t("title") }}
          />
          <p className="text-white/80 text-lg">{t("subtitle")}</p>
        </div>

        {/* Features Carousel */}
        <div className="mt-auto mb-12 relative">
          <div className="w-full">
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#3888E7] to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#3888E7] to-transparent z-10 pointer-events-none" />
          </div>

          <div className="mx-auto z-0" dir="ltr">
            <Carousel
              setApi={setApi}
              opts={{ loop: true, startIndex: 1 }}
              plugins={[
                Autoplay({
                  delay: 4000,
                  stopOnLastSnap: false,
                  stopOnMouseEnter: true,
                  active: true,
                  stopOnFocusIn: false,
                  stopOnInteraction: false,
                }),
              ]}
              className="flex flex-col gap-8"
            >
              <CarouselContent className="items-center">
                {items.map((item, i) => (
                  <CarouselItem key={i} className={cn("basis-[66%]")} dir={dir}>
                    <FeatureCard
                      title={item.title}
                      description={item.description}
                      image={item.image}
                      isActive={current === i + 1}
                    />
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselDots />
            </Carousel>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthBanner;
