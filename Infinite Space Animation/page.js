const container = document.getElementById('spaceContainer');
    
// Create stars
for (let i = 0; i < 200; i++) {
  const star = document.createElement('div');
  star.className = 'star';
  star.style.width = Math.random() * 3 + 'px';
  star.style.height = star.style.width;
  star.style.left = Math.random() * 100 + '%';
  star.style.top = Math.random() * 100 + '%';
  star.style.animationDelay = Math.random() * 1 + 's';
  container.appendChild(star);
}

// Create planets
const planetColors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'];
for (let i = 0; i < 5; i++) {
  const planet = document.createElement('div');
  planet.className = 'planet';
  planet.style.width = Math.random() * 40 + 20 + 'px';
  planet.style.height = planet.style.width;
  planet.style.backgroundColor = planetColors[i];
  planet.style.left = Math.random() * 80 + 10 + '%';
  planet.style.top = Math.random() * 80 + 10 + '%';
  planet.style.animationDelay = Math.random() * 2 + 's';
  container.appendChild(planet);
}

// Create asteroids
for (let i = 0; i < 15; i++) {
  const asteroid = document.createElement('div');
  asteroid.className = 'asteroid';
  asteroid.style.width = Math.random() * 20 + 10 + 'px';
  asteroid.style.height = asteroid.style.width;
  asteroid.style.left = Math.random() * 100 + '%';
  asteroid.style.top = Math.random() * 100 + '%';
  asteroid.style.animationDuration = Math.random() * 4 + 2 + 's';
  container.appendChild(asteroid);
}