import React from "react";

import { TextField } from "@mui/material";
import { ChangeHandler, RefCallBack } from "react-hook-form";

interface props {
  variant?: "filled" | "outlined" | "standard";
  type?: "text" | "number" | "email" | "tel";
  sx?: object;
  disabled?: boolean;
  fullWidth?: boolean;
  helperText?: React.ReactNode;
  label?: React.ReactNode;
  onChange?: ChangeHandler;
  required?: boolean;
  size?: "medium" | "small";
  value?: any;
  multiline?: boolean;
  select?: boolean;
  name?: string;
  onBlur?: ChangeHandler;
  error?: boolean;
  defaultValue?: string;
  InputProps?: object;
  placeholder?: string;
}
interface RefType {
  ref?: RefCallBack;
}

const Input = React.forwardRef<RefType, props>(
  (
    {
      variant,
      type,
      sx,
      disabled,
      fullWidth,
      size = "small",
      onChange,
      label,
      required,
      value,
      helperText,
      multiline,
      select,
      name,
      onBlur,
      error,
      InputProps,
      defaultValue = "",
      placeholder,
    },
    ref
  ) =>
    // const Input = ({
    //   variant,
    //   type,
    //   sx,
    //   disabled,
    //   fullWidth,
    //   size,
    //   onChange,
    //   label,
    //   required,
    //   value,
    //   helperText,
    //   multiline,
    //   select,
    //   name,
    //   onBlur,
    //   refs,
    // }: props) =>

    {
      return (
        <>
          <TextField
            variant={variant}
            label={label}
            sx={sx}
            size={size}
            multiline={multiline}
            select={select}
            fullWidth={fullWidth}
            disabled={disabled}
            required={required}
            // type={type}
            // name={name}
            // onChange={onChange}
            // onBlur={onBlur}
            inputRef={ref}
            placeholder={placeholder}
            defaultValue={defaultValue}
            inputProps={{
              name,
              value,
              onChange,
              onBlur,
              type,
            }}
            InputProps={InputProps}
            helperText={helperText}
            error={error}
          />
        </>
      );
    }
);

Input.displayName = "Input";

export default Input;
