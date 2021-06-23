import { spawn } from "child_process";

export type RunFFmpegOptions = {
  videoPath: string;
  size: number;
  fps: number;
  crop?: [w: number, h: number, x: number, y: number];
  frames?: number;
  ffmpegPath: string;
};

function getCrop(w: number, h: number, x: number, y: number) {
  const out_w = `in_w/${w}`;
  const out_h = `in_h/${h}`;
  const out_x = `${out_w}*${x}`;
  const out_y = `${out_h}*${y}`;
  return [out_w, out_h, out_x, out_y].join(":");
}

function getArgs(options: RunFFmpegOptions) {
  // prettier-ignore
  const args = [
    "-nostats", // do not spam in terminal
    "-loglevel", "error",
    "-i",  options.videoPath,
    "-f", "image2pipe", // writes to stdout
    "-c", "bmp" // easiest format to work with
  ];

  let vf = `fps=${options.fps}`; // fps filter

  if (options.crop) {
    const crop = getCrop(...options.crop); // crop filter
    vf += `,crop=${crop}`;
  }

  args.push("-vf", vf);

  args.push("-s", `${options.size}x${options.size}`); // output dimensions

  if (options.frames) {
    args.push("-vframes", String(options.frames));
  }

  args.push("-"); // empty output

  return args;
}

export function runFFmpeg(opts: RunFFmpegOptions) {
  const ffmpeg = spawn(opts.ffmpegPath, getArgs(opts));

  ffmpeg.stderr.setEncoding("utf8");
  ffmpeg.stderr.on("data", console.log); // ffmpeg writes log to stderr

  return ffmpeg;
}
