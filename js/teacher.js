// Teacher-specific functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the teacher dashboard
    if (document.getElementById('teacher-dashboard')) {
        // Initialize teacher dashboard
        showExamScheduling();
    }
});

// Enhanced exam scheduling functions
function generateAdvancedSchedule() {
    const examType = document.querySelector('input[name="examType"]:checked').value;
    const startDate = new Date(document.getElementById('startDate').value);
    
    if (!startDate || isNaN(startDate.getTime())) {
        alert('Please select a valid start date');
        return;
    }

    const selectedYears = Array.from(document.querySelectorAll('input[name="year"]:checked')).map(y => y.value);
    const selectedBranches = Array.from(document.querySelectorAll('input[name="branch"]:checked')).map(b => b.value);

    // Generate subjects based on branch
    const branchSubjects = {
        CSE: ['Programming', 'Algorithms', 'Database', 'Networking', 'Math'],
        IT: ['Web Tech', 'Cyber Security', 'Cloud Computing', 'Data Science', 'Math'],
        CSD: ['AI', 'Machine Learning', 'Big Data', 'IoT', 'Math'],
        ECE: ['Circuits', 'Signals', 'Electronics', 'Communication', 'EM Theory', 'Math'],
        EEE: ['Power', 'Machines', 'Control', 'Measurements', 'Renewables', 'Math'],
        MECH: ['Thermo', 'Dynamics', 'Materials', 'Manufacturing', 'Design', 'Math'],
        CIVIL: ['Structures', 'Geotech', 'Transportation', 'Hydraulics', 'Surveying', 'Concrete', 'Math']
    };

    let scheduleHTML = `<h3>Exam Schedule</h3>`;
    scheduleHTML += `<div class="calendar" id="exam-calendar"></div>`;
    
    document.getElementById('schedule-result').innerHTML = scheduleHTML;
    generateAdvancedCalendar(startDate, examType, selectedYears, selectedBranches, branchSubjects);
}

function generateAdvancedCalendar(startDate, examType, years, branches, branchSubjects) {
    const calendarDiv = document.getElementById('exam-calendar');
    calendarDiv.innerHTML = '';
    
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Header
    for (let i = 0; i < 7; i++) {
        const dayHeader = document.createElement('div');
        dayHeader.textContent = days[i];
        calendarDiv.appendChild(dayHeader);
    }
    
    let currentDate = new Date(startDate);
    const endDate = new Date(currentDate);
    endDate.setDate(endDate.getDate() + 30); // Show 1 month
    
    let examDayCount = 0;
    
    while (currentDate <= endDate) {
        // Skip Sundays
        if (currentDate.getDay() === 0) {
            currentDate.setDate(currentDate.getDate() + 1);
            continue;
        }
        
        // Alternate days for semester exams
        if (examType === 'semester' && examDayCount % 2 !== 0) {
            currentDate.setDate(currentDate.getDate() + 1);
            examDayCount++;
            continue;
        }
        
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day';
        dayDiv.textContent = currentDate.toLocaleDateString();
        
        // Add exams for each branch
        branches.forEach(branch => {
            const subjects = branchSubjects[branch];
            const subjectIndex = examDayCount % subjects.length;
            
            const examDiv = document.createElement('div');
            examDiv.className = 'exam-subject';
            examDiv.textContent = `${branch}: ${subjects[subjectIndex]}`;
            examDiv.onclick = function() { 
                showRescheduleModal(
                    new Date(currentDate), 
                    `${branch}: ${subjects[subjectIndex]}`
                ); 
            };
            dayDiv.appendChild(examDiv);
        });
        
        calendarDiv.appendChild(dayDiv);
        currentDate.setDate(currentDate.getDate() + 1);
        examDayCount++;
    }
}

// Enhanced room allocation
function allocateRoomsAdvanced() {
    const selectedStudents = Array.from(document.querySelectorAll('.student-checkbox:checked')).map(s => s.value);
    
    if (selectedStudents.length === 0) {
        alert('Please select at least one student');
        return;
    }
    
    // Group students by year and branch
    const groupedStudents = {};
    selectedStudents.forEach(roll => {
        const year = roll.substring(0, 2) === '25' ? '1' : 
                     roll.substring(0, 2) === '24' ? '2' : 
                     roll.substring(0, 2) === '23' ? '3' : '4';
        const branch = roll.substring(2, 5);
        
        if (!groupedStudents[`Y${year}-${branch}`]) {
            groupedStudents[`Y${year}-${branch}`] = [];
        }
        groupedStudents[`Y${year}-${branch}`].push(roll);
    });
    
    // Allocate rooms
    const rooms = ['LH01', 'LH02', 'LH03', 'LH04', 'LH05', 'LH101', 'LH102', 'LH103', 'LH104', 'LH105'];
    let roomIndex = 0;
    let allocationHTML = '<h4>Room Allocation Result</h4>';
    
    Object.keys(groupedStudents).forEach(group => {
        const students = groupedStudents[group];
        const groupParts = group.split('-');
        const year = groupParts[0].substring(1);
        const branch = groupParts[1];
        
        allocationHTML += `<h5>Year ${year} ${branch} Students</h5>`;
        
        // Split students into rooms
        for (let i = 0; i < students.length; i += 18) {
            if (roomIndex >= rooms.length) {
                allocationHTML += '<p>Not enough rooms available!</p>';
                break;
            }
            
            const roomStudents = students.slice(i, i + 18);
            allocationHTML += generateRoomLayout(rooms[roomIndex], roomStudents, year, branch);
            roomIndex++;
        }
    });
    
    document.getElementById('room-allocation-result').innerHTML = allocationHTML;
}

function generateRoomLayout(roomName, students, year, branch) {
    let layoutHTML = `
        <div class="room">
            <h6>Room: ${roomName} (Year ${year} ${branch})</h6>
            <div class="room-layout">
    `;
    
    // Create 3 columns x 6 rows layout
    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 3; col++) {
            const studentIndex = row * 3 + col;
            const student = students[studentIndex] || 'Empty';
            
            layoutHTML += `<div class="seat">${student}</div>`;
        }
    }
    
    layoutHTML += `
            </div>
        </div>
    `;
    
    return layoutHTML;
}