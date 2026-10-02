const respuesta = fetch("https://pokeapi.co");

console.log(respuesta);

async function obtenerPokemon() {
    const respuesta = await fetch("https://pokeapi.co/api/v2/pokemon");

    if (!respuesta.ok) {
        console.log("Algo salió mal. Código:", respuesta.status);
        return;
    }

    const datos = await respuesta.json();
    console.log("Pokemon actual:", datos);
}

obtenerPokemon();
