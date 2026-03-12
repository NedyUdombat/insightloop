import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useChangePassword from "@/queries/user/useChangePassword";
import useGetCurrentUser from "@/queries/user/useGetCurrentUser";
import useUpdateProfile from "@/queries/user/useUpdateProfile";

export function useProfileLogic() {
  const router = useRouter();

  // Fetch current user data
  const { user, isPending: isLoadingUser } = useGetCurrentUser();
  const { updateProfileAsync, isPending: isUpdatingProfile } =
    useUpdateProfile();
  const { changePasswordAsync, isPending: isChangingPassword } =
    useChangePassword();

  // Individual state variables for each form field
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  // Populate form fields when user data is loaded
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setProfileImage(user.profileImage || null);
    }
  }, [user]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Update profile information
      await updateProfileAsync({
        firstName: firstName,
        lastName: lastName,
        phone: phone || undefined,
        profileImage: profileImage,
      });

      setToastMessage("Profile updated successfully");
      setToastType("success");
      setToastOpen(true);
    } catch (error: any) {
      setToastMessage(error.message || "Failed to update profile");
      setToastType("error");
      setToastOpen(true);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword || !newPassword) {
      setToastMessage("Please fill in both password fields");
      setToastType("error");
      setToastOpen(true);
      return;
    }

    try {
      await changePasswordAsync({
        currentPassword,
        newPassword,
      });

      // Clear password fields after successful change
      setCurrentPassword("");
      setNewPassword("");
      setToastMessage("Password updated successfully");
      setToastType("success");
      setToastOpen(true);
    } catch (error: any) {
      setToastMessage(error.message || "Failed to update password");
      setToastType("error");
      setToastOpen(true);
    }
  };

  const handleBack = () => {
    router.back();
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
  };

  return {
    // State values
    firstName,
    lastName,
    email,
    phone,
    currentPassword,
    newPassword,
    profileImage,
    isLoadingProfile: isLoadingUser || isUpdatingProfile,
    isLoadingPassword: isChangingPassword,
    toastOpen,
    toastMessage,
    toastType,

    // State setters
    setFirstName,
    setLastName,
    setPhone,
    setCurrentPassword,
    setNewPassword,
    setToastOpen,

    // Handlers
    handleProfileSubmit,
    handlePasswordSubmit,
    handleBack,
    handleFileUpload,
    handleRemoveImage,
  };
}
