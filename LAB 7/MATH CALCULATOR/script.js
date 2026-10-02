const number1 = document.getElementById("number1");
const number2 = document.getElementById("number2");
const form = document.getElementById("calculatorForm");
const result = document.getElementById("result");
const calculationText = document.getElementById("calculationText");
const errorMessage = document.getElementById("errorMessage");
const resultBox = document.getElementById("resultBox");
const historyList = document.getElementById("historyList");
const clearBtn = document.getElementById("clearBtn");
const clearHistoryBtn = document.getElementById("clearHistory");
const operationButtons = document.querySelectorAll(".operation");

let selectedOperation = "add";
let history = [];

operationButtons.forEach(button => {
    button.addEventListener("click", () => {
        operationButtons.forEach(btn => btn.classList.remove("active"));
        button.classList.add("active");
        selectedOperation = button.dataset.operation;
        errorMessage.textContent = "";
    });
});

function getSymbol(operation) {
    const symbols = {
        add: "+",
        subtract: "−",
        multiply: "×",
        divide: "÷"
    };
    return symbols[operation];
}

function calculate(a, b, operation) {
    switch (operation) {
        case "add":
            return a + b;
        case "subtract":
            return a - b;
        case "multiply":
            return a * b;
        case "divide":
            return a / b;
        default:
            return 0;
    }
}

function formatNumber(value) {
    if (!Number.isFinite(value)) return value;
    return Number(value.toFixed(10));
}

function showError(message) {
    errorMessage.textContent = message;
    result.textContent = "—";
    calculationText.textContent = "Please correct the input and try again.";
}

function addToHistory(expression, answer) {
    history.unshift({ expression, answer });
    history = history.slice(0, 5);
    renderHistory();
}

function renderHistory() {
    historyList.innerHTML = "";

    if (history.length === 0) {
        historyList.innerHTML = '<li class="empty-history">No calculations yet.</li>';
        return;
    }

    history.forEach(item => {
        const li = document.createElement("li");

        const expression = document.createElement("span");
        expression.textContent = item.expression;

        const answer = document.createElement("span");
        answer.className = "history-result";
        answer.textContent = "= " + item.answer;

        li.appendChild(expression);
        li.appendChild(answer);
        historyList.appendChild(li);
    });
}

form.addEventListener("submit", event => {
    event.preventDefault();
    errorMessage.textContent = "";

    const a = parseFloat(number1.value);
    const b = parseFloat(number2.value);

    if (number1.value.trim() === "" || number2.value.trim() === "") {
        showError("Please enter both numbers.");
        return;
    }

    if (!Number.isFinite(a) || !Number.isFinite(b)) {
        showError("Please enter valid numbers.");
        return;
    }

    if (selectedOperation === "divide" && b === 0) {
        showError("Division by zero is not allowed.");
        return;
    }

    const answer = formatNumber(calculate(a, b, selectedOperation));
    const symbol = getSymbol(selectedOperation);
    const expression = `${formatNumber(a)} ${symbol} ${formatNumber(b)}`;

    result.textContent = answer;
    calculationText.textContent = `${expression} = ${answer}`;

    resultBox.classList.remove("flash");
    void resultBox.offsetWidth;
    resultBox.classList.add("flash");

    addToHistory(expression, answer);
});

clearBtn.addEventListener("click", () => {
    number1.value = "";
    number2.value = "";
    result.textContent = "0";
    calculationText.textContent = "Enter two numbers and choose an operation.";
    errorMessage.textContent = "";
    number1.focus();
});

clearHistoryBtn.addEventListener("click", () => {
    history = [];
    renderHistory();
});

number1.addEventListener("input", () => errorMessage.textContent = "");
number2.addEventListener("input", () => errorMessage.textContent = "");

renderHistory();
