import { useNavigate, useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { ParametricEditor } from '../components/ParametricEditor';
import { Message } from '@shared/types';
import { MessageItem, MeshUploadState } from '@/types/misc';
import { useCallback, useEffect, useState } from 'react';
import type { ZoneMaterialOverrides, DetectedZone } from '@/contexts/MaterialContext';
import { CurrentMessageContext } from '@/contexts/CurrentMessageContext';
import { SelectedItemsContext } from '@/contexts/SelectedItemsContext';
import { useConversation } from '@/services/conversationService';
import { BlobContext } from '@/contexts/BlobContext';
import { ColorContext } from '@/contexts/ColorContext';
import { MaterialContext } from '@/contexts/MaterialContext';
import { useMode } from '@/contexts/ModeContext';

export default function EditorView() {
  const { id: conversationId } = useParams();
  const { mode } = useMode();
  const [currentMessage, setCurrentMessage] = useState<Message | null>(null);
  const [images, setImages] = useState<MessageItem[]>([]);
  const [meshUpload, setMeshUpload] = useState<MeshUploadState | null>(null);
  const [blob, setBlob] = useState<Blob | null>(null);
  const [color, setColor] = useState<string>(mode === 'architecture' ? '#C77DFF' : '#00A6FF');
  const [isRealView, setIsRealView] = useState(false);
  const [surfaceMaterial, setSurfaceMaterial] = useState('concrete');
  const [viewMode, setViewMode] = useState<'realistic' | 'wireframe' | 'xray'>('realistic');
  const [zoneMaterials, setZoneMaterials] = useState<ZoneMaterialOverrides>({});
  const setZoneMaterial = useCallback((zone: string, materialKey: string) => {
    setZoneMaterials((prev) => ({ ...prev, [zone]: materialKey }));
  }, []);
  const clearZoneMaterials = useCallback(() => setZoneMaterials({}), []);
  const [detectedZones, setDetectedZones] = useState<DetectedZone[]>([]);
  const navigate = useNavigate();
  const { conversation, isConversationLoading } = useConversation();

  useEffect(() => {
    if (!conversationId) {
      navigate('/');
    }
  }, [conversationId, navigate]);

  if (isConversationLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-adam-bg-secondary-dark text-adam-text-primary">
        <Loader2 className="h-10 w-10 animate-spin" />
      </div>
    );
  }

  if (!conversation.id) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center bg-adam-bg-secondary-dark text-adam-text-primary">
        <span className="text-2xl font-medium">404</span>
        <span className="text-sm">Conversation not found</span>
      </div>
    );
  }

  return (
    <CurrentMessageContext.Provider
      value={{
        currentMessage,
        setCurrentMessage,
      }}
    >
      <BlobContext.Provider value={{ blob, setBlob }}>
        <ColorContext.Provider value={{ color, setColor }}>
          <MaterialContext.Provider value={{ isRealView, setIsRealView, surfaceMaterial, setSurfaceMaterial, viewMode, setViewMode, zoneMaterials, setZoneMaterial, clearZoneMaterials, detectedZones, setDetectedZones }}>
            <SelectedItemsContext.Provider
              value={{ images, setImages, meshUpload, setMeshUpload }}
            >
              <ParametricEditor />
            </SelectedItemsContext.Provider>
          </MaterialContext.Provider>
        </ColorContext.Provider>
      </BlobContext.Provider>
    </CurrentMessageContext.Provider>
  );
}
