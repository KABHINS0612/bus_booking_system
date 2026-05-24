const API_BASE = '/api'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  if (response.status === 204) {
    return null
  }

  const data = await response.json().catch(() => null)
  if (!response.ok) {
    const message = data?.error || `Request failed (${response.status})`
    throw new Error(message)
  }
  return data
}

export const authApi = {
  register: (body) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  logout: () => request('/auth/logout', { method: 'POST' }),
  me: () => request('/auth/me'),
}

export const dataApi = {
  vehicles: () => request('/vehicles'),
  drivers: () => request('/drivers'),
}

export const tripApi = {
  list: () => request('/trips'),
  book: (body) =>
    request('/trips/book', { method: 'POST', body: JSON.stringify(body) }),
  cancel: (tripId) => request(`/trips/${tripId}/cancel`, { method: 'POST' }),
}

export const adminApi = {
  addVehicle: (body) =>
    request('/admin/vehicles', { method: 'POST', body: JSON.stringify(body) }),
  deleteVehicle: (id) => request(`/admin/vehicles/${id}`, { method: 'DELETE' }),
  addDriver: (body) =>
    request('/admin/drivers', { method: 'POST', body: JSON.stringify(body) }),
  deleteDriver: (id) => request(`/admin/drivers/${id}`, { method: 'DELETE' }),
  cancelTrip: (id) => request(`/admin/trips/${id}/cancel`, { method: 'POST' }),
}
