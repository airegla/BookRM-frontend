// frontend/src/ui/DebugTag.jsx
// archivo: frontend/src/ui/DebugTag.jsx
// descripción: marca de agua con el nombre del archivo del componente que lo importa.
//              Renderiza solo si DEBUG_MODE=true en el .env.

const DEBUG =
  (import.meta.env?.VITE_DEBUG_MODE ?? import.meta.env?.DEBUG_MODE) === "true";

export default function DebugTag({ name }) {
  if (!DEBUG) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        zIndex: 9999,
        padding: "2px 8px",
        fontSize: 11,
        fontFamily: "monospace",
        color: "#fff",
        background: "rgba(0, 0, 0, 0.55)",
        pointerEvents: "none",
        borderBottomLeftRadius: 6,
      }}
    >
      {name}
    </div>
  );
}
