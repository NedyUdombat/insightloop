import { useState } from "react";
import type { IApiKey } from "@/api/types/IApiKey";
import type { ApiKeyType, Environment } from "@/generated/prisma/enums";
import useCreateApiKey from "@/queries/apiKeys/useCreateApiKey";
import useGetApiKeys from "@/queries/apiKeys/useGetApiKeys";
import useRevokeApiKey from "@/queries/apiKeys/useRevokeApiKey";
import useRotateApiKey from "@/queries/apiKeys/useRotateApiKey";
import { useProject } from "../../ProjectContext";

export function useApiKeysLogic() {
  const { projectId } = useProject();

  // TanStack Query hooks
  const { data: apiKeysData, isPending: isLoadingKeys } =
    useGetApiKeys(projectId);
  const { createApiKey, isPending: isCreating } = useCreateApiKey();
  const { revokeApiKey, isPending: isRevoking } = useRevokeApiKey();
  const { rotateApiKey, isPending: isRotating } = useRotateApiKey();

  const apiKeys = apiKeysData?.apiKeys || [];

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRotateModal, setShowRotateModal] = useState(false);
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [selectedKey, setSelectedKey] = useState<IApiKey | null>(null);
  const [newKeyName, setNewKeyName] = useState("");
  const [keyType, setKeyType] = useState<ApiKeyType>("INGESTION");
  const [keyEnvironment, setKeyEnvironment] =
    useState<Environment>("DEVELOPMENT");
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null);
  const [newlyRotatedKey, setNewlyRotatedKey] = useState<string | null>(null);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());
  const [rotateConfirmText, setRotateConfirmText] = useState("");
  const [revokeConfirmText, setRevokeConfirmText] = useState("");

  // Toast state
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const showToast = (message: string) => {
    setToastMessage(message);
    setToastOpen(true);
  };

  const toggleKeyVisibility = (keyId: string) => {
    setVisibleKeys((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(keyId)) {
        newSet.delete(keyId);
      } else {
        newSet.add(keyId);
      }
      return newSet;
    });
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast("Copied to clipboard");
  };

  const handleCreateKey = () => {
    if (!newKeyName.trim()) {
      return;
    }

    createApiKey(
      {
        name: newKeyName,
        type: keyType,
        environment: keyEnvironment,
        projectId,
      },
      {
        onSuccess: (response) => {
          setNewlyCreatedKey(response.data?.apiKey.value || null);
          setNewKeyName("");
          setKeyType("INGESTION");
          setKeyEnvironment("DEVELOPMENT");
          showToast("API key created successfully");
          // Keep modal open to show the newly created key
        },
        onError: (error) => {
          showToast(
            error instanceof Error ? error.message : "Failed to create API key",
          );
        },
      },
    );
  };

  const handleRotateKey = () => {
    if (!selectedKey || rotateConfirmText !== "ROTATE") {
      return;
    }

    rotateApiKey(
      {
        apiKeyId: selectedKey.id,
        projectId,
      },
      {
        onSuccess: (response) => {
          setNewlyRotatedKey(response.data?.apiKey || null);
          setRotateConfirmText("");
          showToast("API key rotated successfully");
          // Keep modal open to show the newly rotated key (user closes it manually)
        },
        onError: (error) => {
          showToast(
            error instanceof Error ? error.message : "Failed to rotate API key",
          );
          setShowRotateModal(false);
          setSelectedKey(null);
          setRotateConfirmText("");
        },
      },
    );
  };

  const handleRevokeKey = () => {
    if (!selectedKey || revokeConfirmText !== selectedKey.name) {
      return;
    }

    revokeApiKey(
      {
        apiKeyId: selectedKey.id,
        projectId,
      },
      {
        onSuccess: () => {
          setSelectedKey(null);
          setRevokeConfirmText("");
          setShowRevokeModal(false);
          showToast("API key revoked successfully");
        },
        onError: (error) => {
          showToast(
            error instanceof Error ? error.message : "Failed to revoke API key",
          );
        },
      },
    );
  };

  const handleRotateClick = (apiKey: IApiKey) => {
    setSelectedKey(apiKey);
    setShowRotateModal(true);
  };

  const handleRevokeClick = (apiKey: IApiKey) => {
    setSelectedKey(apiKey);
    setShowRevokeModal(true);
  };

  const closeCreateModal = () => {
    setShowCreateModal(false);
    setNewKeyName("");
    setNewlyCreatedKey(null);
    setKeyType("INGESTION");
    setKeyEnvironment("DEVELOPMENT");
  };

  const closeRotateModal = () => {
    setShowRotateModal(false);
    setSelectedKey(null);
    setRotateConfirmText("");
    setNewlyCreatedKey(null);
  };

  const closeRevokeModal = () => {
    setShowRevokeModal(false);
    setSelectedKey(null);
    setRevokeConfirmText("");
  };

  return {
    // Data
    apiKeys,
    isLoadingKeys,
    isCreating,
    isRevoking,
    isRotating,

    // Modal state
    showCreateModal,
    setShowCreateModal,
    showRotateModal,
    showRevokeModal,

    // Selected key
    selectedKey,

    // Create modal state
    newKeyName,
    setNewKeyName,
    keyType,
    setKeyType,
    keyEnvironment,
    setKeyEnvironment,
    newlyCreatedKey,

    newlyRotatedKey,

    // Visibility state
    visibleKeys,
    toggleKeyVisibility,

    // Confirm text state
    rotateConfirmText,
    setRotateConfirmText,
    revokeConfirmText,
    setRevokeConfirmText,

    // Toast state
    toastOpen,
    setToastOpen,
    toastMessage,

    // Handlers
    handleCopy,
    handleCreateKey,
    handleRotateKey,
    handleRevokeKey,
    handleRotateClick,
    handleRevokeClick,
    closeCreateModal,
    closeRotateModal,
    closeRevokeModal,
  };
}
