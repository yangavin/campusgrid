import House from './models';
import Link from 'next/link';
import { Badge } from "@/components/ui/badge"

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    trailingZeroDisplay: 'stripIfInteger'
});

export default function HouseCard({image, address, price, link, baths, beds, availableDate}: House){
    return (
        <Link href={link} target="_blank" className="w-1/5 border rounded-md p-6 animate-fade-in">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={image} className="w-full h-64 object-cover mb-4 rounded-sm" alt="property"/>
            <h2 className="mb-4 text-xl">{address}</h2> 
            <p className='text-2xl'>{formatter.format(price)}</p>

            {/* <Badge className='text-md'>{beds} beds</Badge>
            <br />
            {baths && <Badge variant="secondary">{baths} baths</Badge>} */}

            <p className='text-lg'>{beds} beds</p>
            {baths && <p>{baths} baths</p>}
            {availableDate && <p>Available: {availableDate}</p>}
        </Link>
    );
}