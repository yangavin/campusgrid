import { useContext, useState } from 'react';
import { Sublet } from '@/app/models'; // Assuming the Sublet interface is in models.ts
import { logEvent } from 'firebase/analytics';
import { checkAnalytics, db, storage } from '@/app/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { useMediaQuery } from 'usehooks-ts';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { doc, getDoc, deleteDoc } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { useAuth } from '@/app/AuthProvider';

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  trailingZeroDisplay: 'stripIfInteger',
});
const dateFormatter = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

interface Props {
  refetch: () => void;
}

export default function SubletCard({
  id,
  userId,
  poster,
  address,
  price,
  baths,
  bedsSubleased,
  bedsTotal,
  availableDate,
  endDate,
  photos,
  description,
  contact,
  refetch,
}: Sublet & Props) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [isDeleting, setIsDeleting] = useState(false);
  const { user } = useAuth();

  const handleOpen = async () => {
    setIsDialogOpen(true);
    const analytics = await checkAnalytics;
    if (analytics) {
      logEvent(analytics, 'select-content', {
        content_type: 'sublet',
        item_id: id,
        bedsSubleased: bedsSubleased,
        bedsTotal: bedsTotal,
      });
    }
  };

  const deleteSublet = async () => {
    setIsDeleting(true);
    try {
      // Step 1: Retrieve the sublet document to access the photo URLs
      const subletDocRef = doc(db, 'sublets', id);
      const subletDoc = await getDoc(subletDocRef);

      if (subletDoc.exists()) {
        const data = subletDoc.data();
        const photoUrls: string[] = data.photos;

        // Step 2: Delete each photo from Firebase Storage
        const deletePromises = photoUrls.map(async (url) => {
          const photoRef = ref(storage, url);
          try {
            await deleteObject(photoRef);
          } catch (error) {
            console.error('Error deleting photo:', error);
          }
        });

        // Wait for all photo deletions to complete
        await Promise.all(deletePromises);
      }

      // Step 3: Delete the Firestore document
      await deleteDoc(subletDocRef);
      setIsDialogOpen(false);
      refetch();
    } catch (error) {
      console.error('Error deleting sublet:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <div
          className="md:1/2 w-9/12 animate-fade-in cursor-pointer lg:w-1/4 xl:w-1/5"
          onClick={handleOpen}
        >
          <Card className="h-96">
            <CardHeader>
              <CardTitle>{address}</CardTitle>
              <img
                src={photos[0]}
                alt="house"
                className="h-40 w-full rounded-sm object-cover"
              />
              <p>{formatter.format(price)}</p>
            </CardHeader>
            <CardContent>
              <div className="mb-2">
                <p className="text-xl">
                  Beds Subleased: {bedsSubleased}/{bedsTotal}
                </p>
                {baths && <p>Baths: {baths}</p>}
              </div>
              {availableDate && (
                <p>Available: {dateFormatter(availableDate)}</p>
              )}
              {endDate && <p>End Date: {dateFormatter(endDate)}</p>}
            </CardContent>
          </Card>
        </div>
      </DialogTrigger>
      <DialogContent
        className={`max-h-[98%] sm:max-w-[1000px] ${!isDeleting ? 'overflow-y-scroll' : ''}`}
      >
        {isDeleting ? (
          <p className="text-center">Deleting...</p>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{address}</DialogTitle>
              <DialogDescription>{formatter.format(price)}</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center p-4">
              <Carousel className="mb-4 w-full max-w-lg">
                <CarouselContent>
                  {photos.map((photo, index) => (
                    <CarouselItem key={index}>
                      <div className="p-1">
                        <Card>
                          <CardContent className="flex items-center justify-center p-6">
                            <img
                              src={photo}
                              alt={`House photo ${index + 1}`}
                              className="h-64 w-full rounded-sm object-contain"
                            />
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {isDesktop && (
                  <>
                    <CarouselPrevious />
                    <CarouselNext />
                  </>
                )}
              </Carousel>
              <p className="text-xl">
                Beds Subleased: {bedsSubleased}/{bedsTotal}
              </p>
              {baths && <p>Baths: {baths}</p>}
              {availableDate && (
                <p>Available: {dateFormatter(availableDate)}</p>
              )}
              {endDate && <p>End Date: {dateFormatter(endDate)}</p>}
              <Alert className="my-8 p-5">
                <AlertDescription className="text-md text-center">
                  {description}
                </AlertDescription>
              </Alert>
              <p className="font-bold">Contact: {contact}</p>
              <p className="font-bold">Posted by: {poster}</p>
            </div>
            <DialogFooter className="flex justify-between">
              {user && user.uid === userId && (
                <Button variant="destructive" onClick={deleteSublet}>
                  Delete
                </Button>
              )}
              <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
