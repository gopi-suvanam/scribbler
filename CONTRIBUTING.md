# Contributing to Our Project

🎉 This repository is participating in **Hacktoberfest 2025**!
We welcome contributions from everyone. Please take a moment to review these guidelines so the process stays smooth and efficient for all contributors.

Before contributing, please go through the code documentation here: [Code-Docs](CODE-DOCS.md)

---

## How to Contribute

### 1. Fork the Repository

Start by forking this repository to your GitHub account. This lets you work on changes without affecting the original codebase.

👉 [Fork this repository](https://github.com/gopi-suvanam/scribbler/fork)

---

### 2. Clone Your Fork

Clone your forked repository (replace `<your-username>` with your GitHub handle):

```bash
git clone https://github.com/<your-username>/scribbler.git
cd scribbler
```

---

### 3. Run Locally

Start a local server to preview your changes:

If you are using Node.js:

```bash
npx serve
```

If you are using Python:

```bash
python -m http.server
```

Alternatively, place `scribbler` in the `www` directory of any web server.

---

### 4. Create a Branch

Before making changes, create a **new branch**.
Use a descriptive name based on the type of contribution.

#### Branch Naming Conventions:

* **bugfix/** for bug fixes
* **feature/** for new features
* **docs/** for documentation updates
* **modified/** for UI/text/content changes
* **other/** for refactoring or miscellaneous updates

**Examples:**

* `bugfix/fix-login-error`
* `feature/add-payment-method`
* `docs/update-readme`
* `modified/homepage/update-welcome-message`
* `other/refactor-auth-logic`

```bash
git checkout -b feature/add-new-feature
```

---

### 5. Make and Commit Changes

Make your changes according to project conventions.
When committing, follow these formats:

* **Bug Fixes**:
  `fix: [short description]`
  Example: `fix: resolve login error on homepage`

* **Features**:
  `feat: [short description]`
  Example: `feat: add new payment method option`

* **Documentation**:
  `docs: [short description]`
  Example: `docs: update README with branch naming conventions`

* **Modifications (UI/text/content)**:
  `mod: [short description]`
  Example: `mod: update welcome message on homepage`

* **Other (refactors, chores, etc.)**:
  `chore: [short description]`
  Example: `chore: refactor authentication logic for clarity`

```bash
git commit -m "feat: add user profile page"
```

---

### 6. Push Changes

Push your branch to your forked repository:

```bash
git push origin [branch-name]
```

---

### 7. Open a Pull Request (PR)

* Go to the original repository on GitHub and click **New Pull Request**.
* Compare your branch from your fork against the `main` branch of this repo.
* Provide a **clear title** and description.
* If applicable, reference issues (e.g., “Fixes #42”).
* Keep PRs focused and small for easier review.
* Add screenshots or test details if you changed UI or logic.

---

## Code of Conduct

Please be respectful and constructive in all interactions. We value contributions from everyone, and we want this community to remain inclusive and welcoming.

---

✅ That’s it! Thanks for contributing, and happy coding 🎉

---

Would you like me to also create a **`PULL_REQUEST_TEMPLATE.md`** for your repo? That way, contributors will see a ready-to-fill checklist whenever they open a PR.
