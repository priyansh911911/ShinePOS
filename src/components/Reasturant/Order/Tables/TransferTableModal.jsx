import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiX, FiArrowRight } from 'react-icons/fi';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const TransferTableModal = ({ table, onClose, onTransferSuccess }) => {
  const [orders, setOrders] = useState([]);
  const [availableTables, setAvailableTables] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState('');
  const [selectedTable, setSelectedTable] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
    fetchAvailableTables();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const tableOrders = response.data.orders.filter(
        order => order.tableId === table._id && order.status !== 'PAID' && order.status !== 'CANCELLED'
      );
      setOrders(tableOrders);
    } catch (error) {
      console.error('Fetch orders error:', error);
    }
  };

  const fetchAvailableTables = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/tables/tables/available`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAvailableTables(response.data.tables);
    } catch (error) {
      console.error('Fetch available tables error:', error);
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_BASE_URL}/api/tables/transfer`,
        { orderId: selectedOrder, newTableId: selectedTable },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onTransferSuccess();
      onClose();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to transfer table');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Transfer Table {table.tableNumber}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX size={24} />
          </button>
        </div>

        {orders.length === 0 ? (
          <p className="text-gray-600">No active orders on this table</p>
        ) : (
          <form onSubmit={handleTransfer} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Order
              </label>
              <select
                value={selectedOrder}
                onChange={(e) => setSelectedOrder(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              >
                <option value="">Choose an order...</option>
                {orders.map((order) => (
                  <option key={order._id} value={order._id}>
                    {order.orderNumber} - {order.customerName} (₹{order.totalAmount})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-center text-gray-400">
              <FiArrowRight size={24} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Transfer to Table
              </label>
              <select
                value={selectedTable}
                onChange={(e) => setSelectedTable(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              >
                <option value="">Choose a table...</option>
                {availableTables.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.tableNumber} - {t.location} (Capacity: {t.capacity})
                  </option>
                ))}
              </select>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Transferring...' : 'Transfer'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default TransferTableModal;
