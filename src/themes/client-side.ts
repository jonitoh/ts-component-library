import type { SettingsKey } from "./type-and-constant";
import { allSettingsKeys } from "./type-and-constant";

function styleBodyElement() {
  console.info("let's style the body element.");
  let className: string | undefined;
  if (process.env.THEME_BODY_IMAGE && process.env.THEME_BODY_IMAGE === "true") {
    className = "with-image";
  }

  if (
    process.env.THEME_BODY_GRADIENT &&
    process.env.THEME_BODY_GRADIENT === "true"
  ) {
    className = "with-gradient";
  }

  if (process.env.THEME_BODY_COLOR && process.env.THEME_BODY_COLOR === "true") {
    className = "with-color";
  }

  if (className) {
    document.body.className = className;
    return;
  }
  throw new Error("An option to style the body is necessary.");
}

function getPropertyName(key: SettingsKey) {
  return `data-theme-${key}`;
}

export function setPropertyToBody(key: SettingsKey, value: string) {
  document.body.setAttribute(getPropertyName(key), value);
}

export function setPropertyToLocaleStorage(key: SettingsKey, value: string) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(getPropertyName(key), JSON.stringify(value));
  }
}

export function initiatePropertyFromLocaleStorage(
  key: SettingsKey,
  initialValue: string
): () => string {
  return function initiateProperty() {
    if (typeof window !== "undefined") {
      const unparsedValue: string | null = window.localStorage.getItem(
        getPropertyName(key)
      );
      if (unparsedValue === null) {
        return initialValue;
      }
      return (JSON.parse(unparsedValue) as string) || initialValue;
    }
    return initialValue;
  };
}

/* We can't access process.env values using dynamic keys in client-side
export function getPropertyEnv(key: SettingsKey) {
  // eslint-disable-next-line dot-notation
  return process.env[`THEME_${key.toUpperCase()}`];
}
*/

export function getPropertyEnv(key: SettingsKey) {
  if (key === "lighting") {
    return process.env.THEME_LIGHTING;
  }
  if (key === "size") {
    return process.env.THEME_SIZE;
  }
  if (key === "name") {
    return process.env.THEME_NAME;
  }
  throw new Error(
    `key can only be ${allSettingsKeys.join(" , ")}. Instead it's ${key}`
  );
}

function initiatePropertyToBody(key: SettingsKey) {
  // get the initial value
  const envValue = getPropertyEnv(key) || "";
  const value = initiatePropertyFromLocaleStorage(key, envValue)();

  // set value to body
  if (value && value !== "") {
    setPropertyToBody(key, value);
    setPropertyToLocaleStorage(key, value);
  }
}

function initiateSettings() {
  console.info("let's initiate our settings in the body element.");
  const settings: SettingsKey[] = allSettingsKeys;
  settings.map((key: SettingsKey) => initiatePropertyToBody(key));
}

export function initiate() {
  console.log("initiate theme");
  styleBodyElement();
  initiateSettings();
}

export function clear() {
  console.log("clear theme");
}

export default {
  initiate,
  clear,
};
