import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface AlertProps {
    title: string;
    description: string;
    onConfirm: () => void;
    onCancel: () => void;
    open: boolean;
    setOpen: (open: boolean) => void;
  }
  
  export function Alert({ title, description, onConfirm, onCancel, open, setOpen }: AlertProps) {
    return (
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>
              {description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={onCancel}>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={onConfirm}>Tiếp tục</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }
