import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { useState } from "react";
import styles from "../styles/components/Header.module.css";

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          MarketNest
        </Link>

        <nav className={styles.nav}>
          {user?.role === "customer" && (
            <Link
              to="/marketplace"
              className={`${styles.navLink} ${isActive("/marketplace") ? styles.active : ""}`}
            >
              Marketplace
            </Link>
          )}
        </nav>

        <div className={styles.userSection}>
          {user ? (
            <>
              <div className={styles.userInfo}>
                <span className={styles.userName}>{user.name}</span>
                <span className={styles.userRole}>{user.role}</span>
              </div>
              <button onClick={handleLogout} className={styles.logoutBtn}>
                Logout
              </button>
            </>
          ) : (
            <div className={styles.authLinks}>
              <Link to="/login" className={styles.navLink}>
                Login
              </Link>
              <Link to="/register" className={styles.navLinkBtn}>
                Register
              </Link>
            </div>
          )}
        </div>

        <button
          className={styles.menuToggle}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>
      </div>

      {isMenuOpen && (
        <div className={styles.mobileMenu}>
          {user?.role === "customer" && (
            <Link to="/marketplace" onClick={() => setIsMenuOpen(false)}>
              Marketplace
            </Link>
          )}
          {user?.role === "brand" && (
            <>
              <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                Dashboard
              </Link>
              <Link to="/create-product" onClick={() => setIsMenuOpen(false)}>
                Add Product
              </Link>
            </>
          )}
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Logout
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;
