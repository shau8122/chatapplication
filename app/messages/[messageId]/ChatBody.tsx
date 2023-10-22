'use client';

import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { FullChatType } from "@/app/types";
import useMessages from "@/app/hooks/useMessages";
import ChatBodyBox from "./ChatBodyBox";
import { pusherClient } from "@/libs/pusher";
import { find } from "lodash";

interface BodyProps {
  initialChat: FullChatType[];
}

const ChatBody: React.FC<BodyProps> = ({ initialChat = [] }) => {
  const bottomRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState(initialChat);
  
  const { messageId } = useMessages();

  useEffect(() => {
    axios.post(`/api/messages/${messageId}/seen`);
  }, [messageId]);

  useEffect(() => {
    pusherClient.subscribe(messageId);
    bottomRef?.current?.scrollIntoView();

    const chatHandler = (message: FullChatType) => {
      axios.post(`/api/messages/${messageId}/seen`);

      setMessages((current) => {
        if (find(current, { id: message.id })) {
          return current;
        }
        return [...current, message]
      });
      
      bottomRef?.current?.scrollIntoView();
    };

    const updateChatHandler = (newChat: FullChatType) => {
      setMessages((current) => current.map((currentChat) => {
        if (currentChat.id === newChat.id) {
          return newChat;
        }
  
        return currentChat;
      }))
    };
  

    pusherClient.bind('chats:new', chatHandler)
    pusherClient.bind('chats:update', updateChatHandler);

    return () => {
      pusherClient.unsubscribe(messageId)
      pusherClient.unbind('chats:new', chatHandler)
      pusherClient.unbind('chats:update', updateChatHandler)
    }
  }, [messageId]);

  return ( 
    <div className="flex-1 overflow-y-auto">
      {messages.map((message, i) => (
        <ChatBodyBox
          isLast={i === messages.length - 1} 
          key={message.id} 
          data={message}
        />
      ))}
      <div className="pt-24" ref={bottomRef} />
    </div>
  );
}
 
export default ChatBody;