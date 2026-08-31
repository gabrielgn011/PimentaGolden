function comprar(){
    alert("Bem-vindo à Pimenta Gold!");
}
 
const botoes = document.querySelectorAll(".card button");
const cart = [];
const cartToggle = document.querySelector(".cart-toggle");
const cartDrawer = document.querySelector(".cart-drawer");
const cartOverlay = document.querySelector(".cart-overlay");
const closeCart = document.querySelector(".close-cart");
const cartItems = document.querySelector(".cart-items");
const emptyCart = document.querySelector(".empty-cart");
const cartCount = document.querySelector(".cart-count");
const cartTotal = document.querySelector(".cart-total strong");
const checkoutButton = document.querySelector(".checkout-button");

function money(value){
    return value.toLocaleString("pt-BR", {style:"currency", currency:"BRL"});
}

function renderCart(){
    cartItems.innerHTML = "";
    let totalItems = 0;
    let totalPrice = 0;

    cart.forEach((item, index) => {
        totalItems += item.quantity;
        totalPrice += item.price * item.quantity;
        cartItems.insertAdjacentHTML("beforeend", `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}">
                <div>
                    <h3>${item.name}</h3>
                    <p class="cart-item-price">${money(item.price)}</p>
                    <div class="quantity-control" aria-label="Quantidade de ${item.name}">
                        <button type="button" data-action="decrease" data-index="${index}" aria-label="Diminuir quantidade">−</button>
                        <span>${item.quantity}</span>
                        <button type="button" data-action="increase" data-index="${index}" aria-label="Aumentar quantidade">+</button>
                    </div>
                </div>
                <button class="remove-item" type="button" data-action="remove" data-index="${index}" aria-label="Remover ${item.name}">×</button>
            </div>`);
    });

    cartCount.textContent = totalItems;
    cartTotal.textContent = money(totalPrice);
    emptyCart.hidden = cart.length > 0;
    cartItems.hidden = cart.length === 0;
    checkoutButton.disabled = cart.length === 0;
}

function openCart(){
    cartDrawer.classList.add("is-open");
    cartDrawer.setAttribute("aria-hidden", "false");
    cartToggle.setAttribute("aria-expanded", "true");
    cartOverlay.hidden = false;
    document.body.style.overflow = "hidden";
}

function closeCartPanel(){
    cartDrawer.classList.remove("is-open");
    cartDrawer.setAttribute("aria-hidden", "true");
    cartToggle.setAttribute("aria-expanded", "false");
    cartOverlay.hidden = true;
    document.body.style.overflow = "";
}

botoes.forEach(botao => {
    botao.addEventListener("click", () => {
        const card = botao.closest(".card");
        const name = card.querySelector("h3").textContent.trim();
        const price = Number(card.querySelector("p").textContent.replace("R$", "").replace(".", "").replace(",", ".").trim());
        const image = card.querySelector("img").getAttribute("src");
        const existing = cart.find(item => item.name === name);

        if (existing) existing.quantity++;
        else cart.push({name, price, image, quantity:1});
        renderCart();
        openCart();
    });
});

cartToggle.addEventListener("click", openCart);
closeCart.addEventListener("click", closeCartPanel);
cartOverlay.addEventListener("click", closeCartPanel);
document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeCartPanel();
});

cartItems.addEventListener("click", event => {
    const button = event.target.closest("button[data-action]");
    if (!button) return;
    const item = cart[Number(button.dataset.index)];
    const action = button.dataset.action;
    if (action === "increase") item.quantity++;
    if (action === "decrease") item.quantity--;
    if (action === "remove" || item.quantity < 1) cart.splice(Number(button.dataset.index), 1);
    renderCart();
});

checkoutButton.addEventListener("click", () => {
    alert("Seu pedido está pronto! Em breve entraremos em contato para finalizar a compra.");
});

renderCart();

const accountToggle = document.querySelector(".account-toggle");
const loginModal = document.querySelector(".login-modal");
const loginOverlay = document.querySelector(".login-overlay");
const closeLogin = document.querySelector(".close-login");
const loginForm = document.querySelector(".login-form");
const loginEmail = document.querySelector("#login-email");
const loginPassword = document.querySelector("#login-password");
const togglePassword = document.querySelector(".toggle-password");
const loginFeedback = document.querySelector(".login-feedback");

function openLogin(){
    loginModal.hidden = false;
    loginOverlay.hidden = false;
    loginModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    loginEmail.focus();
}

function closeLoginPanel(){
    loginModal.hidden = true;
    loginOverlay.hidden = true;
    loginModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
}

accountToggle.addEventListener("click", openLogin);
closeLogin.addEventListener("click", closeLoginPanel);
loginOverlay.addEventListener("click", closeLoginPanel);
togglePassword.addEventListener("click", () => {
    const showingPassword = loginPassword.type === "text";
    loginPassword.type = showingPassword ? "password" : "text";
    togglePassword.textContent = showingPassword ? "Mostrar" : "Ocultar";
    togglePassword.setAttribute("aria-label", showingPassword ? "Mostrar senha" : "Ocultar senha");
});
loginForm.addEventListener("submit", event => {
    event.preventDefault();
    loginFeedback.classList.remove("is-error");
    loginFeedback.textContent = `Acesso de ${loginEmail.value.trim()} pronto para autenticar.`;
});

const searchForm = document.querySelector(".search-form");
const searchInput = document.querySelector("#search-input");
const clearSearch = document.querySelector(".clear-search");
const cards = document.querySelectorAll(".card");
const searchStatus = document.querySelector(".search-status");
const noResults = document.querySelector(".no-results");

function filterProducts(event){
    if (event) event.preventDefault();

    const term = searchInput.value.trim().toLocaleLowerCase("pt-BR");
    let visibleCards = 0;

    cards.forEach(card => {
        const productName = card.querySelector("h3").textContent.toLocaleLowerCase("pt-BR");
        const matches = !term || productName.includes(term);
        card.classList.toggle("is-hidden", !matches);
        if (matches) visibleCards++;
    });

    clearSearch.hidden = !term;
    noResults.hidden = visibleCards !== 0;
    searchStatus.textContent = term
        ? `${visibleCards} ${visibleCards === 1 ? "perfume encontrado" : "perfumes encontrados"}`
        : "Encontre a fragrância ideal para você";
}

searchForm.addEventListener("submit", filterProducts);
searchInput.addEventListener("input", filterProducts);
clearSearch.addEventListener("click", () => {
    searchInput.value = "";
    filterProducts();
    searchInput.focus();
});
 