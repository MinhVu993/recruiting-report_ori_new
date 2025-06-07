export default function ({ app, redirect, route }) {
  // Skip authentication check for login page
  if (route.path === '/' || route.path === '/index') {
    return;
  }

  // Check if user is authenticated
  const session = app.$session.get('recruiting-report');
  if (!session) {
    return redirect('/');
  }

  // Optional: Check if session is still valid or has required permissions
  if (!session.username || !session.dept) {
    app.$session.remove('recruiting-report');
    return redirect('/');
  }
}
