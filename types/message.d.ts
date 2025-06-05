import { MessageStatus } from "@prisma/client";

export interface Message {
  id: string;
  name: string; // Sender's full name
  email: string; // Sender's email
  title: string; // Message subject
  details: string; // Message content
  status: MessageStatus; // Status of the message (e.g., "new", "in-progress", "resolved")
  createdAt: string; // When message was sent
  updatedAt: string; // Last modification
  reply?: Reply;
}

export interface Reply {
  id: string;
  messageId: string; // ID of the message being replied to
  replyText: string; // Content of the reply
  createdAt: string; // When the reply was sent
  updatedAt: string; // Last modification
}
