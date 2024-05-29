import {Modal, Col, Container, Form, Row} from "react-bootstrap";
import {useContext, useState} from "react";
import Button from "react-bootstrap/Button";
import './css/form.css';
import StarRating from "./starRating.jsx";
import {BookContext} from "./BookContext.jsx";
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase/firebaseConfig';

function BookForm(){

    const { currentBook } = useContext(BookContext);
    const [isbnError, setIsbnError] = useState('');

    const [title, setTitle] = useState(currentBook ? currentBook.name : '');
    const [authors, setAuthors] = useState(currentBook ? currentBook.authors : ['']);
    const [rating, setRating] = useState(currentBook ? currentBook.rating : 0);
    const [year, setYear] = useState(currentBook ? currentBook.year_of_publication : '');
    const [isbn, setISBN] = useState(currentBook ? currentBook.ISBN : '');
    const [validated, setValidated] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalText, setModalText] = useState('');

    const resetForm = () => {
        setTitle('');
        setAuthors(['']);
        setRating(0);
        setYear('');
        setISBN('');
    };

    const handleInputChange = (e, index) => {
        const { value } = e.target;
        const list = [...authors];
        list[index] = value;
        setAuthors(list);
    };

    const handleAddClick = () => {
        setAuthors([...authors, '']);
    };

    const handleRemoveClick = index => {
        const list = [...authors];
        list.splice(index, 1);
        setAuthors(list);
    };

    const fetchISBNDetails = async (ISBN) => {
        try {
            const response = await fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${ISBN}&jscmd=details&format=json`);
            console.log(response);
            if(response.status === 200){
                const data = await response.json();
                if (data[`ISBN:${ISBN}`]) {
                    console.log('ISBN is valid:', data);
                    setIsbnError('');
                } else {
                    console.log('Invalid ISBN');
                    setIsbnError('Invalid ISBN');
                    console.log(!!isbnError);
                }
            }
        } catch (error) {
            console.error('Error validating ISBN:', error);
            setIsbnError('Error validating ISBN');
        }
    }

    const updateBook = async () => {
        const bookData = {
            id: currentBook.id,
            name: title,
            authors: authors,
            rating: rating,
            year_of_publication: year,
            ISBN: isbn
        };
        try {
            const bookRef = doc(db, 'books', currentBook.id); // currentBook.id should be the Firestore document ID
            await updateDoc(bookRef, bookData);
            console.log('Book updated with ID: ', currentBook.id);
        } catch (e) {
            console.error('Error updating book: ', e);
            console.log(currentBook);
        }
    }

    const createBook = async () => {
        try {
            const docRef = await addDoc(collection(db, 'books'), {
                name: title,
                authors: authors,
                rating: rating,
                year_of_publication: year,
                ISBN: isbn
            });
            console.log('Document written with ID: ', docRef.id);
        } catch (e) {
            console.error('Error adding document: ', e);
        }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if(isbn){
            fetchISBNDetails(isbn).then(()=>{
                if (form.checkValidity() === false) {
                    event.stopPropagation();
                    setValidated(true);
                }
                else {
                    if(currentBook){
                        updateBook();
                        setModalText("Book details have been updated!");
                        setShowModal(true);
                    }
                    else{
                        createBook();
                        setModalText("New book was added to your library!");
                        setShowModal(true);
                        resetForm();
                    }
                    setValidated(false);
                    resetForm();
                }
            });
        }
        else{
            if (form.checkValidity() === false) {
                event.stopPropagation();
                setValidated(true);
            }
            else {
                if(currentBook){
                    updateBook();
                    setModalText("Book details have been updated!");
                    setShowModal(true);

                }
                else{
                    createBook();
                    setModalText("New book was added to your library!");
                    setShowModal(true);
                    resetForm();
                }
                setValidated(false);
            }
        }
    }

    const handleValidateISBN = () => {
        fetchISBNDetails(isbn);
    };

    const header = currentBook ? "Редактировать книгу" : "Создать книгу";

    return (
        <Container className="form-container">
            <h2>{header}</h2>
            <Form noValidate validated={validated} onSubmit={handleSubmit} md="8" className="book-form">
                <Form.Group as={Col} md="4" controlId="validationCustom01">
                    <Form.Label>Название книги</Form.Label>
                    <Form.Control
                        required
                        type="text"
                        placeholder="Введите название книги"
                        maxLength="100"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">
                        Название не может быть пустым
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Label>Автор книги</Form.Label>
                {authors.map((author, index) => (
                    <Row key={index}>
                        <Col>
                            <Form.Group controlId="validationCustom02">
                                <Form.Control
                                    required
                                    type="text"
                                    placeholder="Введите имя автора"
                                    value={author}
                                    onChange={e => handleInputChange(e, index)}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Данные об авторе не введены
                                </Form.Control.Feedback>
                            </Form.Group>
                        </Col>
                        <Col xs="auto">
                            {authors.length !== 1 && <Button variant="danger" onClick={() => handleRemoveClick(index)}>Удалить автора</Button>}
                        </Col>
                    </Row>
                ))}
                <Button variant="primary" onClick={handleAddClick}>Добавить автора</Button>
                <Form.Group as={Col} md="4" controlId="validationCustom02">
                    <Form.Label>Год публикации</Form.Label>
                    <Form.Control
                        type="number"
                        placeholder="Введите год публикации"
                        min="1800"
                        max="2024"
                        value={year}
                        onChange={e => setYear(e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">
                        Год публикации должен быть между 1800 и 2024
                    </Form.Control.Feedback>
                </Form.Group>
                <Form.Label>Рейтинг книги</Form.Label>
                <StarRating rating={rating} setRating={setRating}/>
                <Form.Group as={Row} controlId="validationCustom05">
                    <Form.Label>ISBN</Form.Label>
                    <Col>
                        <Form.Control
                            type="text"
                            placeholder="Введите ISBN номер"
                            value={isbn}
                            isInvalid={!!isbnError}
                            onChange={e => setISBN(e.target.value)}
                        />
                        <Form.Control.Feedback type="invalid">
                            {isbnError}
                        </Form.Control.Feedback>
                    </Col>
                    <Col>
                        <Button onClick={handleValidateISBN}>Проверить ISBN</Button>
                    </Col>
                </Form.Group>
                <Button type="submit" variant="success">Сохранить изменения</Button>
            </Form>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Success</Modal.Title>
                </Modal.Header>
                <Modal.Body>{modalText}</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default BookForm