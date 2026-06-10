"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRoomContext } from "@livekit/components-react";
import { RoomEvent } from "livekit-client";

type ChatMessage = {
  type: "chat";
  user: string;
  message: string;
  timestamp: number;
  localId?: string;
};

export function LiveChat() {
  const room = useRoomContext();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleMessage = (payload: Uint8Array) => {
      try {
        const parsed = JSON.parse(new TextDecoder().decode(payload)) as ChatMessage;

        if (parsed.type !== "chat") {
          return;
        }

        setMessages((prev) => {
          const exists = prev.some(
            (message) =>
              message.timestamp === parsed.timestamp &&
              message.user === parsed.user &&
              message.message === parsed.message,
          );

          return exists ? prev : [...prev, parsed];
        });
      } catch (error) {
        console.error("Chat parse error", error);
      }
    };

    room.on(RoomEvent.DataReceived, handleMessage);

    return () => {
      room.off(RoomEvent.DataReceived, handleMessage);
    };
  }, [room]);

  async function sendMessage(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();

    if (!input.trim()) {
      return;
    }

    const messageData: ChatMessage = {
      type: "chat",
      user: room.localParticipant.name || room.localParticipant.identity || "Anonymous",
      message: input.trim(),
      timestamp: Date.now(),
    };

    await room.localParticipant.publishData(
      new TextEncoder().encode(JSON.stringify(messageData)),
      { reliable: true },
    );

    setMessages((prev) => [
      ...prev,
      {
        ...messageData,
        localId: crypto.randomUUID(),
      },
    ]);
    setInput("");
  }

  return (
    <aside className="flex min-h-[420px] flex-col overflow-hidden rounded-lg border border-border bg-surface lg:min-h-[700px]">
      <div className="border-b border-border bg-surface-soft px-4 py-4">
        <h2 className="text-sm font-black uppercase text-foreground">Live chat</h2>
      </div>

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4">
        {messages.length === 0 ? (
          <div className="mt-8 text-center text-sm text-muted">No messages yet</div>
        ) : null}

        {messages.map((message, index) => (
          <div
            key={message.localId ?? `${message.timestamp}-${index}`}
            className="text-sm leading-6"
          >
            <span className="font-extrabold text-primary">{message.user}</span>
            <span className="ml-2 break-words text-foreground">{message.message}</span>
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      <form
        className="sticky bottom-0 flex gap-2 border-t border-border bg-surface-soft p-3"
        onSubmit={sendMessage}
      >
        <input
          className="min-h-12 flex-1 rounded-md border border-border bg-background px-4 text-base text-foreground outline-none transition placeholder:text-muted focus:border-primary"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Send a message..."
        />
        <button
          className="min-h-12 rounded-md bg-primary px-4 text-sm font-extrabold text-black transition hover:bg-gold"
          type="submit"
        >
          Send
        </button>
      </form>
    </aside>
  );
}
