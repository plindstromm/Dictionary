import { render, screen, fireEvent } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import Searchbar from '../src/components/searchbar/searchbar';
import Header from '../src/components/header/header';


const mockResponseFootball = [
  {
    word: "football",
    phonetics: [
      {
        text: "[fʷʊʔt̚bɑɫ]",
        audio: "https://api.dictionaryapi.dev/media/pronunciations/en/football-au.mp3",
      },
    ],
    meanings: [
      
      {
        
        partOfSpeech: "noun, verb",
        
        definitions: [
          {
            definition: "(general) A sport played on foot in which teams attempt to get a ball into a goal or zone defended by the other team.",
            example: "Roman and medieval football matches were more violent than any modern type of football.",
            
          },
        ],
        synonyms: ['atomic football', 'black bag', 'black box', 'nuclear football'],
      },
    ],
  },
];

const server = setupServer(
  rest.get(
    "https://api.dictionaryapi.dev/api/v2/entries/en/:word",
    (req, res, ctx) => {
      if (req.params.word === "bot") {
       
      } else if (req.params.word === "football") {
        return res(ctx.json(mockResponseFootball));
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

  it('should render searchbar and header', () => {
    render(<Header />);
    render(<Searchbar />);
  });

  describe('Searchbar', () => {
    it('should render the button', () => {
      render(<Searchbar />);
      
      const buttonElement = screen.getByText(/Fetch Definition/i);
      expect(buttonElement).toBeInTheDocument();
    });

    it('should render the input field', () => {
      render(<Searchbar />);
      const inputElement = screen.getByPlaceholderText(/Enter a word/i);
      expect(inputElement).toBeInTheDocument();
    });

    it('should type "cool" into the input field and click the button', async () => {
      render(<Searchbar />);
      const inputElement = screen.getByPlaceholderText(/Enter a word/i);
      const buttonElement = screen.getByText(/Fetch Definition/i);

      fireEvent.change(inputElement, { target: { value: 'cool' } });
      expect(inputElement.value).toBe('cool');

      fireEvent.click(buttonElement);
    });

   

    it('should display the correct information for the word "football"', async () => {
      render(<Searchbar />);
      
      const inputElement = screen.getByPlaceholderText(/Enter a word/i);
      const buttonElement = screen.getByText(/Fetch Definition/i);

      fireEvent.change(inputElement, { target: { value: 'football' } });
      fireEvent.click(buttonElement);

      
  

      const definitionElement = await screen.findByText(/\(general\) A sport played on foot in which teams attempt to get a ball into a goal or zone defended by the other team./i);
      const exampleElement = await screen.findByText(/Roman and medieval football matches were more violent than any modern type of football./i);
      const phoneticElement = await screen.findByText(/\[fʷʊʔt̚bɑɫ\]/i);
      const meaningElement = await screen.findByText(/noun, verb/i);
      const synonymsContainer = await screen.findByTestId('synonyms-container');
      


      expect(meaningElement).toBeInTheDocument();
      expect(definitionElement).toBeInTheDocument();
      expect(exampleElement).toBeInTheDocument();
      expect(phoneticElement).toBeInTheDocument();
      expect(synonymsContainer).toBeInTheDocument()
      
    });
  });

  it('should render audio element when audioUrl is available', async () => {
    render(<Searchbar />);

    const inputElement = screen.getByPlaceholderText(/Enter a word/i);
    const buttonElement = screen.getByText(/Fetch Definition/i);

    fireEvent.change(inputElement, { target: { value: 'football' } });
    fireEvent.click(buttonElement);

    
    const audioElement = await screen.findByTestId('audio-element');
    expect(audioElement).toBeInTheDocument();
    
  });
});

