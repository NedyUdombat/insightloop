"use client";

import * as Toast from "@radix-ui/react-toast";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  Loader2,
  Save,
  X,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { PasswordStrength } from "@/components/auth/PasswordStrength";
import { useProfileLogic } from "./useProfileLogic";

type TabType = "personal" | "security";

export default function ProfilePage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<TabType>("personal");

  const {
    firstName,
    lastName,
    email,
    phone,
    currentPassword,
    newPassword,
    profileImage,
    isLoadingProfile,
    isLoadingPassword,
    toastOpen,
    toastMessage,
    toastType,
    setFirstName,
    setLastName,
    setPhone,
    setCurrentPassword,
    setNewPassword,
    setToastOpen,
    handleProfileSubmit,
    handlePasswordSubmit,
    handleBack,
    handleFileUpload,
    handleRemoveImage,
  } = useProfileLogic();

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100">
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <button
            type="button"
            onClick={handleBack}
            className="flex items-center gap-2 text-neutral-400 hover:text-neutral-300 transition-colors mb-4 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back</span>
          </button>
          <h1 className="text-3xl font-semibold text-white mb-2">
            Profile Settings
          </h1>
          <p className="text-neutral-400">
            Manage your personal information and preferences
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-6 border-b border-neutral-800">
          <div className="flex gap-6">
            <button
              type="button"
              onClick={() => setActiveTab("personal")}
              className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                activeTab === "personal"
                  ? "border-white text-white"
                  : "border-transparent text-neutral-400 hover:text-neutral-300"
              }`}
            >
              Personal Information
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("security")}
              className={`pb-3 px-1 text-sm font-medium border-b-2 transition-colors cursor-pointer ${
                activeTab === "security"
                  ? "border-white text-white"
                  : "border-transparent text-neutral-400 hover:text-neutral-300"
              }`}
            >
              Security
            </button>
          </div>
        </div>

        {/* Personal Information Tab */}
        {activeTab === "personal" && (
          <form onSubmit={handleProfileSubmit}>
            {/* Profile Picture Section */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-medium text-white mb-4">
                Profile Picture
              </h2>
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-neutral-800 flex items-center justify-center text-neutral-400 text-2xl font-semibold overflow-hidden">
                    {profileImage ? (
                      <Image
                        src={profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span>
                        {firstName?.[0] || "U"}
                        {lastName?.[0] || ""}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (profileImage) {
                        handleRemoveImage();
                      } else {
                        fileInputRef.current?.click();
                      }
                    }}
                    className="absolute bottom-0 right-0 p-2 bg-white text-black rounded-full hover:bg-neutral-200 transition-colors cursor-pointer"
                  >
                    {profileImage ? (
                      <X className="w-4 h-4" />
                    ) : (
                      <Camera className="w-4 h-4" />
                    )}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {/* Personal Information Section */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-medium text-white mb-4">
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-neutral-300 mb-2"
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-md text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-700"
                  />
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-neutral-300 mb-2"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-md text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-700"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-neutral-300 mb-2"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    disabled
                    placeholder="john.doe@example.com"
                    className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-md text-sm text-neutral-500 placeholder-neutral-500 cursor-not-allowed"
                  />
                  <p className="text-xs text-neutral-500 mt-1">
                    Email cannot be changed
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-neutral-300 mb-2"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-md text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-700"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2 text-neutral-400 text-sm hover:text-neutral-300 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoadingProfile}
                className="px-6 py-2 bg-white text-black rounded-md text-sm font-medium hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
              >
                {isLoadingProfile ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <form onSubmit={handlePasswordSubmit}>
            {/* Password Section */}
            <div className="bg-neutral-900 border border-neutral-800 rounded-lg p-6 mb-6">
              <h2 className="text-lg font-medium text-white mb-4">
                Change Password
              </h2>
              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="currentPassword"
                    className="block text-sm font-medium text-neutral-300 mb-2"
                  >
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-md text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-700"
                  />
                </div>
                <div>
                  <label
                    htmlFor="newPassword"
                    className="block text-sm font-medium text-neutral-300 mb-2"
                  >
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-md text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-700"
                  />
                </div>
                <PasswordStrength password={newPassword} />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleBack}
                className="px-4 py-2 text-neutral-400 text-sm hover:text-neutral-300 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoadingPassword || !currentPassword || !newPassword}
                className="px-6 py-2 bg-white text-black rounded-md text-sm font-medium hover:bg-neutral-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
              >
                {isLoadingPassword ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Update Password
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Toast Notification */}
      <Toast.Provider swipeDirection="right">
        <Toast.Root
          className="bg-neutral-900 border border-neutral-800 rounded-lg p-4 shadow-lg flex items-center gap-3 data-[state=open]:animate-slideIn data-[state=closed]:animate-hide data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=cancel]:translate-x-0 data-[swipe=end]:animate-swipeOut"
          open={toastOpen}
          onOpenChange={setToastOpen}
        >
          {toastType === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-green-500" />
          ) : (
            <XCircle className="w-5 h-5 text-red-500" />
          )}
          <Toast.Description className="text-sm text-neutral-300">
            {toastMessage}
          </Toast.Description>
        </Toast.Root>
        <Toast.Viewport className="fixed bottom-0 right-0 flex flex-col p-6 gap-2 w-96 max-w-[100vw] m-0 list-none z-50 outline-none" />
      </Toast.Provider>
    </div>
  );
}
