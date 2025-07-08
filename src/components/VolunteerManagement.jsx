import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { updateVolunteerStatus } from '../services/volunteerService';

const { 
  FiUsers, FiRefreshCw, FiSearch, FiFilter, FiCheckCircle, 
  FiXCircle, FiClock, FiCalendar, FiPhone, FiMail, FiEdit, 
  FiSave, FiX
} = FiIcons;

const VolunteerManagement = ({ volunteers = [], isLoading = false, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [editingId, setEditingId] = useState(null);
  const [editNotes, setEditNotes] = useState('');
  const [editStatus, setEditStatus] = useState('');
  
  const handleEditVolunteer = (volunteer) => {
    setEditingId(volunteer.id);
    setEditNotes(volunteer.notes || '');
    setEditStatus(volunteer.status || 'new');
  };
  
  const handleCancelEdit = () => {
    setEditingId(null);
    setEditNotes('');
    setEditStatus('');
  };
  
  const handleSaveVolunteer = async (volunteerId) => {
    try {
      await updateVolunteerStatus(volunteerId, editStatus, editNotes);
      setEditingId(null);
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Failed to update volunteer:', error);
    }
  };
  
  const filteredVolunteers = volunteers.filter(volunteer => {
    const matchesSearch = 
      volunteer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      volunteer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      volunteer.phone?.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = 
      statusFilter === 'all' || 
      volunteer.status === statusFilter;
      
    return matchesSearch && matchesStatus;
  });
  
  const sortedVolunteers = [...filteredVolunteers].sort((a, b) => {
    if (sortBy === 'date') {
      const dateA = new Date(a.created_at);
      const dateB = new Date(b.created_at);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    } else if (sortBy === 'name') {
      return sortOrder === 'asc' 
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name);
    }
    return 0;
  });
  
  const getStatusBadge = (status) => {
    const statusMap = {
      new: { color: 'blue', icon: FiClock, text: 'New' },
      contacted: { color: 'yellow', icon: FiPhone, text: 'Contacted' },
      scheduled: { color: 'purple', icon: FiCalendar, text: 'Scheduled' },
      active: { color: 'green', icon: FiCheckCircle, text: 'Active' },
      inactive: { color: 'red', icon: FiXCircle, text: 'Inactive' }
    };
    
    const statusInfo = statusMap[status] || statusMap.new;
    
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${statusInfo.color}-100 text-${statusInfo.color}-800`}>
        <SafeIcon icon={statusInfo.icon} className="w-3 h-3 mr-1" />
        {statusInfo.text}
      </span>
    );
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Volunteer Management</h2>
        <button 
          onClick={onRefresh}
          disabled={isLoading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 disabled:opacity-50"
        >
          <SafeIcon icon={FiRefreshCw} className={isLoading ? 'animate-spin' : ''} />
          <span>{isLoading ? 'Loading...' : 'Refresh'}</span>
        </button>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <SafeIcon icon={FiSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search volunteers..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="flex space-x-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="scheduled">Scheduled</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          
          <div className="relative">
            <button
              onClick={toggleSortOrder}
              className="flex items-center space-x-1 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <SafeIcon icon={FiFilter} />
              <span>{sortOrder === 'desc' ? 'Newest' : 'Oldest'}</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Volunteer List */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading volunteers...</p>
        </div>
      ) : sortedVolunteers.length === 0 ? (
        <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
          <SafeIcon icon={FiUsers} className="text-6xl text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Volunteers Found</h3>
          <p className="text-gray-600">
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Volunteers who sign up through your chatbot will appear here'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Volunteer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Availability
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedVolunteers.map((volunteer) => (
                <tr key={volunteer.id} className="hover:bg-gray-50">
                  {editingId === volunteer.id ? (
                    // Editing mode
                    <td colSpan="6" className="px-6 py-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-lg font-medium text-gray-900">
                            Editing {volunteer.name}
                          </h4>
                          <button 
                            onClick={handleCancelEdit}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <SafeIcon icon={FiX} />
                          </button>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Status
                          </label>
                          <select
                            value={editStatus}
                            onChange={(e) => setEditStatus(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="scheduled">Scheduled</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </select>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Notes
                          </label>
                          <textarea
                            value={editNotes}
                            onChange={(e) => setEditNotes(e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            placeholder="Add notes about this volunteer..."
                          />
                        </div>
                        
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={handleCancelEdit}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => handleSaveVolunteer(volunteer.id)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-1"
                          >
                            <SafeIcon icon={FiSave} />
                            <span>Save Changes</span>
                          </button>
                        </div>
                      </div>
                    </td>
                  ) : (
                    // View mode
                    <>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{volunteer.name}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col space-y-1 text-sm text-gray-500">
                          <a href={`mailto:${volunteer.email}`} className="flex items-center hover:text-blue-600">
                            <SafeIcon icon={FiMail} className="mr-1" />
                            {volunteer.email}
                          </a>
                          {volunteer.phone && (
                            <a href={`tel:${volunteer.phone}`} className="flex items-center hover:text-blue-600">
                              <SafeIcon icon={FiPhone} className="mr-1" />
                              {volunteer.phone}
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {volunteer.available_days || 'Flexible'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(volunteer.status || 'new')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {formatDate(volunteer.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => handleEditVolunteer(volunteer)}
                          className="text-blue-600 hover:text-blue-900 flex items-center"
                        >
                          <SafeIcon icon={FiEdit} className="mr-1" />
                          Edit
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VolunteerManagement;