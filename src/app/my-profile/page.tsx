"use client";
import axios from "axios";
import Link from "next/link";
import React, { useState, useContext } from "react";
import { toast, Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { UserContext, UserContextType } from "@/components/Store";
import { 
  Button, 
  Typography, 
  Container, 
  Box,
  Paper
} from "@mui/material";

export default function ProfilePage() {
  const router = useRouter();
  const [data, setData] = useState("nothing");
  const {user, setUser} = useContext(UserContext) as UserContextType;

  const logout = async () => {
    try {
      await axios.get("/api/v1/user/logout");
      setUser(null);
      router.push("/login");
    } catch (error: any) {
      console.error(error?.response?.data);
      toast.error("Error occurred while attempting to logout");
    }
  };

  const getUserDetails = async () => {
    try {
      const res = await axios.get("/api/v1/user/profile");
      console.log(res.data);
      setData(res.data.data._id);
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error("Failed to fetch user details");
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h4" sx={{ mb: 4 }}>
          Profile
        </Typography>
        <Paper elevation={3} sx={{ p: 3, width: '100%', mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            User ID:
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              p: 1, 
              bgcolor: 'success.light', 
              borderRadius: 1,
              wordBreak: 'break-all'
            }}
          >
            {data === "nothing" ? (
              "Nothing"
            ) : (
              <Link href={`/my-profile/${data}`}>{data}</Link>
            )}
          </Typography>
        </Paper>
        <Box sx={{ mt: 2, width: '100%' }}>
          <Button
            onClick={logout}
            fullWidth
            variant="contained"
            sx={{ mb: 2 }}
          >
            Logout
          </Button>
          <Button
            onClick={getUserDetails}
            fullWidth
            variant="contained"
          >
            Get User Details
          </Button>
        </Box>
      </Box>
      <Toaster />
    </Container>
  );
}