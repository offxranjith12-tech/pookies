const testAdd = async () => {
  try {
    const loginRes = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@pookies.com',
        password: 'password123'
      })
    });
    
    const loginData = await loginRes.json();
    const token = loginData.token;
    
    const form = new FormData();
    form.append('name', 'Test Artist');
    form.append('specialization', 'Test');
    form.append('location', 'Test');
    form.append('experience', 'Test');
    form.append('startingPrice', '100');
    form.append('description', 'Test');
    form.append('services', 'Makeup, Hair');
    form.append('available', 'true');
    
    const res = await fetch('http://localhost:5000/api/artists', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: form
    });
    
    const data = await res.json();
    console.log(data);
  } catch (error) {
    console.error(error);
  }
};

testAdd();
