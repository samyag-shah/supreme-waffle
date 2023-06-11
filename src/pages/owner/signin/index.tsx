import React, {
  useEffect,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import { Grid, Container, Typography, Box } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ConfirmationResult, RecaptchaVerifier } from "firebase/auth";

import {
  signInWithPhone,
  captchaVerifier,
} from "../../../../config/firebase/firebase";
import Input from "../../../../components/common/Input/Input";
import CommonButton from "../../../../components/common/Button/CommonButton";
import FeedBack from "../../../../components/common/Feedback/FeedBack";
import { styles } from "../../../../components/styles/OwnerSigninStyles";
import { UserContext } from "@/pages/_app";

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

const schema1 = yup
  .object({
    otp: yup
      .string()
      .required("otp is required")
      .matches(/^[0-9]+$/, "Must be only digits")
      .min(6, "Must be exactly 6 digits")
      .max(6, "Must be exactly 6 digits"),
  })
  .required();
type FormData1 = yup.InferType<typeof schema1>;

const OwnerSignIn = () => {
  const [page1, setPage1] = React.useState(1);
  const [promise, setPromise] = React.useState<ConfirmationResult>();
  const [captcha, setCaptcha] = React.useState<RecaptchaVerifier>();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const {
    register: register1,
    handleSubmit: handleSubmit1,
    setValue: setValue1,
    formState: { errors: errors1 },
  } = useForm<FormData1>({
    resolver: yupResolver(schema1),
  });

  const [loading1, setLoading1] = useState(true);
  const router = useRouter();

  const value = useContext(UserContext);

  //Feedback
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
    console.log({ data });
    setValue1("otp", "");

    //check if owner is already registered or not
    setLoading(true);
    const result = await fetch("/api/owner/isOwnerRegistered", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        phone: data.phone,
      }),
    });
    const response = await result.json();
    setLoading(false);

    if (!response.isRegistered) {
      //owner is not registered
      setSeverity("warning");
      setMessage("This number is not registered");
      setOpenFeedBack(true);
    } else {
      //owner is registered
      setPage1(2);
      //   setLoading(true);
      //   try {
      //     setLoading(true);
      //     const captcha = captchaVerifier();
      //     const confirmationResult = await signInWithPhone(
      //       "+1" + data.phone,
      //       captcha
      //     );
      //     setLoading(false);
      //     setPromise(confirmationResult);
      //     setCaptcha(captcha);
      //     setPage1(2);
      //   } catch (err) {
      //     setLoading(false);
      //     setSeverity("error");
      //     setMessage("Something Went Wrong, Please try again");
      //     setOpenFeedBack(true);
      //   }
    }
  };

  const onSubmit1 = async (data: FormData1) => {
    console.log({ data });

    setLoading(true);
    const phone = getValues("phone");
    const response = await fetch("/api/owner/ownerSignin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ phone }),
    });
    const result = await response.json();
    console.log({ result });
    setLoading(false);
    localStorage.setItem("access_token", result.access_token);
    localStorage.setItem("user", JSON.stringify(result.user));
    if (value) {
      value?.setSession({ user: result.user, token: result.access_token });
    }
    router.push("/owner");
    // if (promise) {
    //   promise
    //     .confirm(data.otp)
    //     .then((res) => {
    //       console.log(res);
    //       setLoading(false);
    //       router.push("/");
    //     })
    //     .catch((error) => {
    //       console.error({ error });
    //       setLoading(false);
    //       setSeverity("error");
    //       setMessage("Incorrect Code Please try again");
    //       setOpenFeedBack(true);
    //     });
    // }
  };

  return (
    <Box sx={styles.containerWrapper}>
      <Container maxWidth={"xs"} sx={styles.container}>
        {page1 === 1 && (
          <Grid item xs={12}>
            <Typography variant="h5" sx={styles.header}>
              Signin
            </Typography>
          </Grid>
        )}

        {page1 === 1 && (
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2} sx={styles.formContainer}>
              <Grid item xs={12}>
                <Input
                  label="Phone Number"
                  fullWidth
                  type="number"
                  {...register("phone")}
                  helperText={"phone" in errors && errors?.phone?.message}
                  error={
                    "phone" in errors && errors?.phone?.message ? true : false
                  }
                />
              </Grid>
              <Grid item xs={12}>
                <CommonButton
                  variant="contained"
                  fullWidth
                  type="submit"
                  id="sign-in-button"
                  disabled={loading}
                >
                  Next
                </CommonButton>
              </Grid>
            </Grid>
          </form>
        )}

        {page1 === 2 && (
          <form onSubmit={handleSubmit1(onSubmit1)}>
            <Grid container spacing={2} sx={styles.formContainer1}>
              <Grid item xs={12}>
                <Typography variant="body1" sx={styles.mobile}>
                  We have sent you an SMS on <b>{getValues("phone")}</b>
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Input
                  label="Otp"
                  fullWidth
                  type="number"
                  {...register1("otp")}
                  helperText={"otp" in errors1 && errors1?.otp?.message}
                  error={
                    "otp" in errors1 && errors1?.otp?.message ? true : false
                  }
                />
              </Grid>
              <Grid item xs={6}>
                <CommonButton
                  variant="contained"
                  fullWidth
                  onClick={() => setPage1(1)}
                  id="sign-in-button"
                  disabled={loading}
                >
                  Prev
                </CommonButton>
              </Grid>
              <Grid item xs={6}>
                <CommonButton
                  variant="contained"
                  fullWidth
                  type="submit"
                  id="sign-in-button"
                  disabled={loading}
                >
                  Next
                </CommonButton>
              </Grid>
            </Grid>
          </form>
        )}

        <FeedBack
          severity={severity}
          open={openFeedBack}
          handleClose={handleClose}
          message={message}
        />

        {page1 === 1 && (
          <Typography align={"right"} sx={styles.link}>
            <Link href={"/owner/signup"} style={{ textDecoration: "none" }}>
              {`Don't have an Account? Signup`}
            </Link>
          </Typography>
        )}
      </Container>
    </Box>
  );
};

export default OwnerSignIn;
