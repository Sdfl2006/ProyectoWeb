Aplicación web para coleccionar e intercambiar cartas de Pokemon

Descripción:
Para nuestro proyecto final para la materia Programación Orientada a la Web, desarrollamos esta app funcional que permite a los usuarios coleccionar cartas digitales de 150 Pokémon diferentes de manera interactiva. Mediante la aplicación recreamos la experiencia de abrir un sobre de cartas, permitiendo que el usuario pueda armar su colección. Adicionalmente, el usuario puede participar en intercambios de una carta con otro usuario. 

Características Principales:
- Colección: Muestra una cuadrícula con las 150 Pokémon, en la cúal las cartas que aún no forman parte de la colección del usuario se encuentran bloqueadas (no muestran la información del pokemón), y las que son parte de la colección se encuentran desbloqueadas (muestran información sobre el pokémon como nombre, imagen, etc).
- Información de cartas desbloqueadas: Al hacer clic en una carta desbloqueada, se abre una ventana con información detallada del Pokémon.
- Filtros y Búsqueda: La colección se puede filtrar por tipo de Pokémon y se puede buscar un pokemon específico por nombre.
- Apertura de Sobres: Existe una interfaz en la cual el usuario puede abrir sobres que contienen 6 cartas aleatorias, las cuales son agregadas a su colección si no pertenecían anteriormente.
- Datos: La colección de cartas de cada usuario se guarda localmente en su navegador usando localStorage, de esta manera sus datos se conservan entre sesiones.
Intercambio en Tiempo Real: Existe una interfaz que permite a dos usuarios conectarse e intercambiar cartas en tiempo real, utilizando un WebSocket para la sincronización.

Archivos:
├── vista-principal/
│   ├── index.html      (Página principal que muestra la colección de cartas)
│   ├── styles.css
│   └── main.js
│
├── abrir-un-sobre/
│   ├── sobre.html      (Página para la funcionalidad de abrir sobres)
│   ├── sobre.css
│   └── sobre.js
│
└── intercambio/
    ├── intercambio.html      (Página para la funcionalidad de intercambio en tiempo real)
    ├── intercambio.css
    └── intercambio.js
    
El proyecto está organizado en tres carpetas, cada una representa una funcionalidad principal de la aplicación.

Ejecución del Proyecto:
