import { useState } from 'react';
import { useNavigate } from 'react-router';

export default function Searchbar() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [ariaInvalid, setAriaInvalid] = useState(null);

  const handleSearch = (event) => {
    event.preventDefault();
    if (typeof search === 'string' && search.trim().length !== 0) {
      navigate(`/search?query=${search}`);
      setSearch('');
    } else {
      setAriaInvalid(true);
    }
  };

  return (
    <form
      className="w-full max-w-md mx-auto my-4 p-4 bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-xl"
      onSubmit={handleSearch}
    >
      <div className="relative flex items-center">
        <div className="absolute left-3 text-gray-400 dark:text-gray-500">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
          </svg>
        </div>

        <input
          type="text"
          name="search"
          placeholder={
            ariaInvalid ? 'Devi cercare qualcosa' : 'Search a game...'
          }
          onChange={(event) => setSearch(event.target.value)}
          value={search}
          aria-invalid={ariaInvalid}
          className="w-full pl-10 pr-20 py-3 bg-transparent text-gray-800 dark:text-gray-200 placeholder-gray-500 dark:placeholder-gray-400 border-none focus:outline-none focus:ring-0"
        />

        <button
          type="submit"
          className="absolute right-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
        >
          Search
          <svg
            className="ml-1 w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            ></path>
          </svg>
        </button>
      </div>
    </form>
  );
}
