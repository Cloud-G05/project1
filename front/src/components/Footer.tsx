import React from "react";
//import { useIntl } from 'react-intl';
import { Box, Typography } from "@mui/material";
import "../styles/Footer.css";

const Footer = () => {
    //const footerText = intl.formatMessage({ id: 'footerText' });
    return (
        <Box component="footer" className="footer">
            <Typography
                variant="body2"
                gutterBottom
                sx={{
                    color: "white",
                }}
            >
                {
                    "Manage your tasks effortlessly with TaskManager. Organize, prioritize, and stay productive."
                }
            </Typography>
        </Box>
    );
};

export default Footer;
