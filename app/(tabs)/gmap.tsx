import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { initializeApp } from 'firebase/app';
import { getDatabase, onValue, ref } from 'firebase/database';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { db } from '@/firebaseconfig';   

// 🔵 Definisikan TYPE Marker
type ATMMarker = {
    id: string;
    name: string;
    latitude: number;
    longitude: number;
};

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyB9wVLOmxUu9OEmtRCTntIIWac_t9qxEYg",
    authDomain: "reactnative-dcc03.firebaseapp.com",
    databaseURL: "https://reactnative-dcc03-default-rtdb.firebaseio.com",
    projectId: "reactnative-dcc03",
    storageBucket: "reactnative-dcc03.firebasestorage.app",
    messagingSenderId: "20439701153",
    appId: "1:20439701153:web:0890dc9487c3311863c2e0",
    measurementId: "G-3S1QXTS9ZP"
};

export default function MapScreen() {
    // 🟡 Perbaikan utama: beri tipe pada state!
    const [markers, setMarkers] = useState<ATMMarker[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const pointsRef = ref(db, 'points/');

        const unsubscribe = onValue(
            pointsRef,
            (snapshot) => {
                const data = snapshot.val();

                if (data) {
                    const parsedMarkers: ATMMarker[] = Object.keys(data)
                        .map((key) => {
                            const point = data[key];

                            if (
                                typeof point.coordinates !== "string" ||
                                point.coordinates.trim() === ""
                            ) {
                                return null; // skip invalid
                            }

                            const [latitude, longitude] = point.coordinates
                                .split(',')
                                .map(Number);

                            if (isNaN(latitude) || isNaN(longitude)) {
                                console.warn(`Invalid coordinates for point ${key}:`, point.coordinates);
                                return null;
                            }

                            return {
                                id: key,
                                name: point.bank ?? "ATM",
                                latitude,
                                longitude,
                            };
                        })
                        .filter((item): item is ATMMarker => item !== null); // 🔥 Gunakan type predicate

                    setMarkers(parsedMarkers); // ✔ FIX: markers sekarang punya tipe yang benar!
                } else {
                    setMarkers([]);
                }

                setLoading(false);
            },
            (error) => {
                console.error(error);
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" />
                <Text>Loading map data...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: -7.7956,
                    longitude: 110.3695,
                    latitudeDelta: 0.02,
                    longitudeDelta: 0.01,
                }}
                zoomControlEnabled={true}
            >
                {markers.map((marker) => (
                    <Marker
                        key={marker.id}
                        coordinate={{
                            latitude: marker.latitude,
                            longitude: marker.longitude,
                        }}
                        title={marker.name}
                        description={`Coords: ${marker.latitude}, ${marker.longitude}`}
                    />
                ))}
            </MapView>

            <TouchableOpacity
                style={styles.fab}
                onPress={() => router.push('/forminputlocation')}
            >
                <FontAwesome name="plus" size={24} color="white" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    fab: {
        position: 'absolute',
        width: 56,
        height: 56,
        alignItems: 'center',
        justifyContent: 'center',
        left: 20,
        bottom: 20,
        backgroundColor: '#0275d8',
        borderRadius: 30,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
});
