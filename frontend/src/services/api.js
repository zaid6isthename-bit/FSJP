const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const res = await fetch(url, config);
    const json = await res.json();
    return json;
  } catch (err) {
    console.error(`API Error on ${url}:`, err);
    return {
      success: false,
      message: err.message || 'Network error connecting to JVM VISION server',
      errorCode: 'NETWORK_ERROR',
    };
  }
}

export const api = {
  validateCode: (code) =>
    request('/execution/validate', {
      method: 'POST',
      body: JSON.stringify({ code }),
    }),

  runCode: (code, title = 'Untitled Program') =>
    request('/execution/run', {
      method: 'POST',
      body: JSON.stringify({ code, title }),
    }),

  getSessionTrace: (sessionId) =>
    request(`/execution/${sessionId}`),

  getExamples: () =>
    request('/examples'),

  getExampleById: (id) =>
    request(`/examples/${id}`),

  getSessions: () =>
    request('/sessions'),

  deleteSession: (sessionId) =>
    request(`/sessions/${sessionId}`, {
      method: 'DELETE',
    }),
};
