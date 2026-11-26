export function renderCategories(categories) {
    const categorySelect = document.querySelector('#category');
    const categoryFilter = document.querySelector('#category-filter');

    categorySelect.innerHTML = '';
    categoryFilter.innerHTML = '<option value="">Все категории</option>';

    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.append(option);

        const filterOption = document.createElement('option');
        filterOption.value = category.id;
        filterOption.textContent = category.name;
        categoryFilter.append(filterOption);
    });
}

export function renderTransactions(transactions) {
    const list = document.querySelector('#transactions-list');
    list.innerHTML = '';

    if (transactions.length === 0) {
        list.textContent = 'Операций пока нет';
        return;
    }

    transactions.forEach(transaction => {
        const item = document.createElement('article');

        const title = document.createElement('h3');
        title.textContent = transaction.category_name;

        const amount = document.createElement('p');
        amount.textContent = `Сумма: ${transaction.amount}`;

        const date = document.createElement('p');
        date.textContent = `Дата: ${transaction.date}`;

        const comment = document.createElement('p');
        comment.textContent = transaction.comment || 'Без комментария';

        const editButton = document.createElement('button');
        editButton.textContent = 'Изменить';
        editButton.dataset.action = 'edit';
        editButton.dataset.id = transaction.id;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Удалить';
        deleteButton.dataset.action = 'delete';
        deleteButton.dataset.id = transaction.id;

        item.append(title, amount, date, comment, editButton, deleteButton);
        list.append(item);
    });
}

export function renderSummary(transactions) {
    const summary = document.querySelector('#summary');

    const income = transactions
        .filter(transaction => transaction.type === 'income')
        .reduce((sum, transaction) => sum + transaction.amount, 0);

    const expenses = transactions
        .filter(transaction => transaction.type === 'expense')
        .reduce((sum, transaction) => sum + transaction.amount, 0);

    summary.textContent =
        `Доходы: ${income.toFixed(2)} | Расходы: ${expenses.toFixed(2)} | Баланс: ${(income - expenses).toFixed(2)}`;
}
