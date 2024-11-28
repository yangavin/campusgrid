import Link from 'next/link';

export default function WebviewWarning() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <h1 className="mb-6 text-2xl font-bold">Please Open in Browser</h1>
      <p className="mb-4">
        For the best experience, please open this website in your default web
        browser instead of the Instagram/social media browser.
      </p>
      <div className="space-y-4">
        <p className="font-semibold">How to open in browser:</p>
        <ol className="list-decimal space-y-2 pl-8 text-left">
          <li>Tap the three dots (...) in the top right corner</li>
          <li>Select &quot;Open in Browser&quot;</li>
        </ol>
      </div>
    </div>
  );
}
