const axios = require('axios');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';

async function runTests() {
    console.log('🧪 Testing ntfy CapRover Integration\n');

    // Test 1: Health check
    console.log('Test 1: Health check...');
    try {
        const response = await axios.get(`${BASE_URL}/health`);
        if (response.data.status === 'healthy') {
            console.log('✅ Health check passed');
            console.log('   Service:', response.data.service);
            console.log('   ntfy server:', response.data.ntfy_server);
            console.log('   Topic:', response.data.topic);
        } else {
            console.log('❌ Health check failed');
        }
    } catch (error) {
        console.log('❌ Health check error:', error.message);
        return;
    }

    // Test 2: Simple notification
    console.log('\nTest 2: Simple notification...');
    try {
        const response = await axios.post(`${BASE_URL}/notify`, {
            message: '🧪 Test notification from CapRover ntfy service!',
            title: 'Test Notification',
            tags: 'test,check',
            priority: 'default'
        });
        
        if (response.data.success) {
            console.log('✅ Simple notification test passed');
        } else {
            console.log('❌ Simple notification test failed');
            console.log('   Response:', response.data);
        }
    } catch (error) {
        console.log('❌ Simple notification test error:', error.message);
    }

    // Test 3: Urgent notification
    console.log('\nTest 3: Urgent notification...');
    try {
        const response = await axios.post(`${BASE_URL}/notify/urgent`, {
            message: '🚨 This is an urgent test notification!'
        });
        
        if (response.data.success) {
            console.log('✅ Urgent notification test passed');
        } else {
            console.log('❌ Urgent notification test failed');
            console.log('   Response:', response.data);
        }
    } catch (error) {
        console.log('❌ Urgent notification test error:', error.message);
    }

    // Test 4: Priority notification
    console.log('\nTest 4: High priority notification...');
    try {
        const response = await axios.post(`${BASE_URL}/notify/priority/high`, {
            message: '⚠️ High priority test notification!'
        });
        
        if (response.data.success) {
            console.log('✅ High priority notification test passed');
        } else {
            console.log('❌ High priority notification test failed');
            console.log('   Response:', response.data);
        }
    } catch (error) {
        console.log('❌ High priority notification test error:', error.message);
    }

    // Test 5: CapRover deployment notification
    console.log('\nTest 5: CapRover deployment notification...');
    try {
        const response = await axios.post(`${BASE_URL}/caprover/deploy`, {
            appName: 'test-app',
            status: 'success',
            branch: 'main',
            commit: 'abc123def456'
        });
        
        if (response.data.success) {
            console.log('✅ CapRover deployment notification test passed');
        } else {
            console.log('❌ CapRover deployment notification test failed');
            console.log('   Response:', response.data);
        }
    } catch (error) {
        console.log('❌ CapRover deployment notification test error:', error.message);
    }

    // Test 6: CapRover error notification
    console.log('\nTest 6: CapRover error notification...');
    try {
        const response = await axios.post(`${BASE_URL}/caprover/error`, {
            error: 'Test error message',
            appName: 'test-app',
            details: 'This is a test error for demonstration purposes'
        });
        
        if (response.data.success) {
            console.log('✅ CapRover error notification test passed');
        } else {
            console.log('❌ CapRover error notification test failed');
            console.log('   Response:', response.data);
        }
    } catch (error) {
        console.log('❌ CapRover error notification test error:', error.message);
    }

    // Test 7: Test endpoint
    console.log('\nTest 7: Test endpoint...');
    try {
        const response = await axios.get(`${BASE_URL}/test`);
        
        if (response.data.success) {
            console.log('✅ Test endpoint passed');
        } else {
            console.log('❌ Test endpoint failed');
            console.log('   Response:', response.data);
        }
    } catch (error) {
        console.log('❌ Test endpoint error:', error.message);
    }

    console.log('\n🎯 Test suite completed!');
    console.log('\n📱 To receive notifications:');
    console.log('1. Install ntfy app on your phone');
    console.log('2. Subscribe to your topic: caprover-notifications');
    console.log('3. Or visit: https://ntfy.sh/caprover-notifications');
}

// Run tests
if (require.main === module) {
    runTests();
}

module.exports = { runTests }; 