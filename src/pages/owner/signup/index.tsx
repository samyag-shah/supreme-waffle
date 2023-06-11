import { useState } from "react";

import { Box, Container } from "@mui/material";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

import SignupStep2 from "../../../../components/owner/Signup/SignupStep2";
import SignupStep3 from "../../../../components/owner/Signup/SignupStep3";
import SignupStep1 from "../../../../components/owner/Signup/SignupStep1";

const steps = [
  "Add Owner Details",
  "Add Your Box cricket Details",
  "Select Box Cricket Timings",
];

export interface SignupState {
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  otp?: string;
  boxCricketName?: string;
  boxCricketAddress?: string;
  boxCricketState?: string;
  boxCricketArea?: string;
  boxCricketCity?: string;
  boxCricketImages?: any[];
}

const Signup = () => {
  const [step, setStep] = useState(0);
  const [signupState, setSignupState] = useState<SignupState>();

  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          border: "1px solid",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Container
          maxWidth={"sm"}
          sx={{ my: 2, border: "1px solid", borderRadius: "1rem" }}
        >
          <Box sx={{ width: "100%", my: "2rem" }}>
            <Stepper activeStep={step} alternativeLabel>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>
          </Box>
          {/* <Divider /> */}

          {step === 0 && (
            <SignupStep1
              signupState={signupState}
              setStep={setStep}
              setSignupState={setSignupState}
            />
          )}

          {step === 1 && (
            <SignupStep2
              setStep={setStep}
              signupState={signupState}
              setSignupState={setSignupState}
            />
          )}

          {step === 2 && <SignupStep3 signupState={signupState} />}
        </Container>
      </Box>
    </>
  );
};

export default Signup;
