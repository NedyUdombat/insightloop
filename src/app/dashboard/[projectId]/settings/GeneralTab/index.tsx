"use client";

import useProjectSettingsLogic from "../logic";
import DangerZone from "./DangerZone";
import ErrorMessage from "./ErrorMessage";
import GeneralSettings from "./GeneralSettings";
import PreferencesSection from "./PreferencesSection";
import SaveButton from "./SaveButton";
import ToastNotification from "./ToastNotification";

export default function GeneralTab() {
  const {
    project,
    projectId,
    projectName,
    setProjectName,
    showDeleteConfirm,
    setShowDeleteConfirm,
    deleteConfirmText,
    setDeleteConfirmText,
    error,
    setError,
    preferences,
    setPreferences,
    toastOpen,
    setToastOpen,
    toastMessage,
    toastType,
    handleUpdateProject,
    handleDeleteProject,
    isUpdating,
    isDeleting,
  } = useProjectSettingsLogic();

  return (
    <>
      {project && (
        <>
          <div className="space-y-6">
            <ErrorMessage error={error} />

            <GeneralSettings
              projectName={projectName}
              setProjectName={setProjectName}
              projectId={projectId}
              createdAt={project.createdAt}
            />

            <PreferencesSection
              preferences={preferences}
              setPreferences={setPreferences}
            />

            <SaveButton onClick={handleUpdateProject} isUpdating={isUpdating} />

            <DangerZone
              showDeleteConfirm={showDeleteConfirm}
              setShowDeleteConfirm={setShowDeleteConfirm}
              deleteConfirmText={deleteConfirmText}
              setDeleteConfirmText={setDeleteConfirmText}
              projectName={project.name}
              handleDeleteProject={handleDeleteProject}
              isDeleting={isDeleting}
              setError={setError}
            />
          </div>

          <ToastNotification
            open={toastOpen}
            onOpenChange={setToastOpen}
            message={toastMessage}
            type={toastType}
          />
        </>
      )}
    </>
  );
}
