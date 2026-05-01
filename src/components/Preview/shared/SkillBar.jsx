const SkillBar = ({ name, level, maxLevel = 5, showLabel = true, color = '#60a5fa', bgColor = 'rgba(0,0,0,0.1)' }) => {
  const percentage = (Number(level) / maxLevel) * 100 || 50;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', fontSize: '0.85em' }}>
        <span style={{ fontWeight: 500 }}>{name}</span>
        {showLabel && <span style={{ color: color, fontSize: '0.9em' }}>{level}/{maxLevel}</span>}
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
