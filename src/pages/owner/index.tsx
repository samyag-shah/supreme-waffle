import { Spin, message } from "antd";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Header from "../../../components/Header/header";
import {
  Card,
  Typography,
  Box,
  Grid,
  Stack,
  Select,
  MenuItem,
  Modal,
  SelectChangeEvent,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import EditIcon from "@mui/icons-material/Edit";

//dayjs
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
interface BoxCricket {
  id: string;
  boxCricketName: string;
}
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const StyledBox1 = styled(Box)(({ theme }) => ({
  marginTop: "80px",
  minHeight: "85vh",
  width: "100%",
  padding: "1rem 2rem",
  [theme.breakpoints.up("sm")]: {
    width: "80%",
  },
}));

export default function Home() {
  const [owner, setOwner] = useState<owner>();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [boxCricket, setBoxCricket] = useState<BoxCricket[]>([]);
  const [selectedBoxCricketId, setSelectedBoxCricketId] = useState("");
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const router = useRouter();

  //get Owner's BoxCricket Details Details
  useEffect(() => {
    const getOwnerDetail = async () => {
      const response = await fetch("/api/owner/getOwnerDetails", {
        method: "POST",
        body: "",
      });
      const result = await response.json();

      if (result.status === 200) {
        console.log({ owner: result.owner });
        setOwner(result.owner);
        let boxCrickets = result.owner.Boxcrickets.map((data: BoxCricket) => ({
          id: data.id,
          boxCricketName: data.boxCricketName,
        }));
        console.log({ boxCrickets });
        setBoxCricket(boxCrickets);
        setSelectedBoxCricketId(boxCrickets?.[0]?.id);
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

  //get specific boxCricket Booking data on specific date
  useEffect(() => {
    const fetchBookingByBoxCricketId = async () => {
      try {
        const response = await fetch(
          `/api/userBookings/getBookingsByBoxCricketId`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              boxCricketId: selectedBoxCricketId,
              date: selectedDate,
            }),
          }
        );
        const result = await response.json();
        //console.log({ userBookings: result.userBookings });
        setBookings(result.userBookings);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (owner && selectedDate && selectedBoxCricketId) {
      fetchBookingByBoxCricketId();
    }
  }, [owner, selectedDate, selectedBoxCricketId]);

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
      return <>{bookingOfUsers}</>;
    } else {
      return <Box>You don't have any bookings</Box>;
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
            alignItems="center"
            justifyContent="space-between"
          >
            <Box>Your BoxCricket Bookings</Box>

            <Typography>
              Filters
              <IconButton onClick={handleOpen}>
                <FilterAltIcon />
              </IconButton>
            </Typography>
          </Stack>
          <Card sx={{ p: "1rem" }}>
            <Typography
              variant="h6"
              sx={{ borderBottom: "1px solid", mb: "2rem" }}
            >
              Bookings of BoxCricket{" "}
              <b>
                {
                  boxCricket.find((data) => data.id === selectedBoxCricketId)
                    ?.boxCricketName
                }
              </b>{" "}
              on <b>{dayjs(selectedDate).format("DD/MM/YYYY")}</b>
              <IconButton onClick={handleOpen}>
                <EditIcon />
              </IconButton>
            </Typography>

            <Grid gap={2} container>
              <ShowBooking />
            </Grid>
          </Card>
        </StyledBox1>
        {/* <StyledBox2></StyledBox2> */}
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Stack gap={2} sx={style}>
            <Stack>
              <Typography>BoxCricket Name</Typography>
              <Select
                labelId="demo-simple-select-standard-label"
                id="demo-simple-select-standard"
                value={selectedBoxCricketId}
                onChange={(e: SelectChangeEvent) =>
                  setSelectedBoxCricketId(e.target.value)
                }
                //label="Box Cricket Name"
                size="small"
              >
                {boxCricket.map((box: BoxCricket) => (
                  <MenuItem key={box.id} value={box.id}>
                    {box.boxCricketName}
                  </MenuItem>
                ))}
              </Select>
            </Stack>
            <Stack>
              {/* <Typography>Booking Date</Typography> */}
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  value={selectedDate}
                  onChange={(value: any) => setSelectedDate(value)}
                  label="Date of Booking"
                />
              </LocalizationProvider>
            </Stack>
          </Stack>
        </Modal>
      </Stack>
    </>
  );
}
