import { Box, Card, Typography, Grid, Stack, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

import CommonButton from "../../../../components/common/Button/CommonButton";
import Header from "../../../../components/Header/header";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Modal, Spin, message } from "antd";
import Cookies from "js-cookie";

import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

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

interface Booking {
  userId: string;
  bookingId: string;
  date: string;
  slotsBooked: Array<slot>;
  userBookings: Array<slot>;
  boxCricketId: string;
  slots: Array<slot>;
}

const Payment = () => {
  const [booking, setBooking] = useState<Booking>();
  const [pastBooking, setPastBooking] = useState<Booking[]>([]);
  const [totalPricing, setTotalPricing] = useState(0);
  const [deleteSlot, setDeleteSlot] = useState<slot>();
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  //get current booking data from localStorage
  useEffect(() => {
    let userBooking;
    if (typeof window !== "undefined") {
      const booking = localStorage.getItem("userBookings");
      if (booking) {
        userBooking = JSON.parse(booking);
      }
    }
    setBooking(userBooking);
  }, []);

  //get Past Booking data
  useEffect(() => {
    const fetchBookingByUserId = async () => {
      const user = Cookies.get("currentUser");
      let CurrentUser;
      if (user) {
        CurrentUser = JSON.parse(user);
      }

      try {
        const response = await fetch(
          `/api/userBookings/getBookingsByUserId?userId=${CurrentUser?.id}`
        );
        const result = await response.json();
        setPastBooking(result.userBookings);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        console.error(err);
      }
    };

    fetchBookingByUserId();
  }, []);

  //count Total Price
  useEffect(() => {
    let totalPrice = 0;
    booking?.slotsBooked?.map(
      (slot: any, index: number) => (totalPrice += slot.pricing / 2)
    );
    setTotalPricing(totalPrice);
  }, [booking]);

  //delete slot booking
  const handleSlotDelete = () => {
    if (booking && deleteSlot) {
      const filteredBookingSlots = booking.slotsBooked.filter(
        (slot1: slot) => slot1.id !== deleteSlot.id
      );
      const newBookings = {
        ...booking,
        slotsBooked: filteredBookingSlots || [],
      };
      localStorage.setItem("userBookings", JSON.stringify(newBookings));
      setBooking(newBookings);
    }
    handleOk();
  };

  const updateCurrentBooking = async () => {
    //mark booking as update
    const newSlots = booking?.slots.map((slot: slot) => {
      if (slot.tempBooked) {
        return {
          ...slot,
          booked: true,
          tempBooked: false,
        };
      } else {
        return {
          ...slot,
          tempBooked: false,
        };
      }
    });

    const bookingId = booking?.bookingId;
    const object1 = {
      bookingId,
      slots: JSON.stringify(newSlots),
    };
    const response = await fetch("/api/bookings/updateBookingSlots", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(object1),
    });
    const result = await response.json();
    return result;
  };
  const handlePayNow = async () => {
    setLoading(true);
    const payload = {
      userId: booking?.userId,
      boxCricketId: booking?.boxCricketId,
      userBookings: JSON.stringify(booking?.slotsBooked),
      date: booking?.date,
    };
    try {
      const response = await fetch("/api/userBookings/createBookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      const result1 = await updateCurrentBooking();
      console.log({ result1 });
      if (result.status === 201 && result1.status === 200) {
        //console.log("hello");
        localStorage.clear();
        setBooking(undefined);
        message.success({
          content: "booking success",
          duration: 3,
          style: { marginTop: "4rem" },
        });
        router.push("/");
      } else {
        message.error({
          content: "something went wrong",
          duration: 3,
          style: { marginTop: "4rem" },
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  //modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  //components
  const CurrentBooking = () => {
    //console.log({ booking });
    if (booking?.slotsBooked?.length) {
      return (
        <Box>
          <Card>
            <Typography sx={{ borderBottom: "1px solid #ccc", p: 2 }}>
              Current Booking
            </Typography>
            <Grid container gap={2} sx={{ m: 2 }}>
              {booking?.slotsBooked?.map((slot: slot, index: number) => (
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
                      <Typography>
                        Pricing {parseInt(slot.pricing) / 2}
                      </Typography>
                      <Typography>date {booking.date}</Typography>
                    </Box>
                    <Box>
                      <IconButton
                        onClick={() => {
                          setDeleteSlot(slot);
                          showModal();
                        }}
                      >
                        <DeleteOutlineIcon sx={{ color: "red" }} />
                      </IconButton>
                    </Box>
                  </Stack>
                </Grid>
              ))}
            </Grid>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              flexWrap="wrap"
              sx={{ p: 2 }}
            >
              <Typography variant="h6">
                Total Payable Amount : {totalPricing}
              </Typography>
              <CommonButton
                sx={{ width: { xs: "100%", sm: "200px" } }}
                variant="contained"
                onClick={handlePayNow}
              >
                Pay Now
              </CommonButton>
            </Stack>
          </Card>
        </Box>
      );
    } else {
      return <></>;
    }
  };

  const PastBooking1 = () => {
    if (pastBooking.length) {
      return (
        <Box>
          <Card>
            <Typography sx={{ borderBottom: "1px solid #ccc", p: 2 }}>
              Previous Bookings
            </Typography>
            <Grid container gap={2} sx={{ m: 2 }}>
              {pastBooking.map((pastBooking1) => {
                return pastBooking1.userBookings?.map(
                  (slot: slot, index: number) => (
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
                            {dayjs(slot.startTime)
                              .local()
                              .format("hh:mm")} -{" "}
                            {dayjs(slot.endTime).local().format("hh:mm A")}
                          </Typography>
                          <Typography>
                            Pricing {parseInt(slot.pricing) / 2}
                          </Typography>
                          {/* <Typography>date {booking.date}</Typography> */}
                        </Box>
                      </Stack>
                    </Grid>
                  )
                );
              })}
            </Grid>
          </Card>
        </Box>
      );
    } else {
      return <></>;
    }
  };

  const NoBookings = () => {
    if (!pastBooking.length && !booking) {
      return (
        <Box>
          <Card
            sx={{
              height: "20rem",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="h5">
              You dont have any current Bookings
            </Typography>
          </Card>
        </Box>
      );
    } else {
      return <></>;
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
          p: "6rem 2rem",
          backgroundColor: "rgb(249, 250, 251)",
          minHeight: "100vh",
        }}
        gap={4}
      >
        <CurrentBooking />
        <PastBooking1 />
        <NoBookings />
      </Stack>

      <Modal
        open={isModalOpen}
        onOk={handleSlotDelete}
        onCancel={handleCancel}
        destroyOnClose={true}
      >
        <Typography variant="body1">
          Are you sure you want to delete this booking?
        </Typography>
      </Modal>
    </>
  );
};

export default Payment;
