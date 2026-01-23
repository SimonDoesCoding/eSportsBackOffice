'use client';

export default function ResultsPage() {
  const handleRecordResult = () => {
    alert('Result recording will be implemented when the results API endpoint is available');
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-white">Results</h1>
          <p className="mt-2 text-sm text-gray-400">
            View and record match results
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={handleRecordResult}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 sm:w-auto"
          >
            Record Result
          </button>
        </div>
      </div>
      
      <div className="mt-8 bg-gray-800 shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="text-center py-12">
            <h3 className="mt-2 text-sm font-medium text-gray-300">No results</h3>
            <p className="mt-1 text-sm text-gray-400">Record your first match result to get started.</p>
            <p className="mt-2 text-xs text-gray-500">Note: Results API endpoint is not yet implemented.</p>
          </div>
        </div>
      </div>
    </div>
  );
}