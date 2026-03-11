import { useState } from "react";
import styles from "../styles/components/SearchBar.module.css";

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
    if (e.target.value.length === 0) {
      onSearch("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.wrapper}>
      <input
        type="text"
        placeholder="Search products..."
        value={query}
        onChange={handleChange}
        className={styles.input}
      />
      <button type="submit" className={styles.button}>
        Search
      </button>
    </form>
  );
};

export default SearchBar;
