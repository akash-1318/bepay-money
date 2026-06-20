# BePay Merchant Dashboard

A fully responsive, non-custodial crypto payments dashboard for merchants to create payment links, monitor incoming payments, and review transaction activity.

## Setup and Run Instructions

This project is built using React (Preact compat), Vite, TypeScript, and Tailwind CSS.

**Prerequisites:**
- Node.js (v18+)
- npm or yarn

**Installation & Startup:**
1. Clone the repository and navigate to the project directory:
   ```bash
   cd bepay-money
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Start the local development server:
   ```bash
   npm run dev
   ```
4. Open your browser and visit `http://localhost:5173` to view the application.

## Technical Approach and Architecture

- **Framework:** Vite + React (via Preact compat) for fast compilation and optimized production builds.
- **Styling:** Centralized design system using Tailwind CSS (v4.0 directives). Custom `@theme` and `@utility` classes are configured in `index.css` to enforce consistent spacing, colors, and typography across all components, reducing code duplication.
- **State Management & Logic:** Business logic is abstracted into custom hooks (`useTransactions`, `usePaymentLinks`), keeping presentational components clean and focused solely on UI rendering.
- **Data Layer:** A decoupled mock database (`mocks/db.ts`) handles data seeding and persistence (simulated). The API layer (`services/api.ts`) provides asynchronous methods to interact with this data, simulating real-world network latency and providing a clean contract that can be easily swapped for a real REST or GraphQL backend in the future.
- **Error Handling:** A centralized React `ErrorBoundary` wraps the application to gracefully catch rendering exceptions and present a fallback UI, preventing full application crashes.

## Assumptions and Trade-offs

- **Mock Backend Integration:** We assumed that all data would eventually come from an external API. Therefore, all data fetching in the application is asynchronous, and we intentionally added artificial network delays (`setTimeout`) to simulate and test loading states properly.
- **No Live Blockchain Integration:** As per the assignment guidelines, no actual Web3/wallet integration (e.g., Wagmi, Ethers.js) was implemented. Instead, we built a "Developer Tool" simulator on the Payment Link Detail page that mocks a customer completing a payment on-chain and generates the corresponding transaction receipt.
- **Search Filtering:** The search filtering across transactions currently runs entirely in-memory on the client side since the mock database sends down the full array. In a production environment with millions of rows, this search would be delegated to backend database queries.

## Completed and Incomplete Features

**Completed Features:**
- **Dashboard:** Fully functional metric cards (Total Received, Successful, Pending, Failed/Expired) and recent activity summary. Includes a timeframe filter (24h, 7d, 30d, All) that dynamically updates the metrics.
- **Payment History:** Paginated table displaying all transactions with their statuses. Includes search functionality, status filtering, and an export-to-CSV feature. Clicking a row opens a detailed transaction receipt modal.
- **Create Payment Link:** A comprehensive form with validation for creating new payment requests.
- **Payment Link Detail:** A sharable view displaying the generated payment URL, QR code, and expiry information. Includes the "Simulate Payment" tool to test the transition from `active` to `paid`.
- **UI/UX Polish:** Pixel-perfect adherence to the provided Figma designs, fully responsive mobile layouts, and comprehensive loading/empty states.

**Incomplete Features:**
- **Authentication:** No login or merchant authentication flow is implemented.
- **Real-time Webhooks/Websockets:** The application relies on manual refreshing or polling to update statuses, rather than real-time WebSocket events that a true blockchain indexer would provide.

## Testing Instructions

The project uses **Vitest** for running unit and integration tests, configured to handle the Preact environment.

To run the test suite:
```bash
npm run test
```

The testing suite covers:
- **Mock Database Integrity:** Verifying CRUD operations in `db.ts`.
- **API Logic:** Ensuring the `api.ts` filters, calculates dashboard summaries, and handles pagination correctly.
- **Component Rendering:** Validating that pure UI components like `StatusBadge` and `ErrorBoundary` render expected classes and catch errors correctly.

## Hosted Preview URL

*(Optional: Add your Vercel/Netlify/Render deployment link here before submission)*
- **Live Demo:** `https://bepay-money-three.vercel.app/`
