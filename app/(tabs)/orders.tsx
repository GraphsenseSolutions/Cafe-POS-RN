import { StyleSheet } from 'react-native';
import { useState } from 'react';
import { Button, Modal, TextInput } from 'react-native';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

export default function Orders() {
  const [modalVisible, setModalVisible] = useState(false);
  const [orderId, setOrderId] = useState('');

  const createOrderCard = () => {
    // Logic to create a new order with the orderId
    console.log('Creating order with ID:', orderId);
    setModalVisible(false);
    setOrderId('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Orders Page</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Button title="+" onPress={() => setModalVisible(true)} />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.card}>
            <Text style={styles.title}>Create Order</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Order ID"
              value={orderId}
              onChangeText={setOrderId}
            />
            <Button title="Create" onPress={createOrderCard} />
            <Button title="Cancel" onPress={() => setModalVisible(false)} />
          </View>
        </View>
      </Modal>

      <EditScreenInfo path="app/(tabs)/orders.tsx" />
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  card: {
    width: '80%',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
  },
});
