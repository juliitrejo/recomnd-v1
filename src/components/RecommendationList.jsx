export default function RecommendationList({ items, onToggleStatus, onDelete }) {
  if (items.length === 0) {
    return (
      <div className="card empty-state">
        <p>Todavía no guardaste ninguna recomendación. ¡Agregá la primera arriba!</p>
      </div>
    );
  }

  return (
    <div className="list-container">
      {items.map((item) => (
        <article
          key={item.id}
          className={`card item-card ${item.status === 'Finalizado' ? 'is-done' : ''}`}
        >
          <div className="item-info">
            <div className="item-badges">
              <span className="badge category">{item.category}</span>
              <span className={`badge status ${item.status.toLowerCase()}`}>
                {item.status}
              </span>
            </div>
            <h3>{item.title}</h3>
            <p className="rec-by">
              Recomendado por: <strong>{item.recommendedBy}</strong>
            </p>
            {item.reason && <p className="rec-reason">“{item.reason}”</p>}
          </div>

          <div className="item-actions">
            <button
              type="button"
              className="btn-secondary"
              onClick={() => onToggleStatus(item.id, item.status)}
            >
              {item.status === 'Pendiente' ? 'Marcar Finalizado' : 'Volver a Pendiente'}
            </button>
            <button
              type="button"
              className="btn-danger"
              onClick={() => onDelete(item.id)}
            >
              Eliminar
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}