import Footer from "./components/Footer";
import Home from "./page/Home";
import Navbar from "./components/Navbar";
function App() {
  return (
    <>
      <Navbar />
      <span className="text-rotate text-3xl text-brown-pc mt-8 w-full">
        <span className="justify-items-center">
          <span>BIENVENIDO</span>
          <span>A LA</span>
          <span>FLORERIA DE</span>
          <span>PIER</span>
          <span>Y</span>
          <span>CONY</span>
        </span>
      </span>
      <Home />
      <Footer />
    </>
  );
}

export default App;
