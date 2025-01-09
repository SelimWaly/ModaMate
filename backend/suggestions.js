// DEPRECATED: Implemented as inline in search.html

document.addEventListener("DOMContentLoaded", function() {
    // Make sure the div is actually in the DOM
    let suggestionsDiv = document.getElementById("suggestions");
    if (!suggestionsDiv) {
        console.error("Failed to load AI suggestions."); // Element with id not found
        return;
    }
    let suggestions = ['black shirt', 'black hoodie', 'grey joggers', 'white bag', 'collection', 'disco skirt', 'white hat', 'red shades'];

    function suggest(list) {
        const selected = [];
        const usedIndexes = new Set();
        while (selected.length < 7) {
            const randomIndex = Math.floor(Math.random() * list.length);
            if (!usedIndexes.has(randomIndex)) {
                selected.push(list[randomIndex]);
                usedIndexes.add(randomIndex);
            }
        }
        suggestionsDiv.innerHTML = '';
        selected.forEach(suggestion => {
            suggestionsDiv.innerHTML += `<a href='results.html?query=${encodeURIComponent(suggestion)}'><span>${suggestion}</span><a>`;
        });
    }
    suggest(suggestions);
});