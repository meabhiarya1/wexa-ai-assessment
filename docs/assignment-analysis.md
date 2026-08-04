# Wexa AI Graph Application: Assignment Analysis

## Assignment Summary

Build a small, complete web application backed by CognoDB Cloud, a managed graph database that speaks openCypher over the Bolt protocol and works with the official Neo4j drivers.

The application must demonstrate thoughtful graph data modeling, realistic seed data, meaningful Cypher queries, and a functional UI that a non-technical user can explore.

## Required Submission Items

- GitHub repository with full source code.
- Hosted application demo link.
- Short screen recording.
- README with:
  - Use case.
  - "Why a graph database?" explanation.
  - Data model diagram.
  - Setup and run instructions.
  - CognoDB instance setup instructions.
  - Main Cypher queries explained.
  - UI screenshots.
- Seed script included in the repo.
- Environment-based database credentials.
- Graceful handling when the database is unreachable.

## Selected Use Case

The project will be an organizational skill and collaboration graph.

The app helps a company answer relationship-heavy questions:

- Who has which skills?
- Which people can fill a project skill gap?
- How are two people connected through teams, projects, or mentorship?
- Who bridges otherwise separate teams?
- What does the organization network look like as a graph?

## Why This Fits A Graph Database

This domain is fundamentally about connectedness:

- `Project -> REQUIRES_SKILL -> Skill <- HAS_SKILL <- Person` finds candidates for staffing gaps.
- `Person -> WORKS_ON -> Project <- WORKS_ON <- Person` finds collaborators.
- Variable-length paths across people, teams, projects, and mentorship explain how two people are connected.
- Bridge detection finds people who connect teams through shared project work.

These are natural graph traversals and become awkward in a relational schema because they require repeated joins, self-joins, exclusions, and recursive path searches.

## Proposed Graph Model

Nodes:

- `Person`
- `Team`
- `Skill`
- `Project`

Relationships:

- `(:Person)-[:MEMBER_OF]->(:Team)`
- `(:Person)-[:HAS_SKILL {level, years}]->(:Skill)`
- `(:Person)-[:WORKS_ON {role, since}]->(:Project)`
- `(:Person)-[:MENTORS]->(:Person)`
- `(:Project)-[:REQUIRES_SKILL {priority}]->(:Skill)`
- `(:Project)-[:OWNED_BY]->(:Team)`

## Tech Stack

- React with Vite for the frontend.
- Express with plain JavaScript for the backend API.
- Official `neo4j-driver` for CognoDB.
- Tailwind CSS for UI.
- `react-force-graph-2d` or an equivalent graph visualization library.

## Build Roadmap

1. Scaffold React, Express, JavaScript, Tailwind, and shared domain helpers.
2. Add CognoDB connection layer with env validation and health checks.
3. Add seed data and idempotent seed script.
4. Add parameterized Cypher query services.
5. Add Express routes for stats, people, projects, skill gaps, bridge people, shortest path, and graph explorer.
6. Build React dashboard, navigation, search, loading states, empty states, and database error states.
7. Build people and project workflows.
8. Build shortest-path and network explorer views.
9. Add a Cypher inspector panel so interviewers can see the graph query behind each insight.
10. Finish README, screenshots, deployment notes, and recording checklist.

## Interview Polish Ideas

- Show the exact Cypher query powering important UI panels.
- Add candidate fit scores for project staffing recommendations.
- Add clear graph legends and path explanations.
- Keep UI dense, professional, and easy to scan.
- Make database failure states explicit and non-technical.
- Keep commits small and meaningful so the project history shows thoughtful progress.
