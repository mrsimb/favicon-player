const { searchParams } = new URL(location.href);
const y = +searchParams.get("y");
const x = +searchParams.get("x");
const w = +searchParams.get("w");
const h = +searchParams.get("h");
const fps = +searchParams.get("fps");
const spd = +searchParams.get("spd");
const loop = +searchParams.get("loop");
const dbg = +searchParams.get("dbg");

const icon = document.querySelector("link[rel=icon]");
document.title = y + ":" + x;

// Waits until all tabs loaded then sends "play" signal
const isLoader = y === 0 && x === 0;
// Opens other tabs in window
const isFirstTab = x === 0;
// Sends frame number to other tabs
const isAnimator = y === h - 1 && x === w - 1;

console.log({ isLoader, isFirstTab, isAnimator });

let lastIndex;
let frames = [];
let totalTabsLoaded = 0;
let startTime;

const bc = new BroadcastChannel("favicon-player");
bc.onmessage = (e) => {
  console.log("broadcast channel msg:", e.data);

  if (e.data === "loaded" && isLoader) {
    onLoaded();
  }
  if (e.data === "play" && isAnimator) {
    onPlay();
  }
  if (Number.isFinite(e.data) && !isAnimator) {
    onFrameUpdate(e.data);
  }
};

function onLoaded() {
  if (isLoader) {
    totalTabsLoaded++;

    if (totalTabsLoaded >= w * h) {
      if (isAnimator) {
        onPlay();
      } else {
        bc.postMessage("play");
      }
    }
  } else {
    bc.postMessage("loaded");
  }
}

function onPlay() {
  requestAnimationFrame(animate);
}

function onFrameUpdate(index) {
  icon.href = frames[index];
}

if (isFirstTab) {
  for (let i = 1; i < w; i++) {
    window.open(location.href.replace(/x=\d+/, "x=" + i));
  }
}

function animate(timeStamp) {
  if (lastIndex >= frames.length) {
    startTime = timeStamp;
  }

  startTime = startTime || timeStamp;
  const delta = timeStamp - startTime;
  const newIndex = Math.min(
    Math.ceil((delta / 1000) * fps * spd),
    frames.length
  );

  if (newIndex !== lastIndex) {
    bc.postMessage(newIndex); // update for others
    onFrameUpdate(newIndex); // and for self
    lastIndex = newIndex;
    document.body.innerText = `${newIndex} / ${frames.length}`;
  }

  requestAnimationFrame(animate);
}

async function load() {
  const res = await fetch("/frames" + location.search).catch((err) => {
    console.error(err);
    icon.href = "/error.png";
  });
  const frameSize = +res.headers.get("frame-size");
  const buf = await res.arrayBuffer();
  const array = new Uint8Array(buf);

  console.log({ frameSize });

  // todo: account for different image sizes
  for (let i = 0; i < array.length; i += frameSize) {
    const image = array.subarray(i, i + frameSize);
    const blob = new Blob([image], { type: "image/bmp" });
    frames.push(URL.createObjectURL(blob));
  }

  onLoaded();
  await fetch("/loaded"); // notify server to open new window if needed
}

window.load = load;

if (dbg) {
  console.log("Debug mode enabled, call window.load() to proceed");
} else {
  load();
}
