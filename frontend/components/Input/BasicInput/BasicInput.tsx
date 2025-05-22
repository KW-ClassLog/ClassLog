"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./BasicInput.module.scss";
import { Eye, EyeOff } from "lucide-react";
import flatpickr from "flatpickr";
import type { Instance } from "flatpickr/dist/types/instance";
import "flatpickr/dist/flatpickr.css";
import { Korean } from "flatpickr/dist/l10n/ko.js";

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
  readOnly = false,
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
  const isTime = type === "time";
  const inputType = isPassword && showPassword ? "text" : type;
  const inputRef = useRef<HTMLInputElement>(null);
  const flatpickrRef = useRef<Instance | null>(null);

  useEffect(() => {
    if (isTime && inputRef.current && !flatpickrRef.current) {
      flatpickrRef.current = flatpickr(inputRef.current, {
        enableTime: true,
        noCalendar: true,
        dateFormat: "H:i",
        locale: Korean,
        defaultHour: 0,
        defaultMinute: 0,
        onChange: (selectedDates, dateStr) => {
          const event = {
            target: { value: dateStr, name: name },
          } as React.ChangeEvent<HTMLInputElement>;
          onChange(event);
        },
        onClose: (selectedDates, dateStr) => {
          if (onBlur) {
            const event = {
              target: { value: dateStr, name: name },
            } as React.FocusEvent<HTMLInputElement>;
            onBlur(event);
          }
        },
        onOpen: () => {
          if (onFocus) {
            const event = {
              target: { value: value, name: name },
            } as React.FocusEvent<HTMLInputElement>;
            onFocus(event);
          }
        },
      });

      if (placeholder) {
        inputRef.current.setAttribute("placeholder", placeholder);
      }
    }

    return () => {
      if (flatpickrRef.current) {
        flatpickrRef.current.destroy();
        flatpickrRef.current = null;
      }
    };
  }, [isTime, value, onChange, onBlur, onFocus, name, placeholder]);

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
          ref={inputRef}
          className={styles.input}
          type={isTime ? "text" : inputType}
          value={value}
          onChange={!isTime ? onChange : undefined}
          placeholder={!isTime ? placeholder : undefined}
          disabled={disabled}
          readOnly={isTime ? true : readOnly}
          required={required}
          onBlur={!isTime ? onBlur : undefined}
          onFocus={!isTime ? onFocus : undefined}
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
