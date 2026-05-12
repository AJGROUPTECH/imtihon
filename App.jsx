import { useState, useEffect } from 'react';
import { subjectsData } from './data';
import Registration from './components/Registration';
import Quiz from './components/Quiz';
import Result from './components/Result';
import './App.css';

// Fisher-Yates shuffle algorithm
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

function App() {
  const [appState, setAppState] = useState('registration'); // registration, quiz, result
  const [userData, setUserData] = useState(null);
  const [currentQuestions, setCurrentQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [telegramId, setTelegramId] = useState(null);

  // Setup Telegram Web App Theme if available
  useEffect(() => {
    if (window.Telegram && window.Telegram.WebApp) {
      const tg = window.Telegram.WebApp;
      tg.ready();
      tg.expand();
      if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        setTelegramId(tg.initDataUnsafe.user.id);
      }
    }
  }, []);

  const handleStartQuiz = (data) => {
    setUserData({ ...data, telegramId });
    
    // Find subject questions
    const subject = subjectsData.find(s => s.id === data.subjectId);
    if (!subject) return;

    // Shuffle all questions, take 20
    const shuffledQuestions = shuffleArray(subject.questions).slice(0, 20);

    // Also shuffle options for each question
    const processedQuestions = shuffledQuestions.map(q => ({
      ...q,
      options: shuffleArray(q.options)
    }));

    setCurrentQuestions(processedQuestions);
    setUserAnswers([]);
    setAppState('quiz');
  };

  const handleFinishQuiz = (answers) => {
    setUserAnswers(answers);
    setAppState('result');
  };

  const handleRestart = () => {
    setAppState('registration');
    setUserData(null);
    setCurrentQuestions([]);
    setUserAnswers([]);
  };

  return (
    <div className="app-container">
      {appState === 'registration' && (
        <Registration onStart={handleStartQuiz} subjects={subjectsData} />
      )}
      
      {appState === 'quiz' && (
        <Quiz 
          questions={currentQuestions} 
          timeLimitMinutes={userData.timerLimit} 
          onFinish={handleFinishQuiz} 
        />
      )}
      
      {appState === 'result' && (
        <Result 
          userData={userData}
          questions={currentQuestions}
          answers={userAnswers}
          onRestart={handleRestart}
        />
      )}
    </div>
  );
}

export default App;
