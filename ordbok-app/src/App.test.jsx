import { render, screen, fireEvent } from '@testing-library/react';
import Searchbar from './components/searchbar/searchbar';
import '@testing-library/jest-dom';
import Header from './components/header/header';


describe('Header', () => {
  it('renders h2 tag', () => {
    render(<Header />);
    //Kollar så att h2 tagen renderas i header
    const h2Element = screen.getByText('Dictionary')
    expect(h2Element).toBeInTheDocument();

    
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

      fireEvent.change(inputElement, { target: { value: 'cool' } });
      expect(inputElement.value).toBe('cool');

      fireEvent.click(buttonElement);
    });
      //Kollar error när inget ord skrivits in
    it('should display an error when no word is entered', () => {
      render(<Searchbar />);
      const buttonElement = screen.getByText(/Fetch Definition/i);
      fireEvent.click(buttonElement);
      const errorElement = screen.getByText(/No word entered/i);
      expect(errorElement).toBeInTheDocument();
    });
     
  });
});

