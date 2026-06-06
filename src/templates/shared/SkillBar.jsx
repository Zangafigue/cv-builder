import React from 'react';

const SkillBar = ({ name, level, maxLevel = 5, showLabel = true, color = '#60a5fa', bgColor = 'rgba(0,0,0,0.1)' }) => {
  // If level is a string like "Expert", map it to a numeric value for the visual bar
  let numericLevel = 3;
  if (!isNaN(Number(level))) {
    numericLevel = Number(level);
  } else if (level) {
    const lvl = level.toLowerCase();
    if (lvl.includes('expert') || lvl.includes('avancé') || lvl.includes('advanced')) numericLevel = 5;
    else if (lvl.includes('intermédiaire') || lvl.includes('intermediate') || lvl.includes('moyen')) numericLevel = 3;
    else if (lvl.includes('débutant') || lvl.includes('beginner')) numericLevel = 1.5;
  }
  const percentage = (numericLevel / maxLevel) * 100 || 50;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', fontSize: '0.85em' }}>
        <span style={{ fontWeight: 500 }}>{name}</span>
        {showLabel && <span style={{ color: color, fontSize: '0.9em' }}>{level}</span>}
      </div>
      <div style={{ height: '4px', backgroundColor: bgColor, borderRadius: '99px', overflow: 'hidden' }}>
        <div style={{
          height: '100%',
          borderRadius: '99px',
          backgroundColor: color,
          width: `${percentage}%`
        }} />
      </div>
    </div>
  );
};

export default SkillBar;
