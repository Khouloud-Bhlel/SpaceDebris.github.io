const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const instructions = document.getElementById('instructions');

// Set canvas size to window size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Hide instructions on first keypress
function hideInstructions() {
    instructions.style.display = 'none';
    window.removeEventListener('keydown', hideInstructions); // Remove the event listener
}

// Add event listener to hide instructions when a key is pressed
window.addEventListener('keydown', hideInstructions);

// Player object
const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 20,
    color: '#00ff00',
    speed: 5,
    dx: 0,
    dy: 0
};

// Collectibles array
let collectibles = [];
let score = 0;

// Generate random collectibles
function generateCollectible() {
    return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: 10,
        color: `hsl(${Math.random() * 360}, 100%, 50%)`,
        speed: 2,
        angle: Math.random() * Math.PI * 2
    };
}

// Initialize collectibles
for (let i = 0; i < 10; i++) {
    collectibles.push(generateCollectible());
}

// Handle keyboard input
const keys = {};
window.addEventListener('keydown', (e) => keys[e.key] = true);
window.addEventListener('keyup', (e) => keys[e.key] = false);

// Update player position based on input
function updatePlayer() {
    if (keys['ArrowUp'] || keys['w']) player.dy -= 0.5;
    if (keys['ArrowDown'] || keys['s']) player.dy += 0.5;
    if (keys['ArrowLeft'] || keys['a']) player.dx -= 0.5;
    if (keys['ArrowRight'] || keys['d']) player.dx += 0.5;

    // Apply friction
    player.dx *= 0.98;
    player.dy *= 0.98;

    // Update position
    player.x += player.dx;
    player.y += player.dy;

    // Wrap around screen
    if (player.x < -player.radius) player.x = canvas.width + player.radius;
    if (player.x > canvas.width + player.radius) player.x = -player.radius;
    if (player.y < -player.radius) player.y = canvas.height + player.radius;
    if (player.y > canvas.height + player.radius) player.y = -player.radius;
}

// Update collectibles
function updateCollectibles() {
    collectibles.forEach(collectible => {
        // Move collectible
        collectible.x += Math.cos(collectible.angle) * collectible.speed;
        collectible.y += Math.sin(collectible.angle) * collectible.speed;

        // Wrap around screen
        if (collectible.x < -collectible.radius) collectible.x = canvas.width + collectible.radius;
        if (collectible.x > canvas.width + collectible.radius) collectible.x = -collectible.radius;
        if (collectible.y < -collectible.radius) collectible.y = canvas.height + collectible.radius;
        if (collectible.y > canvas.height + collectible.radius) collectible.y = -collectible.radius;

        // Check collision with player
        const dx = player.x - collectible.x;
        const dy = player.y - collectible.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < player.radius + collectible.radius) {
            // Replace collected item with new one
            const index = collectibles.indexOf(collectible);
            collectibles[index] = generateCollectible();
            score += 10;
            scoreElement.textContent = `Score: ${score}`;
        }
    });
}

// Draw everything
function draw() {
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw player with trail effect
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fillStyle = player.color;
    ctx.fill();
    ctx.closePath();

    // Draw collectibles
    collectibles.forEach(collectible => {
        ctx.beginPath();
        ctx.arc(collectible.x, collectible.y, collectible.radius, 0, Math.PI * 2);
        ctx.fillStyle = collectible.color;
        ctx.fill();
        ctx.closePath();
    });
}

// Game loop
function gameLoop() {
    updatePlayer();
    updateCollectibles();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game
gameLoop();
