import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import SignInButton from './SignInButton';

interface SignInDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function SignInDialog({
  open,
  onOpenChange,
}: SignInDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Real-Time Market Updates
          </DialogTitle>
          <DialogDescription className="space-y-4">
            <p>
              Sign in now to get notified instantly when any new listing in the
              market matches your criteria!
            </p>
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center">
          <SignInButton onSignInSuccess={() => onOpenChange(false)} />
        </div>
        <p className="text-[10px] text-muted-foreground">
          We do not endorse listings on our platform and cannot guarantee their
          authenticity. Users should verify listings independently before
          engagement.
        </p>
      </DialogContent>
    </Dialog>
  );
}
