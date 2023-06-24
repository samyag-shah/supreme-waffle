import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Image from "next/image";
import Head from "next/head";

//@mui
import {
  Card,
  Typography,
  Box,
  Divider,
  Grid,
  Stack,
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";

import { Carousel, Spin, message } from "antd";

import Header from "../../../components/Header/header";

//dayjs
import dayjs, { Dayjs } from "dayjs";
import objectSupport from "dayjs/plugin/objectSupport";
import utc from "dayjs/plugin/utc";
dayjs.extend(objectSupport);
dayjs.extend(utc);

const dates = [0, 1, 2, 3, 4, 5, 6].map((day) => dayjs().add(day, "day"));

//types
interface slot {
  id: number;
  period: string;
  pricing: string;
  selected: boolean;
  startTime: string;
  endTime: string;
  booked: boolean;
  tempBooked: boolean;
  showSlot: boolean;
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
  boxCricketImages: any[];
  boxCricketFreeFacilities: string;
  boxCricketPaidFacilities: string;
}

const BoxCricket = () => {
  const router = useRouter();

  const [boxCricket, setBoxCricket] = useState<box>();
  const [availableSlots, setAvailableSlots] = useState<Array<slot>>([]);
  const [filteredSlots, setFilteredSlots] = useState<Array<slot>>([]);
  const [price, setPrice] = useState<price>();
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [error, setError] = useState("");

  //getting box cricket data
  useEffect(() => {
    const getBoxCricketInfo = async () => {
      try {
        const response = await fetch(
          `/api/BoxCricket/getBoxCricket?boxCricketId=${router.query.boxCricketId}`
        );
        const result = await response.json();
        if (result.status === 200) {
          setBoxCricket(result.boxCricket);

          const filteredSlots = result.boxCricket.bookingSlots.filter(
            (slot: slot) => slot.selected === true
          );
          setFilteredSlots(filteredSlots);

          //get price period wise
          let newObj: price = {
            afternoon: "",
            morning: "",
            night: "",
            lateNight: "",
          };
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
        }
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
        message.error("something went wrong");
      }
    };

    if (router.query.boxCricketId) {
      getBoxCricketInfo();
    }
  }, [router.query.boxCricketId]);

  //handle Date Change and slots
  useEffect(() => {
    if (selectedDate && router.query.boxCricketId && filteredSlots.length) {
      getSlotsFromBooking(selectedDate)
        .then((slots) => {
          let todaysSlots;
          if (slots.length) {
            //console.log("i am in");
            // todaysSlots = handleExistingSlots(slots);
            todaysSlots = computeSlots(slots, selectedDate, true);
          } else {
            //console.log("i am here");
            todaysSlots = computeSlots(filteredSlots, selectedDate, false);
            createBooking(todaysSlots);
          }
          setAvailableSlots(todaysSlots);
        })
        .catch((err) => {
          console.error({ err });
        });
    }
  }, [selectedDate, router.query.boxCricketId, filteredSlots]);

  const computeSlots = (
    slots: Array<slot>,
    selectedDate: Dayjs,
    alreadyExists: boolean
  ) => {
    if (!alreadyExists) {
      const newSlots = slots.map((slot: slot) => {
        //adding current date to startTime in utc
        //local hour
        let hour = dayjs(slot.startTime).local().hour();
        //local minute
        let minute = dayjs(slot.startTime).local().minute();
        //time in utc
        const startTimeUTC = dayjs({
          date: selectedDate.date(),
          month: selectedDate.month(),
          year: selectedDate.year(),
          hour,
          minute,
        })
          .utc()
          .toISOString();

        //adding current date to endTime in utc
        //local hour
        let hour1 = dayjs(slot.endTime).local().hour();
        //local minute
        let minute1 = dayjs(slot.endTime).local().minute();
        //time in utc
        const endTimeUTC = dayjs({
          date: selectedDate.date(),
          month: selectedDate.month(),
          year: selectedDate.year(),
          hour: hour1,
          minute: minute1,
        })
          .utc()
          .toISOString();
        return {
          ...slot,
          booked: false,
          tempBooked: false,
          startTime: startTimeUTC,
          endTime: endTimeUTC,
          showSlot: true,
        };
      });
      return handleExistingSlots(newSlots);
    } else {
      return handleExistingSlots(slots);
    }
  };

  const handleExistingSlots = (slots: Array<slot>) => {
    if (selectedDate.date() !== dayjs().date()) {
      //return tomorrows slots
      return slots;
    } else {
      //return todays slots
      return slots.map((slot: slot) => {
        let currentHour = dayjs().hour();
        let slotHour = dayjs(slot.startTime).local().hour();

        if (slotHour > currentHour) {
          return { ...slot, showSlot: true };
        } else if (slotHour < currentHour) {
          return { ...slot, showSlot: false };
        } else {
          let currentMinute = dayjs().minute();
          let slotMinute = dayjs(slot.startTime).local().minute();
          if (currentMinute >= 0 && currentMinute < 30) {
            if (slotMinute === 0) {
              return { ...slot, showSlot: false };
            } else {
              return { ...slot, showSlot: true };
            }
          } else {
            return { ...slot, showSlot: false };
          }
        }
      });
    }
  };

  const createBooking = async (slots: Array<slot>) => {
    if (slots?.length) {
      try {
        setLoading(true);
        const date = selectedDate.format("DD/MM/YYYY");
        const object1 = {
          date,
          slots: JSON.stringify(slots),
          boxCricketId: router.query.boxCricketId,
        };
        //console.log({ slots: JSON.parse(slots) });
        const response = await fetch("/api/bookings/addBookingSlots", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(object1),
        });
        const result = await response.json();
        console.log({ result });
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    }
  };

  const getSlotsFromBooking = async (selectedDate: Dayjs): Promise<any[]> => {
    const date = dayjs({
      date: selectedDate.date(),
      month: selectedDate.month(),
      year: selectedDate.year(),
    }).format("DD/MM/YYYY");
    //console.log({ date111 });
    const response1 = await fetch(`/api/bookings/getBookingSlots`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date,
        boxCricketId: router.query.boxCricketId,
      }),
    });
    const result1 = await response1.json();
    //console.log({ result1 });
    if (result1.status === 200) {
      // handle Today's slot from as booking table does have data
      console.log({ result1 });
      return result1.booking.slots;
    } else {
      return [];
    }
  };

  //styles
  const StyledBox1 = styled(Box)(({ theme }) => ({
    width: "100%",
    margin: "1rem 0",
    borderRight: "1px solid #bbb",
    padding: "1rem",
    [theme.breakpoints.up("lg")]: {
      width: "80%",
    },
    [theme.breakpoints.up("sm")]: {
      padding: "2rem",
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

  //handle slots
  const handleSlots = (period: string) => {
    let currentlyAvailableSlots = availableSlots.filter((slot: slot) => {
      return slot.period === period && slot.showSlot;
    });
    return (
      <Grid
        item
        //xs={12}
        sx={{
          border: "1px solid",
          padding: "1rem 0rem",
          borderTop: "1px solid #ccc",
          //border: "1px solid",
          //minWidth: "400px",
          //overflowX: "auto",
        }}
      >
        <Stack
          rowGap={2}
          columnGap={{ xs: 1, sm: 2 }}
          direction="row"
          justifyContent="center"
          flexWrap="wrap"
        >
          {currentlyAvailableSlots.length ? (
            currentlyAvailableSlots?.map((slot: slot, index) => {
              return (
                <Card
                  key={index}
                  sx={{
                    height: "80px",
                    width: "150px",
                    textAlign: "center",
                    padding: ".5rem",
                    cursor: "pointer",
                    border: slot.tempBooked ? "1px solid" : "0",
                    backgroundColor: slot.tempBooked
                      ? "rgb(249, 250, 251)"
                      : "#fff",
                  }}
                  onClick={() => handlSlotClick(slot.id, slot.tempBooked)}
                >
                  <Typography
                    variant="body2"
                    //fontWeight="600"
                    sx={{ mt: ".5rem" }}
                  >
                    {`${dayjs(slot.startTime).local().format("hh:mm")} to 
                    ${dayjs(slot.endTime).local().format("hh:mm A")}`}
                  </Typography>
                  <Stack
                    justifyContent="space-between"
                    alignItems="center"
                    direction="row"
                    sx={{ mt: ".5rem", px: ".5rem" }}
                  >
                    <Stack
                      //sx={{ border: "1px solid" }}
                      alignItems="center"
                      direction="row"
                    >
                      <CurrencyRupeeIcon
                        sx={{ width: "20px", height: "16px" }}
                      />{" "}
                      <Typography variant="body2">
                        {parseInt(slot.pricing) / 2}
                      </Typography>
                    </Stack>
                    <Typography variant="body2">Available</Typography>
                  </Stack>
                </Card>
              );
              //}
            })
          ) : (
            <Box>Currently no slots available</Box>
          )}
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

  // const handleSelectedSlots = () => {
  //   return (
  //     <Grid item sx={{ padding: "1rem 0rem", borderTop: "1px solid #ccc" }}>
  //       <Stack
  //         rowGap={2}
  //         columnGap={1}
  //         direction="row"
  //         justifyContent="center"
  //         flexWrap="wrap"
  //       >
  //         {availableSlots?.map((slot: slot, index) => {
  //           if (slot.tempBooked) {
  //             return (
  //               <Card
  //                 key={index}
  //                 sx={{
  //                   height: "90px",
  //                   width: "180px",
  //                   textAlign: "center",
  //                   padding: ".5rem",
  //                   cursor: "pointer",
  //                   // border: slot.tempBooked ? "1px solid" : "0",
  //                   // backgroundColor: slot.tempBooked
  //                   //   ? "rgb(249, 250, 251)"
  //                   //   : "#fff",
  //                 }}
  //                 //onClick={() => handlSlotClick(slot.id, slot.tempBooked)}
  //               >
  //                 <Typography sx={{ mt: ".5rem" }}>{slot.timing}</Typography>
  //                 <Stack
  //                   justifyContent="space-between"
  //                   alignItems="center"
  //                   direction="row"
  //                   sx={{ mt: ".5rem", px: ".5rem" }}
  //                 >
  //                   <Stack alignItems="center" direction="row">
  //                     <CurrencyRupeeIcon
  //                       sx={{ width: "20px", height: "18px" }}
  //                     />{" "}
  //                     <Typography>{parseInt(slot.pricing) / 2}</Typography>
  //                   </Stack>
  //                   <Typography>Available</Typography>
  //                 </Stack>
  //               </Card>
  //             );
  //           }
  //         })}
  //       </Stack>
  //     </Grid>
  //   );
  // };

  //handle dates

  const handleDateClick = (date: Dayjs) => {
    setSelectedDate(date);
  };

  const handleSubmit = async () => {
    //console.log({ availableSlots });
    const slot = availableSlots.filter((slot: slot) => slot.tempBooked);
    //console.log({ slot });
    if (!slot.length) {
      setError("Please select atleast one slot to continue");
      message.info({
        content: "Select atleast one slot",
        duration: 3,
        style: { marginTop: "4rem" },
      });
      //message.info("Select atleast one slot", duration: 3 });
      return;
    } else {
      const date = selectedDate.format("DD/MM/YYYY");
      const object1 = {
        date,
        slots: JSON.stringify(availableSlots),
        boxCricketId: router.query.boxCricketId,
      };
      const response = await fetch("/api/bookings/updateBookingSlots", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(object1),
      });
      const result = await response.json();
      console.log({ result });
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
      <Head>
        <title>Box Cricket</title>
      </Head>

      <Header />

      <Stack
        direction="row"
        sx={{
          minWidth: "350px",
          overflowX: "auto",
          marginTop: "64px",
          backgroundColor: "rgb(249, 250, 251)",
        }}
      >
        <StyledBox1>
          <Grid container rowGap={2}>
            {/* boxcricket details */}
            <Grid
              item
              xs={12}
              sm={3}
              sx={{ backgroundColor: "#fff", border: "1px solid #ccc" }}
            >
              <Box sx={{ height: "150px" }}>
                <Carousel autoplay>
                  {boxCricket?.boxCricketImages.map((image: string, index) => (
                    <div key={index}>
                      {/* <Image
                        src={image}
                        alt="boxCricket Image"
                        width={200}
                        height={200}
                        style={{
                          width: "100%",
                          height: "150px",
                        }}
                      /> */}
                    </div>
                  ))}
                </Carousel>{" "}
              </Box>
            </Grid>
            <Grid
              item
              xs={12}
              sm={9}
              sx={{ border: "1px solid", backgroundColor: "#fff" }}
            >
              <Stack
                gap={1}
                sx={{ ml: "0.5rem", height: "200px", padding: ".5rem" }}
              >
                <Typography
                  variant="h6"
                  sx={{ borderBottom: "1px solid #ccc" }}
                >
                  {boxCricket?.boxCricketName}
                </Typography>
                <Stack>
                  {/* <PlaceIcon /> */}
                  <Typography>
                    <b>Address</b>
                  </Typography>
                  <Typography>{boxCricket?.boxCricketAddress}</Typography>
                </Stack>
                <Stack direction={{ xs: "row" }} gap={4}>
                  <Stack>
                    <Typography>
                      <b>Free Facilities</b>
                    </Typography>
                    <Typography>
                      {boxCricket?.boxCricketFreeFacilities}
                      {/* Bat, Stumps Bat, Stumps Bat, Stumps */}
                    </Typography>
                  </Stack>
                  <Stack>
                    <Typography>
                      <b>Paid Facilities </b>
                    </Typography>
                    <Typography>
                      {boxCricket?.boxCricketPaidFacilities}
                    </Typography>
                  </Stack>
                </Stack>
              </Stack>
            </Grid>

            {/* Date */}
            <Grid item xs={12} sx={{ m: "1rem 0" }}>
              <Card sx={{ overflow: "auto" }}>
                <Typography
                  variant="body1"
                  sx={{ borderBottom: "1px solid #ccc" }}
                  paddingX={2}
                  paddingY={1}
                  fontWeight={500}
                >
                  Choose Date For Which You Wish To do the Booking
                </Typography>
                <Stack
                  sx={{ minWidth: "min-content" }}
                  direction="row"
                  justifyContent="center"
                >
                  {dates.map((date, index) => (
                    <Box
                      key={index}
                      sx={{
                        padding: "1rem",
                        borderRight: "1px solid",
                        borderLeft: "1px solid",
                        cursor: "pointer",
                        backgroundColor:
                          date.date() === selectedDate.date()
                            ? "#bbb"
                            : "white",
                      }}
                      onClick={() => handleDateClick(date)}
                    >
                      {date.date()}
                    </Box>
                  ))}
                </Stack>
              </Card>
            </Grid>

            {/* Booking */}
            <Grid item xs={12}>
              <Card>
                <Grid item xs={12} sx={{ padding: "1rem" }}>
                  <Stack direction="row" justifyContent={"space-between"}>
                    <Typography variant="body1" fontWeight="600">
                      Night Booking
                    </Typography>
                    <Typography variant="body1" fontWeight="600">
                      Price : {price?.night}/Hour{" "}
                    </Typography>
                  </Stack>
                </Grid>
                {handleSlots("night")}
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card sx={{ mt: "1rem" }}>
                <Grid item xs={12} sx={{ padding: "1rem" }}>
                  <Stack direction="row" justifyContent={"space-between"}>
                    <Typography variant="body1" fontWeight="600">
                      Late Night Booking
                    </Typography>
                    <Typography variant="body1" fontWeight="600">
                      Price : {price?.lateNight}/Hour{" "}
                    </Typography>
                  </Stack>
                </Grid>
                {handleSlots("lateNight")}
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card sx={{ mt: "1rem" }}>
                <Grid item xs={12} sx={{ padding: "1rem" }}>
                  <Stack direction="row" justifyContent={"space-between"}>
                    <Typography variant="body1" fontWeight="600">
                      Morning Booking
                    </Typography>
                    <Typography variant="body1" fontWeight="600">
                      Price : {price?.morning}/Hour{" "}
                    </Typography>
                  </Stack>
                </Grid>
                {handleSlots("morning")}
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card sx={{ mt: "1rem" }}>
                <Grid item xs={12} sx={{ padding: "1rem" }}>
                  <Stack direction="row" justifyContent={"space-between"}>
                    <Typography variant="body1" fontWeight="600">
                      Afternoon Booking
                    </Typography>
                    <Typography variant="body1" fontWeight="600">
                      Price : {price?.afternoon}/Hour{" "}
                    </Typography>
                  </Stack>
                </Grid>
                {handleSlots("afternoon")}
              </Card>
            </Grid>

            <Grid item xs={12}>
              <Card
                sx={{
                  padding: "1rem",
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <Button variant="outlined" onClick={handleSubmit}>
                  Book and Pay
                </Button>
              </Card>
            </Grid>
          </Grid>
        </StyledBox1>

        {/* <StyledBox2>
          <Grid container>
            <Grid item xs={12}>
              <Card
                sx={{
                  mt: "2rem",
                  p: "1rem",
                  maxHeight: "300px",
                  overflowY: "auto",
                }}
              >
                <Typography sx={{ borderBottom: "1px solid #ccc" }}>
                  Selected Slots
                </Typography>
                {handleSelectedSlots()}
              </Card>
              <Card sx={{ p: 1, mt: 2 }}>
                <Button variant="outlined" fullWidth>
                  Book
                </Button>
              </Card>
            </Grid>
          </Grid>
        </StyledBox2> */}
      </Stack>
    </>
  );
};

export default BoxCricket;
