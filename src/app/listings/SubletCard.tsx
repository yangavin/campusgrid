import { useContext, useState } from 'react';
import { Sublet } from './models'; // Assuming the Sublet interface is in models.ts
import { logEvent } from 'firebase/analytics';
import { checkAnalytics, db, storage } from '../firebase';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useMediaQuery } from 'usehooks-ts'
import { Alert, AlertDescription } from '@/components/ui/alert';
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";
import { UserContext } from './page';

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    trailingZeroDisplay: 'stripIfInteger'
});
const dateFormatter = (date: Date) => {
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short', 
        day: 'numeric',
    });
}

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
    refetch
}: Sublet & Props) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const isDesktop = useMediaQuery('(min-width: 768px)');
    const [isDeleting, setIsDeleting] = useState(false);
    const userData = useContext(UserContext);

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
            const subletDocRef = doc(db, "sublets", id);
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
                        console.error("Error deleting photo:", error);
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
            console.error("Error deleting sublet:", error);
        } finally {
            setIsDeleting(false);
        }
    }

    return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
                <div
                    className="xl:w-1/5 lg:w-1/4 md:1/2 w-9/12 animate-fade-in cursor-pointer"
                    onClick={handleOpen}
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
                            {availableDate && <p>Available: {dateFormatter(availableDate)}</p>}
                            {endDate && <p>End Date: {dateFormatter(endDate)}</p>}
                        </CardContent>
                    </Card>
                </div>
            </DialogTrigger>
            <DialogContent className={`sm:max-w-[1000px] max-h-[98%] ${!isDeleting ? "overflow-y-scroll" : ""}`}>
                {isDeleting ? (
                    <p className='text-center'>Deleting...</p>
                ) : (
                    <>
                        <DialogHeader>
                            <DialogTitle>{address}</DialogTitle>
                            <DialogDescription>{formatter.format(price)}</DialogDescription>
                        </DialogHeader>
                        <div className="p-4 flex flex-col items-center">
                            <Carousel className="w-full max-w-lg mb-4">
                                <CarouselContent>
                                    {photos.map((photo, index) => (
                                        <CarouselItem key={index}>
                                            <div className="p-1">
                                                <Card>
                                                    <CardContent className="flex items-center justify-center p-6">
                                                        <img
                                                            src={photo}
                                                            alt={`House photo ${index + 1}`}
                                                            className="w-full h-64 object-contain rounded-sm"
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
                            <p className="text-xl">Beds Subleased: {bedsSubleased}/{bedsTotal}</p>
                            {baths && <p>Baths: {baths}</p>}
                            {availableDate && <p>Available: {dateFormatter(availableDate)}</p>}
                            {endDate && <p>End Date: {dateFormatter(endDate)}</p>}
                            <Alert className='my-8 p-5'>
                                <AlertDescription className='text-center text-md '>
                                    {description}
                                </AlertDescription>
                            </Alert>
                            <p className="font-bold">Contact: {contact}</p>
                            <p className="font-bold">Posted by: {poster}</p>
                        </div>
                        <DialogFooter className='flex justify-between'>
                            {userData && userData.uid === userId && (
                                <Button variant="destructive" onClick={deleteSublet}>Delete</Button>
                            )}
                            <Button onClick={() => setIsDialogOpen(false)}>Close</Button>
                        </DialogFooter>
                </>
                )}
            </DialogContent>
        </Dialog>
    );
}