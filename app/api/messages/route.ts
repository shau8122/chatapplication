import getCurrentUser from "@/app/actions/getCurrentUser";
import { NextResponse } from "next/server";
import prismadb from '@/libs/prismadb'
import { pusherServer } from "@/libs/pusher";

export async function POST(
  request:Request
){
  try {
    const currentUser = await getCurrentUser()
    const body = await request.json();
    const {
      userId,
      isGroup,
      members,
      name
    }=body;
    if(!currentUser?.id || !currentUser?.email){
      return new NextResponse("Unauthorized",{status:401})
    }
    if(isGroup && (!members || members.length<2 || !name)){
      return new NextResponse('Invalid data',{status:400})
    }
    if(isGroup){
      const newMessage = await prismadb.message.create({
        data:{
          name,
          isGroup,
          users:{
            connect:
          [
            ...members.map((member:{value:string})=>({
              id:member.value
            })),
            {
              id:currentUser.id
            }
          ]
        }
        },
        include:{
          users:true
        }
      });
      newMessage.users.forEach((user)=>{
        if(user.email){
          pusherServer.trigger(user.email,'message:new',newMessage)
        }
      })
      return NextResponse.json(newMessage)
    }
    const existingMessages = await prismadb.message.findMany({
      where:{
        OR:[
          {
            userIds:{
              equals:[currentUser.id, userId]
            }
          },
          {
            userIds:{
              equals:[userId, currentUser.id],
            }
          }
        ]
      }
    })
    const singleMessages = existingMessages[0];
    if(singleMessages){
      return NextResponse.json(singleMessages)
    }
    const newMessage = await prismadb.message.create({
      data:{
        users:{
          connect:[
            {
              id: currentUser.id
            },
            {
              id:userId
            }
          ]
        },
      },
      include:{
        users: true
      }
    });
    newMessage.users.forEach((user)=>{
      if(user.email){
        pusherServer.trigger(user.email,'message:new',newMessage)
      }
  
    })
    return NextResponse.json(newMessage);
  } catch (error:any) {
    return new NextResponse('Internal Error', {status:500})
  }
}