// Database Sederhana di LocalStorage
let users = JSON.parse(localStorage.getItem('users')) || [];
let menu = JSON.parse(localStorage.getItem('menu')) || [
    { id: 1, name: "Nasi Goreng", price: 15000, img: "https://images.unsplash.com/photo-1512058560366-cd2427ff56f3?w=200" }
];
let orders = JSON.parse(localStorage.getItem('orders')) || [];
let currentUser = null;

// DOM Elements
const authSection = document.getElementById('auth-section');
const userDashboard = document.getElementById('user-dashboard');
const adminDashboard = document.getElementById('admin-dashboard');

// === LOGIKA AUTH ===
document.getElementById('auth-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('username').value;
    const role = document.getElementById('role').value;
    
    currentUser = { username: user, role: role };
    authSection.classList.add('hidden');
    
    if (role === 'admin') {
        adminDashboard.classList.remove('hidden');
        renderAdmin();
    } else {
        userDashboard.classList.remove('hidden');
        renderUserMenu();
        renderUserOrders();
    }
});

function logout() {
    location.reload();
}

// === LOGIKA USER/PEMESAN ===
function renderUserMenu() {
    const list = document.getElementById('menu-list');
    list.innerHTML = menu.map(item => `
        <div class="card">
            <img src="${item.img}" alt="${item.name}">
            <h4>${item.name}</h4>
            <p>Rp ${item.price}</p>
            <button onclick="orderItem('${item.name}')">Pesan Sekarang</button>
        </div>
    `).join('');
}

function orderItem(name) {
    const newOrder = {
        id: Date.now(),
        user: currentUser.username,
        item: name,
        status: 'Menunggu'
    };
    orders.push(newOrder);
    saveData();
    renderUserOrders();
    alert('Pesanan berhasil dibuat!');
}

function renderUserOrders() {
    const list = document.getElementById('user-orders');
    const myOrders = orders.filter(o => o.user === currentUser.username);
    list.innerHTML = myOrders.map(o => `
        <div class="card" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
            <span><b>${o.item}</b> - Status: <i class="status-badge">${o.status}</i></span>
            <div>
                ${o.status === 'Menunggu' ? `<button onclick="cancelOrder(${o.id})" style="background:red; width:auto;">Batal</button>` : ''}
                ${o.status === 'Diantar' ? `<button onclick="updateStatus(${o.id}, 'Selesai')" style="background:blue; width:auto;">Terima</button>` : ''}
            </div>
        </div>
    `).join('');
}

function cancelOrder(id) {
    orders = orders.filter(o => o.id !== id);
    saveData();
    renderUserOrders();
}

// === LOGIKA ADMIN ===
document.getElementById('add-menu-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const newItem = {
        id: Date.now(),
        name: document.getElementById('menu-name').value,
        price: document.getElementById('menu-price').value,
        img: document.getElementById('menu-img').value
    };
    menu.push(newItem);
    saveData();
    alert('Menu ditambahkan!');
    e.target.reset();
});

function renderAdmin() {
    const list = document.getElementById('admin-order-list');
    list.innerHTML = orders.map(o => `
        <tr>
            <td>${o.user}</td>
            <td>${o.item}</td>
            <td><span class="status-badge bg-${o.status.toLowerCase()}">${o.status}</span></td>
            <td>
                <select onchange="updateStatus(${o.id}, this.value)">
                    <option value="">Update Status</option>
                    <option value="Diterima">Terima</option>
                    <option value="Diproses">Proses</option>
                    <option value="Diantar">Antar</option>
                </select>
                <button onclick="deleteOrder(${o.id})" style="background:red; padding:2px 5px; width:auto;">Hapus</button>
            </td>
        </tr>
    `).join('');
}

function updateStatus(id, newStatus) {
    const idx = orders.findIndex(o => o.id === id);
    if(idx !== -1) {
        orders[idx].status = newStatus;
        saveData();
        currentUser.role === 'admin' ? renderAdmin() : renderUserOrders();
    }
}

function deleteOrder(id) {
    orders = orders.filter(o => o.id !== id);
    saveData();
    renderAdmin();
}

function saveData() {
    localStorage.setItem('menu', JSON.stringify(menu));
    localStorage.setItem('orders', JSON.stringify(orders));
}