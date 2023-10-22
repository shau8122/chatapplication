import { Message, Chat, User } from "@prisma/client";

export type FullChatType = Chat & {
  sender: User,
  seen: User[]
};

export type FullMessageType= Message &{
  users:User[],
  messages:FullChatType
};
