import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    Keyboard,
    View,
    TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

// Firebase init
import { initializeApp, getApps } from 'firebase/app';
import { getDatabase, ref, update } from 'firebase/database';


// Expo Location
import * as Location from 'expo-location';

const firebaseConfig = {
    apiKey: 'AIzaSyB9wVLOmxUu9OEmtRCTntIIWac_t9qxEYg',
    authDomain: 'reactnative-dcc03.firebaseapp.com',
    databaseURL: 'https://reactnative-dcc03-default-rtdb.firebaseio.com',
    projectId: 'reactnative-dcc03',
    storageBucket: 'reactnative-dcc03.firebasestorage.app',
    messagingSenderId: '20439701153',
    appId: '1:20439701153:web:0890dc9487c3311863c2e0',
    measurementId: 'G-3S1QXTS9ZP',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getDatabase(app);

// Reusable Input component with icon
interface InputProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    iconName: keyof typeof MaterialIcons.glyphMap;
}

const Input = ({ label, value, onChangeText, placeholder, iconName }: InputProps) => (
    <View style={localStyles.inputWrap}>
        <Text style={localStyles.label}>{label}</Text>
        <View style={localStyles.inputContainer}>
            <MaterialIcons name={iconName} size={22} color="#FFC72C" style={{ marginRight: 10 }} />
            <TextInput
                style={localStyles.input}
                value={value}
                onChangeText={onChangeText}
                placeholder={placeholder ?? label}
                placeholderTextColor="#b5c3ff"
                returnKeyType="done"
                onSubmitEditing={() => Keyboard.dismiss()}
            />
        </View>
    </View>
);

export default function FormEditLocation() {
    const router = useRouter();
    const params = useLocalSearchParams();

    const safe = (v: any) => (v == null ? '' : String(v));

    const [bank, setBank] = useState(safe(params.name || params.bank));
    const [jenisATM, setJenisATM] = useState(safe(params.jenisATM));
    const [statusATM, setStatusATM] = useState(safe(params.statusATM));
    const [coordinates, setCoordinates] = useState(safe(params.coordinates));
    const [accuration, setAccuration] = useState(safe(params.accuration));

    const id = safe(params.id);

    const handleSave = () => {
        if (!id) return Alert.alert('Error', 'ID tidak ditemukan');

        const pointRef = ref(db, `points/${id}`);
        update(pointRef, { bank, jenisATM, statusATM, coordinates, accuration })
            .then(() => { 
                Alert.alert('Berhasil', 'Data berhasil diperbarui!'); 
                router.back(); 
            })
            .catch(e => { 
                console.error(e); 
                Alert.alert('Error', 'Gagal memperbarui data'); 
            });
    };

    const getCoordinates = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission Denied', 'Izin lokasi ditolak');
                return;
            }

            const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Highest });
            const coords = `${location.coords.latitude}, ${location.coords.longitude}`;
            setCoordinates(coords);
            Alert.alert('Sukses', `Lokasi berhasil diambil: ${coords}`);
        } catch (error: any) {
            Alert.alert('Error', 'Gagal mendapatkan lokasi: ' + error.message);
        }
    };

    return (
        <SafeAreaView style={styles.page}>
            <Stack.Screen options={{ title: 'Edit Data ATM' }} />

            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                <View style={styles.headerTop}>
                    <Text style={styles.headerTitle}>ATLAS APP</Text>
                    <Text style={styles.headerSub}>ATM Location Tracking & Search</Text>
                </View>

                <View style={styles.card}>
                    <Text style={styles.header}>Form Edit ATM</Text>

                    <Input label="Nama Bank" value={bank} onChangeText={setBank} placeholder="Contoh: BRI" iconName="account-balance" />
                    <Input label="Jenis ATM" value={jenisATM} onChangeText={setJenisATM} placeholder="DBS / Mini / Drive-thru" iconName="atm" />
                    <Input label="Status ATM" value={statusATM} onChangeText={setStatusATM} placeholder="Aktif / Non-aktif" iconName="signal-cellular-alt" />
                    <Input label="Koordinat (lat,long)" value={coordinates} onChangeText={setCoordinates} placeholder="-2.12345, 112.12345" iconName="location-on" />
                    <Input label="Akurasi (m)" value={accuration} onChangeText={setAccuration} placeholder="5 m" iconName="gps-fixed" />

                    <TouchableOpacity style={styles.btnPrimary} onPress={getCoordinates}>
                        <MaterialIcons name="my-location" color="white" size={22} />
                        <Text style={styles.btnText}>Get Current Location</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.btnSave} onPress={handleSave}>
                        <MaterialIcons name="save" color="white" size={22} />
                        <Text style={styles.btnText}>Save Changes</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

// ===== Styles =====
const styles = StyleSheet.create({
    page: { flex: 1, backgroundColor: '#0f224bef' },
    container: { padding: 20, paddingBottom: 60 },
    headerTop: { paddingTop: 15, paddingBottom: 15, alignItems: 'center' },
    logo: { width: 125, height: 125, marginBottom: 6 },
    headerTitle: { color: '#FFC72C', fontSize: 26, fontWeight: '800', letterSpacing: 2 },
    headerSub: { color: '#dbeafe', opacity: 0.7, fontSize: 14 },
    card: {
        marginTop: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.06)',
        padding: 22,
        borderRadius: 22,
        borderWidth: 2,
        borderColor: '#FFC72C', // Border kuning
    },
    header: { fontSize: 22, fontWeight: '700', marginBottom: 18, textAlign: 'center', color: '#f8fafc' },
    btnPrimary: {
        backgroundColor: '#166534',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 14,
        marginTop: 16,
        borderWidth: 1,
        borderColor: '#22c55e',
    },
    btnSave: {
        backgroundColor: '#1E3A8A',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 14,
        marginTop: 12,
        borderWidth: 1,
        borderColor: '#3b82f6',
    },
    btnText: { color: 'white', fontWeight: '700', fontSize: 16, marginLeft: 8 },
});

const localStyles = StyleSheet.create({
    inputWrap: { marginBottom: 12 },
    label: { color: '#dbeafe', marginBottom: 4, fontWeight: '700' },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderRadius: 12,
        borderWidth: 1.5,
        borderColor: '#FFC72C',
        paddingHorizontal: 12,
        height: 48,
    },
    input: {
        flex: 1,
        color: 'white',
        fontSize: 15,
        paddingVertical: 6,
    },
});
