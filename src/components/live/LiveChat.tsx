"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useRoomContext } from "@livekit/components-react";
import { RoomEvent } from "livekit-client";
import { Pin, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { hasPermission } from "@/lib/auth/permissions";
import type { Role } from "@/types/roles";

type ChatMessage = {
  id: string;
  type: "chat";
  user: string;
  message: string;
  timestamp: number;
};

type ChatDeleteEvent = {
  id: string;
  type: "chat-delete";
};

type ChatPinEvent = {
  id: string | null;
  type: "chat-pin";
};

type ChatEvent = ChatMessage | ChatDeleteEvent | ChatPinEvent;

export function LiveChat() {
  const room = useRoomContext();
  const { data: session } = useSession();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [pinnedId, setPinnedId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const roles = (session?.user?.roles ?? []) as Role[];
  const canModerate = hasPermission(roles, "canModerateChat");
  const pinnedMessage = messages.find((message) => message.id === pinnedId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const handleMessage = (payload: Uint8Array) => {
      try {
        const parsed = JSON.parse(new TextDecoder().decode(payload)) as ChatEvent;

        if (parsed.type === "chat") {
          setMessages((prev) => {
            const exists = prev.some((message) => message.id === parsed.id);

            return exists ? prev : [...prev, parsed];
          });
          return;
        }

        if (parsed.type === "chat-delete") {
          setMessages((prev) => prev.filter((message) => message.id !== parsed.id));
          setPinnedId((current) => (current === parsed.id ? null : current));
          return;
        }

        if (parsed.type === "chat-pin") {
          setPinnedId(parsed.id);
        }
      } catch (error) {
        console.error("Chat parse error", error);
      }
    };

    room.on(RoomEvent.DataReceived, handleMessage);

    return () => {
      room.off(RoomEvent.DataReceived, handleMessage);
    };
  }, [room]);

  async function publishChatEvent(event: ChatEvent) {
    await room.localParticipant.publishData(
      new TextEncoder().encode(JSON.stringify(event)),
      { reliable: true },
    );
  }

  async function sendMessage(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();

    if (!input.trim()) {
      return;
    }

    const messageData: ChatMessage = {
      id: crypto.randomUUID(),
      type: "chat",
      user:
        session?.user?.name ||
        room.localParticipant.name ||
        room.localParticipant.identity ||
        "Anonymous",
      message: input.trim(),
      timestamp: Date.now(),
    };

    await publishChatEvent(messageData);
    setMessages((prev) => [...prev, messageData]);
    setInput("");
  }

  async function deleteMessage(messageId: string) {
    if (!canModerate) {
      return;
    }

    await publishChatEvent({ id: messageId, type: "chat-delete" });
    setMessages((prev) => prev.filter((message) => message.id !== messageId));
    setPinnedId((current) => (current === messageId ? null : current));
  }

  async function togglePinMessage(messageId: string) {
    if (!canModerate) {
      return;
    }

    const nextPinnedId = pinnedId === messageId ? null : messageId;
    await publishChatEvent({ id: nextPinnedId, type: "chat-pin" });
    setPinnedId(nextPinnedId);
  }

  return (
    <aside className="flex min-h-[420px] flex-col overflow-hidden rounded-lg border border-border bg-surface lg:min-h-[700px]">
      <div className="border-b border-border bg-surface-soft px-4 py-4">
        <h2 className="text-sm font-black uppercase text-foreground">Live chat</h2>
      </div>

      {pinnedMessage ? (
        <div className="border-b border-border bg-primary-soft px-4 py-3">
          <p className="text-xs font-black uppercase text-primary">Pinned</p>
          <p className="mt-1 text-sm leading-6 text-foreground">
            <span className="font-extrabold">{pinnedMessage.user}</span>
            <span className="ml-2">{pinnedMessage.message}</span>
          </p>
        </div>
      ) : null}

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-4">
        {messages.length === 0 ? (
          <div className="mt-8 text-center text-sm text-muted">No messages yet</div>
        ) : null}

        {messages.map((message) => (
          <div key={message.id} className="group text-sm leading-6">
            <div className="flex items-start justify-between gap-3">
              <p className="min-w-0 flex-1">
                <span className="font-extrabold text-primary">{message.user}</span>
                <span className="ml-2 break-words text-foreground">
                  {message.message}
                </span>
              </p>

              {canModerate ? (
                <div className="flex shrink-0 gap-1 opacity-100 sm:opacity-0 sm:transition sm:group-hover:opacity-100">
                  <button
                    className="flex h-8 w-8 items-center justify-center rounded-md bg-surface-soft text-muted transition hover:text-gold"
                    type="button"
                    aria-label="Pin message"
                    onClick={() => togglePinMessage(message.id)}
                  >
                    <Pin size={14} />
                  </button>
                  <button
                    className="flex h-8 w-8 items-center justify-center rounded-md bg-surface-soft text-muted transition hover:text-live"
                    type="button"
                    aria-label="Delete message"
                    onClick={() => deleteMessage(message.id)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ) : null}
            </div>
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
