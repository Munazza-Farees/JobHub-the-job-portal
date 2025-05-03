import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const SearchResultsPage = () => {
  const [results, setResults] = useState([]);
  const location = useLocation();
  const searchTerm = new URLSearchParams(location.search).get('q'); // Get the search term from the URL

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await fetch(`https://your-backend-api.com/search?q=${searchTerm}`);
        const data = await response.json();
        setResults(data);
      } catch (error) {
        console.error("Error fetching search results: ", error);
      }
    };

    if (searchTerm) {
      fetchResults();
    }
  }, [searchTerm]);

  return (
    <div className="container">
      <h1>Search Results for "{searchTerm}"</h1>
      {results.length > 0 ? (
        <ul>
          {results.map((item, index) => (
            <li key={index}>
              <a href={item.link}>{item.title}</a>
            </li>
          ))}
        </ul>
      ) : (
        <p>No results found</p>
      )}
    </div>
  );
};

export default SearchResultsPage;
