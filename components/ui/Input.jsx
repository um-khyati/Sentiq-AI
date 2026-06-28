"use client";

import { forwardRef, useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

/**
 * @typedef {Object} InputProps
 * @property {string} [label] - Floating label rendered above the field.
 * @property {string} [id] - Element id; auto-generated if omitted (kept in sync with `label`'s htmlFor).
 * @property {"text"|"email"|"password"|"number"|"search"|"tel"|"url"} [type="text"] - Input type.
 * @property {string} [placeholder] - Placeholder text.
 * @property {string} [error] - Error message; when present the field is styled as invalid.
 * @property {string} [helperText] - Helper text shown below the field when there is no error.
 * @property {React.ComponentType} [icon] - Optional lucide-react icon rendered on the left.
 * @property {boolean} [disabled=false] - Disables the field.
 * @property {string} [className] - Extra classes merged onto the wrapper.
 */

/**
 * Input — shared text field used across forms (login, signup, AI feature screen, etc).
 *
 * Forwards its ref to the underlying <input> so it can be used with
 * uncontrolled forms or libraries like react-hook-form.
 *
 * @param {InputProps} props
 */
const Input = forwardRef(function Input(
  {
    label,
    id,
    type = "text",
    placeholder,
    error,
    helperText,
    icon: Icon,
    disabled = false,
    className = "",
    ...props
  },
  ref
) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const isPassword = type === "password";
  const [showPassword, setShowPassword] = useState(false);
  const resolvedType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1 block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          {label}
        </label>
      )}

      <div className="relative">
        {Icon && (
          <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        )}

        <input
          ref={ref}
          id={inputId}
          type={resolvedType}
          placeholder={placeholder}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          className={`w-full rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 outline-none transition-colors focus:ring-2 disabled:cursor-not-allowed disabled:bg-slate-50 dark:bg-slate-900 dark:text-white dark:disabled:bg-slate-900/40 ${
            Icon ? "pl-10" : ""
          } ${isPassword ? "pr-10" : ""} ${
            error
              ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100 dark:border-rose-500/70 dark:focus:ring-rose-500/20"
              : "border-slate-200 focus:border-primary-500 focus:ring-primary-100 dark:border-slate-700 dark:focus:ring-primary-500/20"
          }`}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            tabIndex={-1}
            aria-label={showPassword ? "Hide password" : "Show password"}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>

      {error ? (
        <p id={`${inputId}-error`} className="mt-1.5 text-xs font-medium text-rose-500">
          {error}
        </p>
      ) : helperText ? (
        <p id={`${inputId}-helper`} className="mt-1.5 text-xs text-slate-500 dark:text-slate-400">
          {helperText}
        </p>
      ) : null}
    </div>
  );
});

export default Input;
