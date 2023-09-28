import { useState } from 'react';
import './searchbar.css';

// Jag vet att detta inte är sättet man borde strukturera upp ett projekt med väldigt få komponenter, men jag siktar bara på G så jag hoppas det är ok.


function Searchbar() {
  // States för varje element
  const [word, setWord] = useState('');
  const [clickedWord, setClickedWord] = useState('');
  const [definition, setDefinition] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [phonetic, setPhonetic] = useState(null);
  const [example, setExample] = useState(null);
  const [meaning, setMeaning] = useState(null);
  const [synonyms, setSynonyms] = useState(null);
  const [error, setError] = useState(null);

  // API fetch sker på klick
  const fetchWordDefinition = async () => {
    // Reset values
    setDefinition(null);
    setAudioUrl(null);
    setPhonetic(null);
    setExample(null);
    setMeaning(null);
    setSynonyms(null);
    setError(null);

    // fetch sker endast om ett ord matats in i inputfältet
    if (word) {
      setClickedWord(word); // används för att rendera ordet nedan
      
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
          const meaningWithSynonyms = data[0].meanings.find(
            (meaning) => meaning.synonyms && meaning.synonyms.length > 0
          );
          if (meaningWithSynonyms) {
            setSynonyms(meaningWithSynonyms.synonyms);
          }
          setMeaning(data[0].meanings.map(meaning => meaning.partOfSpeech).join(', '));
        }
        setError(null);
      } catch (error) {
        setError('Error fetching the API: ' + error.message);
        setDefinition(null);
        setAudioUrl(null);
        setPhonetic(null);
        setExample(null);
        setMeaning(null);
        setSynonyms(null);
      }
    } else {
      setError('No word entered');
    }
  };
  // emelenten renderas endast om ett värde finns
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
        {(definition || meaning || phonetic || example || synonyms || audioUrl) && 
          <h1 className='word-title'>{clickedWord}</h1>}
        {definition && <p className='description'><strong>Definition:</strong> {definition}</p>}
        {meaning && <p className='meaning'><strong>Meaning:</strong> {meaning}</p>}
        {phonetic && <p className='phonetic'><strong>Phonetic:</strong> {phonetic}</p>}
        {example && <p className='example'><strong>Example:</strong> {example}</p>}
        {synonyms && <p className='synonyms' data-testid="synonyms-container"><strong>Synonyms:</strong> {synonyms.join(', ')}</p>}
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





