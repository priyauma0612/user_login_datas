let currentUser = null;
const users = {};

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (users[email] && users[email] === password) {
    currentUser = email;
    showDashboard();
  } else {
    alert("Invalid credentials or user doesn't exist.");
  }
}

function signup() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (users[email]) {
    alert("User already exists.");
  } else {
    users[email] = password;
    alert("Sign up successful. You can now log in.");
  }
}

function showDashboard() {
  document.getElementById("login-form").classList.add("hidden");
  document.getElementById("dashboard").classList.remove("hidden");
  document.getElementById("userEmail").textContent = currentUser;

  const savedData = JSON.parse(localStorage.getItem(currentUser)) || {};
  document.getElementById("watchlist").value = savedData.watchlist || "";
  document.getElementById("portfolio").value = savedData.portfolio || "";
  document.getElementById("notes").value = savedData.notes || "";

  if (savedData.profileImage) {
    document.getElementById("profilePreview").src = savedData.profileImage;
  }
}

function previewImage() {
  const file = document.getElementById("profileImage").files[0];
  const reader = new FileReader();

  reader.onloadend = function () {
    document.getElementById("profilePreview").src = reader.result;
    const userData = JSON.parse(localStorage.getItem(currentUser)) || {};
    userData.profileImage = reader.result;
    localStorage.setItem(currentUser, JSON.stringify(userData));
  };

  if (file) {
    reader.readAsDataURL(file);
  }
}

function saveData() {
  const watchlist = document.getElementById("watchlist").value;
  const portfolio = document.getElementById("portfolio").value;
  const notes = document.getElementById("notes").value;
  const profileImage = document.getElementById("profilePreview").src;

  localStorage.setItem(currentUser, JSON.stringify({
    watchlist,
    portfolio,
    notes,
    profileImage
  }));

  alert("Data saved!");
}

function logout() {
  currentUser = null;
  document.getElementById("login-form").classList.remove("hidden");
  document.getElementById("dashboard").classList.add("hidden");
  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
}

function calculateProfit() {
  const portfolioText = document.getElementById("portfolio").value;
  const lines = portfolioText.split("\n");
  const prices = {
    AAPL: 170,
    MSFT: 310,
    TSLA: 200,
    GOOG: 2800,
    AMZN: 3400
  };

  let totalProfit = 0;
  const profits = [];

  lines.forEach(line => {
    const [symbol, sharesStr] = line.split(":");
    const shares = parseFloat(sharesStr);
    const price = prices[symbol.trim().toUpperCase()];
    if (!isNaN(shares) && price) {
      const value = shares * price;
      profits.push({ symbol: symbol.trim(), value });
      totalProfit += value;
    }
  });

  document.getElementById("profitDisplay").innerText =
    "Total Estimated Value: $" + totalProfit.toFixed(2);
  drawChart(profits);
}

function drawChart(profitData) {
  const ctx = document.getElementById("profitChart").getContext("2d");
  if (window.profitChart) {
    window.profitChart.destroy();
  }

  window.profitChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: profitData.map(p => p.symbol),
      datasets: [{
        label: "Value ($)",
        data: profitData.map(p => p.value),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      animation: {
        duration: 1000,
        easing: 'easeOutBounce'
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

function exportCSV() {
  const portfolioText = document.getElementById("portfolio").value;
  const lines = portfolioText.split("\n");
  let csv = "Symbol,Shares\n";

  lines.forEach(line => {
    const [symbol, shares] = line.split(":");
    if (symbol && shares) {
      csv += `${symbol.trim()},${shares.trim()}\n`;
    }
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "portfolio.csv";
  a.click();
}

function toggleTheme() {
  document.body.classList.toggle("dark-mode");
}
