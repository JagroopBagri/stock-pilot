"use client"
import { UserContext, UserContextType } from "@/components/Store"
import { useContext } from "react"
import { useRouter } from "next/navigation"


export default function HomePage() {
  const {user, setUser} = useContext(UserContext) as UserContextType;
  const router = useRouter();
 
  if(user?.id){
    router.push("/dashboard")
  }else{
    router.push("/login")
  }
  return <></>
}