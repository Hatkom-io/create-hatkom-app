# create-hatkom-app

[![NPM Version](https://img.shields.io/npm/v/create-hatkom-app.svg)](https://www.npmjs.com/package/create-hatkom-app)
[![License](https://img.shields.io/npm/l/create-hatkom-app.svg)](https://github.com/Hatkom-io/create-hatkom-app/blob/main/LICENSE)


A CLI tool to quickly initialize a monorepo with the Hatkom stack, making development faster and more efficient. It sets up a monorepo with essential infrastructure and utilities, using popular technologies like **NestJS** for API development and **Next.js** for web applications.

## Installation

You can use `create-hatkom-app` with your preferred package manager:

```bash
# Using Bun
bunx create-hatkom-app my-app

# Using NPX
npx create-hatkom-app my-app

# Using Yarn
yarn create hatkom-app my-app

# Using PNPM
pnpm create hatkom-app my-app
```

## Features

- 🚀 **Monorepo structure** with infrastructure and utilities for a better development experience
- 🔥 **Next.js & NestJS** support out-of-the-box
- 🛠 **ESLint & shared package** for improved code quality
- 🏗 **Scalable & customizable**—modify and extend as needed
- ⚡ **Fast setup** with minimal dependencies pre-installed

## What’s Included?

Depending on the selected options in the CLI prompt, the generated monorepo may include:

- **Next.js** application
- **NestJS** (optional API server)
- **Shared package** for utilities and types
- **ESLint configuration package**

## Usage

After installation, navigate into your project folder:

```bash
cd my-app
```

If you chose not to install dependencies during initialization, install them manually:

```bash
bun install  # or npm install / yarn install / pnpm install
```

Then, start the development server:

```bash
bun start:dev  # For Bun users
npm run start:dev  # For npm users
yarn start:dev  # For Yarn users
pnpm start:dev  # For PNPM users
```

## Customization

The generated monorepo provides a solid foundation, but it’s fully customizable. You can install additional dependencies or modify the structure as needed.

---

🚀 **Get started now and accelerate your development with create-hatkom-app!**
