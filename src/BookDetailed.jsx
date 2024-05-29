import {Button, Card, Container, ListGroup, Modal} from "react-bootstrap";
import {useContext, useEffect, useState} from "react";
import { useNavigate } from "react-router-dom";
import { BookContext } from './BookContext';
import {doc, deleteDoc, getDocs, collection} from 'firebase/firestore';
import { db } from './firebase/firebaseConfig';
import StarRating from "./starRating.jsx";
import bookImg from './assets/library7.jpg';
import './css/catalog.css';

function BookDetailed() {
    const navigate = useNavigate();
    const { currentBook, setCurrentBook } = useContext(BookContext);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleDelete = async () => {
        if (currentBook && currentBook.id) {
            await deleteDoc(doc(db, 'books', currentBook.id));
            setCurrentBook(null);
            navigate('/');
        }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    async function getData() {
        const booksCollection = collection(db, 'books');
        const booksSnapshot = await getDocs(booksCollection);
        return booksSnapshot.docs.map(doc => ({
            id: doc.id, // Include the document ID
            ...doc.data() // Spread the rest of the document data
        }));
    }

    function recommendBook(booksList) {
        const currentYear = new Date().getFullYear();
        const filteredBooks = booksList
            .filter(book => book.year_of_publication && (currentYear - book.year_of_publication >= 3))
            .sort((a, b) => b.rating - a.rating);
        const topRatedBooks = filteredBooks.filter(book => book.rating === filteredBooks[0].rating);
        return topRatedBooks[Math.floor(Math.random() * topRatedBooks.length)];
    }

    useEffect(() => {
        if (!currentBook) {
            getData().then((booksList) => {
                const randomBook = recommendBook(booksList);
                setCurrentBook(randomBook);
            });
        }
    }, [currentBook, setCurrentBook]);
    if (!currentBook) {
        return <div></div>
    }

    return (
        <main>
            <Container>
                <Card className="detailed-card">
                    <Card.Img variant="top" src={bookImg} />
                    <Card.Body>
                        <Card.Title>{currentBook.name}</Card.Title>
                        <Card.Text>
                            Authors: {currentBook.authors.join(', ')}
                        </Card.Text>
                    </Card.Body>
                    <ListGroup className="list-group-flush">
                        {currentBook.year_of_publication && (
                            <ListGroup.Item>Год публикации: {currentBook.year_of_publication} г.</ListGroup.Item>
                        )}
                        {currentBook.rating !== undefined && (
                            <ListGroup.Item>
                                <div className="rating-container">
                                    <div className="rating-header">
                                        Рейтинг:
                                    </div>
                                    <StarRating rating={currentBook.rating} readOnly={true} />
                                </div>
                            </ListGroup.Item>
                        )}
                        {currentBook.ISBN && (
                            <ListGroup.Item>ISBN: {currentBook.ISBN}</ListGroup.Item>
                        )}
                    </ListGroup>
                    <Card.Body>
                        <Button variant="success" className="button-edit" onClick={() => navigate('/form')}>
                            Редактировать
                        </Button>
                        <Button variant="danger" onClick={handleShow}>Удалить</Button>
                    </Card.Body>
                </Card>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>Подтверждение удаления</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Вы уверены, что хотите удалить эту книгу?</Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Отмена
                        </Button>
                        <Button variant="danger" onClick={handleDelete}>
                            Удалить
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </main>
    );
}

export default BookDetailed;
