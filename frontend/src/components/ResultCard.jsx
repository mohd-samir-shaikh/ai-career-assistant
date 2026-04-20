function ResultCard({ result }) {
  return (
    <>
      <div className="card">
        <h3>✅ Skills</h3>
        {result.skills.map((skill, i) => (
          <p key={i}>{skill}</p>
        ))}
      </div>

      <div className="card">
        <h3>❌ Missing Skills</h3>
        {result.missingSkills.map((skill, i) => (
          <p key={i}>{skill}</p>
        ))}
      </div>

      <div className="card">
        <h3>💡 Suggestions</h3>
        {result.suggestions.map((s, i) => (
          <TypingText text={s} key={i} />
        ))}
      </div>

      <div className="card">
        <h3>🚀 Career Roles</h3>
        {result.careerRoles.map((role, i) => (
          <p key={i}>{role}</p>
        ))}
      </div>
    </>
  );
}

export default ResultCard;