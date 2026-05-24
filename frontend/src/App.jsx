import React, { useCallback, useEffect, useState } from 'react'
import { adminApi, authApi, dataApi, tripApi } from './api'

export default function App() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [guestTab, setGuestTab] = useState('user')
  const [guestMode, setGuestMode] = useState('login')
  const [userTab, setUserTab] = useState('book')
  const [adminTab, setAdminTab] = useState('bookings')
  const [vehicles, setVehicles] = useState([])
  const [drivers, setDrivers] = useState([])
  const [trips, setTrips] = useState([])
  const [userForm, setUserForm] = useState({ username: '', contact: '', password: '' })
  const [adminForm, setAdminForm] = useState({ username: '', password: '' })
  const [bookForm, setBookForm] = useState({
    vehicleId: '',
    driverId: '',
    startDate: '',
    endDate: '',
    pickupPoint: '',
    endPoint: '',
  })
  const [vehicleForm, setVehicleForm] = useState({ name: '', model: '', capacity: '' })
  const [driverForm, setDriverForm] = useState({ name: '', experience: '' })

  const view = session?.role === 'ADMIN' ? 'admin' : session ? 'user' : 'guest'

  const loadCatalog = useCallback(async () => {
    const [v, d] = await Promise.all([dataApi.vehicles(), dataApi.drivers()])
    setVehicles(v)
    setDrivers(d)
  }, [])

  const loadTrips = useCallback(async () => {
    const t = await tripApi.list()
    setTrips(t)
  }, [])

  const refreshData = useCallback(async () => {
    await loadCatalog()
    if (session) {
      await loadTrips()
    }
  }, [loadCatalog, loadTrips, session])

  useEffect(() => {
    authApi
      .me()
      .then((user) => setSession(user))
      .catch(() => setSession(null))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!session) return
    refreshData().catch((err) => setError(err.message))
  }, [session, refreshData])

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await authApi.register({
        username: userForm.username.trim(),
        contact: userForm.contact.trim(),
        password: userForm.password,
      })
      const loggedIn = await authApi.login({
        username: userForm.username.trim(),
        password: userForm.password,
      })
      setSession(loggedIn)
      setUserTab('book')
    } catch (err) {
      setError(err.message)
    }
  }

  const handleUserLogin = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const user = await authApi.login({
        username: userForm.username.trim(),
        password: userForm.password,
      })
      if (user.role === 'ADMIN') {
        setError('Use Admin Login for admin accounts')
        await authApi.logout()
        return
      }
      setSession(user)
      setUserTab('book')
    } catch (err) {
      setError(err.message)
    }
  }

  const handleAdminLogin = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const user = await authApi.login({
        username: adminForm.username.trim(),
        password: adminForm.password,
      })
      if (user.role !== 'ADMIN') {
        setError('This account is not an admin')
        await authApi.logout()
        return
      }
      setSession(user)
      setAdminTab('bookings')
    } catch (err) {
      setError(err.message)
    }
  }

  const handleLogout = async () => {
    try {
      await authApi.logout()
    } catch {
      /* ignore */
    }
    setSession(null)
    setTrips([])
    setGuestTab('user')
    setGuestMode('login')
  }

  const handleBookTrip = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await tripApi.book({
        vehicleId: Number(bookForm.vehicleId),
        driverId: Number(bookForm.driverId),
        startDate: bookForm.startDate,
        endDate: bookForm.endDate,
        pickupPoint: bookForm.pickupPoint,
        endPoint: bookForm.endPoint,
      })
      setBookForm({
        vehicleId: '',
        driverId: '',
        startDate: '',
        endDate: '',
        pickupPoint: '',
        endPoint: '',
      })
      await loadTrips()
      setUserTab('history')
    } catch (err) {
      setError(err.message)
    }
  }

  const cancelTrip = async (tripId) => {
    if (!confirm('Cancel this trip?')) return
    setError('')
    try {
      if (view === 'admin') {
        await adminApi.cancelTrip(tripId)
      } else {
        await tripApi.cancel(tripId)
      }
      await loadTrips()
    } catch (err) {
      setError(err.message)
    }
  }

  const addVehicle = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await adminApi.addVehicle({
        name: vehicleForm.name,
        model: vehicleForm.model,
        capacity: Number(vehicleForm.capacity),
      })
      setVehicleForm({ name: '', model: '', capacity: '' })
      await refreshData()
    } catch (err) {
      setError(err.message)
    }
  }

  const addDriver = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await adminApi.addDriver({
        name: driverForm.name,
        experience: Number(driverForm.experience),
      })
      setDriverForm({ name: '', experience: '' })
      await refreshData()
    } catch (err) {
      setError(err.message)
    }
  }

  const deleteVehicle = async (id) => {
    if (!confirm('Delete this vehicle?')) return
    setError('')
    try {
      await adminApi.deleteVehicle(id)
      await refreshData()
    } catch (err) {
      setError(err.message)
    }
  }

  const deleteDriver = async (id) => {
    if (!confirm('Delete this driver?')) return
    setError('')
    try {
      await adminApi.deleteDriver(id)
      await refreshData()
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) {
    return (
      <div className="app-shell">
        <p className="muted" style={{ padding: '2rem' }}>
          Loading...
        </p>
      </div>
    )
  }

  return (
    <div className="app-shell">
      <div className="glow-bg">
        <div className="glow-blob glow-blob-1"></div>
        <div className="glow-blob glow-blob-2"></div>
        <div className="glow-blob glow-blob-3"></div>
      </div>
      <div className="brand">
        <div className="brand-logo" aria-label="Bus logo">🚍</div>
        <div className="brand-title">Bus Booking System</div>
        <span className="brand-url muted">http://localhost:3000</span>
      </div>

      {error && <p className="error-banner">{error}</p>}

      {view === 'guest' && (
        <div className="portal-section">
          <div className="portal-tabs guest-tabs">
            <button
              type="button"
              className={`portal-tab ${guestTab === 'user' ? 'active' : ''}`}
              onClick={() => setGuestTab('user')}
            >
              User
            </button>
            <button
              type="button"
              className={`portal-tab ${guestTab === 'admin' ? 'active' : ''}`}
              onClick={() => setGuestTab('admin')}
            >
              Admin Login
            </button>
          </div>

          {guestTab === 'user' && (
            <div className="card login-card">
              <div className="portal-tabs" style={{ marginBottom: '1rem' }}>
                <button
                  type="button"
                  className={`portal-tab ${guestMode === 'login' ? 'active' : ''}`}
                  onClick={() => setGuestMode('login')}
                >
                  Login
                </button>
                <button
                  type="button"
                  className={`portal-tab ${guestMode === 'register' ? 'active' : ''}`}
                  onClick={() => setGuestMode('register')}
                >
                  Register
                </button>
              </div>
              <h2>{guestMode === 'register' ? 'Create Account' : 'Welcome — Book a Trip'}</h2>
              <form onSubmit={guestMode === 'register' ? handleRegister : handleUserLogin}>
                <div className="form-group">
                  <label htmlFor="username">Username</label>
                  <input
                    className="form-control"
                    id="username"
                    value={userForm.username}
                    onChange={(e) =>
                      setUserForm({ ...userForm, username: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="contact">Contact Number</label>
                  <input
                    className="form-control"
                    id="contact"
                    value={userForm.contact}
                    onChange={(e) =>
                      setUserForm({ ...userForm, contact: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="password">Password</label>
                  <input
                    className="form-control"
                    type="password"
                    id="password"
                    value={userForm.password}
                    onChange={(e) =>
                      setUserForm({ ...userForm, password: e.target.value })
                    }
                    minLength={6}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  {guestMode === 'register' ? 'Register' : 'Login'}
                </button>
              </form>
            </div>
          )}

          {guestTab === 'admin' && (
            <div className="card login-card">
              <h2>Admin Login</h2>
              <form onSubmit={handleAdminLogin}>
                <div className="form-group">
                  <label htmlFor="admin-username">Username</label>
                  <input
                    className="form-control"
                    id="admin-username"
                    value={adminForm.username}
                    onChange={(e) =>
                      setAdminForm({ ...adminForm, username: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="admin-password">Password</label>
                  <input
                    className="form-control"
                    type="password"
                    id="admin-password"
                    value={adminForm.password}
                    onChange={(e) =>
                      setAdminForm({ ...adminForm, password: e.target.value })
                    }
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Login
                </button>
              </form>
              <p className="muted hint">Default: admin / admin123</p>
            </div>
          )}
        </div>
      )}

      {view === 'user' && (
        <div className="portal-section">
          <div className="portal-header">
            <span>Welcome, {session.username}</span>
            <button type="button" className="btn btn-outline" onClick={handleLogout}>
              Logout
            </button>
          </div>
          <div className="portal-tabs">
            <button
              type="button"
              className={`portal-tab ${userTab === 'book' ? 'active' : ''}`}
              onClick={() => setUserTab('book')}
            >
              Book Trip
            </button>
            <button
              type="button"
              className={`portal-tab ${userTab === 'history' ? 'active' : ''}`}
              onClick={() => setUserTab('history')}
            >
              Trip History
            </button>
          </div>

          {userTab === 'book' && (
            <div className="card">
              <h2>Book a New Trip</h2>
              <form onSubmit={handleBookTrip}>
                <div className="form-group">
                  <label htmlFor="vehicle">Select Vehicle</label>
                  <select
                    className="form-control"
                    id="vehicle"
                    value={bookForm.vehicleId}
                    onChange={(e) =>
                      setBookForm({ ...bookForm, vehicleId: e.target.value })
                    }
                    required
                  >
                    <option value="" disabled>
                      Choose a vehicle
                    </option>
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.name} - {v.model} (Capacity: {v.capacity})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="driver">Select Driver</label>
                  <select
                    className="form-control"
                    id="driver"
                    value={bookForm.driverId}
                    onChange={(e) =>
                      setBookForm({ ...bookForm, driverId: e.target.value })
                    }
                    required
                  >
                    <option value="" disabled>
                      Choose a driver
                    </option>
                    {drivers.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name} ({d.experience} years experience)
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="start_date">Start Date</label>
                    <input
                      className="form-control"
                      type="date"
                      id="start_date"
                      value={bookForm.startDate}
                      onChange={(e) =>
                        setBookForm({ ...bookForm, startDate: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="end_date">End Date</label>
                    <input
                      className="form-control"
                      type="date"
                      id="end_date"
                      value={bookForm.endDate}
                      onChange={(e) =>
                        setBookForm({ ...bookForm, endDate: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="pickup_point">Pickup Point</label>
                  <input
                    className="form-control"
                    id="pickup_point"
                    value={bookForm.pickupPoint}
                    onChange={(e) =>
                      setBookForm({ ...bookForm, pickupPoint: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="end_point">End Point</label>
                  <input
                    className="form-control"
                    id="end_point"
                    value={bookForm.endPoint}
                    onChange={(e) =>
                      setBookForm({ ...bookForm, endPoint: e.target.value })
                    }
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Book Trip
                </button>
              </form>
            </div>
          )}

          {userTab === 'history' && (
            <div className="card">
              <h2>Your Trip History</h2>
              {trips.length === 0 ? (
                <p className="muted">No trips booked yet.</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Vehicle</th>
                      <th>Driver</th>
                      <th>Start</th>
                      <th>End</th>
                      <th>Pickup</th>
                      <th>Destination</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trips.map((trip) => (
                      <tr key={trip.id}>
                        <td>{trip.id}</td>
                        <td>{trip.vehicleName}</td>
                        <td>{trip.driverName}</td>
                        <td>{trip.startDate}</td>
                        <td>{trip.endDate}</td>
                        <td>{trip.pickupPoint}</td>
                        <td>{trip.endPoint}</td>
                        <td>
                          <span className={`status-badge status-${trip.status}`}>
                            {trip.status}
                          </span>
                        </td>
                        <td>
                          {trip.status !== 'cancelled' && (
                            <button
                              type="button"
                              className="btn btn-danger"
                              onClick={() => cancelTrip(trip.id)}
                            >
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      )}

      {view === 'admin' && (
        <div className="portal-section admin-portal">
          <div className="portal-header">
            <span>Admin Dashboard</span>
            <button type="button" className="btn btn-outline" onClick={handleLogout}>
              Logout
            </button>
          </div>
          <ul className="tab-links">
            {['bookings', 'vehicles', 'drivers'].map((tab) => (
              <li key={tab}>
                <button
                  type="button"
                  className={`tab-link portal-tab ${adminTab === tab ? 'active' : ''}`}
                  onClick={() => setAdminTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              </li>
            ))}
          </ul>

          {adminTab === 'bookings' && (
            <div className="tab-content active card">
              <h2>All Bookings</h2>
              {trips.length === 0 ? (
                <p className="muted">No bookings found.</p>
              ) : (
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>User</th>
                      <th>Contact</th>
                      <th>Vehicle</th>
                      <th>Driver</th>
                      <th>Start</th>
                      <th>End</th>
                      <th>Pickup</th>
                      <th>Destination</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trips.map((trip) => (
                      <tr key={trip.id}>
                        <td>{trip.id}</td>
                        <td>{trip.username}</td>
                        <td>{trip.contact}</td>
                        <td>{trip.vehicleName}</td>
                        <td>{trip.driverName}</td>
                        <td>{trip.startDate}</td>
                        <td>{trip.endDate}</td>
                        <td>{trip.pickupPoint}</td>
                        <td>{trip.endPoint}</td>
                        <td>
                          <span className={`status-badge status-${trip.status}`}>
                            {trip.status}
                          </span>
                        </td>
                        <td>
                          {trip.status !== 'cancelled' && (
                            <button
                              type="button"
                              className="btn btn-danger"
                              onClick={() => cancelTrip(trip.id)}
                            >
                              Cancel
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}

          {adminTab === 'vehicles' && (
            <div className="tab-content active card">
              <h2>Add Vehicle</h2>
              <form className="form-row" onSubmit={addVehicle}>
                <div className="form-group">
                  <label>Name</label>
                  <input
                    className="form-control"
                    value={vehicleForm.name}
                    onChange={(e) =>
                      setVehicleForm({ ...vehicleForm, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Model</label>
                  <input
                    className="form-control"
                    value={vehicleForm.model}
                    onChange={(e) =>
                      setVehicleForm({ ...vehicleForm, model: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Capacity</label>
                  <input
                    className="form-control"
                    type="number"
                    min="1"
                    value={vehicleForm.capacity}
                    onChange={(e) =>
                      setVehicleForm({ ...vehicleForm, capacity: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>&nbsp;</label>
                  <button type="submit" className="btn btn-primary">
                    Add
                  </button>
                </div>
              </form>
              <h3>Vehicle List</h3>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Model</th>
                    <th>Capacity</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map((v) => (
                    <tr key={v.id}>
                      <td>{v.id}</td>
                      <td>{v.name}</td>
                      <td>{v.model}</td>
                      <td>{v.capacity}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => deleteVehicle(v.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {adminTab === 'drivers' && (
            <div className="tab-content active card">
              <h2>Add Driver</h2>
              <form className="form-row" onSubmit={addDriver}>
                <div className="form-group">
                  <label>Name</label>
                  <input
                    className="form-control"
                    value={driverForm.name}
                    onChange={(e) =>
                      setDriverForm({ ...driverForm, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Experience (years)</label>
                  <input
                    className="form-control"
                    type="number"
                    min="0"
                    value={driverForm.experience}
                    onChange={(e) =>
                      setDriverForm({ ...driverForm, experience: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>&nbsp;</label>
                  <button type="submit" className="btn btn-primary">
                    Add
                  </button>
                </div>
              </form>
              <h3>Driver List</h3>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Experience</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {drivers.map((d) => (
                    <tr key={d.id}>
                      <td>{d.id}</td>
                      <td>{d.name}</td>
                      <td>{d.experience}</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => deleteDriver(d.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
