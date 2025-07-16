import { Routes, Route } from "react-router";
import Footer from "./components/footer/Footer";
import Home from "./components/home/Home";
import Navbar from "./components/navbar/Navbar";


function App() {

  return (
    <>

      <Navbar />
      <Routes>
        <Route index path="/" element={<Home />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
