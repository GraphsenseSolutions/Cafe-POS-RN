import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, ScrollView } from 'react-native';
import axios from 'axios';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export default function History() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/getAllOrders');
      setOrders(response.data.orders);
      setFilteredOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const applyFilters = () => {
    const filtered = orders.filter(order => {
      const orderDate = new Date(order.date);
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;
      const total = order.total;

      const dateMatch =
        (!from || orderDate >= from) &&
        (!to || orderDate <= to);
      const priceMatch =
        (!minPrice || total >= parseFloat(minPrice)) &&
        (!maxPrice || total <= parseFloat(maxPrice));

      return dateMatch && priceMatch;
    });

    setFilteredOrders(filtered);
  };

  const downloadCSV = async () => {
    const header = 'Order ID,Customer Name,Date,Time,Status,Total,Payment Method\n';
    const rows = filteredOrders.map(o =>
      `${o.order_id},${o.customer_name},${o.date},${o.time},${o.status},${o.total},${o.payment_method}`
    );
    const csv = header + rows.join('\n');

    const fileUri = FileSystem.documentDirectory + 'orders.csv';
    await FileSystem.writeAsStringAsync(fileUri, csv, { encoding: FileSystem.EncodingType.UTF8 });
    await Sharing.shareAsync(fileUri);
  };

  const renderItem = ({ item }) => (
    <View style={styles.row}>
      <Text style={styles.cell}>{item.order_id}</Text>
      <Text style={styles.cell}>{item.customer_name}</Text>
      <Text style={styles.cell}>{item.date}</Text>
      <Text style={styles.cell}>{item.total}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Order History</Text>

      <TextInput placeholder="From Date (YYYY-MM-DD)" style={styles.input} value={fromDate} onChangeText={setFromDate} />
      <TextInput placeholder="To Date (YYYY-MM-DD)" style={styles.input} value={toDate} onChangeText={setToDate} />
      <TextInput placeholder="Min Price" style={styles.input} value={minPrice} onChangeText={setMinPrice} keyboardType="numeric" />
      <TextInput placeholder="Max Price" style={styles.input} value={maxPrice} onChangeText={setMaxPrice} keyboardType="numeric" />
      <Button title="Apply Filters" onPress={applyFilters} />
      <Button title="Download CSV" onPress={downloadCSV} />

      <View style={styles.tableHeader}>
        <Text style={styles.headerCell}>ID</Text>
        <Text style={styles.headerCell}>Customer</Text>
        <Text style={styles.headerCell}>Date</Text>
        <Text style={styles.headerCell}>Total</Text>
      </View>

      <FlatList
        data={filteredOrders}
        keyExtractor={item => item.order_id.toString()}
        renderItem={renderItem}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  input: { borderWidth: 1, borderColor: '#ccc', marginVertical: 8, padding: 8, borderRadius: 4 },
  tableHeader: { flexDirection: 'row', marginTop: 16, backgroundColor: '#ddd', padding: 8 },
  headerCell: { flex: 1, fontWeight: 'bold' },
  row: { flexDirection: 'row', padding: 8, borderBottomWidth: 1, borderColor: '#eee' },
  cell: { flex: 1 },
});
