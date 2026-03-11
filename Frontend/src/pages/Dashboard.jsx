import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useProduct } from "../context/ProductContext";
import LoadingSpinner from "../components/LoadingSpinner";
import Header from "../components/Header";
import ConfirmModal from "../components/ConfirmModal";
import toast from "react-hot-toast";
import styles from "../styles/pages/Dashboard.module.css";

const Dashboard = () => {
  const { getMyProducts, getDashboardStats, products, loading, deleteProduct } =
    useProduct();
  const [stats, setStats] = useState({ total: 0, published: 0, archived: 0 });
  const [deleting, setDeleting] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      await getMyProducts();
      const statsData = await getDashboardStats();
      setStats(statsData);
    } catch (err) {
      toast.error("Failed to load dashboard");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    setDeleting(deleteTarget._id);
    try {
      await deleteProduct(deleteTarget._id);
      toast.success("Product deleted successfully");
      await loadDashboard();
    } catch (err) {
      toast.error("Failed to delete product");
    } finally {
      setDeleting(null);
      setDeleteTarget(null);
    }
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
          <h1>Brand Dashboard</h1>
          <Link to="/create-product" className={styles.addBtn}>
            + Add New Product
          </Link>
        </div>

        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statIcon}>📦</div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Total Products</p>
              <p className={styles.statValue}>{stats.total}</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>✅</div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Published</p>
              <p className={styles.statValue}>{stats.published}</p>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statIcon}>📁</div>
            <div className={styles.statContent}>
              <p className={styles.statLabel}>Archived</p>
              <p className={styles.statValue}>{stats.archived}</p>
            </div>
          </div>
        </div>

        <div className={styles.productsSection}>
          <h2>Your Products</h2>

          {loading ? (
            <LoadingSpinner />
          ) : products.length === 0 ? (
            <div className={styles.emptyState}>
              <p>You haven't created any products yet.</p>
              <Link to="/create-product" className={styles.addBtn}>
                Create Your First Product
              </Link>
            </div>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id}>
                      <td>
                        <img
                          src={
                            product.images?.[0] ||
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='50' height='50'%3E%3Crect width='50' height='50' fill='%23ddd'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23999' font-size='10'%3ENo img%3C/text%3E%3C/svg%3E"
                          }
                          alt={product.name}
                          className={styles.tableImage}
                        />
                      </td>
                      <td>{product.name}</td>
                      <td>₹{product.price}</td>
                      <td>{product.category}</td>
                      <td>
                        <span
                          className={`${styles.statusBadge} ${styles[product.status]}`}
                        >
                          {product.status}
                        </span>
                      </td>
                      <td>
                        <Link
                          to={`/edit-product/${product._id}`}
                          className={styles.editBtn}
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => setDeleteTarget(product)}
                          disabled={deleting === product._id}
                          className={styles.deleteBtn}
                        >
                          {deleting === product._id ? "Deleting..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {deleteTarget && (
        <ConfirmModal
          title="Delete Product"
          message={`Are you sure you want to delete "${deleteTarget.name}"? This action cannot be undone.`}
          confirmText="Delete"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting === deleteTarget._id}
        />
      )}
    </>
  );
};

export default Dashboard;
