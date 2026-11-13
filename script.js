let documents = JSON.parse(
    localStorage.getItem("myLockerDocuments") || "[]"
);

const form = document.getElementById("uploadForm");

function saveData() {
    localStorage.setItem(
        "myLockerDocuments",
        JSON.stringify(documents)
    );
}

function renderDocuments() {

    let list = document.getElementById("documentList");

    let search = document.getElementById("searchInput")
        .value.toLowerCase();

    let category = document.getElementById("filterCategory").value;

    let filtered = documents.filter(doc =>
        (category === "All" || doc.category === category) &&
        (doc.title.toLowerCase().includes(search) ||
         doc.fileName.toLowerCase().includes(search))
    );

    list.innerHTML = "";

    if (filtered.length === 0) {
        list.innerHTML = '<p class="empty">No documents found.</p>';
    }

    filtered.forEach(doc => {

        let row = document.createElement("div");
        row.className = "doc-row";

        let info = document.createElement("div");

        let title = document.createElement("strong");
        title.textContent = "📄 " + doc.title;

        let details = document.createElement("small");
        details.textContent =
            doc.category + " | " + doc.fileName;

        info.append(title, document.createElement("br"), details);

        let button = document.createElement("button");
        button.textContent = "Delete";
        button.className = "delete-btn";

        button.onclick = () => {
            if (confirm("Delete this document?")) {
                documents = documents.filter(
                    item => item.id !== doc.id
                );
                saveData();
                renderDocuments();
            }
        };

        row.append(info, button);
        list.appendChild(row);
    });

    document.getElementById("totalCount").textContent =
        documents.length;

    document.getElementById("notesCount").textContent =
        documents.filter(d => d.category === "Notes").length;

    document.getElementById("certificatesCount").textContent =
        documents.filter(d => d.category === "Certificates").length;

    renderCategory("Notes");
    renderCategory("Certificates");
}

function renderCategory(category) {

    let id = category.toLowerCase() + "List";

    document.getElementById(id).innerHTML = "";

    documents.filter(d => d.category === category)
        .forEach(doc => {
            let p = document.createElement("p");
            p.textContent = "📄 " + doc.title;
            document.getElementById(id).appendChild(p);
        });
}

form.addEventListener("submit", function(e) {

    e.preventDefault();

    let title = document.getElementById("docTitle").value.trim();
    let file = document.getElementById("docFile").files[0];
    let category = document.getElementById("docCategory").value;

    if (!title || !file) return;

    if (file.size > 5 * 1024 * 1024) {
        alert("File must be smaller than 5 MB.");
        return;
    }

    let allowed = /\.(pdf|jpg|jpeg|png|doc|docx)$/i;

    if (!allowed.test(file.name)) {
        alert("Please select a valid document.");
        return;
    }

    documents.push({
        id: Date.now().toString(),
        title: title,
        category: category,
        fileName: file.name
    });

    saveData();
    form.reset();
    renderDocuments();

    alert("Document details added successfully!");
});

document.getElementById("searchInput")
    .addEventListener("input", renderDocuments);

document.getElementById("filterCategory")
    .addEventListener("change", renderDocuments);

// Dark Mode

document.getElementById("themeBtn").onclick = function() {

    document.body.classList.toggle("dark");

    let dark = document.body.classList.contains("dark");

    this.textContent = dark ? "☀️ Light Mode" : "🌙 Dark Mode";

    localStorage.setItem("myLockerTheme", dark ? "dark" : "light");
};

if (localStorage.getItem("myLockerTheme") === "dark") {
    document.body.classList.add("dark");
    document.getElementById("themeBtn").textContent = "☀️ Light Mode";
}

renderDocuments();