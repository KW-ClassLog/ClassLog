"use client";

import React, { useState } from "react";
import styles from "./BasicInput.module.scss";
import { Eye, EyeOff } from "lucide-react";

interface BasicInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label?: string;
  type?: string;
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;
  error?: boolean;
  errorMessage?: string;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  name?: string;
  maxLength?: number;
  autoFocus?: boolean;
}

const BasicInput: React.FC<BasicInputProps> = ({
  value,
  onChange,
  placeholder,
  label,
  type = "text",
  disabled,
  required,
  readOnly,
  error,
  errorMessage,
  iconLeft,
  iconRight,
  onBlur,
  onFocus,
  name,
  maxLength,
  autoFocus,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div className={styles.wrapper}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && "*"}
        </label>
      )}
      <div
        className={`${styles.inputBox} ${error ? styles.error : ""} ${
          disabled ? styles.disabled : ""
        }`}
      >
        {iconLeft && <span className={styles.iconLeft}>{iconLeft}</span>}
        <input
          className={styles.input}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          readOnly={readOnly}
          required={required}
          onBlur={onBlur}
          onFocus={onFocus}
          name={name}
          maxLength={maxLength}
          autoFocus={autoFocus}
        />
        {isPassword && (
          <button
            type="button"
            className={styles.iconRight}
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
        {!isPassword && iconRight && (
          <span className={styles.iconRight}>{iconRight}</span>
        )}
      </div>
      {error && errorMessage && (
        <p className={styles.errorMessage}>{errorMessage}</p>
      )}
    </div>
  );
};

export default BasicInput;
