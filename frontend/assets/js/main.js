document.addEventListener('DOMContentLoaded', () => {
    // Hamburger Menu
    const hamburgerMenu = document.getElementById('hamburger-menu');
    const navigation = document.getElementById('navigation');

    hamburgerMenu.addEventListener('click', () => {
        navigation.classList.toggle('active');
        const icon = hamburgerMenu.querySelector('i');
        if (navigation.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Remove static items functionality
    const favoritesGrid = document.getElementById('favorites-grid');
    favoritesGrid.addEventListener('click', (e) => {
        if (e.target.closest('.remove-btn')) {
            const item = e.target.closest('.grid-item');
            if (item) {
                item.remove();
            }
        }
    });

    // TVMaze API Search
    const searchInput = document.getElementById('movie-search');
    const searchResultsContainer = document.getElementById('search-results');
    const resultsGrid = document.getElementById('results-grid');
    let searchTimeout;

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        
        clearTimeout(searchTimeout);
        
        if (query.length < 3) {
            searchResultsContainer.classList.add('hidden');
            return;
        }

        searchTimeout = setTimeout(() => {
            fetchShows(query);
        }, 500); // Debounce
    });

    async function fetchShows(query) {
        try {
            const response = await fetch(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(query)}`);
            const data = await response.json();
            displaySearchResults(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    function displaySearchResults(results) {
        resultsGrid.innerHTML = '';
        
        if (results.length === 0) {
            resultsGrid.innerHTML = '<p>No results found.</p>';
        } else {
            results.forEach(result => {
                const show = result.show;
                const imageUrl = show.image ? show.image.medium : 'https://via.placeholder.com/210x295?text=No+Image';
                const summary = show.summary ? show.summary.replace(/<[^>]*>?/gm, '').substring(0, 100) + '...' : 'No description available.';
                
                const itemHtml = `
                    <div class="grid-item dynamic-item" data-id="${show.id}">
                        <div class="item-image-wrapper">
                            <img src="${imageUrl}" alt="${show.name}">
                            <button class="add-btn" title="Add to Favorites"><i class="fas fa-plus"></i></button>
                        </div>
                        <div class="item-details">
                            <h3>${show.name}</h3>
                            <p class="short-desc">${summary}</p>
                        </div>
                    </div>
                `;
                resultsGrid.insertAdjacentHTML('beforeend', itemHtml);
            });
        }
        
        searchResultsContainer.classList.remove('hidden');
    }

    // Add to favorites functionality
    resultsGrid.addEventListener('click', (e) => {
        if (e.target.closest('.add-btn')) {
            const item = e.target.closest('.grid-item');
            if (item) {
                // Clone the item to move it to favorites grid
                const clonedItem = item.cloneNode(true);
                
                // Change add button to remove button
                const btn = clonedItem.querySelector('.add-btn');
                btn.classList.remove('add-btn');
                btn.classList.add('remove-btn');
                btn.title = 'Remove';
                btn.innerHTML = '<i class="fas fa-times"></i>';
                
                // Prepend to favorites grid
                favoritesGrid.insertBefore(clonedItem, favoritesGrid.firstChild);
                
                // Visual feedback (optional)
                const addBtn = item.querySelector('.add-btn');
                addBtn.innerHTML = '<i class="fas fa-check"></i>';
                addBtn.style.backgroundColor = '#28a745';
                addBtn.disabled = true;
            }
        }
    });

    // Form Validation and Submission
    const contactForm = document.getElementById('contact-form');
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            submitForm();
        }
    });

    function validateForm() {
        let isValid = true;
        
        // Reset errors
        document.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
        document.querySelectorAll('input, textarea').forEach(el => el.classList.remove('error'));

        // First Name validation
        const firstName = document.getElementById('first-name');
        if (!firstName.value.trim()) {
            showError(firstName, 'First Name is required');
            isValid = false;
        }

        // Last Name validation
        const lastName = document.getElementById('last-name');
        if (!lastName.value.trim()) {
            showError(lastName, 'Last Name is required');
            isValid = false;
        }

        // Email validation
        const email = document.getElementById('email');
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim()) {
            showError(email, 'Email is required');
            isValid = false;
        } else if (!emailPattern.test(email.value.trim())) {
            showError(email, 'Please enter a valid email address');
            isValid = false;
        }

        // Comments/Message validation (not strictly marked with * in design but is logically required usually, let's keep it required as per original spec or remove if needed. Original spec said it's required)
        // Wait, in the screenshot "Message" doesn't have a *. But original spec had "Comments (required field)". Let's keep it required.
        const comments = document.getElementById('comments');
        if (!comments.value.trim()) {
            showError(comments, 'Message is required');
            isValid = false;
        }

        // Terms validation
        const terms = document.getElementById('terms');
        if (terms && !terms.checked) {
            const errorSpan = document.getElementById('err-terms');
            if (errorSpan) errorSpan.textContent = 'You must agree to the terms';
            isValid = false;
        }

        return isValid;
    }

    function showError(inputElement, message) {
        inputElement.classList.add('error');
        const errorSpan = document.getElementById(`err-${inputElement.id}`);
        if (errorSpan) {
            errorSpan.textContent = message;
        }
    }

    async function submitForm() {
        const formData = new FormData(contactForm);
        const submitBtn = document.getElementById('submit-btn');
        const formFeedback = document.getElementById('form-feedback');
        
        submitBtn.disabled = true;
        submitBtn.textContent = 'Submitting...';
        formFeedback.className = 'form-feedback'; // Reset classes
        formFeedback.textContent = '';

        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.status === 'success') {
                formFeedback.classList.add('success');
                formFeedback.textContent = result.message;
                contactForm.reset();
            } else {
                formFeedback.classList.add('error');
                formFeedback.textContent = result.message || 'An error occurred during submission.';
            }
        } catch (error) {
            console.error('Submission error:', error);
            formFeedback.classList.add('error');
            formFeedback.textContent = 'A network error occurred. Please try again.';
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Submit';
        }
    }
});
