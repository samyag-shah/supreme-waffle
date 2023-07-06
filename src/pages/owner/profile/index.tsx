import { useEffect, useState } from "react";
import Header from "../../../../components/Header/header";
import {
  Box,
  Stack,
  List,
  Divider,
  Container,
  Drawer,
  ListItemText,
  Collapse,
  ListItemIcon,
  ListItemButton,
  Typography,
} from "@mui/material";
import { useRouter } from "next/router";
import Cookies from "js-cookie";

import dayjs from "dayjs";
import objectSupport from "dayjs/plugin/objectSupport";
import utc from "dayjs/plugin/utc";

dayjs.extend(objectSupport);
dayjs.extend(utc);

import { Tabs, Spin, message } from "antd";
import type { TabsProps } from "antd";

import OwnerInfo from "../../../../components/owner/ownerData/OwnerInfo";
import BoxCricketInfo from "../../../../components/owner/ownerData/BoxCricketInfo";
import BoxCricketSlot from "../../../../components/owner/ownerData/BoxCricketSlot";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

interface Owner {
  Boxcrickets: any[];
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  id: string;
}

const Profile = () => {
  const [owner, setOwner] = useState<Owner>();
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [activeOption, setActiveOption] = useState("profile");
  const [boxCricektState, setboxCricektState] = useState({});
  const [activeTab, setActiveTab] = useState("1");
  const [boxCricketId, setBoxCricketId] = useState("");

  const router = useRouter();

  //get Owner Detail
  useEffect(() => {
    const getOwnerDetail = async () => {
      const response = await fetch("/api/owner/getOwnerDetails", {
        method: "POST",
        body: "",
      });
      const result = await response.json();
      //console.log({ result });
      if (result.status === 200) {
        setOwner(result.owner);
      } else if (result.status === 401) {
        message.info("token expired, Please sign in again");
        Cookies.remove("token");
        Cookies.remove("currentUser");
        router.push("/owner/signin");
      } else {
        message.info("something went wrong");
      }
    };

    try {
      getOwnerDetail();
    } catch (err) {
      console.error(err);
      message.info("something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  console.log({ activeTab, boxCricektState });
  //Tabs
  const items: TabsProps["items"] = [
    {
      key: "1",
      label: `Box cricket Detail`,
      children: (
        <BoxCricketInfo
          owner={owner}
          operationType={activeOption === "newBoxCricket" ? "new" : "update"}
          setboxCricektState={setboxCricektState}
          setActiveTab={setActiveTab}
          boxCricketId={boxCricketId}
        />
      ),
    },
    {
      key: "2",
      label: `Slots`,
      children: (
        <BoxCricketSlot
          owner={owner}
          operationType={activeOption === "newBoxCricket" ? "new" : "update"}
          boxCricektState={boxCricektState}
          boxCricketId={boxCricketId}
        />
      ),
    },
  ];

  const handlePageContent = () => {
    if (activeOption === "profile") {
      return (
        <Box>
          <Typography variant="h6">Update Profile</Typography>
          <Divider sx={{ mt: 1, mb: 4 }} />
          <OwnerInfo owner={owner} />
        </Box>
      );
    } else if (activeOption === "newBoxCricket") {
      return (
        <Box>
          <Typography variant="h6">Add New Box cricket</Typography>
          <Tabs activeKey={activeTab} items={items} />
        </Box>
      );
    } else {
      return (
        <Box>
          <Typography variant="h6">Update Box cricket</Typography>
          <Tabs
            onChange={(key) => setActiveTab(key)}
            activeKey={activeTab}
            items={items}
          />
        </Box>
      );
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Spin />
      </Box>
    );
  }

  return (
    <>
      <Header />
      <Stack
        sx={{
          mt: "5rem",
          //border: "1px solid",
          //minHeight: "100vh",
          p: { xs: "1rem .5rem", sm: "2rem" },
          minWidth: "330px",
          overflowX: "auto",
          marginLeft: "200px",
        }}
      >
        <Container maxWidth="sm">
          <Drawer
            anchor={"left"}
            open={true}
            hideBackdrop={true}
            variant="persistent"
            PaperProps={{ sx: { width: "250px", marginTop: "80px" } }}
            //onClose={toggleDrawer(anchor, false)}
          >
            <List>
              <ListItemButton
                sx={{ borderBottom: "1px solid" }}
                onClick={() => setActiveOption("profile")}
              >
                <ListItemText>Profile</ListItemText>
              </ListItemButton>
              <ListItemButton
                sx={{ borderBottom: "1px solid" }}
                onClick={() => setOpen(!open)}
              >
                <ListItemText>Update BoxCricket</ListItemText>
                <ListItemIcon sx={{ minWidth: 0 }}>
                  {open ? (
                    <ExpandLess />
                  ) : (
                    <ExpandMore sx={{ minWidth: "0px" }} />
                  )}
                </ListItemIcon>
              </ListItemButton>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {owner?.Boxcrickets.map((box, index) => (
                    <ListItemButton
                      key={index}
                      onClick={() => {
                        setActiveOption("updateBoxCricket");
                        setBoxCricketId(box.id);
                      }}
                      sx={{ pl: 5 }}
                    >
                      <ListItemText>{box.boxCricketName}</ListItemText>
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
              <ListItemButton
                onClick={() => {
                  setActiveOption("newBoxCricket");
                  setBoxCricketId("");
                }}
              >
                <ListItemText>Add New BoxCricket</ListItemText>
              </ListItemButton>
            </List>
          </Drawer>

          <Box>{handlePageContent()}</Box>
        </Container>
      </Stack>
    </>
  );
};

export default Profile;
