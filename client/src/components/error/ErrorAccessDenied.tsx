import Link from 'next/link';

export default function ErrorAccessDenied({ status, message }: any) {
  return (
    <div className="flex flex-col h-full w-full items-center justify-center">
      <h1 className="font-bold text-lg pt-20">Access Denied</h1>
      {status === 'authenticated' ? (
        <div className="">
          Your account does not have permission for this function!
        </div>
      ) : (
        <p className="">{message}</p>
      )}
      <Link href="/" className="mt-4 text-blue-500 underline">
        Go to Homepage
      </Link>
    </div>
  );
}
