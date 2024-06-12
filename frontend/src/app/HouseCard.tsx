import House from './models';
import Link from 'next/link';
import Image from 'next/image';

export default function HouseCard({image, title, price, link, baths, beds}: House){
    return (
        <div className="w-1/6 border rounded-md p-6">
            <Image src={image} className="w-full h-64 object-cover mb-4" alt="property"/>
            <h2 className="mb-4">{title}</h2> 
            <p>{price}</p>
            <p>{baths} baths</p>
            <p>{beds} beds</p>
            <Link href={`https://${link}`} target="_blank" className="text-sky-600">View Listing</Link>
        </div>
    );
}