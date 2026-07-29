# content-core API Reference

## I/O Utilities

```typescript
readJSON<T>(path: string, fallback: T): T
readMD(path: string): { content: string; metadata: Record<string, string> }
listDir(dir: string): string[]
writeJSON(dir: string, filename: string, data: unknown): void
ensureDir(dir: string): void
resolvePath(...segments: string[]): string
```

## Document Repository

```typescript
getDocuments(): Document[]
getDocument(id: string): Document | undefined
getDocumentsByCategory(category: DocumentCategory): Document[]
getRecentDocuments(limit?: number): Document[]
parseMarkdownMetadata(content: string): Record<string, string>
parseJsonMetadata(content: string): Record<string, string>
```

## Collection Repository

```typescript
getCollections(): Collection[]
getCollection(id: string): Collection | undefined
```

## Entity Repository

```typescript
getEntities(): Entity[]
getEntity(id: string): Entity | undefined
getEntitiesByType(type: EntityType): Entity[]
searchEntities(query: string): Entity[]
```

## Graph & Relationships

```typescript
getRelationships(): Relationship[]
getRelationshipsBySource(sourceId: string): Relationship[]
getRelationshipsByTarget(targetId: string): Relationship[]
getRelationshipsByType(type: RelationshipType): Relationship[]
getGraphNodeNeighbors(nodeId: string): { incoming: Relationship[]; outgoing: Relationship[] }
getGraphStats(): { totalNodes: number; totalRelationships: number; ... }
getKnowledgeGraph(): GraphNode[]
getGraphNode(id: string): GraphNode | undefined
getLinkedNodes(nodeId: string): GraphNode[]
```

## Search

```typescript
getSearchIndex(): SearchDocument[]
searchAll(query: string): SearchDocument[]
searchDocuments(query: string, category?: DocumentCategory): SearchDocument[]
getContentStats(): ContentStats
```

## Publication Contract

```typescript
publishKnowledge(request: PublicationRequest): PublicationResult
publishFieldReport(source: string, entityType: string, entityId: string, data: { title, content, summary, tags? }): PublicationResult
publishImpactReport(source: string, entityType: string, entityId: string, data: { title, content, summary }): PublicationResult
publishSurveyResult(source: string, entityType: string, entityId: string, data: { title, content, summary, tags? }): PublicationResult
publishMonitoringLog(source: string, entityType: string, entityId: string, data: { title, content, summary }): PublicationResult
```

## Research Domain

```typescript
getProjects(): ResearchProject[]
getProject(id: string): ResearchProject | undefined
getProjectsByStatus(status: ResearchStatus): ResearchProject[]
getProjectsByMission(mission: string): ResearchProject[]
createProject(data: { title, principalInvestigator, mission, tags?, objectives?, deliverables? }): ResearchProject
updateProject(id: string, updates: Partial<ResearchProject>): ResearchProject
advanceProject(id: string): ResearchProject

getSources(): Source[]
getSourcesByProject(projectId: string): Source[]
addSource(data: { name, type, projectId, url?, credibility?, tags? }): Source

getEvidence(): Evidence[]
getEvidenceByProject(projectId: string): Evidence[]
addEvidence(data: { claim, sourceId, excerpt, strength, projectId, confidence? }): Evidence

getReviews(): Review[]
getReviewsByProject(projectId: string): Review[]
addReview(data: { projectId, reviewer, decision, comments }): Review

getResearchStats(): ResearchStats
```

## Forest Domain

```typescript
getMissions(): Mission[]
getMission(id: string): Mission | undefined
getMissionsByStatus(status: MissionStatus): Mission[]
createMission(data: { name, description, region, goals?, tags? }): Mission
updateMission(id: string, updates: Partial<Mission>): Mission

getSites(): Site[]
getSite(id: string): Site | undefined
getSitesByMission(missionId: string): Site[]
createSite(data: { missionId, name, description, ... }): Site

getSurveys(): Survey[]
getSurveysBySite(siteId: string): Survey[]
getSurveysByMission(missionId: string): Survey[]
createSurvey(data: { siteId, missionId, type, title, ... }): Survey

getPlantings(): Planting[]
getPlantingsBySite(siteId: string): Planting[]
getPlantingsByMission(missionId: string): Planting[]
createPlanting(data: { siteId, missionId, name, species, targetCount, ... }): Planting
updatePlanting(id: string, updates: Partial<Planting>): Planting

getMonitoring(): Monitoring[]
getMonitoringByPlanting(plantingId: string): Monitoring[]
getMonitoringByMission(missionId: string): Monitoring[]
createMonitoring(data: { siteId, missionId, type, title, ... }): Monitoring

getImpactReports(): Impact[]
getImpactByMission(missionId: string): Impact[]
createImpact(data: { missionId, title, summary, ... }): Impact

getForestStats(): ForestStats
```

## Heritage Domain

```typescript
getHeritageMissions(): HeritageMission[]
getHeritageMission(id: string): HeritageMission | undefined
createHeritageMission(data: { name, description, region, goals?, tags? }): HeritageMission

getHeritageSites(): HeritageSite[]
getHeritageSite(id: string): HeritageSite | undefined
getHeritageSitesByMission(missionId: string): HeritageSite[]
createHeritageSite(data: { missionId, name, description, ... }): HeritageSite

getHeritageAssets(): HeritageAsset[]
getHeritageAsset(id: string): HeritageAsset | undefined
getHeritageAssetsBySite(siteId: string): HeritageAsset[]
getHeritageAssetsByMission(missionId: string): HeritageAsset[]
createHeritageAsset(data: { missionId, siteId, name, assetType, condition, ... }): HeritageAsset

getAssessments(): ConditionAssessment[]
getAssessment(id: string): ConditionAssessment | undefined
getAssessmentsByAsset(assetId: string): ConditionAssessment[]
createAssessment(data: { assetId, siteId, missionId, type, title, ... }): ConditionAssessment

getDocumentations(): Documentation[]
getDocumentation(id: string): Documentation | undefined
getDocumentationsByAsset(assetId: string): Documentation[]
createDocumentation(data: { assetId, siteId, missionId, type, title, ... }): Documentation

getConservationPlans(): ConservationPlan[]
getConservationPlan(id: string): ConservationPlan | undefined
getConservationPlansByAsset(assetId: string): ConservationPlan[]
createConservationPlan(data: { assetId, siteId, missionId, title, ... }): ConservationPlan

getHeritageImpactReports(): HeritageImpact[]
getHeritageImpact(id: string): HeritageImpact | undefined
createHeritageImpact(data: { missionId, title, summary, ... }): HeritageImpact

getHeritageStats(): HeritageStats
```

## Volunteer Domain

```typescript
getVolunteers(): Volunteer[]
getVolunteer(id: string): Volunteer | undefined
createVolunteer(data: { name, email, phone?, location?, interests? }): Volunteer

getSkills(): Skill[]
getSkill(id: string): Skill | undefined
createSkill(data: { name, category, description }): Skill

getTrainings(): Training[]
getTraining(id: string): Training | undefined
getTrainingsByVolunteer(volunteerId: string): Training[]
createTraining(data: { volunteerId, title, description, category, provider, hours, ... }): Training

getAssignments(): MissionAssignment[]
getAssignment(id: string): MissionAssignment | undefined
getAssignmentsByVolunteer(volunteerId: string): MissionAssignment[]
createAssignment(data: { volunteerId, missionType, missionId, role, description }): MissionAssignment

getParticipations(): Participation[]
getParticipation(id: string): Participation | undefined
getParticipationsByVolunteer(volunteerId: string): Participation[]
createParticipation(data: { volunteerId, assignmentId, missionType, missionId, task, ... }): Participation

getRecognitions(): Recognition[]
getRecognition(id: string): Recognition | undefined
getRecognitionsByVolunteer(volunteerId: string): Recognition[]
createRecognition(data: { volunteerId, type, title, description, ... }): Recognition

getVolunteerStats(): VolunteerStats
```
