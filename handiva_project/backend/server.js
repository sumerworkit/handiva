const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const path = require('path');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json());

// Simple connection (configure MONGO_URI in .env when deploying)
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/handiva';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=> console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB error', err));

// Basic models: User, Product, Order (simple)
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, index: true },
  passwordHash: String,
  role: { type: String, enum: ['buyer','seller','admin'], default: 'buyer' },
  address: [{ label: String, addressLine: String, city: String, state: String, pincode: String }],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
},{ timestamps: true });
const User = mongoose.model('User', UserSchema);

const ProductSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  currency: { type: String, default: 'INR' },
  images: [String],
  material: String,
  category: String,
  artisan: { name: String, origin: String, about: String },
  stock: Number,
  tags: [String],
  telangana: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
},{ timestamps: true });
const Product = mongoose.model('Product', ProductSchema);

const OrderSchema = new mongoose.Schema({
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  items: [{ product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }, qty: Number, price: Number }],
  totalAmount: Number,
  status: { type: String, enum: ['pending','processing','shipped','delivered','cancelled'], default: 'pending' },
  paymentMethod: String,
  address: Object
},{ timestamps: true });
const Order = mongoose.model('Order', OrderSchema);

// Simple routes for demo
app.get('/api/ping', (req,res)=> res.json({ ok: true, message: 'Handiva API is alive' }));

// Products: list with filters (material, min/max price, telangana)
app.get('/api/products', async (req,res)=>{
  const { material, minPrice, maxPrice, telangana, q, category } = req.query;
  const filter = {};
  if(material) filter.material = material;
  if(category) filter.category = category;
  if(telangana === 'true') filter.telangana = true;
  if(q) filter.$text = { $search: q };
  if(minPrice || maxPrice){
    filter.price = {};
    if(minPrice) filter.price.$gte = Number(minPrice);
    if(maxPrice) filter.price.$lte = Number(maxPrice);
  }
  try{
    const products = await Product.find(filter).limit(100).lean();
    res.json(products);
  }catch(e){ res.status(500).json({ error: e.message }); }
});

// Product detail
app.get('/api/products/:id', async (req,res)=>{
  try{
    const p = await Product.findById(req.params.id);
    if(!p) return res.status(404).json({ error: 'Not found' });
    res.json(p);
  }catch(e){ res.status(500).json({ error: e.message }); }
});

// Simple search suggestions (mock)
app.get('/api/suggestions', (req,res)=>{
  const q = req.query.q || '';
  const suggestions = [
    'Wool Shawl', 'Handloom Saree', 'Terracotta Pot', 'Jute Bag','Knitted Sweater'
  ].filter(s => s.toLowerCase().includes(q.toLowerCase())).slice(0,6);
  res.json({ suggestions });
});

// Tribal contact endpoint (stores messages)
const ContactSchema = new mongoose.Schema({
  name: String, email: String, message: String, region: String, createdAt: { type: Date, default: Date.now }
});
const Contact = mongoose.model('Contact', ContactSchema);
app.post('/api/tribal-contact', async (req,res)=>{
  const { name,email,message,region } = req.body;
  if(!name || !message) return res.status(400).json({ error: 'Missing fields' });
  const c = new Contact({ name,email,message,region });
  await c.save();
  res.json({ success: true, id: c._id });
});

// Add product (Seller upload)
app.post('/api/products', async (req, res) => {
  try {
    const { title, description, price, material, telangana } = req.body;
    if (!title || !price) {
      return res.status(400).json({ error: 'Title and price are required' });
    }

    const product = new Product({
      title,
      description,
      price,
      material,
      telangana: telangana === 'true' // converts string to boolean
    });

    await product.save();
    res.json({ success: true, message: 'Product saved successfully', product });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});


// Static frontend (for demo serve)
app.use('/', express.static(path.join(__dirname, '..', 'frontend')));

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log('Server running on', PORT));
