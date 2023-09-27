import { useState } from 'react';
import './searchbar.css';

function Searchbar() {
  // States för varje elememnt
  const [word, setWord] = useState('');
  const [definition, setDefinition] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [phonetic, setPhonetic] = useState(null);
  const [example, setExample] = useState(null); 
  const [meaning, setMeaning] = useState(null); // Added state for Meaning
  const [error, setError] = useState(null);

  // API fetch sker på klick
  const fetchWordDefinition = async () => {
    // Reset values
    setDefinition(null);
    setAudioUrl(null);
    setPhonetic(null);
    setExample(null); 
    setMeaning(null); // Reset Meaning
    setError(null);

    //fetch sker endas om ett ord matats in i inputfäletet
    if (word) {
      const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }

        const data = await response.json();

        console.log(data)

        if (data[0]?.meanings[0]?.definitions[0]?.definition) {
          setDefinition(data[0].meanings[0].definitions[0].definition);
        }
        if (data[0]?.meanings[0]?.definitions[0]?.example) {
          setExample(data[0].meanings[0].definitions[0].example); 
        }
        if (data[0]?.phonetics[0]?.audio) {
          setAudioUrl(data[0].phonetics[0].audio);
        }
        if (data[0]?.phonetics[0]?.text) {
          setPhonetic(data[0].phonetics[0].text);
        }
        if (data[0]?.meanings) {
          setMeaning(data[0].meanings.map(meaning => meaning.partOfSpeech).join(', ')); 
        }
        setError(null);
      } catch (error) {
        setError('Error fetching the API: ' + error.message);
        setDefinition(null); //resetar på error
        setAudioUrl(null);
        setPhonetic(null);
        setExample(null); 
        setMeaning(null); //resetar på error
      }
    } else {
      setError('No word entered'); //error om inget ord matats in
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
      {error && <p className='error' style={{ color: 'red' }}>{error}</p>}
      <section className='main-section'>
        {definition && <p className='description'><strong>Definition:</strong> {definition}</p>}
        {meaning && <p className='meaning'><strong>Meaning:</strong> {meaning}</p>}  
        {phonetic && <p className='phonetic'><strong>Phonetic:</strong> {phonetic}</p>}
        {example && <p className='example'><strong>Example:</strong> {example}</p>}  
        {audioUrl && (
          <div className='audio'>
            <audio controls data-testid="audio-element">
              <source src={audioUrl} type="audio/mpeg" />
              Your browser does not support the audio element.
            </audio>
          </div> 
        )}
      </section>
    </div>
  );
}

export default Searchbar;


