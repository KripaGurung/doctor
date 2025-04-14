// src/components/ui/EditRecordModal.jsx
import React from 'react';

const EditRecordModal = ({ record, onClose, onUpdate }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Edit Medical Record</h2>
          <p className="text-gray-600 mb-6">Update the medical record information for {record.patient}.</p>
          
          <form onSubmit={(e) => {
            e.preventDefault();
            onUpdate(record);
          }}>
            <div className="grid grid-cols-1 gap-6 mb-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Patient</label>
                <div className="bg-gray-100 p-3 rounded">{record.patient}</div>
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">Record Type</label>
                <select 
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue={record.type}
                >
                  <option value="Lab Results">Lab Results</option>
                  <option value="Prescription">Prescription</option>
                  <option value="Progress Notes">Progress Notes</option>
                  <option value="Diagnosis">Diagnosis</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">Date</label>
                <input 
                  type="date" 
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue={record.date}
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">Notes</label>
                <textarea 
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                  defaultValue="Normal test results. Cholesterol levels are within range."
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">Include any symptoms, observations, or follow-up recommendations</label>
                <textarea 
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                  placeholder="Enter additional information here..."
                />
              </div>
              
              <div>
                <label className="block text-gray-700 font-medium mb-2">Attachments</label>
                <div className="border-2 border-dashed border-gray-300 rounded p-4 text-center">
                  <input type="file" className="hidden" id="file-upload" />
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-gray-600">Choose Files</span>
                      <span className="text-sm text-gray-500 mt-1">No file chosen</span>
                    </div>
                  </label>
                </div>
                <p className="text-sm text-gray-500 mt-2">Upload new attachments or replace existing ones</p>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <button 
                type="button" 
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Update Record
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditRecordModal;