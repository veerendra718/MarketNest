import { Link } from "react-router-dom";
import styles from "../styles/components/ProductCard.module.css";

const ProductCard = ({ product }) => {
  const imageUrl =
    product.images?.[0] || "https://via.placeholder.com/300x300?text=No+Image";
  const brandName = product.brand?.name || "Unknown Brand";

  return (
    <Link to={`/product/${product._id}`} className={styles.card}>
      <div className={styles.imageWrapper}>
        <img src={imageUrl} alt={product.name} className={styles.image} />
        <span className={styles.statusBadge}>{product.status}</span>
      </div>
      <div className={styles.info}>
        <h3 className={styles.name}>{product.name}</h3>
        <p className={styles.brand}>{brandName}</p>
        <p className={styles.description}>
          {product.description?.substring(0, 60)}...
        </p>
        <div className={styles.footer}>
          <span className={styles.price}>₹{product.price}</span>
          <span className={styles.category}>{product.category}</span>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
