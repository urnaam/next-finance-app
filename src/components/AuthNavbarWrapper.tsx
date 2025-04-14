'use client';

import { useEffect, useState } from 'react';

export default function AuthNavbarWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); // Add a loading state

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    setLoggedIn(!!userId);
    setLoading(false); // Set loading to false after determining the state
  }, []);

  if (loading) {
    return null; // Optionally, you can return a loading spinner here
  }

  if (!loggedIn) {
    return null; // Hide the component if the user is not logged in
  }

  return <>{children}</>;
}
