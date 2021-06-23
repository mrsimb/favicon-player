import polka from "polka";
import serveHandler from "serve-handler";
import path from "path";
import { runFFmpeg } from "./video";
import { createWindow, moveWindow } from "./windows";

export type CreateServerOptions = {
  port: number;
  w: number;
  h: number;
  size: number;
  fps: number;
  spd: number;
  loop: boolean;
  dbg: boolean;
  videoPath: string;
  chromePath: string;
  ffmpegPath: string;
};

export function createServer(opts: CreateServerOptions) {
  console.log("Running with options:", opts);

  const server = polka();

  let totalTabsLoaded = 0;
  let windowsOpened = 0;
  let frameSize = 2;

  function openWindowIfNeeded() {
    if (totalTabsLoaded % opts.w === 0 && windowsOpened < opts.h) {
      console.log("Opening window #" + windowsOpened);
      createWindow({
        y: windowsOpened,
        w: opts.w,
        h: opts.h,
        fps: opts.fps,
        spd: opts.spd,
        loop: opts.loop,
        dbg: opts.dbg,
        port: opts.port,
        chromePath: opts.chromePath,
      });
      windowsOpened++;
    }
  }

  // disable caching
  server.use((req, res, next) => {
    res.setHeader("Cache-Control", "no-store, no-cache");
    res.setHeader("Expires", "0");
    next();
  });

  // tab loaded, check if should open another window
  server.get("/loaded", (req, res) => {
    totalTabsLoaded++;
    console.log("Loaded:", totalTabsLoaded, "/", opts.w * opts.h);
    openWindowIfNeeded();
    res.end();
  });

  // send frames stream
  server.get("/frames", async (req, res) => {
    const x = +(req.query.x ?? 0);
    const y = +(req.query.y ?? 0);

    if (x === opts.w - 1) {
      moveWindow(y, opts.w);
    }

    res.setHeader("frame-size", frameSize);

    const ffmpeg = runFFmpeg({
      size: opts.size,
      fps: opts.fps,
      crop: [opts.w, opts.h, x, y],
      videoPath: opts.videoPath,
      ffmpegPath: opts.ffmpegPath,
    });

    ffmpeg.stdout.pipe(res);
  });

  // serve static files
  const publicPath = path.join(__dirname, "../public");
  server.get("*", (req, res) => {
    return serveHandler(req, res, { public: publicPath });
  });

  // determine frame buffer size then run server
  runFFmpeg({
    size: opts.size,
    fps: opts.fps,
    crop: [opts.w, opts.h, 0, 0],
    videoPath: opts.videoPath,
    ffmpegPath: opts.ffmpegPath,
    frames: 1,
  }).stdout.on("data", (buffer) => {
    frameSize = buffer.length;
    console.log("Frame size:", buffer.length);

    server.listen(opts.port, () => {
      console.log("App listening on", `http://localhost:${opts.port}`);
      openWindowIfNeeded();
    });
  });
}
