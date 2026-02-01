let cart = [];
let selectedPlatform = "";
let selectedPayment = "";

// --- CART FUNCTIONS ---

function addToCart(name, price) {
    cart.push({ name, price });
    renderCart();
}

function renderCart() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach((item, index) => {
        total += item.price;

        const li = document.createElement('li');
        li.textContent = `${item.name} - ₱${item.price}`;

        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'X';
        removeBtn.onclick = () => {
            cart.splice(index, 1);
            renderCart();
        };

        li.appendChild(removeBtn);
        cartItems.appendChild(li);
    });

    cartTotal.textContent = total.toFixed(2);
}

// --- CHECKOUT ---

function checkout() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    // Step 1: Platform selection
    let platform = prompt("Select platform:\n1. Steam\n2. Epic Games\n3. PlayStation\n4. Xbox");
    if (!platform) return;

    const platforms = {
        "1": "Steam",
        "2": "Epic Games",
        "3": "PlayStation",
        "4": "Xbox"
    };

    if (!platforms[platform]) {
        alert("Invalid choice.");
        return;
    }

    selectedPlatform = platforms[platform];

    // Step 2: Show payment modal
    document.getElementById("paymentModal").style.display = "flex";
}

// --- DYNAMIC PAYMENT FIELDS ---

function choosePayment(method) {
    selectedPayment = method;

    // Highlight selected
    document.querySelectorAll('.method').forEach(div => div.style.border = 'none');
    document.querySelector(`.method[onclick="choosePayment('${method}')"]`).style.border = '2px solid #66c0f4';

    const fields = document.getElementById("paymentFields");
    fields.innerHTML = "";

    if (method === "gcash") {
        fields.innerHTML = `<label>GCash Number (+639XXXXXXXXX):</label>
            <input type="text" id="gcashNumber" placeholder="+639123456789" style="width:100%; padding:8px; margin-top:5px; border-radius:5px; border:none;">`;
    } else if (method === "paypal") {
        fields.innerHTML = `<label>PayPal Username:</label>
            <input type="text" id="paypalUser" placeholder="Email or username" style="width:100%; padding:8px; margin-top:5px; border-radius:5px; border:none;">
            <label>PayPal Password:</label>
            <input type="password" id="paypalPass" placeholder="Password" style="width:100%; padding:8px; margin-top:5px; border-radius:5px; border:none;">`;
    } else if (method === "credit") {
        fields.innerHTML = `<label>Card Number (16 digits):</label>
            <input type="text" id="cardNumber" maxlength="16" placeholder="1234123412341234" style="width:100%; padding:8px; margin-top:5px; border-radius:5px; border:none;">
            <label>Expiration (MM/YY):</label>
            <input type="text" id="expDate" placeholder="MM/YY" style="width:100%; padding:8px; margin-top:5px; border-radius:5px; border:none;">
            <label>CVV:</label>
            <input type="password" id="cvv" maxlength="3" placeholder="123" style="width:100%; padding:8px; margin-top:5px; border-radius:5px; border:none;">`;
    } else if (method === "shopee") {
        fields.innerHTML = `<label>ShopeePay Number (+639XXXXXXXXX):</label>
            <input type="text" id="shopeeNumber" placeholder="+639123456789" style="width:100%; padding:8px; margin-top:5px; border-radius:5px; border:none;">`;
    }
}

// --- PROCESS PAYMENT / SHOW RECEIPT ---

function processPayment() {
    if (!selectedPayment) {
        alert("Please select a payment method.");
        return;
    }

    let paymentDisplay = "";
    let paymentMasked = "";

    if (selectedPayment === "gcash") {
        let num = document.getElementById("gcashNumber").value.trim().replace(/\s+/g, "");
        if (!/^\+639\d{9}$/.test(num)) {
            alert("Enter a valid GCash number (+639XXXXXXXXX).");
            return;
        }
        paymentDisplay = "GCash";
        paymentMasked = maskMobile(num);
    } else if (selectedPayment === "shopee") {
        let num = document.getElementById("shopeeNumber").value.trim().replace(/\s+/g, "");
        if (!/^\+639\d{9}$/.test(num)) {
            alert("Enter a valid ShopeePay number (+639XXXXXXXXX).");
            return;
        }
        paymentDisplay = "ShopeePay";
        paymentMasked = maskMobile(num);
    } else if (selectedPayment === "paypal") {
        let user = document.getElementById("paypalUser").value.trim();
        let pass = document.getElementById("paypalPass").value.trim();
        if (!user || !pass) {
            alert("Enter PayPal username and password.");
            return;
        }
        paymentDisplay = "PayPal (" + user + ")";
        paymentMasked = "PayPal Account";
    } else if (selectedPayment === "credit") {
        let num = document.getElementById("cardNumber").value.trim();
        let exp = document.getElementById("expDate").value.trim();
        let cvv = document.getElementById("cvv").value.trim();
        if (!/^\d{16}$/.test(num) || !exp || !/^\d{3}$/.test(cvv)) {
            alert("Enter valid credit card info.");
            return;
        }
        paymentDisplay = "Credit Card";
        paymentMasked = maskCard(num);
    }

    showReceipt(paymentDisplay, paymentMasked);
    document.getElementById("paymentModal").style.display = "none";
}

// --- MASKING FUNCTIONS ---

function maskMobile(num) {
    let last5 = num.slice(-5);
    return "+639****" + last5;
}

function maskCard(num) {
    let last4 = num.slice(-4);
    return "************" + last4;
}

// --- RECEIPT ---

function showReceipt(paymentDisplay, paymentMasked) {
    const receiptItems = document.getElementById("receiptItems");
    receiptItems.innerHTML = "";
    cart.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.name} - ₱${item.price}`;
        receiptItems.appendChild(li);
    });

    let subtotal = cart.reduce((sum, item) => sum + item.price, 0);
    let vat = subtotal * 0.12;
    let total = subtotal + vat;

    const gameKey = generateGameKey();

    document.getElementById("receiptSubtotal").textContent = subtotal.toFixed(2);
    document.getElementById("receiptVAT").textContent = vat.toFixed(2);
    document.getElementById("receiptTotal").textContent = total.toFixed(2);
    document.getElementById("receiptPlatform").textContent = selectedPlatform;
    document.getElementById("receiptKey").textContent = gameKey;
     if (paymentDisplay.includes("PayPal")) {
        document.getElementById("receiptPaymentMethod").textContent = paymentMasked;
        document.getElementById("receiptPaymentMasked").textContent = paymentDisplay;
    } else {
        document.getElementById("receiptPaymentMethod").textContent = paymentDisplay;
        document.getElementById("receiptPaymentMasked").textContent = paymentMasked;
    }

    document.getElementById("receiptModal").style.display = "flex";

    cart = [];
    renderCart();
}

// --- GENERATE GAME KEY ---

function generateGameKey() {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let key = "";
    for (let i = 0; i < 19; i++) {
        if ((i + 1) % 5 === 0 && i !== 18) key += "-";
        else key += chars[Math.floor(Math.random() * chars.length)];
    }
    return key;
}

// --- CLOSE RECEIPT ---

function closeReceipt() {
    document.getElementById("receiptModal").style.display = "none";
}