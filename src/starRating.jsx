import { useState } from 'react';
import greyStar from './assets/starEmpty.svg';
import yellowStar from './assets/starChosen.svg';
import PropTypes from "prop-types";

function StarRating({ rating, setRating, readOnly = false }) {
    const [hover, setHover] = useState(0);

    return (
        <div>
            {[...Array(10)].map((star, index) => {
                const ratingValue = index + 1;

                return (
                    <label key={index}>
                        <input
                            type="radio"
                            name="rating"
                            value={ratingValue}
                            onClick={() => !readOnly && setRating(ratingValue)}
                            style={{ display: 'none' }}
                        />
                        <img
                            src={ratingValue <= (hover || rating) ? yellowStar : greyStar}
                            onMouseEnter={() => !readOnly && setHover(ratingValue)}
                            onMouseLeave={() => !readOnly && setHover(0)}
                            alt="star"
                            style={{ cursor: readOnly ? 'default' : 'pointer' }}
                        />
                    </label>
                );
            })}
        </div>
    );
}

StarRating.propTypes = {
    rating: PropTypes.number.isRequired,
    setRating: PropTypes.func,
    readOnly: PropTypes.bool,
};

export default StarRating;
