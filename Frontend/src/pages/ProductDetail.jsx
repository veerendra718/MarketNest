import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProduct } from "../context/ProductContext";
import LoadingSpinner from "../components/LoadingSpinner";
import Header from "../components/Header";
import toast from "react-hot-toast";
import styles from "../styles/pages/ProductDetail.module.css";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById, loading } = useProduct();
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const data = await getProductById(id);
      setProduct(data);
    } catch (err) {
      toast.error("Failed to load product details");
      navigate("/marketplace");
    }
  };

  if (loading || !product) {
    return (
      <>
        <Header />
        <LoadingSpinner fullScreen />
      </>
    );
  }

  const images = product.images || [];
  const mainImage =
    images[selectedImage] ||
    "https://via.placeholder.com/500x500?text=No+Image";
  const brandName = product.brand?.name || "Unknown Brand";
  const brandEmail = product.brand?.email || "N/A";

  return (
    <>
      <Header />
      <div className={styles.container}>
        <button onClick={() => navigate(-1)} className={styles.backBtn}>
          ← Back
        </button>

        <div className={styles.detail}>
          <div className={styles.imagesSection}>
            <div className={styles.mainImage}>
              <img src={mainImage} alt={product.name} />
            </div>
            {images.length > 1 && (
              <div className={styles.thumbnails}>
                {images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className={`${styles.thumbnail} ${selectedImage === index ? styles.active : ""}`}
                    onClick={() => setSelectedImage(index)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className={styles.detailsSection}>
            <div className={styles.meta}>
              <span className={styles.statusBadge}>{product.status}</span>
              <span className={styles.categoryBadge}>{product.category}</span>
            </div>

            <h1 className={styles.title}>{product.name}</h1>

            <div className={styles.brandInfo}>
              <p>
                <strong>Brand:</strong> {brandName}
              </p>
              <p>
                <strong>Email:</strong> {brandEmail}
              </p>
            </div>

            <p className={styles.description}>{product.description}</p>

            <div className={styles.priceSection}>
              <span className={styles.price}>₹{product.price}</span>
            </div>

            <div className={styles.infoBox}>
              <h3>Product Information</h3>
              <ul>
                <li>
                  Status: <strong>{product.status}</strong>
                </li>
                <li>
                  Category: <strong>{product.category}</strong>
                </li>
                <li>
                  Created:{" "}
                  <strong>
                    {new Date(product.createdAt).toLocaleDateString()}
                  </strong>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
