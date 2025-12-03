// src/api.js
const BASE = "https://pokeapi.co/api/v2";

// 🔹 Esta función carga TODOS los Pokémon (nombres + id + imagen)
export async function getAllPokemons() {
  const res = await fetch(`${BASE}/pokemon?limit=1118`);
  const data = await res.json();

  return data.results.map((p) => {
    const id = p.url.split("/").filter(Boolean).pop();
    const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

    return { name: p.name, id, image };
  });
}

// 🔹 Función paginada (no la estás usando ahora, pero la dejamos)
export async function getPaginatedPokemons(page = 1, limit = 30) {
  const offset = (page - 1) * limit;
  const res = await fetch(`${BASE}/pokemon?offset=${offset}&limit=${limit}`);
  const data = await res.json();

  const results = data.results.map((p) => {
    const id = p.url.split("/").filter(Boolean).pop();
    const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
    return { name: p.name, id, image };
  });

  return {
    pokemons: results,
    total: data.count,
  };
}

// 🔹 Función para leer detalles de un Pokémon
export async function getPokemon(nameOrId) {
  const res = await fetch(`${BASE}/pokemon/${nameOrId}`);
  if (!res.ok) throw new Error("No se pudo cargar el Pokémon");
  const data = await res.json();

  return {
    id: data.id,
    name: data.name,
    height: data.height,
    weight: data.weight,
    sprites: data.sprites,
    types: data.types.map((t) => t.type.name),
    stats: data.stats.map((s) => ({ name: s.stat.name, value: s.base_stat })),
    abilities: data.abilities.map((a) => a.ability.name),
  };
}


