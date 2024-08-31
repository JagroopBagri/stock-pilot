"use client";
import { useState, useRef, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { CircularProgress } from "@mui/material";
import { toast } from "react-hot-toast";
import { UserContext, UserContextType } from "@/components/Store";
import { 
  TextField, 
  Button, 
  Typography, 
  Container, 
  Box, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions 
} from "@mui/material";

const defaultFormValues = { username: "", password: "" };

export default function LoginPage() {
  const router = useRouter();
  const [formValues, setFormValues] = useState(defaultFormValues);
  const [loading, setLoading] = useState<boolean>(false);
  const [forgotEmail, setForgotEmail] = useState<string>("");
  const [fpModalOpen, setFPModalOpen] = useState<boolean>(false);
  const {user, setUser} = useContext(UserContext) as UserContextType;

  // on login submit
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("/api/v1/user/login", formValues);
      if (response.status === 200) {
        setUser(response.data.user);
        router.push("/dashboard");
      }
    } catch (error: any) {
      console.error(error?.response?.data);
      toast.error("Error: Invalid Credentials");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle the submit action inside the modal
  const onForgotPasswordSubmit = async (email: string) => {
    setLoading(true);
    try {
      await axios.post("/api/v1/user/forgot-password", { email });
      setFPModalOpen(false);
      setForgotEmail("");
      toast.success(
        "Reset password email has been sent! Please check your email!"
      );
    } catch (error: any) {
      toast.error("Error: Could not send reset password email");
      console.error(error?.response?.data);
    }
    setLoading(false);
  };

  // This function is used to open the forgot password modal
  const toggleForgotPasswordModal = () => {
    setFPModalOpen(!fpModalOpen);
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
        <Box component="form" onSubmit={onSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            autoComplete="username"
            autoFocus
            value={formValues.username}
            onChange={(e) => setFormValues({ ...formValues, username: e.target.value })}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={formValues.password}
            onChange={(e) => setFormValues({ ...formValues, password: e.target.value })}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Login"}
          </Button>
        </Box>
        <Link href="/sign-up" passHref>
          <Typography variant="body2" sx={{ mt: 2, cursor: 'pointer', color: 'primary.main' }}>
            {"Don't have an account? Sign Up"}
          </Typography>
        </Link>
        <Typography 
          variant="body2" 
          sx={{ mt: 2, cursor: 'pointer', color: 'primary.main' }}
          onClick={toggleForgotPasswordModal}
        >
          Forgot your password?
        </Typography>
      </Box>

      <Dialog open={fpModalOpen} onClose={toggleForgotPasswordModal}>
        <DialogTitle>Recover your account</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>Please enter your email below</Typography>
          <TextField
            autoFocus
            margin="dense"
            id="forgot-email"
            label="Email Address"
            type="email"
            fullWidth
            variant="outlined"
            value={forgotEmail}
            onChange={(e) => setForgotEmail(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleForgotPasswordModal} color="primary">
            Cancel
          </Button>
          <Button 
            onClick={() => onForgotPasswordSubmit(forgotEmail)} 
            color="primary"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Submit"}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}