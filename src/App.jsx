import { BrowserRouter } from "react-router-dom";
import RoutesWithAnimation from "./layout/RoutesComponents";
import "./App.css";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <BrowserRouter>
        <RoutesWithAnimation />
      </BrowserRouter>
    </>
  );
}

export default App;
