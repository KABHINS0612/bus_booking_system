const STORAGE_KEY = 'busbooking_system_data';

const defaultVehicles = [
  { id: 1, name: 'Toyota Innova', model: '2022', capacity: 7 },
  { id: 2, name: 'Honda City', model: '2021', capacity: 5 },
  { id: 3, name: 'Maruti Swift', model: '2023', capacity: 5 },
];

const defaultDrivers = [
  { id: 1, name: 'John Doe', experience: 5 },
  { id: 2, name: 'Jane Smith', experience: 3 },
  { id: 3, name: 'Michael Johnson', experience: 8 },
];

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createInitialState();
    const parsed = JSON.parse(raw);
    return {
      ...createInitialState(),
      ...parsed,
      vehicles: parsed.vehicles?.length ? parsed.vehicles : defaultVehicles,
      drivers: parsed.drivers?.length ? parsed.drivers : defaultDrivers,
    };
  } catch {
    return createInitialState();
  }
}

export function saveState(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function createInitialState() {
  return {
    vehicles: [...defaultVehicles],
    drivers: [...defaultDrivers],
    trips: [],
    users: [],
    nextIds: { user: 1, trip: 1, vehicle: 4, driver: 4 },
    session: null,
  };
}

export function findOrCreateUser(state, username, contact) {
  let user = state.users.find(
    (u) => u.username === username && u.contact === contact
  );
  if (!user) {
    user = { id: state.nextIds.user++, username, contact };
    state.users.push(user);
  }
  return user;
}
