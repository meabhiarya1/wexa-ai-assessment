import { NODE_LABELS } from "../src/domain/graphModel.js";

export const id = "001_create_graph_constraints_and_indexes";
export const description = "Create graph node id constraints and search indexes.";

export async function up({ runWrite }) {
  for (const label of Object.values(NODE_LABELS)) {
    await runWrite(`CREATE CONSTRAINT ${label.toLowerCase()}_id_unique IF NOT EXISTS FOR (n:${label}) REQUIRE n.id IS UNIQUE`);
  }

  await runWrite("CREATE INDEX person_name_index IF NOT EXISTS FOR (p:Person) ON (p.name)");
  await runWrite("CREATE INDEX person_title_index IF NOT EXISTS FOR (p:Person) ON (p.title)");
  await runWrite("CREATE INDEX project_name_index IF NOT EXISTS FOR (p:Project) ON (p.name)");
  await runWrite("CREATE INDEX project_status_index IF NOT EXISTS FOR (p:Project) ON (p.status)");
  await runWrite("CREATE INDEX skill_name_index IF NOT EXISTS FOR (s:Skill) ON (s.name)");
  await runWrite("CREATE INDEX skill_category_index IF NOT EXISTS FOR (s:Skill) ON (s.category)");
}
