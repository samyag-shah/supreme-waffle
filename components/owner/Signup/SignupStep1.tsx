import React, { useState, Dispatch, SetStateAction, useEffect } from "react";
import Link1 from "next/link";

//mui
import { Box, Typography, Grid, InputAdornment, Link } from "@mui/material";
import Input from "../../common/Input/Input";
import CommonButton from "../../common/Button/CommonButton";

//react-hooks-form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { SignupState } from "@/pages/owner/signup";
import { Spin, message } from "antd";

//google auth
import {
  signInWithPhone,
  captchaVerifier,
} from "../../../config/firebase/firebase";
import { ConfirmationResult } from "firebase/auth";

import dayjs from "dayjs";
import objectSupport from "dayjs/plugin/objectSupport";
import utc from "dayjs/plugin/utc";
dayjs.extend(objectSupport);
dayjs.extend(utc);

interface props {
  setStep: Dispatch<SetStateAction<number>>;
  setSignupState: Dispatch<SetStateAction<SignupState | undefined>>;
  signupState: SignupState | undefined;
}

const schema = yup
  .object({
    ownerName: yup
      .string()
      .trim()
      .required("ownername is required")
      .min(3, "must be atleast 3 characters long"),
    ownerEmail: yup.string().required("email is required").email(),
    ownerPhone: yup
      .string()
      .required("phone number is required")
      .matches(/^[0-9]+$/, "must be only digits")
      .min(10, "must be exactly 10 digits")
      .max(10, "must be exactly 10 digits"),
    otp: yup.string(),
  })
  .required();
type FormData = yup.InferType<typeof schema>;

interface FormData1 extends FormData {
  otp: string;
}

const SignupStep1 = ({ setStep, setSignupState, signupState }: props) => {
  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm<FormData1>({
    resolver: yupResolver(schema),
    defaultValues: { otp: "" },
  });

  // useEffect(() => {
  //   const calculatePeriod = (id: number) => {
  //     console.log({ id });
  //     if (id >= 1 && id <= 12) {
  //       return "lateNight";
  //     } else if (id >= 13 && id <= 24) {
  //       return "morning";
  //     } else if (id >= 25 && id <= 36) {
  //       return "afternoon";
  //     } else {
  //       return "night";
  //     }
  //   };
  //   const slots = [];
  //   let count = 0;
  //   for (let i = 0; i <= 23; i++) {
  //     let obj1 = {
  //       id: count++,
  //       startTime: dayjs({ hour: i, minute: 0 }).utc().format(),
  //       endTime: dayjs({ hour: i, minute: 30 }).utc().format(),
  //       selected: true,
  //       period: calculatePeriod(count),
  //     };
  //     let obj2 = {
  //       id: count++,
  //       startTime: dayjs({ hour: i, minute: 30 }).utc().format(),
  //       endTime: dayjs({ hour: i + 1 === 24 ? 0 : i + 1, minute: 0 })
  //         .utc()
  //         .format(),
  //       selected: true,
  //       period: calculatePeriod(count),
  //     };
  //     slots.push(obj1, obj2);
  //   }

  //   console.log({ slots });
  //   console.log({
  //     slots: slots.map((slot: any) => {
  //       return {
  //         ...slot,
  //         startTime: dayjs(slot.startTime).local().format("hh:mm A"),
  //         endTime: dayjs(slot.endTime).local().format("hh:mm A"),
  //       };
  //     }),
  //   });
  // }, []);

  const [loading, setLoading] = useState(false);
  const [otpMessage, setOtpMessage] = useState("");
  const [edit, setEdit] = useState(false);

  const [promise, setPromise] = useState<ConfirmationResult>();

  const verifyUserAndSendOtp = async (data: FormData1) => {
    //check if number is already registered
    try {
      setLoading(true);
      const result = await fetch("/api/owner/isOwnerRegistered", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: data.ownerPhone }),
      });
      const response = await result.json();

      if (response.isRegistered) {
        //error as user is already registered
        message.warning("User is already registered");
      } else {
        //user is not registered so send otp
        // let phone = "+1" + "6505551234";
        // const captchaVerifier1 = captchaVerifier();
        // const ConfirmationResult = await signInWithPhone(
        //   //"+91" + data.ownerPhone,
        //   phone,
        //   captchaVerifier1
        // );
        // setPromise(ConfirmationResult);
        setEdit(true);
        setOtpMessage(`We have sent an SMS to ${data.ownerPhone}, Verify`);
      }
      setLoading(false);
    } catch (err: unknown) {
      setLoading(false);
      console.error({ err, message: "something went wrong" });
      message.error("something went wrong, Please try again");
    }
  };

  const verifyOtp = async (data: FormData1) => {
    try {
      setLoading(true);
      //await promise?.confirm(data.otp);
      setStep(1);
      setSignupState({ ...data });
      setLoading(false);
    } catch (err) {
      console.error("error");
    }
  };

  const onSubmit = async (data: FormData1) => {
    if (data.otp == "") {
      otpMessage &&
        setError("otp", {
          type: "custom",
          message: "Please Enter Valid 6 Digit otp",
        });
      otpMessage === "" && verifyUserAndSendOtp(data);
    } else if (data.otp.length !== 6) {
      setError("otp", {
        type: "custom",
        message: "Please Enter Valid 6 Digit otp",
      });
    } else {
      verifyOtp(data);
    }
  };

  const handleEdit = () => {
    setEdit(false);
    setValue("otp", "");
    setOtpMessage("");
    clearErrors("otp");
  };

  return (
    <>
      <form>
        <div id="sign-in-button"></div>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Input
              label="Owner name"
              fullWidth
              type="text"
              {...register("ownerName")}
              helperText={errors?.ownerName?.message}
              error={errors?.ownerName?.message ? true : false}
            />
          </Grid>

          <Grid item xs={12}>
            <Input
              label="Owner Email"
              fullWidth
              type="email"
              {...register("ownerEmail")}
              helperText={errors?.ownerEmail?.message}
              error={errors?.ownerEmail?.message ? true : false}
            />
          </Grid>

          <Grid item xs={12}>
            <Input
              label="Owner Phone number"
              fullWidth
              type="tel"
              disabled={edit}
              {...register("ownerPhone")}
              helperText={errors?.ownerPhone?.message}
              error={errors?.ownerPhone?.message ? true : false}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="start">
                    <Link sx={{ cursor: "pointer" }}>
                      {edit ? (
                        <p onClick={handleEdit}>Edit</p>
                      ) : (
                        <p onClick={handleSubmit(onSubmit)}>Verify</p>
                      )}
                    </Link>
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          {otpMessage && (
            <Grid item xs={12}>
              <Typography variant="body2" sx={{ color: "blue", my: ".5rem" }}>
                {otpMessage}
              </Typography>
              <Input
                label="OTP"
                fullWidth
                type="number"
                disabled={otpMessage === "" ? true : false}
                {...register("otp")}
                helperText={errors?.otp?.message}
                error={errors?.otp?.message ? true : false}
              />
            </Grid>
          )}
        </Grid>

        <Box
          sx={{
            my: "2rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <span
            style={{
              fontSize: "1rem",
            }}
          >
            Have account?
            <Link
              style={{
                marginLeft: ".5rem",
                textDecoration: "none",
              }}
              href="/owner/signin"
            >
              Signin
            </Link>
          </span>
          <CommonButton
            variant="outlined"
            //type="submit"
            sx={{ px: 5, py: 1 }}
            onClick={handleSubmit(onSubmit)}
            disabled={otpMessage == "" || loading}
          >
            {loading ? <Spin /> : "Next"}
          </CommonButton>
        </Box>
      </form>
    </>
  );
};

export default SignupStep1;
