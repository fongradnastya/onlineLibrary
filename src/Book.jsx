import PropTypes from 'prop-types';
import {useNavigate} from "react-router-dom";
import {useContext} from "react";
import { BookContext } from './BookContext';
import {Card, ListGroup} from "react-bootstrap";
import StarRating from "./starRating.jsx";

function Book({book}) {
    const navigate = useNavigate();

    const { setCurrentBook } = useContext(BookContext);

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
