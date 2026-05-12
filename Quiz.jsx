import { useState, useEffect } from 'react';
import { Timer, CheckCircle, ChevronRight } from 'lucide-react';

const Quiz = ({ questions, timeLimitMinutes, onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(timeLimitMinutes * 60);

  useEffect(() => {
    if (timeLimitMinutes === 999) return; // No limit
    
    if (timeLeft <= 0) {
      handleFinish();
      return;
    }
    
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft, timeLimitMinutes]);

  const handleFinish = () => {
    // If not all answered, fill the rest with null
    const finalAnswers = [...answers];
    if (finalAnswers.length < questions.length) {
      for (let i = finalAnswers.length; i < questions.length; i++) {
        finalAnswers.push({
          questionId: questions[i].id,
          selected: null,
          isCorrect: false
        });
      }
    }
    onFinish(finalAnswers);
  };

  const handleNext = () => {
    if (selectedOption === null) return;

    const currentQ = questions[currentIndex];
    const isCorrect = selectedOption === currentQ.correctAnswer;
    
    const newAnswers = [...answers, {
      questionId: currentQ.id,
      selected: selectedOption,
      isCorrect: isCorrect
    }];
    
    setAnswers(newAnswers);
    
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
    } else {
      // It's the last question, we finish automatically
      onFinish(newAnswers);
    }
  };

  const currentQ = questions[currentIndex];

  // Timer formatting
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeString = timeLimitMinutes === 999 ? "∞" : `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  
  // Progress bar calculation
  const progressPercent = ((currentIndex + 1) / questions.length) * 100;
  const timePercent = timeLimitMinutes === 999 ? 100 : (timeLeft / (timeLimitMinutes * 60)) * 100;

  return (
    <div className="glass-panel animate-fade-in" style={{ marginTop: '5vh' }}>
      <div className="header-flex">
        <div className="stat-badge">
          <CheckCircle size={16} /> {currentIndex + 1} / {questions.length}
        </div>
        
        {timeLimitMinutes !== 999 && (
          <div className={`stat-badge ${timeLeft < 60 ? 'text-danger' : ''}`} style={timeLeft < 60 ? {color: 'var(--danger)', borderColor: 'var(--danger)'} : {}}>
            <Timer size={16} /> {timeString}
          </div>
        )}
      </div>

      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${progressPercent}%` }}></div>
      </div>
      
      {timeLimitMinutes !== 999 && (
        <div className="progress-bar-container" style={{ height: '3px', marginBottom: '24px' }}>
          <div 
            className={`progress-bar ${timePercent < 20 ? 'danger' : timePercent < 50 ? 'warning' : ''}`} 
            style={{ width: `${timePercent}%` }}
          ></div>
        </div>
      )}

      <h3 style={{ marginBottom: '1.5rem', fontSize: '1.2rem', lineHeight: '1.4' }}>
        {currentQ.text}
      </h3>

      <div style={{ marginBottom: '2rem' }}>
        {currentQ.options.map((option, idx) => (
          <button 
            key={idx}
            className={`option-btn ${selectedOption === option ? 'selected' : ''}`}
            onClick={() => setSelectedOption(option)}
          >
            {option}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button 
          onClick={handleNext} 
          disabled={selectedOption === null}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          {currentIndex === questions.length - 1 ? 'Yakunlash' : 'Keyingisi'} 
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

export default Quiz;
