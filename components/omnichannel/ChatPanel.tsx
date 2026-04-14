import { useEffect } from "react";
import type { Conversation } from "@/types/omnichannel";
import { Forum } from "@mui/icons-material";
import { useLocale, useTranslations } from "@/providers/TranslationProvider";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

type ChatPanelProps = {
  conversation: Conversation | null;
  onClose?: () => void;
};

const ChatPanel = ({ conversation, onClose }: ChatPanelProps) => {
  const t = useTranslations("omnichannel");
  const locale = useLocale();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && conversation && onClose) {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [conversation, onClose]);

  if (!conversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-gray-300 gap-4 bg-white rounded-2xl border border-gray-100 shadow-sm h-full">
        <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center">
          <Forum className="!text-4xl text-gray-200" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-gray-400">
            {t("selectConversation")}
          </p>
          <p className="text-xs text-gray-300 mt-1">
            {t("selectConversationHint")}
          </p>
        </div>
      </div>
    );
  }

  const handleSendMessage = (_content: string) => {
    // Mock - would send via service in real implementation
  };

  const handleSendVoice = (_blob: Blob, _duration: number) => {
    // Would upload the blob via service in real implementation
  };

  return (
    <div className="flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-full">
      <ChatHeader conversation={conversation} onClose={onClose} />
      <ChatMessages messages={conversation.messages} locale={locale} />
      <ChatInput
        onSendMessage={handleSendMessage}
        onSendVoice={handleSendVoice}
      />
    </div>
  );
};

export default ChatPanel;
