"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import { 
  TextField, 
  Button, 
  Typography, 
  Container, 
  Box,
  Grid
} from "@mui/material";

const Page = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    username: "",
    isVerified: false,
  });
  const [buttonDisabled, setButtonDisabled] = useState(true);

  useEffect(() => {
    if (
      user.email.length > 0 &&
      user.password.length > 0 &&
      user.username.length > 0 &&
      user.firstName.length > 0 &&
      user.lastName.length > 0
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post("/api/v1/user/sign-up", user);
      if (response.status === 201) {
        router.push("/login");
      }
    } catch (error: any) {
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
        <Typography component="h1" variant="h4" sx={{ my: 4 }}>
          Sign Up
        </Typography>
        <Box component="form" onSubmit={onSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="given-name"
                name="firstName"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                value={user.firstName}
                onChange={(e) => setUser({...user, firstName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
                value={user.lastName}
                onChange={(e) => setUser({...user, lastName: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                value={user.username}
                onChange={(e) => setUser({...user, username: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={user.email}
                onChange={(e) => setUser({...user, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={user.password}
                onChange={(e) => setUser({...user, password: e.target.value })}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={buttonDisabled || loading}
          >
            {loading ? <CircularProgress size={24} /> : "Sign Up"}
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link href="/login" passHref>
                <Typography variant="body2" sx={{ cursor: 'pointer', color: 'primary.main' }}>
                  Already have an account? Login
                </Typography>
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Page;