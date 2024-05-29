import Book from "./Book.jsx";
import PropTypes from 'prop-types';
import {Carousel} from "react-bootstrap";
import {useLayoutEffect, useState} from "react";

function CatalogSector({ sectorKey, books, groupingType }) {

    let displayKey;

    if(sectorKey === 'Остальное'){
        displayKey = "Прочая литература"
    }
    else{
        if (groupingType === 'year_of_publication') {
            displayKey = 'Литература за ' + sectorKey + ' год';
        } else if (groupingType === 'rating') {
            displayKey = 'Литература с рейтингом ' + sectorKey + '/10 звёзд';
        } else if (groupingType === 'authors') {
            displayKey = 'Литература от автора ' + sectorKey.split(',').join(', ');
        } else {
            displayKey = sectorKey; // Default case
        }
    }


    const [booksPerSlide, setBooksPerSlide] = useState(3);


    const showArrows = books.length > booksPerSlide;

    useLayoutEffect(() => {
        function updateSize() {
            const newWidth = window.innerWidth;
            if (newWidth < 768) { // Adjust breakpoint as needed
                setBooksPerSlide(1);
            } else {
                setBooksPerSlide(3);
            }
        }
        window.addEventListener('resize', updateSize);
        updateSize(); // Call once to set initial value
        return () => window.removeEventListener('resize', updateSize);
    }, []); // Removed windowWidth from the dependency array



    // Split the books array into groups
    const groupedBooks = [];
    for (let i = 0; i < books.length; i += booksPerSlide) {
        groupedBooks.push(books.slice(i, i + booksPerSlide));
    }

    return (
        <div className="catalog-sector">
            <h2 className="group-header">{displayKey}</h2>
            <Carousel
                interval={null}
                indicators={false}
                className="catalog-carousel"
                nextIcon={showArrows ? <span aria-hidden="true" className="carousel-control-next-icon custom-next-icon" /> : null}
                prevIcon={showArrows ? <span aria-hidden="true" className="carousel-control-prev-icon custom-prev-icon" /> : null}
            >
                {groupedBooks.map((group, index) => (
                    <Carousel.Item key={index}>
                        <div className="book-group">
                            {group.map(book => (
                                <Book key={book.id} book={book} />
                            ))}
                        </div>
                    </Carousel.Item>
                ))}
            </Carousel>
        </div>
    );
}

CatalogSector.propTypes = {
    sectorKey: PropTypes.string.isRequired,
    books: PropTypes.arrayOf(PropTypes.object).isRequired,
    groupingType: PropTypes.string
};

export default CatalogSector;