import { useState } from 'react';

export default function RecommendationForm({ onAdd, isSubmitting }) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Película');
  const [recommendedBy, setRecommendedBy] = useState('');
  const [reason, setReason] = useState('');
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !recommendedBy.trim()) {
      setFormError('El título y quién te lo recomendó son obligatorios.');
      return;
    }

    setFormError('');
    const success = await onAdd({ title, category, recommendedBy, reason });
    if (success) {
      setTitle('');
      setCategory('Película');
      setRecommendedBy('');
      setReason('');
    }
  };

  return (
    <form className="card form-card" onSubmit={handleSubmit}>
      <h2>Nueva recomendación</h2>
      {formError && <p className="alert error">{formError}</p>}

      <div className="field">
        <label htmlFor="title">Título *</label>
        <input
          id="title"
          type="text"
          placeholder="Ej: Severance, Duna, El Eternauta..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isSubmitting}
        />
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="category">Categoría</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={isSubmitting}
          >
            <option value="Película">Película</option>
            <option value="Serie">Serie</option>
            <option value="Libro">Libro</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="recommendedBy">¿Quién te lo recomendó? *</label>
          <input
            id="recommendedBy"
            type="text"
            placeholder="Ej: Fran, Profe de diseño, TikTok..."
            value={recommendedBy}
            onChange={(e) => setRecommendedBy(e.target.value)}
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor="reason">¿Por qué te dijo que lo veas/leas?</label>
        <textarea
          id="reason"
          rows="2"
          placeholder="Ej: Me dijo que el giro del final es increíble..."
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          disabled={isSubmitting}
        />
      </div>

      <button type="submit" className="btn-primary" disabled={isSubmitting}>
        {isSubmitting ? 'Guardando...' : 'Guardar recomendación'}
      </button>
    </form>
  );
}