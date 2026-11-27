import {
    getCategories,
    getTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction
} from './api.js';

import {
    renderCategories,
    renderTransactions,
    renderSummary
} from './ui.js';

const form = document.querySelector('#transaction-form');
const amountInput = document.querySelector('#amount');
const categoryInput = document.querySelector('#category');
const dateInput = document.querySelector('#date');
const commentInput = document.querySelector('#comment');

const typeFilter = document.querySelector('#type-filter');
const categoryFilter = document.querySelector('#category-filter');
const fromFilter = document.querySelector('#from-filter');
const toFilter = document.querySelector('#to-filter');

const filterButton = document.querySelector('#filter-button');
const resetButton = document.querySelector('#reset-filters');
const transactionsList = document.querySelector('#transactions-list');
const editForm = document.querySelector('#edit-form');
const editAmountInput = document.querySelector('#edit-amount');
const editCategoryInput = document.querySelector('#edit-category');
const editDateInput = document.querySelector('#edit-date');
const editCommentInput = document.querySelector('#edit-comment');
const cancelEditButton = document.querySelector('#cancel-edit');

let editingTransactionId = null;
let categories = [];
let transactions = [];

async function loadCategories() {
    categories = await getCategories();

    renderCategories(categories);

    editCategoryInput.innerHTML = categories
        .map(category => `
            <option value="${category.id}">
                ${category.name}
            </option>
        `)
        .join('');
}

async function loadTransactions() {
    const filters = {
        type: typeFilter.value,
        category_id: categoryFilter.value,
        from: fromFilter.value,
        to: toFilter.value
    };

    transactions = await getTransactions(filters);

    renderTransactions(transactions);
    renderSummary(transactions);
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    try {
        const transaction = {
            amount: Number(amountInput.value),
            category_id: Number(categoryInput.value),
            date: dateInput.value,
            comment: commentInput.value
        };

        await createTransaction(transaction);

        form.reset();
        await loadTransactions();
    } catch (error) {
        alert(error.message);
    }
});
cancelEditButton.addEventListener('click', () => {
    editForm.hidden = true;
    editingTransactionId = null;
});
editForm.addEventListener('submit', async (event) => {
    event.preventDefault();
if (!amountInput.value || Number(amountInput.value) <= 0) {
    alert('Введите сумму больше нуля');
    return;
}

if (!categoryInput.value) {
    alert('Выберите категорию');
    return;
}

if (!dateInput.value) {
    alert('Укажите дату операции');
    return;
}
    try {
        if (!editAmountInput.value || Number(editAmountInput.value) <= 0) {
    alert('Введите сумму больше нуля');
    return;
}

if (!editCategoryInput.value) {
    alert('Выберите категорию');
    return;
}

if (!editDateInput.value) {
    alert('Укажите дату операции');
    return;
}
        const updatedTransaction = {
            amount: Number(editAmountInput.value),
            category_id: Number(editCategoryInput.value),
            date: editDateInput.value,
            comment: editCommentInput.value
        };

       console.log('ID редактируемой операции:', editingTransactionId);

if (!Number.isInteger(editingTransactionId) || editingTransactionId <= 0) {
    alert('Ошибка: ID операции не определён');
    return;
}

await updateTransaction(editingTransactionId, updatedTransaction);

        editForm.hidden = true;
        editingTransactionId = null;

        await loadTransactions();
    } catch (error) {
        alert(error.message);
    }
});
filterButton.addEventListener('click', async () => {
    try {
        await loadTransactions();
    } catch (error) {
        alert(error.message);
    }
});

resetButton.addEventListener('click', async () => {
    typeFilter.value = '';
    categoryFilter.value = '';
    fromFilter.value = '';
    toFilter.value = '';

    try {
        await loadTransactions();
    } catch (error) {
        alert(error.message);
    }
});
function openEditForm(transaction) {
    editingTransactionId = transaction.id;

    editAmountInput.value = transaction.amount;
    editCategoryInput.value = transaction.category_id;
    editDateInput.value = transaction.date;
    editCommentInput.value = transaction.comment || '';

    editForm.hidden = false;

    editForm.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
    });
}
transactionsList.addEventListener('click', async (event) => {
    const button = event.target.closest('button');

    if (!button) {
        return;
    }

    const id = Number(button.dataset.id);
    const action = button.dataset.action;

    try {
        if (action === 'delete') {
            await deleteTransaction(id);
            await loadTransactions();
        }

        if (action === 'edit') {
    const transaction = transactions.find(item => item.id === id);

    if (!transaction) {
        return;
    }

    openEditForm(transaction);
}
    } catch (error) {
        alert(error.message);
    }
});

async function init() {
    try {
        dateInput.value = new Date().toISOString().slice(0, 10);

        await loadCategories();
        await loadTransactions();
    } catch (error) {
        alert(error.message);
    }
}

init();
