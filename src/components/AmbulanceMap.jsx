import { Fragment } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { SEV_DOT_BG } from '../lib/severity';

function divIcon(html, size = 26) {
  return L.divIcon({ html, className: '', iconSize: [size, size], iconAnchor: [size / 2, size / 2] });
}

function hospitalIcon() {
  return divIcon(
    `<div class="w-[26px] h-[26px] rounded-md bg-[#16212c] border-2 border-[#2dd4bf] flex items-center justify-center text-[#2dd4bf] font-extrabold text-[13px] font-sans">H</div>`
  );
}

function ambulanceIcon(status) {
  const isAvailable = status === 'available';
  const ring = isAvailable ? 'shadow-[0_0_0_2px_rgba(45,212,191,0.35)]' : 'shadow-[0_0_0_2px_rgba(249,115,22,0.35)]';
  const color = isAvailable ? 'bg-[#2dd4bf]' : 'bg-[#f97316]';
  const pulse = isAvailable ? '' : 'animate-amb-pulse';
  return divIcon(
    `<div class="w-5 h-5 rounded-full border-2 border-[#0f1720] ${color} ${ring} ${pulse}"></div>`,
    20
  );
}

function callIcon(severity) {
  const colorClass = SEV_DOT_BG[severity] || SEV_DOT_BG[5];
  return divIcon(`<div class="w-4 h-4 rounded-full border-2 border-[#0f1720] ${colorClass}"></div>`, 16);
}

function pendingIcon() {
  return divIcon(
    `<div class="w-4 h-4 rounded-full bg-transparent border-2 border-dashed border-slate-100"></div>`,
    16
  );
}

function ClickCapture({ onPick }) {
  useMapEvents({
    click(e) {
      onPick({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

export default function AmbulanceMap({ hospital, ambulances, callsQueue, onPickLocation, pendingLocation }) {
  const center = [hospital.lat, hospital.lng];

  return (
    <div className="h-[420px] rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
      <MapContainer center={center} zoom={12} className="h-full w-full">
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickCapture onPick={onPickLocation} />

        <Marker position={center} icon={hospitalIcon()}>
          <Popup>{hospital.name}</Popup>
        </Marker>

        {ambulances.map((amb) => (
          <Fragment key={amb.id}>
            <Marker position={[amb.lat, amb.lng]} icon={ambulanceIcon(amb.status)}>
              <Popup>
                {amb.name} — {amb.status}
                {amb.trip && (
                  <>
                    <br />
                    En route to {amb.trip.call.callerName} (ETA {amb.trip.etaMin.toFixed(1)}m)
                  </>
                )}
              </Popup>
            </Marker>
            {amb.trip && (
              <Polyline
                positions={[
                  [amb.lat, amb.lng],
                  [amb.trip.call.lat, amb.trip.call.lng],
                ]}
                pathOptions={{ color: '#f97316', weight: 2, dashArray: '4 6' }}
              />
            )}
          </Fragment>
        ))}

        {callsQueue.map((call) => (
          <Marker key={call.id} position={[call.lat, call.lng]} icon={callIcon(call.basePriority)}>
            <Popup>
              {call.callerName} — waiting {call.waitMinutes}m
              <br />
              {call.note}
            </Popup>
          </Marker>
        ))}

        {pendingLocation && (
          <Marker position={[pendingLocation.lat, pendingLocation.lng]} icon={pendingIcon()} />
        )}
      </MapContainer>
    </div>
  );
}
