import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import React from 'react';
import { SectionList, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const DATA = [
    {
        title: 'Asisten Praktikum',
        data: ['Syaiful', 'Hayyu', 'Rini', 'Veronica'],
    },
    {
        title: 'Kelas A',
        data: ['Cece', 'Myla', 'Angel', 'Amel', 'Belinda', 'Bella', 'Shaqurra'],
    },
    {
        title: 'Kelas B',
        data: ['Galuh', 'Zahra', 'Atika', 'Alifah', 'Meiva', 'Salsa', 'Jenni'],
    },
];

const App = () => (
    <SafeAreaProvider>
        <SafeAreaView style={styles.container} edges={['top']}>
            <SectionList
                sections={DATA}
                keyExtractor={(item, index) => item + index}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.title}>
                            <MaterialIcons name="person" size={24} color="black" />
                            {' '}
                            {item}
                            </Text>
                    </View>
                )}
                renderSectionHeader={({ section: { title } }) => (
                    <Text style={styles.header}>{title}</Text>
                )}
            />
        </SafeAreaView>
    </SafeAreaProvider>
);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
        marginHorizontal: 16,
        marginVertical: 16,
    },
    item: {
        backgroundColor: '#f7b7d0ff',
        padding: 20,
        marginVertical: 12,
        borderRadius: 5,
    },
    header: {
        fontSize: 32,
        backgroundColor: '#f55c76ff',
        paddingLeft: 5,
        borderRadius: 5,
        fontWeight: '600',
    },
    title: {
        fontSize: 24,
    },
});

export default App;