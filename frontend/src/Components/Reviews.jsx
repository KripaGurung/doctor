// import { useState, useEffect } from 'react';
// import PropTypes from 'prop-types';
// import axios from 'axios';
// import { FaStar } from 'react-icons/fa';
// import { toast } from 'react-hot-toast';

// const DoctorReviews = ({ doctorId, backendUrl }) => {
//   const [reviews, setReviews] = useState([]);
//   const [averageRating, setAverageRating] = useState(0);
//   const [totalRatings, setTotalRatings] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [newReview, setNewReview] = useState('');
//   const [newRating, setNewRating] = useState(0);
//   const [hover, setHover] = useState(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     fetchReviews();
//   }, [doctorId, backendUrl]);

//   const fetchReviews = async () => {
//     try {
//       const response = await axios.get(`${backendUrl}/api/doctor/feedback/${doctorId}`);
//       if (response.data.success) {
//         setReviews(response.data.feedbacks);
//         setAverageRating(parseFloat(response.data.averageRating));
//         setTotalRatings(response.data.totalRatings);
//       }
//     } catch (error) {
//       console.error('Error fetching reviews:', error);
//       toast.error('Failed to load reviews');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmitReview = async (e) => {
//     e.preventDefault();
//     if (!newRating) {
//       toast.error('Please select a rating');
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       const response = await axios.post(`${backendUrl}/api/doctor/feedback`, {
//         doctorId,
//         patientName: localStorage.getItem('userName'), // Assuming user name is stored in localStorage
//         rating: newRating,
//         comment: newReview
//       });

//       if (response.data.success) {
//         toast.success('Review submitted successfully');
//         setNewRating(0);
//         setNewReview('');
//         fetchReviews(); // Refresh reviews
//       }
//     } catch (error) {
//       toast.error('Failed to submit review');
//       console.error(error);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (loading) {
//     return <div className="text-center py-4">Loading reviews...</div>;
//   }

//   return (
//     <div className="mt-8">
//       <div className="flex items-center gap-4 mb-6">
//         <div className="text-4xl font-bold">{averageRating}</div>
//         <div>
//           <div className="flex text-yellow-400 mb-1">
//             {[...Array(5)].map((_, i) => (
//               <FaStar
//                 key={i}
//                 className={i < Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-200'}
//               />
//             ))}
//           </div>
//           <div className="text-sm text-gray-600">{totalRatings} reviews</div>
//         </div>
//       </div>

//       {/* Review Form */}
//       <form onSubmit={handleSubmitReview} className="mb-8">
//         <div className="flex mb-4">
//           {[...Array(5)].map((_, index) => {
//             const ratingValue = index + 1;
//             return (
//               <label key={index}>
//                 <input
//                   type="radio"
//                   name="rating"
//                   className="hidden"
//                   value={ratingValue}
//                   onClick={() => setNewRating(ratingValue)}
//                 />
//                 <FaStar
//                   className="cursor-pointer"
//                   color={ratingValue <= (hover || newRating) ? "#ffc107" : "#e4e5e9"}
//                   size={24}
//                   onMouseEnter={() => setHover(ratingValue)}
//                   onMouseLeave={() => setHover(null)}
//                 />
//               </label>
//             );
//           })}
//         </div>
//         <textarea
//           value={newReview}
//           onChange={(e) => setNewReview(e.target.value)}
//           placeholder="Write your review here..."
//           className="w-full p-2 border rounded-lg mb-4"
//           rows="4"
//           required
//         />
//         <button
//           type="submit"
//           disabled={isSubmitting}
//           className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
//         >
//           {isSubmitting ? 'Submitting...' : 'Submit Review'}
//         </button>
//       </form>

//       {/* Reviews List */}
//       <div className="space-y-6">
//         {reviews.map((review) => (
//           <div key={review._id} className="border-b pb-4">
//             <div className="flex justify-between items-start mb-2">
//               <div>
//                 <p className="font-medium">{review.patientName}</p>
//                 <p className="text-sm text-gray-600">
//                   {new Date(review.createdAt).toLocaleDateString()}
//                 </p>
//               </div>
//               <div className="flex text-yellow-400">
//                 {[...Array(5)].map((_, i) => (
//                   <FaStar
//                     key={i}
//                     className={i < review.rating ? 'text-yellow-400' : 'text-gray-200'}
//                   />
//                 ))}
//               </div>
//             </div>
//             <p className="text-gray-700">{review.comment}</p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };


// DoctorReviews.propTypes = {
//   doctorId: PropTypes.string.isRequired,
//   backendUrl: PropTypes.string.isRequired,
// };

// export default DoctorReviews;

import { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { AppContext } from '../context/AppContext';

const DoctorReviews = ({ doctorId }) => {
  const { backendUrl, token } = useContext(AppContext);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalRatings, setTotalRatings] = useState(0);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(null);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, [doctorId, backendUrl]);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/doctor/feedback/${doctorId}`);
      if (response.data.success) {
        setReviews(response.data.feedbacks);
        setAverageRating(parseFloat(response.data.averageRating) || 0);
        setTotalRatings(response.data.totalRatings);
      } else {
        toast.error('Failed to load reviews');
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Unable to load reviews. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!token) {
      toast.error('Please login to submit a review');
      return;
    }

    if (!rating) {
      toast.error('Please select a rating');
      return;
    }

    if (comment && comment.length < 10) {
      toast.error('Review comment should be at least 10 characters long');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${backendUrl}/api/doctor/feedback`,
        {
          doctorId,
          rating,
          comment
        },
        {
          headers: { token }
        }
      );

      if (response.data.success) {
        toast.success('Review submitted successfully');
        setComment('');
        setRating(0);
        setHover(null);
        await fetchReviews(); // Refresh reviews
      } else {
        toast.error(response.data.message || 'Failed to submit review');
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error(error.response?.data?.message || 'Error submitting review');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="mt-8 max-w-2xl mx-auto">
      {/* Rating Summary */}
      <div className="flex items-center gap-4 mb-6 p-4 bg-white rounded-lg shadow">
        <div className="text-4xl font-bold">{averageRating.toFixed(1)}</div>
        <div>
          <div className="flex text-yellow-400 mb-1">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={i < Math.round(averageRating) ? 'text-yellow-400' : 'text-gray-200'}
              />
            ))}
          </div>
          <div className="text-sm text-gray-600">Based on {totalRatings} reviews</div>
        </div>
      </div>

      {/* Review Form */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
        <form onSubmit={handleSubmitReview} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
            <div className="flex gap-1">
              {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                  <label key={index} className="cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      className="hidden"
                      value={ratingValue}
                      onClick={() => setRating(ratingValue)}
                    />
                    <FaStar
                      className="w-8 h-8 transition-colors"
                      color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                      onMouseEnter={() => setHover(ratingValue)}
                      onMouseLeave={() => setHover(null)}
                    />
                  </label>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this doctor..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              minLength={10}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !token}
            className={`w-full py-2 px-4 rounded-md text-white font-medium ${
              !token 
                ? 'bg-gray-400 cursor-not-allowed' 
                : isSubmitting 
                ? 'bg-blue-400 cursor-wait' 
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            {!token 
              ? 'Please Login to Review' 
              : isSubmitting 
              ? 'Submitting...' 
              : 'Submit Review'
            }
          </button>
        </form>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-center text-gray-500 py-4">No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((review) => (
            <div key={review._id} className="bg-white p-4 rounded-lg shadow">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium text-gray-900">{review.userName || 'Anonymous'}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <FaStar
                      key={i}
                      className={i < review.rating ? 'text-yellow-400' : 'text-gray-200'}
                    />
                  ))}
                </div>
              </div>
              {review.comment && (
                <p className="text-gray-700 mt-2">{review.comment}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

DoctorReviews.propTypes = {
  doctorId: PropTypes.string.isRequired
};

export default DoctorReviews;