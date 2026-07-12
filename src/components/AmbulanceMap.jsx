import { Fragment } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { SEV_DOT_BG, SEV_BADGE, SEVERITY_LABELS } from '../lib/severity';

function divIcon(html, size = 26) {
  return L.divIcon({ html, className: '', iconSize: [size, size], iconAnchor: [size / 2, size / 2] });
}

function hospitalIcon(name, bedsAvailable) {
  const color = bedsAvailable != null && bedsAvailable > 0 ? '#2dd4bf' : '#ef4444';
  return divIcon(
    `<div class="w-[26px] h-[26px] rounded-md bg-[#16212c] border-2 flex items-center justify-center font-extrabold text-[13px] font-sans" style="border-color:${color};color:${color}">H</div>`
  );
}

function ambulanceIcon(status, type) {
  const isAvailable = status === 'available';
  const ring = isAvailable ? 'shadow-[0_0_0_2px_rgba(45,212,191,0.35)]' : 'shadow-[0_0_0_2px_rgba(249,115,22,0.35)]';
  const color = isAvailable ? 'bg-[#2dd4bf]' : 'bg-[#f97316]';
  const pulse = isAvailable ? '' : 'animate-amb-pulse';
  const letter = type === 'als' ? 'A' : 'B';
  return divIcon(
    `<div class="w-5 h-5 rounded-full border-2 border-[#0f1720] ${color} ${ring} ${pulse} flex items-center justify-center text-[9px] font-bold text-white">${letter}</div>`,
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

const EQUIPMENT_LABELS = {
  defib: 'Defib',
  ventilator: 'Vent',
  stretcher: 'Stretcher',
  meds: 'Meds',
};

function equipmentList(equipment) {
  if (!equipment) return '';
  return Object.entries(equipment)
    .filter(([, v]) => v)
    .map(([k]) => EQUIPMENT_LABELS[k] || k)
    .join(' · ');
}

const STATUS_LABEL = {
  available: 'Available',
  dispatched: 'Dispatched',
  en_route: 'En route',
  on_scene: 'On scene',
  transporting: 'Transporting',
  arrived: 'Arrived',
};

export default function AmbulanceMap({ hospital, ambulances, callsQueue, onPickLocation, pendingLocation, hospitals }) {
  const center = [hospital.lat, hospital.lng];

  const allHospitals = hospitals && hospitals.length > 0 ? hospitals : [hospital];

  return (
    <div className="h-[420px] rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700">
      <MapContainer center={center} zoom={12} className="h-full w-full">
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ClickCapture onPick={onPickLocation} />

        {/* Hospitals */}
        {allHospitals.map((h) => (
          <Marker key={h.id || h.name} position={[h.lat, h.lng]} icon={hospitalIcon(h.name, h.bedsAvailable)}>
            <Popup>
              <div className="text-[13px] font-bold">{h.name}</div>
              {h.bedsAvailable != null && (
                <div className="text-[11px] text-slate-500">
                  {h.bedsAvailable} / {h.capacity} beds available
                </div>
              )}
            </Popup>
          </Marker>
        ))}

        {/* Ambulances */}
        {ambulances.map((amb) => (
          <Fragment key={amb.id}>
            <Marker position={[amb.lat, amb.lng]} icon={ambulanceIcon(amb.status, amb.type)}>
              <Popup>
                <div className="text-[13px] font-bold">{amb.name}</div>
                <div className="text-[11px] text-slate-500">
                  {amb.type?.toUpperCase()} · {STATUS_LABEL[amb.status] || amb.status}
                </div>
                {amb.equipment && (
                  <div className="text-[10px] text-slate-400 mt-1">
                    {equipmentList(amb.equipment)}
                  </div>
                )}
                {amb.trip && (
                  <>
                    <div className="text-[11px] mt-1">
                      → {amb.trip.call?.callerName}
                    </div>
                    <div className="text-[11px] font-mono text-orange-500">
                      ETA {amb.trip.etaMin?.toFixed(1)}m
                    </div>
                  </>
                )}
              </Popup>
            </Marker>

            {/* Route polyline */}
            {amb.trip?.routePolyline && amb.trip.routePolyline.length > 1 && (
              <Polyline
                positions={amb.trip.routePolyline.map(([lat, lng]) => [lat, lng])}
                pathOptions={{ color: '#f97316', weight: 3, opacity: 0.7 }}
              />
            )}

            {/* Fallback: simple line trip.call -> ambulance */}
            {amb.trip && !amb.trip.routePolyline && amb.trip.call && (
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

        {/* Call queue markers */}
        {callsQueue.map((call) => (
          <Marker key={call.id} position={[call.lat, call.lng]} icon={callIcon(call.basePriority)}>
            <Popup>
              <div className="text-[13px] font-bold">{call.callerName}</div>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${SEV_BADGE[call.basePriority] || SEV_BADGE[5]}`}>
                {SEVERITY_LABELS[call.basePriority] || 'Unknown'}
              </span>
              <div className="text-[11px] text-slate-500 mt-1">
                Waiting {call.waitMinutes?.toFixed(1)}m
              </div>
              {call.note && <div className="text-[10px] text-slate-400 mt-0.5">{call.note}</div>}
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
