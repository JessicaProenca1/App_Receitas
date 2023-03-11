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
import filterIngredientes from '../hooks/filterIngredientes';

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
  const [favoritesState, setFavoritesState] = useState(() => {
    if (favorite !== null) {
      return [...favorite];
    }
    return [];
  });
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
    if (favoritesState.some((fav) => fav.id === id)) {
      setHeartImg(blackHeartIcon);
    }
  }, []);

  useEffect(() => {
    setIngredientes(filterIngredientes(API, 'Ingredient'));
    setQuantidades(filterIngredientes(API, 'strMeasure'));
  }, [API]);

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
    if (favoritesState.some((fav) => fav.name === obj.name)) {
      const rmvFav = favoritesState.filter((e) => Object.values(e)[0] !== obj.id);
      setFavoritesState(rmvFav);
      setHeartImg(whiteHeartIcon);
    } else {
      setFavoritesState([...favoritesState, obj]);
      setHeartImg(blackHeartIcon);
    }
  };

  useEffect(() => {
    localStorage.setItem('favoriteRecipes', JSON.stringify(favoritesState));
  }, [favoritesState]);

  const dataHoje = () => {
    const today = new Date();
    return today.toISOString();
  };

  const tags = () => {
    if (API.strTags) {
      return API.strTags.split(',');
    }
    return [];
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
            tags: tags(),
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
