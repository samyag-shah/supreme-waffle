import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import { Grid, Card, Container, Typography, Box } from "@mui/material";
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
import { Spin } from "antd";
import Cookies from "js-cookie";

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
    setValue,
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

  const router = useRouter();

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
    setValue1("otp", "");

    //check if owner is already registered or not
    try {
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

      if (!response.isRegistered) {
        //owner is not registered
        setSeverity("warning");
        setMessage("This number is not registered");
        setOpenFeedBack(true);
      } else {
        //owner is registered
        // let captcha1;
        // if (captcha) {
        //   captcha1 = captcha;
        // } else {
        //   captcha1 = captchaVerifier();
        // }
        // const confirmationResult = await signInWithPhone(
        //   "+91" + data.phone,
        //   captcha1
        // );
        // setPromise(confirmationResult);
        // setCaptcha(captcha1);
        setPage1(2);
      }
      setLoading(false);
    } catch (err) {
      console.log({ err });
      setLoading(false);
      setSeverity("error");
      setMessage("Something Went Wrong, Please try again");
      setOpenFeedBack(true);
    }
  };

  useEffect(() => {
    if (page1 === 1) {
      setValue("phone", "");
    }
  }, [page1]);

  const onSubmit1 = async (data: FormData1) => {
    //console.log({ data });
    const phone = getValues("phone");

    const handlSignin = async () => {
      const response = await fetch("/api/owner/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone }),
      });
      const result = await response.json();
      if (result.status === 200) {
        return { token: result.token, ...result.owner };
      }
    };

    try {
      setLoading(true);
      //await promise?.confirm(data.otp);
      const result = await handlSignin();
      const currentUser = {
        userType: "owner",
        name: result.ownerName,
        phone: result.ownerPhone,
        id: result.id,
      };
      Cookies.set("currentUser", JSON.stringify(currentUser), { expires: 1 });
      Cookies.set("token", result.token);
      setLoading(false);
      router.push("/owner");
    } catch (err) {
      console.error({ err });
      setLoading(false);
      setSeverity("error");
      setMessage("Incorrect Code Please try again");
      setOpenFeedBack(true);
    }
  };

  return (
    <Box sx={styles.containerWrapper}>
      <div id="sign-in-button"></div>
      <Container maxWidth={"xs"} disableGutters>
        <Card sx={{ padding: "1rem" }}>
          {page1 === 1 && (
            <Grid item xs={12}>
              <Typography
                sx={{ mb: 2, ml: 2, borderBottom: "1px solid #ccc" }}
                variant="h5"
                //sx={styles.header}
              >
                Owner signin
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
                    //type="number"
                    type="tel"
                    {...register("phone")}
                    helperText={"phone" in errors && errors?.phone?.message}
                    error={
                      "phone" in errors && errors?.phone?.message ? true : false
                    }
                  />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography sx={{ p: 0 }} variant="body2">
                    No Account?
                    <Link
                      href={"/owner/signup"}
                      style={{ marginLeft: ".2rem", textDecoration: "none" }}
                    >
                      {`Create one!`}
                    </Link>
                  </Typography>
                  <CommonButton
                    variant="outlined"
                    sx={{ px: 5 }}
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? <Spin /> : "Next"}
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
                    type="tel"
                    {...register1("otp")}
                    helperText={"otp" in errors1 && errors1?.otp?.message}
                    error={
                      "otp" in errors1 && errors1?.otp?.message ? true : false
                    }
                  />
                </Grid>

                <Grid
                  item
                  xs={12}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Typography
                    //align="right"
                    sx={{
                      //textDecoration: "underline",
                      color: "blue",
                      cursor: "pointer",
                    }}
                    variant="body2"
                    onClick={() => setPage1(1)}
                  >
                    Use different number
                  </Typography>

                  <CommonButton
                    //fullWidth
                    variant="outlined"
                    type="submit"
                    sx={{ px: 5 }}
                    id="sign-in-button"
                    disabled={loading}
                  >
                    {loading ? <Spin /> : "Signin"}
                  </CommonButton>
                </Grid>
              </Grid>
            </form>
          )}
        </Card>
      </Container>
      <FeedBack
        severity={severity}
        open={openFeedBack}
        handleClose={handleClose}
        message={message}
      />
    </Box>
  );
};

export default OwnerSignIn;
