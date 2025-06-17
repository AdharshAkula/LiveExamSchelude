// Student-specific functionality
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the student dashboard
    if (document.getElementById('student-dashboard')) {
        // Initialize student dashboard
        showTimetable();
        
        // Load sample data for demo
        if (currentUser && currentUser.rollNumber) {
            setTimeout(() => {
                document.getElementById('search-roll').value = currentUser.rollNumber;
                searchTimetable();
                
                document.getElementById('search-room-roll').value = currentUser.rollNumber;
                searchRoom();
            }, 100);
        }
    }
});

// Enhanced timetable search
function searchTimetableAdvanced() {
    const rollNumber = document.getElementById('search-roll').value.trim();
    
    if (!rollNumber) {
        alert('Please enter your roll number');
        return;
    }
    
    // Extract year and branch from roll number
    const year = rollNumber.substring(0, 2) === '25' ? '1st' : 
                 rollNumber.substring(0, 2) === '24' ? '2nd' : 
                 rollNumber.substring(0, 2) === '23' ? '3rd' : '4th';
    const branch = rollNumber.substring(2, 5);
    
    // Generate sample timetable based on branch
    const branchSubjects = {
        CSE: ['Programming', 'Algorithms', 'Database', 'Networking', 'Math'],
        IT: ['Web Tech', 'Cyber Security', 'Cloud Computing', 'Data Science', 'Math'],
        CSD: ['AI', 'Machine Learning', 'Big Data', 'IoT', 'Math'],
        ECE: ['Circuits', 'Signals', 'Electronics', 'Communication', 'EM Theory', 'Math'],
        EEE: ['Power', 'Machines', 'Control', 'Measurements', 'Renewables', 'Math'],
        MECH: ['Thermo', 'Dynamics', 'Materials', 'Manufacturing', 'Design', 'Math'],
        CIVIL: ['Structures', 'Geotech', 'Transportation', 'Hydraulics', 'Surveying', 'Concrete', 'Math']
    };
    
    const subjects = branchSubjects[branch] || ['Subject 1', 'Subject 2', 'Subject 3', 'Subject 4'];
    
    let timetableHTML = `
        <h4>Exam Schedule for ${rollNumber} (${year} Year ${branch})</h4>
        <table border="1" cellpadding="8" cellspacing="0" style="width: 100%;">
            <tr>
                <th>Date</th>
                <th>Subject</th>
                <th>Time</th>
                <th>Room</th>
            </tr>
    `;
    
    // Generate sample exam dates
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 5);
    
    subjects.forEach((subject, index) => {
        const examDate = new Date(startDate);
        examDate.setDate(examDate.getDate() + (index * 2));
        
        timetableHTML += `
            <tr>
                <td>${examDate.toLocaleDateString()}</td>
                <td>${subject}</td>
                <td>9:00 AM - 12:00 PM</td>
                <td>LH${index < 5 ? '0' + (index + 1) : index + 1}</td>
            </tr>
        `;
    });
    
    timetableHTML += `</table>`;
    document.getElementById('timetable-result').innerHTML = timetableHTML;
}

// Enhanced room search
function searchRoomAdvanced() {
    const rollNumber = document.getElementById('search-room-roll').value.trim();
    
    if (!rollNumber) {
        alert('Please enter your roll number');
        return;
    }
    
    // Determine room based on roll number (sample logic)
    const roomNumber = Math.floor(Math.random() * 10) + 1;
    const room = roomNumber < 6 ? `LH0${roomNumber}` : `LH${roomNumber}0`;
    const seatRow = Math.floor(Math.random() * 6) + 1;
    const seatCol = Math.floor(Math.random() * 3) + 1;
    
    const roomHTML = `
        <h4>Room Allocation for ${rollNumber}</h4>
        <div style="background-color: #f8f9fa; padding: 1rem; border-radius: 5px;">
            <p><strong>Room:</strong> ${room}</p>
            <p><strong>Seat:</strong> Row ${seatRow}, Column ${seatCol}</p>
            <p><strong>Building:</strong> Academic Block A</p>
            <p><strong>Floor:</strong> ${roomNumber < 6 ? 'Ground' : 'First'}</p>
        </div>
        
        <div style="margin-top: 2rem;">
            <h5>Room Layout:</h5>
            ${generateDetailedRoomLayout(room, rollNumber, seatRow, seatCol)}
            
            <div style="margin-top: 1rem; font-size: 0.9rem;">
                <p><strong>Note:</strong> Please arrive at least 30 minutes before exam time.</p>
                <p>Bring your student ID and exam admission ticket.</p>
            </div>
        </div>
    `;
    
    document.getElementById('room-result').innerHTML = roomHTML;
}

function generateDetailedRoomLayout(room, highlightRoll, row, col) {
    let layoutHTML = `
        <div style="border: 1px solid #ddd; padding: 1rem; display: inline-block;">
            <div style="text-align: center; margin-bottom: 0.5rem; font-weight: bold;">${room}</div>
            <div style="display: grid; grid-template-columns: repeat(3, 60px); gap: 5px;">
    `;
    
    for (let r = 1; r <= 6; r++) {
        for (let c = 1; c <= 3; c++) {
            const isHighlighted = r === row && c === col;
            
            layoutHTML += `
                <div style="
                    border: 1px solid #ddd; 
                    height: 40px; 
                    display: flex; 
                    align-items: center; 
                    justify-content: center;
                    ${isHighlighted ? 'background-color: #e74c3c; color: white;' : ''}
                ">
                    ${isHighlighted ? highlightRoll : ''}
                </div>
            `;
        }
    }
    
    layoutHTML += `
            </div>
            <div style="margin-top: 0.5rem; font-size: 0.8rem;">
                <div>▲ Front of Room</div>
            </div>
        </div>
    `;
    
    return layoutHTML;
}