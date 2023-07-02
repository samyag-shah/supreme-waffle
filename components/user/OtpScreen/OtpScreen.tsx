import React, { Dispatch, useEffect, SetStateAction } from "react";
import { useRouter } from "next/router";

import { Grid, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import Input from "../../common/Input/Input";
import CommonButton from "../../common/Button/CommonButton";

import { ConfirmationResult, RecaptchaVerifier } from "firebase/auth";
import FeedBack from "../../common/Feedback/FeedBack";

import Timer from "./timer";
import { signInWithPhone } from "../../../config/firebase/firebase";
import { signupType } from "@/pages/user/signup";
import { styles } from "../../styles/userSingupStyles";
import { Spin } from "antd";
import Cookies from "js-cookie";

const schema = yup
  .object({
    otp: yup
      .string()
      .required("Please Enter valid 6 digit code sent to your phone")
      .matches(/^[0-9]+$/, "Must be only digits")
      .min(6, "Must be exactly 6 digits")
      .max(6, "Must be exactly 6 digits"),
  })
  .required();

type FormData = yup.InferType<typeof schema>;

interface props {
  promise: ConfirmationResult | undefined;
  signupState: signupType;
  setPage: Dispatch<SetStateAction<number>>;
  pageType: string;
  setPromise: Dispatch<SetStateAction<ConfirmationResult | undefined>>;
  captcha: RecaptchaVerifier | undefined;
  loginType: string;
}

const OtpScreen = ({
  setPromise,
  pageType,
  promise,
  setPage,
  signupState,
  captcha,
  loginType,
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

  const [t1, setT1] = React.useState(2);
  const router = useRouter();

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenFeedBack(false);
  };

  useEffect(() => {
    setSeverity("success");
    setMessage("OTP Sent, Please Check Your Phone number");
    setOpenFeedBack(true);
  }, []);

  const registerNewUser = async () => {
    const result = await fetch("/api/user/registerNewUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: signupState.username,
        phone: signupState.phone,
        userType: "user",
      }),
    });
    const response = await result.json();
    if (response?.newUser?.id) {
      let currentUser = {
        id: response?.newUser?.id,
        username: response?.newUser?.username,
        phone: response?.newUser.phone,
        userType: "user",
      };
      Cookies.set("currentUser", JSON.stringify(currentUser), {
        expires: 7,
      });
      Cookies.set("token", response?.token, { expires: 1 });
      loginType !== "modal" ? router.push("/") : router.push("/user/booking");
    }
  };

  const signinUser = async () => {
    const result = await fetch("/api/user/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: signupState.username,
        phone: signupState.phone,
        userType: "user",
      }),
    });
    const response = await result.json();
    if (response?.user?.id) {
      let currentUser = {
        id: response?.user?.id,
        username: response?.user?.username,
        phone: response?.user.phone,
        userType: "user",
      };
      Cookies.set("currentUser", JSON.stringify(currentUser), {
        expires: 7,
      });
      Cookies.set("token", response?.token, { expires: 1 });
      loginType !== "modal" ? router.push("/") : router.push("/user/booking");
    }
  };

  const onSubmit = (data: FormData) => {
    //console.log(data);

    if (pageType === "signup") {
      registerNewUser();
    } else if (pageType === "signin") {
      signinUser();
      //router.push("/");
    }

    // setLoading(true);
    // if (promise) {
    //   promise
    //     .confirm(data.otp)
    //     .then((res) => {
    //       console.log({ pageType });
    //       if (pageType === "signup") {
    //         registerNewUser();
    //       } else if (pageType === "signin") {
    //         signinUser();
    //         //router.push("/");
    //       }
    //       setLoading(false);
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

  const handleTimer = () => {
    if (t1 > 0) {
      return `resend OTP after ${t1} seconds`;
    } else {
      return <span onClick={() => handleOtp()}>resend OTP</span>;
    }
  };

  const handleOtp = async () => {
    console.log("hi");
    // try {
    //   setLoading(true);
    //   const confirmationResult = await signInWithPhone(
    //     signupState.phone,
    //     captcha
    //   );
    //   setLoading(false);
    //   setPromise(confirmationResult);
    // } catch (err) {
    //   setLoading(false);
    //   setSeverity("error");
    //   setMessage("Something Went Wrong, Please try again");
    //   setOpenFeedBack(true);
    // }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Typography sx={{ m: "1rem 0" }}>
        We have sent an SMS to <b>{signupState.phone}</b>
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Input
            size="small"
            {...register("otp")}
            type="number"
            label="OTP"
            fullWidth
            helperText={errors?.otp?.message}
            error={errors?.otp?.message ? true : false}
          />
        </Grid>
      </Grid>

      {/* <Typography align={"right"} sx={{ mt: "1rem" }}>
        <Timer t1={t1} setT1={setT1} />
        {handleTimer()}
      </Typography> */}

      <Grid item xs={12}>
        <Typography
          sx={{
            mt: "1rem",
            mb: ".5rem",
            textDecoration: "underline",
            cursor: "pointer",
          }}
          align="right"
          onClick={() => setPage(1)}
        >
          {pageType === "signup" ? "Signup" : "Signin"} with different number
        </Typography>
      </Grid>

      <Grid item xs={12}>
        <CommonButton
          type="submit"
          sx={{ mb: "1rem" }}
          //sx={styles.nextbtn}
          variant="outlined"
          fullWidth
          disabled={loading}
          size="large"
        >
          {loading ? <Spin /> : <b>Verify</b>}
        </CommonButton>
      </Grid>

      <FeedBack
        severity={severity}
        open={openFeedBack}
        handleClose={handleClose}
        message={message}
      />
    </form>
  );
};

export default OtpScreen;
