# i2p_fall25

An AI-powered security testing tool for Model Context Protocol (MCP) implementations.  
It helps developers find vulnerabilities in MCP servers before deployment.

## What It Does
- Tests authentication/authorization (token misuse, replay)
- Fuzzes input validation (SQLi, XSS, injection)
- Checks connection security (TLS misconfig, replay attacks)
- (Planned) Generates novel attack cases with AI and adaptive learning
- (Planned) Produces developer-focused reports with exploit PoCs and remediation guidance

## Current Status
- Built an MCP client
- Successfully connected to a test MCP server
- Verified sending requests and receiving responses

## Next Steps
- Add authentication tests and basic fuzzing
- Begin integrating AI-driven payload generation and reporting