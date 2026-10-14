import type { ReactNode } from "react";
import {AppBar, Toolbar,  Container, Box, Typography} from "@mui/material";


interface PageLayoutProps {
    title: string,
    children: ReactNode
}


const PageLayout = ({ title, children }: PageLayoutProps) => {
return (
    <Box sx={{flexGrow: 1 }}>   
        <AppBar position="static">
            <Toolbar>
          <Typography variant="h3" component="div" sx={{ flexGrow: 1, alignContent: "center" }} >
            {title}
          </Typography>
        </Toolbar>
        </AppBar>
        <Container>
            {children}
        </Container>
    </Box>

);
};

export default PageLayout;