import './App.css';
import Searchbar from './components/searchbar/searchbar';
import Header from './components/header/header';

function App() {


  return (
    <div className="App">
      <Header/>

      <div className='search-section'>
      <Searchbar/>
      </div>
      
    </div>
  );
}

export default App;
