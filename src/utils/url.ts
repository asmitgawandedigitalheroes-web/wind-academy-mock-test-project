export const getURL = () => {
  // In development, we almost always want to redirect back to localhost
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  let url = isDevelopment
    ? 'http://localhost:3000/'
    : (process.env.NEXT_PUBLIC_SITE_URL ??
       process.env.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
       'http://localhost:3000/');
  
  // Make sure to include `https://` when not localhost and not already present.
  if (!url.startsWith('http')) {
    url = `https://${url}`;
  }
  
  // Make sure to include a trailing `/`.
  url = url.endsWith('/') ? url : `${url}/`;
  
  return url;
};
