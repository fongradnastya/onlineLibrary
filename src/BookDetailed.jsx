import { Button, Container, Modal } from "react-bootstrap";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BookContext } from './BookContext';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase/firebaseConfig';

function BookDetailed() {
    const navigate = useNavigate();
    const { currentBook, setCurrentBook } = useContext(BookContext);
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleDelete = async () => {
        if (currentBook && currentBook.id) {
            await deleteDoc(doc(db, 'books', currentBook.id));
            setCurrentBook(null); // Clear the current book context
            navigate('/catalog'); // Navigate to the home page or the list of books
        }
    };

    if (!currentBook) {
        return (
            <Container>
                <p>Книга не найдена</p>
            </Container>
        );
    }

    return (
        <Container>
            <div>
                {currentBook.name && <h3>{currentBook.name}</h3>}
                {currentBook.authors && <p>Authors: {currentBook.authors.join(', ')}</p>}
                {currentBook.year_of_publication && <p>Year of publication: {currentBook.year_of_publication}</p>}
                {currentBook.rating && <p>Rating: {currentBook.rating}</p>}
                {currentBook.ISBN && <p>ISBN: {currentBook.ISBN}</p>}
                <Button variant="success" onClick={() => navigate('/form')}>Редактировать</Button>
                <Button variant="danger" onClick={handleShow}>Удалить</Button>
            </div>

            {/* Confirmation Modal */}
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
    );
}

export default BookDetailed;
