export class Trump {
  x: number;
  y: number;
  size: number;
  bounceOffset: number = 0;
  armAngle: number = 0;
  time: number = 0;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.x = canvasWidth / 2;
    this.y = canvasHeight * 0.65;
    this.size = 60; // Bigger than penguins
  }

  update(elapsed: number) {
    this.time = elapsed;
    
    // Bouncy dance movement
    this.bounceOffset = Math.sin(elapsed * 4) * 15;
    
    // Arm waving
    this.armAngle = Math.sin(elapsed * 6) * 0.6;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.translate(this.x, this.y + this.bounceOffset);

    // Body (suit)
    ctx.fillStyle = '#1a1a2e'; // Dark blue suit
    ctx.beginPath();
    ctx.ellipse(0, 10, this.size * 0.5, this.size * 0.8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Red tie
    ctx.fillStyle = '#DC143C';
    ctx.beginPath();
    ctx.moveTo(0, -10);
    ctx.lineTo(-8, 30);
    ctx.lineTo(0, 35);
    ctx.lineTo(8, 30);
    ctx.closePath();
    ctx.fill();

    // Head (larger oval - signature look)
    ctx.fillStyle = '#FFD4A3'; // Skin tone
    ctx.beginPath();
    ctx.ellipse(0, -this.size * 0.6, this.size * 0.45, this.size * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Hair (iconic swoosh)
    ctx.fillStyle = '#FFD700'; // Golden blonde
    ctx.beginPath();
    ctx.moveTo(-this.size * 0.4, -this.size * 0.9);
    ctx.quadraticCurveTo(-this.size * 0.2, -this.size * 1.2, this.size * 0.5, -this.size * 0.85);
    ctx.quadraticCurveTo(this.size * 0.3, -this.size * 0.7, this.size * 0.4, -this.size * 0.6);
    ctx.quadraticCurveTo(0, -this.size * 0.95, -this.size * 0.4, -this.size * 0.9);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(-12, -this.size * 0.65, 6, 0, Math.PI * 2);
    ctx.arc(12, -this.size * 0.65, 6, 0, Math.PI * 2);
    ctx.fill();

    // Pupils
    ctx.fillStyle = '#4169E1'; // Blue eyes
    ctx.beginPath();
    ctx.arc(-12, -this.size * 0.65, 3, 0, Math.PI * 2);
    ctx.arc(12, -this.size * 0.65, 3, 0, Math.PI * 2);
    ctx.fill();

    // Eyebrows (distinctive)
    ctx.strokeStyle = '#B8860B';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-20, -this.size * 0.75);
    ctx.lineTo(-5, -this.size * 0.73);
    ctx.moveTo(5, -this.size * 0.73);
    ctx.lineTo(20, -this.size * 0.75);
    ctx.stroke();

    // Mouth (big smile or signature expression)
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, -this.size * 0.45, 10, 0.2, Math.PI - 0.2);
    ctx.stroke();

    // Arms (waving/dancing)
    ctx.strokeStyle = '#1a1a2e';
    ctx.lineWidth = 8;
    
    // Left arm (raised, waving)
    ctx.save();
    ctx.rotate(this.armAngle);
    ctx.beginPath();
    ctx.moveTo(-this.size * 0.5, 0);
    ctx.lineTo(-this.size * 0.9, -30);
    ctx.stroke();
    
    // Left hand (thumbs up gesture)
    ctx.fillStyle = '#FFD4A3';
    ctx.beginPath();
    ctx.arc(-this.size * 0.9, -30, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Right arm (pointing or dancing)
    ctx.save();
    ctx.rotate(-this.armAngle);
    ctx.beginPath();
    ctx.moveTo(this.size * 0.5, 0);
    ctx.lineTo(this.size * 0.9, -20);
    ctx.stroke();
    
    // Right hand
    ctx.fillStyle = '#FFD4A3';
    ctx.beginPath();
    ctx.arc(this.size * 0.9, -20, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Legs (simple)
    ctx.strokeStyle = '#1a1a2e';
    ctx.lineWidth = 10;
    const legBounce = Math.sin(this.time * 8) * 5;
    ctx.beginPath();
    ctx.moveTo(-15, this.size * 0.8);
    ctx.lineTo(-15, this.size * 0.8 + 30 + legBounce);
    ctx.moveTo(15, this.size * 0.8);
    ctx.lineTo(15, this.size * 0.8 + 30 - legBounce);
    ctx.stroke();

    // Shoes (black)
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.ellipse(-15, this.size * 0.8 + 35, 12, 6, 0, 0, Math.PI * 2);
    ctx.ellipse(15, this.size * 0.8 + 35, 12, 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Add "sparkle" effects around him (showmanship)
    const sparkleCount = 8;
    for (let i = 0; i < sparkleCount; i++) {
      const angle = (this.time * 2 + (i * Math.PI * 2) / sparkleCount) % (Math.PI * 2);
      const distance = 80 + Math.sin(this.time * 3 + i) * 10;
      const sparkleX = Math.cos(angle) * distance;
      const sparkleY = Math.sin(angle) * distance;
      
      const sparkleSize = 3 + Math.sin(this.time * 4 + i) * 2;
      ctx.fillStyle = `rgba(255, 215, 0, ${0.5 + Math.sin(this.time * 5 + i) * 0.3})`;
      
      // Star shape
      ctx.beginPath();
      for (let j = 0; j < 5; j++) {
        const starAngle = (j * Math.PI * 2) / 5 - Math.PI / 2;
        const x = sparkleX + Math.cos(starAngle) * sparkleSize;
        const y = sparkleY + Math.sin(starAngle) * sparkleSize;
        if (j === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.closePath();
      ctx.fill();
    }

    // Speech bubble with catchphrase (optional - appears occasionally)
    if (Math.floor(this.time) % 5 < 2) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      
      // Bubble
      ctx.beginPath();
      ctx.roundRect(-80, -120, 160, 40, 10);
      ctx.fill();
      ctx.stroke();
      
      // Bubble pointer
      ctx.beginPath();
      ctx.moveTo(-20, -80);
      ctx.lineTo(-10, -90);
      ctx.lineTo(0, -80);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      
      // Text
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('TREMENDOUS!', 0, -95);
    }

    ctx.restore();
  }
}
