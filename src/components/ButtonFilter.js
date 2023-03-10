import React, { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import RecipesContext from '../Context/RecipesContext';

function ButtonFilter() {
  const { pathname } = useLocation();
  const {
    setButtonfilter,
    buttonFilter,
    isloading,
    setIsloading,
  } = useContext(RecipesContext);
  const maxListCategory = 5;

  const [categorias, setcategorias] = useState([]);

  useEffect(() => {
    const meals = 'https://www.themealdb.com/api/json/v1/1/list.php?c=list';
    const drink = 'https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list';
    const url = (pathname.includes('meals')) ? meals : drink;
    if (!isloading) {
      const fetchData = async () => {
        const response = await fetch(url);
        const data = await response.json();
        const results = url.includes('meal') ? data.meals : data.drinks;
        setcategorias(results);
      };
      fetchData();
    }
  }, [isloading, pathname]);

  return (
    <div>
      {categorias.slice(0, maxListCategory).map(({ strCategory }) => (
        <button
          key={ strCategory }
          value={ strCategory }
          data-testid={ `${strCategory}-category-filter` }
          onClick={ (e) => {
            if (e.target.value === buttonFilter) {
              setButtonfilter('');
              setIsloading(true);
            }
            if (e.target.value !== buttonFilter) {
              setButtonfilter(e.target.value);
              setIsloading(false);
            }
          } }
        >
          {strCategory}

        </button>))}
      <button
        data-testid="All-category-filter"
        value="All"
        onClick={ () => {
          setButtonfilter('');
          setIsloading(true);
        } }
      >
        All
      </button>
    </div>
  );
}

export default ButtonFilter;
