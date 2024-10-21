import House from './models';
import Link from 'next/link';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Badge } from '@/components/ui/badge';

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    trailingZeroDisplay: 'stripIfInteger'
});

export default function HouseCard({image, address, price, link, baths, beds, availableDate}: House){
    return (
        <Link href={link} target="_blank" className="w-1/5 animate-fade-in">
            <Card className='h-96'>
                <CardHeader>
                    <CardTitle>{address}</CardTitle>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image} alt="house" className="w-full h-40 object-cover rounded-sm" />
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