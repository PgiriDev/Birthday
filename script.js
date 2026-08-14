// Replace this with your Google Apps Script Web App URL
const SCRIPT_URL = "YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";

// Array of soft gradient backgrounds for dynamic cards
const cardColors = [
    "linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)",
    "linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)",
    "linear-gradient(120deg, #fbc2eb 0%, #a6c1ee 100%)",
    "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
    "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
    "linear-gradient(120deg, #8fd3f4 0%, #84fab0 100%)"
];

document.getElementById('wishForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;

    const formData = {
        name: document.getElementById('name').value,
        relation: document.getElementById('relation').value,
        message: document.getElementById('message').value
    };

    fetch(SCRIPT_URL, {
        method: 'POST',
        body: JSON.stringify(formData)
    })
    .then(response => response.json())
    .then(data => {
        submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Wish to Sir';
        submitBtn.disabled = false;
        document.getElementById('wishForm').reset();
        document.getElementById('successModal').style.display = 'flex';
        fetchWishes(); // Refresh list
    })
    .catch(error => {
        console.error('Error!', error);
        alert('Something went wrong. Please try again.');
        submitBtn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Send Wish to Sir';
        submitBtn.disabled = false;
    });
});

function closeModal() {
    document.getElementById('successModal').style.display = 'none';
}

// Fetch wishes on page load
function fetchWishes() {
    fetch(SCRIPT_URL)
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById('wishesContainer');
        document.getElementById('totalWishes').innerText = data.length;
        
        if(data.length === 0) {
            container.innerHTML = '<p class="loading-text">No wishes yet. Be the first one to wish Sir!</p>';
            return;
        }

        container.innerHTML = "";
        // Reverse array to show latest wishes first
        data.reverse().forEach((wish, index) => {
            const randomBg = cardColors[index % cardColors.length];
            
            const card = document.createElement('div');
            card.className = 'wish-card';
            card.style.background = randomBg;
            
            card.innerHTML = `
                <div class="wish-header">
                    <span class="wish-name"><i class="fa-solid fa-user-circle"></i> ${escapeHtml(wish.Name)}</span>
                    <span class="wish-relation">${escapeHtml(wish.Relation)}</span>
                </div>
                <p class="wish-msg">"${escapeHtml(wish.Message)}"</p>
            `;
            container.appendChild(card);
        });
    })
    .catch(err => {
        console.error('Error fetching wishes:', err);
        document.getElementById('wishesContainer').innerHTML = '<p class="loading-text">Could not load live wishes.</p>';
    });
}

function escapeHtml(text) {
    if (!text) return '';
    return text.toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Load on start & poll every 10 seconds for live updates
fetchWishes();
setInterval(fetchWishes, 10000);
