/**
 * Global State
 */
let currentDate = new Date();
let selectedBookingDate = null;

// Mock Data for "Booked" days (randomly generated for demo)
const bookedDays = [5, 12, 18, 27, 28]; 

/**
 * Navigation
 */
function showPage(pageId) {
    document.querySelectorAll('.page-content').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
    
    document.getElementById('page-' + pageId).classList.add('active');
    document.getElementById('nav-' + pageId).classList.add('active');
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Calendar Logic
 */
function renderCalendar(monthOffset = 0) {
    currentDate.setMonth(currentDate.getMonth() + monthOffset);
    
    const monthEl = document.getElementById('current-month');
    const daysEl = document.getElementById('calendar-days');
    
    const monthName = currentDate.toLocaleString('default', { month: 'long' });
    const year = currentDate.getFullYear();
    monthEl.textContent = `${monthName} ${year}`;
    
    // Clear previous
    daysEl.innerHTML = '';
    
    const firstDayOfMonth = new Date(year, currentDate.getMonth(), 1).getDay();
    const daysInMonth = new Date(year, currentDate.getMonth() + 1, 0).getDate();
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1);
    maxDate.setHours(0, 0, 0, 0);
    
    // Add empty slots for previous month alignment
    for (let i = 0; i < firstDayOfMonth; i++) {
        daysEl.innerHTML += `<div></div>`;
    }
    
    // Create day elements
    for (let day = 1; day <= daysInMonth; day++) {
        const fullDate = new Date(year, currentDate.getMonth(), day);
        fullDate.setHours(0, 0, 0, 0);

        const isPast = fullDate < today;
        const isTooFar = fullDate > maxDate;
        const isBooked = bookedDays.includes(day) && monthOffset === 0;

        let statusClass = 'available';

        if (isPast || isTooFar) {
            statusClass = 'disabled';
        } else if (isBooked) {
            statusClass = 'booked';
        }

        const dateStr = `${year}-${currentDate.getMonth() + 1}-${day}`;
        
        const dayDiv = document.createElement('div');
        dayDiv.className = `calendar-day ${statusClass}`;
        dayDiv.textContent = day;
        
        // Only allow clicking if valid
        if (!isPast && !isTooFar && !isBooked) {
            dayDiv.onclick = () => selectDate(dayDiv, dateStr);
        }
        
        daysEl.appendChild(dayDiv);
    }
}
function selectDate(element, dateStr) {
    // Clear previous selection
    document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
    
    // Set new selection
    element.classList.add('selected');
    selectedBookingDate = dateStr;
    document.getElementById('selected-date-input').value = dateStr;
}

/**
 * Booking Handler
 */
function handleBooking(e) {
    e.preventDefault();
    if (!selectedBookingDate) {
        alert("Please select a date from the calendar first.");
        return;
    }
    
    const form = e.target;
    const success = document.getElementById('bookingSuccess');
    
    form.style.opacity = '0';
    setTimeout(() => {
        form.classList.add('hidden');
        success.classList.remove('hidden');
    }, 500);
}

/**
 * Mobile Menu
 */
function toggleMobileMenu() {
    // Basic implementation for demo
    const nav = document.querySelector('.hidden.md:flex');
    nav.classList.toggle('hidden');
    nav.classList.toggle('flex-col');
    nav.classList.toggle('absolute');
    nav.classList.toggle('top-20');
    nav.classList.toggle('bg-white');
    nav.classList.toggle('w-full');
    nav.classList.toggle('p-6');
}

// Initialize on Load
window.onload = () => {
    renderCalendar();
};