import logo from './logo.png';
import './App.css';
import DD from './DD';

function App() {

  return (
    <div className="App">
      <header className="App-header">
        {<img src={logo} className="App-logo" alt="logo" />}
        <h1 style={{ marginBottom: '10px' }}>
          LICENSE PLATE DETECTION
        </h1>
        <p style={{ marginTop: '0.5px' }} >
          This will detect the car license plate number from the provided image
        </p>
        <DD />
      </header>
    </div>
  );

};



export default App;
