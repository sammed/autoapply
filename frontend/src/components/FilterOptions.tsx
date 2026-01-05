import { ButtonGroup } from '@mui/material';
import { useState } from 'react';

interface Props {
  onFilter: (filters: any) => void;
}

export default function FilterOptions({ onFilter }: Props) {
  const [jobTitle, setJobTitle] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter({ jobTitle, location });
  };

  const handleClear = (e: React.FormEvent) => {
    e.preventDefault();
    setJobTitle('');
    setLocation('')
    onFilter({ jobTitle: '', location: '' });
  };
  
  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        type="text"
        placeholder="Job Title"
        value={jobTitle}
        onChange={(e) => setJobTitle(e.target.value)}
        className="mr-2 p-2 rounded bg-gray-800 text-white border border-gray-600 placeholder-gray-400"
      />
      <input
        type="text"
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        className="mr-2 p-2 rounded bg-gray-800 text-white border border-gray-600 placeholder-gray-400"
      />
      <ButtonGroup className='gap-4'>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Filter
        </button>
        <button type="button" className="bg-red-500 text-white p-2 rounded" onClick={handleClear}>
          clear
        </button>
      </ButtonGroup>
    </form>
  );
}
