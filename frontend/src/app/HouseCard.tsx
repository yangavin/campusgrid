import House from './models';
import Link from 'next/link';

export default function HouseCard({image, title, price, link, baths, beds}: House){
    console.log('HouseCard props:', {image, title, price, link, baths, beds}); // Check if correct
    return (
        <div className="w-1/6 border rounded-md p-6">
            <img src={image} className="w-full h-64 object-cover mb-4" />
            <h2 className="mb-4">{title}</h2>
            <p>{price}</p>
            <p>{baths} baths</p>
            <p>{beds} beds</p>
            <a href={`https://${link}`} target="_blank" className="text-sky-600">View Listing</a>
        </div>
    );
}