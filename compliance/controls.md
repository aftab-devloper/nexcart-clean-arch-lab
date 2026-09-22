# Compliance Controls Framework

## CTRL-01: Secrets Management
- **Control Statement:** The organization must ensure no hardcoded secrets, API keys, or credentials exist in the source code repository.
- **Evidence Provider:** Gitleaks (automated repository secrets scanner).
- **Pass/Fail Criteria:** Pass if Gitleaks scan reports 0 leaks found; Fail if any secret or credential pattern is detected.

## CTRL-02: Static Application Security Testing (SAST)
- **Control Statement:** Source code must undergo static analysis to identify potential software vulnerabilities and security anti-patterns.
- **Evidence Provider:** Semgrep (static analysis security scanner).
- **Pass/Fail Criteria:** Pass if Semgrep scan completes with zero blocking security findings or policy violations.

## CTRL-03: Dependency and Vulnerability Management
- **Control Statement:** Project dependencies and file systems must be scanned regularly for known vulnerabilities (CVEs).
- **Evidence Provider:** Trivy (filesystem and dependency scanner).
- **Pass/Fail Criteria:** Pass if Trivy scan reports zero CRITICAL vulnerabilities in project dependencies or filesystem.

## CTRL-04: Change Management and Code Review
- **Control Statement:** All code modifications must be reviewed and merged through pull requests with audit trails.
- **Evidence Provider:** Git commit history and GitHub PR merge history / branch protection.
- **Pass/Fail Criteria:** Pass if commits originate from reviewed branches and follow controlled workflow guidelines.
