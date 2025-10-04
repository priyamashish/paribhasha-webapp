document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const resultsContainer = document.getElementById('resultsContainer');
    let paribhashaData = [];

    // Function to fetch data from the JSON file
    async function fetchData() {
        try {
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
            // This regular expression targets and removes all asterisks and the word 'cite'
            // along with any curly braces, in a case-insensitive manner.
            return text.replace(/[\*\{}]cite/gi, '').replace(/\s+/g, ' ').trim();
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

    // Function to display a welcome message on load
    function displayWelcomeMessage() {
        resultsContainer.innerHTML = `
            <p class="no-results" style="margin-top: 10rem;">
                Enter a Nyaya number (1-57) or keyword in the search bar above to begin.
            </p>
        `;
    }
    
    // Function to display all nyayas (called only when the search field is cleared)
    function displayAllNyayas() {
        resultsContainer.innerHTML = '';
        paribhashaData.forEach(nyaya => renderNyaya(nyaya));
    }

    // Function to handle search logic
    function handleSearch() {
        const query = searchInput.value.toLowerCase().trim();
        resultsContainer.innerHTML = '';

        if (!query) {
            // If the search bar is cleared, display the welcome message again (optional: could display all)
            // Reverting to the original function here to allow users to quickly see the full list again
            displayAllNyayas(); 
            return;
        }

        const filteredNyayas = paribhashaData.filter(nyaya => {
            const byNumber = nyaya.nyaya_number.toString().includes(query);
            // Check both the original name and the sanitized name for the keyword
            const byName = sanitizeText(nyaya.nyaya_name).toLowerCase().includes(query); 
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
        // Change: Display welcome message instead of full list on first load.
        displayWelcomeMessage(); 
        searchInput.addEventListener('input', handleSearch);
    });
});