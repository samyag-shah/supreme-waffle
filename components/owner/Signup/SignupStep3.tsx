//react-nextjs
import React from "react";
import { useRouter } from "next/router";

//mui
import {
  Box,
  Typography,
  Grid,
  Divider,
  Card,
  CardActionArea,
  CardContent,
} from "@mui/material";
import Input from "../../common/Input/Input";
import CommonButton from "../../common/Button/CommonButton";
import CheckSharpIcon from "@mui/icons-material/CheckSharp";

//react-hooks-form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { styles } from "./styles";
import { Spin, message } from "antd";

import SendIcon from "@mui/icons-material/Send";
import { SignupState } from "@/pages/owner/signup";
import Cookies from "js-cookie";

import dayjs from "dayjs";
import objectSupport from "dayjs/plugin/objectSupport";
import utc from "dayjs/plugin/utc";
dayjs.extend(objectSupport);
dayjs.extend(utc);

const slots1 = [
  {
    id: 0,
    startTime: "2023-06-18T18:30:00Z",
    endTime: "2023-06-18T19:00:00Z",
    selected: true,
    period: "lateNight",
  },
  {
    id: 1,
    startTime: "2023-06-18T19:00:00Z",
    endTime: "2023-06-18T19:30:00Z",
    selected: true,
    period: "lateNight",
  },
  {
    id: 2,
    startTime: "2023-06-18T19:30:00Z",
    endTime: "2023-06-18T20:00:00Z",
    selected: true,
    period: "lateNight",
  },
  {
    id: 3,
    startTime: "2023-06-18T20:00:00Z",
    endTime: "2023-06-18T20:30:00Z",
    selected: true,
    period: "lateNight",
  },
  {
    id: 4,
    startTime: "2023-06-18T20:30:00Z",
    endTime: "2023-06-18T21:00:00Z",
    selected: true,
    period: "lateNight",
  },
  {
    id: 5,
    startTime: "2023-06-18T21:00:00Z",
    endTime: "2023-06-18T21:30:00Z",
    selected: true,
    period: "lateNight",
  },
  {
    id: 6,
    startTime: "2023-06-18T21:30:00Z",
    endTime: "2023-06-18T22:00:00Z",
    selected: true,
    period: "lateNight",
  },
  {
    id: 7,
    startTime: "2023-06-18T22:00:00Z",
    endTime: "2023-06-18T22:30:00Z",
    selected: true,
    period: "lateNight",
  },
  {
    id: 8,
    startTime: "2023-06-18T22:30:00Z",
    endTime: "2023-06-18T23:00:00Z",
    selected: true,
    period: "lateNight",
  },
  {
    id: 9,
    startTime: "2023-06-18T23:00:00Z",
    endTime: "2023-06-18T23:30:00Z",
    selected: true,
    period: "lateNight",
  },
  {
    id: 10,
    startTime: "2023-06-18T23:30:00Z",
    endTime: "2023-06-19T00:00:00Z",
    selected: true,
    period: "lateNight",
  },
  {
    id: 11,
    startTime: "2023-06-19T00:00:00Z",
    endTime: "2023-06-19T00:30:00Z",
    selected: true,
    period: "lateNight",
  },
  {
    id: 12,
    startTime: "2023-06-19T00:30:00Z",
    endTime: "2023-06-19T01:00:00Z",
    selected: true,
    period: "morning",
  },
  {
    id: 13,
    startTime: "2023-06-19T01:00:00Z",
    endTime: "2023-06-19T01:30:00Z",
    selected: true,
    period: "morning",
  },
  {
    id: 14,
    startTime: "2023-06-19T01:30:00Z",
    endTime: "2023-06-19T02:00:00Z",
    selected: true,
    period: "morning",
  },
  {
    id: 15,
    startTime: "2023-06-19T02:00:00Z",
    endTime: "2023-06-19T02:30:00Z",
    selected: true,
    period: "morning",
  },
  {
    id: 16,
    startTime: "2023-06-19T02:30:00Z",
    endTime: "2023-06-19T03:00:00Z",
    selected: true,
    period: "morning",
  },
  {
    id: 17,
    startTime: "2023-06-19T03:00:00Z",
    endTime: "2023-06-19T03:30:00Z",
    selected: true,
    period: "morning",
  },
  {
    id: 18,
    startTime: "2023-06-19T03:30:00Z",
    endTime: "2023-06-19T04:00:00Z",
    selected: true,
    period: "morning",
  },
  {
    id: 19,
    startTime: "2023-06-19T04:00:00Z",
    endTime: "2023-06-19T04:30:00Z",
    selected: true,
    period: "morning",
  },
  {
    id: 20,
    startTime: "2023-06-19T04:30:00Z",
    endTime: "2023-06-19T05:00:00Z",
    selected: true,
    period: "morning",
  },
  {
    id: 21,
    startTime: "2023-06-19T05:00:00Z",
    endTime: "2023-06-19T05:30:00Z",
    selected: true,
    period: "morning",
  },
  {
    id: 22,
    startTime: "2023-06-19T05:30:00Z",
    endTime: "2023-06-19T06:00:00Z",
    selected: true,
    period: "morning",
  },
  {
    id: 23,
    startTime: "2023-06-19T06:00:00Z",
    endTime: "2023-06-19T06:30:00Z",
    selected: true,
    period: "morning",
  },
  {
    id: 24,
    startTime: "2023-06-19T06:30:00Z",
    endTime: "2023-06-19T07:00:00Z",
    selected: true,
    period: "afternoon",
  },
  {
    id: 25,
    startTime: "2023-06-19T07:00:00Z",
    endTime: "2023-06-19T07:30:00Z",
    selected: true,
    period: "afternoon",
  },
  {
    id: 26,
    startTime: "2023-06-19T07:30:00Z",
    endTime: "2023-06-19T08:00:00Z",
    selected: true,
    period: "afternoon",
  },
  {
    id: 27,
    startTime: "2023-06-19T08:00:00Z",
    endTime: "2023-06-19T08:30:00Z",
    selected: true,
    period: "afternoon",
  },
  {
    id: 28,
    startTime: "2023-06-19T08:30:00Z",
    endTime: "2023-06-19T09:00:00Z",
    selected: true,
    period: "afternoon",
  },
  {
    id: 29,
    startTime: "2023-06-19T09:00:00Z",
    endTime: "2023-06-19T09:30:00Z",
    selected: true,
    period: "afternoon",
  },
  {
    id: 30,
    startTime: "2023-06-19T09:30:00Z",
    endTime: "2023-06-19T10:00:00Z",
    selected: true,
    period: "afternoon",
  },
  {
    id: 31,
    startTime: "2023-06-19T10:00:00Z",
    endTime: "2023-06-19T10:30:00Z",
    selected: true,
    period: "afternoon",
  },
  {
    id: 32,
    startTime: "2023-06-19T10:30:00Z",
    endTime: "2023-06-19T11:00:00Z",
    selected: true,
    period: "afternoon",
  },
  {
    id: 33,
    startTime: "2023-06-19T11:00:00Z",
    endTime: "2023-06-19T11:30:00Z",
    selected: true,
    period: "afternoon",
  },
  {
    id: 34,
    startTime: "2023-06-19T11:30:00Z",
    endTime: "2023-06-19T12:00:00Z",
    selected: true,
    period: "afternoon",
  },
  {
    id: 35,
    startTime: "2023-06-19T12:00:00Z",
    endTime: "2023-06-19T12:30:00Z",
    selected: true,
    period: "afternoon",
  },
  {
    id: 36,
    startTime: "2023-06-19T12:30:00Z",
    endTime: "2023-06-19T13:00:00Z",
    selected: true,
    period: "night",
  },
  {
    id: 37,
    startTime: "2023-06-19T13:00:00Z",
    endTime: "2023-06-19T13:30:00Z",
    selected: true,
    period: "night",
  },
  {
    id: 38,
    startTime: "2023-06-19T13:30:00Z",
    endTime: "2023-06-19T14:00:00Z",
    selected: true,
    period: "night",
  },
  {
    id: 39,
    startTime: "2023-06-19T14:00:00Z",
    endTime: "2023-06-19T14:30:00Z",
    selected: true,
    period: "night",
  },
  {
    id: 40,
    startTime: "2023-06-19T14:30:00Z",
    endTime: "2023-06-19T15:00:00Z",
    selected: true,
    period: "night",
  },
  {
    id: 41,
    startTime: "2023-06-19T15:00:00Z",
    endTime: "2023-06-19T15:30:00Z",
    selected: true,
    period: "night",
  },
  {
    id: 42,
    startTime: "2023-06-19T15:30:00Z",
    endTime: "2023-06-19T16:00:00Z",
    selected: true,
    period: "night",
  },
  {
    id: 43,
    startTime: "2023-06-19T16:00:00Z",
    endTime: "2023-06-19T16:30:00Z",
    selected: true,
    period: "night",
  },
  {
    id: 44,
    startTime: "2023-06-19T16:30:00Z",
    endTime: "2023-06-19T17:00:00Z",
    selected: true,
    period: "night",
  },
  {
    id: 45,
    startTime: "2023-06-19T17:00:00Z",
    endTime: "2023-06-19T17:30:00Z",
    selected: true,
    period: "night",
  },
  {
    id: 46,
    startTime: "2023-06-19T17:30:00Z",
    endTime: "2023-06-19T18:00:00Z",
    selected: true,
    period: "night",
  },
  {
    id: 47,
    startTime: "2023-06-19T18:00:00Z",
    endTime: "2023-06-18T18:30:00Z",
    selected: true,
    period: "night",
  },
];

interface slot {
  id: number;
  startTime: string;
  endTime: string;
  selected: boolean;
  period: string;
}

const schema = yup
  .object({
    night: yup
      .string()
      .required("slot price is required")
      .matches(/^[0-9]+$/, "Must be only digits"),
    lateNight: yup
      .string()
      .required("slot price is required")
      .matches(/^[0-9]+$/, "Must be only digits"),
    morning: yup
      .string()
      .required("slot price is required")
      .matches(/^[0-9]+$/, "Must be only digits"),
    afternoon: yup
      .string()
      .required("slot price is required")
      .matches(/^[0-9]+$/, "Must be only digits"),
  })
  .required();
type FormData = yup.InferType<typeof schema>;

interface props {
  signupState: SignupState | undefined;
}

const SignupStep3 = ({ signupState }: props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [slots, setSlots] = React.useState<slot[]>(slots1);

  const onSubmit = async (data: FormData) => {
    //console.log({ data });

    let newSlots;
    //remove unselected slots
    newSlots = slots.filter((slot) => slot.selected !== false);
    //add pricing
    newSlots = newSlots.map((slot) => {
      return {
        ...slot,
        pricing: data[slot.period as keyof typeof data],
      };
    });

    let newState;
    let minSlotPrice = Math.min(
      ...Object.values(data).map((data) => parseInt(data))
    );
    let maxSlotPrice = Math.max(
      ...Object.values(data).map((data) => parseInt(data))
    );
    if (signupState) {
      newState = {
        ...signupState,
        bookingSlots: newSlots,
        minSlotPrice,
        maxSlotPrice,
      };
    }

    let fd = new FormData();
    for (let key in newState) {
      if (key === "boxCricketImages") {
        if (signupState?.boxCricketImages) {
          signupState.boxCricketImages.map((image) => {
            fd.append("files", image.originFileObj);
          });
        }
      } else if (key === "bookingSlots") {
        fd.append(key, JSON.stringify(newState[key as keyof typeof newState]));
      } else if (key !== "boxCricketImages") {
        //if(){
        fd.append(key, newState[key as keyof typeof newState] as string);
        //}
      }
    }

    try {
      setLoading(true);
      const response = await fetch("/api/owner/registerNewOwner", {
        method: "POST",
        body: fd,
      });
      const result = await response.json();
      if (result.status === 201) {
        const currentUser = {
          userType: "owner",
          name: result.newOwner.ownerName,
          phone: result.newOwner.ownerPhone,
          id: result.newOwner.id,
        };
        Cookies.set("currentUser", JSON.stringify(currentUser), { expires: 1 });
        Cookies.set("token", result.token);
        message.success("User added");
        router.push("/owner");
      } else {
        message.info("something went wrong");
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
      message.info("something went wrong");
    }
  };

  //handle Slots
  const handleSlotClick = (e: React.MouseEvent<HTMLDivElement>, id: number) => {
    let newSlots = slots.map((slot: slot) => {
      if (slot.id === id) {
        return { ...slot, selected: !slot.selected };
      } else {
        return slot;
      }
    });
    setSlots(newSlots);
  };

  const showAllSlots = (startIndex: number, endIndex: number) => {
    let arr = slots.slice(startIndex, endIndex).map((slot: slot, index) => (
      <React.Fragment key={index}>
        <Grid item xs={6} sm={4}>
          <Card
            onClick={(e) => handleSlotClick(e, slot.id)}
            sx={slot.selected ? styles.selectedCard : styles.card}
          >
            <CardActionArea>
              <CardContent sx={{ px: 1, py: 2 }}>
                <Typography align="center" variant="body2" component="p">
                  {dayjs(slot.startTime).local().format("hh:mm")} -{" "}
                  {dayjs(slot.endTime).local().format("hh:mm A")}
                </Typography>
                <Typography align="center" variant="body2" component="p">
                  {slot.selected ? "Available" : "Not Available"}
                </Typography>
                {slot.selected ? (
                  <CheckSharpIcon
                    sx={{
                      width: "18px",
                      height: "18px",
                      position: "absolute",
                      top: 2,
                      border: "1px solid",
                      borderRadius: "100%",
                      right: 2,
                      color: "white",
                      backgroundColor: "green",
                    }}
                  />
                ) : (
                  ""
                )}
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </React.Fragment>
    ));
    return arr;
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography sx={styles.workingHoursTitle}>
              Select working hours
            </Typography>
            <Typography sx={styles.workingHoursSubtitle}>
              {`"Please uncheck slots during which you do not wish to recieve
              bookings"`}
            </Typography>
            <Divider sx={styles.divider1} />
          </Grid>

          {/* night     */}
          <Grid item xs={12} sx={{ overflowX: "auto" }}>
            <Box
              sx={{
                borderBottom: "1px solid #ccc",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                pt: "1rem",
                pb: ".2rem",
                minWidth: "450px",
              }}
            >
              <Typography variant="body1" fontWeight={500}>
                Night (6:00 to 12:00PM)
              </Typography>

              <Input
                type="tel"
                {...register("night")}
                helperText={errors?.night?.message}
                error={errors?.night?.message ? true : false}
                label="hourly slot price"
              />
            </Box>
          </Grid>
          {showAllSlots(36, 48)}

          {/* latenight     */}
          <Grid item xs={12} sx={{ overflowX: "auto" }}>
            <Box
              sx={{
                borderBottom: "1px solid #ccc",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                pt: "1rem",
                pb: ".2rem",
                minWidth: "450px",
              }}
            >
              <Typography variant="body1" fontWeight={500}>
                Late Night (12:00 to 6:00AM)
              </Typography>
              <Input
                //fullWidth
                type="tel"
                {...register("lateNight")}
                helperText={errors?.lateNight?.message}
                error={errors?.lateNight?.message ? true : false}
                label="hourly slot price"
              />
            </Box>
          </Grid>
          {showAllSlots(0, 12)}

          {/* morning     */}
          <Grid item xs={12} sx={{ overflowX: "auto" }}>
            <Box
              sx={{
                borderBottom: "1px solid #ccc",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                pt: "1rem",
                pb: ".2rem",
                minWidth: "450px",
              }}
            >
              <Typography variant="body1" fontWeight={500}>
                Morning (6:00 to 12:00AM)
              </Typography>
              <Input
                type="tel"
                {...register("morning")}
                helperText={errors?.morning?.message}
                error={errors?.morning?.message ? true : false}
                label="hourly slot price"
              />
            </Box>
          </Grid>
          {showAllSlots(12, 24)}

          {/* afternoon     */}
          <Grid item xs={12} sx={{ overflowX: "auto" }}>
            <Box
              sx={{
                borderBottom: "1px solid #ccc",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                pt: "1rem",
                pb: ".2rem",
                minWidth: "450px",
              }}
            >
              <Typography variant="body1" fontWeight={500}>
                Afternoon (12:00 to 6:00PM)
              </Typography>
              <Input
                type="tel"
                //disabled={otpMessage === "" ? true : false}
                {...register("afternoon")}
                helperText={errors?.afternoon?.message}
                error={errors?.afternoon?.message ? true : false}
                label="hourly slot price"
              />
            </Box>
          </Grid>
          {showAllSlots(24, 36)}
        </Grid>

        <Box sx={{ my: "2rem", display: "flex", justifyContent: "flex-end" }}>
          <CommonButton
            sx={{ px: 5, py: 1 }}
            variant="contained"
            type="submit"
            disabled={loading}
            endIcon={<SendIcon />}
          >
            {loading ? <Spin /> : "Signup"}
          </CommonButton>
        </Box>
      </form>
    </>
  );
};

export default SignupStep3;
