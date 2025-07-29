console.log("Razer Gaming Shop Cart Loaded");


const cartIcon = document.querySelector("#cart-icon");
const cart = document.querySelector(".cart");
const closeCart = document.querySelector("#close-cart");
const cartTableBody = document.querySelector("#cart-table tbody");
const totalPriceElem = document.querySelector(".total-price");
const buyBtn = document.querySelector(".btn-buy");


let cartItems = [];

cartIcon.addEventListener("click", () => {
  cart.classList.add("active");
});


closeCart.addEventListener("click", () => {
  cart.classList.remove("active");
});


document.querySelectorAll(".add-cart").forEach(button => {
  button.addEventListener("click", addCartClicked);
});

buyBtn.addEventListener("click", buyButtonClicked);


function addCartClicked(event) {
  const productBox = event.target.parentElement;
  const title = productBox.querySelector(".product-title").innerText;
  const priceText = productBox.querySelector(".price").innerText;
  
  const price = parseFloat(priceText.replace(/from\s*/i, "").replace("US$", "").replace(/,/g, "").trim());

  const imgSrc = productBox.querySelector(".product-img").src;

  const existingIndex = cartItems.findIndex(item => item.title === title);
  if (existingIndex !== -1) {
   
    cartItems[existingIndex].quantity += 1;
  } else {
    
    cartItems.push({
      title: title,
      price: price,
      quantity: 1,
      imgSrc: imgSrc
    });
  }

  renderCart();
  cart.classList.add("active"); 
}

function renderCart() {
  cartTableBody.innerHTML = "";

  cartItems.forEach((item, index) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td><img src="${item.imgSrc}" alt="${item.title}"><br>${item.title}</td>
      <td>US$${item.price.toFixed(2)}</td>
      <td><input type="number" class="cart-quantity" min="1" value="${item.quantity}" data-index="${index}"></td>
      <td>US$${(item.price * item.quantity).toFixed(2)}</td>
      <td><i class='bx bxs-trash-alt cart-remove' data-index="${index}" role="button" aria-label="Remove ${item.title}"></i></td>
    `;

    cartTableBody.appendChild(tr);
  });

  
  document.querySelectorAll(".cart-quantity").forEach(input => {
    input.addEventListener("change", quantityChanged);
  });

  document.querySelectorAll(".cart-remove").forEach(btn => {
    btn.addEventListener("click", removeCartItem);
  });

  updateTotal();
}


function quantityChanged(event) {
  const input = event.target;
  let newQty = parseInt(input.value);

  if (isNaN(newQty) || newQty < 1) {
    newQty = 1;
    input.value = newQty;
  }

  const index = parseInt(input.getAttribute("data-index"));
  if (!isNaN(index) && cartItems[index]) {
    cartItems[index].quantity = newQty;
  }

  renderCart();
}


function removeCartItem(event) {
  const index = parseInt(event.target.getAttribute("data-index"));
  if (!isNaN(index)) {
    cartItems.splice(index, 1);
    renderCart();
  }
}


function updateTotal() {
  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  totalPriceElem.innerText = total.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}


function buyButtonClicked() {
  if (cartItems.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  alert(`Thank you for your purchase!\nTotal paid: ${totalPriceElem.innerText}`);

  cartItems = [];
  renderCart();
  cart.classList.remove("active");
}
