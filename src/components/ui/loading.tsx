export default function Loading() {
  return (
    <div className="fixed top-0 left-0 flex justify-center items-center w-screen h-screen z-50">
      <div
        className="animate-spin rounded-full border-t-2 border-b-2 border-gray-900"
        style={{ width: '10vw', height: '10vh' }}
      ></div>
    </div>
  );
}