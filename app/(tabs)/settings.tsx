import { StyleSheet, Alert, TouchableOpacity, Text } from 'react-native';
import axios from 'axios';
import { useNavigation, useRouter } from 'expo-router';
import { View } from '@/components/Themed';


export default function Settings() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Settings Page</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <TouchableOpacity style={styles.button} onPress={async () => {
        try {
          await axios.post("http://192.168.1.3:5000/logout");
          router.navigate("/");
        } catch (error) {
          console.error("Logout failed:", error);
          Alert.alert("Logout failed", "Please try again.");
        }
      }}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: 'center',
    width: '60%',
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
