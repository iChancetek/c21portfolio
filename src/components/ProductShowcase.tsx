'use client';

import type { Venture } from '@/lib/types';
import ProductCard from './ProductCard';
import { ventureIcons } from '@/lib/data';
import { Users } from 'lucide-react';
import { useLocale } from '@/hooks/useLocale';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
interface ProductShowcaseProps {
  products: Venture[];
  searchQuery?: string;
}

export default function ProductShowcase({ products, searchQuery }: ProductShowcaseProps) {
  const { t } = useLocale();
  
  return (
    <section id="products" className="py-16 md:py-24 lg:py-32 relative bg-background overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary to-transparent"></div>
      <div className="container relative z-10">
        <div className="flex flex-col items-center text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-primary-gradient">{t('venturesTitle')}</h2>
           {!searchQuery && (
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              {t('venturesDescription')}
            </p>
           )}
           {searchQuery && (
             <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              {t('showingResultsFor', { searchQuery })}
            </p>
           )}
        </div>
        
        {products.length > 0 ? (
            <Carousel opts={{ align: "start", loop: true }} className="w-full max-w-7xl mx-auto pb-4">
              <CarouselContent className="-ml-4 md:-ml-8 items-stretch">
                {products.map((product) => {
                    const iconData = ventureIcons.find(icon => icon.name === product.name);
                    const Icon = iconData ? iconData.icon : Users;
                    return (
                      <CarouselItem key={product.id} className="pl-4 md:pl-8 md:basis-1/2 lg:basis-1/3 flex">
                         <div className="w-full h-full pb-4 flex">
                           <ProductCard product={product} Icon={Icon} />
                         </div>
                      </CarouselItem>
                    );
                })}
              </CarouselContent>
              <div className="flex justify-center gap-4 mt-8 pb-8 hidden md:flex">
                  <CarouselPrevious className="static translate-y-0 h-12 w-12 rounded-full border-primary/50 text-primary hover:bg-primary/20" />
                  <CarouselNext className="static translate-y-0 h-12 w-12 rounded-full border-primary/50 text-primary hover:bg-primary/20" />
              </div>
            </Carousel>
        ) : (
            <div className="text-center col-span-full mt-8 text-muted-foreground">
                <p>{t('noProductsFound', { searchQuery })}</p>
            </div>
        )}
      </div>
    </section>
  );
}
