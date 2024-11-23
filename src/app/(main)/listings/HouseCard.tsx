import House from '@/app/models';
import Link from 'next/link';
import { logEvent } from 'firebase/analytics';
import { checkAnalytics } from '@/app/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  trailingZeroDisplay: 'stripIfInteger',
});

export default function HouseCard({
  id,
  image,
  address,
  price,
  link,
  baths,
  beds,
  availableDate,
  source,
}: House) {
  return (
    <Link
      href={link}
      target="_blank"
      className="w-full animate-fade-in"
      onClick={async () => {
        const analytics = await checkAnalytics;
        if (analytics) {
          logEvent(analytics, 'select-content', {
            content_type: 'listing',
            item_id: id,
            beds: beds,
            source: source,
          });
        }
      }}
    >
      <Card className="h-96">
        <CardHeader>
          <CardTitle>{address}</CardTitle>
          <img
            src={image}
            alt="house"
            className="m-auto h-52 w-full rounded-sm object-cover object-center"
          />
          <p>{formatter.format(price)}</p>
        </CardHeader>
        <CardContent>
          <div className="mb-2">
            <p className="text-xl">Beds: {beds}</p>
            {baths && <p>Baths: {baths}</p>}
          </div>
          {availableDate && <p>Available: {availableDate}</p>}
        </CardContent>
      </Card>
    </Link>
  );
}
