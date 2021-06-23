#!/usr/bin/env node

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import path from "path";
import { createServer } from "./server";

const argv = yargs(hideBin(process.argv))
  .usage("Usage: npx favicon-player <path> [options]")
  .check((argv) => {
    if (argv._.length === 0) {
      throw new Error("Input <path> required");
    } else if (argv._.length > 1) {
      throw new Error("Only 1 input <path> allowed");
    } else {
      return true;
    }
  })
  // .demandCommand(1)
  .option("_", {
    type: "string",
    description: "Input video path",
    demandOption: true,
  })
  .option("width", {
    alias: "w",
    type: "number",
    default: 4,
    description: "Grid width (number of tabs)",
  })
  .option("height", {
    alias: "h",
    type: "number",
    default: 3,
    description: "Grid height (number of windows)",
  })
  .option("fps", {
    alias: "f",
    type: "number",
    default: 4,
    description: `Output frames per second
    Chrome can only display 4 favicons per second`,
  })
  .option("spd", {
    alias: "s",
    type: "number",
    default: 1,
    description: "Playback speed multiplier",
  })
  .option("loop", {
    alias: "l",
    type: "boolean",
    default: true,
    description: "Loop video",
  })
  .option("size", {
    type: "number",
    default: 16,
    description: "Output icon size",
  })
  .option("port", {
    alias: "p",
    type: "number",
    default: 3100,
    description: "Application port",
  })
  .option("chrome", {
    type: "string",
    default: "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    description: "Path to chrome executable",
  })
  .option("ffmpeg", {
    type: "string",
    default: "ffmpeg",
    description: "Path to ffmpeg executable",
  })
  .option("dbg", {
    alias: "d",
    type: "boolean",
    default: false,
    description: "Do not load frames immediately",
  }).argv;

const cwd = process.cwd();

createServer({
  port: argv.port,
  w: argv.width,
  h: argv.height,
  fps: argv.fps,
  size: argv.size,
  spd: argv.spd,
  loop: argv.loop,
  dbg: argv.dbg,
  videoPath: path.relative(cwd, argv._[0]),
  chromePath: argv.chrome,
  ffmpegPath: argv["ffmpeg"],
});
