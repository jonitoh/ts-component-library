/* TODO SHOULD BE A LINK */
import React from "react";
import "./apparent-button.module.scss";

export interface Props {
  label: string;
}

export default function ApparentButton({ label }: Props) {
  return <button type="button">{label}</button>;
}
