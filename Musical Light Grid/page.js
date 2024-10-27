const grid = document.getElementById('grid');
const playhead = document.getElementById('playhead');
const playButton = document.getElementById('playButton');
const clearButton = document.getElementById('clearButton');
const speedSlider = document.getElementById('speedSlider');
const scaleSelect = document.getElementById('scaleSelect');
const colorSelector = document.getElementById('colorSelector');

const GRID_COLS = 16;
const GRID_ROWS = 12;
let isPlaying = false;
let currentCol = 0;
let cells = [];
let audioContext = null;

// Musical scales
const scales = {
    pentatonic: [0, 2, 4, 7, 9, 12, 14, 16, 19, 21, 24, 26],
    major: [0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19],
    minor: [0, 2, 3, 5, 7, 8, 10, 12, 14, 15, 17, 19],
    blues: [0, 3, 5, 6, 7, 10, 12, 15, 17, 18, 19, 22]
};

// Colors for different notes
const colors = [
    '#ff6b6b', '#4ecdc4', '#45b7d1', '#96f7d2',
    '#f7d794', '#f8a5c2', '#778beb', '#63cdda'
];

// Create color selector
colors.forEach(color => {
    const colorOption = document.createElement('div');
    colorOption.className = 'color-option';
    colorOption.style.backgroundColor = color;
    colorOption.addEventListener('click', () => {
        currentColor = color;
    });
    colorSelector.appendChild(colorOption);
});

let currentColor = colors[0];

// Initialize grid
function initGrid() {
    grid.style.gridTemplateColumns = `repeat(${GRID_COLS}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${GRID_ROWS}, 1fr)`;

    for (let row = 0; row < GRID_ROWS; row++) {
        cells[row] = [];
        for (let col = 0; col < GRID_COLS; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            
            cell.addEventListener('mousedown', () => toggleCell(cell, row, col));
            cell.addEventListener('mouseover', (e) => {
                if (e.buttons === 1) {
                    toggleCell(cell, row, col);
                }
            });
            
            grid.appendChild(cell);
            cells[row][col] = {
                element: cell,
                active: false,
                color: null
            };
        }
    }
}

// Toggle cell state
function toggleCell(cell, row, col) {
    const cellData = cells[row][col];
    cellData.active = !cellData.active;
    
    if (cellData.active) {
        cellData.color = currentColor;
        cell.style.backgroundColor = currentColor;
        createRipple(cell);
        playNote(row);
    } else {
        cellData.color = null;
        cell.style.backgroundColor = '';
    }
}

// Create ripple effect
function createRipple(cell) {
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    const rect = cell.getBoundingClientRect();
    ripple.style.left = rect.left + rect.width / 2 + 'px';
    ripple.style.top = rect.top + rect.height / 2 + 'px';
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 1000);
}

// Play note
function playNote(row) {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    const scale = scales[scaleSelect.value];
    const frequency = 220 * Math.pow(2, scale[row] / 12);
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    
    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.5);
}

// Update playhead
function updatePlayhead() {
    if (!isPlaying) return;

    const cellWidth = grid.clientWidth / GRID_COLS;
    playhead.style.left = (currentCol * cellWidth) + 'px';

    // Play active cells in current column
    for (let row = 0; row < GRID_ROWS; row++) {
        const cell = cells[row][currentCol];
        if (cell.active) {
            playNote(row);
            cell.element.classList.add('active');
            setTimeout(() => cell.element.classList.remove('active'), 100);
        }
    }

    currentCol = (currentCol + 1) % GRID_COLS;

    setTimeout(updatePlayhead, 60000 / speedSlider.value);
}

// Event listeners
playButton.addEventListener('click', () => {
    isPlaying = !isPlaying;
    if (isPlaying) {
        if (audioContext === null) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        updatePlayhead();
    }
});

clearButton.addEventListener('click', () => {
    cells.forEach(row => {
        row.forEach(cell => {
            cell.active = false;
            cell.color = null;
            cell.element.style.backgroundColor = '';
        });
    });
});

// Initialize
initGrid();

// Handle window resize
window.addEventListener('resize', () => {
    const cellWidth = grid.clientWidth / GRID_COLS;
    playhead.style.left = (currentCol * cellWidth) + 'px';
});