import { Box, Typography } from "@mui/material";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { COLORS } from "../styles/colors";
import AccountMenu from "./AccountMenu";
import React from "react";

const Header = () => {
    return (
        <Box className="header">
            <AppBar position="static" sx={{ backgroundColor: "white" }}>
                <Toolbar
                    className="first-row"
                    sx={{
                        justifyContent: "space-between",
                    }}
                >
                    <LogoTaskManager taskManagerText="TaskManager" />
                    <AccountMenu />
                </Toolbar>
            </AppBar>
        </Box>
    );
};

export default Header;

const LogoTaskManager = ({
    taskManagerText,
}: //navigate,
{
    taskManagerText: string;
    //navigate: NavigateFunction;
}) => (
    <Toolbar>
        <Typography
            variant="h5"
            style={{ color: COLORS.primary, fontWeight: "bold" }}
            //onClick={() => navigate("/")}
        >
            {taskManagerText}
        </Typography>
    </Toolbar>
);
