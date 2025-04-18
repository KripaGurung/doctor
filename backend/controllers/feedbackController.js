import FeedbackModel from '../models/FeedbackModel.js';

// Add this function to handle review submissions
const submitFeedback = async (req, res) => {
  try {
    const { doctorId, userId, rating, comment } = req.body;

    // Validate required fields
    if (!doctorId || !userId || !rating) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required fields' 
      });
    }

    // Create new feedback
    const feedback = new FeedbackModel({
      doctor: doctorId,
      user: userId,
      rating: Number(rating),
      comment,
      createdAt: new Date()
    });

    await feedback.save();

    res.status(200).json({ 
      success: true, 
      message: "Review submitted successfully" 
    });

  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({ 
      success: false, 
      message: "Error submitting review" 
    });
  }
};


export { submitFeedback };