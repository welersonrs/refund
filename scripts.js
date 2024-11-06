const form = document.querySelector("form")
const amount = document.getElementById("amount")
const expense = document.getElementById("expense")
const category = document.getElementById("category")
const totalExpense = document.querySelector("aside header p span")
const totalAmountExpense = document.querySelector("aside header h2")

//Select elements from the list
const expenseList = document.querySelector("ul")

//input amount
amount.oninput = () => {
    let formattedValue = amount.value.replace(/\D/g, "")

    //convert to cents
    formattedValue = Number(formattedValue) / 100

    amount.value = formatCurrencyBRL(formattedValue)
}

function formatCurrencyBRL(value) {
    return value.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    })
}

//expense
form.onsubmit = (event) => {
    event.preventDefault()

    const newExpense = {
        id: new Date().getTime(),
        expense: expense.value,
        category_id: category.value,
        category_name: category.options[category.selectedIndex].text,
        amount: amount.value,
        created_at: new Date()
    }

    addExpense(newExpense)
}

function addExpense(newExpense) {
    try {
        //create expense element
        const expenseItem = document.createElement("li")
        expenseItem.classList.add("expense")
        
        //create category icon
        const expenseIcon = document.createElement("img")
        expenseIcon.setAttribute("src", `./img/${newExpense.category_id}.svg`)
        expenseIcon.setAttribute("alt", newExpense.category_name)

        //create expense description
        const expenseInfo = document.createElement("div")
        expenseInfo.classList.add("expense-info")

        //create expense info
        const expenseName = document.createElement("strong")
        const expenseCategory = document.createElement("span")

        //add elements in the div
        expenseName.textContent = newExpense.expense
        expenseCategory.textContent = newExpense.category_name

        expenseInfo.append(expenseName, expenseCategory)

        //create expense amount
        const expenseAmount = document.createElement("span")
        expenseAmount.classList.add("expense-amount")
        expenseAmount.innerHTML = `<small>R$</small>${newExpense.amount
            .toUpperCase()
            .replace("R$", "")}`

        //create remove icon
        const expenseRemove = document.createElement("img")
        expenseRemove.classList.add("remove-icon")
        expenseRemove.setAttribute("src", "./img/remove.svg")
        expenseRemove.setAttribute("alt", "remover")
        
        //add an infos in the item
        expenseItem.append(expenseIcon, expenseInfo, expenseAmount, expenseRemove)

        //add items in the list
        expenseList.append(expenseItem)
        updateTotalExpenses()
        formClear()

    } catch (error) {
        alert("Não foi possível atualizar a lista de despesas.")
        console.log(error)
    }
}

function updateTotalExpenses() {
    try {
        const items = expenseList.children
        totalExpense.textContent = `${items.length} ${
            items.length > 1 ? "despesas" : "despesa"
        }`

        let total = 0

        for(let item = 0; item < items.length; item++) {
            const itemAmount = items[item].querySelector(".expense-amount")
            
            let value = itemAmount.textContent.replace(/[^\d,]/g, "").replace(",", ".")
            value = parseFloat(value)

            if(isNaN(value)) {
                return alert("Não foi possível calcular o total. O valor pode não ser um número.")
            }

            total += value
        }

        //span to format currency symbol
        const symbolBRL = document.createElement("small")
        symbolBRL.textContent = "R$"

        // format value and remove the R$
        total = formatCurrencyBRL(total).toUpperCase().replace("R$", "")

        //clean element value
        totalAmountExpense.innerHTML = ""
        totalAmountExpense.append(symbolBRL, total)

    } catch (error) {
        console.log(error)
        alert("Não foi possível atualizar o total de despesas.")
    }
}

//event to get click on the list
expenseList.addEventListener("click", function (event) {
    if(event.target.classList.contains("remove-icon")) {
        const item = event.target.closest(".expense")
        item.remove()
    }

    updateTotalExpenses()
})

function formClear() {
    expense.value = ""
    category.value = ""
    amount.value = ""

    expense.focus()
}