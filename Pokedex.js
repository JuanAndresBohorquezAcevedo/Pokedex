const respuesta = fetch("https://pokeapi.co");

console.log(respuesta);

async function obtenerPokemon() {
    const respuesta = await fetch("https://pokeapi.co/api/v2/pokemon/krokorok");

    if (!respuesta.ok) {
        console.log("Algo salió mal. Código:", respuesta.status);
        return;
    }

    const datos = await respuesta.json();

    console.log("Nombre:", datos.name);

    console.log("Tipo:");

    for (let tipos of datos.types) {
        console.log("  *" +tipos.type.name);
    }

    console.log("Stats:");

    for (let stat of datos.stats) {
        console.log("  *" + stat.stat.name + ":", stat.base_stat);
    }

    console.log("Habilidades:");

    for (const habilidad of datos.abilities) {
        console.log("  *" + habilidad.ability.name);
    }

}

obtenerPokemon();
