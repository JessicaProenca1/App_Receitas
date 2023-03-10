import React, { useContext, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import RecipesContext from '../Context/RecipesContext';
import ButtonFilter from './ButtonFilter';
import APIDrink from '../APIFetch/fetchDrink';
import APIMeal from '../APIFetch/fetchMeal';

function Recipes() {
  const { pathname } = useLocation();
  const history = useHistory();
  const {
    isloading,
    API,
    buttonFilter,
    setAPI,
    setIsloading,
  } = useContext(RecipesContext);
  const maxMealPerPage = 12;

  useEffect(() => {
    const getMeals = async () => {
      const response = await APIMeal('search.php?s=', '');
      setAPI(response);
      setIsloading(false);
    };
    const getDrinks = async () => {
      const response = await APIDrink('search.php?s=', '');
      setAPI(response);
      setIsloading(false);
    };
    if (pathname.includes('/meals') && buttonFilter === '') {
      getMeals();
    } if (pathname.includes('/drinks') && buttonFilter === '') {
      getDrinks();
    }
  }, [buttonFilter, pathname, setAPI, setIsloading]);

  const handleClick = (id) => {
    const type = pathname.includes('/meals') ? 'meals' : 'drinks';
    history.push(`/${type}/${id}`);
  };

  const mealCard = (
    <div>
      <ButtonFilter />
      {API
        .slice(0, maxMealPerPage)
        .map(({ strMeal, idMeal, strMealThumb }, index) => (
          <div
            key={ index }
            data-testid={ `${index}-recipe-card` }
            aria-hidden="true"
            onClick={ () => handleClick(idMeal) }
          >
            <h3 data-testid={ `${index}-card-name` }>{strMeal}</h3>
            <img
              alt={ strMeal }
              src={ strMealThumb }
              data-testid={ `${index}-card-img` }
              style={ { maxWidth: '100px' } }
            />
          </div>
        ))}
    </div>
  );

  const drinkCard = (
    <div>
      <ButtonFilter />
      {API
        .slice(0, maxMealPerPage)
        .map(({ strDrink, idDrink, strDrinkThumb }, index) => (
          <div
            key={ index }
            data-testid={ `${index}-recipe-card` }
            aria-hidden="true"
            onClick={ () => handleClick(idDrink) }
          >
            <h3 data-testid={ `${index}-card-name` }>{strDrink}</h3>
            <img
              alt={ strDrink }
              src={ strDrinkThumb }
              data-testid={ `${index}-card-img` }
              style={ { maxWidth: '100px' } }
            />
          </div>
        ))}
    </div>
  );

  const mealsAppearing = (<div>{ !isloading ? mealCard : <p>carregando</p> }</div>);
  const drinksAppearing = (<div>{ !isloading ? drinkCard : <p>carregando</p> }</div>);

  return (
    <div>{pathname.includes('/meals') ? mealsAppearing : drinksAppearing}</div>
  );
}

export default Recipes;
