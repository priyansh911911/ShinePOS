import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiX, FiArrowRight, FiCheck } from 'react-icons/fi';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const TransferModal = ({ order, onClose, onSuccess }) => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAvailableTables();
  }, []);

  const fetchAvailableTables = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/table/available/table`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTables(response.data.tables);
    } catch (error) {
      console.error('Fetch tables error:', error);
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${API_BASE_URL}/api/table/transfer`,
        { orderId: order._id, newTableId: selectedTable },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onSuccess();
      onClose();
    } catch (error) {
      setError(error.response?.data?.error || 'Failed to transfer table');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Transfer Order to New Table</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <FiX size={24} />
          </button>
        </div>

        <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-600">Order Number</p>
              <p className="font-semibold text-gray-900">{order.orderNumber}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Current Table</p>
              <p className="font-semibold text-gray-900">{order.tableNumber}</p>
            </div>
            <div>
              <p className="text-xs text-gray-600">Customer</p>
              <p className="font-semibold text-gray-900">{order.customerName}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center text-gray-400 mb-4">
          <FiArrowRight size={24} />
          <span className="ml-2 text-sm font-medium">Select New Table</span>
        </div>

        {tables.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No available tables found
          </div>
        ) : (
          <form onSubmit={handleTransfer}>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
              {tables.map((table) => (
                <div
                  key={table._id}
                  onClick={() => setSelectedTable(table._id)}
                  className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedTable === table._id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 bg-white'
                  }`}
                >
                  {selectedTable === table._id && (
                    <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full p-1">
                      <FiCheck size={14} />
                    </div>
                  )}
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900 mb-1">
                      {table.tableNumber}
                    </div>
                    <div className="text-xs text-gray-600 mb-1">
                      {table.location}
                    </div>
                    <div className="text-xs text-gray-500">
                      Capacity: {table.capacity}
                    </div>
                    <div className="mt-2">
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                        Available
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-4">
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
                disabled={loading || !selectedTable}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Transferring...' : 'Transfer to Selected Table'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default TransferModal;
