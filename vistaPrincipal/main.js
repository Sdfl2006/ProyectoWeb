// IDs desbloqueados de ejemplo
const desbloqueados = [];

const grid = document.getElementById('pokemon-grid');
const unlockedTemplate = document.getElementById('card-unlocked');
const lockedTemplate = document.getElementById('card-locked');
const progressText = document.getElementById('progress-text');
const progressBar = document.getElementById('progress-bar');

async function getPokemonData(id) {
  const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  if (!res.ok) return null;
  const data = await res.json();
  return {
    nombre: capitalize(data.name),
    tipo: data.types[0].type.name,
    hp: data.stats.find(stat => stat.stat.name === "hp")?.base_stat || "??",
    img: data.sprites.front_default
  };
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

async function renderGrid() {
  let desbloqueadosCount = 0;
  for (let i = 1; i <= 151; i++) {
    if (desbloqueados.includes(i)) {
      const poke = await getPokemonData(i);
      if (!poke) continue;
      desbloqueadosCount++;
      const card = unlockedTemplate.content.cloneNode(true);
      const btn = card.querySelector('button');
      btn.classList.add(poke.tipo);
      btn.setAttribute('aria-label', `${poke.nombre} #${String(i).padStart(3, '0')}`);
      card.querySelector('img').src = poke.img;
      card.querySelector('img').alt = poke.nombre;
      card.querySelector('.name').textContent = poke.nombre;
      card.querySelector('.number').textContent = `#${String(i).padStart(3, '0')}`;
      card.querySelector('.hp').textContent = `HP ${poke.hp}`;
      if (i === 151) card.querySelector('.stars').style.display = '';
      grid.appendChild(card);
    } else {
      const card = lockedTemplate.content.cloneNode(true);
      card.querySelector('.number').textContent = `#${String(i).padStart(3, '0')}`;
      card.querySelector('button').setAttribute('aria-label', `Pokémon no descubierto #${String(i).padStart(3, '0')}`);
      grid.appendChild(card);
    }
  }
  // Actualiza progreso
  progressText.textContent = `${desbloqueadosCount}/150 Pokémon`;
  progressBar.style.width = `${(desbloqueadosCount / 150) * 100}%`;
}

renderGrid();