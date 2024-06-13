async function loadContent(lang) {
    const response = await fetch('content.json');
    const data = await response.json();
    return data[lang];
}

// Update page content based on language
async function changeLanguage(lang) {
    const content = await loadContent(lang);

    document.getElementById('title').innerText = content.title;
    document.getElementById('description').innerText = content.description;
    document.getElementById('name').innerText = content.name;
    document.getElementById('cours').innerText = content.cours;
    document.getElementById('mail').innerText = content.mail;
    document.getElementById('education-title').innerText = content.education;
    document.getElementById('languages-title').innerText = content.languages;
    document.getElementById('video-title').innerText = content.video;

    const tableHeaders = document.querySelectorAll('th');
    const tableRows = document.querySelectorAll('td');
    const headers = content.table.header;
    const rows = content.table.rows;

    tableHeaders[0].textContent = headers.establishment;
    tableHeaders[1].textContent = headers.details;
    tableHeaders[2].textContent = headers.country;
    tableHeaders[3].textContent = headers.years;

    for (let i = 0; i < rows.length; i++) {
        tableRows[i * 4].textContent = rows[i].establishment;
        tableRows[i * 4 + 1].textContent = rows[i].details;
        tableRows[i * 4 + 2].textContent = rows[i].country;
        tableRows[i * 4 + 3].textContent = rows[i].years;
    }

    // Update the lang attribute of the HTML tag
    document.documentElement.lang = lang;

    // Update the title of the page
    document.getElementById('page-title').innerText = content.title;
}

// Initialize with default language
document.addEventListener('DOMContentLoaded', () => {
    const defaultLang = 'fr'; // Change this to your default language if needed
    changeLanguage(defaultLang);
});
