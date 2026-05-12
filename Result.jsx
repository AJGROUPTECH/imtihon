import { useEffect, useRef } from 'react';
import { CheckCircle, XCircle, RotateCcw, Share2 } from 'lucide-react';

const Result = ({ userData, questions, answers, onRestart }) => {
  const correctCount = answers.filter(a => a.isCorrect).length;
  const total = questions.length;
  const percentage = Math.round((correctCount / total) * 100);
  
  let resultMessage = "";
  if (percentage >= 85) resultMessage = "Ajoyib natija!";
  else if (percentage >= 60) resultMessage = "Yaxshi natija!";
  else resultMessage = "Yana tayyorlanishingiz kerak.";

  const sentRef = useRef(false);

  useEffect(() => {
    if (!sentRef.current && userData.telegramId) {
      sentRef.current = true;
      fetch('https://imtihon-gt1e.onrender.com/api/result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          telegramId: userData.telegramId,
          name: userData.name,
          group: userData.group,
          score: correctCount,
          total: total,
          percentage: percentage
        })
      }).catch(err => console.error("Natijani yuborishda xato:", err));
    }
  }, [userData, correctCount, total, percentage]);

  const handleShare = () => {
    if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.switchInlineQuery) {
      window.Telegram.WebApp.switchInlineQuery(`Mening imtihon natijam: ${percentage}%. Siz ham sinab ko'ring!`);
    } else {
      alert("Telegram Mini App ichida ulashish mumkin.");
    }
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ marginTop: '2vh', marginBottom: '2vh', maxHeight: '90vh', overflowY: 'auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ color: 'var(--primary)', marginBottom: '0.5rem' }}>Imtihon Yakunlandi</h2>
        <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>{userData.name} | {userData.group}</p>
        
        <div style={{ 
          background: 'rgba(0,0,0,0.2)', 
          padding: '1.5rem', 
          borderRadius: '50%', 
          width: '120px', 
          height: '120px', 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center',
          margin: '1.5rem auto',
          border: `4px solid ${percentage >= 60 ? 'var(--success)' : 'var(--danger)'}`
        }}>
          <h1 style={{ margin: 0, fontSize: '2.5rem' }}>{percentage}%</h1>
        </div>
        
        <h3 style={{ marginBottom: '0.5rem' }}>{correctCount} / {total} to'g'ri</h3>
        <p style={{ color: percentage >= 60 ? 'var(--success)' : 'var(--warning)' }}>{resultMessage}</p>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '2rem' }}>
        <button onClick={onRestart} style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
          <RotateCcw size={18} /> Qayta urinish
        </button>
        <button onClick={handleShare} style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', background: 'var(--success)' }}>
          <Share2 size={18} /> Ulashish
        </button>
      </div>

      <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '0.5rem' }}>Tahlil (Yodlash uchun)</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {questions.map((q, idx) => {
          const ans = answers.find(a => a.questionId === q.id);
          const isCorrect = ans ? ans.isCorrect : false;
          
          return (
            <div key={q.id} style={{ 
              background: 'rgba(0,0,0,0.2)', 
              padding: '1rem', 
              borderRadius: '8px',
              borderLeft: `4px solid ${isCorrect ? 'var(--success)' : 'var(--danger)'}`
            }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'flex-start' }}>
                {isCorrect ? <CheckCircle color="var(--success)" size={20} style={{flexShrink: 0}} /> : <XCircle color="var(--danger)" size={20} style={{flexShrink: 0}} />}
                <p style={{ margin: 0, fontSize: '0.95rem' }}><strong>{idx + 1}.</strong> {q.text}</p>
              </div>
              
              <div style={{ marginLeft: '28px', fontSize: '0.85rem' }}>
                {!isCorrect && ans && ans.selected && (
                  <p style={{ margin: '4px 0', color: 'var(--danger)' }}>Sizning javobingiz: <del>{ans.selected}</del></p>
                )}
                {!ans?.selected && (
                  <p style={{ margin: '4px 0', color: 'var(--warning)' }}>Siz javob bermadingiz.</p>
                )}
                <p style={{ margin: '4px 0', color: 'var(--success)' }}>To'g'ri javob: <strong>{q.correctAnswer}</strong></p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Result;
