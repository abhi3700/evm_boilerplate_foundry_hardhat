import * as fs from "fs";

export function getRemappings() {
  return fs
    .readFileSync("remappings.txt", "utf8")
    .split("\n")
    .filter(Boolean) // remove empty lines
    .map((line) => line.trim().split("="));
}

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
