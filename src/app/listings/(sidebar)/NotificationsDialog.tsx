import { useState } from 'react';
import { DollarSign } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { bedOptions, sourceFullnames } from './options';
import { useAuth } from '../(auth)/AuthProvider';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/app/firebase';
import { mutate } from 'swr';
import { Loader2 } from 'lucide-react';

interface NotificationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function NotificationsDialog({
  open,
  onOpenChange,
}: NotificationsDialogProps) {
  const { user } = useAuth();
  const [beds, setBeds] = useState<string[]>(user?.beds || []);
  const [maxPrice, setMaxPrice] = useState<number | null>(
    user?.maxPrice || null
  );
  const [selectedSources, setSelectedSources] = useState<string[]>(
    user?.sources || Object.keys(sourceFullnames)
  );
  const [isLoading, setIsLoading] = useState(false);

  console.log(user?.subscribed);

  const handleSave = async () => {
    if (!user?.uid) return;
    setIsLoading(true);

    try {
      const userDocRef = doc(db, 'users', user.uid);
      const newData = {
        subscribed: true,
        beds: beds,
        maxPrice: maxPrice,
        sources: selectedSources,
      };

      await setDoc(userDocRef, newData, { merge: true });
      await mutate(['user', user.uid]);
      onOpenChange(false);
    } catch (error) {
      console.error('Error saving notification preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnsubscribe = async () => {
    if (!user?.uid) return;
    setIsLoading(true);

    try {
      const userDocRef = doc(db, 'users', user.uid);
      const newData = {
        subscribed: false,
      };

      await setDoc(userDocRef, newData, { merge: true });
      await mutate(['user', user.uid]);
      onOpenChange(false);
    } catch (error) {
      console.error('Error unsubscribing from notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Notification Preferences</DialogTitle>
          <DialogDescription>
            Set your preferences for listing notifications. We&apos;ll notify
            you when new listings match your criteria.
          </DialogDescription>
        </DialogHeader>

        <div className="grid flex-1 gap-4 overflow-y-auto py-6">
          {/* Beds Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Number of Beds</label>
            <ToggleGroup
              type="multiple"
              variant="outline"
              className="flex flex-wrap gap-2"
              value={beds}
              onValueChange={setBeds}
            >
              {bedOptions.map((bed) => (
                <ToggleGroupItem
                  key={bed}
                  value={bed.toString()}
                  className="rounded-md px-3 py-2"
                >
                  {bed}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>

          {/* Max Price Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Maximum Price</label>
            <div className="relative">
              <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="number"
                placeholder="Enter maximum price"
                className="pl-8"
                value={maxPrice || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  setMaxPrice(value ? Number(value) : null);
                }}
              />
            </div>
          </div>

          {/* Source Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-medium">Sources</label>
            <div className="max-h-[200px] space-y-2 overflow-y-auto">
              {Object.entries(sourceFullnames).map(([key, name]) => (
                <div
                  key={`${key}-notification`}
                  className="flex items-center space-x-2"
                >
                  <Checkbox
                    id={`${key}-notification`}
                    checked={selectedSources.includes(key)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setSelectedSources([...selectedSources, key]);
                      } else {
                        setSelectedSources(
                          selectedSources.filter((s) => s !== key)
                        );
                      }
                    }}
                  />
                  <label
                    htmlFor={`${key}-notification`}
                    className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {name}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : user?.subscribed ? (
              'Update Preferences'
            ) : (
              'Subscribe'
            )}
          </Button>
          {user?.subscribed && (
            <Button
              variant="outline"
              onClick={handleUnsubscribe}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Unsubscribe'
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
