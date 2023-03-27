import { screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Route from 'react-router';
import fetch from '../../cypress/mocks/fetch';
import App from '../App';
import renderWithRouter from './helpers/renderWithRouter';
import oneMeal from '../../cypress/mocks/oneMeal';
import whiteHeartIcon from '../images/whiteHeartIcon.svg';
import blackHeartIcon from '../images/blackHeartIcon.svg';
import { favoriteRecipes } from './helpers/favoriteMock';
import { inProgressRecipes } from './helpers/inProgressMock';

const mockedWriteText = jest.fn();

navigator.clipboard = {
  writeText: mockedWriteText,
};

const mockHistoryPush = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockHistoryPush,
  }),
  useParams: () => ({
    id: jest.fn(),
  }),
}));

const PATHNAME = '/meals/52977';
const NAME = 'Corba';
const favoriteBtn = 'favorite-btn';

describe('testes da página de detalhes das receitas', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => null),
        setItem: jest.fn(() => null),
      },
      writable: true,
    });
    // jest.spyOn(window.localStorage, 'setItem').mockImplementation(() => JSON.stringify(inProgressRecipes));
    // jest.spyOn(window.localStorage, 'setItem').mockImplementation(() => JSON.stringify(favoriteRecipes));
  });

  it('verifica se os detalhes da receita "Corba" estão corretos', async () => {
    jest.spyOn(global, 'fetch');
    global.fetch.mockImplementation(fetch);
    const { history } = renderWithRouter(<App />);
    jest.spyOn(Route, 'useParams').mockReturnValue({ id: '52977' });
    // jest.spyOn(window.localStorage, 'getItem').mockImplementation(() => JSON.stringify(inProgressRecipes.meals));
    // jest.spyOn(window.localStorage, 'getItem').mockImplementation(() => JSON.stringify(favoriteRecipes));
    act(() => {
      history.push(PATHNAME);
    });

    // await waitFor(() => {
    //   expect(screen.getByText('Start Recipe')).toBeInTheDocument();
    //   expect(screen.getByText(NAME)).toBeInTheDocument();
    // }, { timeout: 3000 });

    // const img = screen.getByRole('img', { name: /spicy arrabiata penne/i });
    // expect(img).toBeInTheDocument();
    // await waitFor(() => {
    //   expect(screen.getByTestId('0-ingredient-name-and-measure')).toHaveTextContent('1 pound penne rigate');
    //   expect(screen.getByTestId('instructions')).toHaveTextContent(oneMeal.meals[0].strInstructions);
    //   expect(screen.getByTestId('video')).toHaveAttribute('src', oneMeal.meals[0].strYoutube.replace('watch?v=', 'embed/'));
    // });
    // const share = screen.getByTestId('share-btn');
    // userEvent.click(share);
    // expect(mockedWriteText).toHaveBeenCalledTimes(1);
    // const favBtn = screen.getByTestId(favoriteBtn);
    // expect(favBtn).toHaveAttribute('src', whiteHeartIcon);
    // userEvent.click(favBtn);
    // expect(favBtn).toHaveAttribute('src', blackHeartIcon);
    // jest.spyOn(window.localStorage, 'setItem').mockImplementation(() => JSON.stringify(favoriteRecipes));
    // const startButton = screen.getByRole('button', { name: /start recipe/i });
    // userEvent.click(startButton);
    // expect(history.location.pathname).toBe('/meals/52771/in-progress');
  });

  // it('verifica se os detalhes da receita "GG" estão corretos', async () => {
  //   jest.spyOn(global, 'fetch');
  //   global.fetch.mockImplementation(fetch);
  //   const { history } = renderWithRouter(<App />);

  //   act(() => {
  //     history.push('/drinks/15997');
  //   });

  //   await waitFor(() => {
  //     const name = screen.getByText('GG');
  //     expect(name).toBeInTheDocument();
  //   }, { timeout: 3000 });
  //   const share = screen.getByTestId('share-btn');
  //   userEvent.click(share);
  //   expect(mockedWriteText).toHaveBeenCalledTimes(1);
  //   const startButton = screen.getByTestId('start-recipe-btn');
  //   userEvent.click(startButton);
  //   expect(history.location.pathname).toBe('/drinks/15997/in-progress');
  // });

  // it('verifica se a receita de comida ja vem favoritada caso reinicia a página', async () => {
  //   Object.defineProperty(window, 'localStorage', {
  //     value: {
  //       getItem: jest.fn(() => null),
  //       setItem: jest.fn(() => null),
  //     },
  //     writable: true,
  //   });
  //   jest.spyOn(global, 'fetch');
  //   global.fetch.mockImplementation(fetch);
  //   const { history } = renderWithRouter(<App />);
  //   jest.spyOn(window.localStorage, 'getItem').mockImplementation(() => JSON.stringify(spicyLocalMock));
  //   act(() => {
  //     history.push(spicyLink);
  //   });
  //   await waitFor(() => {
  //     const name = screen.getByText(spicyName);
  //     expect(name).toBeInTheDocument();
  //   }, { timeout: 3000 });
  //   const favBtn = screen.getByTestId(favoriteBtn);
  //   expect(favBtn).toHaveAttribute('src', blackHeartIcon);
  //   userEvent.click(favBtn);
  //   expect(window.localStorage.setItem).toHaveBeenLastCalledWith(
  //     'favoriteRecipes',
  //     '[]',
  //   );
  // });

  // it('verifica se a receita de bebida ja vem favoritada caso reinicia a página', async () => {
  //   Object.defineProperty(window, 'localStorage', {
  //     value: {
  //       getItem: jest.fn(() => null),
  //       setItem: jest.fn(() => null),
  //     },
  //     writable: true,
  //   });
  //   jest.spyOn(global, 'fetch');
  //   global.fetch.mockImplementation(fetch);
  //   const { history } = renderWithRouter(<App />);
  //   jest.spyOn(window.localStorage, 'getItem').mockImplementation(() => JSON.stringify(ggLocalMock));
  //   act(() => {
  //     history.push('/drinks/15997');
  //   });
  //   await waitFor(() => {
  //     const name = screen.getByText('GG');
  //     expect(name).toBeInTheDocument();
  //   }, { timeout: 3000 });
  //   const favBtn = screen.getByTestId(favoriteBtn);
  //   expect(favBtn).toHaveAttribute('src', blackHeartIcon);
  //   userEvent.click(favBtn);
  //   expect(window.localStorage.setItem).toHaveBeenLastCalledWith(
  //     'favoriteRecipes',
  //     '[]',
  //   );
  // });
});
