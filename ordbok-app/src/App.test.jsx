import { render, screen, fireEvent } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import Searchbar from './components/searchbar/searchbar';
import Header from './components/header/header';

// mock response
const mockResponse = [
  {
    meanings: [
      {
        definitions: [
          {
            definition: 'A robot programmed to perform tasks autonomously.',
            example: 'The bot was programmed to play games.',
          },
        ],
      },
    ],
    phonetics: [
      {
        text: '/bɒt/',
        audio: 'https://some-audio-url.com/bot.mp3',
      },
    ],
  },
];

// setup för att söka efter ordet bot "bot"
const server = setupServer(
  rest.get(
    "https://api.dictionaryapi.dev/api/v2/entries/en/:word",
    (req, res, ctx) => {
      if (req.params.word === "bot") {
        return res(ctx.json(mockResponse));
      }
      return res(ctx.status(404));
    }
  )
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('Header', () => {
  it('renders the h2 tag', () => {
    render(<Header />);
    const h2Element = screen.getByText('Dictionary');
    expect(h2Element).toBeInTheDocument();
  });

  describe('Searchbar', () => {
    it('should render the button and input field', async () => {
      render(<Searchbar />);
      const inputElement = screen.getByPlaceholderText(/Enter a word/i);
      const buttonElement = screen.getByText(/Fetch Definition/i);
      
      expect(inputElement).toBeInTheDocument();
      expect(buttonElement).toBeInTheDocument();
    });

    it('should type "cool" into the input field and click the button', async () => {
      render(<Searchbar />);
      const inputElement = screen.getByPlaceholderText(/Enter a word/i);
      const buttonElement = screen.getByText(/Fetch Definition/i);

      fireEvent.change(inputElement, { target: { value: 'cool' } });
      expect(inputElement.value).toBe('cool');

      fireEvent.click(buttonElement);
    
    });

    it('should display the correct information for the word "bot"', async () => {
      render(<Searchbar />);
      
      const inputElement = screen.getByPlaceholderText(/Enter a word/i);
      const buttonElement = screen.getByText(/Fetch Definition/i);

      fireEvent.change(inputElement, { target: { value: 'bot' } });
      fireEvent.click(buttonElement);

      const definitionElement = await screen.findByText(/A robot programmed to perform tasks autonomously./i);
      const exampleElement = await screen.findByText(/The bot was programmed to play games./i);
      const phoneticElement = await screen.findByText(/\/bɒt\//i);

      expect(definitionElement).toBeInTheDocument();
      expect(exampleElement).toBeInTheDocument();
      expect(phoneticElement).toBeInTheDocument();

    
   
    });


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

    
  });
});

