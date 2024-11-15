// components/SearchBar.js
import  { useState } from 'react';

const API = import.meta.env.VITE_API_URL || `http://localhost:3001`;

const SearchBar = ({setRecipeData}) => {
  const [searchTerm, setSearchTerm] = useState('');
 
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
       // console.log(encodeURIComponent(searchTerm));
      const response = await fetch(`${API}/api/recipe/search?q=${encodeURIComponent(searchTerm)}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      // console.log(data);
      setRecipeData(data);
    } catch (error) {
      console.error('Error searching recipes:', error);
    }

    setLoading(false);
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input
          type="text"
          value={searchTerm}
          style={{color: '#000000'}}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search recipes..."
        />
        <button type="submit" >Search</button>
      </form>

      {loading ? (<p>Loading...</p>) :null}
    </div>
  );
};

export default SearchBar;
