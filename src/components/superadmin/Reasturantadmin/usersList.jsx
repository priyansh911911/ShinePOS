import React, { useState } from 'react'
import { FiToggleLeft, FiToggleRight, FiEdit2, FiTrash2 } from 'react-icons/fi'
import { useUsers } from './hooks/useUsers'
import EditUser from './edituser'

const UsersList = () => {
  const [editingUser, setEditingUser] = useState(null);
  const {
    filteredUsers,
    restaurants,
    selectedRestaurant,
    setSelectedRestaurant,
    loading,
    error,
    toggleUserStatus,
    deleteUser,
    users,
    fetchAllUsers
  } = useUsers();

  const handleEditSuccess = () => {
    setEditingUser(null);
    fetchAllUsers();
  };

  if (editingUser) {
    return (
      <div className="p-6">
        <EditUser
          user={editingUser}
          onBack={() => setEditingUser(null)}
          onSuccess={handleEditSuccess}
        />
      </div>
    );
  }

  if (loading) return <div className="p-6 text-center">Loading users...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">All Restaurant Users</h2>
            <select
              value={selectedRestaurant}
              onChange={(e) => setSelectedRestaurant(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Restaurants</option>
              {restaurants.map((restaurant) => (
                <option key={restaurant._id} value={restaurant._id}>
                  {restaurant.restaurantName}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Restaurant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center">
                    <div className="text-gray-500">
                      {users.length === 0 ? (
                        <div>
                          <p className="font-medium">No users found in any restaurant</p>
                          <p className="text-sm mt-1">Please create users through the restaurant admin panel first</p>
                        </div>
                      ) : (
                        'No users found for selected restaurant'
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={`${user.restaurantId}-${user._id}`}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.restaurantName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {user._id.toString().endsWith('_admin') ? (
                        <span className="text-gray-400 text-sm">N/A</span>
                      ) : (
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => toggleUserStatus(user)}
                            className={user.isActive ? 'text-green-600 hover:text-green-900' : 'text-red-600 hover:text-red-900'}
                            title={user.isActive ? 'Deactivate' : 'Activate'}
                          >
                            {user.isActive ? <FiToggleRight size={20} /> : <FiToggleLeft size={20} />}
                          </button>
                          <button
                            onClick={() => setEditingUser(user)}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Edit"
                          >
                            <FiEdit2 size={18} />
                          </button>
                          <button
                            onClick={() => deleteUser(user)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default UsersList