import { View, Text, StyleSheet, ScrollView, ImageBackground, Image } from "react-native";
import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

export default function HomeScreen() {
  return (
    <ImageBackground
      source={require('@/assets/images/backgroun_atm.jpg')} // Ganti dengan gambar ATM kamu
      style={styles.background}
      imageStyle={{ opacity: 0.18}} // Transparansi untuk efek futuristik
    >
      <ScrollView contentContainerStyle={styles.container}>
        
        {/* HEADER */}
        <View style={styles.header}>
          <Image
            source={require('@/assets/images/ATLAS.png')}
            style={styles.logo}
          />
          <Text style={styles.appTitle}>ATLAS</Text>
          <Text style={styles.appSubtitle}>ATM Location Tracking & Search</Text>
        </View>

        {/* STATISTIK DATA */}
        <Text style={styles.sectionTitle}>Statistik Data</Text>
        <View style={styles.statsRow}>
          <View style={styles.statsCard}>
            <MaterialIcons name="atm" size={28} color="#FFD54F" />
            <Text style={styles.statsNumber}>152</Text>
            <Text style={styles.statsLabel}>Total ATM</Text>
          </View>

          <View style={styles.statsCard}>
            <MaterialIcons name="account-balance-wallet" size={28} color="#FFD54F" />
            <Text style={styles.statsNumber}>14</Text>
            <Text style={styles.statsLabel}>Bank di DIY</Text>
          </View>

          <View style={styles.statsCard}>
            <MaterialIcons name="location-city" size={28} color="#FFD54F" />
            <Text style={styles.statsNumber}>5</Text>
            <Text style={styles.statsLabel}>Kab/Kota</Text>
          </View>
        </View>

        {/* FITUR UNGGULAN */}
        <Text style={styles.sectionTitle}>Fitur Unggulan</Text>

        <View style={styles.featureCard}>
          <FontAwesome5 name="search-location" size={24} color="#1E88E5" />
          <View style={styles.featureTextBox}>
            <Text style={styles.featureTitle}>Pencarian ATM Cepat</Text>
            <Text style={styles.featureDesc}>
              Cari lokasi ATM terdekat dengan filter bank dan jarak.
            </Text>
          </View>
        </View>

        <View style={styles.featureCard}>
          <MaterialIcons name="navigation" size={26} color="#1E88E5" />
          <View style={styles.featureTextBox}>
            <Text style={styles.featureTitle}>Navigasi Real-time</Text>
            <Text style={styles.featureDesc}>
              Dapatkan arah perjalanan langsung ke ATM pilihan Anda.
            </Text>
          </View>
        </View>

        <View style={styles.featureCard}>
          <MaterialIcons name="favorite" size={26} color="#1E88E5" />
          <View style={styles.featureTextBox}>
            <Text style={styles.featureTitle}>ATM Favorit</Text>
            <Text style={styles.featureDesc}>
              Simpan lokasi ATM favorit untuk akses lebih cepat.
            </Text>
          </View>
        </View>

        {/* INFORMASI ATM TERKINI */}
        <Text style={styles.sectionTitle}>Informasi ATM Terkini</Text>

        <View style={styles.updateCard}>
          <MaterialIcons name="update" size={25} color="#FFC107" />
          <View style={styles.updateTextBox}>
            <Text style={styles.updateTitle}>ATM Mandiri Malioboro</Text>
            <Text style={styles.updateDesc}>Status: Berfungsi • Antrian normal</Text>
          </View>
        </View>

        <View style={styles.updateCard}>
          <MaterialIcons name="error-outline" size={25} color="#E53935" />
          <View style={styles.updateTextBox}>
            <Text style={styles.updateTitle}>ATM BRI Condongcatur</Text>
            <Text style={styles.updateDesc}>Status: Maintenance</Text>
          </View>
        </View>

        {/* BANK DI DIY */}
        <Text style={styles.sectionTitle}>Bank di D.I Yogyakarta</Text>

        <View style={styles.bankCard}>
          {[
            "Bank BCA",
            "Bank Mandiri",
            "Bank BRI",
            "Bank BNI",
            "Bank BTN",
            "Bank Syariah Indonesia (BSI)",
            "Bank Danamon",
            "Bank Permata",
            "Bank CIMB Niaga",
            "Bank Panin",
            "Bank Mega",
            "Bank Nagari",
            "Bank DIY",
            "Maybank"
          ].map((bank, idx) => (
            <Text key={idx} style={styles.bankItem}>• {bank}</Text>
          ))}
        </View>

      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    padding: 20,
    paddingBottom: 50,
  },
  header: {
    marginBottom: 20,
    alignItems: "center",
  },
  logo: {
    width: 160,
    height: 160,
    resizeMode: "contain",
    marginBottom: 10,
    marginTop: 10,
  },
  appTitle: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#0D47A1",
    letterSpacing: 2,
  },
  appSubtitle: {
    fontSize: 15,
    color: "#555",
    fontStyle: "italic",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#0D47A1",
    marginTop: 25,
    marginBottom: 12,
    textShadowColor: "#00000033",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  statsCard: {
    backgroundColor: "#0D47A180",
    width: "31%",
    padding: 15,
    borderRadius: 18,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 4,
  },
  statsNumber: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    marginTop: 5,
  },
  statsLabel: { color: "#BBDEFB", marginTop: 2 },

  featureCard: {
    flexDirection: "row",
    backgroundColor: "#F5F8FF80",
    padding: 20,
    borderRadius: 15,
    marginBottom: 15,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  featureTextBox: { marginLeft: 12 },
  featureTitle: { fontSize: 16, fontWeight: "700" },
  featureDesc: { fontSize: 14, color: "#555" },

  updateCard: {
    flexDirection: "row",
    backgroundColor: "#FFF8E180",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  updateTextBox: { marginLeft: 10 },
  updateTitle: { fontSize: 16, fontWeight: "700" },
  updateDesc: { color: "#555", fontSize: 14 },

  bankCard: {
    backgroundColor: "#F5F8FF80",
    padding: 18,
    borderRadius: 15,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#E0E7FF50",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  bankItem: {
    fontSize: 15,
    paddingVertical: 4,
    color: "#333",
  },
});
