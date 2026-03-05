import { Save } from "lucide-react";

interface SaveButtonProps {
  onClick: () => void;
  isUpdating: boolean;
}

export default function SaveButton({ onClick, isUpdating }: SaveButtonProps) {
  return (
    <div className="flex justify-end">
      <button
        type="button"
        onClick={onClick}
        disabled={isUpdating}
        className="flex cursor-pointer items-center gap-2 rounded-md bg-indigo-600 px-6 py-2.5 text-sm font-medium hover:bg-indigo-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Save size={16} />
        {isUpdating ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}
