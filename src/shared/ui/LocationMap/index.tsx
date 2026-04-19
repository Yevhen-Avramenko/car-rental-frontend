import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface DefaultIconPrototype extends L.Icon {
    _getIconUrl?: string;
}
delete (L.Icon.Default.prototype as DefaultIconPrototype)._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface LocationMapProps {
    address: string;
}

interface Coords {
    lat: number;
    lng: number;
}

type FetchStatus = 'idle' | 'loading' | 'success' | 'failed';

export const LocationMap = ({ address }: LocationMapProps) => {
    const [coords, setCoords] = useState<Coords | null>(null);
    const [status, setStatus] = useState<FetchStatus>('idle');

    useEffect(() => {
        // Уникаємо синхронного setState — все всередині асинхронної функції
        const geocode = async () => {
            if (!address || address === 'Unknown') {
                setStatus('failed');
                return;
            }

            setStatus('loading');

            try {
                const encoded = encodeURIComponent(address);
                const res  = await fetch(
                    `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json&limit=1`,
                    { headers: { 'Accept-Language': 'uk' } }
                );
                const data = await res.json() as Array<{ lat: string; lon: string }>;

                if (data.length > 0) {
                    setCoords({ lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) });
                    setStatus('success');
                } else {
                    setStatus('failed');
                }
            } catch {
                setStatus('failed');
            }
        };

        geocode();
    }, [address]);

    if (status === 'idle' || status === 'loading') {
        return (
            <div className="h-56 rounded-xl border border-warm-border bg-warm-cream flex items-center justify-center">
                <p className="text-sm text-warm-muted">Завантаження карти...</p>
            </div>
        );
    }

    if (status === 'failed' || !coords) {
        return (
            <div className="h-56 rounded-xl border border-warm-border bg-warm-cream flex items-center justify-center">
                <p className="text-sm text-warm-muted">📍 {address}</p>
            </div>
        );
    }

    return (
        <div className="h-56 rounded-xl overflow-hidden border border-warm-border">
            <MapContainer
                center={[coords.lat, coords.lng]}
                zoom={16}
                scrollWheelZoom={false}
                style={{ height: '100%', width: '100%' }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[coords.lat, coords.lng]}>
                    <Popup>{address}</Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};