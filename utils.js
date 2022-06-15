const getHabilityProbability = (hability) => {
  return (hability * 0.4) / 100;
};

const getCharacterProbability = (character) => {
  return (character * 0.6) / 100;
};

const result =
  getCharacterProbability(character) + getHabilityProbability(hability);

const fetchPlayersByTeam = (id) => {
  fetch("jugadores.json")
    .then((response) => response.json())
    .then((jugadores) => {
      return jugadores.filter((jugador) => {
        const { id_equipo } = jugador;
        return id_equipo === id;
      });
    });
};

export { fetchPlayersByTeam };
