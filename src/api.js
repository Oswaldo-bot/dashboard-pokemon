// src/api.js
const BASE = "https://pokeapi.co/api/v2";

export async function getAllPokemons(limit = 10000) {
  // devuelve [{ name, url, id, image }]
  const res = await fetch(`${BASE}/pokemon?limit=${limit}`);
  const data = await res.json();
  // parsear id desde la url y crear image oficial
  return data.results.map((p) => {
    const parts = p.url.split("/").filter(Boolean);
    const id = parts[parts.length - 1];
    const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
    return { name: p.name, url: p.url, id, image };
  });
}

export async function getPokemon(nameOrId) {
  const res = await fetch(`${BASE}/pokemon/${nameOrId}`);
  if (!res.ok) throw new Error("No se pudo cargar el Pokémon");
  const data = await res.json();
  // formatear datos que usaremos
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
