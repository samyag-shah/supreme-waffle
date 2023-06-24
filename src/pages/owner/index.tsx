import { message } from "antd";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Header from "../../../components/Header/header";
import {
  Card,
  CardContent,
  Button,
  Typography,
  Box,
  Grid,
  Stack,
  TextField,
  InputAdornment,
  Container,
} from "@mui/material";
import { styled } from "@mui/material/styles";

export default function Home() {
  const [owner, setOwner] = useState();
  const router = useRouter();

  useEffect(() => {
    const getOwnerDetail = async () => {
      const response = await fetch("/api/owner/getOwnerDetails", {
        method: "POST",
        body: "",
      });
      const result = await response.json();
      console.log({ result });
      if (result.status === 200) {
        setOwner(result.owner);
      } else if (result.status === 401) {
        message.info("token expired, Please sign in again");
        Cookies.remove("token");
        Cookies.remove("currentUser");
        router.push("owner/signin");
      } else {
        message.info("something went wrong");
      }
    };

    try {
      getOwnerDetail();
    } catch (err) {
      console.error(err);
      message.info("something went wrong");
    }
  }, []);

  const StyledBox1 = styled(Box)(({ theme }) => ({
    border: "1px solid",
    marginTop: "80px",
    minHeight: "85vh",
    width: "80%",
    padding: "1rem",
  }));

  return (
    <>
      <Header />
      <Stack>
        <StyledBox1>
          <Stack
            sx={{ borderBottom: "1px solid", py: "1rem", mb: "2rem" }}
            direction="row"
            justifyContent="space-between"
          >
            <Typography>Your Bookings</Typography>
            <Typography>Filter Bookings By Date</Typography>
          </Stack>
          <Card sx={{ minHeight: "50vh", p: "1rem" }}>
            <Typography sx={{ borderBottom: "1px solid", mb: "2rem" }}>
              Todays bookings
            </Typography>
            <Grid gap={2} container>
              <Grid item xs={12} sm={6}>
                <Card>Hello</Card>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Card>By</Card>
              </Grid>
            </Grid>
          </Card>
        </StyledBox1>
        {/* <StyledBox2></StyledBox2> */}
      </Stack>
    </>
  );
}
