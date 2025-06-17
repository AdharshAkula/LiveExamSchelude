// Sample data
const sampleTeacher = {
    username: "Teacher1",
    password: "password123",
    authorizedTeachers: []
};

let teachers = [sampleTeacher];
let currentUser = null;

// Student login function
function studentLogin() {
    const rollNumber = document.getElementById('student-roll').value;
    if (rollNumber) {
        currentUser = { type: 'student', rollNumber };
        showStudentDashboard();
    } else {
        alert('Please enter your roll number');
    }
}

// Teacher login function
function teacherLogin() {
    const username = document.getElementById('teacher-username').value;
    const password = document.getElementById('teacher-password').value;
    
    const teacher = teachers.find(t => t.username === username && t.password === password);
    
    if (teacher) {
        currentUser = { type: 'teacher', username };
        showTeacherDashboard();
    } else if (username && password) {
        // Check if this is a new teacher requesting access
        const existingTeacher = teachers.find(t => t.username === "Teacher1");
        if (existingTeacher) {
            document.getElementById('teacher-login-message').textContent = 
                "Access pending. Please contact Teacher1 for authorization.";
        } else {
            alert('Invalid credentials');
        }
    } else {
        alert('Please enter both username and password');
    }
}

// Show teacher dashboard
function showTeacherDashboard() {
    document.querySelector('.login-container').style.display = 'none';
    
    const dashboardHTML = `
        <div class="dashboard" id="teacher-dashboard">
            <div class="dashboard-header">
                <h2>Teacher Dashboard</h2>
                <button onclick="logout()">Logout</button>
            </div>
            <div class="dashboard-options">
                <div class="dashboard-option" onclick="showExamScheduling()">Live Exam Schedule</div>
                <div class="dashboard-option" onclick="showRoomAllocation()">Room Allocation</div>
            </div>
            <div id="teacher-content"></div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', dashboardHTML);
}

// Show student dashboard
function showStudentDashboard() {
    document.querySelector('.login-container').style.display = 'none';
    
    const dashboardHTML = `
        <div class="dashboard" id="student-dashboard">
            <div class="dashboard-header">
                <h2>Student Dashboard</h2>
                <button onclick="logout()">Logout</button>
            </div>
            <div class="dashboard-options">
                <div class="dashboard-option" onclick="showTimetable()">Scheduled Timetable</div>
                <div class="dashboard-option" onclick="showAllocatedRoom()">Allocated Room</div>
            </div>
            <div id="student-content"></div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', dashboardHTML);
}

// Logout function
function logout() {
    currentUser = null;
    document.querySelector('.dashboard').remove();
    document.querySelector('.login-container').style.display = 'block';
}

// Teacher functions
function showExamScheduling() {
    const content = `
        <h3>Live Exam Scheduling</h3>
        <div>
            <label>
                <input type="radio" name="examType" value="midterm" checked> Mid Term Examinations
            </label>
            <label>
                <input type="radio" name="examType" value="semester"> Semester Examinations
            </label>
        </div>
        
        <h4>Select Years:</h4>
        <div>
            <label><input type="checkbox" name="year" value="1" checked> 1st Year</label>
            <label><input type="checkbox" name="year" value="2" checked> 2nd Year</label>
            <label><input type="checkbox" name="year" value="3" checked> 3rd Year</label>
            <label><input type="checkbox" name="year" value="4" checked> 4th Year</label>
        </div>
        
        <h4>Select Branches:</h4>
        <div>
            <label><input type="checkbox" name="branch" value="CSE" checked> CSE</label>
            <label><input type="checkbox" name="branch" value="IT" checked> IT</label>
            <label><input type="checkbox" name="branch" value="CSD" checked> CSD</label>
            <label><input type="checkbox" name="branch" value="ECE" checked> ECE</label>
            <label><input type="checkbox" name="branch" value="EEE" checked> EEE</label>
            <label><input type="checkbox" name="branch" value="MECH" checked> MECH</label>
            <label><input type="checkbox" name="branch" value="CIVIL" checked> CIVIL</label>
        </div>
        
        <div>
            <label>Start Date: <input type="date" id="startDate"></label>
            <button onclick="generateSchedule()">Generate Schedule</button>
        </div>
        
        <div id="schedule-result"></div>
    `;
    
    document.getElementById('teacher-content').innerHTML = content;
}

function generateSchedule() {
    // This would be more complex in a real implementation
    const examType = document.querySelector('input[name="examType"]:checked').value;
    const startDate = document.getElementById('startDate').value;
    
    if (!startDate) {
        alert('Please select a start date');
        return;
    }
    
    // Generate a simple schedule for demonstration
    let scheduleHTML = `<h3>Generated Exam Schedule</h3>`;
    scheduleHTML += `<div class="calendar" id="exam-calendar"></div>`;
    
    document.getElementById('schedule-result').innerHTML = scheduleHTML;
    
    // Generate calendar (simplified for this example)
    generateCalendar(startDate, examType);
}

function generateCalendar(startDate, examType) {
    const calendarDiv = document.getElementById('exam-calendar');
    calendarDiv.innerHTML = '';
    
    // Sample implementation - would be more complex in reality
    const date = new Date(startDate);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Header
    for (let i = 0; i < 7; i++) {
        const dayHeader = document.createElement('div');
        dayHeader.textContent = days[i];
        calendarDiv.appendChild(dayHeader);
    }
    
    // Days
    for (let i = 0; i < 14; i++) { // 2 weeks
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day';
        
        // Skip Sundays
        if (date.getDay() === 0) {
            date.setDate(date.getDate() + 1);
            continue;
        }
        
        dayDiv.textContent = date.toLocaleDateString();
        
        // Add sample exams
        if (i % 2 === 0) {
            const examDiv = document.createElement('div');
            examDiv.className = 'exam-subject';
            examDiv.textContent = 'Subject ' + (i % 5 + 1);
            examDiv.onclick = function() { showRescheduleModal(date, 'Subject ' + (i % 5 + 1)); };
            dayDiv.appendChild(examDiv);
        }
        
        calendarDiv.appendChild(dayDiv);
        date.setDate(date.getDate() + (examType === 'midterm' ? 1 : 2));
    }
}

function showRescheduleModal(date, subject) {
    const modalHTML = `
        <div class="modal" id="reschedule-modal">
            <div class="modal-content">
                <span class="close-modal" onclick="closeModal()">&times;</span>
                <h3>Reschedule ${subject}</h3>
                <p>Scheduled for ${date.toLocaleDateString()}</p>
                <button onclick="rescheduleThisOnly('${subject}')">Reschedule only this subject</button>
                <button onclick="rescheduleFollowing('${subject}')">Reschedule all following subjects</button>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.getElementById('reschedule-modal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('reschedule-modal').remove();
}

function rescheduleThisOnly(subject) {
    alert(`Rescheduling only ${subject}`);
    closeModal();
}

function rescheduleFollowing(subject) {
    alert(`Rescheduling ${subject} and all following subjects`);
    closeModal();
}

function showRoomAllocation() {
    const content = `
        <h3>Room Allocation</h3>
        <div>
            <h4>Select Students:</h4>
            <div>
                <label><input type="checkbox" id="select-all" onclick="toggleSelectAll()"> SELECT ALL</label>
            </div>
            
            <div style="display: flex; gap: 2rem; margin-top: 1rem;">
                <div>
                    <h5>By Year:</h5>
                    <label><input type="checkbox" name="year" value="1" onchange="updateStudentSelection()"> 1st Year</label><br>
                    <label><input type="checkbox" name="year" value="2" onchange="updateStudentSelection()"> 2nd Year</label><br>
                    <label><input type="checkbox" name="year" value="3" onchange="updateStudentSelection()"> 3rd Year</label><br>
                    <label><input type="checkbox" name="year" value="4" onchange="updateStudentSelection()"> 4th Year</label>
                </div>
                
                <div>
                    <h5>By Branch:</h5>
                    <label><input type="checkbox" name="branch" value="CSE" onchange="updateStudentSelection()"> CSE</label><br>
                    <label><input type="checkbox" name="branch" value="IT" onchange="updateStudentSelection()"> IT</label><br>
                    <label><input type="checkbox" name="branch" value="CSD" onchange="updateStudentSelection()"> CSD</label><br>
                    <label><input type="checkbox" name="branch" value="ECE" onchange="updateStudentSelection()"> ECE</label><br>
                    <label><input type="checkbox" name="branch" value="EEE" onchange="updateStudentSelection()"> EEE</label><br>
                    <label><input type="checkbox" name="branch" value="MECH" onchange="updateStudentSelection()"> MECH</label><br>
                    <label><input type="checkbox" name="branch" value="CIVIL" onchange="updateStudentSelection()"> CIVIL</label>
                </div>
            </div>
            
            <div id="student-list" style="margin-top: 1rem; max-height: 200px; overflow-y: auto;">
                <!-- Student list will be generated here -->
            </div>
            
            <button onclick="allocateRooms()" style="margin-top: 1rem;">Allocate Rooms</button>
            
            <div id="room-allocation-result" style="margin-top: 2rem;"></div>
        </div>
    `;
    
    document.getElementById('teacher-content').innerHTML = content;
    generateStudentList();
}

function generateStudentList() {
    // Generate sample student roll numbers
    const branches = ['CSE', 'IT', 'CSD', 'ECE', 'EEE', 'MECH', 'CIVIL'];
    const years = ['20', '23', '24', '25']; // 20 for 4th year, 25 for 1st year
    
    let studentListHTML = '';
    
    branches.forEach(branch => {
        years.forEach(year => {
            for (let i = 1; i <= 71; i++) {
                const rollNumber = year + branch + (i < 10 ? '0' + i : i);
                studentListHTML += `
                    <div>
                        <label>
                            <input type="checkbox" class="student-checkbox" 
                                   value="${rollNumber}" 
                                   data-year="${year === '25' ? '1' : year === '24' ? '2' : year === '23' ? '3' : '4'}" 
                                   data-branch="${branch}">
                            ${rollNumber}
                        </label>
                    </div>
                `;
            }
        });
    });
    
    document.getElementById('student-list').innerHTML = studentListHTML;
}

function toggleSelectAll() {
    const selectAll = document.getElementById('select-all').checked;
    const checkboxes = document.querySelectorAll('.student-checkbox');
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = selectAll;
    });
}

function updateStudentSelection() {
    const selectedYears = Array.from(document.querySelectorAll('input[name="year"]:checked')).map(y => y.value);
    const selectedBranches = Array.from(document.querySelectorAll('input[name="branch"]:checked')).map(b => b.value);
    
    const checkboxes = document.querySelectorAll('.student-checkbox');
    
    checkboxes.forEach(checkbox => {
        const year = checkbox.dataset.year;
        const branch = checkbox.dataset.branch;
        
        if ((selectedYears.length === 0 || selectedYears.includes(year)) && 
            (selectedBranches.length === 0 || selectedBranches.includes(branch))) {
            checkbox.checked = true;
        } else {
            checkbox.checked = false;
        }
    });
}

function allocateRooms() {
    const selectedStudents = Array.from(document.querySelectorAll('.student-checkbox:checked')).map(s => s.value);
    
    if (selectedStudents.length === 0) {
        alert('Please select at least one student');
        return;
    }
    
    // Simple room allocation algorithm
    const rooms = ['LH01', 'LH02', 'LH03', 'LH04', 'LH05', 'LH101', 'LH102', 'LH103', 'LH104', 'LH105'];
    const seatsPerRoom = 18;
    
    let allocationHTML = '<h4>Room Allocation Result</h4>';
    
    // Distribute students to rooms
    for (let i = 0; i < rooms.length; i++) {
        const roomStudents = selectedStudents.slice(i * seatsPerRoom, (i + 1) * seatsPerRoom);
        
        if (roomStudents.length === 0) break;
        
        allocationHTML += `
            <div class="room">
                <h5>Room: ${rooms[i]}</h5>
                <div class="room-layout">
        `;
        
        // Create 3 columns x 6 rows layout
        for (let row = 0; row < 6; row++) {
            for (let col = 0; col < 3; col++) {
                const studentIndex = row * 3 + col;
                const student = roomStudents[studentIndex] || 'Empty';
                
                allocationHTML += `<div class="seat">${student}</div>`;
            }
        }
        
        allocationHTML += `
                </div>
            </div>
        `;
    }
    
    document.getElementById('room-allocation-result').innerHTML = allocationHTML;
}

// Student functions
function showTimetable() {
    const content = `
        <h3>Your Exam Schedule</h3>
        <div id="student-schedule">
            <p>Search for your timetable by entering your roll number:</p>
            <input type="text" id="search-roll" placeholder="Enter your roll number" value="${currentUser.rollNumber}">
            <button onclick="searchTimetable()">Search</button>
            <div id="timetable-result" style="margin-top: 1rem;"></div>
        </div>
    `;
    
    document.getElementById('student-content').innerHTML = content;
}

function searchTimetable() {
    const rollNumber = document.getElementById('search-roll').value;
    
    if (!rollNumber) {
        alert('Please enter your roll number');
        return;
    }
    
    // In a real implementation, this would fetch data from a server
    const timetableHTML = `
        <h4>Exam Schedule for ${rollNumber}</h4>
        <table border="1" cellpadding="8" cellspacing="0">
            <tr>
                <th>Date</th>
                <th>Subject</th>
                <th>Time</th>
            </tr>
            <tr>
                <td>2023-11-15</td>
                <td>Subject 1</td>
                <td>9:00 AM - 12:00 PM</td>
            </tr>
            <tr>
                <td>2023-11-17</td>
                <td>Subject 2</td>
                <td>9:00 AM - 12:00 PM</td>
            </tr>
            <tr>
                <td>2023-11-19</td>
                <td>Subject 3</td>
                <td>9:00 AM - 12:00 PM</td>
            </tr>
            <tr>
                <td>2023-11-22</td>
                <td>Subject 4</td>
                <td>9:00 AM - 12:00 PM</td>
            </tr>
            <tr>
                <td>2023-11-24</td>
                <td>Subject 5</td>
                <td>9:00 AM - 12:00 PM</td>
            </tr>
        </table>
    `;
    
    document.getElementById('timetable-result').innerHTML = timetableHTML;
}

function showAllocatedRoom() {
    const content = `
        <h3>Your Allocated Exam Room</h3>
        <div id="student-room">
            <p>Search for your allocated room by entering your roll number:</p>
            <input type="text" id="search-room-roll" placeholder="Enter your roll number" value="${currentUser.rollNumber}">
            <button onclick="searchRoom()">Search</button>
            <div id="room-result" style="margin-top: 1rem;"></div>
        </div>
    `;
    
    document.getElementById('student-content').innerHTML = content;
}

function searchRoom() {
    const rollNumber = document.getElementById('search-room-roll').value;
    
    if (!rollNumber) {
        alert('Please enter your roll number');
        return;
    }
    
    // In a real implementation, this would fetch data from a server
    const roomHTML = `
        <h4>Room Allocation for ${rollNumber}</h4>
        <p>You are allocated to: <strong>LH10</strong></p>
        <p>Your seat number: <strong>Row 3, Column 2</strong></p>
        
        <div class="room-layout" style="margin-top: 1rem;">
            <h5>Room Layout (LH10):</h5>
            ${generateRoomLayoutWithHighlight(rollNumber)}
        </div>
    `;
    
    document.getElementById('room-result').innerHTML = roomHTML;
}

function generateRoomLayoutWithHighlight(highlightRoll) {
    let layoutHTML = '';
    const sampleRolls = [
        '25CSE01', '25CSE02', '25CSE03',
        '25CSE04', '25CSE05', '25CSE06',
        '25CSE07', '25CSE08', '25CSE09',
        '25CSE10', '25CSE11', '25CSE12',
        '25CSE13', '25CSE14', '25CSE15',
        '25CSE16', '25CSE17', highlightRoll
    ];
    
    for (let row = 0; row < 6; row++) {
        for (let col = 0; col < 3; col++) {
            const index = row * 3 + col;
            const roll = sampleRolls[index] || 'Empty';
            const isHighlighted = roll === highlightRoll;
            
            layoutHTML += `
                <div class="seat" style="${isHighlighted ? 'background-color: #e74c3c; color: white;' : ''}">
                    ${roll}
                </div>
            `;
        }
    }
    
    return layoutHTML;
}