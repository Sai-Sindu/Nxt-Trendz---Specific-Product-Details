// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {similarProductsDetails} = props
  const {imageUrl, title, price, brand, rating} = similarProductsDetails

  return (
    <li className="similar-product-card">
      <img
        src={imageUrl}
        alt={`similar product ${title}`}
        className="similar-img"
      />
      <h1 className="title-text">{title}</h1>
      <p className="brand-text">by {brand}</p>
      <div className="price-rating-card">
        <p className="price-text">Rs {price}/-</p>
        <button className="rating-button" type="button">
          {rating}
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="star-img"
          />
        </button>
      </div>
    </li>
  )
}

export default SimilarProductItem
