import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import {
  Typography,
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Paper,
  Popover,
  Avatar,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";

import Cookies from "js-cookie";

const navItems = [
  { name: "Signup", link: "/user/signup" },
  { name: "Signin", link: "/user/signin" },
];

const Header = () => {
  const router = useRouter();

  const [user, setUser] = useState<string | null>(null);
  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);
  const [anchorEl1, setAnchorEl1] = React.useState<HTMLDivElement | null>(null);

  const handleProfileClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl1(event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const open1 = Boolean(anchorEl1);
  //const id = open ? "simple-popover" : undefined;

  useEffect(() => {
    if (Cookies.get("currentUser")) {
      if (Cookies.get("currentUser")) {
        const user1 = JSON.parse(Cookies.get("currentUser") || "");
        if (user1.userType === "user") {
          setUser("user");
        } else {
          setUser("owner");
        }
      }
    } else {
      setUser(null);
    }
  }, []);

  const handleLogout = () => {
    const user1 = JSON.parse(Cookies.get("currentUser") || "");
    const userType = user1.userType;
    Cookies.remove("currentUser");
    Cookies.remove("token");

    if (userType === "user") {
      router.push("/user/signin");
    } else {
      router.push("/owner/signin");
    }
  };

  return (
    <AppBar
      sx={{
        backgroundColor: "#fff",
      }}
      component="nav"
    >
      <Toolbar sx={{ border: "1px solid" }}>
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
          <Link style={{ color: "#000", textDecoration: "none" }} href="/">
            Box Cricket
          </Link>
        </Typography>

        {!user && (
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
        )}

        {user === "user" && (
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            <Link
              href="/"
              style={{
                textDecoration: "none",
                padding: "0 1rem",
                color: "#000",
              }}
            >
              My Bookings
            </Link>
            <Box
              style={{
                textDecoration: "none",
                padding: "0 1rem",
                color: "#000",
              }}
            >
              Notification
            </Box>
            <Box
              style={{
                textDecoration: "none",
                padding: "0 1rem",
                color: "#000",
              }}
            >
              Profile
            </Box>
          </Box>
        )}

        {user === "owner" && (
          <Box
            sx={{
              //border: "1px solid black",
              display: { xs: "none", sm: "flex" },
              alignItems: "center",
              mr: 3,
              gap: 3,
            }}
          >
            <Box
              sx={{
                //border: "1px solid black",
                display: "flex",
                alignItems: "center",
              }}
              onClick={(e) => handleNotificationClick(e)}
            >
              <NotificationsNoneIcon
                sx={{
                  cursor: "pointer",
                  color: "black",
                  width: "24px",
                  height: "24px",
                }}
              />
            </Box>

            <Avatar
              sx={{
                cursor: "pointer",
                width: "30px",
                height: "30px",
              }}
              onClick={(e) => handleProfileClick(e)}
            >
              H
            </Avatar>
          </Box>
        )}

        {/* Notification pop over */}
        <Popover
          //id={id}
          open={open1}
          anchorEl={anchorEl1}
          onClose={() => setAnchorEl1(null)}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          //anchorPosition={{ left: 5, top: 5 }}
          //anchorReference={"anchorPosition"}
        >
          <Paper sx={{ width: "120px", p: ".5rem" }} variant="outlined">
            <List>
              {/* <ListItem
                disablePadding
                sx={{
                  px: ".5rem",
                  "&:hover": {
                    backgroundColor: "#eee",
                    borderRadius: ".2rem",
                    cursor: "pointer",
                  },
                }}
              >
                <ListItemText> Edit Profile </ListItemText>
              </ListItem>
              <ListItem
                sx={{
                  px: ".5rem",
                  "&:hover": {
                    backgroundColor: "#eee",
                    borderRadius: ".2rem",
                    cursor: "pointer",
                  },
                }}
                disablePadding
                onClick={handleLogout}
              >
                <ListItemText> Logout </ListItemText>
              </ListItem> */}
            </List>
          </Paper>
        </Popover>

        {/* Profile Pop over */}
        <Popover
          //id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={() => setAnchorEl(null)}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          //anchorPosition={{ left: 5, top: 5 }}
          //anchorReference={"anchorPosition"}
        >
          <Paper sx={{ width: "120px", p: ".5rem" }} variant="outlined">
            <List>
              <ListItem
                disablePadding
                sx={{
                  px: ".5rem",
                  "&:hover": {
                    backgroundColor: "#eee",
                    borderRadius: ".2rem",
                    cursor: "pointer",
                  },
                }}
              >
                <ListItemText> Edit Profile </ListItemText>
              </ListItem>
              <ListItem
                sx={{
                  px: ".5rem",
                  "&:hover": {
                    backgroundColor: "#eee",
                    borderRadius: ".2rem",
                    cursor: "pointer",
                  },
                }}
                disablePadding
                onClick={handleLogout}
              >
                <ListItemText> Logout </ListItemText>
              </ListItem>
            </List>
          </Paper>
        </Popover>
      </Toolbar>
    </AppBar>
  );
};
export default Header;
