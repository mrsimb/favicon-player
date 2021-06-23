import { spawn } from "child_process";
import { user32 } from "./user32";
import { stringify } from "querystring";

// These are taken from Windows 10 chrome
// Might differ on other platforms
const dimensions = {
  paddingTop: 18,
  paddingLeft: 9,
  paddingRight: 259,
  iconWidth: 16,
  iconHeight: 16,
  tabWidth: 32,
};

export type CreateWindowOptions = {
  y: number;
  w: number;
  h: number;
  fps: number;
  spd: number;
  loop: boolean;
  port: number;
  dbg: boolean;
  chromePath: string;
};

export function moveWindow(y: number, w: number) {
  const windowX = 0;
  const windowY = y * (dimensions.iconHeight + dimensions.paddingTop);
  const windowWidth =
    dimensions.paddingLeft + w * dimensions.tabWidth + dimensions.paddingRight;
  const windowHeight = 120;

  // Microsoft Windows specific implementation
  const name = `${y}:${w - 1} - Google Chrome`;
  const hwnd = user32.FindWindowA(null, name);
  user32.ShowWindow(hwnd, 1); // make sure it's not maximized
  user32.MoveWindow(hwnd, windowX, windowY, windowWidth, windowHeight, true);
}

export function createWindow(opts: CreateWindowOptions) {
  // List of chrome cli flags
  // https://peter.sh/experiments/chromium-command-line-switches/

  const query = stringify({
    x: 0,
    y: opts.y,
    w: opts.w,
    h: opts.h,
    fps: opts.fps,
    spd: opts.spd,
    loop: +opts.loop,
    port: opts.port,
    dbg: +opts.dbg,
  });

  const args = [
    `http://localhost:${opts.port}/?${query}`,
    "--new-window",
    "--user-data-dir=favicon-player-DHX3zY2", // use clean user profile
    "--new-window",
    "--disable-popup-blocking",
    "--disable-background-timer-throttling",
    "--disable-backgrounding-occluded-windows",
    "--disable-renderer-backgrounding",
    "--disk-cache-size=0", // prevent trashing user's memory
  ];

  return spawn(opts.chromePath, args);
}
