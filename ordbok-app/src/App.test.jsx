import { render, screen, fireEvent } from '@testing-library/react';
import Searchbar from './components/searchbar/searchbar';
import App from './App';
import '@testing-library/jest-dom';

describe('App', () => {
  it('renders headline', () => {
    render(<App title="React" />);

    screen.debug();
  });

  describe('Searchbar', () => {
    it('should render the button and input field', () => {
      render(<Searchbar />);
      // Kollar så att input och button finns
      const inputElement = screen.getByPlaceholderText(/Enter a word/i);
      const buttonElement = screen.getByText(/Fetch Definition/i);
      
      expect(inputElement).toBeInTheDocument();
      expect(buttonElement).toBeInTheDocument();
    });

    it('should type "bot" into the input field and click the button', () => {
      render(<Searchbar />);
      //skriver in ordet bot i input och trycker på knappen
      const inputElement = screen.getByPlaceholderText(/Enter a word/i);
      const buttonElement = screen.getByText(/Fetch Definition/i);

      fireEvent.change(inputElement, { target: { value: 'bot' } });
      expect(inputElement.value).toBe('bot');

      fireEvent.click(buttonElement);
    });
  });
});

