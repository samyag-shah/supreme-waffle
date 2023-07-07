import { useState } from "react";
import { StepLabel, Step, Stepper, Box, Container, Card } from "@mui/material";

import OwnerInfo from "../../../../components/owner/ownerData/ownerInfo";
import BoxCricketInfo from "../../../../components/owner/ownerData/boxCricketInfo";
import BoxCricketSlot from "../../../../components/owner/ownerData/boxCricketSlot";

const steps = [
  "Owner Details",
  "Your Box cricket Details",
  "Box Cricket Timings",
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
            sx={{
              m: "1rem 0",
              minWidth: "350px",
              overflowX: "auto",
              padding: { xs: "1rem", sm: "1rem 2rem" },
            }}
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
              <OwnerInfo
                signupState={signupState}
                setStep={setStep}
                setSignupState={setSignupState}
              />
            )}

            {step === 1 && (
              <BoxCricketInfo
                setStep={setStep}
                signupState={signupState}
                setSignupState={setSignupState}
              />
            )}

            {step === 2 && <BoxCricketSlot signupState={signupState} />}
          </Card>
        </Container>
      </Box>
    </>
  );
};

export default Signup;
