let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

let W, H;

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

let galaxy = {
  stars: [ ];
    for(let i=0; i<4000; i++) {
      this.stars.push({
        x: Math.random()*W,
        y: Math.random()*H,
        z: Math.random(),
        color: `rgba(255,255,255,${Math.random()*0.7+0.3})`
      });
    }
  },
  update: function(dt) {
    for(let s of this.stars) {
      s.x += s.z*0.1;
      if(s.x > W) s.x = 0;
    }
  },
  draw: function() {
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    ctx.fillRect(0,0,W,H);

    for(let s of this.stars) {
      ctx.fillStyle = s.color;
      ctx.fillRect(s.x, s.y, 1, 1);
    }
  }
};

// PYRAMID STONES
let pyramid = {
  levels: 8,
  bricks: [],
  createBricks: function() {
    let totalBricks = 0;
    for(let i=1; i<=8; i++) {
      totalBricks += i;
    }
    for(let i=1; i<=8; i++) {
      let levelBricks = [];
      for(let j=0; j<i; j++) {
        levelBricks.push({
          id: totalBricks--,
          lit: false,
          x: 0,
          y: 0,
          s: 70 / i + 10 // size
        });
      }
      this.bricks.push({level: i, bricks: levelBricks});
    }
  },
  draw: function() {
    ctx.save();
    ctx.translate(W/2, H/2);
    let stack = 0;

    for(let l of this.bricks) {
      let y = stack * 60;
      let xgap = (W/3) / (l.bricks.length-1);

      for(let b of l.bricks) {
        let x = (b.id - (l.bricks.length-1)/2) * xgap;

        ctx.beginPath();
        ctx.rect(x - b.s/2, y - b.s/2, b.s, b.s);
        if(b.lit) {
          ctx.fillStyle = 'rgba(255,255,255,0.4)';
          ctx.fill();
          ctx.fillStyle = 'rgba(255,200,100,0.7)';
          ctx.stroke();
        } else {
          ctx.fillStyle = 'rgba(100,100,100,0.8)';
          ctx.fill();
        }
        ctx.strokeStyle = 'rgba(50,50,50,0.5)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      stack++;
    }

    ctx.restore();
  }
};

// MEMORY FLASH
let memory = {
  active: false,
  show: function() {
    memory.active = true;
    setTimeout(() => memory.active = false, 300);
  }
};

// INPUT
let emailInput;
let done = false;

// ANIMATION LOOP
let time = 0;
function loop() {
  time += 1;

  galaxy.update(16);
  galaxy.draw();

  pyramid.draw();

  if(memory.active) {
    ctx.fillStyle = 'rgba(255,230,200,0.5)';
    ctx.fillRect(0,0,W,H);
  }

  requestAnimationFrame(loop);
}

// INTERACTION
window.addEventListener('click', (e) => {
  if(done) return;
  let x = e.clientX - W/2;
  let y = e.clientY - H/2;

  // check if hit a brick
  let stack = 0;
  let found = false;
  for(let l of pyramid.bricks) {
    let levelY = stack * 60;
    let xgap = (W/3) / (l.bricks.length-1);

    let xMid = -xgap * (l.bricks.length-1)/2;
    for(let b of l.bricks) {
      let bx = xMid + b.id * xgap;
      if(
        x > bx - b.s/2 &&
        x < bx + b.s/2 &&
        y > levelY - b.s/2 &&
        y < levelY + b.s/2 &&
        !b.lit
      ) {
        b.lit = true;
        memory.show();
        found = true;

        let cleared = 0;
        for(let bl of pyramid.bricks) {
          for(let br of bl.bricks) if(br.lit) cleared++;
        }
        if(cleared === 36) {
          setTimeout(() => {
            done = true;
            canvas.style.cursor = 'text';
            emailInput = document.createElement('input');
            emailInput.type = 'email';
            emailInput.placeholder = '__________';
            emailInput.style.position = 'fixed';
            emailInput.style.left = '50%';
            emailInput.style.top = '50%';
            emailInput.style.fontSize = '32px';
            emailInput.style.transform = 'translate(-50%, -50%)';
            emailInput.style.border = 'none';
            emailInput.style.background = 'transparent';
            emailInput.style.color = 'white';
            emailInput.style.textAlign = 'center';
            document.body.appendChild(emailInput);
          }, 1200);
        }
        break;
      }
    }
    stack++;
    if(found) break;
  }
});

galaxy.init();
pyramid.createBricks();

loop();
