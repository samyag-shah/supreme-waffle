import React, { useState, Dispatch, SetStateAction } from "react";

//mui
import {
  Box,
  Typography,
  Card,
  Grid,
  InputAdornment,
  Link,
} from "@mui/material";
import Input from "../../common/Input/Input";
import CommonButton from "../../common/Button/CommonButton";

//react-hooks-form
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

//styles
import { styles } from "./styles";

//google auth
import {
  signInWithPhone,
  captchaVerifier,
} from "../../../config/firebase/firebase";
import { ConfirmationResult } from "firebase/auth";
import { SignupState } from "@/pages/owner/signup";
import { message } from "antd";

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
      setLoading(false);

      if (response.isRegistered) {
        //error as user is already registered
        message.warning("User is already registered");
      } else {
        //user is not registered so send otp
        setLoading(true);
        // let phone = "+1" + "6505551234";
        // const captchaVerifier1 = captchaVerifier();
        // const ConfirmationResult = await signInWithPhone(
        //   //"+91" + data.ownerPhone,
        //   phone,
        //   captchaVerifier1
        // );
        // setPromise(ConfirmationResult);
        setLoading(false);
        setEdit(true);
        setOtpMessage(
          `We have sent an SMS to ${data.ownerPhone}, Please Verify`
        );
      }
    } catch (err: unknown) {
      setLoading(false);
      console.error({ err, message: "something went wrong" });
      message.error("something went wrong, Please try again");
    }
  };

  const verifyOtp = async (data: FormData1) => {
    try {
      //await promise?.confirm(data.otp);
      setStep(1);
      setSignupState({ ...data });
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
              <Typography sx={{ color: "blue", my: ".5rem" }}>
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

        <Box sx={{ my: "2rem", display: "flex", justifyContent: "flex-end" }}>
          <CommonButton
            variant="contained"
            //type="submit"
            sx={{ px: 8, py: 1.5 }}
            onClick={handleSubmit(onSubmit)}
            disabled={otpMessage == "" || loading}
          >
            Next
          </CommonButton>
        </Box>
      </form>
    </>
  );
};

export default SignupStep1;
