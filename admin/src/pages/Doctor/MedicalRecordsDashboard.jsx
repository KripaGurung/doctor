import React from 'react';
import Doctornavbar from '../../components/ui/Doctornavbar';
import DoctorSidebar from '../../components/ui/Doctorsidebar';

const MedicalRecordsDashboard = () => {
  // Mock data
  const stats = {
    totalRecords: 8,
    newThisMonth: 15
  };

  const allRecords = [
    { patient: 'John Smith', type: 'Lab Metals', date: '2025-09-20', status: 'Complete' },
    { patient: 'Michael Williams', type: 'Prescription', date: '2025-09-15', status: 'Complete' },
    { patient: 'Sarah Davis', type: 'Progress Notes', date: '2025-06-02', status: 'Complete' },
    
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <DoctorSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Doctornavbar />
        <div className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Medical Records</h1>
            <p className="text-gray-600 mb-8">View and manage patient medical records</p>

            {/* Stats Card */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-gray-500 text-sm font-medium">Total Records</h3>
                <p className="text-2xl font-bold text-gray-800">{stats.totalRecords}</p>
                <p className="text-sm text-green-600">{stats.newThisMonth} new this month</p>
              </div>
            </div>

            {/* All Medical Records Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">All Medical Records</h2>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patients</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {allRecords.map((record, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{record.patient}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${record.status === 'Complete' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                            {record.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                          <button className="text-gray-600 hover:text-gray-900">Edit</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalRecordsDashboard