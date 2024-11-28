import House from '@/app/models';
import Link from 'next/link';
import { logEvent } from 'firebase/analytics';
import { checkAnalytics } from '@/app/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useState } from 'react';
import SignInButton from '../SignInButton';

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
  setHovering,
}: House & { setHovering: (status: boolean) => void }) {
  const [showSignInDialog, setShowSignInDialog] = useState(false);

  const cardContent = (
    <Card
      className="h-96"
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
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
  );

  return (
    <Link
      href={link}
      target="_blank"
      className="w-full animate-fade-in"
      onClick={async () => {
        const analytics = await checkAnalytics;
        if (analytics) {
          logEvent(analytics, 'select_content', {
            content_type: 'listing',
            item_id: id,
            beds: beds,
            source: source,
          });
        }
      }}
    >
      {cardContent}
    </Link>
  );

  return (
    <>
      <div
        className="w-full animate-fade-in cursor-pointer"
        onClick={() => setShowSignInDialog(true)}
      >
        {cardContent}
      </div>
      <Dialog open={showSignInDialog} onOpenChange={setShowSignInDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Find Your Perfect Place Now!
            </DialogTitle>
            <DialogDescription className="space-y-4">
              <p>
                Sign in now to access hundreds of listings and find your perfect
                place with ease!
              </p>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center">
            <SignInButton onSignInSuccess={() => setShowSignInDialog(false)} />
          </div>
          <p className="text-[10px] text-muted-foreground">
            We do not endorse listings on our platform and cannot guarantee
            their authenticity. Users should verify listings independently
            before engagement.
          </p>
        </DialogContent>
      </Dialog>
    </>
  );
}
