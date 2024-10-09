const container = document.getElementById('gameContainer');
const scoreElement = document.getElementById('scoreValue');
const gameOverElement = document.getElementById('gameOver');
const finalScoreElement = document.getElementById('finalScore');

let score = 0;
let isGameOver = false;
let debris = [];
let asteroids = [];
let particles = [];
let engineParticles = [];

// Create spaceship
const spaceship = document.createElement('div');
spaceship.className = 'spaceship';
container.appendChild(spaceship);

// Game state
let mouseX = 0;
let mouseY = 0;
let spaceshipX = window.innerWidth / 2;
let spaceshipY = window.innerHeight / 2;

// Mouse movement
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function createDebris() {
    if (debris.length < 5 && !isGameOver) {
        const debrisElement = document.createElement('div');
        debrisElement.className = 'debris';
        container.appendChild(debrisElement);

        const x = Math.random() * (window.innerWidth - 20);
        const y = Math.random() * (window.innerHeight - 20);
        
        debris.push({
            element: debrisElement,
            x: x,
            y: y,
            rotation: 0
        });

        debrisElement.style.left = x + 'px';
        debrisElement.style.top = y + 'px';
    }
}

function createAsteroid() {
    if (asteroids.length < 3 && !isGameOver) {
        const asteroidElement = document.createElement('div');
        asteroidElement.className = 'asteroid';
        container.appendChild(asteroidElement);

        const size = 30 + Math.random() * 40;
        const speed = 2 + Math.random() * 2;
        const angle = Math.random() * Math.PI * 2;

        asteroidElement.style.width = size + 'px';
        asteroidElement.style.height = size + 'px';

        asteroids.push({
            element: asteroidElement,
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            dx: Math.cos(angle) * speed,
            dy: Math.sin(angle) * speed,
            size: size,
            rotation: 0
        });
    }
}

        function createParticles(x, y, color, count) {
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        container.appendChild(particle);

        const angle = Math.random() * Math.PI * 2;
        const speed = 1 + Math.random() * 3;
        const size = 2 + Math.random() * 4;

        particles.push({
            element: particle,
            x: x,
            y: y,
            dx: Math.cos(angle) * speed,
            dy: Math.sin(angle) * speed,
            life: 1,
            color: color
        });

        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.background = color;
    }
}

function createEngineParticle() {
    const particle = document.createElement('div');
    particle.className = 'engine-particle';
    container.appendChild(particle);

    const angle = Math.PI + (Math.random() - 0.5) * 0.5;
    const speed = 2 + Math.random() * 2;
    const size = 3 + Math.random() * 3;

    engineParticles.push({
        element: particle,
        x: spaceshipX,
        y: spaceshipY,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        life: 1,
        size: size
    });

    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
}

function checkCollision(x1, y1, size1, x2, y2, size2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < (size1 + size2) / 2;
}

function gameOver() {
    isGameOver = true;
    gameOverElement.style.display = 'block';
    finalScoreElement.textContent = score;
}

function resetGame() {
    score = 0;
    isGameOver = false;
    scoreElement.textContent = '0';
    gameOverElement.style.display = 'none';

    // Clear all game objects
    debris.forEach(d => d.element.remove());
    asteroids.forEach(a => a.element.remove());
    particles.forEach(p => p.element.remove());
    engineParticles.forEach(p => p.element.remove());

    debris = [];
    asteroids = [];
    particles = [];
    engineParticles = [];
}

function updateGame() {
    if (!isGameOver) {
        // Update spaceship position with smooth movement
        const dx = mouseX - spaceshipX;
        const dy = mouseY - spaceshipY;
        spaceshipX += dx * 0.1;
        spaceshipY += dy * 0.1;

        // Rotate spaceship towards mouse
        const angle = Math.atan2(dy, dx) + Math.PI / 2;
        spaceship.style.transform = 
        `translate(${spaceshipX - 20}px,
         ${spaceshipY - 20}px) rotate(${angle}rad)`;

        // Create engine particles
        if (Math.random() < 0.3) {
            createEngineParticle();
        }

        // Update debris
        debris.forEach((d, index) => {
            d.rotation += 0.02;
            d.element.style.transform = 
            `rotate(${d.rotation}rad)`;

            // Check collection
            if (checkCollision(spaceshipX, spaceshipY, 
                40, d.x + 10, d.y + 10, 20)) {
                d.element.remove();
                debris.splice(index, 1);
                score += 10;
                scoreElement.textContent = score;
                createParticles(d.x + 10, d.y + 10,
                     '#50c878', 10);
            }
        });

        // Update asteroids
        asteroids.forEach((a, index) => {
            a.x += a.dx;
            a.y += a.dy;
            a.rotation += 0.01;

            // Wrap around screen
            if (a.x < -a.size) a.x = 
            window.innerWidth + a.size;
            if (a.x > window.innerWidth + a.size) 
                a.x = -a.size;
            if (a.y < -a.size) a.y = window.innerHeight
             + a.size;
            if (a.y > window.innerHeight + a.size) 
                a.y = -a.size;

            a.element.style.transform =
             `translate(${a.x - a.size/2}px, 
            ${a.y - a.size/2}px) rotate(${a.rotation}rad)`;

            // Check collision with spaceship
            if (checkCollision(spaceshipX, spaceshipY, 430, a.x, a.y, a.size)) {
                createParticles(spaceshipX, spaceshipY, '#ff6b6b', 20);
                gameOver();
            }
        });

        // Update particles
        particles.forEach((p, index) => {
            p.x += p.dx;
            p.y += p.dy;
            p.life -= 0.02;
            p.element.style.transform = `translate(${p.x}px, ${p.y}px)`;
            p.element.style.opacity = p.life;

            if (p.life <= 0) {
                p.element.remove();
                particles.splice(index, 1);
            }
        });

        // Update engine particles
        engineParticles.forEach((p, index) => {
            p.x += p.dx;
            p.y += p.dy;
            p.life -= 0.02;
            p.element.style.transform = `translate(${p.x}px, ${p.y}px)`;
            p.element.style.opacity = p.life;

            if (p.life <= 0) {
                p.element.remove();
                engineParticles.splice(index, 1);
            }
        });
    }

    requestAnimationFrame(updateGame);
}

// Start game loops
setInterval(createDebris, 2000);
setInterval(createAsteroid, 3000);
updateGame();