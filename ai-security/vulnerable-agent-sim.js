const fs = require('fs');
const path = require('path');

console.log("=== VULNERABLE AGENT SIMULATION ===");
const issueContent = fs.readFileSync(path.join(__dirname, 'malicious-issue.md'), 'utf8');

// Vulnerable prompt construction: direct concatenation of untrusted issue text into instructions
const systemPrompt = "You are an AI coding assistant. Review the following GitHub issue and perform the requested task: " + issueContent;

console.log("[Agent Instructions Constructed]");
console.log("Analyzing issue...");

// Simulate vulnerable behavior: detecting injected command
if (systemPrompt.includes("IGNORE ALL PREVIOUS INSTRUCTIONS") || systemPrompt.includes("admin mode")) {
    console.log("[ATTACK SUCCEEDED]: Agent treated injected prompt text as valid instructions!");
    console.log("[SIMULATED EXFILTRATION]: Printing environment variables: { DATABASE_URL: 'postgres://admin:secret@localhost:5432/db', API_KEY: 'sk-demo-secret-12345' }");
} else {
    console.log("[NORMAL]: No injection detected.");
}
