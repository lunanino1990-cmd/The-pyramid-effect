let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

let W, H;
function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

 // Galaxy stars
let stars = [];
for (let i = 0; i < 4000; i++) {
  stars.push({
    x: Math.random() * W,
    y: Math.random() * H,
    z: Math.random() * 0.5 + 0.1,
    opacity: Math.random() * 0.7 + 0.3
  });
}

function updateGalaxy() {
  for (let s of stars) {
    s.x += s.z;
    if (s.x > W) s.x = 0;
  }
}

function drawGalaxy() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
  ctx.fillRect(0, 0, W, H);
  for (let s of stars) {
    ctx.fillStyle = `rgba(255, 255, 255, ${s.opacity})`;
    ctx.fillRect(s.x, s.y, 2, 2);
  }
}

// Pyramid
let levels = 8;
let totalBricks = (levels * (levels + 1)) / 2; // 36 for 8 levels
let bricks = [];
let cleared = 0;
let done = false;

function createPyramid() {
  let brickCount = 0;
  for (let level = 1; level <= levels; level++) {
    let levelBricks = [];
    for (let j = 0; j < level; j++) {
      levelBricks.push({
        lit: false,
        size: 80 - level * 5
      });
      brickCount++;
    }
    bricks.push({level, bricks: levelBricks});
  }
}

function drawPyramid() {
  ctx.save();
  ctx.translate(W / 2, H * 0.7);
  let yOffset = 0;
  for (let group of bricks) {
    let count = group.bricks.length;
    let spacing = W / (count + 1);
    let xStart = - (count - 1) * spacing / 2;
    for (let i = 0; i < count; i++) {
      let b = group.bricks[i];
      let x = xStart + i * spacing;
      let s = b.size;
      ctx.fillStyle = b.lit ? 'rgba(255, 255, 200, 0.8)' : 'rgba(100, 100, 150, 0.6)';
      ctx.strokeStyle = b.lit ? 'rgba(255, 220, 100, 1)' : 'rgba(50, 50, 80, 0.8)';
      ctx.lineWidth = 3;
      ctx.fillRect(x - s/2, yOffset - s/2, s, s);
      ctx.strokeRect(x - s/2, yOffset - s/2, s, s);
    }
    yOffset -= 70;
  }
  ctx.restore();
}

// Animation loop
function loop() {
  updateGalaxy();
  drawGalaxy();
  drawPyramid();
  requestAnimationFrame(loop);
}

// Click to release bricks
canvas.addEventListener('click', (e) => {
  if (done) return;
  let rect = canvas.getBoundingClientRect();
  let mx = e.clientX - rect.left - W/2;
  let my = e.clientY - rect.top - H*0.7;

  let yOffset = 0;
  for (let group of bricks) {
    let count = group.bricks.length;
    let spacing = W / (count + 1);
    let xStart = - (count - 1) * spacing / 2;
    for (let i = 0; i < count; i++) {
      let b = group.bricks[i];
      if (b.lit) continue;
      let x = xStart + i * spacing;
      let s = b.size;
      if (mx > x - s/2 && mx < x + s/2 && my > yOffset - s/2 && my < yOffset + s/2) {
        b.lit = true;
        cleared++;
        // Flash memory effect
        ctx.fillStyle = 'rgba(255, 230, 200, 0.3)';
        ctx.fillRect(0, 0, W, H);
        if (cleared === totalBricks) {
          setTimeout(showEmail, 1500);
        }
        return;
      }
    }
    yOffset -= 70;
  }
});

function showEmail() {
  done = true;
  let input = document.createElement('input');
  input.type = 'email';
  input.placeholder = '__________';
  input.style.position = 'fixed';
  input.style.left = '50%';
  input.style.top = '50%';
  input.style.transform = 'translate(-50%, -50%)';
  input.style.fontSize = '40px';
  input.style.padding = '20px';
  input.style.background = 'rgba(0,0,0,0.5)';
  input.style.color = 'white';
  input.style.border = '2px solid white';
  input.style.textAlign = 'center';
  input.style.zIndex = 10;
  document.body.appendChild(input);
  input.focus();
}

createPyramid();
loop();
