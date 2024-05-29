import {Card, Container} from "react-bootstrap";
import {useContext, useEffect, useState} from "react";
import { db } from './firebase/firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import Nav from "react-bootstrap/Nav";
import CatalogSector from "./CatalogSector.jsx";
import './css/catalog.css';
import {BookContext} from "./BookContext.jsx";
import {useNavigate} from "react-router-dom";

function Catalog() {

    const [books, setBooks] = useState([]);
    const { recommendedBook, setRecommendedBook } = useContext(BookContext);
    const [groupingType, setGroupingType] = useState('year_of_publication');
    const navigate = useNavigate();

    const { setCurrentBook } = useContext(BookContext);

    const goToTheBook = () => {
        setCurrentBook(recommendedBook);
        navigate('/book-detailed');
    };


    function groupByKey(booksArray, key){
        return booksArray.reduce((grouped, book) => {
            const value = book[key] || 'Остальное';
            if (!grouped[value]) {
                grouped[value] = [];
            }
            grouped[value].push(book);
            return grouped;
        }, {});
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    async function getData() {
        const booksCollection = collection(db, 'books');
        const booksSnapshot = await getDocs(booksCollection);
        return booksSnapshot.docs.map(doc => ({
            id: doc.id, // Include the document ID
            ...doc.data() // Spread the rest of the document data
        }));
    }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
    function groupBooks(booksList, newGroupingKey="year_of_publication"){
        booksList.sort((a, b) => a.name.localeCompare(b.name));
        const booksMap = groupByKey(booksList, newGroupingKey);
        const sortedKeys = Object.keys(booksMap).sort((a, b) => b - a);
        const sortedBooks = sortedKeys.map(key => ({key, books: booksMap[key]}));
        console.log(sortedBooks);
        setBooks(sortedBooks);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    function recommendBook(booksList) {
        const currentYear = new Date().getFullYear();
        const filteredBooks = booksList
            .filter(book => book.year_of_publication && (currentYear - book.year_of_publication >= 3))
            .sort((a, b) => b.rating - a.rating);
        const topRatedBooks = filteredBooks.filter(book => book.rating === filteredBooks[0].rating);
        const randomBook = topRatedBooks[Math.floor(Math.random() * topRatedBooks.length)];
        setRecommendedBook(randomBook);
    }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
    function updateBooksInfo(newGroupingKey){
        getData().then(
            (books) =>{
                if (!recommendedBook) {
                    recommendBook(books);
                }
                groupBooks(books, newGroupingKey);
            }
        );
    }

    const changeGroups = (newGroupingKey) => {
        setGroupingType(newGroupingKey);
        updateBooksInfo(newGroupingKey);
    };


    useEffect( () => {
        console.log(books);
        if(books.length === 0){
            updateBooksInfo();
        }
    }, [books, updateBooksInfo]);

    return (
        <main>
            <Container>
                <Card className="recommended bg-dark text-white" onClick={goToTheBook}>
                    <Card.ImgOverlay>
                        <div className="recommendation-title">Рекомендуем</div>
                        {recommendedBook && (
                            <div>
                                <div className="recommended-name">
                                    {recommendedBook.name}
                                </div>
                                <div className="recommended-authors">
                                    {recommendedBook.authors.join(', ')}
                                </div>
                            </div>
                        )}
                        {!recommendedBook &&(
                            <Card.Text>
                                Добавьте больше книг, чтобы получить доступ к системе рекомендаций
                            </Card.Text>
                        )}
                    </Card.ImgOverlay>
                </Card>
                <div className="navigation-container">
                    <div className="navigation-header">
                        Сначала...
                    </div>
                    <Nav variant="pills" defaultActiveKey="getNew">
                        <Nav.Item>
                            <Nav.Link eventKey="getNew" onClick={() => {changeGroups("year_of_publication")}}>
                                Новое
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="getPopular" onClick={() => {changeGroups("rating")}}>
                                Популярное
                            </Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                            <Nav.Link eventKey="getByAuthor" onClick={() => {changeGroups("authors")}}>
                                По авторам
                            </Nav.Link>
                        </Nav.Item>
                    </Nav>
                </div>
                {books.map((item) => (
                    <CatalogSector key={item.key} sectorKey={item.key} books={item.books} groupingType={groupingType}/>
                ))}
            </Container>
        </main>
    );
}

export default Catalog;