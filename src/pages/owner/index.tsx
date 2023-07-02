import { Spin, message } from "antd";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
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

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

interface owner {
  Boxcrickets: Array<any>;
}

interface slot {
  startTime: string;
  endTime: string;
  pricing: string;
}
interface Booking {
  userBookings: slot[];
}
export default function Home() {
  const [owner, setOwner] = useState<owner>();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  //get Owner Details
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
    }
  }, []);

  //get boxCricket Booking data
  useEffect(() => {
    const fetchBookingByBoxCricketId = async () => {
      const boxCricketId = owner?.Boxcrickets[0].id;
      try {
        const response = await fetch(
          `/api/userBookings/getBookingsByBoxCricketId?boxCricketId=${boxCricketId}`
        );
        const result = await response.json();
        setBookings(result.userBookings);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (owner) {
      fetchBookingByBoxCricketId();
    }
  }, [owner]);

  const StyledBox1 = styled(Box)(({ theme }) => ({
    marginTop: "80px",
    minHeight: "85vh",
    width: "80%",
    padding: "1rem 2rem",
  }));

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

  const ShowBooking = () => {
    if (bookings?.length) {
      const bookingOfUsers = bookings?.map((booking) => {
        return booking.userBookings.map((slot: slot, index) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={3}
            sx={{ border: "1px solid #ccc", p: 2 }}
            key={index}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box>
                <Typography variant="body1">
                  Timings:
                  {dayjs(slot.startTime).local().format("hh:mm")} -{" "}
                  {dayjs(slot.endTime).local().format("hh:mm A")}
                </Typography>
                <Typography>Pricing {parseInt(slot.pricing) / 2}</Typography>
                {/* <Typography>date {booking.date}</Typography> */}
              </Box>
            </Stack>
          </Grid>
        ));
      });
      return bookingOfUsers;
    } else {
      return <></>;
    }
  };

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
            <Typography
              variant="h6"
              sx={{ borderBottom: "1px solid", mb: "2rem" }}
            >
              Todays bookings
            </Typography>

            <Grid gap={2} container>
              {/* <ShowBooking /> */}
              {/* <Grid item xs={12} sm={6}>
                <Card>Hello</Card>
              </Grid> */}
            </Grid>
          </Card>
        </StyledBox1>
        {/* <StyledBox2></StyledBox2> */}
      </Stack>
    </>
  );
}
