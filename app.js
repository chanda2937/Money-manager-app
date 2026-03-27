let data = JSON.parse(localStorage.getItem("transactions")) || [];
let editId = null;

// AUTO DATE
document.getElementById("date").valueAsDate = new Date();

// OPEN POPUP
document.getElementById("addBtn").onclick = () => {
  document.getElementById("popup").classList.remove("hidden");
};

// CLOSE POPUP
document.getElementById("closeBtn").onclick = () => {
  document.getElementById("popup").classList.add("hidden");
};

// DISPLAY
function display(list) {
  const tbody = document.getElementById("list");
  tbody.innerHTML = "";

  list.forEach(t => {
    tbody.innerHTML += `
      <tr>
        <td>${t.date}</td>
        <td>${t.type}</td>
        <td>${t.sub}</td>
        <td>${t.desc || ""}</td>
        <td>₹${t.amount}</td>
        <td>
          <button onclick="editItem(${t.id})">Edit</button>
          <button onclick="deleteItem(${t.id})">Delete</button>
        </td>
      </tr>
    `;
  });

  updateSummary();
}

// SUMMARY
function updateSummary() {
  let income = 0, expense = 0;

  data.forEach(t => {
    if (t.type === "income") income += Number(t.amount);
    else expense += Number(t.amount);
  });

  document.getElementById("income").innerText = income;
  document.getElementById("expense").innerText = expense;
  document.getElementById("balance").innerText = income - expense;
}

// SAVE
document.getElementById("form").onsubmit = function(e) {
  e.preventDefault();

  try {
    let amount = document.getElementById("amount").value;
    let date = document.getElementById("date").value;
    let type = document.querySelector("input[name='type']:checked")?.value;
    let sub = document.getElementById("subcategory").value;
    let desc = document.getElementById("desc").value;

    // VALIDATION
    if (!amount || amount <= 0) throw "Enter valid amount";
    if (!date) throw "Enter date";
    if (new Date(date) > new Date()) throw "Future date not allowed";
    if (!type) throw "Select type";
    if (!sub) throw "Select subcategory";
    if (desc.length > 100) throw "Description too long";

    if (editId) {
      data = data.map(t => {
        if (t.id === editId) {
          return { id: editId, amount, date, type, sub, desc };
        }
        return t;
      });
      editId = null;
    } else {
      data.push({
        id: Date.now(),
        amount,
        date,
        type,
        sub,
        desc
      });
    }

    localStorage.setItem("transactions", JSON.stringify(data));

    display(data);

    document.getElementById("form").reset();
    document.getElementById("date").valueAsDate = new Date();
    document.getElementById("popup").classList.add("hidden");

  } catch (err) {
    alert(err);
  }
};

// DELETE
function deleteItem(id) {
  if (confirm("Delete this transaction?")) {
    data = data.filter(t => t.id !== id);
    localStorage.setItem("transactions", JSON.stringify(data));
    display(data);
  }
}

// EDIT
function editItem(id) {
  let t = data.find(item => item.id === id);

  document.getElementById("amount").value = t.amount;
  document.getElementById("date").value = t.date;
  document.querySelector(`input[value=${t.type}]`).checked = true;
  document.getElementById("subcategory").value = t.sub;
  document.getElementById("desc").value = t.desc;

  editId = id;

  document.getElementById("popup").classList.remove("hidden");
}

// FILTER
document.getElementById("filter").onchange = function() {
  let val = this.value;

  if (val === "all") display(data);
  else display(data.filter(t => t.type === val));
};

// SORT
function sortByAmount() {
  data.sort((a, b) => b.amount - a.amount);
  display(data);
}

// INITIAL LOAD
display(data);