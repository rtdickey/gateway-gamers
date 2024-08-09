//create Button component
import React from "react";
import {
  Button as BootstrapButton,
  ButtonProps as BootstrapButtonprops,
} from "react-bootstrap";

interface ButtonProps extends BootstrapButtonprops {
  children: React.ReactNode;
  onClick: () => void;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  ...props
}: ButtonProps) => {
  const { variant = "primary", size = "lg", disabled = false } = props;
  return (
    <BootstrapButton
      variant={variant}
      size={size}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </BootstrapButton>
  );
};

export default Button;
