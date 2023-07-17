import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as farHeart, faMapMarker } from '@fortawesome/free-solid-svg-icons';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import logo from '../immagini/1-PhotoRoom.png-PhotoRoom.png';
import { Link } from 'react-router-dom';

const Show = () => {
  const [parkData, setParkData] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [selectedPark, setSelectedPark] = useState(null);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://developer.nps.gov/api/v1/parks?api_key=pbpxP8auvcFE4xJlrKh22pVyP0k0BwhUnfqobYza');
        const data = await response.json();
        setParkData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching park data:', error);
        setLoading(false);
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
    } else {
      const updatedFavorites = favorites.filter((favoriteId) => favoriteId !== park.id);
      setFavorites(updatedFavorites);
    }
    setSelectedPark(null);
  };

  const openFavoritesModal = () => {
    setShowFavorites(true);
  };

  const closeFavoritesModal = () => {
    setShowFavorites(false);
  };

  const handleParkClick = (park) => {
    setSelectedPark(park);
    setShowCard(true);
  };

  const handleMapIconClick = (park) => {
    setSelectedPark(park);
    setShowCard(true);
  };

  const handlePhotoClick = () => {
    // Non fare nulla
  };

  const goBack = () => {
    window.history.back();
  };

  return (
    <div>
      <div className="sfondo">
        <div className="absolute top-0 left-0 mt-0 ml-4">
          <Link to="/shows">
            <img className="img-logo" src={logo} alt="" />
          </Link>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-16 sm:py-24 lg:py-32">
            <div className="flex items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 text-center titolobis sm:text-6xl focus-in-expand-fwd scrittabis">
                  <a href="http://www.thismanslife.co.uk" target="_blank" rel="noopener noreferrer">Discover your favourite Parks</a>
                </h2>
              </div>
              <div className="flex-grow"></div>
              <div className="ml-auto">
                <button className="ml-auto font-bold" onClick={goBack}>Back</button>
              </div>
            </div>

            <div className="mt-6">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search by park name"
                className="px-4 py-2 border border-gray-300 rounded-md w- sm:w-50"
              />
            </div>

            {showCard && selectedPark && (
              <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <div className="relative h-80 w-full overflow-hidden rounded-lg bg-white">
                    <img
                      src={selectedPark.images[0].url}
                      alt={selectedPark.images[0].altText}
                      className="h-full w-full object-cover object-center"
                      onClick={handlePhotoClick}
                    />
                    <div className="absolute top-2 right-2">
                      <FontAwesomeIcon
                        icon={favorites.includes(selectedPark.id) ? farHeart : farHeart}
                        className={`h-6 w-6 ${favorites.includes(selectedPark.id) ? 'text-red-500' : 'text-gray-300'}`}
                        onClick={() => addToFavorites(selectedPark)}
                        style={{ cursor: 'pointer' }}
                      />
                    </div>
                    <div className="absolute bottom-2 right-2 map-icon" onClick={() => setShowCard(false)}>
                      <FontAwesomeIcon icon={faMapMarker} className="h-6 w-6 text-gray-300" style={{ cursor: 'pointer' }} />
                    </div>
                  </div>
                  <h3 className="mt-6 text-xl text-gray-500 font-bold">
                    <span>{selectedPark.fullName}</span>
                  </h3>
                  <p className="text-base font-semibold text-gray-900">{selectedPark.description}</p>
                </div>
                <div className="relative z-0">
                  <div className="h-80">
                    <MapContainer center={[selectedPark.latitude, selectedPark.longitude]} zoom={10} scrollWheelZoom={false} className="h-full">
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <Marker position={[selectedPark.latitude, selectedPark.longitude]} />
                    </MapContainer>
                  </div>
                </div>
              </div>
            )}

            {!selectedPark && filteredParks && !loading && (
              <div className="mt-20 grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {filteredParks.length > 0 ? (
                  filteredParks.map((park) => (
                    <div key={park.id}>
                      <div className="group relative">
                        <div className="relative h-80 w-full overflow-hidden rounded-lg bg-white">
                          <img
                            src={park.images[0].url}
                            alt={park.images[0].altText}
                            className="h-full w-full object-cover object-center"
                            onClick={handlePhotoClick}
                          />
                          <div className="absolute top-2 right-2">
                            <FontAwesomeIcon
                              icon={favorites.includes(park.id) ? farHeart : farHeart}
                              className={`h-6 w-6 ${favorites.includes(park.id) ? 'text-red-500' : 'text-gray-300'}`}
                              onClick={() => addToFavorites(park)}
                              style={{ cursor: 'pointer' }}
                            />
                          </div>
                          <div className="absolute bottom-2 right-2 map-icon" onClick={() => handleMapIconClick(park)}>
                            <FontAwesomeIcon icon={faMapMarker} className="h-6 w-6 text-gray-300" style={{ cursor: 'pointer' }} />
                          </div>
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

      <button className="fixed bottom-4 right-4 bg-white rounded-full px-6 py-3 button-small" onClick={openFavoritesModal}>
        View Favorites ({favorites.length})
      </button>

      {showFavorites && (
        <div className="fixed bottom-4 right-4 bg-white p-8 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Favorite Parks</h2>
          {favorites.length > 0 ? (
            <ul>
              {favorites.map((favoriteId) => {
                const favoritePark = parkData?.data?.find((park) => park.id === favoriteId);
                return (
                  <li key={favoritePark.id} className="mb-4">
                    <h3 className="text-lg font-bold">{favoritePark.fullName}</h3>
                    <p>{favoritePark.description}</p>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p>No favorite parks.</p>
          )}
          <div className="mt-4">
            <button className="text-black rounded-full px-6 py-3 button-small" onClick={closeFavoritesModal}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Show;





