import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import type { PublicProject } from "@/api/types/IProject";

export function ProjectItem({
  project,
  isSelected,
  onSelect,
}: {
  project: PublicProject;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <DropdownMenu.Item asChild>
      <button
        type="button"
        onClick={onSelect}
        className={`w-full focus:outline-none cursor-pointer  text-left rounded-md px-2 py-2 text-sm hover:bg-neutral-800 ${
          isSelected ? "bg-neutral-800 text-white" : "text-neutral-300"
        }`}
      >
        {project.name}
      </button>
    </DropdownMenu.Item>
  );
}
