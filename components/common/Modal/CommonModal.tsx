import { Modal, Box, Typography } from "@mui/material";
import { useState } from "react";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const CommonModal = ({
  open,
  handleClose,
  content,
}: {
  open: boolean;
  handleClose: (e: object, reason: string) => void;
  content: React.ReactNode;
}) => {
  return (
    <Modal
      open={open}
      //hideBackdrop={true}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        {/* <Typography id="modal-modal-title" variant="h6" component="h2">
          Text in a modal
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
        </Typography> */}
        {content}
      </Box>
    </Modal>
  );
};

export default CommonModal;
