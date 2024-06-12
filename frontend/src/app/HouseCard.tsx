import House from './models';
import Link from 'next/link';

export default function HouseCard({title, price, link, baths, beds}: House){
    return (
        <div className="w-1/6 border rounded-md p-6">
            <h2 className="mb-4">{title}</h2>
            <p>{price}</p>
            <p>{baths} baths</p>
            <p>{beds} beds</p>
            <a href={`https://${link}`} target="_blank" className="text-sky-600">View Listing</a>
        </div>
    );
}