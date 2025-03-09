import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export const Home = () => {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchItem, setSearchItem] = useState("");
  const [favorites, setFavorites] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("https://foodrecipe-fullstack.onrender.com/recipes/");
        setData(response.data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const response = await axios.get("https://foodrecipe-fullstack.onrender.com/favorites", {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Extract only recipe IDs
            const favoriteRecipeIds = response.data.map(fav => fav.recipeId._id);
            setFavorites(favoriteRecipeIds);
        } catch (error) {
            console.error("Error fetching favorites:", error);
        }
    };

    fetchFavorites();
}, []);


  // function to toggle the like button
  const toggleFavorite = async (recipeId) => {
    try {
        const token = localStorage.getItem("token"); 
        if (!token) throw new Error("No token found");

        const response = await axios.post("https://foodrecipe-fullstack.onrender.com/favorites/toggle", 
            { recipeId }, 
            { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data.message === "Removed from favorites") {
            setFavorites(favorites.filter((id) => id !== recipeId));
        } else {
            setFavorites([...favorites, recipeId]);
        }
    } catch (error) {
        console.error("Error toggling favorite:", error);
    }
};

  

  // Filtering based on search input
  const filterData = data.filter((item) =>
    item.name.toLowerCase().includes(searchItem.toLowerCase())
  );

  // Pagination logic
  const recordPerPage = 4;
  const lastIndex = currentPage * recordPerPage;
  const firstIndex = lastIndex - recordPerPage;
  const records = filterData.slice(firstIndex, lastIndex);
  const npage = Math.ceil(filterData.length / recordPerPage);
  const numbers = [...Array(npage + 1).keys()].slice(1);

  return (
    <>
    {/* Quote on the top-left, but pushed below the navbar */}
    <span 
          style={{
            position: "absolute",  
            top: "100px",           // Adjust to avoid navbar overlap
            left: "20px",         
            fontSize: "40px",     
            fontWeight: "bold",   
            color: "#333",        
          }}
        >
          <p>Discover delicious recipes</p><p>cook like a pro</p><p> and explore a world of flavors—all in one place! </p>
        </span>
  
        {/* Image on the right */}
        <img 
          src="pic1.png" 
          style={{ display: "block", marginLeft: "auto", marginTop: "100px" }} // Push image down too
        />
  
        {/* SVG Background */}
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1440 320" 
          style={{ marginTop: "-170px" }}  
        >
          <path fill="#FCBF49" fillOpacity="1" d="M0,32L40,48C80,64,160,96,240,112C320,128,400,128,480,144C560,160,640,192,720,176C800,160,880,96,960,90.7C1040,85,1120,139,1200,186.7C1280,235,1360,277,1400,298.7L1440,320L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"></path>
        </svg>

          <br /><br /><br />
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search recipes..."
        value={searchItem}
        onChange={(e) => setSearchItem(e.target.value)}
        style={{
          display: "block",
          margin: "10px auto",
          padding: "8px",
          width: "50%",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      />

      {/* Recipe List */}
      <div className="row mx-4" style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
      {records.length > 0 ? (
  records.map((item) => (
    <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={item._id}>
      <div className="card" style={{ width: '280px', height: "350px" }}>
        <Link to={`recipe/${item._id}`}>
        <img 
          src={item.image ? item.image : "cake.jpeg"}
          className="card-img-top" 
          alt="Recipe" 
          style={{ height: '200px', objectFit: "cover" }} 
        />
        </Link>
        <div className="card-body">
          <h5 className="card-title">{item.name}</h5>
          <p className="card-text"><strong>{item.timeToCook}</strong></p>
          {/* <Link to={`/update_recipe/${item._id}`} className="btn btn-primary">Update</Link> */}

          {/* Favorite Icon */}
          <button 
            onClick={() => toggleFavorite(item._id)} 
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "24px",
              color: favorites.includes(item._id) ? "red" : "gray"
            }}
          >
            {favorites.includes(item._id) ? "❤️" : "🤍"}
          </button>
        </div>
      </div>
    </div>
  ))
) : (
  <div className="col-12 text-center">
    <h3>No results available</h3>
  </div>
)}

      </div>

      {/* Pagination */}
      <nav style={{ display: "flex", justifyContent: "center", marginTop: "30px" }}>
        <ul className="pagination">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}>
              Previous
            </button>
          </li>

          {numbers.map((n) => (
            <li className={`page-item ${currentPage === n ? 'active' : ''}`} key={n}>
              <button className="page-link" onClick={() => setCurrentPage(n)}> {n} </button>
            </li>
          ))}

          <li className={`page-item ${currentPage === npage ? 'disabled' : ''}`}>
            <button className="page-link" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, npage))}>
              Next
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
};
