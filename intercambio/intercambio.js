const miColeccionGrid = document.getElementById('mi-coleccion-grid');
const tuOfertaDisplay = document.getElementById('mi-oferta-display');
const oponenteOfertaDisplay = document.getElementById('oponente-oferta-display');
const intercambiarBtn = document.getElementById('intercambiar-btn');
const statusText = document.getElementById('mensaje-status');

let miOferta = null;
let ofertaOponente = null;
let canalIntercambio;

function conectarAIntercambio() {
  const ably = new Ably.Realtime('9ZqOdA.P911zw:2Low37q6Qn4hI6FRXm6PkzQMIMviJLE5c5peCo0raDY');
  canalIntercambio = ably.channels.get('canal-pokemon-trade');

  statusText.textContent = 'Conectado. Esperando oferta del oponente...';

  canalIntercambio.subscribe('oferta-carta', (mensaje) => {
    const dataOponente = mensaje.data;
    ofertaOponente = dataOponente;

    oponenteOfertaDisplay.innerHTML = `
      <div class="card ${dataOponente.tipo}">
        <img src="${dataOponente.img}" alt="${dataOponente.nombre}">
        <span class="name">${dataOponente.nombre}</span>
        <span class="hp">HP ${dataOponente.hp}</span>
      </div>
    `;
    
    statusText.textContent = 'El oponente ha hecho una oferta';
    verificarEstadoIntercambio();
  });
}

async function renderizarMiColeccion() {
  const coleccion = JSON.parse(localStorage.getItem('coleccionPokemon')) || [];

  if (coleccion.length === 0) {
    miColeccionGrid.innerHTML = '<p>No tienes cartas para intercambiar.</p>';
    return;
  }

  miColeccionGrid.innerHTML = '';

  for (const id of coleccion) {
    const pokeData = await getPokemonData(id);
    if (!pokeData) continue;

    const miniCard = document.createElement('button');
    miniCard.classList.add('mini-card');
    miniCard.dataset.id = id;

    const img = document.createElement('img');
    img.src = pokeData.img;
    img.alt = pokeData.nombre;

    const name = document.createElement('span');
    name.classList.add('name');
    name.textContent = pokeData.nombre;

    miniCard.appendChild(img);
    miniCard.appendChild(name);

    miniCard.addEventListener('click', () => seleccionarCarta(pokeData, miniCard));
    
    miColeccionGrid.appendChild(miniCard);
  }
}

function seleccionarCarta(pokeData, cardElement) {
  miOferta = pokeData;
  
  document.querySelectorAll('.mini-card').forEach(card => card.classList.remove('selected'));
  cardElement.classList.add('selected');
  
  tuOfertaDisplay.innerHTML = `
    <div class="card ${pokeData.tipo}">
      <img src="${pokeData.img}" alt="${pokeData.nombre}">
      <span class="name">${pokeData.nombre}</span>
      <span class="hp">HP ${pokeData.hp}</span>
    </div>
  `;
  
  canalIntercambio.publish('oferta-carta', miOferta);
  statusText.textContent = '¡Oferta enviada! Esperando al oponente...';
  
  verificarEstadoIntercambio();
}

function verificarEstadoIntercambio() {
  if (miOferta && ofertaOponente) {
    intercambiarBtn.disabled = false;
    statusText.textContent = 'Ambios usuarios hecho su oferta. Presiona Intercambiar para confirmar este intercambio.';
  }
}

function realizarIntercambio() {
  if (!miOferta || !ofertaOponente) {
    alert("Ambos jugadores deben ofrecer una carta.");
    return;
  }

  let coleccion = JSON.parse(localStorage.getItem('coleccionPokemon')) || [];
  coleccion = coleccion.filter(id => id !== miOferta.id);
  coleccion.push(ofertaOponente.id);
  localStorage.setItem('coleccionPokemon', JSON.stringify(coleccion));

  alert(`¡Intercambio exitoso! Has recibido a ${ofertaOponente.nombre}.`);
  window.location.reload();
}

intercambiarBtn.addEventListener('click', realizarIntercambio);

async function getPokemonData(id) {
  try {
    const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (!res.ok) return null;
    const data = await res.json();
    return {
      id: data.id,
      nombre: capitalize(data.name),
      img: data.sprites.front_default,
      tipo: data.types[0].type.name,
      hp: data.stats.find(stat => stat.stat.name === "hp")?.base_stat || "??"
    };
  } catch (error) {
    console.error("Error al obtener datos para el ID:", id, error);
    return null;
  }
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

renderizarMiColeccion();
conectarAIntercambio();