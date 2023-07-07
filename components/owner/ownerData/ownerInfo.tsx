import React, { useState, Dispatch, SetStateAction, useEffect } from "react";
import Link1 from "next/link";

//mui
import {
  Box,
  Typography,
  Grid,
  InputAdornment,
  Link,
  TextField,
} from "@mui/material";
import Input from "../../common/Input/Input";
import CommonButton from "../../common/Button/CommonButton";

//react-hooks-form
import { Controller, useForm } from "react-hook-form";
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

//dayjs
import dayjs from "dayjs";
import objectSupport from "dayjs/plugin/objectSupport";
import utc from "dayjs/plugin/utc";
dayjs.extend(objectSupport);
dayjs.extend(utc);

interface props {
  setStep?: Dispatch<SetStateAction<number>>;
  setSignupState?: Dispatch<SetStateAction<SignupState | undefined>>;
  signupState?: SignupState | undefined;
  owner?: FormData1 | undefined;
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
  otp?: string;
  id: string;
}

const OwnerInfo = ({ owner, setStep, setSignupState, signupState }: props) => {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    clearErrors,
    setError,
    formState: { errors },
  } = useForm<FormData1>({
    resolver: yupResolver(schema),
    defaultValues: { otp: "", ownerName: "", ownerPhone: "", ownerEmail: "" },
  });

  const [loading, setLoading] = useState(false);
  const [otpMessage, setOtpMessage] = useState("");
  const [edit, setEdit] = useState(false);

  const [promise, setPromise] = useState<ConfirmationResult>();

  //updating owner Data if available
  useEffect(() => {
    if (owner) {
      setValue("ownerName", owner.ownerName);
      setValue("ownerPhone", owner.ownerPhone);
      setValue("ownerEmail", owner.ownerEmail);
    }
  }, [owner]);

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
      if (setStep && setSignupState) {
        setStep(1);
        setSignupState({ ...data });
      } else {
        //update Owner Info
        const result = await fetch("/api/owner/updateOwnerDetails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ownerPhone: data?.ownerPhone,
            ownerName: data?.ownerName,
            ownerEmail: data?.ownerEmail,
            ownerId: owner?.id,
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
      }
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
    } else if (data.otp?.length !== 6) {
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
    <form>
      <div id="sign-in-button"></div>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Controller
            name="ownerName"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                label="Owner name"
                fullWidth
                {...field}
                size="small"
                helperText={errors?.ownerName?.message}
                error={errors?.ownerName?.message ? true : false}
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Controller
            name="ownerEmail"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                label="Owner Email"
                fullWidth
                type="email"
                helperText={errors?.ownerEmail?.message}
                error={errors?.ownerEmail?.message ? true : false}
                {...field}
                size="small"
              />
            )}
          />
        </Grid>

        <Grid item xs={12}>
          <Controller
            name="ownerPhone"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                label="Owner Phone number"
                fullWidth
                type="tel"
                disabled={edit}
                {...field}
                size="small"
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
            )}
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
          justifyContent: owner ? "flex-end" : "space-between",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        {!owner && (
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
        )}
        <CommonButton
          variant="outlined"
          //type="submit"
          sx={{ px: 5, py: 1 }}
          onClick={handleSubmit(onSubmit)}
          disabled={otpMessage == "" || loading}
        >
          {loading ? <Spin /> : owner ? "Update" : "Next"}
        </CommonButton>
      </Box>
    </form>
  );
};

export default OwnerInfo;
