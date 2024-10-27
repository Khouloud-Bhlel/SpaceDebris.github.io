const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('colorPicker');
const sizeSlider = document.getElementById('sizeSlider');
const gravityToggle = document.getElementById('gravityToggle');
const reverseGravity = document.getElementById('reverseGravity');
const clearButton = document.getElementById('clear');
const saveButton = document.getElementById('saveImage');

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Colors array
const colors = [
    '#ff6b6b', '#4ecdc4', '#45b7d1', '#96f7d2',
    '#f7d794', '#f8a5c2', '#778beb', '#63cdda'
];

// Create color picker options
colors.forEach(color => {
    const colorOption = document.createElement('div');
    colorOption.className = 'color-option';
    colorOption.style.backgroundColor = color;
    colorOption.addEventListener('click', () => {
        document.querySelectorAll('.color-option').forEach(opt => opt.classList.remove('selected'));
        colorOption.classList.add('selected');
        currentColor = color;
    });
    colorPicker.appendChild(colorOption);
});
document.querySelector('.color-option').classList.add('selected');

// Paint drop class
class PaintDrop {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = { x: 0, y: 0 };
        this.gravity = 0.2;
        this.friction = 0.99;
        this.trail = [];
        this.maxTrailLength = 20;
        this.isStatic = false;
    }

    update() {
        if (this.isStatic) return;

        // Add current position to trail
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > this.maxTrailLength) {
            this.trail.shift();
        }

        // Apply gravity
        if (gravityEnabled) {
            this.velocity.y += this.gravity * (gravityReversed ? -1 : 1);
        }

        // Apply velocity
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        // Apply friction
        this.velocity.x *= this.friction;
        this.velocity.y *= this.friction;

        // Bounce off walls
        if (this.x + this.radius > canvas.width) {
            this.x = canvas.width - this.radius;
            this.velocity.x *= -0.7;
        }
        if (this.x - this.radius < 0) {
            this.x = this.radius;
            this.velocity.x *= -0.7;
        }
        if (this.y + this.radius > canvas.height) {
            this.y = canvas.height - this.radius;
            this.velocity.y *= -0.7;
            if (Math.abs(this.velocity.y) < 0.1) {
                this.isStatic = true;
            }
        }
        if (this.y - this.radius < 0) {
            this.y = this.radius;
            this.velocity.y *= -0.7;
        }
    }

    draw() {
        // Draw trail
        ctx.beginPath();
        ctx.moveTo(this.trail[0]?.x || this.x, this.trail[0]?.y || this.y);
        for (let i = 1; i < this.trail.length; i++) {
            const point = this.trail[i];
            ctx.lineTo(point.x, point.y);
        }
        ctx.strokeStyle = this.color + '40'; // Add transparency
        ctx.lineWidth = this.radius * 2;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();

        // Draw paint drop
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

let paintDrops = [];
let currentColor = colors[0];
let isDrawing = false;
let lastPoint = null;
let gravityEnabled = true;
let gravityReversed = false;

// Mouse/Touch event handlers
function startDrawing(e) {
    isDrawing = true;
    const point = getPoint(e);
    lastPoint = point;
}

function draw(e) {
    if (!isDrawing) return;
    const point = getPoint(e);
    
    // Calculate velocity based on movement
    const velocity = {
        x: (point.x - lastPoint.x) * 0.2,
        y: (point.y - lastPoint.y) * 0.2
    };

    // Create new paint drop
    const drop = new PaintDrop(point.x, point.y, parseInt(sizeSlider.value), currentColor);
    drop.velocity = velocity;
    paintDrops.push(drop);

    lastPoint = point;
}

function stopDrawing() {
    isDrawing = false;
}

function getPoint(e) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
    };
}

// Event listeners
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseleave', stopDrawing);

// Touch events
canvas.addEventListener('touchstart', e => {
    e.preventDefault();
    startDrawing(e.touches[0]);
});
canvas.addEventListener('touchmove', e => {
    e.preventDefault();
    draw(e.touches[0]);
});
canvas.addEventListener('touchend', stopDrawing);

// Keyboard controls
document.addEventListener('keydown', e => {
    if (e.code === 'Space') {
        gravityEnabled = !gravityEnabled;
    } else if (e.code === 'KeyR') {
        gravityReversed = !gravityReversed;
    }
});

// Button controls
gravityToggle.addEventListener('click', () => {
    gravityEnabled = !gravityEnabled;
});

reverseGravity.addEventListener('click', () => {
    gravityReversed = !gravityReversed;
});

clearButton.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    paintDrops = [];
});

saveButton.addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'gravity-paint.png';
    link.href = canvas.toDataURL();
    link.click();
});

// Animation loop
function animate() {
    paintDrops.forEach(drop => {
        drop.update();
        drop.draw();
    });
    requestAnimationFrame(animate);
}

animate();