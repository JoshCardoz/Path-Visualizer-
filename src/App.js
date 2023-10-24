import logo from './logo.svg';
import './App.css';
import GridComponent from './Grid';

function App() {
  return (
    <div className="App">
        <GridComponent rows={20} cols={50} style={{margin : "100px"}}/>
    </div>
);
   
}

export default App;
