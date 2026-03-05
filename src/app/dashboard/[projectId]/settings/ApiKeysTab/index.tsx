"use client";

import { Plus } from "lucide-react";
import ApiKeyCard from "./ApiKeyCard";
import CreateKeyModal from "./CreateKeyModal";
import EmptyApiKeysState from "./EmptyApiKeysState";
import { useApiKeysLogic } from "./logic";
import RevokeKeyModal from "./RevokeKeyModal";
import RotateKeyModal from "./RotateKeyModal";
import SecurityBestPractices from "./SecurityBestPractices";
import ToastNotification from "./ToastNotification";

export default function ApiKeysTab() {
  const {
    apiKeys,
    isLoadingKeys,
    isCreating,
    isRevoking,
    isRotating,
    showCreateModal,
    setShowCreateModal,
    showRotateModal,
    showRevokeModal,
    selectedKey,
    newKeyName,
    setNewKeyName,
    keyType,
    setKeyType,
    keyEnvironment,
    setKeyEnvironment,
    newlyCreatedKey,
    visibleKeys,
    toggleKeyVisibility,
    rotateConfirmText,
    setRotateConfirmText,
    revokeConfirmText,
    setRevokeConfirmText,
    toastOpen,
    setToastOpen,
    toastMessage,
    handleCopy,
    handleCreateKey,
    handleRotateKey,
    handleRevokeKey,
    handleRotateClick,
    handleRevokeClick,
    closeCreateModal,
    closeRotateModal,
    closeRevokeModal,
    newlyRotatedKey,
  } = useApiKeysLogic();

  return (
    <>
      <div className="space-y-6">
        {/* Header with Create Button */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-neutral-200">API Keys</h2>
            <p className="mt-1 text-sm text-neutral-400">
              Manage API keys for your project. Keep them secure and never share
              them publicly.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowCreateModal(true)}
            className="flex cursor-pointer items-center gap-2 rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium hover:bg-indigo-500 transition"
          >
            <Plus size={16} />
            Create Key
          </button>
        </div>

        {/* API Keys List */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 backdrop-blur overflow-hidden">
          {isLoadingKeys ? (
            <div className="flex items-center justify-center p-12">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-neutral-800 border-t-indigo-500 rounded-full animate-spin" />
                <div className="absolute inset-0 w-12 h-12 bg-indigo-600/20 blur-xl rounded-full" />
              </div>
            </div>
          ) : apiKeys.length === 0 ? (
            <EmptyApiKeysState onCreateKey={() => setShowCreateModal(true)} />
          ) : (
            <div className="divide-y divide-neutral-800">
              {apiKeys.map((apiKey) => (
                <ApiKeyCard
                  key={apiKey.id}
                  apiKey={apiKey}
                  isVisible={visibleKeys.has(apiKey.id)}
                  onToggleVisibility={toggleKeyVisibility}
                  onCopy={handleCopy}
                  onRotate={handleRotateClick}
                  onRevoke={handleRevokeClick}
                />
              ))}
            </div>
          )}
        </div>

        {/* Security Best Practices */}
        <SecurityBestPractices />
      </div>

      {/* Modals */}
      <CreateKeyModal
        isOpen={showCreateModal}
        keyName={newKeyName}
        onKeyNameChange={setNewKeyName}
        keyType={keyType}
        onKeyTypeChange={setKeyType}
        keyEnvironment={keyEnvironment}
        onKeyEnvironmentChange={setKeyEnvironment}
        newlyCreatedKey={newlyCreatedKey}
        isCreating={isCreating}
        onCreate={handleCreateKey}
        onClose={closeCreateModal}
      />

      <RotateKeyModal
        isOpen={showRotateModal}
        apiKey={selectedKey}
        confirmText={rotateConfirmText}
        onConfirmTextChange={setRotateConfirmText}
        onRotate={handleRotateKey}
        onClose={closeRotateModal}
        newlyRotatedKey={newlyRotatedKey}
        isRotating={isRotating}
      />

      <RevokeKeyModal
        isOpen={showRevokeModal}
        apiKey={selectedKey}
        confirmText={revokeConfirmText}
        onConfirmTextChange={setRevokeConfirmText}
        isRevoking={isRevoking}
        onRevoke={handleRevokeKey}
        onClose={closeRevokeModal}
      />

      {/* Toast Notification */}
      <ToastNotification
        open={toastOpen}
        message={toastMessage}
        onOpenChange={setToastOpen}
      />
    </>
  );
}
