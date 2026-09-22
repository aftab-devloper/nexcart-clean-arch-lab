# AI Security: Indirect Prompt Injection Demo

This demo illustrates indirect prompt injection risks in AI coding agents where untrusted external inputs (like GitHub issues or PR descriptions) manipulate agent behavior.
- **Concepts Learned:** Instruction/data separation, untrusted boundary encapsulation, and pattern-based sanitization.
- **Reference:** OWASP Top 10 for Large Language Models (LLM01: Prompt Injection).
- **Execution:** Run `node ai-security/vulnerable-agent-sim.js` and `node ai-security/defended-agent-sim.js`.
