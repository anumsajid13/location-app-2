import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polygon, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapView = ({ locations }) => {
  const [map, setMap] = useState(null);

  const ZoomToMarkers = () => {
    const map = useMap();
    useEffect(() => {
      if (locations.length > 0) {
        const bounds = locations.flatMap(location => {
          if (location.geojson.type === 'Polygon') {
            return location.geojson.coordinates[0].map(coord => [coord[1], coord[0]]);
          } else if (location.geojson.type === 'MultiPolygon') {
            return location.geojson.coordinates.flatMap(polygon =>
              polygon[0].map(coord => [coord[1], coord[0]])
            );
          }
          return [];
        });
        if (bounds.length > 0) {
          map.fitBounds(bounds);
        }
      }
    }, [locations, map]);
    return null;
  };

  const getPolygonPositions = (geojson) => {
    if (!geojson || !geojson.coordinates) return [];

    if (geojson.type === 'Polygon') {
      return geojson.coordinates[0].map(coord => [coord[1], coord[0]]);
    } else if (geojson.type === 'MultiPolygon') {
      return geojson.coordinates.flatMap(polygon =>
        polygon[0].map(coord => [coord[1], coord[0]])
      );
    }
    return [];
  };

  return (
    <MapContainer
      style={{ height: '90vh', width: '100%', marginTop: '4%' }}
      center={[51.505, -0.09]}
      zoom={2}
      whenCreated={setMap}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {locations.map((location, index) => (
        <Polygon
          key={index}
          positions={getPolygonPositions(location.geojson)}
          color={location.color}
        />
      ))}
      <ZoomToMarkers />
    </MapContainer>
  );
};

export default MapView;
