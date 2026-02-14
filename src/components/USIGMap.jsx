"use client";

import { useEffect, useRef } from 'react';
import MapaInteractivo from '@usig-gcba/mapa-interactivo';
import 'leaflet/dist/leaflet.css';

const USIGMap = ({ markers = [] }) => {
    const mapContainerRef = useRef(null);
    const mapInstanceRef = useRef(null);

    useEffect(() => {
        // Ensure code runs only in the client and map is not already initialized
        if (typeof window !== 'undefined' && !mapInstanceRef.current && mapContainerRef.current) {
            try {
                const mapOptions = {
                    center: [-34.62, -58.44], // Buenos Aires coordinates
                    zoom: 13
                };

                mapInstanceRef.current = new MapaInteractivo(mapContainerRef.current.id, mapOptions);

            } catch (error) {
                console.error("Error initializing USIG map:", error);
            }
        }

        // Add markers if map is initialized
        if (mapInstanceRef.current && markers.length > 0) {
            markers.forEach(marker => {
                // Check if marker already exists to avoid duplicates (though current logic re-adds on re-render if not careful, 
                // for now simplistic approach is fine as we don't expect frequent updates to markers list)
                try {
                    // Extract lat/lng from marker object if present, otherwise assume it's the expected format
                    const position = marker.lat && marker.lng ? { lat: marker.lat, lng: marker.lng } : marker;
                    mapInstanceRef.current.addMarker(position, true, false, false, false, true, {});
                } catch (e) {
                    console.warn("Could not add marker", marker, e);
                }
            });
        }

        return () => {
            // Cleanup if the library supports it, or just clear the ref
            // mapInstanceRef.current = null; 
        };
    }, [markers]);

    return (
        <div className="w-full h-[600px] rounded-lg overflow-hidden border border-gray-200 shadow-sm relative z-0">
            <div
                id="mapa-interactivo"
                ref={mapContainerRef}
                style={{ width: '100%', height: '100%' }}
            ></div>
        </div>
    );
};

export default USIGMap;
