import { useCallback, useEffect, useState } from 'react';
import {
    ImageBackground,
    Linking,
    Platform,
    RefreshControl,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getDatabase, onValue, ref } from 'firebase/database';

type ATMItem = {
    id: string;
    bank: string;
    statusATM: string;
    coordinates: string;
    accuration: string;
};

const firebaseConfig = {
    apiKey: "AIzaSyB9wVLOmxUu9OEmtRCTntIIWac_t9qxEYg",
    authDomain: "reactnative-dcc03.firebaseapp.com",
    databaseURL: "https://reactnative-dcc03-default-rtdb.firebaseio.com",
    projectId: "reactnative-dcc03",
    storageBucket: "reactnative-dcc03.firebasestorage.app",
    messagingSenderId: "20439701153",
    appId: "1:20439701153:web:0890dc9487c3311863c2e0",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const db = getDatabase(app);

export { app, db };


export default function ExploreScreen() {
    const [atms, setAtms] = useState<ATMItem[]>([]);
    const [search, setSearch] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    const filteredATM = atms.filter(atm =>
        atm.bank?.toLowerCase().includes(search.toLowerCase())
    );

    const handlePress = (coordinates: string) => {
        if (!coordinates) return;
        const [lat, lng] = coordinates.split(',').map(c => c.trim());
        const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
        Linking.openURL(url);
    };

    useEffect(() => {
        const atmsRef = ref(db, 'points/');
        const unsubscribe = onValue(atmsRef, snapshot => {
            const data = snapshot.val();
            if (data) {
                const pointsArray = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                }));
                setAtms(pointsArray);
            }
        });

        return () => unsubscribe();
    }, []);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        setTimeout(() => setRefreshing(false), 800);
    }, []);

    return (
        <ImageBackground
            source={require('@/assets/images/backgroun_atm.jpg')}
            style={styles.container}
            imageStyle={{ opacity: 0.60}} // Transparansi untuk efek futuristik
        >
            <ScrollView
                contentContainerStyle={{ paddingBottom: 40 }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#a78c0aff']} />
                }
            >
                {/* LOGO */}
                {/* <Image source={require('@/assets/images/ATLAS.png')} style={styles.logo} /> */}

                <ThemedText type="title" style={styles.title}>INFORMASI ATM TERKINI</ThemedText>
                <ThemedText style={styles.subtitle}>Wilayah Yogyakarta</ThemedText>

                {/* SEARCH BAR */}
                <View style={styles.searchBox}>
                    <IconSymbol name={'magnifyingglass' as any} size={18} color="#FFD600" />
                    <TextInput
                        placeholder="Cari ATM / Bank..."
                        placeholderTextColor="#AAAAAA"
                        style={styles.searchInput}
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>

                {/* DASHBOARD */}
                <View style={styles.dashboardRow}>
                    <View style={styles.dashboardCard}>
                        <ThemedText style={styles.dashboardValue}>{atms.length}</ThemedText>
                        <ThemedText style={styles.dashboardLabel}>Total ATM</ThemedText>
                    </View>

                    <View style={styles.dashboardCard}>
                        <ThemedText style={styles.dashboardValue}>
                            {atms.filter(a => a.statusATM === 'Aktif').length}
                        </ThemedText>
                        <ThemedText style={styles.dashboardLabel}>Aktif</ThemedText>
                    </View>

                    <View style={styles.dashboardCard}>
                        <ThemedText style={styles.dashboardValue}>
                            {atms.filter(a => a.statusATM !== 'Aktif').length}
                        </ThemedText>
                        <ThemedText style={styles.dashboardLabel}>Maintenance</ThemedText>
                    </View>
                </View>

                {/* LIST ATM */}
                {filteredATM.map(atm => (
                    <View
                        key={atm.id}
                        style={[
                            styles.card,
                            atm.statusATM === 'Aktif' ? styles.cardActive : styles.cardInactive
                        ]}
                    >
                        <View style={styles.cardHeader}>
                            <IconSymbol name={'building.columns' as any} size={24} color="#FFD600" />
                            <ThemedText style={styles.bankName}>{atm.bank}</ThemedText>

                            <View style={[
                                styles.statusBadge,
                                atm.statusATM === 'Aktif' ? styles.activeBadge : styles.maintenanceBadge
                            ]}>
                                <ThemedText style={styles.badgeText}>{atm.statusATM}</ThemedText>
                            </View>
                        </View>

                        <View style={styles.infoRow}>
                            <ThemedText style={styles.infoLabel}>Koordinat</ThemedText>
                            <ThemedText style={styles.infoValue}>{atm.coordinates}</ThemedText>
                        </View>

                        <View style={styles.infoRow}>
                            <ThemedText style={styles.infoLabel}>Akurasi GPS</ThemedText>
                            <ThemedText style={styles.infoValue}>{atm.accuration}</ThemedText>
                        </View>

                        <TouchableOpacity style={styles.mapButton} onPress={() => handlePress(atm.coordinates)}>
                            <IconSymbol name={'map' as any} size={18} color="#0F1B33" />
                            <ThemedText style={styles.mapText}>Navigasi</ThemedText>
                        </TouchableOpacity>
                    </View>
                ))}

                {filteredATM.length === 0 && (
                    <ThemedText style={{ textAlign: 'center', color: '#FFF', marginTop: 20 }}>
                        ATM tidak ditemukan
                    </ThemedText>
                )}
            </ScrollView>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    //logo: { width: 140, height: 140, alignSelf: 'center', opacity: 0.15, marginTop: 20 },
    title: { 
    fontSize: 30, 
    fontWeight: 'bold', 
    color: '#ffe601ff', 
    textAlign: 'center',
    marginTop: 35,     // ⭐ Tambah jarak dari atas
},
    subtitle: { textAlign: 'center', color: '#FFFFFF99', marginBottom: 16 },

    searchBox: {
        marginHorizontal: 16,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(20,44,76,0.9)',
        borderRadius: 14,
        paddingHorizontal: 14,
        paddingVertical: 10
    },

    searchInput: { color: '#FFF', marginLeft: 10, flex: 1 },

    dashboardRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 16,
        marginBottom: 20
    },

    dashboardCard: {
        width: '30%',
        backgroundColor: 'rgba(20,44,76,0.85)',
        borderRadius: 16,
        paddingVertical: 14,
        alignItems: 'center'
    },

    dashboardValue: { fontSize: 22, fontWeight: 'bold', color: '#FFD600' },
    dashboardLabel: { fontSize: 12, color: '#FFFFFFAA' },

    card: {
        backgroundColor: 'rgba(20,44,76,0.88)',
        marginHorizontal: 16,
        padding: 16,
        borderRadius: 18,
        marginBottom: 14,
        borderWidth: 1
    },

    cardActive: { borderColor: '#00FF9C' },
    cardInactive: { borderColor: '#FF4B4B' },

    cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    bankName: { fontSize: 18, marginLeft: 10, color: '#FFD600', flex: 1 },

    statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
    activeBadge: { backgroundColor: '#00FF9C' },
    maintenanceBadge: { backgroundColor: '#FF4B4B' },

    badgeText: { fontSize: 11, color: '#0F1B33', fontWeight: 'bold' },

    infoRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 3 },
    infoLabel: { color: '#B0C4DE', fontSize: 13 },
    infoValue: { color: '#FFFFFF', fontSize: 13 },

    mapButton: {
        marginTop: 12,
        backgroundColor: '#FFD600',
        paddingVertical: 10,
        borderRadius: 14,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8
    },

    mapText: { fontWeight: 'bold', color: '#0F1B33' }
});