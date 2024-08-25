"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import { toast, Toaster } from "react-hot-toast";
import { 
  TextField, 
  Button, 
  Typography, 
  Container, 
  Box
} from "@mui/material";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [searchParams, setSearchParams] = useState<URLSearchParams | null>(null);
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setSearchParams(new URLSearchParams(window.location.search));
    }
  }, []);

  const resetToken = searchParams ? searchParams.get("reset_token") : null;

  const onUpdatePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/api/v1/user/reset-password", {
        token: resetToken,
        password,
      });
      toast.success("Your password has been updated successfully.");
      setPassword("");
      router.push("/login");
    } catch (error: any) {
      toast.error(
        "Failed to update password. This link may have expired. Please request another reset-password email and try again."
      );
      console.error(error?.response?.data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h2" sx={{ mb: 4 }}>
          Stock Pilot
        </Typography>
        <Typography component="h2" variant="h5" sx={{ mb: 2 }}>
          Reset Password
        </Typography>
        <Box component="form" onSubmit={onUpdatePasswordSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="New Password"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={!password || loading}
          >
            {loading ? <CircularProgress size={24} /> : "Update Password"}
          </Button>
          <Link href="/login" passHref>
            <Typography variant="body2" sx={{ mt: 2, cursor: 'pointer', color: 'primary.main' }}>
              Go to Login
            </Typography>
          </Link>
        </Box>
      </Box>
      <Toaster />
    </Container>
  );
}