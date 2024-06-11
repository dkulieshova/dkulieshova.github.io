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
