const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const timeElement = document.getElementById('time');
const gameOverScreen = document.getElementById('gameOver');
const finalScoreElement = document.getElementById('finalScore');
const restartButton = document.getElementById('restartButton');

let score = 0;
let timeLeft = 60;
let gameActive = true;
let bubbles = [];
let particles = [];
let mouseX = 0;
let mouseY = 0;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Bubble {
    constructor() {
        this.reset();
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
    }

    reset() {
        this.radius = Math.random() * 30 + 20;
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + this.radius;
        this.speed = Math.random() * 2 + 1;
        this.dx = (Math.random() - 0.5) * 2;
        this.dy = -this.speed;
        this.hue = Math.random() * 360;
        this.popped = false;
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;

        // Wrap around screen
        if (this.x < -this.radius) this.x = canvas.width + this.radius;
        if (this.x > canvas.width + this.radius) this.x = -this.radius;
        if (this.y < -this.radius) this.y = canvas.height + this.radius;
        if (this.y > canvas.height + this.radius) this.y = -this.radius;

        // Subtle movement
        this.dx += (Math.random() - 0.5) * 0.1;
        this.dx = Math.max(Math.min(this.dx, 2), -2);
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 70%, 60%, 0.6)`;
        ctx.fill();
        ctx.strokeStyle = `hsla(${this.hue}, 70%, 70%, 0.8)`;
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.closePath();

        // Add shine effect
        ctx.beginPath();
        ctx.arc(this.x - this.radius * 0.3, this.y - this.radius * 0.3, 
               this.radius * 0.2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fill();
        ctx.closePath();
    }
}

class Particle {
    constructor(x, y, hue) {
        this.x = x;
        this.y = y;
        this.hue = hue;
        this.radius = Math.random() * 3 + 1;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 2;
        this.dx = Math.cos(angle) * speed;
        this.dy = Math.sin(angle) * speed;
        this.alpha = 1;
        this.gravity = 0.1;
    }

    update() {
        this.x += this.dx;
        this.y += this.dy;
        this.dy += this.gravity;
        this.alpha -= 0.02;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue}, 70%, 60%, ${this.alpha})`;
        ctx.fill();
        ctx.closePath();
    }
}

function createBubbles() {
    for (let i = 0; i < 15; i++) {
        bubbles.push(new Bubble());
    }
}

function checkCollision(x, y, bubble) {
    const dx = x - bubble.x;
    const dy = y - bubble.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < bubble.radius;
}

function createPopParticles(x, y, hue) {
    for (let i = 0; i < 10; i++) {
        particles.push(new Particle(x, y, hue));
    }
}

canvas.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

restartButton.addEventListener('click', () => {
    gameActive = true;
    score = 0;
    timeLeft = 60;
    scoreElement.textContent = score;
    timeElement.textContent = timeLeft;
    gameOverScreen.style.display = 'none';
    bubbles = [];
    particles = [];
    createBubbles();
});

function gameLoop() {
    if (!gameActive) return;

    ctx.fillStyle = 'rgba(26, 26, 46, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update and draw bubbles
    bubbles.forEach(bubble => {
        bubble.update();
        bubble.draw();

        // Check for collision with the mouse
        if (checkCollision(mouseX, mouseY, bubble) && !bubble.popped) {
            createPopParticles(bubble.x, bubble.y, bubble.hue);
            bubble.popped = true;
            score += Math.floor(bubble.radius);
            scoreElement.textContent = score;
            setTimeout(() => bubble.reset(), 0);
        }
    });

    // Update and draw particles
    particles = particles.filter(particle => particle.alpha > 0);
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    // Draw cursor trail
    ctx.beginPath();
    ctx.arc(mouseX, mouseY, 10, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fill();
    ctx.closePath();

    requestAnimationFrame(gameLoop);
}

// Timer
function updateTimer() {
    if (!gameActive) return;
    
    timeLeft--;
    timeElement.textContent = timeLeft;

    if (timeLeft <= 0) {
        gameActive = false;
        finalScoreElement.textContent = score;
        gameOverScreen.style.display = 'block';
        return;
    }

    setTimeout(updateTimer, 1000);
}

// Start game
createBubbles();
gameLoop();
updateTimer();
