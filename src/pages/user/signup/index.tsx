import React, { useState } from "react";
import { useRouter } from "next/router";

import { Container, Divider, Box, Typography } from "@mui/material";
import { ConfirmationResult, RecaptchaVerifier } from "firebase/auth";
import { signInWithGmail } from "../../../../config/firebase/firebase";
import { styles } from "../../../../components/styles/userSingupStyles";
import MainSignUp from "../../../../components/user/MainSignup/MainSignUp";
import MainSignIn from "../../../../components/user/MainSignIn/MainSignIn";
import OtpScreen from "../../../../components/user/OtpScreen/OtpScreen";
import FeedBack from "../../../../components/common/Feedback/FeedBack";

export interface signupType {
  username: string | null;
  phone: string | null;
  otp: string | null;
}

export interface user1 {
  displayName?: string | null;
  email?: string | null;
}

const Signup = ({ pageType = "signup" }: { pageType: string }) => {
  const [promise, setPromise] = useState<ConfirmationResult>();
  const [captcha, setCaptcha] = useState<RecaptchaVerifier>();
  const [page, setPage] = useState(1);
  const [signupState, setSignupState] = useState<signupType>({
    username: null,
    phone: null,
    otp: null,
  });

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

  const router = useRouter();

  const registerNewUser = async (user: user1) => {
    try {
      const result = await fetch("/api/registerNewUser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          loginMethod: "Email",
          username: user?.displayName,
          email: user?.email,
        }),
      });
      const response = await result.json();
      if (response?.body?.id) {
        router.push("/");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleGoogleSignin = async () => {
    try {
      const user = await signInWithGmail();
      registerNewUser(user);
    } catch (err) {
      console.error({ err });
      setSeverity("error");
      setMessage("Something Went Wrong, Please try again");
      setOpenFeedBack(true);
    }
  };

  return (
    <Box sx={styles.containerWrapper}>
      <Container maxWidth="xs" sx={styles.container}>
        {page === 1 && (
          <>
            <Box sx={styles.textContainer}>
              <Typography sx={styles.signupText}>
                {pageType === "signin" ? "Sign in" : "Sign up"} to continue for
                Booking
              </Typography>

              <Typography onClick={handleGoogleSignin} sx={styles.googleText}>
                Continue with Google
              </Typography>
            </Box>

            <Divider sx={styles.divider}>or</Divider>
          </>
        )}

        {page === 1 && pageType === "signup" && (
          <MainSignUp
            page={page}
            setPage={setPage}
            signupState={signupState}
            setSignupState={setSignupState}
            setPromise={setPromise}
            pageType={pageType}
            setCaptcha={setCaptcha}
          />
        )}

        {page === 1 && pageType === "signin" && (
          <MainSignIn
            page={page}
            setPage={setPage}
            signupState={signupState}
            setSignupState={setSignupState}
            setPromise={setPromise}
            pageType={pageType}
            setCaptcha={setCaptcha}
          />
        )}
        {page === 2 && (
          <OtpScreen
            signupState={signupState}
            promise={promise}
            setPage={setPage}
            pageType={pageType}
            setPromise={setPromise}
            captcha={captcha}
          />
        )}
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

export default Signup;
