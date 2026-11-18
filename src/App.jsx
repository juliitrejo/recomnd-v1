import { useEffect, useState } from 'react';
import { ensureAnonymousUser } from './firebase/config';
import {
  fetchUserRecommendations,
  createRecommendation,
  toggleRecommendationStatus,
  removeRecommendation,
} from './services/recommendationsService';
import RecommendationForm from './components/RecommendationForm';
import RecommendationList from './components/RecommendationList';
import './App.css';

export default function App() {
  const [user, setUser] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  const showMessage = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: '', message: '' }), 4000);
  };

  const loadData = async (uid) => {
    try {
      setLoading(true);
      const data = await fetchUserRecommendations(uid);
      setItems(data);
    } catch (error) {
      console.error(error);
      showMessage('error', 'No se pudieron cargar las recomendaciones desde Firebase.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        const loggedUser = await ensureAnonymousUser();
        setUser(loggedUser);
        await loadData(loggedUser.uid);
      } catch (error) {
        console.error(error);
        showMessage('error', 'Error al conectar con Firebase Authentication.');
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleAdd = async (formData) => {
    try {
      setIsSubmitting(true);
      const activeUser = user || (await ensureAnonymousUser());
      if (!user) setUser(activeUser);

      await createRecommendation(activeUser.uid, formData);
      await loadData(activeUser.uid);
      showMessage('success', 'Recomendación guardada en Firebase.');
      return true;
    } catch (error) {
      console.error(error);
      showMessage('error', `Error de Firebase: ${error.code || error.message}`);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const nextStatus = await toggleRecommendationStatus(id, currentStatus);
      setItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: nextStatus } : item))
      );
      showMessage('success', `Estado actualizado a "${nextStatus}".`);
    } catch (error) {
      console.error(error);
      showMessage('error', 'No se pudo actualizar el estado en Firebase.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await removeRecommendation(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
      showMessage('success', 'Registro eliminado correctamente.');
    } catch (error) {
      console.error(error);
      showMessage('error', 'No se pudo eliminar el registro.');
    }
  };

  return (
    <div className="app-wrapper">
      <header className="app-header">
        <h1>Recomnd <span className="version-tag">v1.0 MVP</span></h1>
        <p>Guardá películas, series y libros recordando quién te los recomendó y por qué.</p>
      </header>

      {feedback.message && (
        <div className={`alert ${feedback.type}`}>{feedback.message}</div>
      )}

      <main className="app-main">
        <RecommendationForm onAdd={handleAdd} isSubmitting={isSubmitting} />

        <section className="list-section">
          <h2>Mis Recomendaciones ({items.length})</h2>
          {loading ? (
            <p className="loading-text">Cargando datos desde Cloud Firestore...</p>
          ) : (
            <RecommendationList
              items={items}
              onToggleStatus={handleToggleStatus}
              onDelete={handleDelete}
            />
          )}
        </section>
      </main>
    </div>
  );
}