// IDs desbloqueados de ejemplo
const desbloqueados = JSON.parse(localStorage.getItem('coleccionPokemon')) || [];

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

let filtroTipo = 'Todos';
let textoBusqueda = '';

const searchInput = document.querySelector('.search');
const filterButtons = document.querySelectorAll('.filter');

searchInput.addEventListener('input', (e) => {
  textoBusqueda = e.target.value.trim().toLowerCase();
  actualizarGrid();
});

filterButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    filterButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filtroTipo = btn.textContent;
    actualizarGrid();
  });
});

async function actualizarGrid() {
  grid.innerHTML = '';
  let desbloqueadosCount = 0;
  for (let i = 1; i <= 151; i++) {
    let mostrar = true;
    let poke = null;

    if (desbloqueados.includes(i)) {
      poke = await getPokemonData(i);

      // Filtro por tipo
      if (filtroTipo !== 'Todos' && poke.tipo.toLowerCase() !== filtroTipo.toLowerCase()) {
        mostrar = false;
      }

      // Filtro por búsqueda
      if (textoBusqueda && !poke.nombre.toLowerCase().includes(textoBusqueda)) {
        mostrar = false;
      }

      if (mostrar) {
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
        btn.addEventListener('click', () => mostrarDetallePokemon(poke, i));

        grid.appendChild(card);
      }
    } else {
      if (filtroTipo === 'Todos' && !textoBusqueda) {
        const card = lockedTemplate.content.cloneNode(true);
        card.querySelector('.number').textContent = `#${String(i).padStart(3, '0')}`;
        card.querySelector('button').setAttribute('aria-label', `Pokémon no descubierto #${String(i).padStart(3, '0')}`);
        grid.appendChild(card);
      }
    }
  }
  progressText.textContent = `${desbloqueadosCount}/150 Pokémon`;
  progressBar.style.width = `${(desbloqueadosCount / 150) * 100}%`;
}

function mostrarDetallePokemon(poke, id) {
  document.getElementById('modal-img').src = poke.img;
  document.getElementById('modal-img').alt = poke.nombre;
  document.getElementById('modal-nombre').textContent = `${poke.nombre} (#${String(id).padStart(3, '0')})`;
  document.getElementById('modal-tipo').textContent = `Tipo: ${poke.tipo}`;
  document.getElementById('modal-hp').textContent = `HP: ${poke.hp}`;
  document.getElementById('pokemon-modal').style.display = 'block';
}

document.getElementById('close-modal').onclick = function() {
  document.getElementById('pokemon-modal').style.display = 'none';
};

window.onclick = function(event) {
  const modal = document.getElementById('pokemon-modal');
  if (event.target === modal) {
    modal.style.display = 'none';
  }
};

actualizarGrid();