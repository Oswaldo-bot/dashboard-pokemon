// src/api.js
const BASE = "https://pokeapi.co/api/v2";

/**
 * Obtiene pokemones paginados desde la PokeAPI.
 * Devuelve { pokemons: [{name,id,image}], total, page, limit }
 */
export async function getPaginatedPokemons(page = 1, limit = 30) {
  const offset = (page - 1) * limit;
  const res = await fetch(`${BASE}/pokemon?offset=${offset}&limit=${limit}`);
  if (!res.ok) throw new Error("Error fetching paginated pokemons");
  const data = await res.json();

  const results = data.results.map((p) => {
    const id = p.url.split("/").filter(Boolean).pop();
    const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
    return { name: p.name, id, image };
  });

  return {
    pokemons: results,
    total: data.count,
    page,
    limit,
  };
}

/**
 * Obtiene TODOS los pokemones (sólo nombres + id + imagen).
 * Útil si quieres cargar todo en memoria (PUEDEN SER MUCHOS).
 * Por defecto trae 1118 (cantidad actual), pero úsalo con cuidado.
 */
export async function getAllPokemons(limit = 1118) {
  const res = await fetch(`${BASE}/pokemon?limit=${limit}`);
  if (!res.ok) throw new Error("Error fetching all pokemons");
  const data = await res.json();

  return data.results.map((p) => {
    const id = p.url.split("/").filter(Boolean).pop();
    const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
    return { name: p.name, id, image };
  });
}

/**
 * Obtiene detalles completos de un pokemon por nombre o id.
 * Devuelve objeto con id, name, height, weight, sprites, types, stats, abilities.
 */
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
