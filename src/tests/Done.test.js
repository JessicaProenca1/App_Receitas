import React from 'react';
import { screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import fetch from '../../cypress/mocks/fetch';
import renderWithRouter from './helpers/renderWithRouter';
import { doneRecipes } from './helpers/doneMock';

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
}));

const PATHNAME = '/done-recipes';
const NAME = '0-horizontal-name';

describe('All tests', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => null),
        setItem: jest.fn(() => null),
      },
      writable: true,
    });
  });

  it('Test done recipes', async () => {
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => null),
        setItem: jest.fn(() => null),
      },
      writable: true,
    });
    jest.spyOn(global, 'fetch');
    global.fetch.mockImplementation(fetch);
    const { history } = renderWithRouter(<App />);

    jest.spyOn(window.localStorage, 'getItem').mockImplementation(() => JSON.stringify(doneRecipes));

    act(() => {
      history.push(PATHNAME);
    });

    const recipe = screen.getByTestId(NAME);
    expect(recipe).toBeInTheDocument();
    const share = screen.getByTestId('0-horizontal-share-btn');
    userEvent.click(share);
    expect(mockedWriteText).toHaveBeenCalledTimes(1);
  });

  it('Test link image', async () => {
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => null),
        setItem: jest.fn(() => null),
      },
      writable: true,
    });
    jest.spyOn(global, 'fetch');
    global.fetch.mockImplementation(fetch);
    const { history } = renderWithRouter(<App />);

    jest.spyOn(window.localStorage, 'getItem').mockImplementation(() => JSON.stringify(doneRecipes));

    act(() => {
      history.push(PATHNAME);
    });

    userEvent.click(screen.getByTestId('0-horizontal-card'));

    expect(mockHistoryPush).toHaveBeenCalledWith('/meals/52771');
  });

  it('Test button filter', async () => {
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: jest.fn(() => null),
        setItem: jest.fn(() => null),
      },
      writable: true,
    });
    jest.spyOn(global, 'fetch');
    global.fetch.mockImplementation(fetch);
    const { history } = renderWithRouter(<App />);

    jest.spyOn(window.localStorage, 'getItem').mockImplementation(() => JSON.stringify(doneRecipes));

    act(() => {
      history.push(PATHNAME);
    });

    userEvent.click(screen.getByTestId('filter-by-meal-btn'));
    expect(screen.getByTestId(NAME)).toHaveTextContent('Spicy Arrabiata Penne');

    userEvent.click(screen.getByTestId('filter-by-drink-btn'));
    expect(screen.getByTestId(NAME)).toHaveTextContent('Aquamarine');
  });
});
