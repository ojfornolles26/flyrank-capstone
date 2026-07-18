# WORKFLOW.md - AI-Assisted Workflow Comparison

This report details the comparison between two development workflows evaluated in this drill: a vague, context-free prompting workflow (Round 1) and a precise, test-driven, plan-led workflow (Round 2). 

---

## 📊 Summary of Differences

| Metric / Aspect | Round 1 (Vague Prompt) | Round 2 (Precise Prompt) |
| :--- | :--- | :--- |
| **Branch** | `workflow-drill-round-one` | `workflow-drill-round-two` |
| **Validation Method** | Basic React State & Regex | Zod Schema + React Hook Form |
| **Unit Tests** | 0 new tests (1 broken baseline test) | 11 passing tests (covering all validations & a11y) |
| **Accessibility (a11y)** | 0% (unlinked labels, no aria flags) | 100% (proper ids, htmlFor, and aria-describedby) |
| **Form Fields** | Name, Email, API Key, Theme, Notify | Name, Email, OpenAI & Anthropic keys, Model, Temp, Tokens |

---

## 🔍 Detailed Analysis

### 1. Correctness and Edge Cases
* **Round 1**: Validation was brittle. It used a simple regex for email matching and a loose length check on the API Key (`apiKey.length < 20`). It failed to ensure correct prefixes (like `sk-`) and let whitespace slip through. More importantly, it completely omitted critical AI parameters (Temperature, Max Tokens, and Model select) due to the vague prompt.
* **Round 2**: Using a strict **Zod** schema ensured complete type-safety. Email structure is fully validated, API keys are optional but enforced to start with specific prefixes (`sk-` or `sk-ant-`) if entered, and numeric parameters are correctly parsed and constrained (Temperature: `0.0` to `2.0`, Max Tokens: `1` to `8192` integer).

### 2. Accessibility (a11y)
* **Round 1**: Severely deficient. `<label>` elements lacked the `htmlFor` attribute, and inputs lacked matching `id`s, meaning screen readers couldn't pair them. Visual errors appeared as floating text, which is unreadable to assistive technologies.
* **Round 2**: Structured accessibility. Every label is linked to its input via `htmlFor`/`id`. Fields are equipped with reactive `aria-invalid` attributes. Error messages have unique `id`s linked to inputs via `aria-describedby` when active, satisfying screen reader criteria.

### 3. AI Mistakes Caught
* **Broken Baselines**: In Round 1, the AI blindly overwrote the header without running or verifying existing tests, immediately breaking `src/App.test.jsx`. 
* **Testing Library Label Conflict**: In Round 2, the AI initially gave the password visibility buttons `aria-label="Show OpenAI API Key"`. This caused `getByLabelText(/OpenAI API Key/i)` in the test runner to fail because it found multiple matching elements (both the input's label and the button's aria-label). I corrected this by rewriting the button labels to a generic `"Show key"` / `"Hide key"`.
* **HTML5 Form Interference**: Native browser validation on the `type="email"` input blocked JSDOM form submission before React Hook Form's resolver could run. I resolved this by adding the `noValidate` attribute to the `<form>`.

### 4. Review Effort and Time Efficiency
* **Round 1** was fast to write initially (under 1 minute), but it left a trail of broken tests, accessibility warnings, security risks, and missing configuration settings. Fixing these manual issues would have taken hours in production.
* **Round 2** required planning, schema configuration, and test writing upfront (approx. 10-15 minutes). However, because the test suite automatically caught formatting conflicts and structural gaps, the final component was verified correct end-to-end, leading to zero debugging time.
