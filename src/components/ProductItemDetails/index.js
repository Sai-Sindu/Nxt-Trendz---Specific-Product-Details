// Write your code here
import {Component} from 'react'
import Cookies from 'js-cookie'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Loader from 'react-loader-spinner'

import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'

const apiStatusList = {
  initial: 'INITIAL',
  inProgress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'failure',
}

class ProductItemDetails extends Component {
  state = {
    productItemDetailsList: {},
    similarProducts: [],
    count: 1,
    apiStatus: apiStatusList.initial,
  }

  componentDidMount() {
    this.getProductItemDetails()
  }

  getFormattedData = eachProduct => ({
    id: eachProduct.id,
    imageUrl: eachProduct.image_url,
    title: eachProduct.title,
    price: eachProduct.price,
    description: eachProduct.description,
    brand: eachProduct.brand,
    totalReviews: eachProduct.total_reviews,
    rating: eachProduct.rating,
    availability: eachProduct.availability,
    style: eachProduct.style,
  })

  getProductItemDetails = async () => {
    this.setState({apiStatus: apiStatusList.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()

      const updatedData = this.getFormattedData(fetchedData)
      const UpdatedSimilarProducts = fetchedData.similar_products.map(
        eachProduct => this.getFormattedData(eachProduct),
      )

      this.setState({
        productItemDetailsList: updatedData,
        similarProducts: UpdatedSimilarProducts,
        apiStatus: apiStatusList.success,
      })
    } else if (response.status === 404) {
      this.setState({apiStatus: apiStatusList.failure})
    }
  }

  onClickIncrement = () => {
    this.setState(prevState => ({count: prevState.count + 1}))
  }

  onClickDecrement = () => {
    const {count} = this.state
    if (count > 1) {
      this.setState(prevState => ({count: prevState.count - 1}))
    }
  }

  onClickContinueShopping = () => {
    const {history} = this.props
    history.push('/products')
  }

  renderSimilarProducts = () => {
    const {similarProducts} = this.state
    return (
      <ul className="similar-items-container">
        {similarProducts.map(eachProduct => (
          <SimilarProductItem
            similarProductsDetails={eachProduct}
            key={eachProduct.id}
          />
        ))}
      </ul>
    )
  }

  renderProductsList = () => {
    const {productItemDetailsList, count} = this.state
    const {
      imageUrl,
      title,
      price,
      description,
      brand,
      totalReviews,
      rating,
      availability,
    } = productItemDetailsList

    return (
      <>
        <div className="product-item-details-container">
          <img src={imageUrl} alt="product" className="product-img" />
          <div className="product-description-container">
            <h1 className="product-title">{title}</h1>
            <p className="product-price">Rs {price}/-</p>
            <div className="rating-reviews-card">
              <p className="rating-button" type="button">
                {rating}
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star-img"
                />
              </p>
              <p className="review-text">{totalReviews} Reviews</p>
            </div>
            <p className="description-text">{description}</p>
            <div className="text-card">
              <p className="title">Available: </p>
              <p className="text">{availability}</p>
            </div>
            <div className="text-card">
              <p className="title">Brand: </p>
              <p className="text">{brand}</p>
            </div>
            <hr className="separator" />
            <div className="quantity-card">
              <button
                className="buttons"
                type="button"
                onClick={this.onClickDecrement}
                data-testid="minus"
              >
                <BsDashSquare className="operations" />
              </button>
              <p className="count-text">{count}</p>
              <button
                className="buttons"
                type="button"
                onClick={this.onClickIncrement}
                data-testid="plus"
              >
                <BsPlusSquare className="operations" />
              </button>
            </div>
            <button className="add-to-card-button" type="button">
              ADD TO CART
            </button>
          </div>
        </div>
        <h1 className="similar-products-title">Similar Products</h1>
        {this.renderSimilarProducts()}
      </>
    )
  }

  renderFailureView = () => (
    <div className="failure-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
        className="failure-view-img"
      />
      <h1 className="failure-view-text">Product Not Found</h1>
      <button
        className="continue-shopping-button"
        type="button"
        onClick={this.onClickContinueShopping}
      >
        Continue Shopping
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  renderSwitchStatusViews = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusList.inProgress:
        return this.renderLoadingView()
      case apiStatusList.success:
        return this.renderProductsList()
      case apiStatusList.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        {this.renderSwitchStatusViews()}
      </>
    )
  }
}

export default ProductItemDetails
