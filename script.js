document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('project-form');
    const tableBody = document.querySelector('#projects-table tbody');

    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Sayfa yenilenmesini durdur

        let isValid = true;

        // Kontrol edilecek input alanları ve hata mesajları
        const fields = [
            { id: 'proj-name', type: 'text', errorMsg: 'Project name is required.' },
            { id: 'proj-url', type: 'url', errorMsg: 'Please enter a valid URL (e.g., https://github.com).' },
            { id: 'proj-img', type: 'url', errorMsg: 'Please enter a valid image URL.' },
            { id: 'proj-date', type: 'date', errorMsg: 'Please select a valid date.' },
            { id: 'proj-tech', type: 'select', errorMsg: 'Please select a primary technology.' },
            { id: 'proj-desc', type: 'text', errorMsg: 'Description is required.' }
        ];

        const formData = {};

        // Validasyon döngüsü
        fields.forEach(field => {
            const inputElement = document.getElementById(field.id);
            // 'proj-name' id'sini parçalayıp 'name-error' id'sini buluyoruz
            const errorId = `${field.id.split('-')[1]}-error`;
            const errorElement = document.getElementById(errorId);

            // Önceki hataları temizle
            inputElement.setAttribute('aria-invalid', 'false');
            errorElement.textContent = '';

            // Boşluk kontrolü ve HTML5 validity kontrolü
            if (!inputElement.value.trim() || !inputElement.checkValidity()) {
                inputElement.setAttribute('aria-invalid', 'true');
                errorElement.textContent = field.errorMsg;
                isValid = false;
            } else {
                // XSS koruması için escape işlemi yapıp veriyi al
                formData[field.id] = escapeHTML(inputElement.value.trim());
            }
        });

        // Eğer tüm kurallar sağlandıysa tabloya ekle
        if (isValid) {
            addProjectToTable(formData);
            form.reset();
            // Kullanıcı deneyimi: Form eklendikten sonra ilk inputa geri dön
            document.getElementById('proj-name').focus();
        }
    });

    // Tabloya dinamik satır ekleyen fonksiyon
    function addProjectToTable(data) {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td><img src="${data['proj-img']}" alt="${data['proj-name']} thumbnail" class="project-thumb" loading="lazy"></td>
            <td><strong>${data['proj-name']}</strong></td>
            <td><a href="${data['proj-url']}" target="_blank" rel="noopener noreferrer" style="color: #2563eb; text-decoration: none; font-weight: 600;">View Repo</a></td>
            <td>${data['proj-date']}</td>
            <td><span style="background: #e2e8f0; padding: 0.3rem 0.6rem; border-radius: 4px; font-size: 0.85rem; font-weight: 600;">${data['proj-tech']}</span></td>
            <td>${data['proj-desc']}</td>
        `;

        // Satıra fade-in efekti vererek tabloya ekle
        row.style.opacity = '0';
        tableBody.appendChild(row);

        requestAnimationFrame(() => {
            row.style.transition = 'opacity 0.5s ease';
            row.style.opacity = '1';
        });
    }

    // Basit XSS koruma fonksiyonu
    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g,
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag])
        );
    }
});