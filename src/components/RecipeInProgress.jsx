import React, { useEffect, useState, useContext, useCallback } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import clipboardCopy from 'clipboard-copy';
import RecipesContext from '../Context/RecipesContext';
import APIDrink from '../APIFetch/fetchDrink';
import APIMeal from '../APIFetch/fetchMeal';
import shareIcon from '../images/shareIcon.svg';
import whiteHeartIcon from '../images/whiteHeartIcon.svg';
import blackHeartIcon from '../images/blackHeartIcon.svg';
import styles from '../styles/RecipeInProgress.module.css';

export default function RecipeDetails() {
  const { pathname } = useLocation();
  const rota = pathname.includes('/meals');
  const { id } = useParams();
  const history = useHistory();
  const [ingredientes, setIngredientes] = useState([]);
  const [quantidades, setQuantidades] = useState([]);
  const [renderIngredientes, setrenderIngredientes] = useState([]);
  const [copy, setCopy] = useState(false);
  const [heartImg, setHeartImg] = useState(whiteHeartIcon);
  const favorite = JSON.parse(localStorage.getItem('favoriteRecipes'));
  const antigos = JSON.parse(localStorage.getItem('inProgressRecipes'));
  const [isChecked, setIsChecked] = useState(() => {
    if (antigos === null) {
      return [];
    }
    if (rota) {
      if (!antigos.meals) {
        return [];
      }
      return [...antigos.meals[id]];
    }
    if (!rota) {
      if (!antigos.drinks) {
        return [];
      }
      return [...antigos.drinks[id]];
    }
  });

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
    if (rota) {
      getMealsFilter();
    } if (!rota) {
      getDrinksFilter();
    }
  }, [API, id, rota, setAPI, setIsloading]);

  useEffect(() => {
    const receita = () => {
      const itens = quantidades.map((item, index) => `${item} ${ingredientes[index]}`);
      setrenderIngredientes(itens);
    };
    receita();
  }, [ingredientes, quantidades]);

  useEffect(() => {
    const local = { ...antigos };
    if (rota) {
      const novos = {
        ...local,
        meals: { ...local.meals, [id]: isChecked },
      };
      localStorage.setItem('inProgressRecipes', JSON.stringify(novos));
    } else {
      const novos = {
        ...local,
        drinks: { ...local.drinks, [id]: isChecked },
      };
      localStorage.setItem('inProgressRecipes', JSON.stringify(novos));
    }
  }, [antigos, id, isChecked, rota]);

  const share = (urlID) => {
    clipboardCopy(`http://localhost:3000/${urlID}/${id}`);
    setCopy(true);
  };

  const DoneRecipe = (done) => {
    history.push('/done-recipes');
    const oldDone = JSON.parse(localStorage.getItem('doneRecipes'));
    let newDone = [];
    if (oldDone) {
      newDone = [...oldDone];
    }
    newDone.push(done);
    localStorage.setItem('doneRecipes', JSON.stringify(newDone));
  };

  const handleChecked = useCallback((name) => {
    if (isChecked.includes(name)) {
      const removeCheck = isChecked.filter((element) => element !== name);
      setIsChecked(removeCheck);
    } else {
      setIsChecked([...isChecked, name]);
    }
  }, [isChecked]);

  const favoriteRecipe = (obj) => {
    const oldFavorites = JSON.parse(localStorage.getItem('favoriteRecipes'));
    // const desfavoritar = oldFavorites.some((element) => element.id !== id);
    let newFavorites = [];
    if (oldFavorites) {
      newFavorites = [...oldFavorites];
    }
    newFavorites.push(obj);
    localStorage.setItem('favoriteRecipes', JSON.stringify(newFavorites));
  };

  const dataHoje = () => {
    const timeElapsed = Date.now();
    const today = new Date(timeElapsed);
    return today.toLocaleDateString();
  };

  const food = rota ? API.strMeal : API.strDrink;
  const foodThumb = rota ? API.strMealThumb : API.strDrinkThumb;
  const foodCatOrAlco = rota ? API.strCategory : API.strAlcoholic;
  const foodArea = rota ? API.strArea : '';
  const foodAlcool = rota ? '' : API.strAlcoholic;
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
        onClick={ () => share(rota ? 'meals' : 'drinks') }
      />
      <img
        src={ heartImg }
        aria-hidden="true"
        alt="favorite"
        data-testid="favorite-btn"
        onClick={ () => {
          const favoriteFood = {
            id,
            name: food,
            type: rota ? 'meal' : 'drink',
            nationality: foodArea,
            category: API.strCategory,
            alcoholicOrNot: foodAlcool,
            image: foodThumb,
          };
          favoriteRecipe(favoriteFood);
          setHeartImg(() => {
            if (!favorite || favorite.id === id) {
              return whiteHeartIcon;
            } return blackHeartIcon;
          });
        } }
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
      <p data-testid="instructions">{ API.strInstructions }</p>
      <button
        type="submit"
        disabled={ !renderIngredientes.every((item) => isChecked.includes(item)) }
        onClick={ () => {
          const DoneFood = {
            id,
            name: food,
            type: rota ? 'meal' : 'drink',
            nationality: foodArea,
            category: API.strCategory,
            alcoholicOrNot: foodAlcool,
            image: foodThumb,
            doneDate: dataHoje(),
            tags: [API.strTags],
          };
          DoneRecipe(DoneFood);
        } }
        style={ { position: 'fixed', bottom: '0px' } }
        data-testid="finish-recipe-btn"
      >
        Done Recipe
      </button>
    </div>
  );
}
