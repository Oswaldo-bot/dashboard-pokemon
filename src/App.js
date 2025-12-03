// src/App.js
import React, { useEffect, useState, useRef } from "react";
import { getAllPokemons, getPokemon,  getPaginatedPokemons  } from "./api";
import "./App.css";


function Tooltip({ x, y, children, visible }) {
  if (!visible) return null;
  return (
    <div className="tooltip" style={{ left: x + 12, top: y + 12 }}>
      {children}
    </div>
  );
}

function PokemonCard({ pokemon, onClick, onHover }) {
  return (
    <div
      className="card"
      onClick={() => onClick(pokemon)}
      onMouseEnter={(e) => onHover(e, pokemon)}
      onMouseMove={(e) => onHover(e, pokemon)}
      onMouseLeave={(e) => onHover(null, null)}
    >
      <div className="card-img">
        <img
          src={pokemon.image}
          alt={pokemon.name}
          onError={(e) => {
            e.target.src =
              "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png";
          }}
        />
      </div>
      <div className="card-body">
        <div className="poke-id">#{String(pokemon.id).padStart(3, "0")}</div>
        <div className="poke-name">{pokemon.name}</div>
      </div>
    </div>
  );
}

export default function App() {
  const [list, setList] = useState([]);
  const [selected, setSelected] = useState(null);
  const detailsCache = useRef(new Map());
  const hoverTimer = useRef(null);
  const [page, setPage] = useState(1);
const limit = 30; // Puedes cambiarlo


  // Tooltip state
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    content: null
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      const all = await getAllPokemons(); // carga nombres + id + image
      if (!mounted) return;
      setList(all);
    })();
    return () => (mounted = false);
  }, []);

  useEffect(() => {
  let mounted = true;

  (async () => {
    const pageData = await getPaginatedPokemons(page, limit);
    if (!mounted) return;

    setList(pageData);
  })();

  return () => (mounted = false);
}, [page]);


  const handleClick = async (pokemon) => {
    // ver si está en cache
    if (detailsCache.current.has(pokemon.name)) {
      setSelected(detailsCache.current.get(pokemon.name));
      return;
    }
    const data = await getPokemon(pokemon.name);
    detailsCache.current.set(pokemon.name, data);
    setSelected(data);
  };

  const handleHover = (e, pokemon) => {
    // cancelar timer
    if (!e || !pokemon) {
      setTooltip((t) => ({ ...t, visible: false }));
      return;
    }
    const x = e.clientX;
    const y = e.clientY;

    clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(async () => {
      let info = detailsCache.current.get(pokemon.name);
      if (!info) {
        try {
          info = await getPokemon(pokemon.name);
          detailsCache.current.set(pokemon.name, info);
        } catch (err) {
          info = null;
        }
      }
      if (info) {
        setTooltip({
          visible: true,
          x,
          y,
          content: (
            <div className="tooltip-inner">
              <strong>
                #{String(info.id).padStart(3, "0")} {info.name}
              </strong>
              <div className="types">
                {info.types.map((t) => (
                  <span key={t} className={"type type-" + t}>
                    {t}
                  </span>
                ))}
              </div>
              <div className="stat-row">
                {info.stats.slice(0, 3).map((s) => (
                  <div key={s.name}>
                    {s.name}: {s.value}
                  </div>
                ))}
              </div>
            </div>
          )
        });
      }
    }, 180);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Pokédex</h1>
      </header>

      <main className="main">
        {/* Sidebar */}
        <aside className="sidebar">
          <input
            placeholder="Buscar Pokémon..."
            className="search"
            onChange={(e) => {
              const q = e.target.value.toLowerCase();
              if (!q) {
                setList((l) => l.slice());
              } else {
                setList((prev) => prev.filter((p) => p.name.includes(q)));
              }
            }}
          />

          <div className="list-scroll">
            {list.map((p) => (
              <div
                key={p.name}
                className="list-item"
                onClick={() => handleClick(p)}
              >
                <img src={p.image} alt={p.name} className="list-thumb" />
                <span>{p.name}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* Grid */}
        <section className="content">
          <div className="grid">
            {list.map((p) => (
              <PokemonCard
                key={p.name}
                pokemon={p}
                onClick={handleClick}
                onHover={handleHover}
              />
            ))}
          </div>
        </section>

        {/* Detail Panel */}
        <section className="detail">
          {selected ? (
            <div className="detail-card">
              <div className="detail-top">
                <img
                  className="detail-img"
                  src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${selected.id}.png`}
                  alt={selected.name}
                />
                <div>
                  <h2>
                    {selected.name}{" "}
                    <span className="detail-id">#{selected.id}</span>
                  </h2>
                  <div className="types">
                    {selected.types.map((t) => (
                      <span key={t} className={"type type-" + t}>
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="detail-body">
                <h3>Stats</h3>
                <ul className="stats-list">
                  {selected.stats.map((s) => (
                    <li key={s.name}>
                      <strong>{s.name}</strong>: {s.value}
                    </li>
                  ))}
                </ul>

                <h3>Info</h3>
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
            </div>
          ) : (
            <div className="empty">Selecciona un Pokémon para ver detalles</div>
          )}
        </section>
      </main>

      <Tooltip x={tooltip.x} y={tooltip.y} visible={tooltip.visible}>
        {tooltip.content}
      </Tooltip>
    </div>
  );
}
