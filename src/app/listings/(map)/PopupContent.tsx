// components/PopupContent.tsx
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import House from '@/app/models';

interface PopupContentProps {
  house: House;
}

export default function PopupContent({ house }: PopupContentProps) {
  return (
    <Card className="border-none shadow-none">
      <CardHeader className="p-0">
        <img
          src={house.image}
          alt={house.address}
          className="aspect-video w-full rounded-t-lg object-cover object-center"
        />
      </CardHeader>
      <CardContent className="space-y-2 p-4">
        <h3 className="text-lg font-semibold">{house.address}</h3>
        <div className="flex gap-2">
          <Badge variant="secondary">{house.beds} Beds</Badge>
          <Badge variant="secondary">${house.price}/mo</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
