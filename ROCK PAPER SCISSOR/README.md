# RPS Camera Game

A browser-based Rock Paper Scissors game inspired by the camera/hand-tracking experience in the supplied reference image.

## Features

- Webcam camera access
- Real-time hand landmarks
- Rock / Paper / Scissors recognition
- Scoreboard for You / AI / Draw
- Space = play round
- A = toggle Auto mode
- R = reset
- Animated glass-style camera UI
- Mobile responsive
- Camera processing runs in the browser; no video upload/backend is used

## Run

Camera permissions work best from a secure context.

### Recommended: VS Code Live Server

1. Extract the ZIP.
2. Open the `rps-camera-game` folder in VS Code.
3. Install **Live Server** by Ritwick Dey.
4. Right-click `index.html`.
5. Select **Open with Live Server**.
6. Allow camera permission in Chrome/Edge.

The page will open at a localhost address such as `http://127.0.0.1:5500`.

## Important

This version uses MediaPipe Hands from jsDelivr, so the first load needs internet access to download the hand-tracking library/model.

If the browser says the camera is blocked:
- Click the camera/lock icon beside the address bar.
- Set Camera to Allow.
- Reload the page.
- Make sure another application is not exclusively using the webcam.

## Gesture recognition

- Rock: fingers folded
- Paper: four fingers extended
- Scissors: index and middle extended, ring and little fingers folded

The classifier uses hand landmarks and simple geometry. Lighting, hand orientation and camera quality can affect recognition.
