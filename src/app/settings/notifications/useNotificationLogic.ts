import { useState, useEffect } from "react";
import { NotificationChannel, DigestFrequency } from "@/generated/prisma/enums";
import useGetNotificationPreferences from "@/queries/user/useGetNotificationPreferences";
import useUpdateNotificationPreferences from "@/queries/user/useUpdateNotificationPreferences";

interface NotificationSettings {
  globalNotificationsEnabled: boolean;
  notificationChannels: NotificationChannel[];
  quietHoursStart: string | null;
  quietHoursEnd: string | null;
  digestFrequency: DigestFrequency;
}

export const useNotificationLogic = () => {
  const { preferences, isPending: isLoading } = useGetNotificationPreferences();
  const { updatePreferences, isPending: isUpdating } =
    useUpdateNotificationPreferences();

  const [settings, setSettings] = useState<NotificationSettings>({
    globalNotificationsEnabled: true,
    notificationChannels: [],
    quietHoursStart: null,
    quietHoursEnd: null,
    digestFrequency: DigestFrequency.REAL_TIME,
  });

  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  useEffect(() => {
    if (preferences) {
      setSettings({
        globalNotificationsEnabled: preferences.globalNotificationsEnabled,
        notificationChannels:
          preferences.notificationChannels as NotificationChannel[],
        quietHoursStart: dateToTimeString(preferences.quietHoursStart),
        quietHoursEnd: dateToTimeString(preferences.quietHoursEnd),
        digestFrequency: preferences.digestFrequency as DigestFrequency,
      });
    }
  }, [preferences]);

  const dateToTimeString = (dateString: string | null): string | null => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    } catch {
      return null;
    }
  };

  const timeStringToISODate = (timeString: string | null): string | null => {
    if (!timeString) return null;
    try {
      const [hours, minutes] = timeString.split(":").map(Number);
      const date = new Date();
      date.setHours(hours, minutes, 0, 0);
      return date.toISOString();
    } catch {
      return null;
    }
  };

  const toggleChannel = (channel: NotificationChannel) => {
    setSettings((prev) => ({
      ...prev,
      notificationChannels: prev.notificationChannels.includes(channel)
        ? prev.notificationChannels.filter((c) => c !== channel)
        : [...prev.notificationChannels, channel],
    }));
  };

  const handleEnableAll = () => {
    setSettings((prev) => ({
      ...prev,
      notificationChannels: [
        NotificationChannel.EMAIL,
        NotificationChannel.PUSH,
        NotificationChannel.SMS,
        NotificationChannel.IN_APP,
      ],
    }));
  };

  const handleDisableAll = () => {
    setSettings((prev) => ({
      ...prev,
      notificationChannels: [],
    }));
  };

  const handleResetToDefaults = () => {
    setSettings({
      globalNotificationsEnabled: true,
      notificationChannels: [
        NotificationChannel.EMAIL,
        NotificationChannel.IN_APP,
      ],
      quietHoursStart: null,
      quietHoursEnd: null,
      digestFrequency: DigestFrequency.REAL_TIME,
    });
  };

  const handleSave = () => {
    const payload = {
      globalNotificationsEnabled: settings.globalNotificationsEnabled,
      notificationChannels: settings.notificationChannels,
      quietHoursStart: timeStringToISODate(settings.quietHoursStart),
      quietHoursEnd: timeStringToISODate(settings.quietHoursEnd),
      digestFrequency: settings.digestFrequency,
    };

    updatePreferences(payload, {
      onSuccess: () => {
        setToastMessage("Notification preferences updated successfully!");
        setToastType("success");
        setToastOpen(true);
      },
      onError: (error) => {
        setToastMessage(error.message || "Failed to update preferences");
        setToastType("error");
        setToastOpen(true);
      },
    });
  };

  return {
    settings,
    setSettings,
    toggleChannel,
    handleEnableAll,
    handleDisableAll,
    handleResetToDefaults,
    handleSave,
    isLoading,
    isUpdating,
    toastOpen,
    setToastOpen,
    toastMessage,
    toastType,
  };
};
