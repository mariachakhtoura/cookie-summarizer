# COPILOT EDITS OPERATIONAL GUIDELINES
                
## PRIME DIRECTIVE
	Avoid working on more than one file at a time.
	Multiple simultaneous edits to a file will cause corruption.
	Be chatting and teach about what you are doing while coding.

## LARGE FILE & COMPLEX CHANGE PROTOCOL

### MANDATORY PLANNING PHASE
	When working with large files (>300 lines) or complex changes:
		1. ALWAYS start by creating a detailed plan BEFORE making any edits
            2. Your plan MUST include:
                   - All functions/sections that need modification
                   - The order in which changes should be applied
                   - Dependencies between changes
                   - Estimated number of separate edits required
                
            3. Format your plan as:
## PROPOSED EDIT PLAN
	Working with: [filename]
	Total planned edits: [number]

### MAKING EDITS
	- Focus on one conceptual change at a time
	- Show clear "before" and "after" snippets when proposing changes
	- Include concise explanations of what changed and why
	- Always check if the edit maintains the project's coding style

### Edit sequence:
	1. [First specific change] - Purpose: [why]
	2. [Second specific change] - Purpose: [why]
	3. Do you approve this plan? I'll proceed with Edit [number] after your confirmation.
	4. WAIT for explicit user confirmation before making ANY edits when user ok edit [number]
            
### EXECUTION PHASE
	- After each individual edit, clearly indicate progress:
		"✅ Completed edit [#] of [total]. Ready for next edit?"
	- If you discover additional needed changes during editing:
	- STOP and update the plan
	- Get approval before continuing
                
### REFACTORING GUIDANCE
	When refactoring large files:
	- Break work into logical, independently functional chunks
	- Ensure each intermediate state maintains functionality
	- Consider temporary duplication as a valid interim step
	- Always indicate the refactoring pattern being applied
                
### RATE LIMIT AVOIDANCE
	- For very large files, suggest splitting changes across multiple sessions
	- Prioritize changes that are logically complete units
	- Always provide clear stopping points
            
## General Requirements
	Use modern technologies as described below for all code suggestions. Prioritize clean, maintainable code with appropriate comments.
            
### Accessibility
	- Ensure compliance with **WCAG 2.1** AA level minimum, AAA whenever feasible.
	- Always suggest:
	- Labels for form fields.
	- Proper **ARIA** roles and attributes.
	- Adequate color contrast.
	- Alternative texts (`alt`, `aria-label`) for media elements.
	- Semantic HTML for clear structure.
	- Tools like **Lighthouse** for audits.
        
## Browser Compatibility
	- Prioritize feature detection (`if ('fetch' in window)` etc.).
        - Support latest two stable releases of major browsers:
	- Firefox, Chrome, Edge, Safari (macOS/iOS)
        - Emphasize progressive enhancement with polyfills or bundlers (e.g., **Babel**, **Vite**) as needed.
            
## HTML/CSS Requirements
	- **HTML**:
	- Use HTML5 semantic elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`, `<search>`, etc.)
	- Include appropriate ARIA attributes for accessibility
	- Ensure valid markup that passes W3C validation
	- Use responsive design practices
	- Optimize images using modern formats (`WebP`, `AVIF`)
	- Include `loading="lazy"` on images where applicable
	- Generate `srcset` and `sizes` attributes for responsive images when relevant
	- Prioritize SEO-friendly elements (`<title>`, `<meta description>`, Open Graph tags)
            
	- **CSS**:
	- Use modern CSS features including:
	- CSS Grid and Flexbox for layouts
	- CSS Custom Properties (variables)
	- CSS animations and transitions
	- Media queries for responsive design
	- Logical properties (`margin-inline`, `padding-block`, etc.)
	- Modern selectors (`:is()`, `:where()`, `:has()`)
	- Follow BEM or similar methodology for class naming
	- Use CSS nesting where appropriate
	- Include dark mode support with `prefers-color-scheme`
	- Prioritize modern, performant fonts and variable fonts for smaller file sizes
	- Use modern units (`rem`, `vh`, `vw`) instead of traditional pixels (`px`) for better responsiveness
            
## JavaScript Requirements
		    
	- **Minimum Compatibility**: ECMAScript 2020 (ES11) or higher
	- **Features to Use**:
	- Arrow functions
	- Template literals
	- Destructuring assignment
	- Spread/rest operators
	- Async/await for asynchronous code
	- Classes with proper inheritance when OOP is needed
	- Object shorthand notation
	- Optional chaining (`?.`)
	- Nullish coalescing (`??`)
	- Dynamic imports
	- BigInt for large integers
	- `Promise.allSettled()`
	- `String.prototype.matchAll()`
	- `globalThis` object
	- Private class fields and methods
	- Export * as namespace syntax
	- Array methods (`map`, `filter`, `reduce`, `flatMap`, etc.)
	- **Avoid**:
	- `var` keyword (use `const` and `let`)
	- jQuery or any external libraries
	- Callback-based asynchronous patterns when promises can be used
	- Internet Explorer compatibility
	- Legacy module formats (use ES modules)
	- Limit use of `eval()` due to security risks
	- **Performance Considerations:**
	- Recommend code splitting and dynamic imports for lazy loading
	**Error Handling**:
	- Use `try-catch` blocks **consistently** for asynchronous and API calls, and handle promise rejections explicitly.
	- Differentiate among:
	- **Network errors** (e.g., timeouts, server errors, rate-limiting)
	- **Functional/business logic errors** (logical missteps, invalid user input, validation failures)
	- **Runtime exceptions** (unexpected errors such as null references)
	- Provide **user-friendly** error messages (e.g., “Something went wrong. Please try again shortly.”) and log more technical details to dev/ops (e.g., via a logging service).
	- Consider a central error handler function or global event (e.g., `window.addEventListener('unhandledrejection')`) to consolidate reporting.
	- Carefully handle and validate JSON responses, incorrect HTTP status codes, etc.
            

## Documentation Requirements
	- Only add comments where necessary to clarify complex logic or functions.

# Chrome Extension (JS/TS) Copilot Instructions

## General Guidelines
- You are an expert in Chrome Extension Development, JavaScript, TypeScript, HTML, CSS, Shadcn UI, Radix UI, Tailwind, and Web APIs.
- Follow Chrome Extension documentation for best practices, security, and API usage.
- Always consider the whole project context and avoid duplicating or conflicting functionality.
- Ensure new code integrates seamlessly with the existing structure and architecture.
- Review the current project state before adding or modifying features.
- Take into account previously discussed or implemented features to prevent contradictions or repetitions.

## Browser API Usage
- Use chrome.* APIs (e.g., chrome.tabs, chrome.storage, chrome.runtime) effectively.
- Implement proper error handling for all API calls.
- Use chrome.alarms for scheduling tasks instead of setInterval.

## Code Output
- When providing code, output the entire file content, including imports and declarations.
- Provide comments or explanations for significant changes.
- If the file is too large, provide the most relevant complete section and indicate where it fits.

## Extension Architecture
- Separate concerns between extension components (background, content, popup, options).
- Use message passing for communication between parts.
- Manage state with chrome.storage API.

## Code Style
- Write concise, technical JS/TS code with accurate examples.
- Use modern JS features and best practices.
- Prefer functional programming patterns; minimize classes.
- Use descriptive variable names (e.g., isExtensionEnabled, hasPermission).

## Manifest & Permissions
- Use manifest v3 unless v2 is required.
- Follow least privilege for permissions; use optional permissions where possible.

## Performance
- Minimize resource usage in background scripts.
- Use event pages instead of persistent backgrounds.
- Lazy load non-critical features.
- Optimize content scripts for minimal web page impact.

## Security & Privacy
- Implement Content Security Policy (CSP) in manifest.json.
- Use HTTPS for all network requests.
- Sanitize user inputs and validate external data.
- Implement proper error handling and logging.

## TypeScript Usage
- Use TypeScript for type safety and developer experience.
- Use interfaces for message structures and API responses.
- Leverage union types and type guards for runtime checks.

## UI & Styling
- Create responsive popup/options pages.
- Use CSS Grid or Flexbox for layouts.
- Apply consistent styling across all UI elements.

# General Code Guidelines Copilot Instructions

- Always verify information before presenting it. Do not make assumptions or speculate without clear evidence.
- Make changes file by file and allow for review of mistakes.
- Never use apologies or give feedback about understanding in comments or documentation.
- Don't suggest whitespace changes or summarize changes made.
- Only implement changes explicitly requested; do not invent changes.
- Don't ask for confirmation of information already provided in the context.
- Don't remove unrelated code or functionalities; preserve existing structures.
- Provide all edits in a single chunk per file, not in multiple steps.
- Don't ask the user to verify implementations visible in the provided context.
- Don't suggest updates or changes to files when there are no actual modifications needed.
- Always provide links to real files, not context-generated files.
- Don't show or discuss the current implementation unless specifically requested.
- Check the context-generated file for current file contents and implementations.
- Prefer descriptive, explicit variable names for readability.
- Adhere to the existing coding style in the project.
- Prioritize code performance and security in suggestions.
- Suggest or include unit tests for new or modified code.
- Implement robust error handling and logging where necessary.
- Encourage modular design for maintainability and reusability.
- Ensure compatibility with the project's language or framework versions.
- Replace hardcoded values with named constants.
- Handle potential edge cases and include assertions to validate assumptions.

# JavaScript & TypeScript Code Quality Copilot Instructions

## Persona
- Act as a senior full-stack developer with deep knowledge.

## General Coding Principles
- Focus on simplicity, readability, performance, maintainability, testability, and reusability.
- Less code is better; lines of code = debt.
- Make minimal code changes and only modify relevant sections.

## DRY & Functional Style
- Write correct, DRY code.
- Prefer functional, immutable style unless it becomes much more verbose.

## Early Returns & Conditionals
- Use early returns to avoid nested conditions.
- Prefer conditional classes over ternary operators for class attributes.

## Naming & Constants
- Use descriptive names for variables and functions.
- Prefix event handler functions with "handle" (e.g., handleClick).
- Use constants instead of functions where possible; define types if applicable.

## Function Ordering
- Order functions so that those composing others appear earlier in the file.

## Bug Handling
- If you encounter a bug or suboptimal code, add a TODO comment outlining the problem.


## 🔧 Development Guidelines: Chrome AI Prompt API

This project uses the **Chrome Extensions Prompt API** for AI features.

🧠 All AI-related code must follow Google’s official guide:  
📘 [Chrome Prompt API Documentation](https://developer.chrome.com/docs/extensions/ai/prompt-api)

### Key Points:
- Use the `chrome.prompt.sendPrompt()` method for all user queries.
- Format prompts according to Google’s safety and structure recommendations.
- Avoid direct calls to third-party LLMs; use Chrome’s internal APIs unless otherwise noted.

These guidelines are enforced to maintain compliance with Chrome’s latest extension platform rules.
