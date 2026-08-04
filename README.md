# TalentGraph

TalentGraph is a CognoDB-backed graph application for exploring people, teams, skills, projects, mentorship, and staffing gaps inside an organization.

This project is being built for the Wexa AI graph database assignment using React, Express, and the official Neo4j JavaScript driver for CognoDB.

## Current Status

Implementation is in progress. The repository starts with an assignment analysis in [`docs/assignment-analysis.md`](docs/assignment-analysis.md), then builds the application through small, reviewable commits.

## Required Environment

Copy `.env.example` to `.env` and fill in your CognoDB Cloud credentials:

```bash
COGNODB_URI=bolt+s://your-instance-id.databases.cognodb.cloud
COGNODB_USERNAME=cognodb
COGNODB_PASSWORD=your-generated-password
```
