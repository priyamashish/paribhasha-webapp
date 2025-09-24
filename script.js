document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const resultsContainer = document.getElementById('resultsContainer');
    let paribhashaData = [];

    // Function to fetch data from the JSON file
    async function fetchData() {
        try {
            const response = await fetch('paribhasha_data.json');
            paribhashaData = await response.json();
            // Display a welcome message on initial load instead of all content
            resultsContainer.innerHTML = '<p class="welcome-message">Enter a number or name to search for a Paribhasha.</p>';
        } catch (error) {
            console.error('Error fetching data:', error);
            resultsContainer.innerHTML = '<p class="no-results">Error loading data. Please check the console for details.</p>';
        }
    }

    // Function to render a single nyaya
    function renderNyaya(nyaya) {
        const nyayaCard = document.createElement('div');
        nyayaCard.className = 'nyaya-card';

        const title = `
            <h2 class="nyaya-title">Nyaya ${nyaya.nyaya_number}: <span>${nyaya.nyaya_name}</span></h2>
        `;
        nyayaCard.innerHTML += title;

        for (const section in nyaya.text) {
            const sectionTitle = section.replace(/_/g, ' ');
            const content = nyaya.text[section];

            const sectionDiv = document.createElement('div');
            sectionDiv.innerHTML = `
                <h3 class="section-title">${sectionTitle.charAt(0).toUpperCase() + sectionTitle.slice(1)}</h3>
                <p class="section-content">${content}</p>
            `;
            nyayaCard.appendChild(sectionDiv);
        }

        resultsContainer.appendChild(nyayaCard);
    }

    // Function to handle search logic
    function handleSearch() {
        const query = searchInput.value.toLowerCase().trim();
        resultsContainer.innerHTML = '';

        if (!query) {
            resultsContainer.innerHTML = '<p class="welcome-message">Enter a number or name to search for a Paribhasha.</p>';
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
        searchInput.addEventListener('input', handleSearch);
    });
});
