import { Button, ButtonProps } from "@mui/material";
import { ReactNode } from "react";

interface props {
  variant?: "contained" | "outlined" | "text";
  type?: "button" | "submit";
  sx?: object;
  disabled?: boolean;
  fullWidth?: boolean;
  size?: "large" | "small" | "medium";
  onClick?: () => void;
  children?: React.ReactNode;
  id?: string;
  endIcon?: ReactNode;
  color?:
    | "inherit"
    | "primary"
    | "secondary"
    | "success"
    | "error"
    | "info"
    | "warning";
}
const CommonButton = ({
  variant,
  type,
  sx,
  disabled,
  fullWidth,
  size,
  onClick,
  children,
  color,
  id,
  endIcon,
}: props) => {
  return (
    <>
      <Button
        variant={variant}
        type={type}
        sx={sx}
        disabled={disabled}
        fullWidth={fullWidth}
        size={size}
        onClick={onClick}
        color={color}
        id={id}
        endIcon={endIcon}
      >
        {children}
      </Button>
    </>
  );
};

export default CommonButton;
