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
                    "Convert your files effortlessly with FileConverter. Convert, organize and achieve."
                }
            </Typography>
        </Box>
    );
};

export default Footer;
