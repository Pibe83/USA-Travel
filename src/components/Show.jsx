import React, { useEffect, useState } from 'react';
import logo from '../immagini/1-PhotoRoom.png-PhotoRoom.png';

const Show = () => {
  const [parkData, setParkData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://developer.nps.gov/api/v1/parks?api_key=pbpxP8auvcFE4xJlrKh22pVyP0k0BwhUnfqobYza');
        const data = await response.json();
        setParkData(data);
      } catch (error) {
        console.error('Error fetching park data:', error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredParks = parkData?.data?.filter((park) =>
    park.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToFavorites = (park) => {
    if (!favorites.includes(park.id)) {
      setFavorites([...favorites, park.id]);
    }
  };

  const removeFromFavorites = (park) => {
    const updatedFavorites = favorites.filter((favoriteId) => favoriteId !== park.id);
    setFavorites(updatedFavorites);
  };

  const openFavoritesModal = () => {
    setShowFavorites(true);
  };

  const closeFavoritesModal = () => {
    setShowFavorites(false);
  };

  return (
    <div>
      <div className="sfondo">
        <div className="absolute top-0 left-0 mt-4 ml-4">
          <img className="img-logo" src={logo} alt="" />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl py-16 sm:py-24 lg:max-w-none lg:py-32">
            <h2 class="text-2xl font-bold text-gray-900 text-center titolobis sm:text-6xl focus-in-expand-fwd scrittabis">
            <a href="http://www.thismanslife.co.uk" target="_blank">Discover your favourite Parks</a>
            </h2>


            <div className="mt-6">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search by park name"
                className="px-4 py-2 border border-gray-300 rounded-md w-50"
              />
            </div>

            {filteredParks && (
              <div className="mt-20 grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {filteredParks.length > 0 ? (
                  filteredParks.map((park) => (
                    <div key={park.id}>
                      <div className="group relative">
                        <div className="relative h-80 w-full overflow-hidden rounded-lg bg-white sm:aspect-h-1 sm:aspect-w-2 lg:aspect-h-1 lg:aspect-w-1 group-hover:opacity-75 sm:h-64">
                          <img
                            src={park.images[0].url}
                            alt={park.images[0].altText}
                            className="h-full w-full object-cover object-center"
                          />
                          {favorites.includes(park.id) ? (
                            <div className="absolute top-2 right-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-red-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                onClick={() => removeFromFavorites(park)}
                                style={{ cursor: 'pointer' }}
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </div>
                          ) : (
                            <div className="absolute top-2 right-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6 text-gray-300"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                onClick={() => addToFavorites(park)}
                                style={{ cursor: 'pointer' }}
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <h3 className="mt-6 text-xl text-gray-500 font-bold">
                          <span>{park.fullName}</span>
                        </h3>
                        <p className="text-base font-semibold text-gray-900">{park.description}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No parks found.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="fixed bottom-0 right-0 p-4">
        <button className="text-black rounded-full px-6 py-3 button-small" onClick={openFavoritesModal}>
          View Favorites ({favorites.length})
        </button>
      </div>

      {showFavorites && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-900 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Favorites</h2>
            {favorites.length > 0 ? (
              <ul>
                {favorites.map((favoriteId) => {
                  const favoritePark = parkData.data.find((park) => park.id === favoriteId);
                  return <li key={favoriteId}>{favoritePark.fullName}</li>;
                })}
              </ul>
            ) : (
              <p>No favorites selected.</p>
            )}
            <button className="text-white rounded-full px-6 py-3 mt-4 button-small" onClick={closeFavoritesModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Show;




