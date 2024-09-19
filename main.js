let allPokemons = [];
let currentPage = 1;
const pokemonsPerPage = 8;
const apiUrl = "https://pokeapi.co/api/v2/pokemon";

function fetchPokemon(page = 1) {
    const offset = (page - 1) * pokemonsPerPage;
    fetch(`${apiUrl}?limit=${pokemonsPerPage}&offset=${offset}`)
        .then((response) => response.json())
        .then((data) => {
            allPokemons = data.results;
            displayPokemon(allPokemons); 
            handlePagination(data); 
        })
        .catch((error) => console.error(error));
}

function displayPokemon(pokemons) {
    const pokemonContainer = document.getElementById("pokemon-container");
    pokemonContainer.innerHTML = '';

    pokemons.forEach((pokemon, index) => {
        const pokemonId = (currentPage - 1) * pokemonsPerPage + (index + 1);
        const pokemonCard = `
            <div class="col-md-3 mb-3">
                <div class="card shadow-sm">
                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png" alt="${pokemon.name}">
                    <div class="card-body">
                        <h5 class="card-title">${pokemon.name}</h5>
                        <button class="btn btn-secondary" onclick="showDetails('${pokemon.url}')">View Details</button>
                    </div>
                </div>
            </div>
        `;
        pokemonContainer.innerHTML += pokemonCard;
    });
}

function showDetails(url) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            document.getElementById('pokemonModalLabel').textContent = data.name;
            document.getElementById('modalImage').src = data.sprites.other['official-artwork'].front_default;
            document.getElementById('modalHeight').textContent = data.height;
            document.getElementById('modalWeight').textContent = data.weight;
            document.getElementById('modalAbilities').textContent = data.abilities.map(a => a.ability.name).join(', ');

            const pokemonModal = new bootstrap.Modal(document.getElementById('pokemonModal'));
            pokemonModal.show();
        })
        .catch(error => console.error('Error fetching Pokémon details:', error));
}

function handlePagination(data) {
    const prevBtn = document.getElementById("prev-btn");
    const nextBtn = document.getElementById("next-btn");

    prevBtn.disabled = currentPage === 1; 
    nextBtn.disabled = !data.next; 
}

function nextPage() {
    currentPage++;
    fetchPokemon(currentPage);
}

function prevPage() {
    currentPage--;
    fetchPokemon(currentPage);
}

function searchPokemon() {
    const query = document.getElementById('searchpokemon').value.toLowerCase();
    const filteredPokemons = allPokemons.filter(pokemon => pokemon.name.toLowerCase().includes(query));
    displayPokemon(filteredPokemons); 
}

fetchPokemon(currentPage);
