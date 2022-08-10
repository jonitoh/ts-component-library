import React from "react";
import "./button.css";
import "./button.module.css";
import "./button.scss";
import "./button.module.scss";

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
