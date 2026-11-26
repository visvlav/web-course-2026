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

let categories = [];
let transactions = [];

async function loadCategories() {
    categories = await getCategories();
    renderCategories(categories);
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

            const amount = prompt('Введите новую сумму:', transaction.amount);
            if (amount === null) return;

            const categoryId = prompt(
                'Введите ID категории:',
                transaction.category_id
            );
            if (categoryId === null) return;

            const date = prompt('Введите дату в формате ГГГГ-ММ-ДД:', transaction.date);
            if (date === null) return;

            const comment = prompt('Введите комментарий:', transaction.comment || '');
            if (comment === null) return;

            await updateTransaction(id, {
                amount: Number(amount),
                category_id: Number(categoryId),
                date,
                comment
            });

            await loadTransactions();
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