"use client";

import CreateProjectForm from "@/components/project/CreateProjectForm";
import useCreateProjectLogic from "./logic";

export default function CreateProjectPage() {
  const {
    name,
    setName,
    settings,
    setSettings,
    loading,
    error,
    handleSubmit,
    toastOpen,
    setToastOpen,
    toastMessage,
    toastType,
  } = useCreateProjectLogic();

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex items-center justify-center px-6 py-12">
      <CreateProjectForm
        mode="regular"
        name={name}
        setName={setName}
        settings={settings}
        setSettings={setSettings}
        loading={loading}
        error={error}
        onSubmit={handleSubmit}
        toastOpen={toastOpen}
        setToastOpen={setToastOpen}
        toastMessage={toastMessage}
        toastType={toastType}
      />
    </div>
  );
}
