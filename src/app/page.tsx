"use client"
import { UserContext, UserContextType } from "@/components/Store"
import { useContext, useEffect } from "react"
import { useRouter } from "next/navigation"
import { CircularProgress, Box } from '@mui/material';

export default function HomePage() {
  const {user} = useContext(UserContext) as UserContextType;
  const router = useRouter();
 
  useEffect(() => {
    if (user?.id) {
      router.push("/dashboard")
    }
  }, [user, router]);

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <CircularProgress />
    </Box>
  )
}