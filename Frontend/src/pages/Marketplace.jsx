import { useState, useEffect } from "react";
import { useProduct } from "../context/ProductContext";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import ProductCard from "../components/ProductCard";
import LoadingSpinner from "../components/LoadingSpinner";
import Header from "../components/Header";
import toast from "react-hot-toast";
import styles from "../styles/pages/Marketplace.module.css";

const Marketplace = () => {
  const { getMarketplace, products, loading, totalPages } = useProduct();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    loadProducts();
  }, [search, category, currentPage]);

  const loadProducts = async () => {
    try {
      await getMarketplace(search, category, currentPage);
    } catch (err) {
      toast.error("Failed to load products");
    }
  };

  const handleSearch = (query) => {
    setSearch(query);
    setCurrentPage(1);
  };

  const handleCategoryChange = (newCategory) => {
    setCategory(newCategory);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading && products.length === 0) {
    return (
      <>
        <Header />
        <LoadingSpinner fullScreen />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className={styles.container}>
        <div className={styles.header}>
          <h1>Fashion Marketplace</h1>
          <p>Discover amazing products from top brands</p>
        </div>

        <div className={styles.filters}>
          <SearchBar onSearch={handleSearch} />
          <CategoryFilter
            selectedCategory={category}
            onCategoryChange={handleCategoryChange}
          />
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : products.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No products found. Try adjusting your search or filters.</p>
          </div>
        ) : (
          <>
            <div className={styles.grid}>
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className={styles.pagination}>
                <button
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={styles.paginationBtn}
                >
                  Previous
                </button>

                <div className={styles.paginationInfo}>
                  Page {currentPage} of {totalPages}
                </div>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={styles.paginationBtn}
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default Marketplace;
