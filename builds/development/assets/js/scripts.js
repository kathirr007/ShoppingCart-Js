/*jshint multistr: true */
window.onload = (function () {
  var xmlhttp = new XMLHttpRequest(),
    url = 'assets/data/cart.json',
    currency = ''

  xmlhttp.onreadystatechange = function () {
    if (xmlhttp.readyState == 4) {
      loadCartItems(xmlhttp.responseText)
    }
  }
  xmlhttp.open('GET', url, true)
  xmlhttp.send()

  function createproductID(name) {
    if (name == '' || name == null) return ''
    return name.toLowerCase().split(' ').join('-')
  }

  function loadCartItems(response) {
    var cart = JSON.parse(response),
      productsInCart = cart.items,
      cartItemsList = ''

    console.log(productsInCart)

    for (let i = 0; i < productsInCart.length; i++) {
      let productId = createproductID(productsInCart[i].name),
        productName = productsInCart[i].name,
        productPrice = productsInCart[i].price,
        imgSrc = productsInCart[i].image

      cartItemsList += `
        <div class="product" id="${productId}" data-name="${productName}">
          <div class="card">
            <span class="discount-padge">
              ${productsInCart[i].discount}% off
            </span>
            <div class="card-body">
              <div class="product-image text-center">
                <img
                  src="${imgSrc}"
                  alt="${productName}">
              </div>
            </div>
            <div class="card-footer">
              <div class="product-name mb-5">
                item${i + 1}
              </div>
              <div class="product-price-info">
                <div class="product-price">
                  <span class="product-price--actual mr-5">Rs.${
                    productPrice.display
                  }</span>
                  <span class="product-price--display">Rs.${
                    productPrice.actual
                  }</span>
                </div>
                <div class="btn btn--outline add-to-cart">
                  Add to cart
                </div>
              </div>
            </div>
          </div>
        </div>
      `
    }
    // debugger
    document.getElementById('productsList').innerHTML = cartItemsList

    let addToCartBtns = document.querySelectorAll('.add-to-cart')
    let ht = {}
    let cartList = ''

    for (const addToCartBtn of addToCartBtns) {
      addToCartBtn.addEventListener('click', function (e) {
        let el = e.target,
          itemName = el.closest('.product').dataset.name,
          itemClass = createproductID(itemName),
          productIndex = productsInCart.findIndex(
            item => item.name === itemName
          ),
          productInCart = productsInCart.find(item => item.name == itemName),
          itemTotalPrice = 0,
          itemTotalDisplayPrice = 0,
          itemTotalDiscountPrice = 0
        if (productInCart.itemCount == undefined) {
          productInCart.itemCount = 1
        } else {
          // debugger
          productInCart.itemCount++
        }
        itemTotalDisplayPrice =
          productInCart.itemCount * productInCart.price.display
        itemTotalPrice = productInCart.itemCount * productInCart.price.actual
        itemTotalDiscountPrice =
          productInCart.price.display *
          (productInCart.discount / 100) *
          productInCart.itemCount
        if (productInCart !== null && ht[itemName] == undefined) {
          // productInCart = { ...productInCart, itemCount: 1 }
          ht[itemName] = productInCart
          cartList = `
          <tr class="${itemClass}">
                <td align="center">Item ${productIndex + 1}</td>
                <td align="center">
                  <div class="input-group mb-3">

                    <input type="number" class="form-control" data-name="${itemName}" placeholder="1" min="0" value="${
            ht[itemName].itemCount
          }">
                  </div>
                </td>
                <td align="center">Rs.<span class="item-price">
                  ${itemTotalDisplayPrice}
                </span>
                <span class="item-discount hidden">
                  ${itemTotalDiscountPrice}
                </span>
                </td>
              </tr>
        `
          document
            .querySelector('.cart-list table tbody')
            .insertAdjacentHTML('beforeend', cartList)
        } else {
          document.querySelector(`input[data-name="${itemName}"]`).value =
            ht[itemName].itemCount
          document.querySelector(
            `tr.${itemClass} .item-price`
          ).textContent = itemTotalDisplayPrice
          document.querySelector(
            `tr.${itemClass} .item-discount`
          ).textContent = itemTotalDiscountPrice
        }
        document
          .querySelector(`input[data-name="${itemName}"]`)
          .addEventListener('input', function (e) {
            let qtyArray = Array.from(
              document.querySelectorAll('.cart-list tbody input')
            ).map(item => item.value * 1)
            let priceArr = Array.from(
              document.querySelectorAll('.cart-list tbody .item-price')
            ).map(item => item.textContent * 1)
            console.log(priceArr)
            let discountArr = Array.from(
              document.querySelectorAll('.cart-list tbody .item-discount')
            ).map(item => item.textContent * 1)
            console.log(discountArr)
            let totalQty = qtyArray.reduce((acc, curr) => {
              return acc + curr
            }, 0)
            let totalPrice = priceArr.reduce((acc, curr) => {
              return acc + curr
            }, 0)
            let totalDiscount = discountArr.reduce((acc, curr) => {
              return acc + curr
            }, 0)
            // debugger
            document.querySelector('.total-qty').textContent = totalQty
            document.querySelector('.total-price').textContent = totalPrice
            document.querySelector(
              '.total-discounts'
            ).textContent = totalDiscount
            document.querySelector('.order-total').textContent =
              totalPrice - totalDiscount
            e.stopImmediatePropagation()
            let inputValue = Number(e.target.value),
              itemName = e.target.dataset.name,
              itemClass = createproductID(itemName)
            // debugger
            ht[itemName].itemCount = inputValue
            console.log(ht[itemName])
            document.querySelector(`tr.${itemClass} .item-price`).textContent =
              productInCart.itemCount * productInCart.price.display
            document.querySelector(
              `tr.${itemClass} .item-discount`
            ).textContent =
              productInCart.itemCount *
              (productInCart.price.display * (productInCart.discount / 100))
          })
        let qtyArray = Array.from(
          document.querySelectorAll('.cart-list tbody input')
        ).map(item => item.value * 1)
        let priceArr = Array.from(
          document.querySelectorAll('.cart-list tbody .item-price')
        ).map(item => item.textContent * 1)
        let discountArr = Array.from(
          document.querySelectorAll('.cart-list tbody .item-discount')
        ).map(item => item.textContent * 1)
        let totalQty = qtyArray.reduce((acc, curr) => {
          return acc + curr
        }, 0)
        let totalPrice = priceArr.reduce((acc, curr) => {
          return acc + curr
        }, 0)
        let totalDiscount = discountArr.reduce((acc, curr) => {
          return acc + curr
        }, 0)
        // debugger
        document.querySelector('.total-qty').textContent = totalQty
        document.querySelector('.total-price').textContent = totalPrice
        document.querySelector('.total-discounts').textContent = totalDiscount
        document.querySelector('.order-total').textContent =
          totalPrice - totalDiscount
      })
    }
  }
})()
