import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useProduct } from "../context/ProductContext";
import Header from "../components/Header";
import LoadingSpinner from "../components/LoadingSpinner";
import toast from "react-hot-toast";
import styles from "../styles/pages/ProductForm.module.css";

const CATEGORIES = [
  "Topwear",
  "Bottomwear",
  "Footwear",
  "Accessories",
  "Winterwear",
];

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById, updateProduct, loading } = useProduct();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    status: "draft",
  });
  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    try {
      const data = await getProductById(id);
      setProduct(data);
      setFormData({
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        status: data.status,
      });
      setExistingImages(data.images || []);
    } catch (err) {
      toast.error("Failed to load product");
      navigate("/dashboard");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const totalImages = existingImages.length + images.length + files.length;

    if (totalImages > 5) {
      toast.error(
        `You can upload maximum 5 images total. Current: ${existingImages.length + images.length}`,
      );
      return;
    }

    const newImages = [...images, ...files];
    setImages(newImages);

    const readers = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then((urls) => {
      setPreviewUrls((prev) => [...prev, ...urls]);
    });
  };

  const removeNewImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.description ||
      !formData.price ||
      !formData.category
    ) {
      toast.error("Please fill in all fields");
      return;
    }

    if (existingImages.length + images.length === 0) {
      toast.error("Please keep or add at least one image");
      return;
    }

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("price", formData.price);
    data.append("category", formData.category);
    data.append("status", formData.status);

    // Only add new images to FormData
    images.forEach((image) => {
      data.append("images", image);
    });

    try {
      await updateProduct(id, data);
      toast.success("Product updated successfully!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update product");
    }
  };

  if (loading && !product) {
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
        <div className={styles.card}>
          <h1>Edit Product</h1>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Product Name *</label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Enter product name"
                className={styles.input}
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                placeholder="Enter product description"
                className={styles.textarea}
                value={formData.description}
                onChange={handleInputChange}
                rows="5"
                required
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="price">Price ($) *</label>
                <input
                  id="price"
                  type="number"
                  name="price"
                  placeholder="0.00"
                  className={styles.input}
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  className={styles.input}
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  className={styles.input}
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
            </div>

            {existingImages.length > 0 && (
              <div className={styles.formGroup}>
                <label>Current Images ({existingImages.length}/5)</label>
                <div className={styles.imagesGrid}>
                  {existingImages.map((url, index) => (
                    <div key={index} className={styles.imageItem}>
                      <img src={url} alt={`Current ${index + 1}`} />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        className={styles.removeImageBtn}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.formGroup}>
              <label htmlFor="images">
                Add More Images (Max {5 - existingImages.length} more)
              </label>
              <input
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                disabled={existingImages.length + images.length >= 5}
                className={styles.fileInput}
              />
              <p className={styles.helpText}>
                New images: {images.length}, Total:{" "}
                {existingImages.length + images.length}/5
              </p>
            </div>

            {previewUrls.length > 0 && (
              <div className={styles.imagePreviews}>
                <p>New Images Preview</p>
                <div className={styles.previewsGrid}>
                  {previewUrls.map((url, index) => (
                    <div key={index} className={styles.previewItem}>
                      <img src={url} alt={`Preview ${index + 1}`} />
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        className={styles.removeImageBtn}
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.formActions}>
              <button
                type="submit"
                disabled={loading}
                className={styles.submitBtn}
              >
                {loading ? "Updating..." : "Update Product"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className={styles.cancelBtn}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditProduct;
