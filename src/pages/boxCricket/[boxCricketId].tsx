import { Spin, message } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Header from "../../../components/Header/header";
import {
  Card,
  CardContent,
  Divider,
  Button,
  Typography,
  Box,
  Grid,
  Stack,
  useMediaQuery,
  TextField,
  InputAdornment,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import PlaceIcon from "@mui/icons-material/Place";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";

const dates = [0, 1, 2, 3, 4, 5, 6].map((day) =>
  new Date(new Date().setDate(new Date().getDate() + day)).getDate()
);

interface slot {
  id: number;
  period: string;
  pricing: string;
  selected: boolean;
  timing: string;
  booked: boolean;
  tempBooked: boolean;
}

interface price {
  night: string;
  lateNight: string;
  morning: string;
  afternoon: string;
}

interface box {
  bookingSlots: any[];
  boxCricketName: string;
  boxCricketAddress: string;
  minSlotPrice: number;
  maxSlotPrice: number;
  boxCricketFacilities: string;
}

const BoxCricket = () => {
  const router = useRouter();
  const [boxCricket, setBoxCricket] = useState<box>();
  const [availableSlots, setAvailableSlots] = useState<Array<slot>>([]);
  const [price, setPrice] = useState<price>();

  const [loading, setLoading] = useState(false);
  const [defaultDate, setDefaultDate] = useState(new Date().getDate());

  useEffect(() => {
    const getBoxCricketInfo = async () => {
      try {
        const response = await fetch(
          `/api/boxCricket/getBoxCricket?boxCricketId=${router.query.boxCricketId}`
        );
        const result = await response.json();
        if (result.status === 200) {
          setBoxCricket(result.boxCricket);
          const filteredSlots = result.boxCricket.bookingSlots.filter(
            (slot: slot) => slot.selected === true
          );
          let newObj: price = {
            afternoon: "",
            morning: "",
            night: "",
            lateNight: "",
          };
          //let newObj: price
          filteredSlots.map((slot: slot) => {
            if (slot.period === "morning") {
              newObj.morning = slot.pricing;
            } else if (slot.period === "night") {
              newObj.night = slot.pricing;
            } else if (slot.period === "lateNight") {
              newObj.lateNight = slot.pricing;
            } else if (slot.period === "afternoon") {
              newObj.afternoon = slot.pricing;
            }
          });
          setPrice(newObj);
          const newSlots = filteredSlots.map((slot: slot) => {
            return {
              ...slot,
              booked: false,
              tempBooked: false,
            };
          });
          setAvailableSlots(newSlots);
        } else {
          message.info("Please try again");
        }
      } catch (err) {
        console.error(err);
        message.error("something went wrong");
      }
    };

    if (router.query.boxCricketId) {
      getBoxCricketInfo();
    }
  }, [router.query.boxCricketId]);

  if (loading) {
    return <Spin tip="Loading" size="small" />;
  }

  const StyledBox1 = styled(Box)(({ theme }) => ({
    width: "100%",
    margin: "1rem 0",
    borderRight: "1px solid #bbb",
    padding: "1rem",
    [theme.breakpoints.up("lg")]: {
      width: "80%",
    },
  }));

  const StyledBox2 = styled(Box)(({ theme }) => ({
    display: "none",
    width: "100%",
    minHeight: "90vh",
    padding: "1rem",
    //border: "1px solid",
    [theme.breakpoints.up("lg")]: {
      width: "20%",
      display: "block",
    },
  }));

  //console.log({ availableSlots });
  const handleSlots = (period: string) => {
    return (
      <Grid item sx={{ padding: "1rem 0rem", borderTop: "1px solid #ccc" }}>
        <Stack
          rowGap={2}
          columnGap={1}
          direction="row"
          justifyContent="center"
          flexWrap="wrap"
        >
          {availableSlots?.map((slot: slot, index) => {
            if (slot.period === period) {
              return (
                <Card
                  key={index}
                  sx={{
                    //border: "1px solid",
                    height: "90px",
                    width: "180px",
                    textAlign: "center",
                    padding: ".5rem",
                    cursor: "pointer",
                    border: slot.tempBooked ? "1px solid" : "0",
                  }}
                  onClick={() => handlSlotClick(slot.id, slot.tempBooked)}
                >
                  <Typography>{slot.timing}</Typography>
                  <Stack justifyContent="center" direction={{ xs: "row" }}>
                    <CurrencyRupeeIcon />{" "}
                    <Typography>{parseInt(slot.pricing) / 2}</Typography>
                  </Stack>
                  <Typography>Available</Typography>
                </Card>
              );
            }
          })}
        </Stack>
      </Grid>
    );
  };

  const handlSlotClick = (id: number, booked: boolean) => {
    //console.log(booked)
    const newBookedSlots = availableSlots.map((slot: slot) => {
      if (slot.id === id) {
        return {
          ...slot,
          tempBooked: !booked,
        };
      } else {
        return slot;
      }
    });
    setAvailableSlots(newBookedSlots);
  };

  const handleDateClick = (date: number) => {
    console.log({ date });
    setDefaultDate(date);
  };

  return (
    <>
      <Header />

      <Stack
        direction="row"
        sx={{
          minWidth: "450px",
          overflowX: "auto",
          marginTop: "64px",
          backgroundColor: "rgb(249, 250, 251)",
        }}
      >
        <StyledBox1>
          <Grid container rowGap={2}>
            <Grid
              item
              xs={12}
              sm={4}
              sx={{ backgroundColor: "#fff", border: "1px solid" }}
            >
              <Box sx={{ height: "150px" }}> </Box>
            </Grid>
            <Grid item xs={12} sm={8} sx={{ backgroundColor: "#fff" }}>
              <Stack
                gap={1}
                sx={{ ml: "0.5rem", height: "150px", padding: ".5rem" }}
              >
                <Typography variant="h6">
                  {boxCricket?.boxCricketName}
                </Typography>
                <Stack direction="row">
                  <PlaceIcon />
                  <Typography>{boxCricket?.boxCricketAddress}</Typography>
                </Stack>
                {/* <Stack direction={{ xs: "row" }}>
                    <CurrencyRupeeIcon />{" "}
                    <Typography>
                      {boxCricket?.minSlotPrice} - {boxCricket?.maxSlotPrice}/hr
                    </Typography>
                  </Stack> */}

                <Typography>{boxCricket?.boxCricketFacilities}</Typography>
              </Stack>
            </Grid>

            {/* Date */}
            <Grid item xs={12} sx={{ m: "1rem 0" }}>
              <Card>
                <Typography
                  variant="h6"
                  sx={{ borderBottom: "1px solid #ccc" }}
                  paddingX={2}
                  paddingY={1}
                >
                  Choose Date For Which You Wish To do the Booking
                </Typography>
                <Stack flexWrap="wrap" direction="row" justifyContent="center">
                  {dates.map((date, index) => (
                    <Box
                      key={index}
                      sx={{
                        padding: "1rem",
                        borderRight: "1px solid",
                        borderLeft: "1px solid",
                        cursor: "pointer",
                        backgroundColor:
                          date === defaultDate ? "#bbb" : "white",
                      }}
                      onClick={() => handleDateClick(date)}
                    >
                      {date}
                    </Box>
                  ))}
                </Stack>
              </Card>
            </Grid>

            {/* Booking           */}
            <Card>
              <Grid item xs={12} sx={{ padding: "1rem" }}>
                <Stack direction="row" justifyContent={"space-between"}>
                  <Typography variant="h6">Night Booking</Typography>
                  <Typography variant="h6">
                    Price : {price?.night}/Hour{" "}
                  </Typography>
                </Stack>
              </Grid>
              {handleSlots("night")}
            </Card>

            <Card sx={{ mt: "1rem" }}>
              <Grid item xs={12} sx={{ padding: "1rem" }}>
                <Stack direction="row" justifyContent={"space-between"}>
                  <Typography variant="h6">Late Night Booking</Typography>
                  <Typography variant="h6">
                    Price : {price?.lateNight}/Hour{" "}
                  </Typography>
                </Stack>
              </Grid>
              {handleSlots("lateNight")}
            </Card>

            <Card sx={{ mt: "1rem" }}>
              <Grid item xs={12} sx={{ padding: "1rem" }}>
                <Stack direction="row" justifyContent={"space-between"}>
                  <Typography variant="h6">Morning Booking</Typography>
                  <Typography variant="h6">
                    Price : {price?.morning}/Hour{" "}
                  </Typography>
                </Stack>
              </Grid>
              {handleSlots("morning")}
            </Card>

            <Card sx={{ mt: "1rem" }}>
              <Grid item xs={12} sx={{ padding: "1rem" }}>
                <Stack direction="row" justifyContent={"space-between"}>
                  <Typography variant="h6">Afternoon Booking</Typography>
                  <Typography variant="h6">
                    Price : {price?.afternoon}/Hour{" "}
                  </Typography>
                </Stack>
              </Grid>
              {handleSlots("afternoon")}
            </Card>
          </Grid>
        </StyledBox1>
        <StyledBox2>
          <Grid></Grid>
        </StyledBox2>
      </Stack>
    </>
  );
};

export default BoxCricket;
