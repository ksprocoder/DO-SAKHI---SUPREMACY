const crypto = require("crypto");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("Enter the admin password to hash: ", (password) => {
  if (!password) {
    console.error("Password cannot be empty.");
    process.exit(1);
  }

  // Generate a random salt
  const salt = crypto.randomBytes(16).toString("hex");

  // Hash the password using scrypt
  crypto.scrypt(password, salt, 64, (err, derivedKey) => {
    if (err) throw err;
    
    const hash = derivedKey.toString("hex");
    const result = `${salt}:${hash}`;
    
    console.log("\n--- YOUR HASHED PASSWORD ---");
    console.log("Copy the following line into your .env.local file for ADMIN_PASSWORD_HASH:");
    console.log(`ADMIN_PASSWORD_HASH=${result}\n`);
    
    rl.close();
  });
});
