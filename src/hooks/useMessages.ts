import { useRef, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { messagesApi } from "@/lib/api";
import { transformChats, type ChatUIFormat } from "@/lib/chatTransform";

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  createdAt: string;
  attachments?: Array<{
    id: string;
    fileName: string;
    filePath: string;
    fileSize: number;
    mimeType: string;
    encryptedKey: string;
    createdAt: string;
  }>;
}

export interface SendMessageData {
  chatId: string;
  content: string;
}

export interface Chat {
  id: string;
  name: string;
  description?: string;
  members: Array<{
    id: string;
    name: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

// Get all chats for current user with transformed UI format
export function useChats() {
  const { user, token } = useAuth();

  return useQuery<ChatUIFormat[]>({
    queryKey: ["chats", user?.id],
    queryFn: async () => {
      if (!token || !user?.id) return [];
      const response = await messagesApi.getChats(token);
      const chats = (response || []) as Chat[];
      return transformChats(chats, user.id);
    },
    enabled: !!user && !!token,
    refetchInterval: 5000,
  });
}

// Legacy alias for backward compatibility
export function useConversations() {
  return useChats();
}

// Get messages for a specific chat
export function useMessages(chatId: string | null) {
  const { user, token } = useAuth();

  return useQuery<Message[]>({
    queryKey: ["messages", chatId],
    queryFn: async (): Promise<Message[]> => {
      if (!chatId || !token) return [];
      return await messagesApi.getMessages(chatId, token);
    },
    enabled: !!user && !!chatId && !!token,
  });
}

// Get chat details
export function useChatDetails(chatId: string | null) {
  const { token } = useAuth();

  return useQuery<Chat>({
    queryKey: ["chatDetails", chatId],
    queryFn: async () => {
      if (!chatId || !token) throw new Error("Chat ID and token required");
      const response = await messagesApi.getChatDetails(chatId, token);
      return response as unknown as Chat;
    },
    enabled: !!chatId && !!token,
  });
}

// Send message mutation
export function useSendMessage() {
  const queryClient = useQueryClient();
  const { user, token } = useAuth();

  return useMutation({
    mutationFn: async (data: SendMessageData) => {
      if (!token) throw new Error("Not authenticated");
      const response = await messagesApi.sendMessage(
        data.chatId,
        data.content,
        token
      );
      return response as Message;
    },
    onSuccess: (newMessage) => {
      queryClient.setQueryData<Message[]>(
        ["messages", newMessage.chatId],
        (old) => [...(old || []), newMessage]
      );
      queryClient.invalidateQueries({ queryKey: ["chats", user?.id] });
    },
  });
}

// Start/fetch direct chat
export function useStartDirectChat() {
  const queryClient = useQueryClient();
  const { user, token } = useAuth();

  return useMutation({
    mutationFn: async (data: string | { participantId: string; role?: string }) => {
      if (!token) throw new Error("Not authenticated");
      const participantId = typeof data === 'string' ? data : data.participantId;
      const role = typeof data === 'string' ? undefined : data.role;
      const chat = await messagesApi.startDirectChat(participantId, token, role);
      return chat.id; // ✅ RETURN ONLY ID
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats", user?.id] });
    },
  });
}

// Add chat member
export function useAddChatMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      chatId: string;
      userId: string;
      token: string;
    }) => {
      const response = await messagesApi.addChatMember(
        data.chatId,
        data.userId,
        data.token
      );
      return response;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["chatDetails", variables.chatId],
      });
    },
  });
}

// Remove chat member
export function useRemoveChatMember() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      chatId: string;
      userId: string;
      token: string;
    }) => {
      const response = await messagesApi.removeChatMember(
        data.chatId,
        data.userId,
        data.token
      );
      return response;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["chatDetails", variables.chatId],
      });
    },
  });
}

// Delete chat
export function useDeleteChat() {
  const queryClient = useQueryClient();
  const { user, token } = useAuth();

  return useMutation({
    mutationFn: async (chatId: string) => {
      if (!token) throw new Error("Not authenticated");
      const response = await messagesApi.deleteChat(chatId, token);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chats", user?.id] });
    },
  });
}

// Legacy alias for backward compatibility
export function useDeleteConversation() {
  return useDeleteChat();
}

// Send voice message mutation
export function useSendVoiceMessage() {
  const queryClient = useQueryClient();
  const { user, token } = useAuth();

  return useMutation({
    mutationFn: async ({ chatId, file }: { chatId: string; file: File }) => {
      if (!token) throw new Error("Not authenticated");
      return messagesApi.uploadVoice(chatId, file, token);
    },
    onSuccess: (res, vars) => {
      if (res.status === "accepted") {
        queryClient.invalidateQueries({
          queryKey: ["messages", vars.chatId]
        });
        queryClient.invalidateQueries({
          queryKey: ["chats", user?.id]
        });
      }
    }
  });
}

export function useVoiceRecorder() {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);

  const [isRecording, setIsRecording] = useState(false);

  const start = async () => {
    if (isRecording) return;

    if (!navigator.mediaDevices?.getUserMedia) {
      throw new Error("Audio recording not supported in this browser");
    }

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef.current = stream;

    const recorder = new MediaRecorder(stream, {
      mimeType: "audio/webm",
    });

    chunksRef.current = [];

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    recorder.start();
    mediaRecorderRef.current = recorder;
    setIsRecording(true);
  };

  const stop = async (): Promise<File | null> => {
    const recorder = mediaRecorderRef.current;
    if (!recorder) return null;

    return new Promise((resolve) => {
      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: "audio/webm",
        });

        // cleanup
        streamRef.current?.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
        mediaRecorderRef.current = null;
        chunksRef.current = [];
        setIsRecording(false);

        if (blob.size === 0) {
          resolve(null);
          return;
        }

        const file = new File(
          [blob],
          `voice-${Date.now()}.webm`,
          { type: "audio/webm" }
        );

        resolve(file);
      };

      recorder.stop();
    });
  };

  return {
    isRecording,
    start,
    stop,
  };
}

