import { useState } from 'react';
import './searchbar.css';

function Searchbar() {
  const [word, setWord] = useState('');
  const [definition, setDefinition] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [error, setError] = useState(null);

  const fetchWordDefinition = async () => {
    // Resetar audio url så den nya audio urlen uppdateras
    setDefinition(null);
    setAudioUrl(null);
    setError(null);

    if (word) {
      const apiUrl = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
      try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }

        const data = await response.json();
        if (data[0]?.meanings[0]?.definitions[0]?.definition) {
          setDefinition(data[0].meanings[0].definitions[0].definition);
        }
        if (data[0]?.phonetics[0]?.audio) {
          setAudioUrl(data[0].phonetics[0].audio);
        }
        setError(null);
      } catch (error) {
        setError('Error fetching the API: ' + error.message);
        setDefinition(null);
        setAudioUrl(null);
      }
    } else {
      setError('No word entered');
    }
  };

  return (
    <div className="searchbar">
      <input
      className='search-input'
        type="text"
        value={word}
        onChange={(e) => setWord(e.target.value)}
        placeholder="Enter a word"
      />
      <button className='search-button' onClick={fetchWordDefinition}>Fetch Definition</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {definition && <p className='description'><strong >Definition:</strong> {definition}</p>}
      {audioUrl && (
        <div className='audio'>
         
          <audio controls>
            <source src={audioUrl} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )}
    </div>
  );
}

export default Searchbar;
