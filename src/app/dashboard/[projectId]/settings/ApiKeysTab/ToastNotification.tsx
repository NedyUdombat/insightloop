import * as Toast from "@radix-ui/react-toast";

interface ToastNotificationProps {
  open: boolean;
  message: string;
  onOpenChange: (open: boolean) => void;
}

export default function ToastNotification({
  open,
  message,
  onOpenChange,
}: ToastNotificationProps) {
  return (
    <Toast.Root
      open={open}
      onOpenChange={onOpenChange}
      duration={2000}
      className="rounded-lg border border-indigo-500/40 bg-indigo-600/10 backdrop-blur px-4 py-3 shadow-lg"
    >
      <Toast.Title className="text-sm font-medium text-indigo-300">
        {message}
      </Toast.Title>
    </Toast.Root>
  );
}
