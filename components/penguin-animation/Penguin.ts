export class Penguin {
  x: number;
  y: number;
  speed: number;
  fromLeft: boolean;
  delay: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  startTime: number | null = null;
  isActive: boolean = false;

  constructor(x: number, y: number, speed: number, fromLeft: boolean, delay: number) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.fromLeft = fromLeft;
    this.delay = delay;
    this.size = 30 + Math.random() * 20; // Random size between 30-50
    this.rotation = 0;
    this.rotationSpeed = (Math.random() - 0.5) * 0.1; // Slight wobble
  }

  update(elapsed: number, canvasWidth: number) {
    // Check if penguin should start moving
    if (elapsed < this.delay) {
      return;
    }

    if (!this.isActive) {
      this.isActive = true;
      this.startTime = elapsed;
    }

    // Move penguin
    if (this.fromLeft) {
      this.x += this.speed;
    } else {
      this.x -= this.speed;
    }

    // Update rotation for sliding effect
    this.rotation += this.rotationSpeed;

    // Add slight vertical wobble
    const timeSinceStart = elapsed - (this.startTime || 0);
    this.y += Math.sin(timeSinceStart * 3) * 0.5;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (!this.isActive) return;

    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);

    // Body (main oval)
    ctx.fillStyle = '#2C3E50'; // Dark penguin body
    ctx.beginPath();
    ctx.ellipse(0, 0, this.size * 0.6, this.size, 0, 0, Math.PI * 2);
    ctx.fill();

    // Belly (lighter oval)
    ctx.fillStyle = '#ECF0F1'; // Light belly
    ctx.beginPath();
    ctx.ellipse(0, 5, this.size * 0.4, this.size * 0.7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.fillStyle = '#2C3E50';
    ctx.beginPath();
    ctx.arc(0, -this.size * 0.8, this.size * 0.5, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#FFFFFF';
    const eyeOffset = this.size * 0.15;
    ctx.beginPath();
    ctx.arc(-eyeOffset, -this.size * 0.85, this.size * 0.12, 0, Math.PI * 2);
    ctx.arc(eyeOffset, -this.size * 0.85, this.size * 0.12, 0, Math.PI * 2);
    ctx.fill();

    // Pupils
    ctx.fillStyle = '#000000';
    const pupilOffset = this.fromLeft ? eyeOffset * 0.5 : -eyeOffset * 0.5;
    ctx.beginPath();
    ctx.arc(-eyeOffset + pupilOffset, -this.size * 0.85, this.size * 0.06, 0, Math.PI * 2);
    ctx.arc(eyeOffset + pupilOffset, -this.size * 0.85, this.size * 0.06, 0, Math.PI * 2);
    ctx.fill();

    // Beak
    ctx.fillStyle = '#F39C12'; // Orange beak
    ctx.beginPath();
    ctx.moveTo(0, -this.size * 0.75);
    ctx.lineTo(this.size * 0.2, -this.size * 0.7);
    ctx.lineTo(0, -this.size * 0.65);
    ctx.closePath();
    ctx.fill();

    // Flippers
    ctx.fillStyle = '#2C3E50';
    const flipperAngle = Math.sin(Date.now() / 200) * 0.2; // Slight flapping
    
    // Left flipper
    ctx.save();
    ctx.rotate(flipperAngle);
    ctx.beginPath();
    ctx.ellipse(-this.size * 0.5, 0, this.size * 0.2, this.size * 0.5, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Right flipper
    ctx.save();
    ctx.rotate(-flipperAngle);
    ctx.beginPath();
    ctx.ellipse(this.size * 0.5, 0, this.size * 0.2, this.size * 0.5, -Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Feet (simple ovals)
    ctx.fillStyle = '#F39C12';
    ctx.beginPath();
    ctx.ellipse(-this.size * 0.2, this.size * 0.9, this.size * 0.15, this.size * 0.1, 0, 0, Math.PI * 2);
    ctx.ellipse(this.size * 0.2, this.size * 0.9, this.size * 0.15, this.size * 0.1, 0, 0, Math.PI * 2);
    ctx.fill();

    // Add motion blur effect for sliding
    ctx.globalAlpha = 0.3;
    ctx.fillStyle = '#FFFFFF';
    const blurOffset = this.fromLeft ? -10 : 10;
    ctx.beginPath();
    ctx.ellipse(blurOffset, 0, this.size * 0.4, this.size * 0.8, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}
