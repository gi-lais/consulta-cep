"use client";

import { TextField } from "@mui/material";

interface InputProps {
  label: string;
  value: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  placeholder?: string;
}

export const Input = ({
  label,
  value,
  onChange,
  onBlur,
  disabled = false,
  error,
  helperText,
  placeholder,
}: InputProps) => (
  <TextField
    label={label}
    value={value}
    onChange={onChange}
    onBlur={onBlur}
    fullWidth
    margin="normal"
    disabled={disabled}
    error={error}
    helperText={error ? helperText : ""}
    placeholder={placeholder}
  />
);
