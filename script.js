document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const resultsContainer = document.getElementById('resultsContainer');
    let paribhashaData = [];

    // Function to fetch data from the JSON file
    async function fetchData() {
        try {
            // Fetching from the cleaned file
            const response = await fetch('paribhasha_data.json');
            paribhashaData = await response.json();
        } catch (error) {
            console.error('Error fetching data:', error);
            resultsContainer.innerHTML = '<p class="no-results">Error loading data. Please check the console for details.</p>';
        }
    }

    // Function to sanitize text by removing asterisks and cite tags
    function sanitizeText(text) {
        if (typeof text === 'string') {
            // This regex removes asterisks and the word 'cite'
            // followed by a colon and any characters inside curly braces.
            return text.replace(/[\*\s]*{cite:[^}]+}/gi, '').replace(/\s+/g, ' ').trim();
        }
        return text;
    }

    // Function to render a single nyaya
    function renderNyaya(nyaya) {
        const nyayaCard = document.createElement('div');
        nyayaCard.className = 'nyaya-card';

        const title = `
            <h2 class="nyaya-title">Nyaya ${nyaya.nyaya_number}: <span>${sanitizeText(nyaya.nyaya_name)}</span></h2>
        `;
        nyayaCard.innerHTML += title;

        for (const section in nyaya.text) {
            const sectionTitle = section.replace(/_/g, ' ');
            const content = sanitizeText(nyaya.text[section]);

            const sectionDiv = document.createElement('div');
            sectionDiv.innerHTML = `
                <h3 class="section-title">${sectionTitle.charAt(0).toUpperCase() + sectionTitle.slice(1)}</h3>
                <p class="section-content">${content}</p>
            `;
            nyayaCard.appendChild(sectionDiv);
        }

        resultsContainer.appendChild(nyayaCard);
    }

    // Function to display all nyayas
    function displayAllNyayas() {
        resultsContainer.innerHTML = '';
        paribhashaData.forEach(nyaya => renderNyaya(nyaya));
    }

    // Function to handle search logic
    function handleSearch() {
        const query = searchInput.value.toLowerCase().trim();
        resultsContainer.innerHTML = '';

        if (!query) {
            displayAllNyayas();
            return;
        }

        const filteredNyayas = paribhashaData.filter(nyaya => {
            const byNumber = nyaya.nyaya_number.toString().includes(query);
            const byName = nyaya.nyaya_name.toLowerCase().includes(query);
            return byNumber || byName;
        });

        if (filteredNyayas.length > 0) {
            filteredNyayas.forEach(nyaya => renderNyaya(nyaya));
        } else {
            resultsContainer.innerHTML = '<p class="no-results">No results found for your search.</p>';
        }
    }

    // Initialize the app
    fetchData().then(() => {
        displayAllNyayas();
        searchInput.addEventListener('input', handleSearch);
    });
});

