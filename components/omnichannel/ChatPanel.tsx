"use client";

import { useEffect, useState } from "react";
import type { Conversation, Message } from "@/types/omnichannel";
import { Forum } from "@mui/icons-material";
import { useLocale, useTranslations } from "@/providers/TranslationProvider";
import omnichannelService from "@/services/omnichannel.service";
import useAuth from "@/hooks/useAuth";
import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";

type ChatPanelProps = {
  conversation: Conversation | null;
  onClose?: () => void;
  onMessageSent?: () => void;
};

const ChatPanel = ({ conversation, onClose, onMessageSent }: ChatPanelProps) => {
  const t = useTranslations("omnichannel");
  const locale = useLocale();
  const { data: auth } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);

  // Sync messages from conversation prop
  useEffect(() => {
    setMessages(conversation?.messages ?? []);
  }, [conversation?.id, conversation?.messages]);

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

  const senderName = auth?.user?.name ?? "Agent";

  const handleSendMessage = async (content: string) => {
    try {
      const newMsg = await omnichannelService.sendMessage(conversation.id, {
        content,
        direction: "outbound",
        senderName,
      });
      setMessages((prev) => [...prev, newMsg]);
      onMessageSent?.();
    } catch {
      // Could show a toast here
    }
  };

  const handleSendVoice = async (blob: Blob, duration: number) => {
    try {
      const newMsg = await omnichannelService.sendVoiceMessage(
        conversation.id,
        {
          file: blob,
          direction: "outbound",
          senderName,
          duration,
        },
      );
      setMessages((prev) => [...prev, newMsg]);
      onMessageSent?.();
    } catch {
      // Could show a toast here
    }
  };

  return (
    <div className="flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-full">
      <ChatHeader conversation={conversation} onClose={onClose} />
      <ChatMessages messages={messages} locale={locale} />
      <ChatInput
        onSendMessage={handleSendMessage}
        onSendVoice={handleSendVoice}
      />
    </div>
  );
};

export default ChatPanel;
