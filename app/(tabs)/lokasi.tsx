import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { useRouter } from 'expo-router';
import { initializeApp, getApps } from 'firebase/app';
import { getDatabase, onValue, ref, remove } from 'firebase/database';
import React, { useCallback, useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Linking,
    RefreshControl,
    SectionList,
    StyleSheet,
    TouchableOpacity,
    View,
    ImageBackground,
} from 'react-native';

/* --------------------------------------------------
   🔥 FIREBASE CONFIG — tetap inside file
   -------------------------------------------------- */
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

// ❗ Prevent error "Firebase App already exists"
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getDatabase(app);

/* -------------------------------------------------- */

type ATMItem = {
    id: string;
    bank: string;
    jenisATM: string;
    statusATM: string;
    coordinates: string;
    accuration: string;
};

type SectionData = {
    title: string;
    data: ATMItem[];
};

export default function LokasiScreen() {
    const router = useRouter();
    const [sections, setSections] = useState<SectionData[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [favorites, setFavorites] = useState<{ [key: string]: boolean }>({});

    const handlePress = (coordinates: string) => {
        const [lat, lng] = coordinates.split(',').map(c => c.trim());
        const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
        Linking.openURL(url);
    };

    const handleDelete = (id: string) => {
        Alert.alert(
            "Hapus Lokasi",
            "Apakah Anda yakin ingin menghapus lokasi ATM ini?",
            [
                { text: "Batal", style: "cancel" },
                {
                    text: "Hapus",
                    style: "destructive",
                    onPress: () => {
                        remove(ref(db, `points/${id}`));
                    }
                }
            ]
        );
    };

    const handleEdit = (item: ATMItem) => {
        router.push({
            pathname: "/formeditlocation",
            params: {
                id: item.id,
                name: item.bank,
                jenisATM: item.jenisATM,
                statusATM: item.statusATM,
                coordinates: item.coordinates,
                accuration: item.accuration,
            }
        });
    };

    const toggleFavorite = (id: string) => {
        setFavorites(p => ({ ...p, [id]: !p[id] }));
    };

    useEffect(() => {
        const pointsRef = ref(db, "points/");
        const unsub = onValue(pointsRef, (snapshot) => {
            const data = snapshot.val();

            if (data) {
                const points = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                }));

                setSections([{ title: "CARI DAFTAR ATM", data: points }]);
            } else {
                setSections([]);
            }

            setLoading(false);
        });

        return () => unsub();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 800);
    }, []);

    if (loading) {
        return (
            <ThemedView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FFD600" />
            </ThemedView>
        );
    }

    return (
        <ImageBackground
            source={require('@/assets/images/backgroun_atm.jpg')}
            style={styles.background}
            imageStyle={{ opacity: 0.5 }}
        >
            <SectionList
                sections={sections}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 50 }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#FFD600"]} />
                }
                renderSectionHeader={({ section: { title } }) => (
                    <ThemedText style={styles.header}>{title}</ThemedText>
                )}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <View style={styles.cardHeader}>
                            <FontAwesome5 name="university" size={28} color="#FFD600" />
                            <ThemedText style={styles.itemName}>{item.bank}</ThemedText>
                        </View>

                        <View style={styles.infoContainer}>
                            <InfoRow title="Jenis ATM" value={item.jenisATM} />
                            <InfoRow title="Koordinat" value={item.coordinates} />
                            <InfoRow title="Akurasi GPS" value={item.accuration} />
                        </View>

                        <View style={[styles.statusBadge, { backgroundColor: item.statusATM === "Aktif" ? "#4CAF50" : "#FF5252" }]}>
                            <ThemedText style={styles.statusText}>{item.statusATM}</ThemedText>
                        </View>

                        <View style={styles.iconRow}>
                            <IconButton icon="map-marker-alt" color="#FFD600" onPress={() => handlePress(item.coordinates)} />
                            <IconButton icon="pen" color="#1E90FF" onPress={() => handleEdit(item)} />
                            <IconButton icon="trash" color="#FF5252" onPress={() => handleDelete(item.id)} />
                            <TouchableOpacity style={styles.iconCircle} onPress={() => toggleFavorite(item.id)}>
                                <FontAwesome5
                                    name="heart"
                                    size={18}
                                    color={favorites[item.id] ? "#ff0062ff" : "#FFF"}
                                    solid={favorites[item.id]}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </ImageBackground>
    );
}

/* --------------------------------------------------
   🔹 Small Components
-------------------------------------------------- */

function InfoRow({ title, value }: { title: string; value: string }) {
    return (
        <View style={styles.infoRow}>
            <ThemedText style={styles.infoTitle}>{title}</ThemedText>
            <ThemedText style={styles.infoValue}>{value}</ThemedText>
        </View>
    );
}

function IconButton({
    icon,
    color,
    onPress
}: {
    icon: string;
    color: string;
    onPress: () => void;
}) {
    return (
        <TouchableOpacity style={styles.iconCircle} onPress={onPress}>
            <FontAwesome5 name={icon} size={18} color={color} />
        </TouchableOpacity>
    );
}

/* -------------------------------------------------- */

const styles = StyleSheet.create({
    background: { flex: 1 },
    loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },

    header: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        backgroundColor: "#dbb807ea",
        color: "#4e4203ff",
        padding: 10,
        marginTop: 35,
        marginHorizontal: 16,
        marginVertical: 25,
        borderRadius: 16,
        textShadowColor: "#00000033",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 3,
    },

    card: {
        backgroundColor: "#142C4CCC",
        marginHorizontal: 16,
        marginVertical: 5,
        borderRadius: 20,
        padding: 20,
        shadowColor: "#FFD600",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 6,
        elevation: 6,
        borderWidth: 1,
        borderColor: "#FFD60033",
    },

    cardHeader: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        marginBottom: 12,
    },

    itemName: { fontSize: 18, fontWeight: "700", color: "#FFD600" },

    infoContainer: { marginBottom: 12 },

    infoRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginVertical: 4
    },

    infoTitle: { fontSize: 14, color: "#B0C4DE" },
    infoValue: { fontSize: 14, color: "#FFFFFF", fontWeight: "600" },

    statusBadge: {
        position: "absolute",
        top: 16,
        right: 16,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12
    },

    statusText: { color: "#FFF", fontSize: 12, fontWeight: "700" },

    iconRow: {
        flexDirection: "row",
        justifyContent: "flex-start",
        marginTop: 10
    },

    iconCircle: {
        backgroundColor: "rgba(255,215,0,0.08)",
        padding: 14,
        borderRadius: 50,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 8,
    },
});
