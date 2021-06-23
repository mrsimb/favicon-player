# favicon-player
Renders video as a set of animated favicons on browser tabs

Original idea by A4 https://www.youtube.com/watch?v=ke3T8hZtmzw

## Requirements
- Node.js, npm
- ffmpeg
- Google Chrome or Chromium
- Microsoft Windows (feel free to open pull request for adding support for other platforms)

## Usage
```
npx favicon-player [options] <path>
npx favicon-player -w 16 -h 9 myvideo.mp4 
```
You can specify executables for ffmpeg and chrome (or chromium, if you prefer) with absolute path or executable name (if it is available in PATH):
```
npx favicon-player --ffmpeg-path "C:\ffmpeg\ffmpeg.exe" --chrome-path "google-chrome" myvideo.mp4
```

## Options
```
      --help         Show help                                         [boolean]
      --version      Show version number                               [boolean]
  -w, --width        Grid width (number of tabs)           [number] [default: 4]
  -h, --height       Grid height (number of windows)       [number] [default: 3]
  -f, --fps          Output frames per second
                     Chrome can only display 4 favicons per second
                                                           [number] [default: 4]
  -s, --spd          Playback speed multiplier             [number] [default: 1]
  -l, --loop         Loop video                        [boolean] [default: true]
      --size         Output icon size                     [number] [default: 16]
  -p, --port         Application port                   [number] [default: 3100]
      --chrome-path  Path to chrome executable
                                            [string] [default: "C:\Program Files
                                    (x86)\Google\Chrome\Application\chrome.exe"]
      --ffmpeg-path  Path to ffmpeg executable      [string] [default: "ffmpeg"]
  -d, --dbg          Do not load frames immediately   [boolean] [default: false]
```

## Why
To play Bad Apple!! on it, of course