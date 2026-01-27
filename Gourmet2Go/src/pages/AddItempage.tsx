// src/pages/AddItempage.tsx
import { useState } from 'react';

export const AddItempage = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [inStock, setInStock] = useState(true);
  const [notes, setNotes] = useState('');

  const handleSubmit = () => {
    const item = {
      name: name,
      category: category,
      price: price,
      inStock: inStock,
      notes: notes
    };
    console.log(item);
    alert('Item added!');
  };

  return (
    <div>
      <header style={{ background: '#0066cc', color: 'white', padding: '20px' }}>
        <h2>Gourmet2Go</h2>
      </header>

      <div style={{ padding: '20px' }}>
        <p>Home &gt; Add Menu Items</p>

        <h1>Menu Item Form</h1>

        <div style={{ marginTop: '20px' }}>
          <label>Name</label>
          <br />
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            style={{ width: '300px', padding: '5px' }}
          />
        </div>

        <div style={{ marginTop: '15px' }}>
          <label>Category</label>
          <br />
          <input 
            type="text" 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            style={{ width: '300px', padding: '5px' }}
          />
        </div>

        <div style={{ marginTop: '15px' }}>
          <label>Price</label>
          <br />
          <input 
            type="number" 
            value={price} 
            onChange={(e) => setPrice(e.target.value)}
            style={{ width: '300px', padding: '5px' }}
          />
        </div>

        <div style={{ marginTop: '15px' }}>
          <input 
            type="checkbox" 
            checked={inStock} 
            onChange={(e) => setInStock(e.target.checked)}
          />
          <label> In Stock</label>
        </div>

        <div style={{ marginTop: '15px' }}>
          <label>Notes</label>
          <br />
          <textarea 
            value={notes} 
            onChange={(e) => setNotes(e.target.value)}
            style={{ width: '300px', height: '80px', padding: '5px' }}
          />
        </div>

        <div style={{ marginTop: '20px' }}>
          <button onClick={() => window.location.reload()}>Cancel</button>
          <button onClick={handleSubmit} style={{ marginLeft: '10px', background: '#0066cc', color: 'white', padding: '8px 15px', border: 'none' }}>
            Add Item
          </button>
        </div>
      </div>

      <footer style={{ background: '#0066cc', color: 'white', padding: '20px', marginTop: '50px' }}>
        <p>443 Northern Ave, Sault Ste Marie, ON Canada</p>
        <p>© 2025 Sault College</p>
      </footer>
    </div>
  );
};