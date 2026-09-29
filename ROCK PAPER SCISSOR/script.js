const video = document.getElementById("video");
const canvas = document.getElementById("overlay");
const ctx = canvas.getContext("2d");
const loading = document.getElementById("loading");
const permission = document.getElementById("permission");
const cameraBtn = document.getElementById("cameraBtn");
const statusText = document.getElementById("statusText");
const instruction = document.getElementById("instruction");
const gestureText = document.getElementById("gestureText");
const gestureEmoji = document.getElementById("gestureEmoji");
const result = document.getElementById("result");
const resultTitle = document.getElementById("resultTitle");
const resultSub = document.getElementById("resultSub");

let camera = null;
let cameraReady = false;
let currentGesture = null;
let lastGestureTime = 0;
let roundLocked = false;
let autoMode = false;
let autoTimer = null;
let scores = { you: 0, ai: 0, draw: 0 };

const icons = { rock:"✊", paper:"✋", scissors:"✌️", none:"🖐️" };
const names = { rock:"Rock", paper:"Paper", scissors:"Scissors" };
const beats = { rock:"scissors", paper:"rock", scissors:"paper" };

function resizeCanvas(){
  canvas.width = video.videoWidth || 1280;
  canvas.height = video.videoHeight || 720;
}
window.addEventListener("resize", resizeCanvas);

function distance(a,b){
  return Math.hypot(a.x-b.x, a.y-b.y);
}

// MediaPipe hand landmark indexes.
// Finger is considered extended when its tip is farther from wrist
// than the middle joint, with a little tolerance.
function isExtended(lm, tip, pip, mcp){
  const wrist = lm[0];
  const dTip = distance(lm[tip], wrist);
  const dPip = distance(lm[pip], wrist);
  const dMcp = distance(lm[mcp], wrist);
  return dTip > dPip * 1.12 && dTip > dMcp * 1.35;
}

function detectGesture(lm){
  // Thumb uses a different geometry because it moves sideways.
  const thumbExtended = distance(lm[4], lm[0]) > distance(lm[3], lm[0]) * 1.10;
  const index = isExtended(lm,8,6,5);
  const middle = isExtended(lm,12,10,9);
  const ring = isExtended(lm,16,14,13);
  const pinky = isExtended(lm,20,18,17);

  const extended = [index,middle,ring,pinky].filter(Boolean).length;

  // Paper: four fingers up and thumb can be either direction.
  if (extended >= 4) return "paper";

  // Scissors: index + middle extended, ring + pinky folded.
  if (index && middle && !ring && !pinky) return "scissors";

  // Rock: all four main fingers folded.
  if (extended === 0 && !thumbExtended) return "rock";

  // A more tolerant rock check.
  if (extended <= 1 && distance(lm[8], lm[5]) < distance(lm[12], lm[9]) * 1.15) {
    return "rock";
  }

  return null;
}

function setGesture(gesture){
  currentGesture = gesture;
  if(gesture){
    gestureEmoji.textContent = icons[gesture];
    gestureText.textContent = names[gesture];
    instruction.textContent = autoMode
      ? "Hand detected — hold still..."
      : "Press SPACE to shoot";
  }else{
    gestureEmoji.textContent = icons.none;
    gestureText.textContent = "Waiting";
    instruction.textContent = autoMode
      ? "Show Rock, Paper or Scissors"
      : "Show your hand, then press SPACE";
  }
}

function aiChoice(){
  const arr = ["rock","paper","scissors"];
  return arr[Math.floor(Math.random()*3)];
}

function outcome(player, ai){
  if(player === ai) return "draw";
  return beats[player] === ai ? "you" : "ai";
}

function playRound(){
  if(roundLocked || !currentGesture) return;

  roundLocked = true;
  const player = currentGesture;
  const ai = aiChoice();
  const winner = outcome(player, ai);

  if(winner === "you") scores.you++;
  if(winner === "ai") scores.ai++;
  if(winner === "draw") scores.draw++;
  updateScore();

  result.classList.remove("hidden");
  resultTitle.textContent =
    winner === "you" ? "You win!" :
    winner === "ai" ? "AI wins!" : "Draw!";
  resultTitle.style.color =
    winner === "you" ? "#55e2b1" :
    winner === "ai" ? "#ff716a" : "#d0d0d5";
  resultSub.textContent = `${icons[player]} ${names[player]}  vs  ${icons[ai]} ${names[ai]}`;

  instruction.textContent = "Round complete";
  if(autoMode){
    clearTimeout(autoTimer);
    autoTimer = setTimeout(nextRound, 1400);
  }
}

function nextRound(){
  roundLocked = false;
  result.classList.add("hidden");
  instruction.textContent = currentGesture
    ? (autoMode ? "Hold your hand..." : "Press SPACE to shoot")
    : "Show your hand";
}

function updateScore(){
  document.getElementById("playerScore").textContent = scores.you;
  document.getElementById("aiScore").textContent = scores.ai;
  document.getElementById("drawScore").textContent = scores.draw;
}

function resetGame(){
  scores = {you:0, ai:0, draw:0};
  updateScore();
  roundLocked = false;
  result.classList.add("hidden");
  instruction.textContent = "Show your hand, then press SPACE";
  setGesture(null);
}

function toggleAuto(){
  autoMode = !autoMode;
  const btn = document.getElementById("autoBtn");
  btn.classList.toggle("active", autoMode);
  if(autoMode){
    btn.querySelector("b").textContent = "Auto ON";
    instruction.textContent = "Show a hand — auto shoot is on";
  }else{
    btn.querySelector("b").textContent = "Auto";
    clearTimeout(autoTimer);
    instruction.textContent = currentGesture ? "Press SPACE to shoot" : "Show your hand";
  }
}

async function startCamera(){
  try{
    permission.classList.remove("show");
    statusText.textContent = "Requesting camera...";
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode:"user", width:{ideal:1280}, height:{ideal:720} },
      audio:false
    });
    video.srcObject = stream;
    await video.play();
    resizeCanvas();
    camera.start();
  }catch(err){
    console.error(err);
    loading.style.display = "none";
    permission.classList.add("show");
    statusText.textContent = "Camera blocked";
  }
}

function onResults(results){
  loading.style.display = "none";
  cameraReady = true;
  statusText.textContent = "Camera active";
  ctx.clearRect(0,0,canvas.width,canvas.height);

  if(results.multiHandLandmarks && results.multiHandLandmarks.length){
    const lm = results.multiHandLandmarks[0];
    drawConnectors(ctx, lm, HAND_CONNECTIONS, {color:"#ffffff", lineWidth:2});
    drawLandmarks(ctx, lm, {color:"#ffffff", lineWidth:1, radius:2});

    const gesture = detectGesture(lm);
    const now = performance.now();
    if(gesture && now-lastGestureTime > 150){
      setGesture(gesture);
      lastGestureTime = now;
      if(autoMode && !roundLocked){
        clearTimeout(autoTimer);
        autoTimer = setTimeout(playRound, 500);
      }
    }else if(!gesture && now-lastGestureTime > 500){
      setGesture(null);
    }
  }else if(performance.now()-lastGestureTime > 400){
    setGesture(null);
  }
}

const hands = new Hands({
  locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`
});
hands.setOptions({
  maxNumHands: 1,
  modelComplexity: 1,
  minDetectionConfidence: 0.65,
  minTrackingConfidence: 0.6
});
hands.onResults(onResults);

camera = new Camera(video, {
  onFrame: async () => {
    await hands.send({image:video});
  },
  width:1280,
  height:720
});

document.getElementById("playBtn").addEventListener("click", playRound);
document.getElementById("nextBtn").addEventListener("click", nextRound);
document.getElementById("autoBtn").addEventListener("click", toggleAuto);
document.getElementById("resetBtn").addEventListener("click", resetGame);
cameraBtn.addEventListener("click", startCamera);

document.addEventListener("keydown", e => {
  if(e.code === "Space"){
    e.preventDefault();
    playRound();
  }
  if(e.key.toLowerCase() === "a") toggleAuto();
  if(e.key.toLowerCase() === "r") resetGame();
});

if(!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia){
  loading.style.display = "none";
  permission.classList.add("show");
  statusText.textContent = "Camera API unavailable";
}else{
  startCamera();
}
