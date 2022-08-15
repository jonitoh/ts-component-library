export type SettingsKey = "size" | "lighting" | "name";
export const allSettingsKeys: SettingsKey[] = ["size", "lighting", "name"];
export const configRootName = "theme.config.";
export type ThemeData = object;
export const configName = "--theme-configuration";
export type ThemeObject = {
  name: string | "--theme-configuration";
  data: ThemeData;
};

/* eslint-disable import/prefer-default-export *
export interface ITheme {
  '--color-primary': string;
  '--color-primary-light': string;
  '--color-primary-dark': string;
  '--color-primary-on': string;
  '--color-secondary': string;
  '--color-secondary-light': string;
  '--color-secondary-dark': string;
  '--color-secondary-on': string;
  '--color-info': string;
  '--color-info-light': string;
  '--color-info-dark': string;
  '--color-info-on': string;
  '--color-success': string;
  '--color-success-light': string;
  '--color-success-dark': string;
  '--color-success-on': string;
  '--color-warning': string;
  '--color-warning-light': string;
  '--color-warning-dark': string;
  '--color-warning-on': string;
  '--color-error': string;
  '--color-error-light': string;
  '--color-error-dark': string;
  '--color-error-on': string;
  '--color-gray-1': string;
  '--color-gray-2': string;
  '--color-gray-3': string;
  '--color-gray-4': string;
  '--color-gray-5': string;
  '--color-gray-6': string;
  '--color-gray-7': string;
  '--font-family-primary': string;
  '--font-family-secondary': string;
  '--transition-hover': string;
  '--transition-toggle': string;
  '--control-border-radius': string;
  '--control-height': string;
  '--control-bg-color': string;
  '--control-shadow': string;
}
*/
