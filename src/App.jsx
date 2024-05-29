import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Header from './Header.jsx';
import Catalog from './Catalog.jsx';
import Form from './Form.jsx';
import Footer from './Footer.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/base.css';
import BookDetailed from "./BookDetailed.jsx";
import { BookContext } from './BookContext';
import {useState} from "react";


function App() {

    const [currentBook, setCurrentBook] = useState(null);
    const [recommendedBook, setRecommendedBook] = useState(null);

    return (
      <Router>
          <div className="App">
              <Header />
              <BookContext.Provider value={{ currentBook, setCurrentBook, recommendedBook, setRecommendedBook }}>
                  <Routes>
                      <Route path="/" element={<Catalog setCurrentBook={setCurrentBook}/>} />
                      <Route path="/form" element={<Form/>} />
                      <Route path="/book-detailed" element={<BookDetailed/>} />
                  </Routes>
              </BookContext.Provider>
              <Footer/>
          </div>
      </Router>
  )
}

export default App
