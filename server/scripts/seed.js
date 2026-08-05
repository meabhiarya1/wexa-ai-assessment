import "../src/loadEnv.js";
import { checkConnectivity, closeDriver, runRead, runWrite } from "../src/db/neo4j.js";
import { getSeedGraph } from "./seed-data.js";
import { migrations } from "../migrations/index.js";

async function main() {
  console.log("Checking CognoDB connectivity...");
  const connectivity = await checkConnectivity();

  if (!connectivity.ok) {
    console.error(connectivity.message);
    process.exitCode = 1;
    return;
  }

  const graph = getSeedGraph();

  console.log("Wiping existing graph data...");
  await runWrite("MATCH (n) DETACH DELETE n");

  console.log("Applying graph schema migrations...");
  for (const migration of migrations) {
    await migration.up({ runWrite });
  }

  console.log(`Loading ${graph.teams.length} teams...`);
  await runWrite("UNWIND $rows AS row CREATE (t:Team) SET t = row", { rows: graph.teams });

  console.log(`Loading ${graph.skills.length} skills...`);
  await runWrite("UNWIND $rows AS row CREATE (s:Skill) SET s = row", { rows: graph.skills });

  console.log(`Loading ${graph.people.length} people...`);
  await runWrite("UNWIND $rows AS row CREATE (p:Person) SET p = row", { rows: graph.people });

  console.log(`Loading ${graph.projects.length} projects...`);
  await runWrite("UNWIND $rows AS row CREATE (pr:Project) SET pr = row", { rows: graph.projects });

  console.log(`Loading ${graph.memberOf.length} MEMBER_OF relationships...`);
  await runWrite(
    `UNWIND $rows AS row
     MATCH (p:Person {id: row.personId}), (t:Team {id: row.teamId})
     CREATE (p)-[:MEMBER_OF]->(t)`,
    { rows: graph.memberOf }
  );

  console.log(`Loading ${graph.hasSkill.length} HAS_SKILL relationships...`);
  await runWrite(
    `UNWIND $rows AS row
     MATCH (p:Person {id: row.personId}), (s:Skill {id: row.skillId})
     CREATE (p)-[:HAS_SKILL {level: row.level, years: row.years}]->(s)`,
    { rows: graph.hasSkill }
  );

  console.log(`Loading ${graph.ownedBy.length} OWNED_BY relationships...`);
  await runWrite(
    `UNWIND $rows AS row
     MATCH (pr:Project {id: row.projectId}), (t:Team {id: row.teamId})
     CREATE (pr)-[:OWNED_BY]->(t)`,
    { rows: graph.ownedBy }
  );

  console.log(`Loading ${graph.requiresSkill.length} REQUIRES_SKILL relationships...`);
  await runWrite(
    `UNWIND $rows AS row
     MATCH (pr:Project {id: row.projectId}), (s:Skill {id: row.skillId})
     CREATE (pr)-[:REQUIRES_SKILL {priority: row.priority}]->(s)`,
    { rows: graph.requiresSkill }
  );

  console.log(`Loading ${graph.worksOn.length} WORKS_ON relationships...`);
  await runWrite(
    `UNWIND $rows AS row
     MATCH (p:Person {id: row.personId}), (pr:Project {id: row.projectId})
     CREATE (p)-[:WORKS_ON {role: row.role, since: row.since}]->(pr)`,
    { rows: graph.worksOn }
  );

  console.log(`Loading ${graph.mentors.length} MENTORS relationships...`);
  await runWrite(
    `UNWIND $rows AS row
     MATCH (mentor:Person {id: row.mentorId}), (mentee:Person {id: row.menteeId})
     CREATE (mentor)-[:MENTORS]->(mentee)`,
    { rows: graph.mentors }
  );

  const [summary] = await runRead(`
    MATCH (n)
    OPTIONAL MATCH ()-[r]->()
    RETURN count(DISTINCT n) AS nodes, count(DISTINCT r) AS relationships
  `);

  console.log(`Seed complete: ${summary.nodes} nodes and ${summary.relationships} relationships loaded.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await closeDriver();
  });
