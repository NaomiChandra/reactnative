import * as Location from 'expo-location';
import { Stack } from 'expo-router';
import { initializeApp, getApps } from "firebase/app";
import { getDatabase, push, ref } from "firebase/database";
import React, { useState } from 'react';
import {
    Alert,
    StyleSheet,
    Text,
    TextInput,
    View,
    ScrollView,
    TouchableOpacity,
    Image
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

// Firebase Config
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

// Anti duplikasi Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getDatabase(app);

const App = () => {
    const [name, setName] = useState('');
    const [jenisATM, setJenisATM] = useState('');
    const [statusATM, setStatusATM] = useState('');
    const [location, setLocation] = useState('');
    const [accuration, setAccuration] = useState('');

    const getCoordinates = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission to access location was denied');
            return;
        }

        let loc = await Location.getCurrentPositionAsync({});
        setLocation(loc.coords.latitude + ',' + loc.coords.longitude);
        setAccuration(loc.coords.accuracy + ' m');
    };

    return (
        <SafeAreaProvider style={styles.page}>
            <SafeAreaView>
                <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                    <Stack.Screen options={{ title: 'Form Input ATM' }} />

                    {/* TOP HEADER */}
                    <View style={styles.headerTop}>
                        <Text style={styles.headerTitle}>ATLAS APP</Text>
                        <Text style={styles.headerSub}>ATM Location Tracking & Search</Text>
                    </View>

                    <View style={styles.card}>
                        <Text style={styles.header}>Form Input Data ATM</Text>

                        {/* Nama Bank */}
                        <View style={styles.inputGroup}>
                            <MaterialIcons name="account-balance" size={22} color="#FFC72C" />
                            <TextInput
                                style={styles.input}
                                placeholder='Nama Bank'
                                placeholderTextColor="#b5c3ff"
                                value={name}
                                onChangeText={setName}
                            />
                        </View>

                        {/* Jenis ATM */}
                        <View style={styles.inputGroup}>
                            <MaterialIcons name="atm" size={22} color="#FFC72C" />
                            <TextInput
                                style={styles.input}
                                placeholder='Jenis ATM (Tarik / Setor / Non Tunai)'
                                placeholderTextColor="#b5c3ff"
                                value={jenisATM}
                                onChangeText={setJenisATM}
                            />
                        </View>

                        {/* Status ATM */}
                        <View style={styles.inputGroup}>
                            <MaterialIcons name="signal-cellular-alt" size={22} color="#FFC72C" />
                            <TextInput
                                style={styles.input}
                                placeholder='Status ATM (Aktif / Gangguan)'
                                placeholderTextColor="#b5c3ff"
                                value={statusATM}
                                onChangeText={setStatusATM}
                            />
                        </View>

                        {/* Koordinat */}
                        <View style={styles.inputGroup}>
                            <MaterialIcons name="location-on" size={22} color="#FFC72C" />
                            <TextInput
                                style={styles.input}
                                placeholder="Koordinat GPS"
                                placeholderTextColor="#b5c3ff"
                                value={location}
                                onChangeText={setLocation}
                            />
                        </View>

                        {/* Akurasi */}
                        <View style={styles.inputGroup}>
                            <MaterialIcons name="gps-fixed" size={22} color="#FFC72C" />
                            <TextInput
                                style={styles.input}
                                placeholder="Akurasi (contoh: 5 m)"
                                placeholderTextColor="#b5c3ff"
                                value={accuration}
                                onChangeText={setAccuration}
                            />
                        </View>

                        {/* GET LOCATION BUTTON */}
                        <TouchableOpacity style={styles.btnPrimary} onPress={getCoordinates}>
                            <MaterialIcons name="my-location" color="white" size={22} />
                            <Text style={styles.btnText}>Get Current Location</Text>
                        </TouchableOpacity>

                        {/* SAVE BUTTON */}
                        <TouchableOpacity
                            style={styles.btnSuccess}
                            onPress={() => {
                                const locationsRef = ref(db, 'points/');
                                push(locationsRef, {
                                    bank: name,
                                    jenisATM,
                                    statusATM,
                                    coordinates: location,
                                    accuration,
                                })
                                    .then(() => {
                                        setName('');
                                        setJenisATM('');
                                        setStatusATM('');
                                        setLocation('');
                                        setAccuration('');
                                        Alert.alert("Berhasil", "Data ATM berhasil disimpan");
                                    })
                                    .catch(() => Alert.alert("Error", "Gagal menyimpan data"));
                            }}
                        >
                            <MaterialIcons name="save" color="white" size={22} />
                            <Text style={styles.btnText}>Save Data</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    page: { flex: 1, backgroundColor: '#0f224bef' },
    headerTop: { paddingTop: 10, paddingBottom: 10, alignItems: 'center' },
    logo: { width: 125, height: 125, marginBottom: 8 },
    headerTitle: { color: '#FFC72C', fontSize: 26, fontWeight: '800', letterSpacing: 2 },
    headerSub: { color: '#dbeafe', opacity: 0.7, fontSize: 14 },
    card: {
        marginTop: 20,
        marginHorizontal: 15,
        backgroundColor: 'rgba(255,255,255,0.06)',
        padding: 22,
        borderRadius: 22,
        borderWidth: 2,
        borderColor: '#FFC72C', // Border kuning untuk card
    },
    header: { fontSize: 22, fontWeight: '700', marginBottom: 20, textAlign: 'center', color: '#f8fafc' },
    inputGroup: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.10)',
        borderWidth: 1.5,
        borderColor: '#FFC72C',
        alignItems: 'center',
        paddingHorizontal: 12,
        borderRadius: 14,
        marginVertical: 8,
        height: 50,
    },
    input: { flex: 1, color: 'white', paddingHorizontal: 10, fontSize: 15 },
    btnPrimary: {
        backgroundColor: '#1E3A8A',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 14,
        marginTop: 20,
        borderWidth: 1,
        borderColor: '#3b82f6',
    },
    btnSuccess: {
        backgroundColor: '#166534',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 14,
        borderRadius: 14,
        marginTop: 12,
        borderWidth: 1,
        borderColor: '#22c55e',
    },
    btnText: { color: 'white', fontWeight: '700', fontSize: 16, marginLeft: 8 },
});

export default App;
