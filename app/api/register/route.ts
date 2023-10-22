import bcrypt from 'bcrypt'

import prismadb from '@/libs/prismadb'
import { NextResponse } from "next/server"

export async function POST(
  request: Request
) {
  try {
    const body = await request.json();
    const {
      email,
      name,
      password,
      image
    } = body;

    if (!email || !name || !password || !image) {
      return new NextResponse('Missing info', { status: 400 });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const exist = await prismadb.user.findUnique({
      where:{
        email
      }
    })
    if(exist){
      return new NextResponse("Email already exists",{status:400})
    }
    const user = await prismadb.user.create({
      data: {
        email,
        name,
        hashedPassword,
        image
      }
    });
    return NextResponse.json(user);
  } catch (error) {
    console.log(error,'REGISTRATION_ERROR');
    return new NextResponse('Internal Error',{status:500})
  }
}