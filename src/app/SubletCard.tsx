import { Sublet } from './models'; // Assuming the Sublet interface is in models.ts
import { logEvent } from 'firebase/analytics';
import { analytics } from './firebase-dev';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    trailingZeroDisplay: 'stripIfInteger'
});

export default function SubletCard({
    id,
    address,
    price,
    baths,
    bedsSubleased,
    bedsTotal,
    availableDate,
    endDate,
    photos,
    description,
    contact
}: Sublet) {
    console.log(availableDate)
    return (
        <div
            className="xl:w-1/5 lg:w-1/4 md:1/2 w-9/12 animate-fade-in"
            onClick={() => {
                analytics.then(ana => {
                    if (ana) {
                        logEvent(ana, 'select-content', {
                            content_type: 'sublet',
                            item_id: id,
                            bedsSubleased: bedsSubleased,
                            bedsTotal: bedsTotal,
                        });
                    }
                });
            }}
        >
            <Card className="h-96">
                <CardHeader>
                    <CardTitle>{address}</CardTitle>
                    <img src={photos[0]} alt="house" className="w-full h-40 object-cover rounded-sm" />
                    <p>{formatter.format(price)}</p>
                </CardHeader>
                <CardContent>
                    <div className="mb-2">
                        <p className="text-xl">Beds Subleased: {bedsSubleased}/{bedsTotal}</p>
                        {baths && <p>Baths: {baths}</p>}
                    </div>
                    {availableDate && <p>Available: {availableDate.toDateString()}</p>}
                    {endDate && <p>End Date: {endDate.toDateString()}</p>}
                    <p>{description}</p>
                    <p>Contact: {contact}</p>
                </CardContent>
            </Card>
        </div>
    );
}