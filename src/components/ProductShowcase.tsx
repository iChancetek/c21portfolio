'use client';

import type { Venture } from '@/lib/types';
import ProductCard from './ProductCard';
import { ventureIcons } from '@/lib/data';
import { Users } from 'lucide-react';
import { useLocale } from '@/hooks/useLocale';

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => {
                const iconData = ventureIcons.find(icon => icon.name === product.name);
                const Icon = iconData ? iconData.icon : Users;
                return <ProductCard key={product.id} product={product} Icon={Icon} />
            })}
            </div>
        ) : (
            <div className="text-center col-span-full mt-8 text-muted-foreground">
                <p>{t('noProductsFound', { searchQuery })}</p>
            </div>
        )}
      </div>
    </section>
  );
}
