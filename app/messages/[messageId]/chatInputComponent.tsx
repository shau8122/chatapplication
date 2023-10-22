'use client'

import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

interface ChatInputComponentProps{
  placeholder?:string;
  id:string;
  type?:string;
  required?:boolean;
  register:UseFormRegister<FieldValues>;
  errors:FieldErrors
}
const ChatInputComponent:React.FC<ChatInputComponentProps> = ({
  placeholder,
  id,
  type,
  required,
  register,
  errors
}) => {
  return (  
    <div className=" w-full">
      <input
        id={id}
        type={type}
        autoComplete={id}
        {...register(id,{required})}
        placeholder={placeholder}
        className="
        text-black
        font-light
        py-2
        px-4
        bg-sky-100 
        w-full 
        rounded-full
        focus:outline-none
        "
      />
    </div>
  );
}
 
export default ChatInputComponent;