        document.addEventListener("DOMContentLoaded", function () {
            const table = document.querySelector("table");
            const tbody = table.querySelector("tbody");
            const rows = Array.from(tbody.querySelectorAll("tr"));

            // เรียงลำดับตามจำนวนที่มี (คอลัมน์ที่ 2)
            rows.sort((a, b) => {
                const aValue = parseInt(a.cells[1].textContent);
                const bValue = parseInt(b.cells[1].textContent);
                return bValue - aValue;
            });

            // ลบทุกแถวใน tbody
            rows.forEach(row => {
                tbody.removeChild(row);
            });

            // เพิ่มแถวเรียงลำดับใหม่ลงใน tbody
            rows.forEach(row => {
                tbody.appendChild(row);
            });
        });