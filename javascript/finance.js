
class FinancialAccount {
    constructor(accountNumber, accountHolder, balance = 0) {
        this.accountNumber = accountNumber;
        this.accountHolder = accountHolder;
        this._balance = balance;
        this.transactions = [];
        this.createdDate = new Date();
    }

    get balance() {
        return this._balance;
    }

    deposit(amount, description = "Deposit") {
        if (amount <= 0) throw new Error("Deposit must be positive");
        this._balance += amount;
        this._recordTransaction(amount, "credit", description);
    }

    withdraw(amount, description = "Withdrawal") {
        if (amount <= 0) throw new Error("Withdrawal must be positive");
        if (amount > this._balance) throw new Error("Insufficient funds");
        this._balance -= amount;
        this._recordTransaction(amount, "debit", description);
    }

    _recordTransaction(amount, type, description) {
        this.transactions.push({
           accountNumber: this.accountNumber,
            date: new Date(),
            amount,
            type,
            description,
            balanceAfter: this._balance
        });
    }

    displayInfo() {
        return {
            accountNumber: this.accountNumber,
            accountHolder: this.accountHolder,
            accountType: this.constructor.name,
            balance: this.balance.toFixed(2)
        };
    }
}

//savings account
class SavingsAccount extends FinancialAccount {
    constructor(accountNumber, accountHolder, balance, interestRate = 0.03) {
        super(accountNumber, accountHolder, balance);
        this.interestRate = interestRate;
        this.minimumBalance = 100;
    }

    withdraw(amount, description = "Savings Withdrawal") {
        if (this._balance - amount < this.minimumBalance) {
            throw new Error("Minimum balance violation");
        }
        super.withdraw(amount, description);
    }

    calculateInterest() {
        return (this._balance * this.interestRate) / 12;
    }
}

//checking account
class CheckingAccount extends FinancialAccount {
    constructor(accountNumber, accountHolder, balance, overdraftLimit = 500) {
        super(accountNumber, accountHolder, balance);
        this.overdraftLimit = overdraftLimit;
    }

    withdraw(amount, description = "Checking Withdrawal") {
        if (amount > this._balance + this.overdraftLimit) {
            throw new Error("Overdraft limit exceeded");
        }
        this._balance -= amount;
        this._recordTransaction(amount, "debit", description);
    }
}

//investment account
class InvestmentAccount extends SavingsAccount {
    constructor(accountNumber, accountHolder, balance, interestRate, riskLevel) {
        super(accountNumber, accountHolder, balance, interestRate);
        this.riskLevel = riskLevel;
        this.investments = [];
    }

    addInvestment(name, amount) {
        this.withdraw(amount, `Investment in ${name}`);
        this.investments.push({
            name,
            amount,
            date: new Date()
        });
    }
}

// adding insurance 
class Insurance {
    constructor(accountNumber,type, coverageAmount, premium) {
        this.accountNumber = accountNumber;
        this.type = type;
        this.coverageAmount = coverageAmount;
        this.premium = premium;
        this.startDate = new Date();
    }
}

class Bank {
    constructor(name) {
        this.name = name;
        this.accounts = [];
        this.insurances = new Map(); 
    }

    openAccount(type, ...args) {
        let acc;
        if (type === "savings") acc = new SavingsAccount(...args);
        else if (type === "checking") acc = new CheckingAccount(...args);
        else if (type === "investment") acc = new InvestmentAccount(...args);
        else throw new Error("Invalid account type");

        this.accounts.push(acc);
        return acc;
    }

    // get all account details
    getAllAccounts() {
        return this.accounts.map(acc => acc.displayInfo());
    }

    // get transactions by account number
    getTransactions(accountNumber) {
        const acc = this.accounts.find(a => a.accountNumber === accountNumber);
        if (!acc) throw new Error("Account not found");
        return acc.transactions;
    }

    // add insurance (one per customer)
   addInsurance(accountNumber, type, coverage, premium) {
    const acc = this.accounts.find(a => a.accountNumber === accountNumber);
    if (!acc) throw new Error("Account not found");

    if (this.insurances.has(acc.accountHolder)) {
        throw new Error("Insurance already exists for this customer");
    }

    const insurance = new Insurance(accountNumber, type, coverage, premium);
    this.insurances.set(acc.accountHolder, insurance);
    return insurance;
  }


    getInsurance(accountHolder) {
        return this.insurances.get(accountHolder);
    }
}


class FinancialSystemDemo {
    static run() {
        const bank = new Bank("Global Finance Bank");

        // Create accounts
        bank.openAccount("savings", "SAV001", "John Doe", 5000, 0.03);
        bank.openAccount("checking", "CHK001", "John Doe", 2000, 1000);
        bank.openAccount("investment", "INV001", "Jane Smith", 10000, 0.05, "High");
        bank.openAccount("savings", "SAV002", "Alice Brown", 8000, 0.04);
        bank.openAccount("checking", "CHK002", "Bob Green", 1500, 500);
        bank.openAccount("investment", "INV002", "Charlie White", 12000, 0.06, "Medium");

        console.log("\n All account details");
        console.table(bank.getAllAccounts());

        // Transactions
        bank.accounts[0].deposit(1000, "Salary");
        bank.accounts[0].withdraw(500, "Shopping");
        bank.accounts[1].withdraw(2500);
        bank.accounts[2].addInvestment("Stocks", 3000);
        bank.accounts[2].addInvestment("Mutual Funds", 2000);
        bank.accounts[3].deposit(2000, "Bonus");
        bank.accounts[3].withdraw(1000, "Rent Payment");
        bank.accounts[4].deposit(500, "Freelance Payment");
        bank.accounts[4].withdraw(1000, "Car Repair");
        bank.accounts[5].addInvestment("Bonds", 4000);
        bank.accounts[5].addInvestment("ETF", 2500);

        // Show transactions for an account
        console.log("\n Transactions for particular account ");
        console.table(bank.getTransactions("INV001"));

        // Add insurance
        console.log("\n Adding Insurance");
        console.table([
            bank.addInsurance("SAV001", "Health Insurance", 500000, 5000),
            bank.addInsurance("INV001", "Life Insurance", 1000000, 7000)
        ]);

        // adding duplicate insurance
        try {
            bank.addInsurance("SAV001", "Life Insurance", 1000000, 7000);
        } catch (e) {
            console.log("ERROR:", e.message);
        }
    }
}

//function call
FinancialSystemDemo.run();
