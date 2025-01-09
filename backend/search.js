import { db } from './db.js';

function search(query, data) {
    // Normalize query: remove extra spaces and split into terms
    let searchTerms = query.trim().replace(/\s+/g, " ").toLowerCase().split(" ");
    let searchResults =  data.filter(item => {
        let name = item.name.toLowerCase();
        let brand = item.brand.toLowerCase();
        let keywords = item.keywords.map(keyword => keyword.toLowerCase());
        return searchTerms.some(term => 
            name.includes(term) || 
            brand.includes(term) || 
            keywords.includes(term)
        );
    });
    return searchResults;
}

// (async function loadDictionary() {
//     const affix = await fetch("https://cdn.jsdelivr.net/npm/dictionaries-en/index.aff").then(res => res.text());
//     const dictionary = await fetch("https://cdn.jsdelivr.net/npm/dictionaries-en/index.dic").then(res => res.text());
//     spellChecker = nspell(affix, dictionary);
// })();

/**
 * Unified search function with spell correction
 * @param {string} query - The user's search query
 * @param {Array} database - The database to search through
 * @returns {Array} - The search results
 */

function searchPlus(queryPlus, database) {
    function correctQuery(query) {
        return query
            .trim()
            .split(/\s+/)
            .map(term => spellChecker.correct(term) || term)
            .join(" ");
    }

    // Normalize query for searching
    const searchTerms = queryPlus.trim().toLowerCase().split(/\s+/);

    // Perform the initial search
    let results = database.filter(item => {
        const name = item.name.toLowerCase();
        const brand = item.brand.toLowerCase();
        const keywords = item.keywords.map(keyword => keyword.toLowerCase());
        return searchTerms.some(term =>
            name.includes(term) || brand.includes(term) || keywords.includes(term)
        );
    });

    // If no results, attempt to correct the query and search again
    if (results.length === 0) {
        const correctedQuery = correctQuery(query);
        if (correctedQuery !== query) {
            console.log(`Corrected query: ${correctedQuery}`);
            const correctedTerms = correctedQuery.toLowerCase().split(/\s+/);
            results = database.filter(item => {
                const name = item.name.toLowerCase();
                const brand = item.brand.toLowerCase();
                const keywords = item.keywords.map(keyword => keyword.toLowerCase());
                return correctedTerms.some(term =>
                    name.includes(term) || brand.includes(term) || keywords.includes(term)
                );
            });

            // Provide feedback about the correction
            if (results.length > 0) {
                console.log(`Results found for corrected query: "${correctedQuery}"`);
            } else {
                console.log(`No results found for corrected query: "${correctedQuery}"`);
            }
        } else {
            console.log("No corrections found for the query.");
        }
    }

    return results;
}


function results(searchQuery) {
    let content = search(searchQuery, db);
    const resultsDiv = document.getElementById("results-div");
    if (!resultsDiv) {
        console.error("Element with ID 'results-div' not found!");
        return;
    }

    const resultsContent = content
        .filter(item => !isNaN(item.price)) // Filter out items with NaN price
        .map(item => `
        <div class="col">
            <div class="product" style="background: url('${item.img}'); background-size: cover; background-position: center; padding: 23px 22px; display: flex; flex-direction: column; justify-content: flex-end; color: #f5e0e0; border-radius: 20px;">
                <div class="product-inner">
                    <div class="front" style="margin-top: 2em; text-shadow: black 20px;">
                        <h2><b>${item.name}</b></h2>
                        <p>${item.price} EGP</p>
                        <button onclick="window.open('${item.link}', '_blank');">Buy from ${item.brand}</button>
                    </div>
                </div>
            </div>
        </div>
        `).join("");

    console.log(content);

    resultsDiv.innerHTML = resultsContent || "<p>We couldn't find any items matching your query.</p>";

    // // Fallback for missing images
    // document.querySelectorAll(".product").forEach(productDiv => {
    //     const backgroundImage = productDiv.style.backgroundImage;
    //     const imgUrl = backgroundImage.slice(5, -2); // Extract URL from "url('...')"
    //     const img = new Image();
    //     img.src = imgUrl;
    //     img.onerror = () => {
    //         productDiv.style.backgroundImage = "url('./assets/img/NoImage.png')";
    //     };
    // });
    // Fallback for missing images
document.querySelectorAll(".product").forEach(productDiv => {
    const backgroundImage = productDiv.style.backgroundImage;
    if (backgroundImage.startsWith("url(")) {
        const imgUrl = backgroundImage.slice(5, -2); // Extract URL from "url('...')"
        const img = new Image();
        img.src = imgUrl;

        img.onload = () => {
            // Image loaded successfully, no changes needed
        };

        img.onerror = () => {
            // Fallback to NoImage if the original image fails to load
            productDiv.style.backgroundImage = "url('./assets/img/NoImage.png')";
        };
    } else {
        // If no valid backgroundImage URL exists, set NoImage
        productDiv.style.backgroundImage = "url('./assets/img/NoImage.png')";
    }
});

}


// // Function to display results in the results div
// function displayResults(results) {
//     const resultsDiv = document.getElementById("results");
//     resultsDiv.innerHTML = ""; // Clear previous results

//     if (results.length === 0) {
//         resultsDiv.innerHTML = "<p>No results found.</p>";
//         return;
//     }

//     results.forEach((item) => {
//         const resultItem = document.createElement("div");
//         resultItem.classList.add("result-item");
//         resultItem.innerHTML = `
//             <h3>${item.name}</h3>
//             <p>Brand: ${item.brand}</p>
//             <p>Price: EGP ${item.price}</p>
//         `;
//         resultsDiv.appendChild(resultItem);
//     });
// }

// // Event listener for the search button
// document.getElementById("searchButton").addEventListener("click", () => {
//     const query = document.getElementById("searchQuery").value;
//     const results = search(query);
//     displayResults(results);
// });

export { results };