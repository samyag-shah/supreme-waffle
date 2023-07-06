//react-nextjs
import React, { useEffect } from "react";
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

import { Spin, message } from "antd";

import SendIcon from "@mui/icons-material/Send";
import { SignupState } from "@/pages/owner/signup";
import Cookies from "js-cookie";

import { slots1 } from "./slotData";

//dayjs
import dayjs from "dayjs";
import objectSupport from "dayjs/plugin/objectSupport";
import utc from "dayjs/plugin/utc";
dayjs.extend(objectSupport);
dayjs.extend(utc);

//yup
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

interface slot {
  id: number;
  startTime: string;
  endTime: string;
  selected: boolean;
  period: string;
  pricing: string;
}

interface props {
  signupState?: SignupState | undefined;
  owner?: any;
  operationType?: "update" | "new";
  boxCricektState?: any;
  boxCricketId?: string;
}

interface BoxCricket {
  bookingSlots: any[];
}

const BoxCricketSlot = ({
  boxCricektState,
  operationType,
  owner,
  signupState,
  boxCricketId,
}: props) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [slots, setSlots] = React.useState<slot[]>(slots1);

  //update slot data and pricing
  useEffect(() => {
    if (owner && operationType === "update" && boxCricketId) {
      let boxCricket: BoxCricket = owner?.Boxcrickets?.find(
        (box: any) => box.id === boxCricketId
      );

      setSlots(boxCricket.bookingSlots);
      let obj = {
        night: "",
        lateNight: "",
        morning: "",
        afternoon: "",
      };
      boxCricket.bookingSlots.map((data: slot) => {
        if (data.period === "night") {
          obj[data.period as keyof typeof obj] = data.pricing;
        } else if (data.period === "lateNight") {
          obj[data.period as keyof typeof obj] = data.pricing;
        } else if (data.period === "morning") {
          obj[data.period as keyof typeof obj] = data.pricing;
        } else if (data.period === "afternoon") {
          obj[data.period as keyof typeof obj] = data.pricing;
        }
      });
      setValue("night", obj.night);
      setValue("lateNight", obj.lateNight);
      setValue("morning", obj.morning);
      setValue("afternoon", obj.afternoon);
    }
  }, [owner, boxCricketId]);

  const onSubmit = async (data: FormData) => {
    //console.log({ data });
    let newSlots;
    //add pricing
    newSlots = slots.map((slot) => {
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
    } else if (boxCricektState) {
      newState = {
        ...boxCricektState,
        bookingSlots: newSlots,
        minSlotPrice,
        maxSlotPrice,
        ownerId: owner.id,
      };
    }

    let fd = new FormData();
    for (let key in newState) {
      if (key === "boxCricketImages") {
        if (signupState?.boxCricketImages) {
          signupState.boxCricketImages.map((image) => {
            fd.append("files", image.originFileObj);
          });
        } else {
          boxCricektState.boxCricketImages.map((image: any) => {
            fd.append("files", image.originFileObj);
          });
        }
      } else if (key === "bookingSlots") {
        fd.append(key, JSON.stringify(newState[key as keyof typeof newState]));
      } else if (key !== "boxCricketImages") {
        fd.append(key, newState[key as keyof typeof newState] as string);
      }
    }

    try {
      if (!owner) {
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
          Cookies.set("currentUser", JSON.stringify(currentUser), {
            expires: 1,
          });
          Cookies.set("token", result.token);
          message.success("User added");
          router.push("/owner");
        } else {
          message.info("something went wrong");
        }
        setLoading(false);
      } else if (owner && operationType === "update") {
        //update slots
        const result = await fetch("/api/owner/updateBoxCricketDetails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            boxCricketId: owner?.Boxcrickets?.[0].id,
            bookingSlots: JSON.stringify(newSlots),
          }),
        });
        const response = await result.json();
        if (response.status === 200) {
          message.success({
            content: "Successfully updated",
            style: { marginTop: "5rem" },
          });
        } else {
          message.success({
            content: "Please try again",
            style: { marginTop: "5rem" },
          });
        }
      } else {
        //create new boxCricket
        const result = await fetch("/api/owner/createNewBoxCricket", {
          method: "POST",
          body: fd,
        });
        const response = await result.json();
        if (response.status === 201) {
          message.success({
            content: "Successfully created",
            style: { marginTop: "5rem" },
          });
        } else {
          message.success({
            content: "Please try again",
            style: { marginTop: "5rem" },
          });
        }
      }
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
            //sx={slot.selected ? styles.selectedCard : styles.card}
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
            <Typography sx={{ mb: 1 }} fontWeight={600} variant="body1">
              BoxCricket Working hours
            </Typography>
            <Typography>
              {`Please uncheck slots during which you do not wish to recieve
              bookings`}
            </Typography>
            <Divider sx={{ mt: 1 }} />
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
                sx={{ width: "170px" }}
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
                sx={{ width: "170px" }}
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
                sx={{ width: "170px" }}
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
                sx={{ width: "170px" }}
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
            //endIcon={<SendIcon />}
          >
            {loading ? (
              <Spin />
            ) : owner ? (
              operationType === "new" ? (
                "Create"
              ) : (
                "Update"
              )
            ) : (
              "Signup"
            )}
          </CommonButton>
        </Box>
      </form>
    </>
  );
};

export default BoxCricketSlot;
