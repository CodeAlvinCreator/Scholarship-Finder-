// DOM Elements
const searchForm = document.querySelector('.search-box');
const searchBtn = document.getElementById('search-btn');
const countrySelect = document.getElementById('country');
const degreeSelect = document.getElementById('degree');
const fieldInput = document.getElementById('field');
const fundingType = document.getElementById('funding-type');
const sortBy = document.getElementById('sort-by');
const resultsContainer = document.getElementById('results-container');
const loadingElement = document.getElementById('loading');
const noResultsElement = document.getElementById('no-results');
const savedContainer = document.getElementById('saved-container');
const modal = document.getElementById('scholarship-modal');
const closeModal = document.querySelector('.close-btn');
const modalContent = document.getElementById('modal-content');

// API Configuration
const API_KEY = '3a33d20551msheda8b7a4947b690p11a818jsncc2bb4acc108';
const API_HOST = 'scholarship-finder.p.rapidapi.com';
let scholarships = []; // Will store fetched scholarships

// Sample data for African countries
const africanCountries = [
    'Algeria', 'Angola', 'Benin', 'Botswana', 'Burkina Faso', 'Burundi',
    'Cabo Verde', 'Cameroon', 'Central African Republic', 'Chad', 'Comoros',
    'Congo', "Côte d'Ivoire", 'Djibouti', 'DR Congo', 'Egypt', 'Equatorial Guinea',
    'Eritrea', 'Eswatini', 'Ethiopia', 'Gabon', 'Gambia', 'Ghana', 'Guinea',
    'Guinea-Bissau', 'Kenya', 'Lesotho', 'Liberia', 'Libya', 'Madagascar', 'Malawi',
    'Mali', 'Mauritania', 'Mauritius', 'Morocco', 'Mozambique', 'Namibia', 'Niger',
    'Nigeria', 'Rwanda', 'Sao Tome and Principe', 'Senegal', 'Seychelles',
    'Sierra Leone', 'Somalia', 'South Africa', 'South Sudan', 'Sudan', 'Tanzania',
    'Togo', 'Tunisia', 'Uganda', 'Zambia', 'Zimbabwe'
];

// Initialize the application
async function init() {
    // Populate country dropdown
    populateCountries();
    
    // Load saved scholarships from localStorage
    loadSavedScholarships();
    
    // Event listeners
    searchBtn.addEventListener('click', handleSearch);
    fundingType.addEventListener('change', filterAndDisplayResults);
    sortBy.addEventListener('change', filterAndDisplayResults);
    closeModal.addEventListener('click', () => modal.style.display = 'none');
    
    // Close modal when clicking outside content
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
    
    // Fetch initial scholarships
    await fetchScholarships();
}

// Fetch scholarships from API
async function fetchScholarships() {
    loadingElement.style.display = 'flex';
    resultsContainer.innerHTML = '';
    
    try {
        // In a real app, you would make an API call here
        // For now, we'll use sample data
        scholarships = getSampleScholarships();
        displayScholarships(scholarships);
    } catch (error) {
        console.error('Error fetching scholarships:', error);
        showNotification('Failed to load scholarships. Using sample data instead.');
        scholarships = getSampleScholarships();
        displayScholarships(scholarships);
    } finally {
        loadingElement.style.display = 'none';
    }
}

// Get sample scholarships (fallback)
function getSampleScholarships() {
    return [
        {
            id: 1,
            title: 'African Leadership University Scholarship',
            description: 'Full tuition scholarship for African students to study at ALU in Rwanda or Mauritius. Covers tuition, accommodation, and a living stipend.',
            amount: 'Fully Funded',
            deadline: '2025-03-15',
            country: 'Rwanda',
            degreeLevel: 'undergraduate',
            field: 'All Fields',
            fundingType: 'fully-funded',
            datePosted: '2025-01-10',
            university: 'African Leadership University',
            eligibility: 'Open to African citizens under 25 years old with outstanding academic records and leadership potential.',
            requirements: ['High school diploma', 'English proficiency', 'Leadership experience', 'Personal statement'],
            benefits: ['Full tuition', 'Accommodation', 'Living stipend', 'Mentorship'],
            website: 'https://alueducation.com/scholarships'
        },
        {
            id: 2,
            title: 'Mastercard Foundation Scholars Program',
            description: 'Comprehensive scholarship program for African students to pursue undergraduate and graduate studies at partner universities worldwide.',
            amount: 'Fully Funded',
            deadline: '2025-02-28',
            country: 'Multiple',
            degreeLevel: 'masters',
            field: 'All Fields',
            fundingType: 'fully-funded',
            datePosted: '2024-12-15',
            university: 'Multiple Partner Universities',
            eligibility: 'African citizens with demonstrated financial need and leadership potential. Must meet university admission requirements.',
            requirements: ['Bachelor\'s degree for Masters', 'Academic transcripts', 'Recommendation letters', 'Personal statement'],
    
            website: 'https://mastercardfdn.org/programs/scholars/'
        },
        {
            id: 3,
            title: 'African Women in Science Scholarship', 
            description: 'Scholarship for female African students pursuing STEM fields at the undergraduate or graduate level.',
            amount: 'Partial Funding',
            deadline: '2025-04-30',
            country: 'Multiple',
            degreeLevel: 'undergraduate',
            field: 'STEM',
            fundingType: 'partial',
            datePosted: '2025-01-05',
            university: 'Various Universities',
            eligibility: 'Female African students enrolled in STEM programs with good academic standing.',
            requirements: ['Proof of enrollment', 'Academic transcripts', 'Personal statement', 'Letter of recommendation'],
            benefits: ['Tuition support', 'Mentorship program', 'Networking opportunities'],
            website: 'https://example.com/african-women-stem'
        },
        {
            id: 4,
            title: 'DAAD Scholarships for Development-Related Postgraduate Courses',
            description: 'The DAAD supports a range of postgraduate courses at German universities which aim at providing academically educated young professionals from developing countries with further specialized studies.',
            amount: 'Fully Funded',
            deadline: '2025-08-31',
            country: 'Germany',
            degreeLevel: 'masters',
            field: 'Development Studies',
            fundingType: 'fully-funded',
            datePosted: '2024-11-20',
            university: 'Various German Universities',
            eligibility: 'Graduates from developing countries with at least two years of professional experience.',
            requirements: ["Bachelor's degree", "2+ years work experience", "English/German language proficiency", "Motivation letter"],

            benefits : ['Monthly payments', 'Travel allowance', 'Health insurance', 'Study and research subsidy'],
            website: 'https://www.daad.de/en/study-and-research-in-germany/scholarships/'
        },
        {
            id: 5,
            title: 'Agbami Medical and Engineering Professionals Scholarship',
            description: 'Scholarship for Nigerian students studying medicine, surgery, dentistry, pharmacy, or engineering at Nigerian universities.',
            amount: 'Tuition + Stipend',
            deadline: '2025-05-15',
            country: 'Nigeria',
            degreeLevel: 'undergraduate',
            field: 'Medicine, Engineering',
            fundingType: 'partial',
            datePosted: '2025-02-01',
            university: 'Nigerian Universities',
            eligibility: 'Full-time Nigerian students in their second year or above in accredited Nigerian universities.',
            requirements: ['Academic transcripts', 'Admission letter', 'School ID card', 'Local government certificate'],
            benefits: ['Tuition fees', 'Annual stipend', 'Textbook allowance'],
            website: 'https://www.scholastica.ng/schemes/agbami'
        }
    ];
}

// Populate country dropdown
function populateCountries() {
    africanCountries.sort();
    
    africanCountries.forEach(country => {
        const option = document.createElement('option');
        option.value = country.toLowerCase().replace(/\s+/g, '-');
        option.textContent = country;
        countrySelect.appendChild(option);
    });
}

// Handle search form submission
function handleSearch(e) {
    e.preventDefault();
    
    const country = countrySelect.value;
    const degree = degreeSelect.value;
    const field = fieldInput.value.trim().toLowerCase();
    
    // Show loading state
    loadingElement.style.display = 'flex';
    resultsContainer.innerHTML = '';
    noResultsElement.style.display = 'none';
    
    // Simulate API call with timeout
    setTimeout(() => {
        const results = filterScholarships(country, degree, field);
        displayScholarships(results);
        loadingElement.style.display = 'none';
        
        if (results.length === 0) {
            noResultsElement.style.display = 'block';
        }
    }, 800);
}

// Filter scholarships based on search criteria
function filterScholarships(country, degree, field) {
    return scholarships.filter(scholarship => {
        const matchesCountry = !country || 
            scholarship.country.toLowerCase() === 'multiple' || 
            scholarship.country.toLowerCase().replace(/\s+/g, '-') === country;
            
        const matchesDegree = !degree || scholarship.degreeLevel === degree;
        
        const matchesField = !field || 
            scholarship.field.toLowerCase().includes(field) || 
            scholarship.title.toLowerCase().includes(field) ||
            scholarship.description.toLowerCase().includes(field);
            
        return matchesCountry && matchesDegree && matchesField;
    });
}

// Display scholarships in the UI
function displayScholarships(scholarshipsToDisplay) {
    // Apply additional filters and sorting
    const filtered = applyAdditionalFilters(scholarshipsToDisplay);
    const sorted = sortScholarships(filtered);
    
    // Clear previous results
    resultsContainer.innerHTML = '';
    
    if (sorted.length === 0) {
        noResultsElement.style.display = 'block';
        return;
    }
    
    noResultsElement.style.display = 'none';
    
    // Create and append scholarship cards
    sorted.forEach(scholarship => {
        const card = createScholarshipCard(scholarship);
        resultsContainer.appendChild(card);
    });
}

// Apply additional filters (funding type)
function applyAdditionalFilters(scholarships) {
    const type = fundingType.value;
    
    if (!type) return scholarships;
    
    return scholarships.filter(scholarship => {
        return scholarship.fundingType === type;
    });
}

// Sort scholarships based on selected criteria
function sortScholarships(scholarships) {
    const sortValue = sortBy.value;
    
    return [...scholarships].sort((a, b) => {
        switch (sortValue) {
            case 'deadline':
                return new Date(a.deadline) - new Date(b.deadline);
            case 'newest':
                return new Date(b.datePosted) - new Date(a.datePosted);
            case 'amount':
                // For demo purposes, we'll sort by whether it's fully funded or not
                if (a.amount === 'Fully Funded' && b.amount !== 'Fully Funded') return -1;
                if (a.amount !== 'Fully Funded' && b.amount === 'Fully Funded') return 1;
                return 0;
            default:
                return 0;
        }
    });
}

// Create a scholarship card element
function createScholarshipCard(scholarship) {
    const card = document.createElement('div');
    card.className = 'scholarship-card';
    card.setAttribute('data-id', scholarship.id);
    
    // Format deadline
    const deadline = new Date(scholarship.deadline);
    const formattedDeadline = deadline.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Check if scholarship is saved
    const isSaved = isScholarshipSaved(scholarship.id);
    
    card.innerHTML = `
        <div class="card-header">
            <h3>${scholarship.title}</h3>
            <div class="card-meta">
                <span class="meta-item">
                    <i class="fas fa-university"></i> ${scholarship.university || 'Various'}
                </span>
                <span class="meta-item">
                    <i class="fas fa-map-marker-alt"></i> ${scholarship.country}
                </span>
            </div>
            <div class="card-meta">
                <span class="meta-item amount">
                    <i class="fas fa-coins"></i> ${scholarship.amount}
                </span>
                <span class="meta-item deadline">
                    <i class="far fa-calendar-alt"></i> ${formattedDeadline}
                </span>
            </div>
        </div>
        <div class="card-body">
            <p class="card-description">${scholarship.description}</p>
            <div class="card-footer">
                <button class="btn btn-primary view-details" data-id="${scholarship.id}">
                    View Details
                </button>
                <button class="btn btn-outline save-scholarship" data-id="${scholarship.id}">
                    <i class="${isSaved ? 'fas' : 'far'} fa-bookmark"></i>
                    ${isSaved ? 'Saved' : 'Save'}
                </button>
            </div>
        </div>
    `;
    
    // Add event listeners to the buttons
    card.querySelector('.view-details').addEventListener('click', () => showScholarshipDetails(scholarship.id));
    card.querySelector('.save-scholarship').addEventListener('click', (e) => toggleSaveScholarship(e, scholarship.id));
    
    return card;
}

// Show scholarship details in modal
function showScholarshipDetails(id) {
    const scholarship = scholarships.find(s => s.id === id);
    if (!scholarship) return;
    
    // Format deadline
    const deadline = new Date(scholarship.deadline);
    const formattedDeadline = deadline.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    
    // Create modal content
    modalContent.innerHTML = `
        <div class="modal-header">
            <h2>${scholarship.title}</h2>
            <div class="modal-meta">
                <span><i class="fas fa-university"></i> ${scholarship.university || 'Various Institutions'}</span>
                <span><i class="fas fa-map-marker-alt"></i> ${scholarship.country}</span>
                <span class="amount"><i class="fas fa-coins"></i> ${scholarship.amount}</span>
                <span class="deadline"><i class="far fa-calendar-alt"></i> Deadline: ${formattedDeadline}</span>
            </div>
        </div>
        
        <div class="modal-section">
            <h3>About the Scholarship</h3>
            <p>${scholarship.description}</p>
        </div>
        
        <div class="modal-section">
            <h3>Eligibility</h3>
            <p>${scholarship.eligibility}</p>
            
            <h4>Requirements</h4>
            <ul>
                ${scholarship.requirements.map(req => `<li>${req}</li>`).join('')}
            </ul>
            
            <h4>Benefits</h4>
            <ul>
                ${scholarship.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
            </ul>
        </div>
        
        <div class="modal-actions">
            <a href="${scholarship.website}" target="_blank" class="btn btn-primary">
                <i class="fas fa-external-link-alt"></i> Visit Official Website
            </a>
            <button class="btn btn-outline save-scholarship-modal" data-id="${scholarship.id}">
                <i class="${isScholarshipSaved(scholarship.id) ? 'fas' : 'far'} fa-bookmark"></i>
                ${isScholarshipSaved(scholarship.id) ? 'Remove from Saved' : 'Save Scholarship'}
            </button>
        </div>
    `;
    
    // Add event listener to the save button in modal
    const saveBtn = modalContent.querySelector('.save-scholarship-modal');
    saveBtn.addEventListener('click', (e) => {
        toggleSaveScholarship(e, scholarship.id);
        // Update the button text and icon
        const isSaved = isScholarshipSaved(scholarship.id);
        saveBtn.innerHTML = `
            <i class="${isSaved ? 'fas' : 'far'} fa-bookmark"></i>
            ${isSaved ? 'Remove from Saved' : 'Save Scholarship'}
        `;
    });
    
    // Show the modal
    modal.style.display = 'block';
}

// Toggle save/unsave scholarship
function toggleSaveScholarship(e, id) {
    e.stopPropagation();
    
    let saved = JSON.parse(localStorage.getItem('savedScholarships') || '[]');
    const index = saved.indexOf(id);
    
    if (index === -1) {
        // Add to saved
        saved.push(id);
        showNotification('Scholarship saved to your list!');
    } else {
        // Remove from saved
        saved.splice(index, 1);
        showNotification('Scholarship removed from your list.');
    }
    
    localStorage.setItem('savedScholarships', JSON.stringify(saved));
    
    // Update the UI
    const button = e.target.closest('.save-scholarship') || e.target;
    const icon = button.querySelector('i') || button;
    const isSaved = isScholarshipSaved(id);
    
    if (icon) {
        icon.className = isSaved ? 'fas fa-bookmark' : 'far fa-bookmark';
    }
    
    if (button.textContent.includes('Save') || button.textContent.includes('Saved')) {
        button.innerHTML = `
            <i class="${isSaved ? 'fas' : 'far'} fa-bookmark"></i>
            ${isSaved ? 'Saved' : 'Save'}
        `;
    }
    
    // Update saved scholarships list
    loadSavedScholarships();
}

// Check if a scholarship is saved
function isScholarshipSaved(id) {
    const saved = JSON.parse(localStorage.getItem('savedScholarships') || '[]');
    return saved.includes(id);
}

// Load and display saved scholarships
function loadSavedScholarships() {
    const savedIds = JSON.parse(localStorage.getItem('savedScholarships') || '[]');
    const savedScholarships = scholarships.filter(s => savedIds.includes(s.id));
    
    savedContainer.innerHTML = '';
    
    if (savedScholarships.length === 0) {
        savedContainer.innerHTML = '<p class="empty-message">You haven\'t saved any scholarships yet.</p>';
        return;
    }
    
    const list = document.createElement('div');
    list.className = 'saved-list';
    
    savedScholarships.forEach(scholarship => {
        const item = document.createElement('div');
        item.className = 'saved-item';
        item.innerHTML = `
            <div>
                <h4>${scholarship.title}</h4>
                <p>${scholarship.university || ''} • ${scholarship.country}</p>
            </div>
            <div class="saved-actions">
                <button class="btn-icon view-saved" data-id="${scholarship.id}" title="View Details">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn-icon remove-saved" data-id="${scholarship.id}" title="Remove">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        // Add event listeners
        item.querySelector('.view-saved').addEventListener('click', () => showScholarshipDetails(scholarship.id));
        item.querySelector('.remove-saved').addEventListener('click', (e) => {
            const id = parseInt(e.currentTarget.getAttribute('data-id'));
            const saved = JSON.parse(localStorage.getItem('savedScholarships') || '[]');
            const updated = saved.filter(scholarshipId => scholarshipId !== id);
            localStorage.setItem('savedScholarships', JSON.stringify(updated));
            
            // Remove from UI
            item.remove();
            
            // Update the main list if it's visible
            const card = document.querySelector(`.scholarship-card[data-id="${id}"]`);
            if (card) {
                const saveBtn = card.querySelector('.save-scholarship');
                if (saveBtn) {
                    saveBtn.innerHTML = `
                        <i class="far fa-bookmark"></i> Save
                    `;
                }
            }
            
            // Show notification
            showNotification('Scholarship removed from your list.');
            
            // If no more saved items, show empty message
            if (savedContainer.children.length === 0) {
                savedContainer.innerHTML = '<p class="empty-message">You haven\'t saved any scholarships yet.</p>';
            }
        });
        
        list.appendChild(item);
    });
    
    savedContainer.appendChild(list);
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Add styles if not already added
    if (!document.getElementById('notification-style')) {
        const style = document.createElement('style');
        style.id = 'notification-style';
        style.textContent = `
            .notification {
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background-color: #333;
                color: white;
                padding: 12px 24px;
                border-radius: 4px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
                z-index: 1000;
                opacity: 0;
                animation: slideIn 0.3s ease-out forwards, fadeOut 0.5s ease-in 2.5s forwards;
            }
            
            @keyframes slideIn {
                from { transform: translate(-50%, 100%); opacity: 0; }
                to { transform: translate(-50%, 0); opacity: 1; }
            }
            
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Remove notification after animation
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Apply filters and display results
function filterAndDisplayResults() {
    const country = countrySelect.value;
    const degree = degreeSelect.value;
    const field = fieldInput.value.trim().toLowerCase();
    
    const filtered = filterScholarships(country, degree, field);
    displayScholarships(filtered);
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', init);