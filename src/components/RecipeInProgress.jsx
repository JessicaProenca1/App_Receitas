import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import clipboardCopy from 'clipboard-copy';
import RecipesContext from '../Context/RecipesContext';
import APIDrink from '../APIFetch/fetchDrink';
import APIMeal from '../APIFetch/fetchMeal';
import shareIcon from '../images/shareIcon.svg';
import whiteHeartIcon from '../images/whiteHeartIcon.svg';
// import blackHeartIcon from '../images/blackHeartIcon.svg';
import styles from '../styles/RecipeInProgress.module.css';

export default function RecipeDetails() {
  const { pathname } = useLocation();
  const { id } = useParams();
  const history = useHistory();
  const [ingredientes, setIngredientes] = useState([]);
  const [quantidades, setQuantidades] = useState([]);
  const [renderIngredientes, setrenderIngredientes] = useState([]);
  const [copy, setCopy] = useState(false);
  const [isChecked, setIsChecked] = useState([]);

  const {
    isloading,
    setIsloading,
    API,
    setAPI,
  } = useContext(RecipesContext);

  useEffect(() => {
    const ingredient = (objectToReduce, string) => {
      const newObject = Object.keys(objectToReduce)
        .filter((key) => key.includes(string))
        .reduce((cur, key) => Object.assign(cur, { [key]: objectToReduce[key] }), {});
      const filteredObject = Object
        .fromEntries(Object.entries(newObject).filter(([key, value]) => (
          value !== null && value !== key && value !== ' ' && value !== '')));
      setIngredientes(Object.values(filteredObject));
    };
    ingredient(API, 'Ingredient');
  }, [API]);

  useEffect(() => {
    const mensure = (objectToReduce, string) => {
      const newObject = Object.keys(objectToReduce)
        .filter((key) => key.includes(string))
        .reduce((cur, key) => Object.assign(cur, { [key]: objectToReduce[key] }), {});
      const filteredObject = Object
        .fromEntries(Object.entries(newObject).filter(([key, value]) => (
          value !== null && value !== key && value !== ' ' && value !== '')));
      setQuantidades(Object.values(filteredObject));
    };
    mensure(API, 'strMeasure');
  }, [API]);

  useEffect(() => {
    const getMealsFilter = async () => {
      const response = await APIMeal('lookup.php?i=', id);
      setAPI(response[0]);
      setIsloading(false);
    };
    const getDrinksFilter = async () => {
      const response = await APIDrink('lookup.php?i=', id);
      setAPI(response[0]);
      setIsloading(false);
    };
    if (pathname.includes('/meals')) {
      getMealsFilter();
    } if ((pathname.includes('/drinks'))) {
      getDrinksFilter();
    }
  }, [API, id, pathname, setAPI, setIsloading]);

  useEffect(() => {
    const receita = () => {
      const itens = quantidades.map((item, index) => `${item} ${ingredientes[index]}`);
      setrenderIngredientes(itens);
    };
    receita();
  }, [ingredientes, quantidades]);

  const share = (urlID) => {
    clipboardCopy(`http://localhost:3000/${urlID}${id}/in-progress`);
    setCopy(true);
  };

  const handleSubmit = () => {
    history.push('/done-recipes');
  };

  // const jamarcados = JSON.parse(localStorage.getItem('inProgressRecipes'));
  const handleChecked = useCallback((name) => {
    if (isChecked.includes(name)) {
      const removeCheck = isChecked.filter((element) => element !== name);
      setIsChecked(removeCheck);
    } else {
      setIsChecked([...isChecked, name]);
    }
  }, [isChecked]);

  const food = pathname.includes('/meals') ? API.strMeal : API.strDrink;
  const foodThumb = pathname.includes('/meals') ? API.strMealThumb : API.strDrinkThumb;
  const foodCatOrAlco = pathname.includes('/meals') ? API.strCategory : API.strAlcoholic;
  const foodInstructions = pathname
    .includes('/meals') ? API.strInstructions : API.strInstructions;

  return (
    <div>
      {isloading && <div>Loading...</div>}
      <h2 data-testid="recipe-title">{ food }</h2>
      <img
        src={ foodThumb }
        alt={ food }
        data-testid="recipe-photo"
        style={ { maxWidth: 200 } }
      />
      <h3
        data-testid="recipe-category"
      >
        { foodCatOrAlco }
      </h3>
      <img
        src={ shareIcon }
        alt="compartilhar"
        aria-hidden="true"
        data-testid="share-btn"
        onClick={ () => share(pathname.includes('meals') ? 'meals/' : 'drinks/') }
      />
      <img
        src={ whiteHeartIcon }
        alt="favorite"
        data-testid="favorite-btn"
        onClick={ () => history.push('/favorite-recipes') }
        aria-hidden="true"
      />
      {copy && <p>Link copied!</p>}
      {renderIngredientes.map((item, index) => (
        <div key={ index }>
          <label
            htmlFor={ index }
            data-testid={ `${index}-ingredient-step` }
            className={ isChecked
              .includes(item) ? styles.checkedIngredientes : undefined }
          >
            <input
              type="checkbox"
              name={ item }
              id={ index }
              checked={ isChecked.includes(item) }
              onChange={ (e) => handleChecked(e.target.name) }
            />
            { item }
          </label>
        </div>
      ))}
      <p data-testid="instructions">{ foodInstructions }</p>
      <button
        type="submit"
        onClick={ handleSubmit }
        style={ { position: 'fixed', bottom: '0px' } }
        data-testid="finish-recipe-btn"
      >
        Done Recipe
      </button>
    </div>
  );
}
