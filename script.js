const loader = document.getElementById("preloader");
window.addEventListener("load", () => {
  loader.style.display = "none";
});

const fetchEquipos = () => {
  return fetch("equipos.json")
    .then((response) => response.json())
    .then((equipos) => {
      return equipos;
    });
};

const fetchJugadores = (idEquipo) => {
  return fetch("jugadores.json")
    .then((response) => response.json())
    .then((jugadores) => {
      return jugadores.filter((jugador) => jugador.id_equipo === idEquipo);
    });
};

const fetchRivales = (idRivales) => {
  return fetch("equipos.json")
    .then((response) => response.json())
    .then((equipos) => {
      return equipos.filter((equipo) => idRivales.includes(equipo.id));
    });
};

const fetchArqueroRival = (idEquipoRival) => {
  return fetch("jugadores.json")
    .then((response) => response.json())
    .then((jugadores) => {
      const arquero = jugadores.filter(
        (jugador) =>
          jugador.position === "GK" && jugador.id_equipo === idEquipoRival
      );
      return arquero[0];
    });
};

const addEquiposEvents = (equipos) => {
  const equiposElementos = document.querySelectorAll(".equipo");
  for (let i = 0; i < equiposElementos.length; i++) {
    const id = equiposElementos[i].getAttribute("id");
    equiposElementos[i].addEventListener("click", () =>
      handleEquipoClick(id, equipos)
    );
  }
};

const addEnfrentamientoEvents = (equipos) => {
  const enfrentamientosElementos = document.querySelectorAll(".enfrentamiento");
  for (let i = 0; i < enfrentamientosElementos.length; i++) {
    const id = enfrentamientosElementos[i].getAttribute("id");
    enfrentamientosElementos[i].addEventListener("click", () =>
      handleEnfrentamientoClick(id, equipos)
    );
  }
};

const addSimuladorEvent = (jugador, arquero) => {
  const equipoElegido = document.getElementById("equipo-elegido");
  const botonSimulador = document.getElementById("simular");
  botonSimulador.addEventListener("click", () =>
    handleSimuladorClick(jugador, arquero)
  );
  equipoElegido.remove();

};

const addJugadorEvents = (jugadores) => {
  const elegirPartido = document.getElementById("elegir-partido");
  const jugadoresElementos = document.querySelectorAll(".jugador");
  for (let i = 0; i < jugadoresElementos.length; i++) {
    const id = jugadoresElementos[i].getAttribute("id");
    jugadoresElementos[i].addEventListener("click", () =>
      handleJugadorClick(id, jugadores)
    );
  }
  elegirPartido.remove();
};

const handleEquipoClick = (id, equipos) => {
  localStorage.setItem("id_equipo", id);
  const grupos = document.getElementById("grupos");
  const textoEleccion = document.getElementById("texto-eleccion");
  grupos.remove();
  textoEleccion.remove();
  getRivalesEquipoSeleccionado(equipos);
};

const handleEnfrentamientoClick = (id, equipos) => {
  localStorage.setItem("id_rival", id);
  const rivales = document.getElementById("rivales");
  rivales.remove();
  getEquipoSeleccionado(equipos);
};

const handleJugadorClick = (id, jugadores) => {
  localStorage.setItem("id_jugador", id);
  const jugadoresElegidos = document.getElementById("jugadores-elegidos");
  jugadoresElegidos.remove();
  getJugadoresSeleccionados(jugadores);
};

const handleSimuladorClick = (jugador, arquero) => {
  getResultado(jugador, arquero);
};

const getResultado = (jugador, arquero) => {
  // Aquí hago toda la lógica para obtener resultado
  const resultado = `<h1> Va a patear ${jugador.name}... <strong class="textoGol">  ¡¡GOOOOL!!  </strong></h1>`;
  renderResultado(resultado);
};

const getRivalesEquipoSeleccionado = async (equipos) => {
  const idEquipoLocalStorage = parseInt(localStorage.getItem("id_equipo"));
  const equipoElegido = equipos.find(
    (equipo) => equipo.id === idEquipoLocalStorage
  );
  const rivales = await fetchRivales(equipoElegido.id_rivales);
  renderPartidosEquipoSeleccionado(equipoElegido, rivales, equipos);
};

const getEquipoSeleccionado = async (equipos) => {
  const idEquipoLocalStorage = parseInt(localStorage.getItem("id_equipo"));
  const equipoElegido = equipos.find(
    (equipo) => equipo.id === idEquipoLocalStorage
  );
  const jugadores = await fetchJugadores(idEquipoLocalStorage);
  renderEquipo(equipoElegido, jugadores);
};

const getJugadoresSeleccionados = async (jugadores) => {
  const idJugadorLocalStorage = parseInt(localStorage.getItem("id_jugador"));
  const idjugadorRivalLocalStorage = parseInt(localStorage.getItem("id_rival"));
  const jugadorSeleccionado = jugadores.find(
    (jugador) => jugador.id_jugador === idJugadorLocalStorage
  );
  const arqueroRival = await fetchArqueroRival(idjugadorRivalLocalStorage);
  renderEnfrentamiento(jugadorSeleccionado, arqueroRival);
};

const renderEquipo = (equipo, jugadores) => {
  let equipoSeleccionado = document.getElementById("equipo-elegido");
  let jugadoresSeleccionados = document.getElementById("jugadores-elegidos");
  equipoSeleccionado.innerHTML = `
  <div class="equipo-escudo-nombre">
  <img class="escudo-equipo-elegido" src='${equipo.escudo}'>
  <h1 class="nombre-equipo-elegido">${equipo.nombre}</h1>
  </div>
  <h2 class="elegi-jugador">Elegí un jugador</h2>
  `;
  jugadores.forEach((jugador) => {
    const { id_jugador, name, hability, character, img_jugador } = jugador;
    jugadoresSeleccionados.innerHTML += `
    <div class="jugador ${id_jugador}" id="${id_jugador}">
      <img src="${img_jugador}" class="imagen-jugador">
      <h4 class="nombre-jugador">${name}</h4>
      <div class="hability">
        <h6>${hability}</h6>
        <h5>Habilidad</h5>
      </div>
      <div class="character">
        <h6>${character}</h6>
        <h5>Penales</h5>
      </div>
    </div>
    `;
  });
  addJugadorEvents(jugadores);
};

const renderGrupos = (equipos) => {
  let elementosGrupos = document.getElementById("grupos");
  equipos.forEach((equipo) => {
    const { id, nombre, escudo } = equipo;
    elementosGrupos.innerHTML += `
        <div class="equipo id${id}" id="${id}">
          <img class="escudo" src=${escudo}>
          <h3>${nombre}</h3>
        </div>
        `;
    addEquiposEvents(equipos);
  });
};

const renderPartidosEquipoSeleccionado = (equipo, rivales, equipos) => {
  let equipoRivales = document.getElementById("rivales");
  let textoElegirPartido = document.getElementById("partidos");
  textoElegirPartido.innerHTML = `
    <h1 class="elegir-partido" id="elegir-partido">Elegí un partido</h1>
  `;
  rivales.forEach((rival) => {
    const { id, nombre, escudo } = rival;
    equipoRivales.innerHTML += `
      <div class="enfrentamiento ${equipo.id}-${id}" id="${id}">
        <img src="${equipo.escudo}">
        <h5>${equipo.nombre}</h5>
        <h6>VS</h6>
        <img src="${escudo}">
        <h5>${nombre}</h5>
      </div>
    `;
    addEnfrentamientoEvents(equipos);
  });
};

const renderEnfrentamiento = (jugador, arquero) => {
  let enfrentamientoPenales = document.getElementById("penales");
  enfrentamientoPenales.innerHTML += `
    <div class="textoSimular">
      <h2>Simula el penal</h2>
    </div>
    <div class="penales">
      <div class="pateador">
        <img src="${jugador.img_jugador}">
        <h4>${jugador.name}</h4>
      </div>
      <h2>VS</h2>
      <div class="arquero">
        <img src="${arquero.img_jugador}">
        <h4>${arquero.name}</h4>
      </div>
      <button class="botonSimular" id="simular">Simular</button>
    </div>
  `;
  addSimuladorEvent(jugador, arquero);
};

const renderResultado = (resultado) => {
  let enfrentamientoPenales = document.getElementById("penales");
  enfrentamientoPenales.innerHTML += `
    <div class="resultado">${resultado}</div>
  `;
};

const App = async () => {
  const equipos = await fetchEquipos();
  renderGrupos(equipos);
};

App();
