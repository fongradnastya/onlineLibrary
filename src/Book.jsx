import PropTypes from 'prop-types';
import {useNavigate} from "react-router-dom";
import {useContext} from "react";
import { BookContext } from './BookContext';
import {Card, ListGroup} from "react-bootstrap";
import StarRating from "./starRating.jsx";
import library1 from './assets/library1.jpg';
import library2 from './assets/library2.jpg';
import library3 from './assets/library3.jpg';
import library4 from './assets/library4.jpg';
import library5 from './assets/library5.jpg';
import library6 from './assets/library6.jpg';
import library7 from './assets/library7.jpg';

function Book({book}) {
    const navigate = useNavigate();

    const { setCurrentBook } = useContext(BookContext);

    const libraryImages = [library1, library2, library3, library4, library5, library6, library7];
    // Generate a random index to select an image
    const randomIndex = Math.floor(Math.random() * libraryImages.length);
    // Select a random image from the array
    const bookImg = libraryImages[randomIndex];

    const handleClick = () => {
        setCurrentBook(book);
        navigate('/book-detailed');
    };

    if (!book) {
        return (
            <p>
                Книга не найдена
            </p>
        )
    }

    return(
        <div className="book-card" onClick={handleClick}>
            <Card>
                <Card.Img variant="top" src={bookImg} />
                <Card.Body>
                    <Card.Title>{book.name}</Card.Title>
                    <Card.Text>
                        {book.authors.join(', ')}
                    </Card.Text>
                </Card.Body>
                <ListGroup className="list-group-flush">
                    {book.year_of_publication && (
                        <ListGroup.Item>Год публикации: {book.year_of_publication} г.</ListGroup.Item>
                    )}
                    {book.rating !== undefined && (
                        <ListGroup.Item>
                            <div className="rating-container">
                                <div className="rating-header">
                                    Рейтинг:
                                </div>
                                <StarRating rating={book.rating} readOnly={true} />
                            </div>
                        </ListGroup.Item>
                    )}
                    {book.ISBN && (
                        <ListGroup.Item>ISBN: {book.ISBN}</ListGroup.Item>
                    )}
                </ListGroup>
            </Card>
        </div>
    )
}

Book.propTypes = {
    book: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        authors: PropTypes.arrayOf(PropTypes.string),
        year_of_publication: PropTypes.number,
        rating: PropTypes.number,
        ISBN: PropTypes.string,
    }),
};

export default Book;
