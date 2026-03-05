import * as Toast from "@radix-ui/react-toast";

interface ToastNotificationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  message: string;
  type: "success" | "error";
}

export default function ToastNotification({
  open,
  onOpenChange,
  message,
  type,
}: ToastNotificationProps) {
  return (
    <Toast.Root
      className={`rounded-lg border px-4 py-3 shadow-lg ${
        type === "success"
          ? "border-green-800 bg-green-950/90 text-green-400"
          : "border-red-800 bg-red-950/90 text-red-400"
      }`}
      open={open}
      onOpenChange={onOpenChange}
      duration={3000}
    >
      <Toast.Description className="text-sm font-medium">
        {message}
      </Toast.Description>
    </Toast.Root>
  );
}
