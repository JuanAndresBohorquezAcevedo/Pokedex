const prompt = require('prompt-sync')();

async function buscarPokemon(nombre) {

    const respuesta = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${nombre.toLowerCase()}`
    );

    if (!respuesta.ok) {
        console.log("Algo salió mal. Código:", respuesta.status);
        return null;
    }

    return await respuesta.json();
}

function mostrarFicha(datos) {

    if (!datos) {
        console.log("No hay datos.");
        return;
    }

    console.log("Nombre:", datos.name.toUpperCase());
    console.log("Número de Pokédex:", datos.id);

    const tipos = [];

    for (const tipo of datos.types) {
        tipos.push(tipo.type.name);
    }

    console.log("Tipos:", tipos.join(" / "));

    console.log("Altura:", datos.height * 10, "cm");
    console.log("Peso:", datos.weight / 10, "kg");

    console.log("Stats:");

    for (const stat of datos.stats) {
        console.log(stat.stat.name, ":", stat.base_stat);
    }

    console.log("Habilidades:");

    for (const habilidad of datos.abilities) {

        if (habilidad.is_hidden) {
            console.log("     *", habilidad.ability.name, "(oculta)");
        } else {
            console.log("     *", habilidad.ability.name);
        }

    }
}

function obtenerStat(datos, nombreStat) {

    for (const stat of datos.stats) {

        if (stat.stat.name === nombreStat) {
            return stat.base_stat;
        }

    }

    return null;
}

async function compararPokemon(nombre1, nombre2, stat) {

    const pokemon1 = await buscarPokemon(nombre1);
    const pokemon2 = await buscarPokemon(nombre2);

    if (pokemon1 === null || pokemon2 === null) {
        console.log("No se puede realizar la comparación.");
        return;
    }

    const valor1 = obtenerStat(pokemon1, stat);
    const valor2 = obtenerStat(pokemon2, stat);

    if (valor1 === null || valor2 === null) {
        console.log("La stat indicada no existe.");
        console.log(
            "Stats válidas: hp, attack, defense, special-attack, special-defense, speed"
        );
        return;
    }

    console.log("\nComparación:", pokemon1.name, "vs", pokemon2.name);
    console.log("Stat:", stat);
    console.log(pokemon1.name, ":", valor1);
    console.log(pokemon2.name, ":", valor2);

    if (valor1 > valor2) {
        console.log("Gana", pokemon1.name);
    } else if (valor2 > valor1) {
        console.log("Gana", pokemon2.name);
    } else {
        console.log("Empate.");
    }
}

// PARTE 5
async function pokemonMasFuerte(listaNombres, stat) {

    let mejorNombre = null;
    let mejorValor = -1;

    for (const nombre of listaNombres) {

        const pokemon = await buscarPokemon(nombre);

        if (pokemon === null) {
            continue;
        }

        const valor = obtenerStat(pokemon, stat);

        if (valor === null) {
            continue;
        }

        if (valor > mejorValor) {
            mejorValor = valor;
            mejorNombre = pokemon.name;
        }
    }

    if (mejorNombre === null) {
        console.log("No se encontró ningún Pokémon válido.");
        return null;
    }

    console.log(
        `El Pokémon más fuerte en ${stat} es ${mejorNombre} con ${mejorValor} puntos.`
    );

    return mejorNombre;
}

async function ejecutar() {

    const listaNombres = [];

    console.log("Ingrese los 6 Pokémon de su equipo:");

    for (let i = 0; i < 6; i++) {

        const nombre = prompt(`Pokémon ${i + 1}: `).toLowerCase();

        if (nombre === "") {
            console.log("Debes ingresar un nombre válido.");
            i--;
            continue;
        }

        listaNombres.push(nombre);
    }

    console.log("\n--- ATAQUE ---");

    const ganadorAttack = await pokemonMasFuerte(
        listaNombres,
        "attack"
    );

    console.log("\n--- DEFENSA ---");

    await pokemonMasFuerte(
        listaNombres,
        "defense"
    );

    if (ganadorAttack !== null) {

        const pokemonGanador = await buscarPokemon(ganadorAttack);

        console.log("\n--- FICHA DEL GANADOR EN ATTACK ---");

        mostrarFicha(pokemonGanador);
    }
}

ejecutar();