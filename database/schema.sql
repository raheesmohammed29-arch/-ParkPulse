-- ==============================================================================
-- ParkPulse Smart Parking Management System - PostgreSQL Database Schema
-- ==============================================================================

-- Drop tables if exists (clean reset)
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS parking_slots CASCADE;
DROP TABLE IF EXISTS parking_locations CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. Users Table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Parking Locations Table (Parking Garages, Hubs, Lots)
CREATE TABLE parking_locations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    code VARCHAR(50) UNIQUE NOT NULL,
    address VARCHAR(300) NOT NULL,
    city VARCHAR(100) NOT NULL,
    total_slots INT NOT NULL DEFAULT 40,
    hourly_base_rate NUMERIC(10, 2) NOT NULL DEFAULT 5.00,
    image_url VARCHAR(500),
    description TEXT,
    amenities TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Parking Slots Table
CREATE TABLE parking_slots (
    id SERIAL PRIMARY KEY,
    location_id INT REFERENCES parking_locations(id) ON DELETE CASCADE,
    slot_number VARCHAR(50) NOT NULL,
    floor_level VARCHAR(20) NOT NULL DEFAULT 'L1',
    section VARCHAR(20) NOT NULL DEFAULT 'A',
    vehicle_type VARCHAR(30) NOT NULL DEFAULT 'sedan' CHECK (vehicle_type IN ('compact', 'sedan', 'suv', 'ev', 'accessible', 'motorcycle')),
    price_per_hour NUMERIC(10, 2) NOT NULL DEFAULT 5.00,
    status VARCHAR(30) NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'reserved', 'maintenance')),
    has_ev_charging BOOLEAN DEFAULT FALSE,
    is_covered BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_slot_per_location UNIQUE (location_id, slot_number)
);

-- 4. Bookings Table (With Overlap Protection Logic)
CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    booking_code VARCHAR(50) UNIQUE NOT NULL,
    slot_id INT REFERENCES parking_slots(id) ON DELETE RESTRICT,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    customer_name VARCHAR(150) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    vehicle_number VARCHAR(50) NOT NULL,
    vehicle_type VARCHAR(30) NOT NULL DEFAULT 'sedan',
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_hours NUMERIC(6, 2) NOT NULL,
    hourly_rate NUMERIC(10, 2) NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    payment_status VARCHAR(30) DEFAULT 'paid' CHECK (payment_status IN ('paid', 'pending', 'refunded')),
    status VARCHAR(30) DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'checked_in', 'completed', 'cancelled')),
    add_ons TEXT[],
    special_requests TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_time_window CHECK (end_time > start_time)
);

-- Performance Indexes
CREATE INDEX idx_parking_slots_location ON parking_slots(location_id);
CREATE INDEX idx_parking_slots_status ON parking_slots(status);
CREATE INDEX idx_bookings_slot_time ON bookings(slot_id, start_time, end_time);
CREATE INDEX idx_bookings_user_email ON bookings(customer_email);
CREATE INDEX idx_bookings_status ON bookings(status);

-- Seed Sample Locations
INSERT INTO parking_locations (name, code, address, city, total_slots, hourly_base_rate, image_url, description, amenities) VALUES
('Metro Center Financial Tower', 'MCF-01', '100 Financial Way, Suite P', 'Downtown Metro', 32, 6.50, 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80', 'Underground multi-level secure parking facility with high-speed EV chargers and 24/7 CCTV surveillance.', ARRAY['EV Fast Charging', 'CCTV 24/7', 'Valet Available', 'Wheelchair Ramp', 'Car Wash']),
('Airport Terminal 2 Express Hub', 'AT2-02', 'Airport Skyway Blvd, Gate B', 'Airport District', 36, 9.00, 'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=800&q=80', 'Direct covered sky-bridge access to terminals with wide bays for luggage loading and premium security.', ARRAY['Covered Walkway', 'Luggage Assistance', 'Flight Status Screens', 'EV Charging', 'Security Patrol']),
('Westside Grand Retail Plaza', 'WGP-03', '742 Commerce Avenue', 'West End', 28, 4.00, 'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=800&q=80', 'Convenient ground and rooftop parking next to dining, shopping cinema complexes with family-sized bays.', ARRAY['Close to Malls', 'Wide Family Bays', 'Accessible Entry', 'Contactless Pay', 'Motorcycle Zone']);

-- Seed Initial Users (Password: "password123" for demo)
INSERT INTO users (email, password_hash, full_name, phone, role) VALUES
('admin@parkpulse.io', 'pbkdf2_sha256_mock_hash_admin', 'Administrator Team', '+1 (555) 019-2834', 'admin'),
('john.doe@example.com', 'pbkdf2_sha256_mock_hash_john', 'Johnathan Doe', '+1 (555) 349-1122', 'customer');
