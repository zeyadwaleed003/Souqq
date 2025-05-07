import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A product must have a name'],
  },
  description: String,
  sku: {
    type: String,
    required: [true, 'A product must have a sku'],
    unique: true,
  },
  price: {
    type: Number,
    required: [true, 'A product must have a price'],
  },
  stock: {
    type: Number,
    required: [true, 'A product must have a stock'],
  },
  brand: String,
  is_active: {
    type: Boolean,
    default: true,
  },
  // images - List of image URLs for the product
  // Categories - List of categories the product belongs to
  // created_at
  // updated_at
});

const Product = mongoose.model('Product', productSchema);

export default Product;
