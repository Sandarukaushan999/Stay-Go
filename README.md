# Stay-Go

Full-stack ride-sharing baseline with rider, passenger, and admin roles.

## Stack
- Frontend: React + React Router + Zustand + React Leaflet + Axios + Socket.IO client
- Backend: Express + MongoDB (Mongoose) + JWT + Socket.IO
- Maps: OpenStreetMap tiles, Nominatim (via backend proxy), OSRM route service

## Run Backend
```bash
cd backend
npm install
npm start
```

Backend runs on `http://localhost:5000`.

If using MongoDB Atlas, make sure your current IP is allowed in Atlas Network Access.

## Run Frontend
```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173` and proxies `/api` and `/socket.io` to backend.

## Seeded Login Credentials
These are auto-seeded on backend startup when MongoDB is connected:

- Admin: `admin@gmail.com` / `admin123`
- Rider: `rider@staygo.local` / `Rider@12345`
- Passenger: `passenger@staygo.local` / `Passenger@12345`

## Core Implemented Flows
- Rider/passenger registration + login
- Role-protected dashboards (rider/passenger/admin)
- Nearby rider search + ride request
- Rider accept/start/complete lifecycle
- Active trip live tracking + SOS
- Incident reporting
- Admin monitoring, rider approval, user block/unblock
- Overdue trip and suspicious stop safety monitoring
