import Homepage from './Pages/homepage';
import './Styling/app.css';
import { useSelector } from 'react-redux';
import { selectSignedIn } from './Features/userSlice';
import { ItemPage } from './Pages/itempage';

function App() {

  const isSignedIn = useSelector(selectSignedIn)

  return (
    <div className="App">
        <Homepage />
        {isSignedIn && <ItemPage />}
    </div>
  );
}

export default App;
