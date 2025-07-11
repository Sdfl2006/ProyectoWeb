const botonAbrir = document.getElementById('abrir-sobre-btn');
const contenedorCartas = document.getElementById('cartas-reveladas');
const cardTemplate = document.getElementById('card-unlocked'); 

botonAbrir.addEventListener('click', abrirSobre);

// ABRIR SOBRE
async function abrirSobre() {
  botonAbrir.disabled = true;
  botonAbrir.textContent = 'Abriendo...';

  contenedorCartas.innerHTML = '';

  const idsNuevasCartas = [];
  for (let i = 0; i < 6; i++) {
    const randomId = Math.floor(Math.random() * 150) + 1;
    idsNuevasCartas.push(randomId);
  }

  for (const id of idsNuevasCartas) {
    const pokeData = await getPokemonData(id);
    if (!pokeData) continue;

    const cardElement = cardTemplate.content.cloneNode(true);

    cardElement.querySelector('img').src = pokeData.img;
    cardElement.querySelector('img').alt = pokeData.nombre;
    cardElement.querySelector('.name').textContent = pokeData.nombre;
    cardElement.querySelector('.number').textContent = `#${String(id).padStart(3, '0')}`;

    contenedorCartas.appendChild(cardElement);
  }

  guardarNuevasCartas(idsNuevasCartas);

  botonAbrir.disabled = false;
  botonAbrir.textContent = 'Abrir Otro Sobre';
}

// GUARDAR NUEVAS CARTAS
function guardarNuevasCartas(nuevosIds) {
  let coleccionActual = JSON.parse(localStorage.getItem('coleccionPokemon')) || [];
  nuevosIds.forEach(id => {
    if (!coleccionActual.includes(id)) {
      coleccionActual.push(id);
    }
  });
  localStorage.setItem('coleccionPokemon', JSON.stringify(coleccionActual));
}

// CONSEGUIR INFORMACIÓN DEL POKEMON
async function getPokemonData(id) {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (!res.ok) return null;
    const data = await res.json();
    return {
      nombre: capitalize(data.name),
      img: data.sprites.front_default
    };
  } catch (error) {
    console.error("Error al obtener datos para el ID:", id, error);
    return null;
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}