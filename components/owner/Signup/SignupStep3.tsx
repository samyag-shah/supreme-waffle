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
import { message } from "antd";

//google auth
import SendIcon from "@mui/icons-material/Send";
import { SignupState } from "@/pages/owner/signup";

const slots1 = [
  {
    id: 1,
    timing: "12:00PM to 12:30PM",
    period: "afternoon",
    selected: true,
  },
  {
    id: 2,
    timing: "12:30PM to 1:00PM",
    period: "afternoon",
    selected: true,
  },
  {
    id: 3,
    timing: "1:00PM to 1:30PM",
    period: "afternoon",
    selected: true,
  },
  {
    id: 4,
    timing: "1:30PM to 2:00PM",
    period: "afternoon",
    selected: true,
  },
  {
    id: 5,
    timing: "2:00PM to 2:30PM",
    period: "afternoon",
    selected: true,
  },
  {
    id: 6,
    timing: "2:30PM to 3:00PM",
    period: "afternoon",
    selected: true,
  },
  {
    id: 7,
    timing: "3:00PM to 3:30PM",
    period: "afternoon",
    selected: true,
  },
  {
    id: 8,
    timing: "3:30PM to 4:00PM",
    period: "afternoon",
    selected: true,
  },
  {
    id: 9,
    timing: "4:00PM to 4:30PM",
    period: "afternoon",
    selected: true,
  },
  {
    id: 10,
    timing: "4:30PM to 5:00PM",
    period: "afternoon",
    selected: true,
  },
  {
    id: 11,
    timing: "5:00PM to 5:30PM",
    period: "afternoon",
    selected: true,
  },
  {
    id: 12,
    timing: "5:30PM to 6:00PM",
    period: "afternoon",
    selected: true,
  },
  {
    id: 13,
    timing: "6:00PM to 6:30PM",
    period: "night",
    selected: true,
  },
  {
    id: 14,
    timing: "6:30PM to 7:00PM",
    period: "night",
    selected: true,
  },
  {
    id: 15,
    timing: "7:00PM to 7:30PM",
    period: "night",
    selected: true,
  },
  {
    id: 16,
    timing: "7:30PM to 8:00PM",
    period: "night",
    selected: true,
  },
  {
    id: 17,
    timing: "8:00PM to 8:30PM",
    period: "night",
    selected: true,
  },
  {
    id: 18,
    timing: "8:30PM to 9:00PM",
    period: "night",
    selected: true,
  },
  {
    id: 19,
    timing: "9:00PM to 9:30PM",
    period: "night",
    selected: true,
  },
  {
    id: 20,
    timing: "9:30PM to 10:00PM",
    period: "night",
    selected: true,
  },
  {
    id: 21,
    timing: "10:00PM to 10:30PM",
    period: "night",
    selected: true,
  },
  {
    id: 22,
    timing: "10:30PM to 11:00PM",
    period: "night",
    selected: true,
  },
  {
    id: 23,
    timing: "11:00PM to 11:30PM",
    period: "night",
    selected: true,
  },
  {
    id: 24,
    timing: "11:30PM to 12:00PM",
    period: "night",
    selected: true,
  },
  {
    id: 25,
    timing: "12:00AM to 12:30AM",
    period: "lateNight",
    selected: true,
  },
  {
    id: 26,
    timing: "12:30AM to 1:00AM",
    period: "lateNight",
    selected: true,
  },
  {
    id: 27,
    timing: "1:00AM to 1:30AM",
    period: "lateNight",
    selected: true,
  },
  {
    id: 28,
    timing: "1:30AM to 2:00AM",
    period: "lateNight",
    selected: true,
  },
  {
    id: 29,
    timing: "2:00AM to 2:30AM",
    period: "lateNight",
    selected: true,
  },
  {
    id: 30,
    timing: "2:30AM to 3:00AM",
    period: "lateNight",
    selected: true,
  },
  {
    id: 31,
    timing: "3:00AM to 3:30AM",
    period: "lateNight",
    selected: true,
  },
  {
    id: 32,
    timing: "3:30AM to 4:00AM",
    period: "lateNight",
    selected: true,
  },
  {
    id: 33,
    timing: "4:00AM to 4:30AM",
    period: "lateNight",
    selected: true,
  },
  {
    id: 34,
    timing: "4:30AM to 5:00AM",
    period: "lateNight",
    selected: true,
  },
  {
    id: 35,
    timing: "5:00AM to 5:30AM",
    period: "lateNight",
    selected: true,
  },
  {
    id: 36,
    timing: "5:30AM to 6:00AM",
    period: "lateNight",
    selected: true,
  },
  {
    id: 37,
    timing: "6:00AM to 6:30AM",
    period: "morning",
    selected: true,
  },
  {
    id: 38,
    timing: "6:30AM to 7:00AM",
    period: "morning",
    selected: true,
  },
  {
    id: 39,
    timing: "7:00AM to 7:30AM",
    period: "morning",
    selected: true,
  },
  {
    id: 40,
    timing: "7:30AM to 8:00AM",
    period: "morning",
    selected: true,
  },
  {
    id: 41,
    timing: "8:00AM to 8:30AM",
    period: "morning",
    selected: true,
  },
  {
    id: 42,
    timing: "8:30AM to 9:00AM",
    period: "morning",
    selected: true,
  },
  {
    id: 43,
    timing: "9:00AM to 9:30AM",
    period: "morning",
    selected: true,
  },
  {
    id: 44,
    timing: "9:30AM to 10:00AM",
    period: "morning",
    selected: true,
  },
  {
    id: 45,
    timing: "10:00AM to 10:30AM",
    period: "morning",
    selected: true,
  },
  {
    id: 46,
    timing: "10:30AM to 11:00AM",
    period: "morning",
    selected: true,
  },
  {
    id: 47,
    timing: "11:00AM to 11:30AM",
    period: "morning",
    selected: true,
  },
  {
    id: 48,
    timing: "11:30AM to 12:00AM",
    period: "morning",
    selected: true,
  },
];

interface slot {
  id: number;
  timing: string;
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

  console.log({ signupState });
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
        //boxCricketImages: signupState?.boxCricketImages?.[0]?.originFileObj,
      };
    }

    console.log({ newState });
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

    setLoading(true);
    const result = await fetch("/api/owner/registerNewOwner", {
      method: "POST",
      body: fd,
    });
    const response = await result.json();
    if (response.status === 201) {
      message.success("User added");
      router.push("/");
    } else {
      message.info("something went wrong");
    }
    setLoading(false);
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
              <CardContent>
                <Typography align="center" variant="body2" component="p">
                  {slot.timing}
                </Typography>
                <Typography align="center" variant="body2" component="p">
                  {slot.selected ? "Available" : "Not Available"}
                </Typography>
                {/* {slot.selected ? (
                  <CheckSharpIcon
                    sx={{ position: "absolute", top: 0, right: 0 }}
                  />
                ) : (
                  ""
                )} */}
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      </React.Fragment>
    ));
    return arr;
  };

  //console.log({ signupState });
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
          <Grid item xs={12}>
            <Box
              sx={{
                // border: "1px solid",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h6">Night (6:00 to 12:00PM)</Typography>

              <Input
                type="number"
                {...register("night")}
                helperText={errors?.night?.message}
                error={errors?.night?.message ? true : false}
                label="hourly slot price"
              />
            </Box>
          </Grid>
          {showAllSlots(12, 24)}

          {/* latenight     */}
          <Grid item xs={12}>
            <Box
              sx={{
                // border: "1px solid",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h6">
                Late Night (12:00AM to 6:00AM)
              </Typography>
              <Input
                //fullWidth
                type="number"
                {...register("lateNight")}
                helperText={errors?.lateNight?.message}
                error={errors?.lateNight?.message ? true : false}
                label="hourly slot price"
              />
            </Box>
          </Grid>
          {showAllSlots(24, 36)}

          {/* morning     */}
          <Grid item xs={12}>
            <Box
              sx={{
                // border: "1px solid",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h6">Morning (6:00 to 12:00AM)</Typography>
              <Input
                type="number"
                {...register("morning")}
                helperText={errors?.morning?.message}
                error={errors?.morning?.message ? true : false}
                label="hourly slot price"
              />
            </Box>
          </Grid>
          {showAllSlots(36, 48)}

          {/* afternoon     */}
          <Grid item xs={12}>
            <Box
              sx={{
                // border: "1px solid",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Typography variant="h6">Afternoon (12:00 to 6:00PM)</Typography>
              <Input
                type="number"
                //disabled={otpMessage === "" ? true : false}
                {...register("afternoon")}
                helperText={errors?.afternoon?.message}
                error={errors?.afternoon?.message ? true : false}
                label="hourly slot price"
              />
            </Box>
          </Grid>
          {showAllSlots(0, 12)}
        </Grid>

        <Box sx={{ my: "2rem", display: "flex", justifyContent: "flex-end" }}>
          <CommonButton
            sx={{ px: 8, py: 1.5 }}
            variant="contained"
            type="submit"
            disabled={loading}
            endIcon={<SendIcon />}
          >
            Signup
          </CommonButton>
        </Box>
      </form>
    </>
  );
};

export default SignupStep3;
