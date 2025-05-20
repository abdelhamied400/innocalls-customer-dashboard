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

const AuthBanner = () => {
  const items = [
    {
      title: "Comprehensive Phone Systems",
      description:
        "Effortlessly manage your business communications with advanced cloud call center capabilities for sending and receiving calls.",
      image: "/assets/icons/features/phone-rotate.svg",
    },
    {
      title: "IVR & Call routing",
      description:
        "Provide 24/7 accessibility, reduce wait times and make sure calls are routed through the right path inside your company’s sectors.",
      image: "/assets/icons/features/call.svg",
    },
    {
      title: "Reporting & analytics",
      description:
        "Stay on top of your business with live data analyses & updated reports to support strategic planning and smart decisions.",
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
        <div className="text-left max-w-2xl space-y-4 px-12">
          <h1 className="text-4xl font-bold leading-tight">
            Smart call center & <br /> cloud-powered solutions
          </h1>
          <p className="text-white/80 text-lg">
            Get your communication boosted and connect with customers
            seamlessly, no matter where you are
          </p>
        </div>

        {/* Features Carousel */}
        <div className="mt-auto mb-12 relative">
          <div className="w-full">
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#3888E7] to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#3888E7] to-transparent z-10 pointer-events-none" />
          </div>

          <div className="mx-auto z-0">
            <Carousel
              setApi={setApi}
              opts={{ loop: true, startIndex: 1 }}
              plugins={[]}
              className="flex flex-col gap-8"
            >
              <CarouselContent className="items-center">
                {items.map((item, i) => (
                  <CarouselItem key={i} className={cn("basis-[66%]")}>
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
