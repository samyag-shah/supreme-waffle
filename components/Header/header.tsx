import {
  Button,
  Typography,
  AppBar,
  Toolbar,
  Box,
  IconButton,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";
const navItems = [
  { name: "Signup", link: "/user/signup" },
  { name: "Signin", link: "/user/signin" },
];

const Header = () => {
  return (
    <AppBar sx={{ backgroundColor: "rgb(249, 250, 251)" }} component="nav">
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          //onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: "none" } }}
        >
          <MenuIcon />
        </IconButton>
        <Typography
          variant="h6"
          component="div"
          sx={{
            color: "#000",
            flexGrow: 1,
            display: { xs: "none", sm: "block" },
          }}
        >
          Box Cricket
        </Typography>
        <Box sx={{ display: { xs: "none", sm: "block" } }}>
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.link}
              style={{
                textDecoration: "none",
                padding: "0 1rem",
                color: "#000",
              }}
            >
              {item.name}
            </Link>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
};
export default Header;
