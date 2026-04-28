import { Box, CssBaseline } from "@mui/material";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../Sidebard/Sidebar";
import { Footer } from "../Footer/Footer";

export const Layout = () => {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <CssBaseline />

      <Sidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          bgcolor: "#f5f7fb",
        }}
      >
        <Box sx={{ flexGrow: 1, p: 4 }}>
          <Outlet />
        </Box>

        <Footer />
      </Box>
    </Box>
  );
};