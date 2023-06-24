import React, { Dispatch, SetStateAction } from "react";
import Link from "next/link";

import { Grid, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { ConfirmationResult, RecaptchaVerifier } from "firebase/auth";
import {
  captchaVerifier,
  signInWithPhone,
} from "../../../config/firebase/firebase";
import Input from "../../common/Input/Input";
import CommonButton from "../../common/Button/CommonButton";
import FeedBack from "../../common/Feedback/FeedBack";
import { styles } from "../../styles/userSingupStyles";
import { signupType } from "@/pages/user/signup";
import { Spin } from "antd";

//schema
const schema = yup
  .object({
    username: yup
      .string()
      .required("username is required")
      .min(3, "Must be atleast 3 characters long"),
    phone: yup
      .string()
      .required("phone number is required")
      .matches(/^[0-9]+$/, "Must be only digits")
      .min(10, "Must be exactly 10 digits")
      .max(10, "Must be exactly 10 digits"),
  })
  .required();
type FormData = yup.InferType<typeof schema>;

//types
interface props {
  page: number;
  pageType: string;
  captcha: RecaptchaVerifier | undefined;
  setPage: Dispatch<SetStateAction<number>>;
  signupState: signupType;
  setSignupState: Dispatch<SetStateAction<signupType>>;
  setPromise: Dispatch<SetStateAction<ConfirmationResult | undefined>>;
  setCaptcha: Dispatch<SetStateAction<RecaptchaVerifier | undefined>>;
}

const MainSignUp = ({
  setPromise,
  setPage,
  signupState,
  setSignupState,
  pageType,
  setCaptcha,
  captcha,
}: props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const [loading, setLoading] = React.useState(false);
  const [openFeedBack, setOpenFeedBack] = React.useState(false);
  const [severity, setSeverity] = React.useState<
    "error" | "info" | "success" | "warning"
  >("success");
  const [message, setMessage] = React.useState("");

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenFeedBack(false);
  };

  const onSubmit = async (data: FormData) => {
    //"+16505551234"
    let phone = "+1" + data.phone;
    //let phone = "+91" + data.phone;

    //check if user is already registered or not
    try {
      setLoading(true);
      const result = await fetch("/api/user/isUserRegistered", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: data.username,
          phone: data.phone,
        }),
      });
      const response = await result.json();

      if (response.isRegistered) {
        //user is already registered
        setSeverity("warning");
        setMessage("This number is already registered");
        setOpenFeedBack(true);
      } else {
        setLoading(true);
        let captcha1;
        if (!captcha) {
          captcha1 = captchaVerifier();
        } else {
          captcha1 = captcha;
        }
        const confirmationResult = await signInWithPhone(phone, captcha1);
        setPromise(confirmationResult);
        setCaptcha(captcha1);
        setSignupState({ ...signupState, ...data });
        setPage(2);
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.error({ err });
      setSeverity("error");
      setMessage("Something Went Wrong, Please try again");
      setOpenFeedBack(true);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2}>
        {pageType === "signup" && (
          <Grid item xs={12}>
            <Input
              label="What should we call you?"
              fullWidth
              type="text"
              {...register("username")}
              helperText={errors?.username?.message}
              error={errors?.username?.message ? true : false}
            />
          </Grid>
        )}

        <Grid item xs={12}>
          <Input
            label="Phone Number"
            fullWidth
            type="number"
            {...register("phone")}
            helperText={errors?.phone?.message}
            error={errors?.phone?.message ? true : false}
          />
        </Grid>
      </Grid>

      <CommonButton
        sx={styles.nextbtn}
        variant="outlined"
        fullWidth
        type="submit"
        disabled={loading}
        size="large"
      >
        {loading ? <Spin tip="loading" /> : <b>Next</b>}
      </CommonButton>

      <FeedBack
        severity={severity}
        open={openFeedBack}
        handleClose={handleClose}
        message={message}
      />

      <Typography align={"right"} sx={styles.link}>
        <Link href={pageType === "signin" ? "/user/signup" : "/user/signin"}>
          {pageType === "signin"
            ? "Don't have an Account? Signup"
            : "Already have an account? Signin"}
        </Link>
      </Typography>
    </form>
  );
};

export default MainSignUp;
