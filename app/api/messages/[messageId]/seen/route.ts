import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prismadb from '@/libs/prismadb'
import { pusherServer } from "@/libs/pusher";

interface Iparams{
  messageId?:string;
};

export async function POST(
  request: Request,
  {params}:{params: Iparams}
){
  try {
    const currentUser = await getCurrentUser();
    const {
      messageId
    } = params;
    if(!currentUser?.id || !currentUser?.email){
      return new NextResponse('Unauthorized',{status:401})
    }
    const message = await prismadb?.message.findUnique({
      where:{
        id:messageId
      },
      include:{
        chats:{
          include:{
            seen:true
          }
        },
        users:true
      }
    });
    if(!message){
      return new NextResponse('Invalid Id',{status:400})
    }
    const lastChat = message.chats[message.chats.length-1];
    if(!lastChat){
      return NextResponse.json(message);
    }
    const updatedChat = await prismadb.chat.update({
      where: {
        id: lastChat.id
      },
      include: {
        sender: true,
        seen: true,
      },
      data: {
        seen: {
          connect: {
            id: currentUser.id
          }
        }
      }
    });
    await pusherServer.trigger(currentUser.email,'chat:update',{
      id:messageId,
      chats:[updatedChat]
    });
    if(lastChat.seenIds.indexOf(currentUser.id)===-1){
      return NextResponse.json(message);
    }
    await pusherServer.trigger(messageId!,'chat:update',{
      updatedChat
    })
    return NextResponse.json(updatedChat);
  } catch (error:any) {
    console.log(error,'ERROR_MESSAGE_SEEN')
    return new NextResponse("Internal Error",{status:500})
    
  }
}