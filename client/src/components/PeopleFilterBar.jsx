export function PeopleFilterBar({ filters, setFilters, teams, skills }) {
  return (
    <div className="filters">
      <input
        value={filters.search}
        onChange={(event) => setFilters({ ...filters, search: event.target.value })}
        placeholder="Search people"
      />
      <select value={filters.teamId} onChange={(event) => setFilters({ ...filters, teamId: event.target.value })}>
        <option value="">All teams</option>
        {teams?.map((team) => (
          <option key={team.id} value={team.id}>
            {team.name}
          </option>
        ))}
      </select>
      <select value={filters.skillId} onChange={(event) => setFilters({ ...filters, skillId: event.target.value })}>
        <option value="">Any skill</option>
        {skills?.map((skill) => (
          <option key={skill.id} value={skill.id}>
            {skill.name}
          </option>
        ))}
      </select>
    </div>
  );
}
