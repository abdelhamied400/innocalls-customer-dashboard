import type { Message } from "@/types/omnichannel";
import MessageBubble from "./MessageBubble";
import { useEffect, useRef } from "react";

type ChatMessagesProps = {
  messages: Message[];
  locale: string;
};

const ChatMessages = ({ messages, locale }: ChatMessagesProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-5 py-4 bg-gray-50/60">
      {messages.map((msg, idx) => {
        const prev = messages[idx - 1];
        const next = messages[idx + 1];
        const showSender = !prev || prev.direction !== msg.direction;
        const isLastInGroup = !next || next.direction !== msg.direction;

        return (
          <MessageBubble
            key={msg.id}
            message={msg}
            locale={locale}
            showSender={showSender}
            isLastInGroup={isLastInGroup}
          />
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatMessages;
