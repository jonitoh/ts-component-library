import path from "path";
import fs, { Dirent } from "fs";
import { configName, configRootName } from "./type-and-constant";
import type { ThemeData, ThemeObject } from "./type-and-constant";

const extension: string = ".json";

function extractThemeAsThemeObject(
  dirent: Dirent,
  folderPath: string
): ThemeObject | undefined {
  const filename = dirent.name;
  const isConfigFile = filename.startsWith(configRootName);

  if (dirent.isDirectory() || !filename.endsWith(extension) || !isConfigFile) {
    return undefined;
  }

  const name = filename.slice(0, -extension.length);
  // eslint-disable-next-line import/no-dynamic-require
  // eslint-disable-next-line global-require
  const data = require(`${folderPath}/${filename}`) as ThemeData;

  return {
    name: isConfigFile ? configName : name,
    data,
  };
}

async function generateConsolidatedJsonTheme(
  themeFolderPath: string,
  output: string = "../styles/themes/config/themes.json"
): Promise<void> {
  const directory = await fs.promises.readdir(themeFolderPath, {
    withFileTypes: true,
  });

  const rawThemeObjects = await Promise.all(
    directory.map((dirent) =>
      extractThemeAsThemeObject(dirent, themeFolderPath)
    )
  );

  const themeObjects = rawThemeObjects.filter((obj) => !!obj) as ThemeObject[];

  if (themeObjects.length < 2) {
    throw new Error(
      "The directory should have at least two files: the default.json and a theme."
    );
  }

  const defaultObject = themeObjects.find((obj) => obj.name == configName);
  if (!defaultObject) {
    throw new Error("No default theme available");
  }

  // create our blunded theme for our style.
  const blendedData = {
    default: (
      defaultObject.data as {
        name: string;
      }
    ).name,
    themes: (
      themeObjects.filter((obj) => obj.name !== configName) as ThemeObject[]
    )
      .map((th) => ({ [th.name]: th.data }))
      .reduce(
        (previousValue, currentValue) => ({
          ...previousValue,
          ...currentValue,
        }),
        {}
      ),
  };

  // dump it as the output
  await fs.promises.writeFile(output, JSON.stringify(blendedData), "utf8");
}

export default function importThemeSystem() {}
