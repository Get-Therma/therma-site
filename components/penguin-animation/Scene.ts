interface SnowParticle {
  x: number;
  y: number;
  radius: number;
  speed: number;
  opacity: number;
  drift: number;
}

interface Building {
  x: number;
  width: number;
  height: number;
  color: string;
  windows: { x: number; y: number }[];
}

interface Car {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
}

interface Pedestrian {
  x: number;
  y: number;
  speed: number;
  size: number;
}

export class Scene {
  width: number;
  height: number;
  snowParticles: SnowParticle[] = [];
  buildings: Building[] = [];
  cars: Car[] = [];
  pedestrians: Pedestrian[] = [];
  streetLamps: { x: number; y: number }[] = [];

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.initializeSnow();
    this.initializeBuildings();
    this.initializeCars();
    this.initializePedestrians();
    this.initializeStreetLamps();
  }

  initializeSnow() {
    // Create 250 snow particles
    for (let i = 0; i < 250; i++) {
      this.snowParticles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        radius: Math.random() * 3 + 1,
        speed: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.6 + 0.4,
        drift: (Math.random() - 0.5) * 0.5,
      });
    }
  }

  initializeBuildings() {
    // Create 5-7 buildings in the background
    const numBuildings = 6;
    const buildingColors = ['#34495E', '#2C3E50', '#5D6D7E', '#566573', '#273746'];
    
    for (let i = 0; i < numBuildings; i++) {
      const width = 80 + Math.random() * 120;
      const height = 150 + Math.random() * 200;
      const x = (this.width / numBuildings) * i;
      const color = buildingColors[Math.floor(Math.random() * buildingColors.length)];
      
      // Generate windows for building
      const windows: { x: number; y: number }[] = [];
      const windowRows = Math.floor(height / 30);
      const windowCols = Math.floor(width / 25);
      
      for (let row = 0; row < windowRows; row++) {
        for (let col = 0; col < windowCols; col++) {
          if (Math.random() > 0.3) { // 70% chance of window being lit
            windows.push({
              x: x + col * 25 + 10,
              y: this.height * 0.6 - height + row * 30 + 10,
            });
          }
        }
      }
      
      this.buildings.push({ x, width, height, color, windows });
    }
  }

  initializeCars() {
    // Create 3-4 parked cars
    const carColors = ['#E74C3C', '#3498DB', '#2ECC71', '#F39C12', '#9B59B6'];
    const numCars = 4;
    
    for (let i = 0; i < numCars; i++) {
      this.cars.push({
        x: (this.width / (numCars + 1)) * (i + 1) - 40,
        y: this.height * 0.7,
        width: 80,
        height: 40,
        color: carColors[Math.floor(Math.random() * carColors.length)],
      });
    }
  }

  initializePedestrians() {
    // Create 3-4 walking pedestrians
    for (let i = 0; i < 3; i++) {
      this.pedestrians.push({
        x: Math.random() * this.width,
        y: this.height * 0.65,
        speed: 0.5 + Math.random() * 1,
        size: 15 + Math.random() * 10,
      });
    }
  }

  initializeStreetLamps() {
    // Create 4-5 street lamps
    const numLamps = 5;
    for (let i = 0; i < numLamps; i++) {
      this.streetLamps.push({
        x: (this.width / (numLamps - 1)) * i,
        y: this.height * 0.55,
      });
    }
  }

  draw(ctx: CanvasRenderingContext2D, elapsed: number) {
    // Draw gradient sky (winter/evening atmosphere)
    const gradient = ctx.createLinearGradient(0, 0, 0, this.height);
    gradient.addColorStop(0, '#1a2332'); // Dark blue-grey top
    gradient.addColorStop(0.5, '#2d4059'); // Medium blue
    gradient.addColorStop(1, '#4a5f7f'); // Lighter at horizon
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.width, this.height);

    // Draw buildings (background)
    this.buildings.forEach((building) => {
      // Building body
      ctx.fillStyle = building.color;
      ctx.fillRect(
        building.x,
        this.height * 0.6 - building.height,
        building.width,
        building.height
      );

      // Building outline
      ctx.strokeStyle = '#1a1a1a';
      ctx.lineWidth = 2;
      ctx.strokeRect(
        building.x,
        this.height * 0.6 - building.height,
        building.width,
        building.height
      );

      // Windows
      ctx.fillStyle = '#F1C40F'; // Warm yellow light
      building.windows.forEach((window) => {
        ctx.fillRect(window.x, window.y, 15, 20);
      });
    });

    // Draw street lamps
    this.streetLamps.forEach((lamp) => {
      // Lamp post
      ctx.strokeStyle = '#34495E';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(lamp.x, lamp.y);
      ctx.lineTo(lamp.x, lamp.y + 100);
      ctx.stroke();

      // Lamp head
      ctx.fillStyle = '#34495E';
      ctx.beginPath();
      ctx.arc(lamp.x, lamp.y, 8, 0, Math.PI * 2);
      ctx.fill();

      // Lamp light (glow)
      const lightGradient = ctx.createRadialGradient(lamp.x, lamp.y, 0, lamp.x, lamp.y, 60);
      lightGradient.addColorStop(0, 'rgba(241, 196, 15, 0.4)');
      lightGradient.addColorStop(1, 'rgba(241, 196, 15, 0)');
      ctx.fillStyle = lightGradient;
      ctx.beginPath();
      ctx.arc(lamp.x, lamp.y, 60, 0, Math.PI * 2);
      ctx.fill();
    });

    // Draw snowy road surface
    const roadGradient = ctx.createLinearGradient(0, this.height * 0.6, 0, this.height);
    roadGradient.addColorStop(0, '#d0d8dd'); // Light grey/white snow
    roadGradient.addColorStop(0.5, '#c5ced4');
    roadGradient.addColorStop(1, '#b8c4cc'); // Slightly darker
    ctx.fillStyle = roadGradient;
    ctx.fillRect(0, this.height * 0.6, this.width, this.height * 0.4);

    // Draw road markings (partially covered by snow)
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 3;
    ctx.setLineDash([20, 20]);
    ctx.beginPath();
    ctx.moveTo(0, this.height * 0.75);
    ctx.lineTo(this.width, this.height * 0.75);
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw parked cars
    this.cars.forEach((car) => {
      // Car body
      ctx.fillStyle = car.color;
      ctx.fillRect(car.x, car.y, car.width, car.height);
      
      // Car top (cabin)
      ctx.fillRect(car.x + 15, car.y - 20, car.width - 30, 20);

      // Windows
      ctx.fillStyle = '#2C3E50';
      ctx.fillRect(car.x + 20, car.y - 18, 15, 15);
      ctx.fillRect(car.x + car.width - 35, car.y - 18, 15, 15);

      // Wheels (covered by snow, just hints)
      ctx.fillStyle = '#1a1a1a';
      ctx.beginPath();
      ctx.arc(car.x + 20, car.y + car.height, 10, 0, Math.PI);
      ctx.arc(car.x + car.width - 20, car.y + car.height, 10, 0, Math.PI);
      ctx.fill();
    });

    // Draw pedestrians (simple silhouettes)
    this.pedestrians.forEach((ped) => {
      // Update position
      ped.x += ped.speed;
      if (ped.x > this.width + 50) {
        ped.x = -50;
      }

      // Draw simple person shape
      ctx.fillStyle = '#2C3E50';
      
      // Head
      ctx.beginPath();
      ctx.arc(ped.x, ped.y - ped.size, ped.size * 0.3, 0, Math.PI * 2);
      ctx.fill();

      // Body
      ctx.fillRect(
        ped.x - ped.size * 0.25,
        ped.y - ped.size * 0.7,
        ped.size * 0.5,
        ped.size * 0.7
      );

      // Legs (simple)
      ctx.fillRect(ped.x - ped.size * 0.2, ped.y, ped.size * 0.15, ped.size * 0.5);
      ctx.fillRect(ped.x + ped.size * 0.05, ped.y, ped.size * 0.15, ped.size * 0.5);
    });

    // Draw falling snow (on top of everything)
    this.snowParticles.forEach((particle) => {
      // Update particle position
      particle.y += particle.speed;
      particle.x += particle.drift;

      // Reset if off screen
      if (particle.y > this.height) {
        particle.y = -10;
        particle.x = Math.random() * this.width;
      }
      if (particle.x > this.width) {
        particle.x = 0;
      } else if (particle.x < 0) {
        particle.x = this.width;
      }

      // Draw snowflake
      ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fill();

      // Add glow to larger snowflakes
      if (particle.radius > 2) {
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity * 0.3})`;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius * 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    });
  }
}
