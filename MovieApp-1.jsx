import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaHeart } from "react-icons/fa";

export default function MovieApp() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const [favorites, setFavorites] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);

  // Sample Data
  useEffect(() => {
    const sampleMovies = [
      { id: 1, title: "Inception", year: "2010", poster: "https://m.media-amazon.com/images/I/51xJb6J4J3L._AC_.jpg" },
      { id: 2, title: "Interstellar", year: "2014", poster: "https://m.media-amazon.com/images/I/71n58GBi9qL._AC_SY679_.jpg" },
      { id: 3, title: "The Dark Knight", year: "2008", poster: "https://m.media-amazon.com/images/I/51k0qa6zYbL._AC_.jpg" },
    ];
    setMovies(sampleMovies);
  }, []);

  // Favorites in localStorage
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (movie) => {
    if (favorites.find((fav) => fav.id === movie.id)) {
      setFavorites(favorites.filter((fav) => fav.id !== movie.id));
    } else {
      setFavorites([...favorites, movie]);
    }
  };

  const filteredMovies = movies.filter((movie) =>
    movie.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">🎬 Movie App</h1>
        <FaHeart className="text-red-500 text-2xl" />
      </header>

      {/* Search */}
      <div className="flex items-center bg-gray-800 rounded-xl px-3 py-2 mb-6">
        <FaSearch className="text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search movies..."
          className="bg-transparent outline-none flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Movies Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {filteredMovies.map((movie) => (
          <motion.div
            key={movie.id}
            layout
            whileHover={{ scale: 1.05 }}
            className="bg-gray-800 rounded-xl overflow-hidden shadow-lg relative cursor-pointer"
          >
            <img
              src={movie.poster}
              alt={movie.title}
              className="w-full h-60 object-cover"
              onClick={() => setSelectedMovie(movie)}
            />
            <div className="p-2 flex items-center justify-between">
              <h2 className="text-sm font-semibold truncate">{movie.title}</h2>
              <button onClick={() => toggleFavorite(movie)}>
                <FaHeart
                  className={`ml-2 ${favorites.find((fav) => fav.id === movie.id) ? "text-red-500" : "text-gray-400"}`}
                />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal */}
      <AnimatePresence>
        {selectedMovie && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedMovie(null)}
          >
            <motion.div
              className="bg-gray-900 p-4 rounded-xl max-w-md w-full relative"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedMovie.poster}
                alt={selectedMovie.title}
                className="w-full h-80 object-cover rounded-lg"
              />
              <h2 className="mt-4 text-xl font-bold">{selectedMovie.title}</h2>
              <p className="text-gray-400">Year: {selectedMovie.year}</p>
              <button
                className="mt-4 w-full bg-red-500 py-2 rounded-lg font-semibold"
                onClick={() => toggleFavorite(selectedMovie)}
              >
                {favorites.find((fav) => fav.id === selectedMovie.id)
                  ? "Remove from Favorites"
                  : "Add to Favorites"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}