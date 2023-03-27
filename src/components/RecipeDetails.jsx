import React, { useEffect, useState, useContext } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import clipboardCopy from 'clipboard-copy';
import Carousel from 'react-multi-carousel';
import RecipesContext from '../Context/RecipesContext';
import APIDrink from '../APIFetch/fetchDrink';
import APIMeal from '../APIFetch/fetchMeal';
import shareIcon from '../images/shareIcon.svg';
import whiteHeartIcon from '../images/whiteHeartIcon.svg';
import blackHeartIcon from '../images/blackHeartIcon.svg';
import filterIngredientes from '../hooks/filterIngredientes';
import 'react-multi-carousel/lib/styles.css';

export default function RecipeDetails() {
  const { pathname } = useLocation();
  const rota = pathname.includes('/meals');
  const { id } = useParams();
  const history = useHistory();
  const [details, setDetails] = useState([]);
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

  const {
    isloading,
    setIsloading,
    API,
    setAPI,
  } = useContext(RecipesContext);

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
    const getMealsFilter = async () => {
      const response = await APIMeal('lookup.php?i=', id);
      setDetails(response[0]);
      setIsloading(false);
    };
    const getDrinksFilter = async () => {
      const response = await APIDrink('lookup.php?i=', id);
      setDetails(response[0]);
      setIsloading(false);
    };
    if (rota) {
      getMealsFilter();
      getDrinks();
    } if (!rota) {
      getDrinksFilter();
      getMeals();
    }
    if (favoritesState.some((fav) => fav.id === id)) {
      setHeartImg(blackHeartIcon);
    }
  }, []);

  useEffect(() => {
    setIngredientes(filterIngredientes(details, 'Ingredient'));
    setQuantidades(filterIngredientes(details, 'strMeasure'));
  }, [details]);

  useEffect(() => {
    const receita = () => {
      const itens = quantidades.map((item, index) => `${item} ${ingredientes[index]}`);
      setrenderIngredientes(itens);
    };
    receita();
  }, [ingredientes, quantidades]);

  const share = (urlID) => {
    clipboardCopy(`http://localhost:3000/${urlID}/${id}`);
    setCopy(true);
  };

  const DoneRecipe = () => {
    if (rota) {
      history.push(`/meals/${id}/in-progress`);
    } else history.push(`/drinks/${id}/in-progress`);
  };

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

  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 2,
    },
  };

  // const inProgressRecipes = {
  //   meals: {
  //     52771: [],
  //   },
  //   drinks: {
  //     178319: [],
  //   },
  // };
  // localStorage.setItem('inProgressRecipes', JSON.stringify(inProgressRecipes));

  const inProgress = (type) => {
    const recipe = JSON.parse(localStorage.getItem('inProgressRecipes'));
    if (type === 'meals' && Object.keys(recipe.meals).includes(id)) {
      return 'Continue Recipe';
    }
    if (type === 'drinks' && Object.keys(recipe.drinks).includes(id)) {
      return 'Continue Recipe';
    }
    return 'Start Recipe';
  };

  const food = rota ? details.strMeal : details.strDrink;
  const foodThumb = rota ? details.strMealThumb : details.strDrinkThumb;
  const foodCatOrAlco = rota ? details.strCategory : details.strAlcoholic;
  const foodArea = rota ? details.strArea : '';
  const foodAlcool = rota ? '' : details.strAlcoholic;
  const maxCarrossel = 6;

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
            category: details.strCategory,
            alcoholicOrNot: foodAlcool,
            image: foodThumb,
          };
          favoriteRecipe(favoriteFood);
        } }
      />
      {copy && <p>Link copied!</p>}
      {renderIngredientes.map((item, index) => (
        <div key={ index }>
          <p data-testid={ `${index}-ingredient-name-and-measure` }>
            { item }
          </p>
        </div>
      ))}
      <p data-testid="instructions">{ details.strInstructions }</p>
      { !details.strYoutube ? '' : (
        <iframe
          data-testid="video"
          title="video"
          width="450"
          height="315"
          src={ details.strYoutube.replace('watch?v=', 'embed/') }
        />
      )}
      <Carousel responsive={ responsive } slidesToSlide={ 2 }>
        {API.slice(0, maxCarrossel).map((foods, index) => (
          <div key={ index } data-testid={ `${index}-recommendation-card` }>
            <p data-testid={ `${index}-recommendation-title` }>
              { foods.strMeal || foods.strDrink }
            </p>
            <img
              src={ foods.strMealThumb || foods.strDrinkThumb }
              alt={ foods.strMeal || foods.strDrink }
              style={ { maxWidth: 200 } }
            />
          </div>
        ))}
      </Carousel>
      <button
        type="submit"
        onClick={ DoneRecipe }
        style={ { position: 'fixed', bottom: '0px' } }
        data-testid="start-recipe-btn"
      >
        {inProgress(pathname.includes('meals') ? 'meals' : 'drinks')}
      </button>
    </div>
  );
}
