'use client'


import axios from "axios";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { HiPaperAirplane } from "react-icons/hi2";
import useMessages from "@/app/hooks/useMessages";
import ChatInputComponent from "./chatInputComponent";

const ChatInput = () => {
  const {messageId} = useMessages();
  const {
    register,
    handleSubmit,
    setValue,
    formState:{
      errors,
    }
  }= useForm<FieldValues>({
    defaultValues:{
      chat:''
    }
  });
  const onSubmit: SubmitHandler<FieldValues>=(data)=>{
    setValue('chat','',{shouldValidate: true});
    axios.post('/api/chats',{
      ...data,
      messageId
    })
  }
  
  return ( 
    <div className="
    py-4 
    px-4 
    bg-white 
    border-t 
    flex 
    items-center 
    gap-2 
    lg:gap-4 
    w-full
    ">
     
      <form 
        onSubmit={handleSubmit(onSubmit)} 
        className="flex items-center gap-2 lg:gap-4 w-full"
      >
        <ChatInputComponent
          id="chat" 
          register={register} 
          errors={errors} 
          required 
          placeholder="Write a message"
        />
        <button 
          type="submit" 
          className="
            rounded-full 
            p-2 
            bg-sky-500 
            cursor-pointer 
            hover:bg-sky-600 
            transition
          "
        >
          <HiPaperAirplane
            size={18}
            className="text-white"
          />
        </button>
      </form>
    </div>
   );
}
 
export default ChatInput;