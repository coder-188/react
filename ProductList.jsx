import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addItem } from './CartSlice';
import './ProductList.css';

function ProductList() {
  const dispatch = useDispatch();
  const cart = useSelector(state => state.cart.items);
  const [addedToCart, setAddedToCart] = useState({});

  const plantsArray = [
    {
      category: "Air Purifying Plants",
      plants: [
        { name: "Snake Plant", image: "https://images.unsplash.com/photo-1593482892290-f597cb88421b", cost: "$15", description: "Produces oxygen at night." },
        { name: "Spider Plant", image: "https://images.unsplash.com/photo-1572688484438-313046377750", cost: "$12", description: "Filters formaldehyde." }
      ]
    }
  ];

  const handleAddToCart = (plant) => {
    dispatch(addItem(plant));
    setAddedToCart((prevState) => ({
      ...prevState,
      [plant.name]: true,
    }));
  };

  return (
    <div className="product-list">
      <h2>Product Listing</h2>
      {plantsArray.map((category, index) => (
        <div key={index}>
          <h3>{category.category}</h3>
          <div className="plant-grid">
            {category.plants.map((plant, plantIndex) => (
              <div className="plant-card" key={plantIndex}>
                <img src={plant.image} alt={plant.name} />
                <h4>{plant.name}</h4>
                <p>{plant.cost}</p>
                <p>{plant.description}</p>
                <button
                  className={addedToCart[plant.name] ? "added-btn" : ""}
                  onClick={() => handleAddToCart(plant)}
                  disabled={!!addedToCart[plant.name]}
                >
                  {addedToCart[plant.name] ? "Added to Cart" : "Add to Cart"}
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductList;
