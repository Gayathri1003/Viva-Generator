import React from 'react';
import { Icons } from '../../../components/icons';
import toast from 'react-hot-toast';

const DocumentUploader: React.FC = () => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // TODO: Implement file upload logic
      toast.success('Document uploaded successfully');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-lg font-medium mb-4">Upload Document</h2>
      <label className="block">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-indigo-500 transition-colors">
          <Icons.Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">
            Drag and drop your document here, or click to select a file
          </p>
          <input
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
          />
        </div>
      </label>
    </div>
  );
};

export default DocumentUploader;