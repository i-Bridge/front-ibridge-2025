export default function HomeLoading() {
  return (
    <div className="flex flex-col space-y-14 w-full p-6">
      <div className="bg-gray-200 h-16 rounded-3xl w-full" />
      <div className="bg-gray-100 rounded-3xl p-10 w-full max-w-7xl mx-auto space-y-4">
        <div className="bg-gray-200 h-16 rounded-3xl w-full mb-6" />
        <div className="flex flex-wrap gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-gray-50 h-20 rounded-xl flex-1 min-w-[200px] max-w-xs" />
          ))}
        </div>
      </div>
      <div className="bg-gray-200 h-12 w-80 rounded-xl mb-2" />
      <div className="bg-gray-50 h-40 w-full max-w-7xl rounded-3xl" />
      <div className="bg-gray-50 h-64 rounded-3xl w-full max-w-7xl mx-auto" />
      <footer className="bg-gray-200 h-24 rounded-3xl w-full" />
    </div>
  );
}
