import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

function createId(prefix: string = "", method: "default" | "uuid" = "default") {
  let randomString = "random-string";
  switch (method) {
    case "default":
      randomString = `${Math.floor(Math.random() * 10000)}`;
      break;

    case "uuid":
      randomString = `${uuidv4()}`;
      break;

    default:
      break;
  }
  return `${prefix}${randomString}`;
}

function _createId(prefix: string = "") {
  return `${prefix}${uuidv4()}`;
}

export default function useId(
  prefix: string = "",
  method: "default" | "uuid" = "default"
): string {
  // Initialize the state
  const [newId] = useState(() => createId(prefix, method));
  return newId;
}
