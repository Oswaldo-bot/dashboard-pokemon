// src/App.js COMPLETO CON PANEL RESPONSIVE, FONDO DE POKEBOLAS,
// PANEL QUE NO SE SALE, ANIMACIÓN Y BOTÓN X
// SOLO COPIA Y PEGA ✨

import React, { useEffect, useState, useRef } from "react";
import { getAllPokemons, getPokemon, getPaginatedPokemons } from "./api";
import "./App.css";

export default function App() {
  const [list, setList] = useState([]);
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);
  const limit = 30;

  const detailsCache = useRef(new Map());
  const [detailPos, setDetailPos] = useState({ x: 0, y: 0 });

  // Cargar pokémon por página
  useEffect(() => {
    (async () => {
      const pageData = await getPaginatedPokemons(page, limit);
      setList(pageData.pokemons);
    })();
  }, [page]);

  // Al hacer click → panel flotante
  const handleClick = async (pokemon, event) => {
    setDetailPos({
      x: event.clientX,
      y: event.clientY,
    });

    if (detailsCache.current.has(pokemon.name)) {
      setSelected(detailsCache.current.get(pokemon.name));
      return;
    }

    const info = await getPokemon(pokemon.name);
    detailsCache.current.set(pokemon.name, info);
    setSelected(info);
  };

  return (
    <div className="app">

      {/* FONDO DE POKEBOLAS */}
      <div className="poke-background"></div>

      <header className="header">
        <h1>Pokédex</h1>
      </header>

      <main className="main">
        <section className="content">
          <div className="grid">
            {list.map((p) => (
              <div
                key={p.name}
                className="card"
                onClick={(e) => handleClick(p, e)}
              >
                <img className="card-img" src={p.image} alt={p.name} />
                <div className="card-body">
                  <p className="poke-id">#{String(p.id).padStart(3, "0")}</p>
                  <p className="poke-name">{p.name}</p>
                </div>
              </div>
            ))}
          </div>

          {/* PAGINACIÓN */}
          <div className="pagination">
            <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
              ⬅ Anterior
            </button>
            <span>Página {page}</span>
            <button onClick={() => setPage((p) => p + 1)}>Siguiente ➜</button>
          </div>
        </section>
      </main>

      {/* PANEL FLOTANTE */}
      {selected && (
        <div
          className="floating-panel"
          style={{ top: detailPos.y, left: detailPos.x }}
        >
          <button className="close-btn" onClick={() => setSelected(null)}>
            ✕
          </button>

          <div className="panel-bg">
            <img
              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${selected.id}.png`}
              className="detail-img"
              alt={selected.name}
            />
          </div>

          <h2 className="detail-title">
            {selected.name} <span>#{selected.id}</span>
          </h2>

          <div className="types">
            {selected.types.map((t) => (
              <span key={t} className={"type type-" + t}>
                {t}
              </span>
            ))}
          </div>

          <h3>Estadísticas</h3>
          <ul>
            {selected.stats.map((s) => (
              <li key={s.name}>
                <strong>{s.name}:</strong> {s.value}
              </li>
            ))}
          </ul>

          <h3>Información</h3>
          <p>
            Altura: {selected.height} • Peso: {selected.weight}
          </p>

          <h3>Habilidades</h3>
          <div className="abilities">
            {selected.abilities.map((a) => (
              <span key={a} className="ability">
                {a}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
