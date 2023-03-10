import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import RecipesContext from './RecipesContext';
import APIDrink from '../APIFetch/fetchDrink';
import APIMeal from '../APIFetch/fetchMeal';

function RecipesProvider({ children }) {
  const { pathname } = useLocation();
  const [isloading, setIsloading] = useState(true);
  const [buttonFilter, setButtonfilter] = useState('');
  const [API, setAPI] = useState([]);
  const [APICategory, setAPICategory] = useState([]);

  useEffect(() => {
    const getMealsFilter = async () => {
      const response = await APIMeal('filter.php?c=', buttonFilter);
      setAPI(response);
      setIsloading(false);
    };
    const getDrinksFilter = async () => {
      const response = await APIDrink('filter.php?c=', buttonFilter);
      setAPI(response);
      setIsloading(false);
    };
    if (pathname.includes('/meals') && buttonFilter !== '') {
      getMealsFilter();
    } if ((pathname.includes('/drinks') && buttonFilter !== '')) {
      getDrinksFilter();
    }
  }, [buttonFilter, pathname]);

  const context = useMemo(
    () => ({
      isloading,
      API,
      APICategory,
      buttonFilter,
      setButtonfilter,
      setIsloading,
      setAPI,
      setAPICategory,
    }),
    [isloading, API, buttonFilter, APICategory],
  );

  return (
    <RecipesContext.Provider value={ context }>
      {children}
    </RecipesContext.Provider>
  );
}

RecipesProvider.propTypes = {
  children: PropTypes.node,
}.isRequired;

export default RecipesProvider;
