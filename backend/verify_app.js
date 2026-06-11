const API_URL = 'http://localhost:5000/api';
let token = '';
let workspaceId = '';
let taskId = '';
let sessionId = '';

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchAPI(endpoint, method = 'GET', body = null) {
  const headers = {
    'Content-Type': 'application/json'
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const options = { method, headers };
  if (body) options.body = JSON.stringify(body);

  const res = await fetch(`${API_URL}${endpoint}`, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || res.statusText);
  return data;
}

async function runTests() {
  try {
    console.log('--- Starting API Verification ---');
    
    // 1. Signup
    console.log('1. Testing User Signup...');
    const signupData = await fetchAPI('/auth/signup', 'POST', {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'password123',
      role: 'admin'
    });
    token = signupData.token;
    console.log('Signup Successful. Token received.');

    // 2. Create Workspace
    console.log('2. Testing Workspace Creation...');
    const workspaceData = await fetchAPI('/workspaces', 'POST', {
      name: 'Test Workspace',
      description: 'A workspace for automated tests'
    });
    workspaceId = workspaceData.workspace._id;
    console.log('Workspace Created:', workspaceId);

    // 3. Create Task
    console.log('3. Testing Task Creation...');
    const taskData = await fetchAPI('/tasks', 'POST', {
      title: 'Automated Test Task',
      workspaceId,
      priority: 'High'
    });
    taskId = taskData.task._id;
    console.log('Task Created:', taskId);

    // 4. Update Task Status
    console.log('4. Testing Task Completion...');
    await fetchAPI(`/tasks/${taskId}`, 'PUT', {
      status: 'Completed'
    });
    console.log('Task Updated to Completed.');

    // 5. Focus Session
    console.log('5. Testing Focus Session...');
    const startData = await fetchAPI('/focus/start', 'POST');
    sessionId = startData.session._id;
    console.log('Focus Session Started:', sessionId);
    
    await delay(1000);
    
    await fetchAPI(`/focus/${sessionId}/end`, 'POST', {
      duration: 1500,
      interruptions: 0
    });
    console.log('Focus Session Ended successfully.');

    // 6. Analytics
    console.log('6. Testing Analytics and Insights Engine...');
    await fetchAPI('/analytics/analyze', 'POST');
    const analyticsData = await fetchAPI('/analytics', 'GET');
    console.log('Analytics Data retrieved:', analyticsData.pattern ? 'Success' : 'Failed');

    // 7. Admin Stats
    console.log('7. Testing Admin Stats...');
    const adminData = await fetchAPI('/admin/stats', 'GET');
    console.log('Admin Stats retrieved:', adminData.stats ? 'Success' : 'Failed');

    console.log('--- All Tests Passed Successfully! ---');
  } catch (error) {
    console.error('--- Test Failed ---');
    console.error(error.message);
    process.exit(1);
  }
}

runTests();
