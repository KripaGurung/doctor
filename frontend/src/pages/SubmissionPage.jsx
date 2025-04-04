const SubmissionPage = () => {
  return (
    <div 
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('your-image-url')" }}
    >
      <div className="text-center text-blue p-8 bg-opacity-50 rounded-lg">
        <h1 className="text-3xl font-semibold mb-4">Form is Submitted!</h1>
        <p className="text-lg mb-6">Thank you for submitting the form.</p>
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          onClick={() => window.location.href = '/'}  // Redirect or perform another action
        >
          Go to Home
        </button>
      </div>
    </div>
  );
};

export default SubmissionPage;
