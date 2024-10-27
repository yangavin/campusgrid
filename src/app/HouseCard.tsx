import House from './models';
import Link from 'next/link';
import { logEvent } from 'firebase/analytics';
import { analytics } from './firebase-dev';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    trailingZeroDisplay: 'stripIfInteger'
});

export default function HouseCard({id, image, address, price, link, baths, beds, availableDate, source}: House){
    return (
        <Link href={link} target="_blank" className="xl:w-1/5 lg:w-1/4 md:1/2 w-9/12 animate-fade-in" onClick={()=>{
            logEvent(analytics, 'select-content', {
                content_type: 'listing',
                item_id: id,
                beds: beds,
                source: source
            })
        }}>
            <Card className='h-96'>
                <CardHeader>
                    <CardTitle>{address}</CardTitle>
                    {source === "frontenac" ? 
                        <img src="frontenac.png" alt="frontenac" />
                        :
                        <img src={image} alt="house" className="w-full h-40 object-cover rounded-sm" />
                    }
                    <p>{formatter.format(price)}</p>
                </CardHeader>
                <CardContent>
                    <div className='mb-2'>
                        <p className='text-xl'>Beds: {beds}</p>
                        {baths && <p>Baths: {baths}</p>}
                    </div>
                    {availableDate && <p>Available: {availableDate}</p>}
                </CardContent>
            </Card>
        </Link>
    );
}