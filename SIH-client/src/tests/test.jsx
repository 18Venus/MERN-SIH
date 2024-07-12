import React, { useEffect, useState } from 'react';
import ResultComponent from './result';

const QuizForm = () => {
  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState(() => {
    const saved = localStorage.getItem('selectedOptions');
    return saved ? JSON.parse(saved) : {};
  });
  const [scores, setScores] = useState(() => {
    const saved = localStorage.getItem('scores');
    return saved ? JSON.parse(saved) : {
      score1: 0,
      score2: 0,
      score3: 0,
      score4: 0,
      score5: 0,
      score6: 0,
    };
  });
  const [isLoading, setIsLoading] = useState(true); // Initial loading state
  const [submitted, setSubmitted] = useState(false);

  // Example adjustment for ensuring proper state updates and handling loading state

  const fetchQuestions = (page) => {
    setIsLoading(true);
    fetch(`http://localhost:3000/all-questions?page=${page}&limit=10`)
      .then(res => res.json())
      .then(data => {
        setQuestions(data.questions || []); // Ensure data.questions is an array or default to empty array
        setTotalPages(data.totalPages || 1); // Ensure data.totalPages is defined or default to 1
        setIsLoading(false); // Update loading state after fetching data
      })
      .catch(error => {
        console.error('Error fetching questions:', error);
        setIsLoading(false); // Handle error state
      });
  };


  useEffect(() => {
    fetchQuestions(currentPage);
  }, [currentPage]);

  useEffect(() => {
    localStorage.setItem('selectedOptions', JSON.stringify(selectedOptions));
    localStorage.setItem('scores', JSON.stringify(scores));
  }, [selectedOptions, scores]);

  const handleOptionSelect = (questionId, selectedOptionIndex) => {
    setSelectedOptions(prevOptions => ({
      ...prevOptions,
      [questionId]: selectedOptionIndex
    }));
  };

  const handleSubmitPage = () => {
    let newScores = { ...scores };

    if (currentPage === 1) {
      newScores = {
        score1: 0,
        score2: 0,
        score3: 0,
        score4: 0,
        score5: 0,
        score6: 0,
      };
    }

    questions.forEach(question => {
      const selectedOptionIndex = selectedOptions[question._id];
      if (selectedOptionIndex !== undefined) {
        let points = 0;
        switch (selectedOptionIndex) {
          case 0: points = 0; break; // very high
          case 1: points = 1; break; // high
          case 2: points = 2; break; // neutral
          case 3: points = 3; break; // low
          case 4: points = 4; break; // very low
          default: break;
        }

        switch (parseInt(question.type)) {
          case 1: newScores.score1 += points; break;
          case 2: newScores.score2 += points; break;
          case 3: newScores.score3 += points; break;
          case 4: newScores.score4 += points; break;
          case 5: newScores.score5 += points; break;
          case 6: newScores.score6 += points; break;
          default: break;
        }
      }
    });

    setScores(newScores);
    localStorage.setItem('scores', JSON.stringify(newScores)); // Store scores in localStorage

    console.log('Updated Scores:', newScores)

    if (currentPage === 2) {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <ResultComponent scores={scores} />
    );
  }



  // Conditional rendering based on isLoading and questions length
  if (isLoading || !questions) { // Check for !questions to prevent accessing length of undefined
    return <p className="text-center">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-4xl w-full p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-4xl font-bold text-center mb-8">Take your assessment Today!</h2>

        {/* Questions section */}
        <div className="grid gap-8 lg:grid-cols-2 sm:grid-cols-1">
          {questions.length > 0 && // Check if questions array has data
            questions.map(question => (
              <div key={question._id} className="p-4 border border-gray-200 rounded">
                <h3 className="text-xl font-semibold mb-2">{question.question}</h3>
                <ul>
                  {question.options.map((option, index) => (
                    <li key={index} className="mb-2">
                      <input
                        type="radio"
                        id={`option-${question._id}-${index}`}
                        name={`question-${question._id}`} // Ensure unique name for each question
                        value={option}
                        checked={selectedOptions[question._id] === index}
                        onChange={() => handleOptionSelect(question._id, index)}
                      />
                      <label htmlFor={`option-${question._id}-${index}`} className="ml-2">{option}</label>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
        </div>

        {/* Submit button */}
        <div className="flex justify-center mt-4">
          <button
            className="px-6 py-3 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none"
            onClick={handleSubmitPage}
          >
            Submit Page
          </button>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-between mt-4">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 focus:outline-none"
            onClick={() => setCurrentPage(prevPage => {
              if (prevPage > 1) {
                fetchQuestions(prevPage - 1);
                return prevPage - 1;
              }
              return prevPage;
            })}
          >
            Previous
          </button>
          <button
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 focus:outline-none"
            onClick={() => setCurrentPage(prevPage => {
              if (prevPage < totalPages) {
                fetchQuestions(prevPage + 1);
                return prevPage + 1;
              }
              return prevPage;
            })}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizForm;
