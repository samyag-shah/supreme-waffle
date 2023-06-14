import { useState } from "react";

import { Box, Container, Card } from "@mui/material";
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
          width: "100%",
          minWidth: "100%",
          display: "flex",
          alignItems: "center",
          backgroundColor: "rgb(249, 250, 251)",
        }}
      >
        <Container maxWidth={"sm"} disableGutters>
          <Card
            sx={{ minWidth: "350px", overflowX: "auto", padding: "1rem 2rem" }}
          >
            <Box sx={{ my: "2rem" }}>
              <Stepper activeStep={step} alternativeLabel>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>

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
          </Card>
        </Container>
      </Box>
    </>
  );
};

export default Signup;
