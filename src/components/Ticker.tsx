'use client';

import { partnerCompanies } from '@/lib/data';

const Ticker = () => {
    // Duplicate the array to create a seamless loop
    const extendedPartners = [...partnerCompanies, ...partnerCompanies];

    return (
        <section className="w-full py-12">
            <div className="container mx-auto">
                 <h3 className="text-center text-3xl font-bold text-accent mb-8">
                    Trusted by Leading Companies & Partners
                </h3>
                <div className="ticker-container">
                    <div className="ticker-track">
                        {extendedPartners.map((partner, index) => (
                            <div key={index} className="ticker-item">
                                {partner.name}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Ticker;
