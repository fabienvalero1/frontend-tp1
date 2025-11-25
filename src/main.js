// src/main.js
document.addEventListener('DOMContentLoaded', () => {
    const users = generateUsers();
    const table = document.getElementById('userTable');
    const tbody = table.querySelector('tbody');
    const globalInput = document.getElementById('filterInput');

    createColumnFilters(table);
    renderTable(users, tbody);

    const filters = {
        name: '',
        age: '',
        email: '',
        global: ''
    };

    // Hook inputs
    table.querySelectorAll('thead tr.filter-row input').forEach(input => {
        input.addEventListener('input', () => {
            filters[input.dataset.field] = input.value.trim();
            applyFilters();
        });
    });

    globalInput.addEventListener('input', (e) => {
        filters.global = e.target.value.trim();
        applyFilters();
    });

    function applyFilters() {
        const filtered = users.filter(u => {
            // Column filters
            if (!matchText(u.name, filters.name)) return false;
            if (!matchAge(u.age, filters.age)) return false;
            if (!matchText(u.email, filters.email)) return false;
            // Global filter: if provided, must match at least one column
            if (filters.global) {
                const term = filters.global.toLowerCase();
                const any =
                    u.name.toLowerCase().includes(term) ||
                    String(u.age).includes(term) ||
                    u.email.toLowerCase().includes(term);
                if (!any) return false;
            }
            return true;
        });

        renderTable(filtered, tbody);
    }

    // Helpers
    function matchText(value, pattern) {
        if (!pattern) return true;
        return value.toLowerCase().includes(pattern.toLowerCase());
    }

    // Age filter supports:
    // - empty -> match all
    // - "30" -> exact numeric match
    // - "25-35" -> inclusive range
    // - "3" -> substring match if not a clear integer
    function matchAge(ageValue, pattern) {
        if (!pattern) return true;
        const p = pattern.trim();
        if (p.includes('-')) {
            const [a, b] = p.split('-').map(s => parseInt(s.trim(), 10));
            if (!Number.isNaN(a) && !Number.isNaN(b)) {
                return ageValue >= a && ageValue <= b;
            }
            return String(ageValue).includes(p);
        }
        const num = parseInt(p, 10);
        if (!Number.isNaN(num) && String(num) === p) {
            return ageValue === num;
        }
        return String(ageValue).includes(p);
    }

    function renderTable(data, tbodyEl) {
        tbodyEl.innerHTML = '';
        if (data.length === 0) {
            const tr = document.createElement('tr');
            const td = document.createElement('td');
            td.colSpan = 3;
            td.textContent = 'Aucun résultat';
            td.style.textAlign = 'center';
            tr.appendChild(td);
            tbodyEl.appendChild(tr);
            return;
        }
        const frag = document.createDocumentFragment();
        data.forEach(u => {
            const tr = document.createElement('tr');
            const tdName = document.createElement('td');
            tdName.textContent = u.name;
            const tdAge = document.createElement('td');
            tdAge.textContent = u.age;
            const tdEmail = document.createElement('td');
            tdEmail.textContent = u.email;
            tr.appendChild(tdName);
            tr.appendChild(tdAge);
            tr.appendChild(tdEmail);
            frag.appendChild(tr);
        });
        tbodyEl.appendChild(frag);
    }

    function createColumnFilters(tableEl) {
        const thead = tableEl.querySelector('thead');
        // remove any existing filter row
        const existing = thead.querySelector('tr.filter-row');
        if (existing) existing.remove();

        const filterRow = document.createElement('tr');
        filterRow.className = 'filter-row';

        const fields = [
            { placeholder: 'Filtrer Nom', field: 'name' },
            { placeholder: 'Filtrer Âge (ex: 30 ou 20-40)', field: 'age' },
            { placeholder: 'Filtrer Email', field: 'email' }
        ];

        fields.forEach(f => {
            const th = document.createElement('th');
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = f.placeholder;
            input.dataset.field = f.field;
            input.style.width = '95%';
            input.style.boxSizing = 'border-box';
            th.appendChild(input);
            filterRow.appendChild(th);
        });

        thead.appendChild(filterRow);
    }

    function generateUsers() {
        return [
            { name: 'Alice Martin', age: 28, email: 'alice.martin@example.com' },
            { name: 'Bruno Dupont', age: 34, email: 'bruno.dupont@example.com' },
            { name: 'Camille Durand', age: 22, email: 'camille.durand@example.com' },
            { name: 'David Bernard', age: 45, email: 'david.bernard@example.com' },
            { name: 'Élodie Moreau', age: 31, email: 'elodie.moreau@example.com' },
            { name: 'Fabien Valero', age: 29, email: 'fabien.valero@example.com' },
            { name: 'Géraldine Petit', age: 27, email: 'geraldine.petit@example.com' },
            { name: 'Hugo Lefevre', age: 38, email: 'hugo.lefevre@example.com' },
            { name: 'Isabelle Roux', age: 41, email: 'isabelle.roux@example.com' },
            { name: 'Julien Garnier', age: 24, email: 'julien.garnier@example.com' },
            { name: 'Karim Nasser', age: 33, email: 'karim.nasser@example.com' },
            { name: 'Laura Fontaine', age: 26, email: 'laura.fontaine@example.com' },
            { name: 'Marc Lemaire', age: 50, email: 'marc.lemaire@example.com' },
            { name: 'Nadia Roy', age: 36, email: 'nadia.roy@example.com' },
            { name: 'Olivier Marchand', age: 42, email: 'olivier.marchand@example.com' },
            { name: 'Pauline Mercier', age: 23, email: 'pauline.mercier@example.com' },
            { name: 'Quentin Faure', age: 30, email: 'quentin.faure@example.com' },
            { name: 'Rachid Kamel', age: 35, email: 'rachid.kamel@example.com' },
            { name: 'Sophie Gilbert', age: 39, email: 'sophie.gilbert@example.com' },
            { name: 'Théo Renaud', age: 21, email: 'theo.renaud@example.com' }
        ];
    }
});
