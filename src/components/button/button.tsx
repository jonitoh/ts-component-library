import React from "react";
import "./button.css";

export interface Props {
  label: string;
}

export default function Button({ label }: Props) {
  return (
    <button type="button" className="button">
      {label}
    </button>
  );
}
