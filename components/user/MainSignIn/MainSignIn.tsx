import React, { useEffect, Dispatch, SetStateAction } from "react";
import Link from "next/link";

import { Grid, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ConfirmationResult, RecaptchaVerifier } from "firebase/auth";

import {
  signInWithPhone,
  captchaVerifier,
} from "../../../config/firebase/firebase";
import Input from "../../common/Input/Input";
import CommonButton from "../../common/Button/CommonButton";
import FeedBack from "../../common/Feedback/FeedBack";
import { signupType } from "@/pages/user/signup";
import { styles } from "../../styles/userSigninStyles";

const schema = yup
  .object({
    phone: yup
      .string()
      .required("phone number is required")
      .matches(/^[0-9]+$/, "Must be only digits")
      .min(10, "Must be exactly 10 digits")
      .max(10, "Must be exactly 10 digits"),
  })
  .required();
type FormData = yup.InferType<typeof schema>;

interface props {
  page: number;
  pageType: string;
  setPage: Dispatch<SetStateAction<number>>;
  signupState: signupType;
  setSignupState: Dispatch<SetStateAction<signupType>>;
  setPromise: Dispatch<SetStateAction<ConfirmationResult | undefined>>;
  setCaptcha: Dispatch<SetStateAction<RecaptchaVerifier | undefined>>;
}

const MainSignIn = ({
  setPromise,
  page,
  setPage,
  signupState,
  setSignupState,
  pageType,
  setCaptcha,
}: props) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const [loading, setLoading] = React.useState(false);

  //Feedback
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

  //Step1
  useEffect(() => {
    if (signupState.phone) {
      setValue("phone", signupState.phone);
    }
  }, [page]);

  const onSubmit = async (data: FormData) => {
    //"+16505551234"
    let phone = "+1" + data.phone;

    //check if user is already registered or not
    setLoading(true);
    const result = await fetch("/api/isUserRegisterd", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        loginMethod: "Phone",
        phone: data.phone,
      }),
    });
    const response = await result.json();
    setLoading(false);

    if (!response.isRegistered) {
      //user is not registered
      setSeverity("warning");
      setMessage("This number is not registered");
      setOpenFeedBack(true);
    } else {
      //user is registered
      setLoading(true);
      try {
        setLoading(true);
        const captcha = captchaVerifier();
        const confirmationResult = await signInWithPhone(phone, captcha);
        setLoading(false);
        setPromise(confirmationResult);
        setCaptcha(captcha);
        setSignupState({ ...signupState, ...data });
        setPage(2);
      } catch (err) {
        setLoading(false);
        setSeverity("error");
        setMessage("Something Went Wrong, Please try again");
        setOpenFeedBack(true);
      }
    }

    //setPage(2);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={2} sx={styles.formContainer}>
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
        variant="contained"
        fullWidth
        type="submit"
        id="sign-in-button"
        disabled={loading}
      >
        Next
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
            : "Already have an account? Sign in"}
        </Link>
      </Typography>
    </form>
  );
};

export default MainSignIn;
