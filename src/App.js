import logo from './logo.svg';
import './App.css';
import { ImageEditor } from './components/ImageEditor';

function App() {
  return (
    <ImageEditor 
      imageUrl="https://liturgiadashoras.online/comunidade/wp-content/uploads/2021/05/sao-filipe-neri.jpg"
    />
  );
}

export default App;
