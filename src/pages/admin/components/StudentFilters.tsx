import React from 'react';

interface StudentFiltersProps {
  filters: {
    department: string;
    year: string;
    batch: string;
  };
  onChange: (filters: any) => void;
}

const StudentFilters: React.FC<StudentFiltersProps> = ({ filters, onChange }) => {
  const departments = [
    'Computer Science',
    'Electronics',
    'Mechanical',
    'Civil',
    'Electrical',
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 4 }, (_, i) => (currentYear - i).toString());

  const batches = ['A', 'B', 'C', 'D'];

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm space-y-4">
      <h2 className="text-lg font-medium text-gray-900">Filter Students</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Department</label>
          <select
            value={filters.department}
            onChange={(e) => onChange({ ...filters, department: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">All Departments</option>
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Year</label>
          <select
            value={filters.year}
            onChange={(e) => onChange({ ...filters, year: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">All Years</option>
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Batch</label>
          <select
            value={filters.batch}
            onChange={(e) => onChange({ ...filters, batch: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">All Batches</option>
            {batches.map((batch) => (
              <option key={batch} value={batch}>
                Batch {batch}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default StudentFilters;