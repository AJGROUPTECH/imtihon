import { useState } from 'react';
import { BookOpen, Clock, User, Users } from 'lucide-react';

const Registration = ({ onStart, subjects }) => {
  const [name, setName] = useState('');
  const [group, setGroup] = useState('');
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || '');
  const [timerLimit, setTimerLimit] = useState(10); // in minutes

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !group || !subjectId) return;
    
    onStart({
      name,
      group,
      subjectId,
      timerLimit: parseInt(timerLimit)
    });
  };

  return (
    <div className="glass-panel animate-fade-in" style={{ maxWidth: '400px', margin: '0 auto', marginTop: '10vh' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--primary)' }}>Imtihon Platformasi</h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ position: 'relative', marginBottom: '1rem' }}>
          <User size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: 'rgba(255,255,255,0.5)' }} />
          <input 
            type="text" 
            placeholder="Ism-sharifingiz" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            style={{ paddingLeft: '40px', marginBottom: '0' }}
            required
          />
        </div>

        <div style={{ position: 'relative', marginBottom: '1rem' }}>
          <Users size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: 'rgba(255,255,255,0.5)' }} />
          <input 
            type="text" 
            placeholder="Guruhingiz (masalan, 201-guruh)" 
            value={group} 
            onChange={e => setGroup(e.target.value)} 
            style={{ paddingLeft: '40px', marginBottom: '0' }}
            required
          />
        </div>

        <div style={{ position: 'relative', marginBottom: '1rem' }}>
          <BookOpen size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: 'rgba(255,255,255,0.5)' }} />
          <select 
            value={subjectId} 
            onChange={e => setSubjectId(e.target.value)}
            style={{ paddingLeft: '40px', marginBottom: '0' }}
            required
          >
            {subjects.map(sub => (
              <option key={sub.id} value={sub.id}>{sub.name}</option>
            ))}
          </select>
        </div>

        <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
          <Clock size={18} style={{ position: 'absolute', left: '12px', top: '14px', color: 'rgba(255,255,255,0.5)' }} />
          <select 
            value={timerLimit} 
            onChange={e => setTimerLimit(e.target.value)}
            style={{ paddingLeft: '40px', marginBottom: '0' }}
          >
            <option value="10">10 daqiqa (Tezkor)</option>
            <option value="15">15 daqiqa (Standart)</option>
            <option value="999">Vaqt cheklovisiz</option>
          </select>
        </div>

        <button type="submit" style={{ width: '100%' }}>Testni boshlash</button>
      </form>
    </div>
  );
};

export default Registration;
