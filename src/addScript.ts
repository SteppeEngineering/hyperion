// src/addScript.ts
if (Deno.args.length < 2) {
  console.error("Please provide two numbers to add.");
  Deno.exit(1);
}

const num1 = parseFloat(Deno.args[0]);
const num2 = parseFloat(Deno.args[1]);

if (isNaN(num1) || isNaN(num2)) {
   console.error("Both arguments must be valid numbers.");
   Deno.exit(1);
}

const sum = num1 + num2;
console.log(`The sum of ${num1} and ${num2} is ${sum}.`);
