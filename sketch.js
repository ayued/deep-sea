let particles = [];
let noiseScale = 0.01;

function setup() {
  let viewport = document.querySelector('meta[name=viewport]');
  if (!viewport) {
    viewport = document.createElement('meta');
    viewport.name = 'viewport';
    document.head.appendChild(viewport);
  }
  viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');

  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  background(0);
}

function draw() {
  // ゆっくりフェードアウトする背景
  fill(0, 0, 0, 4);
  rect(0, 0, width, height);
  
  // 新しいパーティクルを追加
  if (mouseIsPressed) {
    for (let i = 0; i < 5; i++) {
      particles.push(new Particle(mouseX, mouseY));
    }
  }
  
  // パーティクルを更新して描画
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    particles[i].display();
    if (particles[i].isDead()) {
      particles.splice(i, 1);
    }
  }
}

class Particle {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = p5.Vector.random2D().mult(random(0.5, 2));
    this.acc = createVector(0, 0);
    this.life = 400;
    this.maxLife = 300;
    this.hue = random(200, 260); // 青系の色相範囲
    this.saturation = random(60, 100);
    this.brightness = random(0, 100);
    this.size = random(0.5, 2.5) * min(windowWidth, windowHeight) / 1000;
  }
  
  update() {
    let angle = noise(this.pos.x * noiseScale, this.pos.y * noiseScale) * TWO_PI * 4;
    this.acc = p5.Vector.fromAngle(angle).mult(0.1);
    
    this.vel.add(this.acc);
    this.vel.limit(2);
    this.pos.add(this.vel);
    this.life -= 1;
    
    // 画面の端で反射
    if (this.pos.x < 0 || this.pos.x > width) this.vel.x *= -1;
    if (this.pos.y < 0 || this.pos.y > height) this.vel.y *= -1;
  }
  
  display() {
    let alpha = map(this.life, 0, this.maxLife, 0, 100);
    
    noStroke();
    fill(this.hue, this.saturation, this.brightness, alpha);
    ellipse(this.pos.x, this.pos.y, this.size);
  }
  
  isDead() {
    return this.life <= 0;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(220, 50, 15);
}
