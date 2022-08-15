export type SettingsKey = "size" | "lighting" | "name";
export const allSettingsKeys: SettingsKey[] = ["size", "lighting", "name"];
export const configRootName = "theme.config.";
export type ThemeData = object;
export const configName = "--theme-configuration";
export type ThemeObject = {
  name: string | "--theme-configuration";
  data: ThemeData;
};
