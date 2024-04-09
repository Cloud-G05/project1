import {
    Container,
    Box,
    Avatar,
    Typography,
    TextField,
    Button,
    Grid,
} from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import { LockOutlined } from "@mui/icons-material";
import React from "react";

const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    //const [token, setToken] = useState("");

    // const [formValues, setFormValues] = useState({
    //     username: "",
    //     password: "",
    // });

    const handleLogin = async () => {
        if (username.includes("@")) {
            const response = await fetch(
                "http://34.48.93.67:8000/users/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: username,
                        password: password,
                    }),
                }
            );

            if (response.status === 201) {
                window.location.href = "/home";
                // i want to save the response of the fetch in a variable
                const data = await response.json();
                //setToken(data.access_token);
                localStorage.setItem("token", data.access_token);
                localStorage.setItem("username", data.username);
                localStorage.setItem("user_email", data.email);
            } else {
                alert("Email o contraseña incorrectos");
            }
        } else {
            const response = await fetch(
                "http://34.48.93.67:8000/users/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        username: username,
                        password: password,
                    }),
                }
            );

            if (response.status === 201) {
                window.location.href = "/home";
                // i want to save the response of the fetch in a variable
                const data = await response.json();
                //setToken(data.access_token);
                localStorage.setItem("token", data.access_token);
                localStorage.setItem("username", username);
                localStorage.setItem("user_email", data.email);
            } else {
                alert("Usuario o contraseña incorrectos");
            }
        }
    };

    return (
        <>
            <Container maxWidth="xs">
                {/* <CssBaseline /> */}
                <Box
                    sx={{
                        mt: 20,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: "primary.light" }}>
                        <LockOutlined />
                    </Avatar>
                    <Typography variant="h5">Login</Typography>
                    <Box sx={{ mt: 1 }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username or Email"
                            name="username"
                            autoFocus
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />

                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="password"
                            name="password"
                            label="Password"
                            type="password"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                            }}
                        />

                        <Button
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={handleLogin}
                        >
                            Login
                        </Button>
                        <Grid container justifyContent={"flex-end"}>
                            <Grid item>
                                <Link to="/register">
                                    Don't have an account? Register
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </>
    );
};

export default LoginPage;

// const getUserById = async () => {
//     const token = localStorage.getItem("token");
//     const response = await fetch(
//         `http://localhost:8000/users/${localStorage.getItem("user_id")}`,
//         {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//         }
//     );
//     if (response.status === 200) {
//         const data = await response.json();
//         localStorage.setItem("profile_picture", data.profile_picture);
//     }
// };
