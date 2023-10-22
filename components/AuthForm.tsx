"use client"
import Image from "next/image";
import { useState,useEffect } from "react";
import axios from "axios";
import { signIn , useSession} from "next-auth/react";
import {redirect, useRouter} from 'next/navigation'
import { toast } from "react-hot-toast";
import { CldUploadButton } from "next-cloudinary";
import { HiPhoto } from "react-icons/hi2";
import { sign } from "crypto";



const AuthForm = () => {
  const session = useSession();
  const router = useRouter();
  const [useForWhat, setUseForWhat] = useState('login')
  const [data,setData]= useState({
    email:'',
    password:'',
    name:'',
    image:''
  })
  useEffect(()=>{
    if(session?.status==='authenticated'){
      router.push('/users')
    }
  },[session?.status,router]);
  const handleSubmit=async (e:any)=>{
    e.preventDefault();
    if(useForWhat==='register'){
      console.log(data)
      axios.post('/api/register',data)
      .then(()=>
      {
        toast.success('registration successful')
        signIn('credentials',{
          ...data,
          redirect:false
        })
        .then(
          (callback)=>{
            if(callback?.error){
              toast.error('Invalid Credentials')
            }
            if(callback?.ok){
              toast.success('Logged in!')
              router.push('/users')
            }
          }
        )
      }
      )
      .catch(()=>console.log("some error occured in post request for registeration"))
    }
    if(useForWhat==='login'){
      await signIn('credentials',{
        ...data,
        redirect:false
      })
      .then(
        (callback)=>{
          if(callback?.error){
            toast.error('Invalid Credentials')
          }
          if(callback?.ok){
            toast.success('Logged in!')
            router.push('/users')
          }
        }
      )
      .catch((error:any)=>{
        console.log('some error ocurred in sign in',error)
        toast.error('some error ocurred')
      })
    }
    console.log(data)
  }
  const handleUpload=(result:any)=>{
    console.log(result)
    setData((prevData)=>({...prevData,image:result.info.secure_url}))
  }
  return ( 
    <div className="flex justify-center items-center flex-col  w-2/6 bg-blue-200 rounded-xl border-blue-700 border-t-4">
      <h1 className="mt-3 text-lg">Welcome to ChatApp</h1>
      <h1 className=" font-semibold text-2xl text-blue-900 m-8">
        {useForWhat==='login'?'Login':'Register'}
      </h1>
      <form onSubmit={handleSubmit} className="w-full flex flex-col justify-center items-center">
        {useForWhat==='register' &&
        <div className="w-5/6 flex justify-center items-center">
          <input type="text" className="w-full p-2 m-2  text-rose-950 placeholder-slate-400 rounded-lg border-2 border-blue-700
            focus:outline-none"
             placeholder="Name"
             name="name"
             value={data.name}
             onChange={(e) => setData((prevData) => ({...prevData, [e.target.name]: e.target.value}))}

             required
          />
        </div>
        }
        <div className="w-5/6 flex justify-center items-center">
            <input type="email" className="w-full p-2 m-2  text-rose-950 placeholder-slate-400 rounded-lg border-2 border-blue-700
              focus:outline-none
            " placeholder="Email"
            name="email"
            value={data.email}
            onChange={(e) => setData((prevData) => ({...prevData, [e.target.name]: e.target.value}))}

            required
            />
        </div>
        <div className="w-5/6 flex justify-center items-center">
            <input type="password" className="w-full p-2 m-2  text-rose-950 placeholder-slate-400 rounded-lg border-2 border-blue-700
              focus:outline-none
            " placeholder="Paasword"
            name="password"
            value={data.password}
            onChange={(e) => setData((prevData) => ({...prevData, [e.target.name]: e.target.value}))}

            required
            />
        </div>
        {useForWhat==='register' &&
        <div className="w-5/6 flex justify-center items-center">
          <CldUploadButton
        options={{maxFiles:1}}
        onUpload={handleUpload}
        uploadPreset="qpqfnsmj"
      >
        <div className="w-full p-2 m-2 flex justify-between items-center   text-rose-950 placeholder-slate-400 rounded-lg border-2 border-blue-700
              focus:outline-none ">
        {
          data.image?
          <Image src={data.image} alt="proifle-image" width={50} height={50} className="rounded-full w-10 h-10" />
          :
          <HiPhoto size={30} className="text-blue-900" /> 
        }
        <p className=" text-blue-900 font-semibold
            ">
              Upload Your Profile Pic</p>
        </div>
      </CldUploadButton>
      </div>
        }
        {useForWhat==='login'?
          <div className="w-5/6 flex flex-col  justify-between  items-center">
            
            <button type="submit" className="flex w-[96%] justify-center items-center py-2 m-2 bg-blue-800 text-white cursor-pointer font-bold text-lg rounded-lg">Sign In</button>
          </div>
        : 

          <div className="w-5/6  flex justify-between  items-center">
            <button type="submit" className="flex w-[96%] justify-center items-center px-8 py-2 m-2 bg-blue-800 text-white cursor-pointer font-bold text-lg rounded-lg">Sign Up</button>
          </div>
        }
      </form>
      {
        useForWhat==='login'?
        <div onClick={()=>setUseForWhat('register')} className="text-sm p-2 m-2 text-slate-700">
          Are you a new user? <span className=" underline cursor-pointer">Register</span>
        </div>
        :
        <div onClick={()=>setUseForWhat('login')} className="text-sm p-2 m-2 text-slate-700">
          Already Register? <span className=" underline cursor-pointer">Sign in</span>
        </div>
      }
    </div>
   );
}
 
export default AuthForm;