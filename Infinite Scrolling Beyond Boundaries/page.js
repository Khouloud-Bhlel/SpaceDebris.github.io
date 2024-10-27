const track = document.getElementById('track');
const numItems = 50;
let speed = 2;
let direction = 1;
let items = [];
let angles = [];
let running = true;

function createItems() {
    for (let i = 0; i < numItems; i++) {
        const item = document.createElement('div');
        item.className = 'item';
        item.textContent = i + 1;
        track.appendChild(item);
        items.push(item);
        angles.push((i / numItems) * Math.PI * 2);
    }
}

function updatePositions() {
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;
    const radius = Math.min(window.innerWidth, window.innerHeight) * 0.4;

    items.forEach((item, index) => {
        angles[index] += 0.002 * speed * direction;

        const x = centerX + radius * Math.cos(angles[index]);
        const y = centerY + radius * Math.sin(angles[index]);
        const z = Math.sin(angles[index]) * 100;

        const scale = mapRange(z, -100, 100, 0.5, 1.5);

        item.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${scale})`;
        item.style.opacity = mapRange(z, -100, 100, 0.3, 1);
        item.style.zIndex = Math.floor(mapRange(z, -100, 100, 0, 100));

        // Change text color based on z value
        const hue = mapRange(z, -100, 100, 0, 360);
        item.style.color = `hsl(${hue}, 100%, 50%)`;

        // Set color to white when z is close to 0 (or any desired threshold)
        if (Math.abs(z) < 10) {  // Change this threshold as needed
            item.style.color = '#ffffff';
        }
    });

    if (running) {
        requestAnimationFrame(updatePositions);
    }
}

function mapRange(value, in_min, in_max, out_min, out_max) {
    return (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

function changeSpeed(factor) {
    speed *= factor;
}

function toggleDirection() {
    direction *= -1;
}

createItems();
updatePositions();

window.addEventListener('resize', () => {
    if (!running) {
        running = true;
        updatePositions();
    }
});
