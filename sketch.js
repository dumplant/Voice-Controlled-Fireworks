let fireworks = [];
let gravity;
let speechRec;
let explosionSound;
let haveFireworks;

function preload() {
  explosionSound = loadSound("explosion.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  gravity = createVector(0, 0.2);

  speechRec = new p5.SpeechRec("US-en");
  speechRec.continuous = true;
  speechRec.onResult = onSpeechResult;
  speechRec.start();

  haveFireworks = false;
}

function draw() {
  background(0);
  for (let i = fireworks.length - 1; i >= 0; i--) {
    fireworks[i].update();
    fireworks[i].show();

    if (fireworks[i].isFinished()) {
      fireworks.splice(i, 1);
    }
  }
  if (haveFireworks === false) {
    displayText();
  }
}

// function mousePressed() {
//   let firework = new Firework(mouseX, height);
//   fireworks.push(firework);
// }

function onSpeechResult() {
  let transcript = speechRec.resultString.toLowerCase();

  let sCount = transcript.split("s").length - 1;
  for (let i = 0; i < sCount; i++) {
    let firework = new Firework(random(width), height);
    fireworks.push(firework);
    haveFireworks = true;
  }
}

function displayText() {
  textAlign(CENTER);
  textSize(32);
  fill(255, 255, 255, 100);
  textFont("Georgia");
  text("Say 'siu' to launch fireworks", width / 2, height / 2);
}

class Firework {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.firework = new Particle(x, y, true);
    this.exploded = false;
    this.particles = [];
  }

  update() {
    if (!this.exploded) {
      this.firework.applyForce(gravity);
      this.firework.update();

      if (this.firework.velocity.y >= 0) {
        explosionSound.play();
        this.exploded = true;
        this.explode();
      }
    }

    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].applyForce(gravity);
      this.particles[i].update();

      if (this.particles[i].isFinished()) {
        this.particles.splice(i, 1);
      }
    }
  }

  show() {
    if (!this.exploded) {
      this.firework.show();
    }

    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].show();
    }
  }

  explode() {
    for (let i = 0; i < 100; i++) {
      let particle = new Particle(
        this.firework.position.x,
        this.firework.position.y,
        false
      );
      this.particles.push(particle);
    }
  }

  isFinished() {
    return this.exploded && this.particles.length === 0;
  }
}

class Particle {
  constructor(x, y, firework) {
    this.position = createVector(x, y);
    this.firework = firework;
    if (this.firework) {
      this.velocity = createVector(0, random(-18, -8));
    } else {
      this.velocity = p5.Vector.random2D();
      this.velocity.mult(random(2, 10));
    }
    this.acceleration = createVector(0, 0);
    this.lifespan = 255;
  }

  applyForce(force) {
    this.acceleration.add(force);
  }

  update() {
    if (!this.firework) {
      this.velocity.mult(0.9);
      this.lifespan -= 4;
    }

    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.acceleration.mult(0);
  }

  show() {
    stroke(255, this.lifespan);
    if (!this.firework) {
      strokeWeight(2);
      fill(255, this.lifespan);
    } else {
      strokeWeight(4);
    }
    point(this.position.x, this.position.y);
  }

  isFinished() {
    return this.lifespan <= 0;
  }
}
