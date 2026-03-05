"use client";

import { useEffect, useRef, useState } from "react";
import { FeedbackStatus } from "@/generated/prisma/enums";

interface StatusBadgeProps {
  status: FeedbackStatus;
  onChange: (status: FeedbackStatus) => void;
  isLoading?: boolean;
}

export default function StatusBadge({
  status,
  onChange,
  isLoading,
}: StatusBadgeProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const getStatusColor = (s: FeedbackStatus) => {
    switch (s) {
      case FeedbackStatus.NEW:
        return "bg-blue-500/10 text-blue-400 border-blue-500/30";
      case FeedbackStatus.IN_PROGRESS:
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/30";
      case FeedbackStatus.RESOLVED:
        return "bg-green-500/10 text-green-400 border-green-500/30";
      case FeedbackStatus.CLOSED:
        return "bg-neutral-500/10 text-neutral-400 border-neutral-500/30";
      default:
        return "bg-neutral-500/10 text-neutral-400 border-neutral-500/30";
    }
  };

  const getStatusLabel = (s: FeedbackStatus) => {
    switch (s) {
      case FeedbackStatus.NEW:
        return "New";
      case FeedbackStatus.IN_PROGRESS:
        return "In Progress";
      case FeedbackStatus.RESOLVED:
        return "Resolved";
      case FeedbackStatus.CLOSED:
        return "Closed";
      default:
        return s;
    }
  };

  const handleStatusClick = (
    e: React.MouseEvent,
    newStatus: FeedbackStatus,
  ) => {
    e.stopPropagation();
    onChange(newStatus);
    setIsOpen(false);
  };

  const toggleDropdown = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isLoading) {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={toggleDropdown}
        disabled={isLoading}
        className={`w-max flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-medium transition ${getStatusColor(
          status,
        )} ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:opacity-80 cursor-pointer"}`}
      >
        <span>{isLoading ? "Updating..." : getStatusLabel(status)}</span>
        {!isLoading && <span className="text-xs">▼</span>}
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-40 rounded-lg border border-neutral-800 bg-neutral-900 shadow-xl">
          {Object.values(FeedbackStatus).map((s) => (
            <button
              key={s}
              type="button"
              onClick={(e) => handleStatusClick(e, s)}
              className={`w-full text-left px-4 py-2 text-sm transition first:rounded-t-lg last:rounded-b-lg ${
                s === status
                  ? "bg-neutral-800 text-neutral-200"
                  : "text-neutral-400 hover:bg-neutral-800/50 hover:text-neutral-200"
              }`}
            >
              {getStatusLabel(s)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
