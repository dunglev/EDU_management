const BASE_URL = "http://localhost:8000";           //private for DEV
//const BASE_URL = "http://192.168.110.225:8000";   //public LAN for Test
//const BASE_URL = "http://dunglev.io.vn:8000";     //public Internet
let currentUser = null;
let currentPage = 1;
let totalPages = 1;
let classStatsData = null;
let studentsByBlockData = null;
let TeacherBySubjectData = null;

function updateMenu() {
    console.log("Updating menu, currentUser:", currentUser);
    document.getElementById("login-menu").classList.toggle("hidden", !!currentUser);
    document.getElementById("register-menu").classList.toggle("hidden", !!currentUser);
    document.getElementById("logout-menu").classList.toggle("hidden", !currentUser);
    document.getElementById("desktop-menu-2").classList.toggle("hidden", !currentUser || currentUser.role !== "admin");   
    document.getElementById("desktop-menu-3").classList.toggle("hidden", !currentUser || currentUser.role !== "admin");       
}

function loadHome() {
    document.getElementById("content").innerHTML = `
        <h2 class="text-2xl font-bold mb-4">Home</h2>
        <p>This system allows you to manage student scores, import data, and generate reports.</p>                
    `;
}

function loadLogin() {
    document.getElementById("content").innerHTML = `
        <h2 class="text-2xl font-bold mb-4">Đăng nhập</h2>
        <div class="max-w-md mx-auto">
            <input id="username" type="text" placeholder="Tên người dùng" class="w-full p-2 mb-4 border rounded">
            <input id="password" type="password" placeholder="Mật khẩu" class="w-full p-2 mb-4 border rounded">
            <button onclick="login()" class="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Đăng nhập</button>
        </div>
        <p id="message" class="text-red-600 mt-4"></p>
    `;
}

function loadRegister() {
    document.getElementById("content").innerHTML = `
        <h2 class="text-2xl font-bold mb-4">Đăng ký</h2>
        <div class="max-w-md mx-auto">
            <input id="username" type="text" placeholder="Tên người dùng" class="w-full p-2 mb-4 border rounded">
            <input id="password" type="password" placeholder="Mật khẩu" class="w-full p-2 mb-4 border rounded">
            <input id="confirm_password" type="password" placeholder="Nhập lại mật khẩu" class="w-full p-2 mb-4 border rounded">
            <select id="site" class="w-full p-2 mb-4 border rounded">
                <option value="">Chọn trường</option>
                <option value="Cơ sở Hà Nội">Cơ sở Hà Nội</option>
                <option value="THPT Trần Phú - Hoàn Kiếm Hà Nội">THPT Trần Phú - Hoàn Kiếm Hà Nội</option>
            </select>
            <button onclick="register()" class="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Đăng ký</button>
        </div>
        <p id="message" class="text-red-600 mt-4"></p>
    `;
}

async function login() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const message = document.getElementById("message");

    if (!username) {
        message.textContent = "Tên người dùng không được để trống!";
        return;
    }
    if (!password) {
        message.textContent = "Mật khẩu không được để trống!";
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });
        const data = await response.json();
        if (response.ok) {
            currentUser = data;
            console.log("Login successful, currentUser:", currentUser);
            message.classList.replace("text-red-600", "text-green-600");
            message.textContent = "Đăng nhập thành công!";
            updateMenu();
            loadHome();
        } else {
            console.log("Error data:", data);
            message.textContent = typeof data.detail === "string" ? data.detail : JSON.stringify(data.detail) || "Đăng nhập thất bại!";
        }
    } catch (error) {
        console.error("Login error:", error);
        message.textContent = "Lỗi kết nối server!";
    }
}

async function register() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const confirm_password = document.getElementById("confirm_password").value;
    const site = document.getElementById("site").value;
    const message = document.getElementById("message");

    if (!username) {
        message.textContent = "Tên người dùng không được để trống!";
        return;
    }
    if (!password) {
        message.textContent = "Mật khẩu không được để trống!";
        return;
    }
    if (!confirm_password) {
        message.textContent = "Vui lòng nhập lại mật khẩu!";
        return;
    }
    if (password !== confirm_password) {
        message.textContent = "Mật khẩu không khớp!";
        return;
    }
    if (!site) {
        message.textContent = "Cơ sở không được để trống!";
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password, confirm_password, site }),
        });
        const data = await response.json();
        if (response.ok) {
            message.classList.replace("text-red-600", "text-green-600");
            message.textContent = data.message || "Đăng ký thành công!";
            setTimeout(() => loadLogin(), 2000);
        } else {
            message.textContent = data.detail || "Đăng ký thất bại!";
        }
    } catch (error) {
        message.textContent = "Lỗi kết nối server!";
    }
}

function logout() {
    currentUser = null;
    updateMenu();
    loadHome();
}

function loadImportData(pathname,title) {
    document.getElementById("content").innerHTML = `
        <h2 class="text-2xl font-bold mb-4">${title}</h2>
        <div class="max-w-md mx-auto">
            <div class="text-blue-600 mt-4"><a href= "${BASE_URL}/static/template_file/${pathname}.xlsx" >Xem file mẫu <b>[${pathname}.xlsx]</b></a> hệ thống sẽ tự động đồng bộ file excel với dữ liệu cũ</div>
            <div class="text-blue-600 mt-4"></div>        
            <input type="file" id="score-avg-file" accept=".xlsx" class="mb-4">
            <button onclick="importData('${pathname}')" class="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700" id="import-button">Import</button>
            <div id="progress-container" class="mt-4">
                <p id="progress-status" class="mb-2"></p>
                <div class="w-full bg-gray-200 rounded-full h-4">
                    <div id="progress-bar" class="bg-blue-600 h-4 rounded-full" style="width: 0%"></div>
                </div>
            </div>
        </div>
        <p id="message" class="text-red-600 mt-4"></p>
    `;
}

async function importData(pathname) {
    const fileInput = document.getElementById("score-avg-file");
    const message = document.getElementById("message");
    const progressContainer = document.getElementById("progress-container");
    const progressBar = document.getElementById("progress-bar");
    const progressStatus = document.getElementById("progress-status");
    const importButton = document.getElementById("import-button");
    if (!fileInput.files.length) {
        message.textContent = "Vui lòng chọn file Excel!";
        return;
    }
    if (!confirm("Import sẽ xóa dữ liệu cũ. Tiếp tục?")) {
        message.textContent = "Đã hủy import.";
        return;
    }
    importButton.disabled = true;
    importButton.classList.add("opacity-50", "cursor-not-allowed");
    progressContainer.style.display = "block";
    progressStatus.textContent = "Đang upload file...";
    progressBar.style.width = "10%";
    const formData = new FormData();
    formData.append("file", fileInput.files[0]);
    try {
        setTimeout(() => {
            progressStatus.textContent = "Đang đọc file Excel...";
            progressBar.style.width = "30%";
        }, 500);
        setTimeout(() => {
            progressStatus.textContent = "Đang kiểm tra dữ liệu...";
            progressBar.style.width = "60%";
        }, 1000);
        setTimeout(() => {
            progressStatus.textContent = "Đang lưu vào database...";
            progressBar.style.width = "80%";
        }, 1500);                
        const response = await fetch(`${BASE_URL}/import_data/${pathname}`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${currentUser.token}` },
            body: formData,
        });
        progressBar.style.width = "100%";
        progressStatus.textContent = "Hoàn tất!";
        const data = await response.json();
        if (response.ok) {
            message.classList.replace("text-red-600", "text-green-600");
            message.textContent = data.message;
        } else {
            message.textContent = data.detail || "Import thất bại!";
            message.classList.replace("text-green-600", "text-red-600");
        }
    } catch (error) {
        message.textContent = "Lỗi kết nối server!";
        message.classList.replace("text-green-600", "text-red-600");
        progressStatus.textContent = "Lỗi trong quá trình import!";
        progressBar.style.width = "0%";
    } finally {
        importButton.disabled = false;
        importButton.classList.remove("opacity-50", "cursor-not-allowed");
        setTimeout(() => {
            progressContainer.style.display = "none";
            progressBar.style.width = "0%";
            progressStatus.textContent = "";
        }, 2000);
    }
}

function loadSearch() {
    document.getElementById("content").innerHTML = `
        <h2 class="text-2xl font-bold mb-4">Tìm kiếm - Lọc dữ liệu</h2>
        <div class="max-w-4xl mx-auto">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input id="search-name" type="text" placeholder="Tên học sinh" class="p-2 border rounded">
                <input id="search-class" type="text" placeholder="Lớp (VD: 10A1)" class="p-2 border rounded">
                <input id="search-cmnd" type="text" placeholder="CMND" class="p-2 border rounded">
                <input id="search-council" type="text" placeholder="Số báo danh" class="p-2 border rounded">
            </div>
            <h3 class="text-lg font-semibold mb-2">Lọc theo điểm</h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                    <label>Toán (Min-Max):</label>
                    <div class="flex space-x-2">
                        <input id="math-min" type="number" min="0" max="10" step="0.1" placeholder="Min" class="p-2 border rounded w-1/2">
                        <input id="math-max" type="number" min="0" max="10" step="0.1" placeholder="Max" class="p-2 border rounded w-1/2">
                    </div>
                </div>
                <div>
                    <label>Văn (Min-Max):</label>
                    <div class="flex space-x-2">
                        <input id="literature-min" type="number" min="0" max="10" step="0.1" placeholder="Min" class="p-2 border rounded w-1/2">
                        <input id="literature-max" type="number" min="0" max="10" step="0.1" placeholder="Max" class="p-2 border rounded w-1/2">
                    </div>
                </div>
                <div>
                    <label>Ngoại ngữ (Min-Max):</label>
                    <div class="flex space-x-2">
                        <input id="foreign-language-min" type="number" min="0" max="10" step="0.1" placeholder="Min" class="p-2 border rounded w-1/2">
                        <input id="foreign-language-max" type="number" min="0" max="10" step="0.1" placeholder="Max" class="p-2 border rounded w-1/2">
                    </div>
                </div>
            </div>
            <button onclick="searchStudents(1)" class="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Tìm kiếm</button>
        </div>
        <div id="search-results" class="mt-4"></div>
    `;
}

async function searchStudents(page = 1) {
    const name = document.getElementById("search-name").value.trim();
    const class_name = document.getElementById("search-class").value.trim();
    const cmnd = document.getElementById("search-cmnd").value.trim();
    const council_code = document.getElementById("search-council").value.trim();
    const math_min = document.getElementById("math-min").value;
    const math_max = document.getElementById("math-max").value;
    const literature_min = document.getElementById("literature-min").value;
    const literature_max = document.getElementById("literature-max").value;
    const foreign_language_min = document.getElementById("foreign-language-min").value;
    const foreign_language_max = document.getElementById("foreign-language-max").value;

    const params = new URLSearchParams({ page, page_size: 30 });
    if (name) params.append("name", name);
    if (class_name) params.append("class_name", class_name);
    if (cmnd) params.append("cmnd", cmnd);
    if (council_code) params.append("council_code", council_code);
    if (math_min) params.append("math_min", math_min);
    if (math_max) params.append("math_max", math_max);
    if (literature_min) params.append("literature_min", literature_min);
    if (literature_max) params.append("literature_max", literature_max);
    if (foreign_language_min) params.append("foreign_language_min", foreign_language_min);
    if (foreign_language_max) params.append("foreign_language_max", foreign_language_max);

    try {
        const response = await fetch(`${BASE_URL}/students/search?${params.toString()}`, {
            headers: { "Authorization": `Bearer ${currentUser.token}` }
        });
        const data = await response.json();
        if (response.ok) {
            currentPage = data.current_page;
            totalPages = data.total_pages;
            renderStudentTable(data.students, currentPage, totalPages, `Kết quả Tìm kiếm (Cơ sở ${currentUser.site})`, 'searchStudents');
        } else {
            document.getElementById("search-results").innerHTML = `<p class="text-red-600">${data.detail || "Tìm kiếm thất bại!"}</p>`;
        }
    } catch (error) {
        document.getElementById("search-results").innerHTML = `<p class="text-red-600">Lỗi kết nối server!</p>`;
    }
}
//hiển thị bảng phân công giảng viên
async function loadSTC() {
    try {
        console.log('Starting loadSTC, token:', currentUser?.token);
        if (!currentUser?.token) {
            throw new Error('Chưa đăng nhập hoặc token không hợp lệ');
        }               

        const response = await fetch(`${BASE_URL}/report/stc-stats`, {
            headers: { 'Authorization': `Bearer ${currentUser.token}` }
        });
        
        console.log('Response status:', response.status);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
        }

        const data = await response.json();                
        const statsContainer = document.getElementById('content');
        if (!statsContainer) {
            throw new Error('Không tìm thấy content');
        }

        statsContainer.innerHTML = '';

        const title = document.createElement('h2');
        title.className = 'text-2xl font-bold mb-4 text-center';
        title.textContent = `Bảng dữ liệu giáo viên theo môn học`;
        statsContainer.appendChild(title);
                
        if (!data.stc) {
            const noData = document.createElement('p');
            noData.className = 'text-gray-500 italic';
            noData.textContent = 'Không có dữ liệu giáo viên theo môn học';
            statsContainer.appendChild(noData);
            return;
        }

        const createTable = (headers, rows, titleText) => {
            const section = document.createElement('div');
            section.className = 'mb-6';

            if (titleText) {
                const sectionTitle = document.createElement('h3');
                sectionTitle.className = 'text-xl font-semibold mb-2';
                sectionTitle.textContent = titleText;
                section.appendChild(sectionTitle);
            }

            const table = document.createElement('table');
            table.className = 'min-w-full bg-white border border-gray-200';

            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');
            headers.forEach(header => {
                const th = document.createElement('th');
                th.className = 'py-2 px-4 border-b bg-gray-100 text-left';
                th.textContent = header;
                headerRow.appendChild(th);
            });
            thead.appendChild(headerRow);
            table.appendChild(thead);

            const tbody = document.createElement('tbody');
            rows.forEach(rowData => {
                const row = document.createElement('tr');
                rowData.forEach(cell => {
                    const td = document.createElement('td');
                    td.className = 'py-2 px-4 border-b';
                    td.textContent = typeof cell === 'number' ? cell.toFixed(2) : cell || 'N/A';
                    row.appendChild(td);
                });
                tbody.appendChild(row);
            });
            table.appendChild(tbody);
            section.appendChild(table);
            return section;
        };
        
        data.stc.forEach(s => {
            const headers = ['Tên giáo viên', 'Lớp'];
            const rows = s.teachers.map(teacher=> [
                teacher.teacher_name,
                teacher.class_name                
            ]);                    
            statsContainer.appendChild(createTable(headers, rows, `Môn ${s.subject}`));                    
        });

    } 
    catch (error) {
        console.error('Error in loadStudentsByBlock:', error);
        const statsContainer = document.getElementById('stats-container');
        if (statsContainer) {
            statsContainer.innerHTML = `<p class="text-red-500">Lỗi tải báo cáo: ${error.message}</p>`;
        }
    alert('Lỗi tải báo cáo: ' + error.message);
    }
}

async function loadTopStudentsByBlock() {
    try {
        console.log('Starting loadTopStudentsByBlock, token:', currentUser?.token);
        if (!currentUser?.token) {
            throw new Error('Chưa đăng nhập hoặc token không hợp lệ');
        }               

        const response = await fetch(`${BASE_URL}/report/top-students-by-block`, {
            headers: { 'Authorization': `Bearer ${currentUser.token}` }
        });
        
        console.log('Response status:', response.status);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
        }

        const data = await response.json();
        studentsByBlockData = data;
        console.log('Dung lev check - Students by block data:', data);

        const statsContainer = document.getElementById('content');
        if (!statsContainer) {
            throw new Error('Không tìm thấy content');
        }

        statsContainer.innerHTML = '';

        const title = document.createElement('h2');
        title.className = 'text-2xl font-bold mb-4 text-center';
        title.textContent = `Danh sách học sinh theo khối thi năm ${new Date().getFullYear()} trường ${currentUser['site']}`;
        statsContainer.appendChild(title);

        const exportButton = document.createElement('button');
        exportButton.className = 'bg-purple-500 text-white p-2 rounded mb-4 ml-auto';
        exportButton.textContent = 'Export to Excel';
        exportButton.onclick = exportStudentsByBlock;
        statsContainer.appendChild(exportButton);
        
        if (!data.blocks || data.blocks.length === 0) {
            const noData = document.createElement('p');
            noData.className = 'text-gray-500 italic';
            noData.textContent = 'Không có dữ liệu học sinh theo khối thi';
            statsContainer.appendChild(noData);
            return;
        }

        const createTable = (headers, rows, titleText) => {
            const section = document.createElement('div');
            section.className = 'mb-6';

            if (titleText) {
                const sectionTitle = document.createElement('h3');
                sectionTitle.className = 'text-xl font-semibold mb-2';
                sectionTitle.textContent = titleText;
                section.appendChild(sectionTitle);
            }

            const table = document.createElement('table');
            table.className = 'min-w-full bg-white border border-gray-200';

            const thead = document.createElement('thead');
            const headerRow = document.createElement('tr');
            headers.forEach(header => {
                const th = document.createElement('th');
                th.className = 'py-2 px-4 border-b bg-gray-100 text-left';
                th.textContent = header;
                headerRow.appendChild(th);
            });
            thead.appendChild(headerRow);
            table.appendChild(thead);

            const tbody = document.createElement('tbody');
            rows.forEach(rowData => {
                const row = document.createElement('tr');
                rowData.forEach(cell => {
                    const td = document.createElement('td');
                    td.className = 'py-2 px-4 border-b';
                    td.textContent = typeof cell === 'number' ? cell.toFixed(2) : cell || 'N/A';
                    row.appendChild(td);
                });
                tbody.appendChild(row);
            });
            table.appendChild(tbody);

            section.appendChild(table);
            return section;
        };

        data.blocks.forEach(block => {            
            const rows = block.students.map(student => [
                student.student_id.toFixed(0),
                student.student_name,
                student.cmnd,
                student.class_name,                
                student.score1,
                student.score2,                
                student.score3,
                student.total_score
            ]);
            const headers = ['Mã HS', 'Họ Tên', 'CMND', 'Lớp',`${block.students[0].subject1}`, `${block.students[0].subject2}`, `${block.students[0].subject3}`, 'Tổng Điểm'];            
            statsContainer.appendChild(createTable(headers, rows, `Khối ${block.block_code}`));
        });
    } catch (error) {
        console.error('Error in loadStudentsByBlock:', error);
        const statsContainer = document.getElementById('stats-container');
        if (statsContainer) {
            statsContainer.innerHTML = `<p class="text-red-500">Lỗi tải báo cáo: ${error.message}</p>`;
        }
        alert('Lỗi tải báo cáo: ' + error.message);
    }
}

function exportStudentsByBlock() {
    try {
        if (typeof XLSX === 'undefined' || !XLSX.utils) {
            throw new Error('Thư viện XLSX không được tải. Vui lòng kiểm tra kết nối mạng hoặc CDN.');
        }

        if (!studentsByBlockData || !studentsByBlockData.blocks) {
            throw new Error('Chưa có dữ liệu để xuất Excel!');
        }
        console.log('studentsByBlockData:', studentsByBlockData);

        const year = new Date().getFullYear();
        const worksheetData = [];
        const headers = [
            'Khối Thi', 'Mã HS', 'Họ Tên', 'CMND', 'Lớp', 'Địa điểm',
            'Môn 1', 'Điểm 1', 'Môn 2', 'Điểm 2', 'Môn 3', 'Điểm 3', 'Tổng Điểm'
        ];

        worksheetData.push(['TRƯỜNG THPT TRẦN PHÚ - HOÀN KIẾM']);
        worksheetData.push([`BẢNG DANH SÁCH HỌC SINH THEO KHỐI THI NĂM ${year}`]);
        worksheetData.push([]);
        worksheetData.push(headers);

        studentsByBlockData.blocks.forEach(block => {
            block.students.forEach(student => {
                const row = [
                    block.block_code || 'N/A',
                    student.student_id || 'N/A',
                    student.student_name || 'N/A',
                    student.cmnd || 'N/A',
                    student.class_name || 'N/A',
                    student.site || 'N/A',
                    student.subject1 || 'N/A',
                    student.score1 != null ? student.score1.toFixed(2) : 'N/A',
                    student.subject2 || 'N/A',
                    student.score2 != null ? student.score2.toFixed(2) : 'N/A',
                    student.subject3 || 'N/A',
                    student.score3 != null ? student.score3.toFixed(2) : 'N/A',
                    student.total_score != null ? student.total_score.toFixed(2) : 'N/A'
                ];
                worksheetData.push(row);
            });
        });

        const ws = XLSX.utils.aoa_to_sheet(worksheetData);
        ws['!cols'] = [
            { wch: 10 }, // Khối Thi
            { wch: 15 }, // Mã HS
            { wch: 20 }, // Họ Tên
            { wch: 15 }, // CMND
            { wch: 10 }, // Lớp
            { wch: 15 }, // Địa điểm
            { wch: 10 }, // Môn 1
            { wch: 8 },  // Điểm 1
            { wch: 10 }, // Môn 2
            { wch: 8 },  // Điểm 2
            { wch: 10 }, // Môn 3
            { wch: 8 },  // Điểm 3
            { wch: 10 }  // Tổng Điểm
        ];

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Học sinh theo khối thi');

        XLSX.writeFile(wb, `bc_hstheokhoi_${year}.xlsx`);
    } catch (error) {
        console.error('Error in exportStudentsByBlock:', error);
        alert('Lỗi khi xuất Excel: ' + error.message);
    }
}

async function loadStudentList(page = 1) {
    try {
        const response = await fetch(`${BASE_URL}/students/paginated?page=${page}&page_size=30`, {
            headers: { "Authorization": `Bearer ${currentUser.token}` }
        });
        const data = await response.json();
        currentPage = data.current_page;
        totalPages = data.total_pages;
        renderStudentTable(data.students, currentPage, totalPages, `Danh sách Học sinh (Cơ sở ${currentUser.site})`, 'loadStudentList');
    } catch (error) {
        document.getElementById("content").innerHTML = `<p class="text-red-600">Lỗi kết nối server!</p>`;
    }
}

function renderStudentTable(students, page, total, title, callback) {
    let html = `<h2 class="text-2xl font-bold mb-4">${title}</h2>`;
    if (!students || students.length === 0) {
        html += `<p>Không có dữ liệu học sinh!</p>`;
    } else {
        html += `<table class="w-full border-collapse border">
            <thead><tr class="bg-blue-600 text-white">
                <th class="border p-2">Họ và tên</th>
                <th class="border p-2">Lớp</th>                
                <th class="border p-2">Giới tính</th>
                <th class="border p-2">Ngày sinh</th>                
                <th class="border p-2">Toán</th>
                <th class="border p-2">Văn</th>
                <th class="border p-2">Lý</th>
                <th class="border p-2">Hóa</th>
                <th class="border p-2">Sinh</th>
                <th class="border p-2">Sử</th>
                <th class="border p-2">Địa</th>
                <th class="border p-2">Tin</th>
                <th class="border p-2">CNCN</th>
                <th class="border p-2">CNNN</th>
                <th class="border p-2">Ngoại ngữ</th>
            </tr></thead><tbody>`;
        for (const student of students) {
            html += `<tr>
                <td class="border p-2">${student.name}</td>
                <td class="border p-2">${student.class_name}</td>
                <td class="border p-2">${student.gender || 'N/A'}</td>
                <td class="border p-2">${student.dob || 'N/A'}</td>                
                <td class="border p-2">${student.math_score?.toFixed(2) || ''}</td>
                <td class="border p-2">${student.literature_score?.toFixed(2) || ''}</td>
                <td class="border p-2">${student.physics_score?.toFixed(2) || ''}</td>
                <td class="border p-2">${student.chemistry_score?.toFixed(2) || ''}</td>
                <td class="border p-2">${student.biology_score?.toFixed(2) || ''}</td>
                <td class="border p-2">${student.history_score?.toFixed(2) || ''}</td>
                <td class="border p-2">${student.geography_score?.toFixed(2) || ''}</td>                
                <td class="border p-2">${student.cs_score?.toFixed(2) || ''}</td>
                <td class="border p-2">${student.itech_score?.toFixed(2) || ''}</td>
                <td class="border p-2">${student.atech_score?.toFixed(2) || ''}</td>
                <td class="border p-2">${student.foreign_language_score?.toFixed(2) || ''}</td>
            </tr>`;
        }
        html += `</tbody></table>`;
        html += `<div class="mt-4 flex justify-between">
            <button onclick="${callback}(${page - 1})" class="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 ${page === 1 ? 'opacity-50 cursor-not-allowed' : ''}" ${page === 1 ? 'disabled' : ''}>Previous</button>
            <span>Trang ${page} / ${total}</span>
            <button onclick="${callback}(${page + 1})" class="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 ${page === total ? 'opacity-50 cursor-not-allowed' : ''}" ${page === total ? 'disabled' : ''}>Next</button>
        </div>`;
    }
    if (callback === 'searchStudents') {
        document.getElementById("search-results").innerHTML = html;
    } else {
        document.getElementById("content").innerHTML = html;
    }
}

//hiển thị phổ điểm các môn học
async function loadScoreDistribution() {               
    try {
        console.log('Starting loadScoreDistribution, token:', currentUser?.token);
        if (!currentUser?.token) {
            throw new Error('Chưa đăng nhập hoặc token không hợp lệ');
        }

        document.getElementById('content').innerHTML = `
            <h2 class="text-2xl font-bold mb-4">Biểu đồ phổ điểm các môn thi tốt nghiệp (Cơ sở ${currentUser.site})</h2>
            <div id="chart-container" class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                    <h3 class="text-lg font-semibold mb-2">Toán</h3>
                    <canvas id="math-chart"></canvas>
                </div>
                <div>
                    <h3 class="text-lg font-semibold mb-2">Văn</h3>
                    <canvas id="literature-chart"></canvas>
                </div>
                <div>
                    <h3 class="text-lg font-semibold mb-2">Ngoại Ngữ</h3>
                    <canvas id="foreign-language-chart"></canvas>
                </div>
                <div>
                    <h3 class="text-lg font-semibold mb-2">Vật lý</h3>
                    <canvas id="physics-chart"></canvas>
                </div>                
                <div>
                    <h3 class="text-lg font-semibold mb-2">Sinh học</h3>
                    <canvas id="biology-chart"></canvas>
                </div>
                <div>
                    <h3 class="text-lg font-semibold mb-2">Hóa học</h3>
                    <canvas id="chemistry-chart"></canvas>
                </div>
                <div>
                    <h3 class="text-lg font-semibold mb-2">GDCD</h3>
                    <canvas id="civic-education-chart"></canvas>
                </div>
                <div>
                    <h3 class="text-lg font-semibold mb-2">Địa lý</h3>
                    <canvas id="geography-chart"></canvas>
                </div>
                <div>
                    <h3 class="text-lg font-semibold mb-2">Lịch Sử</h3>
                    <canvas id="history-chart"></canvas>
                </div>
                <div>
                    <h3 class="text-lg font-semibold mb-2">Tin học</h3>
                    <canvas id="cs-chart"></canvas>
                </div>
                <div>
                    <h3 class="text-lg font-semibold mb-2">CNCN</h3>
                    <canvas id="itech-chart"></canvas>
                </div>
                <div>
                    <h3 class="text-lg font-semibold mb-2">CNNN</h3>
                    <canvas id="atech-chart"></canvas>
                </div>
            </div>
            <p id="message" class="text-red-600 mt-4"></p>
        `;
        
        const response = await fetch(`${BASE_URL}/students/paginated?page=1&page_size=1000`, {
            headers: { "Authorization": `Bearer ${currentUser.token}` }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        if (!data.students || data.students.length === 0) {
            document.getElementById("message").textContent = "Không có dữ liệu học sinh để hiển thị!";
            return;
        }
        
        // Process score data into bins (0-1, 1-2, ..., 9-10)
        const bins = Array(10).fill(0).map((_, i) => ({ range: `${i}-${i+1}`, math: 0, literature: 0, foreign_language: 0, physics:0, 
                                                                              biology:0, chemistry:0, civic_education:0, geography:0, 
                                                                              history:0, cs:0, itech:0, atech:0 }));
        data.students.forEach(student => {
            //toán
            if (student.math_score != null) {
                const binIndex = Math.min(Math.floor(student.math_score), 9);
                bins[binIndex].math++;
            }
            //văn
            if (student.literature_score != null) {
                const binIndex = Math.min(Math.floor(student.literature_score), 9);
                bins[binIndex].literature++;
            }
            //ngoai ngữ
            if (student.foreign_language_score != null) {
                const binIndex = Math.min(Math.floor(student.foreign_language_score), 9);
                bins[binIndex].foreign_language++;
            }
            //vật lý
            if (student.physics_score != null) {
                const binIndex = Math.min(Math.floor(student.physics_score), 9);
                bins[binIndex].physics++;
            }
            
            //sinh học
            if (student.biology_score != null) {
                const binIndex = Math.min(Math.floor(student.biology_score), 9);
                bins[binIndex].biology++;                
            }
            //hóa học chemistry
            if (student.chemistry_score != null) {
                const binIndex = Math.min(Math.floor(student.chemistry_score), 9);
                bins[binIndex].chemistry++;                
            }
            //giáo dục công dân
            if (student.civic_education_score != null) {
                const binIndex = Math.min(Math.floor(student.civic_education_score), 9);
                bins[binIndex].civic_education++;                
            }
            //địa lý
            if (student.geography_score != null) {
                const binIndex = Math.min(Math.floor(student.geography_score), 9);
                bins[binIndex].geography++;                
            }
            //sử
            if (student.history_score != null) {
                const binIndex = Math.min(Math.floor(student.history_score), 9);
                bins[binIndex].history++;                
            }
            //tin
            if (student.cs_score != null) {
                const binIndex = Math.min(Math.floor(student.cs_score), 9);
                bins[binIndex].cs++;                
            }
            //CNCN
            if (student.itech_score != null) {
                const binIndex = Math.min(Math.floor(student.itech_score), 9);
                bins[binIndex].itech++;                
            }
            //CNNN
            if (student.atech_score != null) {
                const binIndex = Math.min(Math.floor(student.atech_score), 9);
                bins[binIndex].atech++;                
            }
        });

        // Create charts
        const createChart = (canvasId, data, label) => {
            new Chart(document.getElementById(canvasId), {
                type: 'bar',
                data: {
                    labels: bins.map(bin => bin.range),
                    datasets: [{
                        label: label,
                        data: data,
                        backgroundColor: 'rgba(54, 162, 235, 0.5)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        x: { title: { display: true, text: 'Khoảng Điểm' } },
                        y: { title: { display: true, text: 'Số Lượng Học Sinh' }, beginAtZero: true, ticks: { stepSize: 1 } }
                    },
                    plugins: {
                        legend: { display: false },
                        title: { display: false }
                    }
                }
            });
        };

        createChart('math-chart', bins.map(bin => bin.math), 'Toán');
        createChart('literature-chart', bins.map(bin => bin.literature), 'Văn');
        createChart('foreign-language-chart', bins.map(bin => bin.foreign_language), 'Ngoại Ngữ');
        createChart('physics-chart', bins.map(bin => bin.physics), 'Vật lý');
        createChart('biology-chart', bins.map(bin => bin.biology), 'Sinh học');
        createChart('chemistry-chart', bins.map(bin => bin.chemistry), 'Hóa học');
        createChart('civic-education-chart', bins.map(bin => bin.civic_education), 'GDCD');
        createChart('geography-chart', bins.map(bin => bin.geography), 'Địa lý');
        createChart('history-chart', bins.map(bin => bin.history), 'Lịch sử');
        createChart('cs-chart', bins.map(bin => bin.cs), 'Tin học');
        createChart('itech-chart', bins.map(bin => bin.itech), 'CNCN');
        createChart('atech-chart', bins.map(bin => bin.atech), 'CNNN');
    } catch (error) {
        console.error('Error in loadScoreDistribution:', error);
        document.getElementById('content').innerHTML = `
            <h2 class="text-2xl font-bold mb-4">Báo cáo Phổ Điểm (Cơ sở ${currentUser?.site || 'N/A'})</h2>
            <p class="text-red-600">Lỗi khi tải dữ liệu: ${error.message}</p>
        `;
    }
}

async function loadClassStats() {
    try {
        console.log('Starting loadClassStats, token:', currentUser?.token);
        if (!currentUser?.token) {
            throw new Error('Chưa đăng nhập hoặc token không hợp lệ');
        }

        // Khởi tạo HTML với tiêu đề và nút export
        let html = `
            <h2 class="text-2xl font-bold mb-4">Thống kê điểm Cao/Thấp/Trung bình theo lớp (Cơ sở ${currentUser.site})</h2>
            <div class="flex justify-end mb-4">
                <button onclick="exportClassStats()" class="bg-green-500 text-white p-2 rounded hover:bg-green-600">Export Excel</button>
            </div>
            <div id="class-stats-container"></div>
        `;
        document.getElementById('content').innerHTML = html;

        const response = await fetch(`${BASE_URL}/report/class-stats`, {
            headers: { 'Authorization': `Bearer ${currentUser.token}` }
        });
        console.log('Response status:', response.status);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
        }

        const data = await response.json();
        console.log('Response data:', data);
        if (data.message) {
            document.getElementById('class-stats-container').innerHTML = '<p class="text-center text-gray-500">Không có dữ liệu để hiển thị</p>';
            return;
        }
        if (!data.class_stats || !data.overall_stats || !data.overall_student_counts || !data.area_scores) {
            throw new Error('Dữ liệu không đúng định dạng: Thiếu class_stats hoặc overall_stats hoặc overall_student_counts hoặc area_scores');
        }

        classStatsData = data; // Lưu dữ liệu để export
        const container = document.getElementById('class-stats-container');
        const subjects = ['Toán', 'Văn', 'Lý', 'Hóa', 'Sinh', 'Sử', 'Địa', 'GDCD', 'Tin','CNCN','CNNN','Ngoại ngữ'];

        // Hàm tạo bảng cho mỗi lớp hoặc tổng hợp
        const createTable = (title, stats, isOverall = false) => {
            let tableHtml = `<h3 class="text-xl font-semibold mb-2">${title}</h3>
                <table class="w-full border-collapse border mb-6">
                    <thead>
                        <tr class="bg-blue-600 text-white">
                            <th class="border p-2"></th>`;
            subjects.forEach(subject => {
                tableHtml += `<th class="border p-2">${subject}</th>`;
            });
            tableHtml += `</tr></thead><tbody>`;

            // Dòng điểm trung bình
            tableHtml += `<tr><td class="border p-2 font-semibold">Điểm TB</td>`;
            subjects.forEach(subject => {
                const value = stats[subject]?.avg != null ? stats[subject].avg.toFixed(2) : 'N/A';
                tableHtml += `<td class="border p-2">${value}</td>`;
            });
            tableHtml += `</tr>`;

            // Dòng điểm cao nhất
            tableHtml += `<tr><td class="border p-2 font-semibold">Điểm Cao Nhất</td>`;
            subjects.forEach(subject => {
                const value = stats[subject]?.max != null ? stats[subject].max.toFixed(2) : 'N/A';
                tableHtml += `<td class="border p-2">${value}</td>`;
            });
            tableHtml += `</tr>`;

            // Dòng điểm thấp nhất
            tableHtml += `<tr><td class="border p-2 font-semibold">Điểm Thấp Nhất</td>`;
            subjects.forEach(subject => {
                const value = stats[subject]?.min != null ? stats[subject].min.toFixed(2) : 'N/A';
                tableHtml += `<td class="border p-2">${value}</td>`;
            });
            tableHtml += `</tr>`;

            // Nếu là bảng tổng hợp, thêm dòng số học sinh dự thi
            if (isOverall) {
                tableHtml += `<tr><td class="border p-2 font-semibold">Số HS dự thi</td>`;
                subjects.forEach(subject => {
                    const value = data.overall_student_counts[subject] != null ? data.overall_student_counts[subject] : 'N/A';
                    tableHtml += `<td class="border p-2">${value}</td>`;
                });
                tableHtml += `</tr>`;
            }

            tableHtml += `</tbody></table>`;
            return tableHtml;
        };

        // Tạo bảng cho mỗi lớp
        for (const className in data.class_stats) {
            container.innerHTML += createTable(`Lớp ${className}`, data.class_stats[className]);
        }

        // Tạo bảng tổng hợp cho toàn trường
        container.innerHTML += createTable('Tổng hợp toàn trường', data.overall_stats, true);

    } catch (error) {
        console.error('Error in loadClassStats:', error);
        document.getElementById('content').innerHTML = `
            <h2 class="text-2xl font-bold mb-4">Báo cáo Thống kê Điểm Theo Lớp (Cơ sở ${currentUser?.site || 'N/A'})</h2>
            <p class="text-red-600">Lỗi khi tải báo cáo: ${error.message}</p>
        `;
    }
}
function exportClassStats() {
    try {
        if (typeof XLSX === 'undefined' || !XLSX.utils) {
            throw new Error('Thư viện XLSX không được tải. Vui lòng kiểm tra kết nối mạng hoặc CDN.');
        }
        
        if (!classStatsData) {
            throw new Error('Chưa có dữ liệu để xuất Excel!');
        }
        console.log('classStatsData:', classStatsData);
        
        if (!classStatsData.class_stats || typeof classStatsData.class_stats !== 'object') {
            throw new Error('Dữ liệu class_stats không hợp lệ');
        }
        if (!classStatsData.overall_stats || typeof classStatsData.overall_stats !== 'object') {
            throw new Error('Dữ liệu overall_stats không hợp lệ');
        }
        if (!classStatsData.overall_student_counts || typeof classStatsData.overall_student_counts !== 'object') {
            throw new Error('Dữ liệu overall_student_counts không hợp lệ');
        }

        const year = new Date().getFullYear();
        const subjects = ['Toán', 'Văn', 'Lý', 'Hóa', 'Sinh', 'Sử', 'Địa', 'GDCD','Tin',"CNCN","CNNN",'Ngoại ngữ'];
        const sheetData = [
            ['TRƯỜNG THPT TRẦN PHÚ - HOÀN KIẾM'],
            [`BẢNG THỐNG KÊ ĐIỂM THI TN THPT QG NĂM ${year}`],
            [`Cơ sở: ${currentUser.site}`],
            ['Tổng số học sinh khối 12 dự thi: ', classStatsData.total_students || 'N/A'],
            []
        ];

        // Hàm tạo dữ liệu cho bảng trong sheet
        const createTableData = (title, stats, isOverall = false) => {
            const tableData = [
                [title],
                ['', ...subjects], // Tiêu đề cột
            ];

            // Dòng điểm trung bình
            const avgRow = ['Điểm TB'];
            subjects.forEach(subject => {
                const value = stats[subject]?.avg != null ? stats[subject].avg.toFixed(2) : 'N/A';
                avgRow.push(value);
            });
            tableData.push(avgRow);

            // Dòng điểm cao nhất
            const maxRow = ['Điểm Cao Nhất'];
            subjects.forEach(subject => {
                const value = stats[subject]?.max != null ? stats[subject].max.toFixed(2) : 'N/A';
                maxRow.push(value);
            });
            tableData.push(maxRow);

            // Dòng điểm thấp nhất
            const minRow = ['Điểm Thấp Nhất'];
            subjects.forEach(subject => {
                const value = stats[subject]?.min != null ? stats[subject].min.toFixed(2) : 'N/A';
                minRow.push(value);
            });
            tableData.push(minRow);

            // Nếu là bảng tổng hợp, thêm dòng số học sinh dự thi
            if (isOverall) {
                const countRow = ['Số HS dự thi'];
                subjects.forEach(subject => {
                    const value = classStatsData.overall_student_counts[subject] != null ? classStatsData.overall_student_counts[subject] : 'N/A';
                    countRow.push(value);
                });
                tableData.push(countRow);
            }

            // Thêm dòng trống để phân cách
            tableData.push([]);
            return tableData;
        };

        // Thêm bảng cho mỗi lớp
        for (const className in classStatsData.class_stats) {
            const classTable = createTableData(`Lớp ${className}`, classStatsData.class_stats[className]);
            sheetData.push(...classTable);
        }

        // Thêm bảng tổng hợp
        const overallTable = createTableData('Tổng hợp toàn trường', classStatsData.overall_stats, true);
        sheetData.push(...overallTable);

        // Thêm điểm trung bình Hà Nội và Quốc gia
        const hnRow = ['Điểm TB Hà Nội'];
        const qgRow = ['Điểm TB Quốc gia'];
        subjects.forEach(subject => {
            const stat = classStatsData.area_scores[subject] || {};
            hnRow.push(stat.hn != null ? stat.hn.toFixed(2) : 'N/A');
            qgRow.push(stat.qg != null ? stat.qg.toFixed(2) : 'N/A');
        });
        sheetData.push(hnRow);
        sheetData.push(qgRow);

        // Tạo sheet và workbook
        const ws = XLSX.utils.aoa_to_sheet(sheetData);
        ws['!cols'] = [{ wch: 20 }, ...subjects.map(() => ({ wch: 10 }))];
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Thống kê điểm');

        // Xuất file Excel
        XLSX.writeFile(wb, `bc_theolop_${year}_${currentUser.site.replace(/\s+/g, '_')}.xlsx`);
    } catch (error) {
        console.error('Error in exportClassStats:', error);
        alert('Lỗi khi xuất Excel: ' + error.message);
    }
}

async function loadTeacherReport() {
    try {
        console.log('Starting loadTeacherReport, token:', currentUser?.token);
        if (!currentUser?.token) {
            throw new Error('Chưa đăng nhập hoặc token không hợp lệ');
        }

        const response = await fetch(`${BASE_URL}/report/teacher-quality`, {
            headers: { 'Authorization': `Bearer ${currentUser.token}` }
        });
        
        console.log('Response status:', response.status);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
        }

        const data = await response.json();
        TeacherBySubjectData = data;
        console.log('Teacher by subject data:', data);

        const statsContainer = document.getElementById('content');
        if (!statsContainer) {
            throw new Error('Không tìm thấy content');
        }

        statsContainer.innerHTML = '';

        const title = document.createElement('h2');
        title.className = 'text-2xl font-bold mb-4 text-center';
        title.textContent = `Đánh giá giáo viên theo môn thi`;
        statsContainer.appendChild(title);

        // Tạo dropdown chọn môn học
        const filterContainer = document.createElement('div');
        filterContainer.className = 'flex justify-between items-center mb-4';
        filterContainer.innerHTML = `
            <div class="flex items-center space-x-2"><b>Chọn môn học cần hiển thị </b>
                <select id="subject-select" class="p-2 border rounded">
                    <option value="">Tất cả môn học</option>
                    ${data.subjects.map(subject => `<option value="${subject.subject}">${subject.subject}</option>`).join('')}
                </select>
                <button id="show-report-button" class="bg-blue-600 text-white p-2 rounded hover:bg-blue-700">Hiển thị</button>
            </div>
            <button id="export-button" class="bg-green-500 text-white p-2 rounded hover:bg-green-600">Export to Excel</button>
        `;
        statsContainer.appendChild(filterContainer);

        const reportContainer = document.createElement('div');
        reportContainer.id = 'report-container';
        statsContainer.appendChild(reportContainer);

        // Hàm hiển thị báo cáo dựa trên môn học được chọn
        const renderReport = (selectedSubject = '') => {
            const filteredSubjects = selectedSubject
                ? data.subjects.filter(subject => subject.subject === selectedSubject)
                : data.subjects;

            reportContainer.innerHTML = '';

            if (!filteredSubjects || filteredSubjects.length === 0) {
                const noData = document.createElement('p');
                noData.className = 'text-gray-500 italic';
                noData.textContent = 'Không có dữ liệu giáo viên cho môn học này';
                reportContainer.appendChild(noData);
                return;
            }

            const createTable = (headers, rows, titleText) => {
                const section = document.createElement('div');
                section.className = 'mb-6';

                if (titleText) {
                    const sectionTitle = document.createElement('h4');
                    sectionTitle.className = 'text-lg font-semibold mb-2';
                    sectionTitle.textContent = titleText;
                    section.appendChild(sectionTitle);
                }

                const table = document.createElement('table');
                table.className = 'min-w-full bg-white border border-gray-200';

                const thead = document.createElement('thead');
                const headerRow = document.createElement('tr');
                headers.forEach(header => {
                    const th = document.createElement('th');
                    th.className = 'py-2 px-4 border-b bg-gray-100 text-left';
                    th.textContent = header;
                    headerRow.appendChild(th);
                });
                thead.appendChild(headerRow);
                table.appendChild(thead);

                const tbody = document.createElement('tbody');
                rows.forEach(rowData => {
                    const row = document.createElement('tr');
                    rowData.forEach(cell => {
                        const td = document.createElement('td');
                        td.className = 'py-2 px-4 border-b';
                        td.textContent = typeof cell === 'number' ? cell.toFixed(2) : cell || 'N/A';
                        row.appendChild(td);
                    });
                    tbody.appendChild(row);
                });
                table.appendChild(tbody);

                section.appendChild(table);
                return section;
            };

            filteredSubjects.forEach(subject => {
                const subjectSection = document.createElement('div');
                subjectSection.className = 'mb-8';
                const subjectTitle = document.createElement('h3');
                subjectTitle.className = 'text-xl font-semibold mb-4';
                subjectTitle.textContent = `Môn ${subject.subject}`;
                subjectSection.appendChild(subjectTitle);

                // Nhóm dữ liệu theo giáo viên
                const teachersByName = {};
                subject.teachers.forEach(teacher => {
                    if (!teachersByName[teacher.teacher_name]) {
                        teachersByName[teacher.teacher_name] = {
                            classes: [],
                            avg_score_teacher: teacher.avg_score_teacher,
                            max_score_teacher: teacher.max_score_teacher,
                            min_score_teacher: teacher.min_score_teacher
                        };
                    }
                    teachersByName[teacher.teacher_name].classes.push({
                        class_name: teacher.class_name,
                        avg_score_class: teacher.avg_score_class,
                        max_score_class: teacher.max_score_class,
                        min_score_class: teacher.min_score_class
                    });
                });

                // Hiển thị từng giáo viên
                Object.keys(teachersByName).forEach(teacherName => {
                    const teacherData = teachersByName[teacherName];
                    // Phần 1: Dòng tiêu đề giáo viên
                    const teacherHeader = document.createElement('div');
                    teacherHeader.className = 'text-lg font-medium mb-2 bg-gray-50 p-2 rounded';
                    teacherHeader.textContent = `Giáo viên:${teacherName.toUpperCase() || 'N/A'} [ĐTB: ${teacherData.avg_score_teacher != null ? teacherData.avg_score_teacher.toFixed(2) : 'N/A'} - Cao nhất: ${teacherData.max_score_teacher != null ? teacherData.max_score_teacher.toFixed(2) : 'N/A'} - Thấp nhất: ${teacherData.min_score_teacher != null ? teacherData.min_score_teacher.toFixed(2) : 'N/A'}]`;
                    subjectSection.appendChild(teacherHeader);

                    // Phần 2: Bảng dữ liệu theo lớp
                    const headers = ['Tên lớp', 'ĐTB', 'Cao nhất', 'Thấp nhất'];
                    const rows = teacherData.classes.map(cls => [
                        cls.class_name,
                        cls.avg_score_class,
                        cls.max_score_class,
                        cls.min_score_class
                    ]);
                    subjectSection.appendChild(createTable(headers, rows));
                });

                reportContainer.appendChild(subjectSection);
            });
        };

        // Gắn sự kiện cho nút "Hiển thị"
        document.getElementById('show-report-button').addEventListener('click', () => {
            const selectedSubject = document.getElementById('subject-select').value;
            renderReport(selectedSubject);
        });

        // Gắn sự kiện cho nút "Export"
        document.getElementById('export-button').addEventListener('click', () => {
            const selectedSubject = document.getElementById('subject-select').value;
            exportTeacherQuality(selectedSubject);
        });

        // Hiển thị tất cả môn học mặc định khi tải trang
        renderReport();
    } catch (error) {
        console.error('Error in loadTeacherReport:', error);
        const statsContainer = document.getElementById('content');
        if (statsContainer) {
            statsContainer.innerHTML = `<p class="text-red-500">Lỗi tải báo cáo: ${error.message}</p>`;
        }
        alert('Lỗi tải báo cáo: ' + error.message);
    }
}
function exportTeacherQuality(selectedSubject = '') {
    try {
        if (typeof XLSX === 'undefined' || !XLSX.utils) {
            throw new Error('Thư viện XLSX không được tải.');
        }
        if (!TeacherBySubjectData || !TeacherBySubjectData.subjects) {
            throw new Error('Chưa có dữ liệu để xuất Excel!');
        }
        console.log('TeacherBySubjectData:', TeacherBySubjectData);

        const year = new Date().getFullYear();
        const worksheetData = [];
        const headers = ['Môn', 'Tên giáo viên', 'Lớp', 'ĐTB theo lớp', 'Max theo lớp', 'Min theo lớp', 'ĐTB chung', 'Max chung', 'Min chung'];

        worksheetData.push(['TRƯỜNG THPT TRẦN PHÚ - HOÀN KIẾM']);
        worksheetData.push([`BẢNG ĐÁNH GIÁ GIÁO VIÊN THEO MÔN THI NĂM ${year}`]);
        if (selectedSubject) {
            worksheetData.push([`Môn: ${selectedSubject}`]);
        }
        worksheetData.push([]);
        worksheetData.push(headers);

        const filteredSubjects = selectedSubject
            ? TeacherBySubjectData.subjects.filter(subject => subject.subject === selectedSubject)
            : TeacherBySubjectData.subjects;

        filteredSubjects.forEach(subject => {
            subject.teachers.forEach(teacher => {
                const row = [
                    subject.subject || 'N/A',
                    teacher.teacher_name || 'N/A',
                    teacher.class_name || 'N/A',
                    teacher.avg_score_class != null ? teacher.avg_score_class.toFixed(2) : 'N/A',
                    teacher.max_score_class != null ? teacher.max_score_class.toFixed(2) : 'N/A',
                    teacher.min_score_class != null ? teacher.min_score_class.toFixed(2) : 'N/A',
                    teacher.avg_score_teacher != null ? teacher.avg_score_teacher.toFixed(2) : 'N/A',
                    teacher.max_score_teacher != null ? teacher.max_score_teacher.toFixed(2) : 'N/A',
                    teacher.min_score_teacher != null ? teacher.min_score_teacher.toFixed(2) : 'N/A'
                ];
                worksheetData.push(row);
            });
        });

        const ws = XLSX.utils.aoa_to_sheet(worksheetData);
        ws['!cols'] = [
            { wch: 15 }, // Môn
            { wch: 20 }, // Tên giáo viên
            { wch: 10 }, // Lớp
            { wch: 15 }, // ĐTB theo lớp
            { wch: 15 }, // Max theo lớp
            { wch: 15 }, // Min theo lớp
            { wch: 15 }, // ĐTB chung
            { wch: 15 }, // Max chung
            { wch: 15 }  // Min chung
        ];

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Đánh giá giáo viên');
        const fileName = selectedSubject
            ? `bc_danhgiagv_${year}_${selectedSubject.replace(/\s+/g, '_')}.xlsx`
            : `bc_danhgiagv_${year}.xlsx`;
        XLSX.writeFile(wb, fileName);
    } catch (error) {
        console.error('Error in exportTeacherQuality:', error);
        alert('Lỗi khi xuất Excel: ' + error.message);
    }
}

updateMenu();tre