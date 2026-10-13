# SmartPark Pro &bull; Sri Lanka Smart Parking Management System

A commercial SaaS web application designed for a real parking enterprise in Sri Lanka (**Colombo City Center Car Park, 137 Galle Road, Kollupitiya, Colombo 03**).

Built with React, TypeScript, Tailwind CSS, and Lucide React icons, featuring 120 slot tracking, barrier gate operations, LKR billing, automated receipt printing, and comprehensive revenue analytics.

---

## 🌟 Key Features & Architecture

### 1. Mandatory Sri Lankan Rupee (LKR) & Regional Compliance
- **Strict Currency Enforcement**: Sri Lankan Rupees displayed everywhere (`Rs.` prefix, formatted using `en-LK` locale such as `Rs. 24,500.00`).
- **No Foreign Currencies**: No USD ($), EUR (€), GBP (£), or INR (₹).
- **Timezone**: `Asia/Colombo` applied to all date, time, check-in, check-out, and receipt operations.
- **Sri Lankan Vehicle Plates**: Formatted with authentic provincial registration conventions (e.g., `WP CAB-1234`, `WP CAR-8921`, `SP BCD-4512`, `CP KA-9012`).
- **Sri Lankan Phone Numbers**: Formatted using authentic local prefixes (e.g., `077 123 4567`, `011 234 5678`).

### 2. Marketing Landing Page
- **Hero Section**: Headline *"Parking Smarter. Operating Better."* with facility statistics ticker.
- **Facility Live Status**: Interactive overview of the 120 slots (75 Available, 35 Occupied, 10 Reserved).
- **Feature Highlights**: Automated boom barrier operations, ANPR plate tracking, online bookings, and LankaPay payments.
- **How It Works**: 4-step workflow for drivers and operators.
- **Commercial Pricing Plans (in LKR)**:
  - **Basic Facility**: Rs. 4,900 / month
  - **Professional Enterprise**: Rs. 9,900 / month
  - **Multi-Facility Commercial**: Custom Enterprise pricing
- **Direct Navigation**: 1-Click *"Open Dashboard"* and *"Explore 120 Slots"* buttons.

### 3. Executive Operations Dashboard
- **Exact Benchmark KPIs**:
  - **Total Parking Slots**: 120 (P001 to P120 across Ground, Level 1, Level 2)
  - **Available Slots**: 75 (Emerald green `#10B981`)
  - **Occupied Slots**: 35 (Rose red `#F43F5E`)
  - **Reserved Slots**: 10 (Amber yellow `#F59E0B`)
  - **Today's Revenue**: Rs. 24,500.00 (LKR)
- **Occupancy Rate**: Real-time gauge and percentage.
- **Revenue Performance Trends**: Interactive period switch between Daily (hourly), Weekly (Mon–Sun), and Monthly charts.
- **Recent Vehicle Activity Log**: Live feed of barrier check-ins and check-outs.
- **Gate Quick Actions**: One-click shortcuts for *Vehicle Entry*, *Vehicle Exit*, and *New Booking*.

### 4. Interactive 120-Slot Visual Grid
- Multi-floor navigation across **Zone A (Ground Floor)**, **Zone B (Level 1)**, and **Zone C (Level 2)**.
- Filter by status (`Available`, `Occupied`, `Reserved`), vehicle category compatibility (`Car`, `Van`, `SUV`, `Three-Wheeler`, `Motorcycle`, `Bus`), and EV charging.
- Detailed modal on slot click displaying parked vehicle details, driver phone, parked duration, and accrued fee in LKR.

### 5. Barrier Gate Operations Terminal
- Real-time vehicle check-in modal with plate number input, driver details, and automatic bay allocation.
- Rapid vehicle exit modal with automated duration calculation, billable hours, and LKR fee computation.
- Support for Sri Lankan payment methods: **Cash**, **Card POS**, and **LankaPay Online**.
- Printable thermal receipt modal featuring authentic business registration (`PV-109283-LK`), tax details, duration breakdown, and QR code verification matrix.

### 6. Advance Online Bookings
- Reservation system with strict **overlap conflict detection** preventing double-booking during overlapping time windows.
- 1-click check-in for arriving booked vehicles.

### 7. Revenue Analytics & Reports
- Hourly revenue breakdown (06:00 to 22:00 Colombo business hours).
- Revenue distribution by vehicle category (Cars, SUVs, Vans, Tuk-Tuks, Motorcycles, Buses).
- Payment channel split: Cash vs Card vs LankaPay Online.
- Zone and floor occupancy analysis.

### 8. Facility & Tariff Settings
- Configurable LKR tariffs (First hour base rate, additional hour rate, 24-hr daily cap, and vehicle multipliers).
- Facility profile details (Colombo City Center Car Park, Kollupitiya).
- Benchmark demo dataset restoration button (restores 120 slots, 75 available, 35 occupied, 10 reserved, Rs. 24,500.00 revenue).
- Export complete workspace to JSON, vehicle check-in log to CSV, and revenue ledger to CSV.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Lucide React icons
- **Backend**: Node.js, Express, tsx
- **Persistence**: High-performance local storage with Sri Lankan commercial dataset
- **Formatting**: `Intl.NumberFormat('en-LK')` and `Intl.DateTimeFormat` with `Asia/Colombo`

---

## 🚀 Running the Project

### Prerequisites
- Node.js (version 18 or later)
- npm or bun

### Setup Instructions
1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server (runs full-stack Express on port 3000):
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```
