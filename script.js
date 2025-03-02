const productContainer = document.querySelector('.products-container')
const itemContainer = document.querySelector('.items-container')
const total = document.querySelector('.total')
const confirmOrder = document.querySelector('.confirm-order')
const cart = document.querySelector('.cart')
const cartItemCount = document.querySelector('.cart-item-count')
let productListData = null;
let cartItem = JSON.parse(localStorage.getItem('cartItem')) || [];

function loadCart() {
  const itemName = cartItem.map((n) => n.name)
  const products = productContainer.querySelectorAll('.product')
  Array.from(products).forEach((product) => {
    const productName = product.querySelector('.product-name').innerText
    if (itemName.includes(productName)) {
      product.classList.add('added-item')
      i = cartItem.findIndex(i => i.name === productName)
      product.querySelector('.product-quantity').innerText = cartItem[i].quantity
    }
  })

  if (cartItem.length > 0) {
    cart.classList.add('items')
  }
  itemContainer.innerHTML = ''
  cartItemCount.innerText = cartItem.length
  total.innerText = cartItem.reduce((accumulator, current) => accumulator + (current.price * current.quantity), 0)
  cartItem.forEach((item) => {
    const div = document.createElement('div')
    div.classList.add('item')
    div.innerHTML = `
    <p class="item-name">${item.name}</p>
          <div class="item-content">
            <p class="item-quantity"><span class="quantity">${item.quantity}</span>x</p>
            <p class="item-price">@$ <span class="price">${item.price}</span></p>
            <p class="item-total-price">$ <span class="total-price-item">${item.quantity * item.price}</span></p>
            <p class="item-close"><img src="assets/images/icon-remove-item.svg" alt=""></p>
          </div>
          <hr>
    `
    itemContainer.append(div)
  })
  localStorage.setItem('cartItem', JSON.stringify(cartItem))
}


; (async function () {
  const data = await (await fetch('data.json')).json()
  productListData = data
  productListData.forEach((product) => {
    const productCard = document.createElement('div')
    productCard.classList.add('product')
    productCard.innerHTML = `<div class="product-img">
            <img src='${product.image.desktop}' alt="">
            <button class="add-to-cart">
              <div class="no-added">
                <img src="assets/images/icon-add-to-cart.svg" alt=""> <span>Add to Cart</span>
              </div>
              <div class="item-added">
                <div class="decrease">
                  <img src="assets/images/icon-decrement-quantity.svg" alt="">
                </div>
                <p class="product-quantity">1</p>
                <div class="increase">
                  <img src="assets/images/icon-increment-quantity.svg" alt="">
                </div>
              </div>
            </button>
          </div>
          <div class="product-content">
            <p class="product-category">${product.category}</p>
            <p class="product-name">${product.name}</p>
            <p class="product-price">$${product.price}</p>
          </div>`

    productContainer.append(productCard)
  })

  const addToCartBtn = document.querySelectorAll('.add-to-cart')
  Array.from(addToCartBtn).forEach((addToCart) => {
    addToCart.addEventListener('click', () => {
      const product = addToCart.parentElement.parentElement
      product.classList.add('added-item')
      console.log(product)
      const productName = product.querySelector('.product-name').innerText
      let item = productListData.find((data) => data.name == productName)
      item = { ...item, quantity: 1 }
      cartItem.push(item)
      loadCart()
      loadRemoveEvent()
    })
  })

  const increaseBtns = document.querySelectorAll('.increase')
  increaseBtns.forEach((increase) => {
    increase.addEventListener('click', (e) => {
      e.stopPropagation()
      const product = increase.parentElement.parentElement.parentElement.parentElement
      const productName = product.querySelector('.product-name').innerText
      const productQuantity = product.querySelector('.product-quantity')
      let item = cartItem.findIndex((i) => i.name === productName)
      cartItem[item].quantity = cartItem[item].quantity + 1
      productQuantity.innerText = cartItem[item].quantity
      loadCart()
      loadRemoveEvent()
    })
  })

  const decreaseBtns = document.querySelectorAll('.decrease')
  decreaseBtns.forEach((decrease) => {
    decrease.addEventListener('click', (e) => {
      e.stopPropagation()
      const product = decrease.parentElement.parentElement.parentElement.parentElement
      const productName = product.querySelector('.product-name').innerText
      const productQuantity = product.querySelector('.product-quantity')
      let item = cartItem.findIndex((i) => i.name === productName)
      if (cartItem[item].quantity > 1) {
        cartItem[item].quantity = cartItem[item].quantity - 1
        productQuantity.innerText = cartItem[item].quantity
      } else {
        cartItem = cartItem.filter((i) => i.name !== productName)
        product.classList.remove('added-item')
      }
      loadCart()
      loadRemoveEvent()

    })
  })


  loadCart()
  loadRemoveEvent()

})()

const loadRemoveEvent = () => {
  if (cartItem.length <= 0) {
    cart.classList.remove('items')
  }
  const removeBtns = document.querySelectorAll('.item-close')
  Array.from(removeBtns).forEach((remove) => {
    remove.addEventListener('click', () => {
      const itemName = remove.parentElement.parentElement.querySelector('.item-name').innerText;
      console.log(itemName)
      cartItem = cartItem.filter((i) => i.name !== itemName)
      console.log(cartItem)
      const products = productContainer.querySelectorAll('.product')
      Array.from(products).forEach((product) => {
        if (product.querySelector('.product-name').innerText === itemName) {
          product.classList.remove('added-item')
        }
      })
      loadCart()
      loadRemoveEvent()

    })
  })
}