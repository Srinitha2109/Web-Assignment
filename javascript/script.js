function generateCode() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let code = "";

  for (let i = 0; i < 3; i++) {
    code += letters[Math.floor(Math.random() * letters.length)];
  }
  for (let i = 0; i < 3; i++) {
    code += Math.floor(Math.random() * 10);
  }

  return code;
}

// Add days to a date
function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function calculateTotal(type, rate, duration) {
  const rules = {
    Hourly: rate * duration,
    Daily: rate * duration,
    Monthly: rate * duration
  };

  return rules[type];
}

  //  po creation

function createPO(trainer, training, payment) {
  const totalAmount = calculateTotal(
    payment.type,
    payment.rate,
    payment.duration
  );

  return {
    poNumber: generateCode(),
    trainer,
    training,
    payment,
    totalAmount
  };
}

  //  invoice generation 

function generateInvoice(po) {
  const today = new Date();
  const trainingEnd = new Date(po.training.endDate);

  if (today < trainingEnd) {
    console.log("Training not completed. Invoice blocked.");
    return null;
  }

  return {
    invoiceNumber: generateCode(),
    poReference: po.poNumber,
    trainerName: po.trainer.name,
    courseName: po.training.courseName,
    totalAmount: po.totalAmount,
    invoiceDate: today,
    dueDate: addDays(today, 30),
    status: "UNPAID"
  };
}


function checkOverdue(invoice) {
  const today = new Date();

  if (invoice.status === "UNPAID" && today > invoice.dueDate) {
    invoice.status = "OVERDUE";
    sendEmailAlert(invoice);
  }
}

function sendEmailAlert(invoice) {
  console.log("\n email alert to account team ");
  console.log(`Invoice No : ${invoice.invoiceNumber}`);
  console.log(`Amount Due: ₹${invoice.totalAmount}`);
  console.log("Status    : overdue \n");
}


// Trainer Info
const trainer = {
  name: "Sharath Kumar",
  email: "sharath@gmail.com",
  experience: "8 Years"
};

// Training Info
const training = {
  courseName: "Java Fullstack Training",
  clientName: "ABC Technologies",
  startDate: "2025-12-01",
  endDate: "2025-12-30"
};

// Payment Info
const payment = {
  type: "Monthly", 
  rate: 100000,
  duration: 5
};

// Create Purchase Order
const po = createPO(trainer, training, payment);
console.log("purchase order created");
console.log(po);

// Generate Invoice
const invoice = generateInvoice(po);

if (invoice) {
  console.log("\n Invoice generated");
  console.log(invoice);

  // Overdue Check
  checkOverdue(invoice);
}
