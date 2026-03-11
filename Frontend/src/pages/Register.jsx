import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import styles from "../styles/pages/Auth.module.css";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!role) {
      toast.error("Please select a role");
      return;
    }

    setIsLoading(true);

    try {
      const user = await register(name, email, password, role);
      toast.success("Account created successfully!");
      navigate(user.role === "brand" ? "/dashboard" : "/marketplace");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.logo}>MarketNest</h1>
          <p className={styles.subtitle}>Join the fashion marketplace</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.label}>
              Full Name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Enter Name"
              className={styles.input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="example@gmail.com"
              className={styles.input}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Min 6 characters"
              className={styles.input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>I want to join as</label>
            <div className={styles.roleSelector}>
              <button
                type="button"
                className={`${styles.roleBtn} ${role === "customer" ? styles.active : ""}`}
                onClick={() => setRole("customer")}
              >
                <span className={styles.roleIcon}>🛍️</span>
                <span className={styles.roleLabel}>Customer</span>
                <span className={styles.roleDesc}>Browse & shop fashion</span>
              </button>
              <button
                type="button"
                className={`${styles.roleBtn} ${role === "brand" ? styles.active : ""}`}
                onClick={() => setRole("brand")}
              >
                <span className={styles.roleIcon}>🏷️</span>
                <span className={styles.roleLabel}>Brand</span>
                <span className={styles.roleDesc}>Sell your products</span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className={styles.spinner}></span>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <p className={styles.footer}>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
