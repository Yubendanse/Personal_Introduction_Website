"use client";
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex h-screen w-full items-center justify-center px-5 md:px-20">
      {error?.message || `哎呀，非常抱歉~出现了一些错误::>_<::`}
    </div>
  );
}
