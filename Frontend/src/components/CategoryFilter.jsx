import styles from "../styles/components/CategoryFilter.module.css";

const CATEGORIES = [
  "All Categories",
  "Topwear",
  "Bottomwear",
  "Footwear",
  "Accessories",
  "Winterwear",
];

const CategoryFilter = ({ selectedCategory, onCategoryChange }) => {
  return (
    <div className={styles.wrapper}>
      <label htmlFor="category" className={styles.label}>
        Category
      </label>
      <select
        id="category"
        value={selectedCategory}
        onChange={(e) => onCategoryChange(e.target.value)}
        className={styles.select}
      >
        {CATEGORIES.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategoryFilter;
