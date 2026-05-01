const SectionTitle = ({ title, themeColor, style = {} }) => (
  <h3 style={{ 
    fontSize: '1.1rem', 
    color: themeColor, 
    textTransform: 'uppercase', 
    letterSpacing: '0.1em', 
    borderBottom: `2px solid ${themeColor}40`, 
    paddingBottom: '0.25rem', 
    marginBottom: '1rem', 
    fontWeight: 700,
    ...style
  }}>
    {title}
  </h3>
);

export default SectionTitle;
