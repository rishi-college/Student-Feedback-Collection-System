document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element Selections ---
    const feedbackForm = document.getElementById('feedbackForm');
    const commentsInput = document.getElementById('comments');
    const charCount = document.getElementById('charCount');
    const feedbackDisplay = document.getElementById('feedbackDisplay');
    const clearFeedbacksBtn = document.getElementById('clearFeedbacks');
    const welcomeMessageDiv = document.getElementById('welcomeMessage');

    const MAX_CHARS = 500;

    // --- Function to display feedbacks from local storage ---
    const displayFeedbacks = () => {
        const feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
        feedbackDisplay.innerHTML = ''; // Clear current display
        
        if (feedbacks.length === 0) {
            feedbackDisplay.innerHTML = `<p class="text-gray-500 col-span-full">No feedback submitted yet.</p>`;
            clearFeedbacksBtn.classList.add('hidden');
        } else {
            clearFeedbacksBtn.classList.remove('hidden');
            feedbacks.forEach(fb => {
                const feedbackCard = `
                    <div class="bg-white p-6 rounded-lg shadow-md border border-gray-200">
                        <div class="flex justify-between items-start">
                            <h3 class="text-lg font-bold text-gray-900">${fb.name}</h3>
                            <span class="bg-indigo-100 text-indigo-800 text-sm font-semibold px-2.5 py-0.5 rounded-full">Rating: ${fb.rating}/5</span>
                        </div>
                        <p class="text-sm text-gray-500 mt-1">${fb.department}</p>
                        <p class="text-sm text-gray-600 mb-4">${fb.email}</p>
                        <p class="text-gray-700 italic border-l-4 border-indigo-200 pl-4">"${fb.comments || 'No comments provided.'}"</p>
                    </div>
                `;
                feedbackDisplay.innerHTML += feedbackCard;
            });
        }
    };

    // --- Function to handle session welcome message ---
    const handleWelcomeMessage = () => {
        if (sessionStorage.getItem('hasVisited')) {
            welcomeMessageDiv.textContent = "👋 Welcome back to the feedback form!";
            welcomeMessageDiv.classList.remove('hidden');
        } else {
            sessionStorage.setItem('hasVisited', 'true');
        }
    };

    // --- Event Listeners ---

    // 1. Form Submission
    feedbackForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent default page reload

        // Create a feedback object from form data
        const formData = new FormData(feedbackForm);
        const feedback = {
            name: formData.get('fullName'),
            email: formData.get('email'),
            department: formData.get('department'),
            rating: formData.get('rating'),
            comments: formData.get('comments'),
            timestamp: new Date().toISOString()
        };

        // Retrieve, update, and save to local storage
        const feedbacks = JSON.parse(localStorage.getItem('feedbacks')) || [];
        feedbacks.push(feedback);
        localStorage.setItem('feedbacks', JSON.stringify(feedbacks));

        // Re-display all feedbacks
        displayFeedbacks();
        
        // Reset the form for the next submission
        feedbackForm.reset();
        charCount.textContent = `0 / ${MAX_CHARS}`;
    });

    // 2. Real-time character count for comments
    commentsInput.addEventListener('input', () => {
        const currentLength = commentsInput.value.length;
        charCount.textContent = `${currentLength} / ${MAX_CHARS}`;
    });

    // 3. Clear all feedbacks
    clearFeedbacksBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to delete all feedbacks? This action cannot be undone.')) {
            localStorage.removeItem('feedbacks');
            displayFeedbacks(); // Update the display
        }
    });

    // --- Initial Calls on Page Load ---
    handleWelcomeMessage();
    displayFeedbacks();
});