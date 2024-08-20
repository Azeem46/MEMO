import Header from './components/Header';
import { Outlet } from 'react-router-dom';
import './index.css';

const App = () => {
 
  return (
    <>
      <Header />
      <div className="my-2 mx-auto max-w-screen-lg px-4">
      <Outlet />
      </div>
    </>
  );
}

export default App;
