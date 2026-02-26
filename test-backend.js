const http = require('http');

async function testBackend() {
    const baseUrl = 'http://localhost:3000/api';
    let userToken = '';
    let adminToken = '';
    let userId = '';
    let adminId = '';
    let orderId = '';

    console.log("🚀 Starting Backend Tests...");

    // 1. Signup an Admin User
    try {
        const res = await fetch(`${baseUrl}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'Admin Test', email: 'admin@test.com', password: 'password123' })
        });
        const data = await res.json();
        if (data.success || data.message === 'Email already registered.') {
            console.log("✅ Admin Signup / Check passed");
        } else {
            console.log("❌ Admin Signup failed:", data);
        }
    } catch (e) { console.error(e) }

    // 2. Signup a Regular User
    try {
        const res = await fetch(`${baseUrl}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: 'User Test', email: 'user@test.com', password: 'password123' })
        });
        const data = await res.json();
        if (data.success || data.message === 'Email already registered.') {
            console.log("✅ User Signup / Check passed");
        } else {
            console.log("❌ User Signup failed:", data);
        }
    } catch (e) { console.error(e) }

    // 3. Admin Login (Requires manually setting role to admin in DB, but we will test what we can)
    // Actually, we'll need to manually modify the DB to set role='admin' for the admin user.
    // Let's do that via a quick mongoose script.
}

testBackend();
