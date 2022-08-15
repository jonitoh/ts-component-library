import React, {
  ButtonHTMLAttributes,
  MouseEventHandler,
  ReactNode,
} from "react";
import classNames from "classnames";
import styles from "./generic-button.module.scss";

export interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  type: "submit" | "reset" | "button";
  icon?: ReactNode;
  iconPosition?: "right" | "left" | "top" | "bottom";
  hasOnlyIcon?: boolean;
  variant?:
    | "primary"
    | "secondary"
    | "apparent"
    | "outline-based"
    | "outline-on-hover";
  size?: "small" | "default" | "medium" | "large";
  border?: "square" | "round" | "pill" | "circle";
  animation?: "none" | "ripple" | "drop";
  onClick?: MouseEventHandler<HTMLButtonElement> | (() => void);
}

export default function Button({
  type,
  icon,
  iconPosition,
  hasOnlyIcon,
  variant,
  size,
  border,
  animation,
  onClick,
  children,
  ...rest
}: Props) {
  const { className, ...props } = rest;

  if (!icon && !children) {
    return null;
  }

  return (
    <button
      className={classNames([
        styles.button,
        iconPosition && styles[`button__main-item-position--${iconPosition}`],
        hasOnlyIcon && styles["button--only-icon"],
        variant && styles[`button__variant--${variant}`],
        size && styles[`button__size--${size}`],
        border && styles[`button__border--${border}`],
        animation && styles[`button__animation--${animation}`],
        className,
      ])}
      onClick={onClick}
      type={type}
      {...props}
    >
      {!!icon && (
        <svg aria-hidden="true" focusable="false" className={styles.icon}>
          {icon}
        </svg>
      )}
      <span className={styles.label}>{children}</span>
    </button>
  );
}

Button.defaultProps = {
  icon: null,
  iconPosition: "left",
  hasOnlyIcon: false,
  variant: "primary",
  size: "default",
  border: "round",
  animation: "none",
  onClick: undefined,
};
