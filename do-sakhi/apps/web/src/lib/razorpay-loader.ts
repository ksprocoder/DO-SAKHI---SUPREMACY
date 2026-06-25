export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    // If already loaded
    if (typeof window !== 'undefined' && window.Razorpay) {
      resolve(true);
      return;
    }

    const scriptId = 'razorpay-checkout-script';
    if (document.getElementById(scriptId)) {
      // Script is already loading, but maybe not finished.
      // Wait a bit or let the existing script tag finish.
      // For simplicity, we can try to resolve if window.Razorpay exists or listen to the existing script's load event.
      // But standard approach: if it exists, it will load eventually.
      // A more robust approach is to attach a listener.
      const existingScript = document.getElementById(scriptId) as HTMLScriptElement;
      existingScript.addEventListener('load', () => resolve(true));
      existingScript.addEventListener('error', () => reject(new Error('Failed to load Razorpay SDK')));
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;

    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error('Failed to load Razorpay SDK. Check your network connection.'));

    document.body.appendChild(script);
  });
}
