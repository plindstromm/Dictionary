import { render, screen, fireEvent } from '@testing-library/react';
import Searchbar from '../src/components/searchbar/searchbar';


it('should display an error when no word is entered', async () => {
    render(<Searchbar />);
    const buttonElement = screen.getByText(/Fetch Definition/i);
    fireEvent.click(buttonElement);
    const errorElement = await screen.findByText(/No word entered/i);
    expect(errorElement).toBeInTheDocument();
  });

  it('should display an error message for non-existent words', async () => {
    render(<Searchbar />);
    const inputElement = screen.getByPlaceholderText(/Enter a word/i);
    const buttonElement = screen.getByText(/Fetch Definition/i);
  
    fireEvent.change(inputElement, { target: { value: 'nonexistentword' } });
    fireEvent.click(buttonElement);
  
    const errorElement = await screen.findByText(/Error fetching the API: Network response was not ok/i); 
    expect(errorElement).toBeInTheDocument();
  });