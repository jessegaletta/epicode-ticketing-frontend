# Epicode Ticketing — Frontend

> [!NOTE]
> **Academic Project**: Developed as the final project for the **Frontend Programming** course at **EPICODE Institute of Technology**.
>
> This repository contains the source code and documentation required for the examination.
>
> 📄 **Official Requirements**: [Download Project Specifications (PDF)](docs/requirements.pdf)

---

## Related Repository

| Part | Repository |
|---|---|
| Backend (Spring Boot) | [epicode-ticketing-backend](https://github.com/jessegaletta/epicode-ticketing-backend) |

---

## Overview

**Epicode Ticketing** is a React single-page application for a real-world support ticketing system. Born from a concrete need — as student representative at **EPICODE Institute of Technology**, I needed a structured way to collect and manage requests from fellow students. Users can submit and track tickets; faculty and administrators manage them through a dedicated interface. The application adapts its views and available actions based on the authenticated user's role.

---

## Requirements Coverage

| Requirement | Implementation |
|---|---|
| Reusable, well-structured components | `GenericTable`, `ConfirmModal`, `Loading`, `Error`, `PrivacyPolicyModal`, `Layout`, `MyNavBar`, `MyFooter` |
| `useState` / `useEffect` hooks | Used throughout all pages for local state and side effects |
| Redux + Thunk for global state | Redux Toolkit store with async thunks for all API calls (auth, tickets, users, bachelors, courses, activities) |
| At least 6 pages + dynamic routing | 14 pages; detail pages use dynamic routes (`/tickets/:id`, `/users/:id`, `/bachelors/:id`, `/courses/:id`) |
| At least 2 user roles with different views | `STUDENT`, `FACULTY`, `ADMIN` — role-based UI rendering throughout |
| External API consumption | Custom backend REST API (Epicode Ticketing Backend) |
| At least 4 controlled forms with validation | Login, Registration, Forgot/Reset Password, Ticket create/edit, User create/edit, Bachelor create/edit, Course create/edit |
| Optional — styling library | Bootstrap 5 + React Bootstrap |

---

## Technologies

| Technology | Version |
|---|---|
| React | 18 |
| Vite | 8 |
| Redux Toolkit | 2 |
| React Router | 7 |
| React Bootstrap / Bootstrap | 5 |
| react-select | 5 |
| react-timezone-select | 3 |

---

## Pages and Routing

| Route | Page | Access |
|---|---|---|
| `/` | Home / ticket list | All |
| `/login` | Login | Public |
| `/register` | Registration | Public |
| `/forgot-password` | Forgot password | Public |
| `/reset-password` | Reset password | Public |
| `/tickets/new` | Create ticket | All |
| `/tickets/:id` | Ticket detail | All |
| `/users/me` | Own profile | Authenticated |
| `/users` | Users list | Admin |
| `/users/new` | Create user | Admin |
| `/users/:id` | User detail / edit | Admin |
| `/bachelors` | Bachelors list | Admin / Faculty |
| `/bachelors/new` | Create bachelor | Admin / Faculty |
| `/bachelors/:id` | Bachelor detail / edit | Admin / Faculty |
| `/courses` | Courses list | Admin / Faculty |
| `/courses/new` | Create course | Admin / Faculty |
| `/courses/:id` | Course detail / edit | Admin / Faculty |

---

## State Management

Global state is organized in Redux slices:

- **auth** — authenticated user and token
- **tickets** — ticket list and current ticket
- **users** — user list and current user
- **activities** — activities for the current ticket
- **bachelors** — bachelor list
- **courses** — course list
- **settings** — user preferences (dark mode, timezone, date/time format)

All API interactions use Redux Thunk async actions defined in `src/redux/actions/`.

---

## Setup and Running

### Prerequisites

| Requirement | Version |
|---|---|
| Node.js | 18+ |
| npm | 9+ |

### Environment Variables

Create a `.env` file in the project root only if you need to point to a backend running on a different URL (default: `http://localhost:3001`):

```env
VITE_BACKEND_URL = http://localhost:3001
```

### Steps

1. Create an `.env` file in the project root and fill in all values (see section below).
2. Make sure the [backend](https://github.com/jessegaletta/epicode-ticketing-backend) is running on `http://localhost:3001` (or the host/port configured in `.env`).
3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

The application is available at `http://localhost:5173`.

### Build for production

```bash
npm run build
```
