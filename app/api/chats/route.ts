import getCurrentUser from "@/app/actions/getCurrentUser";
import prisma from '@/libs/prismadb'
import { pusherServer } from "@/libs/pusher";
import { NextResponse } from "next/server";


export async function POST(
  request:Request
){
  try {
    const currentUser = await getCurrentUser();
    const body= await request.json();
    const {
      chat,
      messageId
    }=body;
    if(!currentUser?.id || !currentUser?.email){
      return new Response("Unauthorized",{status : 401});
    
    }
    const newChat = await prisma.chat.create({
      data:{
        body:chat,
        message:{
          connect:{
            id:messageId
          }
        },
        sender:{
          connect:{
            id:currentUser.id
          }
        },
        seen:{
          connect:{
            id:currentUser.id
          }
        },
      },
      include:{
        seen:true,
        sender:true
      }
    });
    const updatedMessage = await prisma.message.update({
      where:{
        id:messageId

      },
      data:{
        lastMessageAt: new Date(),
        chats:{
          connect:{
            id:newChat.id
          }
        }
      },
      include:{
        users:true,
        chats:{
          include:{
            seen : true
          }
        }
      }
    });
    await pusherServer.trigger(messageId,'chats:new',newChat)
    const lastChat = updatedMessage.chats[updatedMessage.chats.length-1];
    updatedMessage.users.map((user)=>{
      pusherServer.trigger(user.email!,'message:update',{
        id:messageId,
        chat:[lastChat]
      })
    })
    return NextResponse.json(newChat);
  } catch (error:any) {
    console.log(error,'ERROR_MESSAGES');
    return new NextResponse('InternalError',{status:500})
    
  }
}