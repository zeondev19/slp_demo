const API_BASE = import.meta.env.VITE_API_URL || '';

async function request(path, options = {}) {
  const token = localStorage.getItem('slp_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  let fullUrl;
  if (API_BASE) {
    const base = API_BASE.replace(/\/+$/, '');
    const cleanPath = path.startsWith('/api') && base.endsWith('/api') ? path.slice(4) : path;
    fullUrl = `${base}${cleanPath.startsWith('/') ? '' : '/'}${cleanPath}`;
  } else {
    fullUrl = path;
  }

  const res = await fetch(fullUrl, { ...options, headers });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: `HTTP ${res.status}: Failed to fetch from database.` }));
    throw new Error(err.error || `HTTP ${res.status}: Database request failed.`);
  }

  return res.json();
}

export const api = {
  // Auth
  login: (email, password) =>
    request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  register: (email, password, displayName) =>
    request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, display_name: displayName }),
    }),

  // Lessons
  getLessons: (params) => {
    const query = new URLSearchParams();
    Object.entries(params || {}).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        query.append(k, v);
      }
    });
    return request(`/api/lessons?${query.toString()}`);
  },
  getLesson: (id) => request(`/api/lessons/${id}`),

  // Curriculums
  getCurriculums: () => request('/api/curriculums'),
  getCurriculum: (id) => request(`/api/curriculums/${id}`),

  // Dashboard
  getDashboard: () => request('/api/dashboard'),

  // Playlists
  getPlaylists: () => request('/api/playlists'),
  getPlaylist: (id) => request(`/api/playlists/${id}`),
  createPlaylist: (data) =>
    request('/api/playlists', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updatePlaylist: (id, data) =>
    request(`/api/playlists/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deletePlaylist: (id) =>
    request(`/api/playlists/${id}`, { method: 'DELETE' }),
  addToPlaylist: (playlistId, lessonId) =>
    request(`/api/playlists/${playlistId}/items`, {
      method: 'POST',
      body: JSON.stringify({ lesson_id: lessonId }),
    }),
  removeFromPlaylist: (playlistId, itemId) =>
    request(`/api/playlists/${playlistId}/items?itemId=${itemId}`, {
      method: 'DELETE',
    }),

  // Favorites
  getFavorites: () => request('/api/favorites'),
  toggleFavorite: (lessonId) =>
    request('/api/favorites', {
      method: 'POST',
      body: JSON.stringify({ lesson_id: lessonId }),
    }),

  // Progress
  updateProgress: (lessonId, curriculumId) =>
    request('/api/progress', {
      method: 'POST',
      body: JSON.stringify({ lesson_id: lessonId, curriculum_id: curriculumId }),
    }),

  // Saved Filters
  saveFilter: (name, filters) =>
    request('/api/filters/save', {
      method: 'POST',
      body: JSON.stringify({ name, filters }),
    }),
  getSavedFilters: () => request('/api/filters/saved'),
};
