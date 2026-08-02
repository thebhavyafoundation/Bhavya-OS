# ADR-006: Capability Execution Model

**Status:** Proposed  
**Date:** 2026-08-02  
**Deciders:** Bhavya Foundation  
**Depends On:** ADR-005 (Institutional Capability Model)  
**Depended By:** ADR-007 (Agent Architecture), ADR-008 (Service Architecture), ADR-009 (Workflow Architecture), ADR-010 (Event Architecture), ADR-011 (Knowledge Object Architecture), ADR-012 (Application Architecture)

---

## 1. Context

ADR-005 defined 156 institutional capabilities across 21 domains. This ADR defines how each capability is executed — the complete chain from institutional need to user-facing interface.

Without an execution model, capabilities are just a list. This ADR makes them operational.

**Core question:**

> "For every capability Bhavya OS must perform, what is the complete execution chain — from trigger to UI — and what components does it require?"

---

## 2. Execution Chain

Every capability in Bhavya OS follows this execution chain:

`Institution → Domain → Capability → Workflow → Skill → Agent → Service → Package → Application → UI`

### 2.1 Definitions

| Layer       | Definition                                                            | Examples                                     |
| ----------- | --------------------------------------------------------------------- | -------------------------------------------- |
| Institution | The organization Bhavya OS operates                                   | Bhavya Foundation                            |
| Domain      | Institutional function area                                           | Knowledge Management, Academics, Research    |
| Capability  | A specific function the institution must perform                      | Knowledge Ingestion, Curriculum Design       |
| Workflow    | A sequence of steps that fulfills a capability                        | PDF → Parse → Extract → Structure → Validate |
| Skill       | A model-independent instruction set that enables a workflow step      | document-processing, quality-gating          |
| Agent       | An autonomous entity that executes skills                             | knowledge-agent, curriculum-agent            |
| Service     | An API or runtime that exposes capability to other components         | knowledge-service, pipeline-service          |
| Package     | A deployable unit containing agents, services, and their dependencies | knowledge-package, education-package         |
| Application | A user-facing product that surfaces capability                        | Knowledge Browser, Lesson Studio             |
| UI          | The specific interface component the user interacts with              | Search bar, ingest form, graph viewer        |

### 2.2 Execution Principles

1. **Capability-Driven:** No component exists without a capability it serves
2. **Traceable:** Every UI element traces back through the chain to an institutional capability
3. **Composable:** Capabilities can be combined; workflows are reusable across capabilities
4. **Auditable:** Every execution produces provenance records and events
5. **Graceful Degradation:** If a downstream component fails, upstream components degrade gracefully

### 2.3 Automation Levels

| Level      | Definition                                    | Human Role                | Examples                       |
| ---------- | --------------------------------------------- | ------------------------- | ------------------------------ |
| Manual     | Human performs all steps                      | Executor                  | Strategic Planning, IRB Review |
| Assisted   | System suggests, human decides and executes   | Decision-maker + Executor | Admissions, Grant Writing      |
| Semi-Auto  | System executes, human approves key decisions | Approver                  | Scheduling, Grading            |
| Autonomous | System executes end-to-end, monitors itself   | Monitor                   | KO CRUD, Search, CI/CD         |

---

## 3. Capability Execution Specifications

Each capability is specified with 22 fields:

1. Capability ID, 2. Domain, 3. Purpose, 4. Trigger(s), 5. Inputs, 6. Outputs,
2. Preconditions, 8. Postconditions, 9. Workflow(s), 10. Skills invoked,
3. Agent(s) responsible, 12. Services required, 13. Events emitted,
4. Knowledge Objects consumed, 15. Knowledge Objects produced, 16. Permissions,
5. Provenance requirements, 18. Audit requirements, 19. Success metrics,
6. Failure handling, 21. Human approval points, 22. Automation level

---

### D01: Governance

| ID  | Capability                  | Workflow                                                                                                                      | Skills                                                        | Agent            | Services                                                       | Events                                                                          | KO In                                        | KO Out                                              | Auto     | Human Approvals                                   |
| --- | --------------------------- | ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ---------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------- | -------------------------------------------- | --------------------------------------------------- | -------- | ------------------------------------------------- |
| G01 | Board Meeting Management    | collect-agenda → distribute-packet → conduct-meeting → record-minutes → publish-resolutions → track-action-items              | document-generation, meeting-management, task-tracking        | governance-agent | document-service, notification-service, calendar-service       | meeting.scheduled, meeting.minutes.published, action.assigned, action.completed | governance policies, previous minutes        | meeting minutes KO, resolution KOs, action item KOs | Assisted | Minutes approval, resolution adoption             |
| G02 | Strategic Planning          | gather-data → swot-analysis → stakeholder-input → draft-plan → board-review → publish → assign-kpis                           | data-analysis, report-generation, strategic-modeling          | governance-agent | analytics-service, document-service, notification-service      | plan.drafted, plan.approved, kpi.assigned                                       | previous strategic plans, SWOT data          | strategic plan KO, KPI KOs                          | Manual   | ALL — strategic planning is human-driven          |
| G03 | Policy Lifecycle Management | identify-need → draft-policy → legal-review → committee-review → board-approve → publish → train → monitor → sunset           | document-generation, compliance-checking, training-management | governance-agent | document-service, compliance-service, notification-service     | policy.drafted, policy.approved, policy.published, policy.sunset                | existing policies, regulatory updates        | policy KO, training record KOs                      | Assisted | Committee review, board approval, legal sign-off  |
| G04 | Accreditation Management    | map-standards → collect-evidence → draft-self-study → internal-review → submit → respond-to-feedback → implement-improvements | document-generation, data-aggregation, compliance-checking    | governance-agent | analytics-service, document-service, compliance-service        | accreditation.cycle.started, self-study.submitted                               | accreditation standards, program assessments | self-study KO, improvement plan KO                  | Assisted | Self-study approval, improvement plan approval    |
| G05 | Risk Assessment             | collect-risk-data → assess-probability-impact → prioritize → assign-mitigation → track → report                               | data-analysis, risk-modeling, dashboard-generation            | governance-agent | analytics-service, quality-gates-service, notification-service | risk.identified, risk.assessed, mitigation.assigned                             | incident reports, audit findings             | risk assessment KOs, mitigation plan KOs            | Assisted | Risk prioritization, mitigation approval          |
| G06 | Institutional Effectiveness | collect-metrics → benchmark → analyze-gaps → draft-report → board-review → assign-actions → track                             | data-analysis, report-generation, benchmarking                | governance-agent | analytics-service, document-service                            | effectiveness.report.published, action.assigned                                 | assessment data, enrollment data             | effectiveness report KO, action plan KOs            | Assisted | Board review, action plan approval                |
| G07 | Shared Governance           | collect-topics → distribute-agenda → conduct-meeting → record-minutes → publish → collect-feedback → respond                  | document-generation, meeting-management, communication        | governance-agent | document-service, notification-service                         | shared-governance.meeting.held, feedback.received                               | policy drafts, budget proposals              | meeting minutes KOs                                 | Assisted | Agenda setting, minutes approval                  |
| G08 | Trust Deed Management       | review-deed → check-compliance → draft-amendments → board-approve → file → archive                                            | document-management, compliance-checking, legal-review        | governance-agent | document-service, compliance-service, legal-service            | deed.reviewed, amendment.approved, compliance.filed                             | trust deed, regulatory requirements          | compliance certificate KOs, amendment KOs           | Manual   | ALL — trust deed changes require board resolution |

**D01 Summary:** 8 capabilities, 6 Assisted, 2 Manual, 0 Autonomous. Primary agent: governance-agent.

---

### D02: Administration

| ID  | Capability              | Workflow                                                                                                         | Skills                                                                | Agent           | Services                                                      | Events                                                  | KO In                                   | KO Out                                       | Auto     | Human Approvals                                   |
| --- | ----------------------- | ---------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- | --------------- | ------------------------------------------------------------- | ------------------------------------------------------- | --------------------------------------- | -------------------------------------------- | -------- | ------------------------------------------------- |
| A01 | Admissions Processing   | receive-application → validate-completeness → route-to-committee → score → deliberate → decide → notify → enroll | document-processing, scoring, notification, enrollment                | admin-agent     | application-service, notification-service, enrollment-service | application.received, decision.made, student.enrolled   | applicant data, rubrics                 | decision KOs, enrollment KOs                 | Assisted | Committee deliberation, edge-case decisions       |
| A02 | Registrar Operations    | receive-submission → validate → record → maintain → respond-to-requests → audit                                  | record-management, degree-audit, transcript-generation                | admin-agent     | sis-service, document-service, notification-service           | grade.recorded, transcript.requested, degree.audited    | enrollment data, grade data             | transcript KOs, degree audit KOs             | High     | Grade changes, petition decisions                 |
| A03 | Schedule Building       | collect-requests → map-rooms → resolve-conflicts → optimize → publish → handle-swap-requests                     | constraint-scheduling, optimization, conflict-resolution              | admin-agent     | scheduling-service, notification-service                      | schedule.drafted, schedule.published, conflict.resolved | course requests, room data              | schedule KO, room assignment KOs             | Medium   | Final schedule approval, swap decisions           |
| A04 | Student Registration    | receive-request → check-prerequisites → check-capacity → confirm-or-waitlist → process-add-drop → update-records | prerequisite-checking, enrollment-processing, notification            | admin-agent     | enrollment-service, sis-service, notification-service         | registration.received, enrollment.confirmed             | prerequisite rules, enrollment data     | enrollment KOs, waitlist KOs                 | High     | Prerequisite overrides, capacity exceptions       |
| A05 | HR Management           | post-job → screen-applicants → interview → hire → onboard → manage-benefits → conduct-reviews                    | applicant-tracking, benefits-management, performance-tracking         | admin-agent     | hr-service, payroll-service, notification-service             | job.posted, employee.hired, review.completed            | job descriptions, applicant data        | employee KOs, review KOs                     | Medium   | Hiring decisions, benefits elections              |
| A06 | Procurement             | submit-requisition → approve → solicit-quotes → evaluate → award → receive → pay → track                         | vendor-management, purchase-order-processing, contract-tracking       | admin-agent     | procurement-service, finance-service, contract-service        | requisition.submitted, po.created, payment.processed    | vendor data, contract terms             | purchase order KOs, contract KOs             | High     | Requisition approval, vendor selection            |
| A07 | Space Management        | collect-requests → assess-availability → assign → optimize → track-utilization → plan-renovations                | space-optimization, utilization-tracking, capacity-planning           | admin-agent     | facilities-service, analytics-service                         | space.assigned, utilization.updated                     | space inventory, enrollment data        | space assignment KOs, utilization report KOs | Medium   | Space assignment decisions, renovation priorities |
| A08 | Enrollment Management   | analyze-pipeline → set-targets → design-strategies → execute → measure-yield → adjust                            | data-analysis, yield-modeling, strategy-design                        | admin-agent     | analytics-service, admissions-service, financial-aid-service  | enrollment.target.set, yield.strategy.executed          | admissions data, financial aid data     | enrollment target KOs, yield strategy KOs    | Medium   | Target approval, strategy decisions               |
| A09 | Orientation Onboarding  | assign-mentors → distribute-schedule → conduct-orientation → clear-holds → create-plans → follow-up              | event-management, student-onboarding, mentor-matching                 | admin-agent     | notification-service, enrollment-service, calendar-service    | orientation.scheduled, student.oriented                 | student data, orientation program       | orientation record KOs, academic plan KOs    | Medium   | Hold clearance, academic plan approval            |
| A10 | Records Retention       | inventory → classify → apply-schedule → disposition → archive → report                                           | document-management, classification, disposition                      | admin-agent     | document-service, compliance-service                          | record.classified, record.disposed                      | retention schedules, document inventory | disposition report KOs, archive record KOs   | High     | Disposition approval, legal hold decisions        |
| A11 | Emergency Management    | assess-threats → update-plans → conduct-drills → respond → debrief → update-plans                                | emergency-notification, incident-management, plan-maintenance         | admin-agent     | notification-service, emergency-service, calendar-service     | emergency.declared, drill.conducted                     | emergency plans, threat assessments     | updated EOP KOs, incident report KOs         | Low      | Emergency declaration, plan approval              |
| A12 | Institutional Research  | receive-request → query-data → analyze → visualize → report → recommend                                          | data-analysis, visualization, report-generation, statistical-modeling | analytics-agent | analytics-service, data-warehouse-service                     | report.requested, report.delivered                      | SIS data, survey data                   | report KOs, dashboard KOs                    | Medium   | Report approval, recommendation decisions         |
| A13 | Title IX Administration | receive-complaint → investigate → determine → implement-remedies → train → survey → report                       | investigation-management, compliance-tracking, training-management    | admin-agent     | compliance-service, notification-service, training-service    | complaint.file, investigation.completed                 | complaints, investigation data          | investigation KOs, training compliance KOs   | Low      | Investigation outcomes, remedy decisions          |

**D02 Summary:** 13 capabilities, 5 High, 4 Medium, 2 Assisted, 2 Low. Primary agents: admin-agent, analytics-agent.

---

### D03: Academics

| ID   | Capability                     | Workflow                                                                                                                    | Skills                                                                         | Agent            | Services                                                   | Events                                                  | KO In                                         | KO Out                                         | Auto     | Human Approvals                                   |
| ---- | ------------------------------ | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ---------------- | ---------------------------------------------------------- | ------------------------------------------------------- | --------------------------------------------- | ---------------------------------------------- | -------- | ------------------------------------------------- |
| AC01 | Curriculum Design              | identify-need → research → draft-proposals → committee-review → approve → publish → implement                               | curriculum-design, document-generation, standards-mapping                      | curriculum-agent | document-service, compliance-service, notification-service | curriculum.proposed, curriculum.approved                | industry data, accreditation standards        | course proposal KOs, syllabus KOs              | Low      | Committee review, board approval for new programs |
| AC02 | Teaching & Instruction         | prepare-content → deliver → engage → assess → provide-feedback → iterate                                                    | lesson-delivery, engagement-tracking, assessment-administration                | curriculum-agent | lms-service, assessment-service, analytics-service         | content.delivered, engagement.logged                    | lesson KOs, assessment KOs                    | engagement KOs, formative assessment KOs       | Low      | Content selection, assessment design              |
| AC03 | Grading & Assessment           | collect-submissions → apply-rubric → grade → provide-feedback → record → release                                            | rubric-scoring, feedback-generation, grade-recording                           | curriculum-agent | assessment-service, sis-service, notification-service      | submission.received, grade.recorded                     | submissions, rubrics                          | grade KOs, feedback KOs                        | Medium   | Grade disputes, rubric interpretation             |
| AC04 | Academic Advising              | pull-records → run-audit → meet-student → create-plan → recommend → document → follow-up                                    | degree-audit, academic-planning, student-advising                              | curriculum-agent | sis-service, degree-audit-service, calendar-service        | advising.session.held, plan.created                     | degree requirements, student records          | academic plan KOs, recommendation KOs          | Medium   | Plan approval, override decisions                 |
| AC05 | Degree Audit & Certification   | receive-application → run-audit → verify-requirements → resolve-deficiencies → certify → issue-diploma → release-transcript | degree-audit, certification, document-generation                               | curriculum-agent | degree-audit-service, sis-service, document-service        | graduation.applied, degree.certified                    | completed coursework, degree requirements     | degree certification KOs, diploma KOs          | High     | Certification approval, deficiency waivers        |
| AC06 | Academic Integrity             | receive-report → investigate → interview → determine → sanction → educate → monitor                                         | investigation-management, evidence-analysis, case-management                   | curriculum-agent | compliance-service, notification-service, record-service   | violation.reported, investigation.completed             | integrity policy, evidence                    | case KOs, sanction KOs                         | Manual   | ALL — integrity cases require human judgment      |
| AC07 | Syllabus Management            | distribute-template → collect-submissions → review → approve → archive → report                                             | document-management, compliance-checking, repository-management                | curriculum-agent | document-service, compliance-service                       | syllabus.submitted, syllabus.approved                   | syllabus templates, accreditation standards   | syllabus KOs, compliance report KOs            | Medium   | Syllabus approval                                 |
| AC08 | Grade Appeals                  | receive-petition → review → convene-committee → decide → update-records → notify                                            | case-management, grade-audit, decision-documentation                           | curriculum-agent | sis-service, notification-service, document-service        | appeal.filed, appeal.decided                            | student petitions, grade records              | appeal KOs, decision KOs                       | Manual   | ALL — grade appeals require human judgment        |
| AC09 | Academic Calendar              | draft-calendar → collect-input → board-approve → publish → distribute                                                       | calendar-management, document-generation, notification                         | curriculum-agent | calendar-service, document-service, notification-service   | calendar.drafted, calendar.approved                     | holiday schedules, accreditation requirements | academic calendar KO                           | Medium   | Board approval                                    |
| AC10 | Course Evaluations             | configure-surveys → distribute → collect → analyze → report → share-with-faculty                                            | survey-administration, data-analysis, report-generation                        | curriculum-agent | survey-service, analytics-service, notification-service    | evaluation.opened, evaluation.completed                 | evaluation surveys, student rosters           | evaluation report KOs, faculty performance KOs | High     | Report distribution decisions                     |
| AC11 | Honors Program                 | accept-applications → review → admit → assign-mentors → evaluate-thesis → designate                                         | application-processing, thesis-evaluation, student-tracking                    | curriculum-agent | sis-service, notification-service, document-service        | honors.applied, thesis.submitted, honors.designated     | applications, GPA data                        | honors admission KOs, thesis KOs               | Low      | Admission decisions, thesis evaluation            |
| AC12 | Study Abroad                   | establish-partners → recruit-students → accept-applications → approve → prepare → place → monitor → reimport                | partner-management, application-processing, credit-transfer, safety-monitoring | curriculum-agent | enrollment-service, document-service, notification-service | studyabroad.applied, credits.transferred                | partner agreements, student applications      | placement KOs, credit transfer KOs             | Medium   | Application approval, credit evaluation           |
| AC13 | Graduate Milestones            | set-milestones → track-progress → receive-submission → committee-review → record → update-progression                       | milestone-tracking, committee-management, progress-recording                   | curriculum-agent | sis-service, notification-service, document-service        | milestone.set, milestone.submitted, milestone.completed | degree requirements, student records          | milestone KOs, progression KOs                 | Medium   | Milestone approval, committee decisions           |
| AC14 | Adjunct Management             | identify-needs → match-availability → verify-credentials → assign-courses → contract → onboard                              | credential-verification, contract-management, course-assignment                | curriculum-agent | hr-service, enrollment-service, document-service           | adjunct.matched, contract.sent, course.assigned         | department needs, adjunct profiles            | contract KOs, assignment KOs                   | Medium   | Course assignment, contract approval              |
| AC15 | Curriculum Standards Alignment | load-standards → map-curriculum → analyze-alignment → identify-gaps → remediate → verify → report                           | standards-mapping, gap-analysis, curriculum-design, NLP-analysis               | curriculum-agent | analytics-service, document-service, compliance-service    | alignment.analyzed, gaps.identified                     | standards data, curriculum documents          | alignment map KOs, gap analysis KOs            | Assisted | Alignment verification, remediation decisions     |

**D03 Summary:** 15 capabilities, 2 High, 5 Medium, 4 Low, 3 Manual, 1 Assisted. Primary agent: curriculum-agent.

---

### D04: Research

| ID  | Capability                 | Workflow                                                                                               | Skills                                                                     | Agent          | Services                                                   | Events                                              | KO In                                      | KO Out                                     | Auto     | Human Approvals                                           |
| --- | -------------------------- | ------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- | -------------- | ---------------------------------------------------------- | --------------------------------------------------- | ------------------------------------------ | ------------------------------------------ | -------- | --------------------------------------------------------- |
| R01 | Grant Proposal Development | identify-funding → draft-proposal → build-budget → compliance-check → internal-review → submit → track | grant-writing, budget-building, compliance-checking, document-generation   | research-agent | document-service, compliance-service, notification-service | proposal.drafted, proposal.submitted                | RFP data, faculty profiles                 | proposal KOs, budget KOs                   | Assisted | Proposal approval, budget approval, PI sign-off           |
| R02 | Grant Administration       | receive-award → set-up-account → track-expenditures → generate-reports → submit → close-out            | financial-tracking, report-generation, compliance-monitoring               | research-agent | finance-service, compliance-service, document-service      | award.activated, report.submitted                   | award documents, expenditure data          | financial report KOs, progress report KOs  | Medium   | Expenditure approval, report approval                     |
| R03 | IRB Review                 | submit-protocol → assign-reviewers → review → determine → communicate → monitor → continuing-review    | protocol-review, compliance-monitoring, notification                       | research-agent | compliance-service, notification-service, document-service | protocol.submitted, protocol.approved               | protocols, consent forms                   | approval KOs, monitoring KOs               | Manual   | ALL — IRB review is inherently human                      |
| R04 | Publication Pipeline       | prepare-manuscript → submit → peer-review → revise → accept → publish → index → track-citations        | manuscript-preparation, submission-processing, citation-tracking           | research-agent | document-service, notification-service, analytics-service  | manuscript.submitted, article.published             | manuscripts, reviewer reports              | publication KOs, citation KOs              | Assisted | Author approval, submission decisions                     |
| R05 | Technology Transfer        | disclose → evaluate → patent → market → license → distribute-royalties                                 | patent-analysis, market-assessment, license-management                     | research-agent | legal-service, document-service, finance-service           | invention.disclosed, patent.filed, license.executed | invention disclosures, patent data         | patent KOs, license KOs                    | Low      | Disclosure evaluation, patent decisions, license approval |
| R06 | Lab Safety Management      | inspect → identify-hazards → remediate → train → monitor → report                                      | safety-inspection, training-management, incident-tracking                  | research-agent | compliance-service, training-service, notification-service | inspection.conducted, hazard.identified             | inspection reports, training records       | safety report KOs, training compliance KOs | Medium   | Safety decisions, remediation priorities                  |
| R07 | Research Data Management   | create-dmp → implement-storage → apply-metadata → share → preserve → archive                           | data-management, metadata-application, repository-management               | research-agent | storage-service, metadata-service, repository-service      | dmp.created, data.deposited                         | funder requirements, DMP templates         | DMP KOs, dataset KOs                       | Medium   | DMP approval, sharing decisions                           |
| R08 | Research Integrity         | receive-allegation → assess → investigate → determine → impose-sanctions → notify → monitor            | investigation-management, evidence-analysis, case-management               | research-agent | compliance-service, legal-service, notification-service    | allegation.received, investigation.completed        | allegations, evidence                      | investigation KOs, sanction KOs            | Manual   | ALL — integrity investigation requires human judgment     |
| R09 | Core Facilities            | receive-request → check-availability → schedule → train-user → maintain → track-usage                  | equipment-scheduling, usage-tracking, maintenance-management               | research-agent | scheduling-service, training-service, maintenance-service  | equipment.requested, maintenance.completed          | equipment inventory, maintenance schedules | usage record KOs, maintenance log KOs      | Medium   | Equipment allocation, maintenance decisions               |
| R10 | Research Impact Assessment | collect-data → analyze-impact → draft-case-studies → visualize → report → share                        | bibliometric-analysis, impact-assessment, visualization, report-generation | research-agent | analytics-service, document-service, visualization-service | impact.assessed, report.generated                   | publication records, citation data         | impact report KOs, case study KOs          | Assisted | Case study approval, report publication                   |
| R11 | Data Management & Sharing  | curate → apply-metadata → quality-check → deposit → assign-DOI → publish                               | data-curation, metadata-application, repository-management                 | research-agent | repository-service, metadata-service, notification-service | dataset.curated, doi.assigned                       | raw datasets, metadata schemas             | curated dataset KOs, DOI KOs               | Assisted | Sharing decisions, metadata approval                      |
| R12 | Conference Organization    | plan → solicit-papers → review → schedule → register → host → publish-proceedings                      | event-management, paper-review, proceedings-publication                    | research-agent | event-service, document-service, notification-service      | conference.planned, conference.held                 | CFPs, venue data                           | program KOs, proceedings KOs               | Assisted | Program approval, keynote selection                       |

**D04 Summary:** 12 capabilities, 2 Manual, 5 Medium, 3 Assisted, 1 Low, 1 High. Primary agent: research-agent.

---

### D05: Knowledge Management

| ID   | Capability                   | Workflow                                                                                                                  | Skills                                                                       | Agent           | Services                                                                 | Events                                               | KO In                           | KO Out                                   | Auto       | Human Approvals                              |
| ---- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | --------------- | ------------------------------------------------------------------------ | ---------------------------------------------------- | ------------------------------- | ---------------------------------------- | ---------- | -------------------------------------------- |
| KM01 | Knowledge Object CRUD        | receive-input → validate → structure → enrich → store → index → version                                                   | knowledge-structuring, json-validation, indexing                             | knowledge-agent | knowledge-service, storage-service, index-service                        | ko.created, ko.updated, ko.deleted                   | templates, existing KOs         | knowledge object KOs                     | High       | Quality review for critical KOs              |
| KM02 | Knowledge Ingestion          | receive-source → extract-text → parse-structure → identify-concepts → generate-KO → validate-quality → store → emit-event | document-processing, text-extraction, concept-identification, quality-gating | knowledge-agent | knowledge-service, quality-gates-service, storage-service, event-service | ingestion.started, ingestion.completed, ko.generated | source documents, quality rules | ingested KOs, ingestion reports          | Autonomous | Quality review for low-scoring KOs           |
| KM03 | Knowledge Graph Construction | load-KOs → extract-concepts → identify-relationships → build-edges → cluster → index → visualize                          | graph-construction, relationship-extraction, clustering, visualization       | knowledge-agent | graph-service, index-service, visualization-service                      | graph.rebuilt, relationship.added                    | KOs, ontologies                 | graph structure KOs, relationship KOs    | Autonomous | Relationship validation for critical domains |
| KM04 | Knowledge Search             | receive-query → expand-query → search-index → search-vectors → merge-rank → format-results → return                       | query-expansion, vector-search, keyword-search, result-ranking               | knowledge-agent | search-service, vector-service, index-service                            | search.executed, search.result.clicked               | indexed KOs, query logs         | search result KOs (ephemeral)            | Autonomous | None                                         |
| KM05 | Knowledge Validation         | select-KOs → apply-quality-rules → score → flag-issues → expert-review → validate-or-flag → update                        | quality-scoring, source-verification, expert-routing                         | knowledge-agent | quality-gates-service, notification-service                              | validation.started, ko.validated, ko.flagged         | KOs, quality rules              | validation report KOs                    | Assisted   | Expert review for flagged KOs                |
| KM06 | Knowledge Federation         | receive-request → authenticate → apply-sharing-policy → synchronize → validate → log-access                               | federation-protocol, authentication, policy-enforcement                      | knowledge-agent | federation-service, auth-service, logging-service                        | federation.requested, ko.shared                      | KOs, sharing policies           | shared KO KOs, federation graph KOs      | Autonomous | Federation approval for sensitive KOs        |
| KM07 | Concept Mapping              | load-graph → select-scope → layout → render → interact → track                                                            | graph-visualization, layout-algorithm, interactive-rendering                 | knowledge-agent | visualization-service, graph-service                                     | visualization.generated                              | graph data, KOs                 | visualization KOs (ephemeral)            | Autonomous | None                                         |
| KM08 | Knowledge Evolution          | detect-changes → diff-versions → summarize → archive-old → notify-stakeholders → update-index                             | version-control, diff-analysis, change-notification                          | knowledge-agent | version-service, notification-service, storage-service                   | ko.versioned, change.summarized                      | version histories, change logs  | version timeline KOs, change summary KOs | Autonomous | Deprecation decisions                        |

**D05 Summary:** 8 capabilities, 5 Autonomous, 1 Assisted, 1 High, 1 Medium. Primary agent: knowledge-agent.

---

### D06: Library

| ID  | Capability              | Workflow                                                                                               | Skills                                                           | Agent         | Services                                                   | Events                                       | KO In                               | KO Out                                   | Auto   | Human Approvals                                 |
| --- | ----------------------- | ------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------- | ------------- | ---------------------------------------------------------- | -------------------------------------------- | ----------------------------------- | ---------------------------------------- | ------ | ----------------------------------------------- |
| L01 | Cataloging & Metadata   | receive-material → classify → describe → create-record → index → publish-to-discovery                  | cataloging, metadata-creation, authority-control                 | library-agent | catalog-service, metadata-service, discovery-service       | material.cataloged, record.published         | MARC records, metadata schemas      | catalog record KOs, authority record KOs | High   | Complex cataloging decisions                    |
| L02 | Collection Development  | collect-requests → analyze-gaps → evaluate-options → acquire → assess → renew                          | collection-analysis, vendor-management, budget-management        | library-agent | catalog-service, finance-service, analytics-service        | material.requested, material.acquired        | faculty requests, usage data        | acquisition KOs, assessment report KOs   | Medium | Acquisition approval, budget allocation         |
| L03 | Interlibrary Loan       | receive-request → verify-not-held → identify-lender → request → receive → deliver → return → track     | ILL-processing, loan-tracking, partner-management                | library-agent | catalog-service, notification-service, tracking-service    | ill.requested, ill.fulfilled                 | user requests, partner holdings     | ILL request KOs, loan record KOs         | High   | Complex request decisions                       |
| L04 | Digital Collections     | select → digitize → describe → quality-check → ingest → preserve → provide-access                      | digitization, metadata-creation, preservation, access-management | library-agent | repository-service, metadata-service, storage-service      | material.digitized, collection.ingested      | source materials, metadata schemas  | digital collection KOs, metadata KOs     | Medium | Selection for digitization, access restrictions |
| L05 | Reference Services      | receive-question → assess → search →指导 → create-guide → track                                        | reference-interview, research-strategy, instruction-design       | library-agent | search-service, document-service, analytics-service        | reference.received, guide.created            | reference FAQs, research guides     | research guide KOs                       | Medium | Complex research consultations                  |
| L06 | Circulation             | checkout → track-due-date → send-reminders → process-returns → manage-holds → generate-stats           | circulation-processing, hold-management, notification            | library-agent | ils-service, notification-service, analytics-service       | item.checked-out, item.returned, hold.filled | patron accounts, item records       | circulation record KOs, stats KOs        | High   | Override decisions, fine waivers                |
| L07 | Course Reserves         | receive-request → check-availability → place-on-reserve → digitize-if-needed → notify → manage-returns | reserve-processing, copyright-compliance, digitization           | library-agent | catalog-service, notification-service, digital-service     | reserve.requested, reserve.placed            | faculty requests, copyright rules   | reserve list KOs, e-reserve KOs          | Medium | Copyright decisions                             |
| L08 | Special Collections     | receive-offer → evaluate → acquire → process → create-finding-aid → preserve → provide-access          | archival-processing, preservation, finding-aid-creation          | library-agent | storage-service, document-service, access-service          | collection.acquired, finding-aid.published   | donation offers, archival standards | finding aid KOs, preservation KOs        | Low    | Acquisition decisions, access restrictions      |
| L09 | Information Literacy    | receive-request → design-session → deliver → assess → publish-tutorial → track                         | instruction-design, session-delivery, tutorial-creation          | library-agent | document-service, analytics-service, lms-service           | session.scheduled, tutorial.published        | ACRL standards, course assignments  | instruction session KOs, tutorial KOs    | Medium | Instruction design                              |
| L10 | Scholarly Communication | receive-inquiry → research → advise → assist-deposit → track                                           | OA-consulting, rights-advisory, repository-management            | library-agent | repository-service, document-service, notification-service | consultation.completed, deposit.made         | publisher policies, funder mandates | consultation record KOs, deposit KOs     | Medium | Complex rights decisions                        |

**D06 Summary:** 10 capabilities, 3 High, 5 Medium, 1 Low, 1 Assisted. Primary agent: library-agent.

---

### D07: Publications

| ID  | Capability               | Workflow                                                                                               | Skills                                                               | Agent              | Services                                                     | Events                                           | KO In                                | KO Out                             | Auto     | Human Approvals                                  |
| --- | ------------------------ | ------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------- | ------------------ | ------------------------------------------------------------ | ------------------------------------------------ | ------------------------------------ | ---------------------------------- | -------- | ------------------------------------------------ |
| P01 | Journal Management       | receive-submission → editorial-review → peer-review → accept → produce → publish → index → track-usage | editorial-management, production-management, DOI-minting, indexation | publications-agent | publication-service, notification-service, analytics-service | submission.received, issue.published, doi.minted | manuscripts, editorial policies      | issue KOs, article KOs, DOI KOs    | High     | Editorial decisions, production approvals        |
| P02 | Peer Review Coordination | assign-reviewers → invite → collect-reviews → compile → editor-decide → communicate                    | reviewer-matching, review-tracking, decision-documentation           | publications-agent | notification-service, document-service, analytics-service    | review.invited, review.submitted, decision.made  | manuscripts, reviewer profiles       | review report KOs, decision KOs    | Assisted | ALL — editorial decisions require human judgment |
| P03 | Conference Proceedings   | collect-papers → format → review → produce → publish → index → archive                                 | proceedings-production, DOI-minting, indexation                      | publications-agent | publication-service, DOI-service, archive-service            | proceedings.submitted, proceedings.published     | accepted papers, author agreements   | proceedings KOs, DOI KOs           | High     | Final proof approval                             |
| P04 | Book Publishing          | receive-manuscript → peer-review → accept → copyedit → design → produce → publish → distribute         | book-production, copyediting, design, distribution                   | publications-agent | publication-service, ISBN-service, distribution-service      | book.accepted, book.published                    | manuscripts, peer reviews            | book KOs, ISBN KOs                 | Medium   | Editorial decisions, design approval             |
| P05 | Preprint Management      | receive-manuscript → validate → assign-DOI → post → track-citations                                    | preprint-posting, DOI-minting, citation-tracking                     | publications-agent | publication-service, DOI-service, analytics-service          | preprint.posted, doi.minted                      | manuscripts, author metadata         | preprint KOs, DOI KOs              | High     | Content screening                                |
| P06 | Open Access Compliance   | check-funder-mandate → verify-compliance → deposit → track → report                                    | compliance-checking, repository-management, report-generation        | publications-agent | compliance-service, repository-service, analytics-service    | compliance.checked, deposit.made                 | funder mandates, publication records | compliance report KOs, deposit KOs | High     | Compliance exception decisions                   |

**D07 Summary:** 6 capabilities, 4 High, 1 Medium, 1 Assisted. Primary agent: publications-agent.

---

### D08: Media

| ID  | Capability             | Workflow                                                                                                                 | Skills                                                       | Agent        | Services                                              | Events                                           | KO In                                     | KO Out                                 | Auto       | Human Approvals               |
| --- | ---------------------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------ | ------------ | ----------------------------------------------------- | ------------------------------------------------ | ----------------------------------------- | -------------------------------------- | ---------- | ----------------------------- |
| M01 | Video Production       | receive-request → load-KO → generate-script → create-visual-spec → render → add-captions → generate-transcript → publish | hyperframes, media-use, captions-overlay, faceless-explainer | video-agent  | video-service, storage-service, notification-service  | video.requested, video.rendered, video.published | knowledge objects, visual specs           | video KOs, transcript KOs, caption KOs | Autonomous | Script approval, final review |
| M02 | Audio Production       | receive-script → generate-TTS → process-audio → mix → transcribe → publish                                               | tts-generation, audio-processing, transcription, mixing      | video-agent  | audio-service, storage-service, transcription-service | audio.generated, audio.mixed, audio.published    | scripts, voice profiles                   | audio KOs, transcript KOs              | Autonomous | Voice selection, final review |
| M03 | Image Production       | receive-brief → generate → brand-check → refine → export → publish                                                       | image-generation, brand-compliance, design                   | design-agent | image-service, storage-service, brand-service         | image.generated, image.published                 | design briefs, brand guidelines           | image KOs, design asset KOs            | Autonomous | Brand compliance approval     |
| M04 | Design System          | define-requirement → create-token → build-component → test → document → publish                                          | design-system, ui-styling, accessibility                     | design-agent | design-system-service, documentation-service          | token.created, component.published               | brand guidelines, accessibility standards | token KOs, component KOs               | High       | Design approval               |
| M05 | Caption & Subtitle     | receive-media → load-transcript → sync-timing → generate-captions → embed → validate-accessibility → publish             | captions-overlay, timing-sync, accessibility-validation      | video-agent  | caption-service, storage-service                      | caption.generated, caption.embedded              | media files, transcripts                  | caption KOs, accessibility report KOs  | Autonomous | Caption review for accuracy   |
| M06 | Media Asset Management | receive-media → tag → organize → store → serve → track-usage → analyze                                                   | asset-management, metadata-tagging, usage-tracking           | design-agent | dam-service, storage-service, analytics-service       | media.ingested, media.accessed                   | media files, metadata schemas             | media asset KOs, usage analytics KOs   | High       | Access restriction decisions  |

**D08 Summary:** 6 capabilities, 3 Autonomous, 2 High, 1 Medium. Primary agents: video-agent, design-agent.

---

### D09: Community

| ID  | Capability             | Workflow                                                                                           | Skills                                                   | Agent           | Services                                                              | Events                                     | KO In                                         | KO Out                                   | Auto   | Human Approvals                          |
| --- | ---------------------- | -------------------------------------------------------------------------------------------------- | -------------------------------------------------------- | --------------- | --------------------------------------------------------------------- | ------------------------------------------ | --------------------------------------------- | ---------------------------------------- | ------ | ---------------------------------------- |
| C01 | Outreach Programs      | assess-needs → identify-partners → design-program → deliver → track-impact → maintain              | needs-assessment, partner-management, program-design     | community-agent | partnership-service, analytics-service, notification-service          | outreach.started, partnership.formed       | demographic data, partner profiles            | outreach KOs, partnership KOs            | Low    | Partnership approval, program design     |
| C02 | Event Management       | receive-proposal → evaluate → schedule → promote → host → collect-feedback → report                | event-management, venue-scheduling, promotion, ticketing | community-agent | event-service, venue-service, ticketing-service, notification-service | event.proposed, event.approved, event.held | event proposals, venue data                   | event KOs, attendance KOs, feedback KOs  | Medium | Event approval, budget approval          |
| C03 | Service Learning       | identify-needs → match-courses → design-programs → deliver → track-hours → measure-impact → report | program-design, impact-tracking, partner-management      | community-agent | partnership-service, analytics-service, document-service              | service-learning.launched, hours.logged    | community needs, course designs               | service-learning KOs, impact report KOs  | Low    | Course approval, impact assessment       |
| C04 | Continuing Education   | assess-needs → design-courses → market → enroll → deliver → assess → certify → track               | course-design, marketing, enrollment, certification      | community-agent | enrollment-service, certification-service, marketing-service          | ce.course.offered, ce.certified            | workforce needs, certification requirements   | CE course KOs, certificate KOs           | Medium | Course approval, certification decisions |
| C05 | Civic Engagement       | track-elections → design-drives → promote → register → educate → track-participation               | voter-registration, civic-education, event-management    | community-agent | notification-service, analytics-service                               | drive.organized, voter.registered          | election calendars, registration requirements | registration KOs, education material KOs | Medium | Drive organization                       |
| C06 | K-12 Pipeline Programs | identify-partners → design-programs → deliver → track-participants → measure-enrollment → maintain | partner-management, program-design, enrollment-tracking  | community-agent | partnership-service, analytics-service, enrollment-service            | pipeline.started, participant.tracked      | school data, program designs                  | pipeline KOs, enrollment KOs             | Low    | Partnership approval                     |

**D09 Summary:** 6 capabilities, 3 Low, 3 Medium. Primary agent: community-agent.

---

### D10: Volunteers

| ID  | Capability                | Workflow                                                                      | Skills                                                        | Agent           | Services                                                      | Events                                         | KO In                                    | KO Out                                 | Auto       | Human Approvals                          |
| --- | ------------------------- | ----------------------------------------------------------------------------- | ------------------------------------------------------------- | --------------- | ------------------------------------------------------------- | ---------------------------------------------- | ---------------------------------------- | -------------------------------------- | ---------- | ---------------------------------------- |
| V01 | Volunteer Recruitment     | advertise → receive-applications → screen → onboard → assign → track          | recruitment, screening, onboarding, assignment                | volunteer-agent | notification-service, training-service, scheduling-service    | volunteer.applied, volunteer.onboarded         | applications, skills inventories         | volunteer KOs, assignment KOs          | Medium     | Screening decisions, assignment approval |
| V02 | Volunteer Training        | design-training → schedule → deliver → assess → certify → track               | training-design, training-delivery, assessment, certification | volunteer-agent | training-service, notification-service, certification-service | training.scheduled, training.completed         | training materials, skill requirements   | training record KOs, certification KOs | Medium     | Training content approval                |
| V03 | Volunteer Matching        | collect-needs → analyze-skills → match → assign → monitor → adjust            | skill-matching, optimization, feedback-collection             | volunteer-agent | matching-service, notification-service                        | volunteer.matched, assignment.created          | project requirements, volunteer profiles | match KOs, assignment KOs              | Autonomous | None — matching is algorithmic           |
| V04 | Volunteer Recognition     | collect-hours → calculate-impact → generate-recognitions → distribute → track | impact-calculation, recognition-generation, notification      | volunteer-agent | analytics-service, document-service, notification-service     | recognition.generated, recognition.distributed | hour logs, impact data                   | recognition KOs, award KOs             | Autonomous | Recognition criteria approval            |
| V05 | Volunteer Impact Tracking | collect-data → analyze → calculate-ROI → generate-report → share              | impact-analysis, ROI-calculation, report-generation           | volunteer-agent | analytics-service, document-service                           | impact.analyzed, report.generated              | hour logs, project outcomes              | impact report KOs, ROI KOs             | Assisted   | Report publication approval              |

**D10 Summary:** 5 capabilities, 2 Autonomous, 2 Medium, 1 Assisted. Primary agent: volunteer-agent.

---

### D11: Finance

| ID  | Capability              | Workflow                                                                                   | Skills                                              | Agent         | Services                                                  | Events                                  | KO In                                    | KO Out                                        | Auto   | Human Approvals                    |
| --- | ----------------------- | ------------------------------------------------------------------------------------------ | --------------------------------------------------- | ------------- | --------------------------------------------------------- | --------------------------------------- | ---------------------------------------- | --------------------------------------------- | ------ | ---------------------------------- |
| F01 | Budget Development      | collect-requests → forecast-revenue → allocate → draft-budget → review → approve → publish | budget-modeling, financial-forecasting, allocation  | finance-agent | finance-service, analytics-service, notification-service  | budget.drafted, budget.approved         | revenue projections, dept requests       | budget KO, allocation KOs                     | Medium | Board approval, dept head sign-off |
| F02 | Financial Reporting     | collect-transactions → journalize → reconcile → close → generate-statements → publish      | accounting, reconciliation, financial-reporting     | finance-agent | finance-service, document-service                         | report.generated, statement.published   | transaction data, journal entries        | trial balance KOs, financial statement KOs    | High   | CFO approval, board presentation   |
| F03 | Tuition & Billing       | calculate-charges → apply-aid → generate-invoices → send → collect → reconcile             | billing, financial-aid-application, collections     | finance-agent | finance-service, notification-service, enrollment-service | invoice.generated, payment.received     | enrollment data, fee schedules           | student invoice KOs, payment KOs              | High   | Financial aid adjustments          |
| F04 | Accounts Payable        | receive-invoice → match-PO → verify → approve → schedule-payment → process                 | invoice-processing, PO-matching, payment-scheduling | finance-agent | finance-service, notification-service                     | invoice.approved, payment.processed     | invoices, purchase orders                | payment KOs, vendor record KOs                | High   | Payment approval                   |
| F05 | Payroll                 | collect-timesheets → calculate → withhold → process → remit → report                       | payroll-processing, tax-calculation, remittance     | finance-agent | finance-service, hr-service, notification-service         | payroll.processed, tax.filed            | timesheets, contracts, tax forms         | payroll KOs, tax filing KOs                   | High   | Payroll approval                   |
| F06 | Grants Accounting       | track-expenditures → apply-rules → calculate-balances → generate-reports → submit          | restricted-fund-tracking, compliance-reporting      | finance-agent | finance-service, compliance-service, document-service     | expenditure.recorded, report.submitted  | award documents, expenditure data        | fund balance KOs, agency report KOs           | Medium | Expenditure approval               |
| F07 | Financial Aid Packaging | receive-FAFSA → apply-policy → package-aid → notify → disburse → track-SAP                 | aid-packaging, need-analysis, SAP-tracking          | finance-agent | finance-service, enrollment-service, notification-service | aid.awarded, aid.disbursed              | FAFSA data, aid policies                 | aid award KOs, disbursement KOs               | High   | Aid package approval               |
| F08 | Cash Management         | project-cashflow → invest → monitor → distribute → report                                  | cash-projection, investment-management, reporting   | finance-agent | finance-service, analytics-service                        | investment.made, distribution.completed | cash flow projections, investment policy | investment KOs, liquidity report KOs          | Medium | Investment approval                |
| F09 | Tax Compliance          | collect-data → prepare-returns → file → track → report                                     | tax-preparation, compliance-filing                  | finance-agent | finance-service, compliance-service, document-service     | return.filed, compliance.reported       | revenue data, payroll data               | tax return KOs, compliance KOs                | Medium | Tax return approval                |
| F10 | Audit Preparation       | collect-records → test-controls → document → respond → implement                           | audit-preparation, control-testing, documentation   | finance-agent | finance-service, document-service, compliance-service     | audit.ready, finding.resolved           | financial records, internal controls     | audit-ready record KOs, management letter KOs | Medium | Management response approval       |

**D11 Summary:** 10 capabilities, 6 High, 4 Medium. Primary agent: finance-agent.

---

### D12: Legal

| ID   | Capability               | Workflow                                                                         | Skills                                                            | Agent       | Services                                                   | Events                                                  | KO In                                        | KO Out                                           | Auto     | Human Approvals                                   |
| ---- | ------------------------ | -------------------------------------------------------------------------------- | ----------------------------------------------------------------- | ----------- | ---------------------------------------------------------- | ------------------------------------------------------- | -------------------------------------------- | ------------------------------------------------ | -------- | ------------------------------------------------- |
| LE01 | Contract Management      | receive-draft → review → redline → negotiate → approve → execute → track → renew | contract-review, risk-assessment, negotiation-tracking            | legal-agent | contract-service, notification-service, document-service   | contract.received, contract.approved, contract.executed | draft contracts, vendor proposals            | reviewed contract KOs, risk assessment KOs       | Low      | ALL — legal review requires human judgment        |
| LE02 | IP Management            | disclose → evaluate → file → prosecute → license → distribute-royalties          | patent-analysis, IP-filing, license-management                    | legal-agent | legal-service, finance-service, notification-service       | invention.disclosed, patent.filed, license.executed     | invention disclosures, patent data           | patent KOs, license KOs, royalty KOs             | Low      | IP strategy decisions, license approval           |
| LE03 | Compliance Monitoring    | scan-regulations → assess-impact → update-policies → train → monitor → report    | regulatory-scanning, impact-assessment, compliance-tracking       | legal-agent | compliance-service, notification-service, training-service | regulation.detected, policy.updated                     | regulatory updates, audit findings           | compliance calendar KOs, policy update KOs       | Assisted | Compliance decisions                              |
| LE04 | Litigation Management    | receive-claim → assess → retain-counsel → litigate → settle/close → archive      | case-management, litigation-tracking, settlement-analysis         | legal-agent | legal-service, document-service, notification-service      | claim.received, litigation.closed                       | lawsuits, claims, demand letters             | litigation budget KOs, case status KOs           | Low      | ALL — litigation decisions require human judgment |
| LE05 | Policy Library           | receive-proposal → review → approve → publish → version → sunset                 | policy-management, version-control, communication                 | legal-agent | document-service, compliance-service, notification-service | policy.proposed, policy.approved, policy.published      | proposed policies, revisions                 | policy KOs, version KOs                          | Medium   | Policy approval                                   |
| LE06 | Accessibility Compliance | audit → identify-gaps → remediate → train → monitor → report                     | accessibility-audit, accommodation-tracking, compliance-reporting | legal-agent | compliance-service, training-service, notification-service | audit.completed, gap.remediated                         | accessibility audits, accommodation requests | accommodation plan KOs, accessibility report KOs | Assisted | Accommodation decisions                           |

**D12 Summary:** 6 capabilities, 2 Low (Manual), 2 Assisted, 1 Medium, 1 High. Primary agent: legal-agent.

---

### D13: Compliance

| ID   | Capability               | Workflow                                                                                    | Skills                                                       | Agent            | Services                                                   | Events                                                | KO In                                          | KO Out                                           | Auto       | Human Approvals                                  |
| ---- | ------------------------ | ------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | ---------------- | ---------------------------------------------------------- | ----------------------------------------------------- | ---------------------------------------------- | ------------------------------------------------ | ---------- | ------------------------------------------------ |
| CO01 | Quality Gates            | receive-artifact → apply-rules → score → pass/fail → suggest-improvements → report          | quality-scoring, rule-application, improvement-suggestion    | quality-agent    | quality-gates-service, analytics-service, document-service | artifact.validated, quality.scored                    | content artifacts, quality rules               | pass/fail report KOs, quality score KOs          | Autonomous | None — rules-based                               |
| CO02 | Regulatory Filing        | collect-data → prepare-filing → review → submit → track → archive                           | filing-preparation, compliance-tracking, document-management | compliance-agent | compliance-service, document-service, notification-service | filing.prepared, filing.submitted                     | financial data, activity reports               | filed report KOs, confirmation KOs               | Medium     | Filing approval                                  |
| CO03 | Internal Audit           | plan-audit → scope → fieldwork → report → follow-up → close                                 | audit-planning, fieldwork, report-writing                    | compliance-agent | analytics-service, document-service, notification-service  | audit.planned, audit.reported                         | financial records, process documentation       | audit report KOs, management letter KOs          | Low        | ALL — audit findings require human judgment      |
| CO04 | Data Privacy             | inventory-data → assess-impact → implement-controls → train → monitor → respond-to-breaches | privacy-impact-assessment, data-mapping, breach-response     | compliance-agent | compliance-service, notification-service, training-service | privacy.assessed, breach.detected                     | data inventories, privacy policies             | privacy impact assessment KOs, breach report KOs | Assisted   | Breach notification decisions                    |
| CO05 | Whistleblower Protection | receive-report → triage → investigate → protect → resolve → close                           | case-management, investigation, protection-planning          | compliance-agent | notification-service, legal-service, document-service      | report.received, investigation.completed, case.closed | whistleblower reports, investigation protocols | investigation record KOs, protection measure KOs | Low        | ALL — whistleblower cases require human judgment |

**D13 Summary:** 5 capabilities, 1 Autonomous, 2 Low, 1 Medium, 1 Assisted. Primary agents: quality-agent, compliance-agent.

---

### D14: Operations

| ID  | Capability               | Workflow                                                                     | Skills                                                          | Agent            | Services                                                     | Events                                                     | KO In                                      | KO Out                                          | Auto   | Human Approvals             |
| --- | ------------------------ | ---------------------------------------------------------------------------- | --------------------------------------------------------------- | ---------------- | ------------------------------------------------------------ | ---------------------------------------------------------- | ------------------------------------------ | ----------------------------------------------- | ------ | --------------------------- |
| O01 | LMS Administration       | configure-courses → upload-content → manage-access → track-usage → report    | lms-configuration, content-management, usage-tracking           | operations-agent | lms-service, analytics-service, notification-service         | course.configured, usage.tracked                           | faculty course setup, student access needs | LMS course site KOs, usage report KOs           | High   | Content approval            |
| O02 | Network Infrastructure   | monitor → detect-issues → respond → upgrade → patch → report                 | network-monitoring, incident-response, capacity-planning        | operations-agent | monitoring-service, notification-service                     | network.health.checked, incident.detected                  | capacity plans, incident tickets           | uptime report KOs, upgrade report KOs           | Medium | Upgrade approval            |
| O03 | Cybersecurity Operations | monitor-threats → detect → contain → eradicate → recover → report → improve  | threat-detection, incident-response, vulnerability-scanning     | operations-agent | monitoring-service, notification-service, compliance-service | threat.detected, incident.contained, vulnerability.patched | threat intelligence, security logs         | security incident KOs, compliance dashboard KOs | Medium | Incident response decisions |
| O04 | IT Help Desk             | receive-ticket → triage → diagnose → resolve → close → knowledge-base-update | ticket-triage, diagnosis, resolution, knowledge-base-management | operations-agent | ticketing-service, notification-service, knowledge-service   | ticket.received, ticket.resolved, kb.article.created       | service tickets, walk-in requests          | resolved ticket KOs, knowledge base KOs         | High   | Complex issue escalation    |
| O05 | Enterprise Systems       | monitor → patch → integrate → migrate → report                               | system-administration, integration-management, data-migration   | operations-agent | monitoring-service, notification-service                     | system.updated, integration.completed                      | system patches, user requests              | updated system KOs, integration workflow KOs    | Medium | Migration approval          |
| O06 | AV & Classroom Tech      | receive-request → diagnose → repair → schedule-maintenance → replace         | av-repair, maintenance-scheduling, equipment-tracking           | operations-agent | ticketing-service, scheduling-service                        | av.issue.resolved, maintenance.completed                   | AV trouble reports, event requests         | function AV KOs, equipment replacement KOs      | Medium | Replacement approval        |
| O07 | Data Governance          | define-rules → profile-data → cleanse → monitor → report → improve           | data-profiling, data-cleansing, quality-monitoring              | operations-agent | data-governance-service, analytics-service                   | data.quality.assessed, rule.applied                        | data policies, quality rules               | clean dataset KOs, data dictionary KOs          | Medium | Data policy approval        |
| O08 | Identity & Access Mgmt   | provision → authenticate → authorize → review → deprovision → report         | identity-management, access-control, audit-tracking             | operations-agent | iam-service, notification-service, compliance-service        | account.provisioned, access.reviewed                       | HR/SIS employment and enrollment data      | provisioned account KOs, access review KOs      | High   | Access exception approval   |

**D14 Summary:** 8 capabilities, 3 High, 4 Medium, 1 Low. Primary agent: operations-agent.

---

### D15: Infrastructure

| ID  | Capability                    | Workflow                                                          | Skills                                                       | Agent                | Services                                                    | Events                                        | KO In                                         | KO Out                                              | Auto   | Human Approvals                                     |
| --- | ----------------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------ | -------------------- | ----------------------------------------------------------- | --------------------------------------------- | --------------------------------------------- | --------------------------------------------------- | ------ | --------------------------------------------------- |
| I01 | Preventive Maintenance        | schedule → assign → complete → inspect → report → reschedule      | maintenance-scheduling, work-order-management, inspection    | infrastructure-agent | scheduling-service, ticketing-service, notification-service | pm.scheduled, pm.completed                    | maintenance schedules, equipment inventories  | completed PM work order KOs, condition report KOs   | High   | Maintenance priority decisions                      |
| I02 | Work Order Management         | receive-request → triage → assign → complete → close → survey     | ticket-triage, assignment, completion-tracking               | infrastructure-agent | ticketing-service, notification-service, analytics-service  | workorder.received, workorder.completed       | customer-submitted tickets                    | completed work order KOs, satisfaction data KOs     | High   | Complex work order decisions                        |
| I03 | Construction Management       | plan → design → bid → award → construct → inspect → close-out     | project-management, bid-analysis, inspection                 | infrastructure-agent | project-service, document-service, notification-service     | project.planned, project.completed            | capital project requests, architectural plans | completed project KOs, change order KOs             | Low    | ALL — construction decisions require human judgment |
| I04 | Custodial & Grounds           | schedule → assign → complete → inspect → report → adjust          | cleaning-scheduling, quality-inspection, grounds-maintenance | infrastructure-agent | scheduling-service, ticketing-service                       | cleaning.completed, inspection.passed         | cleaning schedules, event support requests    | cleaned space KOs, grounds maintenance record KOs   | Medium | Schedule adjustment decisions                       |
| I05 | Environmental Health & Safety | inspect → identify-hazards → remediate → train → monitor → report | safety-inspection, hazard-remediation, compliance-reporting  | infrastructure-agent | compliance-service, training-service, notification-service  | inspection.completed, hazard.remediated       | safety inspections, incident reports          | inspection report KOs, corrective action KOs        | Medium | Hazard remediation priority                         |
| I06 | Utilities Management          | monitor-meters → analyze-usage → optimize → report → upgrade      | energy-monitoring, usage-analysis, optimization              | infrastructure-agent | monitoring-service, analytics-service                       | usage.analyzed, optimization.completed        | utility meters, energy dashboards             | utility cost report KOs, energy savings KOs         | Medium | Upgrade investment approval                         |
| I07 | Sustainability & Conservation | audit → set-targets → implement → measure → report → improve      | energy-auditing, sustainability-planning, carbon-accounting  | infrastructure-agent | analytics-service, compliance-service, document-service     | sustainability.target.set, reduction.measured | energy audits, sustainability plan            | energy reduction report KOs, LEED certification KOs | Medium | Target approval                                     |

**D15 Summary:** 7 capabilities, 2 High, 4 Medium, 1 Low. Primary agent: infrastructure-agent.

---

### D16: AI

| ID   | Capability         | Workflow                                                                                   | Skills                                                          | Agent    | Services                                                              | Events                                               | KO In                                     | KO Out                                      | Auto       | Human Approvals                               |
| ---- | ------------------ | ------------------------------------------------------------------------------------------ | --------------------------------------------------------------- | -------- | --------------------------------------------------------------------- | ---------------------------------------------------- | ----------------------------------------- | ------------------------------------------- | ---------- | --------------------------------------------- |
| AI01 | Model Management   | register → deploy → monitor → evaluate → update → deprecate                                | model-deployment, performance-monitoring, version-management    | ai-agent | inference-service, monitoring-service, storage-service                | model.deployed, model.updated, model.deprecated      | model artifacts, performance metrics      | deployed model KOs, performance report KOs  | Autonomous | Model deployment approval                     |
| AI02 | Inference Pipeline | receive-input → preprocess → predict → postprocess → return → log                          | inference-serving, request-routing, latency-optimization        | ai-agent | inference-service, monitoring-service, logging-service                | prediction.served, latency.logged                    | input data, model endpoints               | prediction KOs, latency metric KOs          | Autonomous | None — real-time                              |
| AI03 | Prompt Engineering | define-task → design-prompt → test → iterate → version → deploy                            | prompt-design, evaluation, version-management                   | ai-agent | evaluation-service, version-service, notification-service             | prompt.designed, prompt.deployed                     | task requirements, examples               | optimized prompt KOs, evaluation result KOs | Assisted   | Prompt approval                               |
| AI04 | AI Ethics & Safety | audit → evaluate-bias → assess-safety → mitigate → certify → monitor                       | bias-audit, safety-evaluation, mitigation-planning              | ai-agent | compliance-service, evaluation-service, notification-service          | bias.detected, safety.assessed, mitigation.completed | bias audits, safety evaluations           | ethics report KOs, safety certification KOs | Low        | ALL — ethics decisions require human judgment |
| AI05 | RAG Pipeline       | receive-query → embed-query → retrieve-context → generate-response → cite-sources → return | vector-search, context-retrieval, response-generation, citation | ai-agent | vector-service, knowledge-service, inference-service, logging-service | query.received, response.generated                   | queries, knowledge base, embedding models | grounded response KOs, source citation KOs  | Autonomous | None — real-time                              |

**D16 Summary:** 5 capabilities, 3 Autonomous, 1 Assisted, 1 Low. Primary agent: ai-agent.

---

### D17: Engineering

| ID  | Capability                 | Workflow                                                                                              | Skills                                                        | Agent               | Services                                                                 | Events                                                    | KO In                                         | KO Out                                                     | Auto       | Human Approvals           |
| --- | -------------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ------------------- | ------------------------------------------------------------------------ | --------------------------------------------------------- | --------------------------------------------- | ---------------------------------------------------------- | ---------- | ------------------------- |
| E01 | Pipeline Orchestration     | receive-request → resolve-capability → load-skills → pre-validate → execute → post-validate → publish | capability-engine, quality-gating, provenance-tracking        | pipeline-agent      | capability-service, quality-gates-service, provenance-service            | pipeline.started, pipeline.completed, artifact.published  | knowledge objects, builder configs            | generated artifact KOs, provenance KOs                     | Autonomous | None — automated pipeline |
| E02 | Agent Orchestration        | receive-task → resolve-agent → assign → monitor → collect-results → aggregate → report                | agent-coordination, task-distribution, result-aggregation     | orchestration-agent | agent-service, monitoring-service, notification-service                  | task.assigned, agent.completed, task.completed            | task specifications, agent capabilities       | completed task KOs, agent utilization metric KOs           | Autonomous | Agent assignment approval |
| E03 | Deployment Management      | receive-build → test → stage → deploy → verify → monitor → rollback-if-needed                         | deployment-automation, verification, rollback                 | deploy-agent        | deployment-service, monitoring-service, notification-service             | build.received, deployment.completed, deployment.verified | build artifacts, deployment configs           | deployment log KOs, verification report KOs                | Autonomous | Deployment approval       |
| E04 | Monitoring & Observability | collect-metrics → collect-logs → collect-traces → analyze → alert → dashboard                         | metrics-collection, log-aggregation, trace-analysis, alerting | monitoring-agent    | monitoring-service, alerting-service, dashboard-service                  | metric.collected, alert.triggered, dashboard.updated      | metrics, logs, traces                         | dashboard KOs, alert notification KOs                      | Autonomous | Alert escalation          |
| E05 | Version Control            | receive-commit → validate → merge → tag → release → archive                                           | git-operations, branch-management, release-management         | devops-agent        | git-service, ci-cd-service, notification-service                         | commit.pushed, branch.created, release.tagged             | code changes, commit messages                 | version history KOs, release tag KOs                       | Autonomous | None                      |
| E06 | CI/CD Pipeline             | receive-push → lint → test → build → deploy → notify                                                  | ci-automation, testing, building, deployment                  | devops-agent        | ci-cd-service, testing-service, deployment-service, notification-service | pipeline.started, pipeline.completed, test.passed         | code changes, test suites, deployment configs | build artifact KOs, test result KOs, deployment report KOs | Autonomous | None                      |

**D17 Summary:** 6 capabilities, 6 Autonomous. Primary agents: pipeline-agent, orchestration-agent, deploy-agent, monitoring-agent, devops-agent.

---

### D18: Analytics

| ID   | Capability           | Workflow                                                                    | Skills                                                | Agent           | Services                                                       | Events                                                   | KO In                                | KO Out                                                                   | Auto     | Human Approvals             |
| ---- | -------------------- | --------------------------------------------------------------------------- | ----------------------------------------------------- | --------------- | -------------------------------------------------------------- | -------------------------------------------------------- | ------------------------------------ | ------------------------------------------------------------------------ | -------- | --------------------------- |
| AN01 | Learning Analytics   | collect-data → clean → analyze → visualize → report → trigger-interventions | data-analysis, visualization, intervention-triggering | analytics-agent | analytics-service, visualization-service, notification-service | data.collected, report.generated, intervention.triggered | assessment scores, engagement data   | learning dashboard KOs, performance report KOs, intervention trigger KOs | Assisted | Intervention approval       |
| AN02 | Content Analytics    | collect-usage → analyze-effectiveness → identify-gaps → recommend → report  | usage-analysis, effectiveness-scoring, recommendation | analytics-agent | analytics-service, document-service                            | usage.analyzed, recommendation.generated                 | usage data, completion rates         | content effectiveness report KOs, improvement recommendation KOs         | Assisted | Recommendation approval     |
| AN03 | Impact Measurement   | collect-outcomes → analyze → calculate-impact → visualize → report → share  | impact-analysis, outcome-measurement, visualization   | analytics-agent | analytics-service, visualization-service, document-service     | outcome.measured, impact.calculated, report.generated    | beneficiary data, outcome indicators | impact report KOs, dashboard KOs                                         | Assisted | Report publication approval |
| AN04 | Predictive Analytics | collect-historical → build-model → validate → deploy → monitor → update     | statistical-modeling, ml-prediction, model-monitoring | analytics-agent | analytics-service, ai-agent, monitoring-service                | model.trained, prediction.generated                      | historical data, current metrics     | forecast KOs, risk score KOs                                             | Assisted | Model deployment approval   |
| AN05 | Financial Analytics  | collect-transactions → analyze → forecast → visualize → report              | financial-analysis, forecasting, visualization        | analytics-agent | analytics-service, finance-service, visualization-service      | analysis.completed, forecast.generated                   | transaction data, budgets            | financial forecast KOs, budget variance report KOs                       | Assisted | Forecast approval           |

**D18 Summary:** 5 capabilities, 5 Assisted. Primary agent: analytics-agent.

---

### D19: Outreach

| ID   | Capability                 | Workflow                                                                     | Skills                                                          | Agent          | Services                                                      | Events                                               | KO In                                     | KO Out                                            | Auto   | Human Approvals                               |
| ---- | -------------------------- | ---------------------------------------------------------------------------- | --------------------------------------------------------------- | -------------- | ------------------------------------------------------------- | ---------------------------------------------------- | ----------------------------------------- | ------------------------------------------------- | ------ | --------------------------------------------- |
| OU01 | Brand Management           | define-guidelines → create-assets → distribute → monitor-compliance → update | brand-guidelines, asset-creation, compliance-monitoring         | outreach-agent | brand-service, design-service, notification-service           | brand.created, compliance.checked                    | brand guidelines, style guides            | approved brand asset KOs, compliance review KOs   | Medium | Brand guideline approval                      |
| OU02 | Marketing Campaigns        | define-audience → design-creative → launch → track → optimize → report       | campaign-design, audience-targeting, performance-tracking       | outreach-agent | marketing-service, analytics-service, notification-service    | campaign.launched, performance.logged                | enrollment targets, audience segments     | campaign creative KOs, lead generation report KOs | Medium | Campaign approval                             |
| OU03 | Public Relations           | monitor-media → draft-releases → distribute → track-coverage → manage-crisis | media-monitoring, press-release-writing, crisis-management      | outreach-agent | pr-service, notification-service, document-service            | press.release.distributed, coverage.tracked          | press releases, media inquiries           | press coverage KOs, media placement KOs           | Low    | ALL — PR decisions require human judgment     |
| OU04 | Social Media Management    | plan-content → create → schedule → publish → engage → analyze → report       | content-planning, social-publishing, engagement-tracking        | outreach-agent | social-media-service, analytics-service, notification-service | content.scheduled, post.published, engagement.logged | content calendar, user-generated content  | scheduled post KOs, engagement metric KOs         | Medium | Content approval                              |
| OU05 | Publications & Editorial   | plan-editorial → commission → collect → edit → design → publish → distribute | editorial-planning, content-production, distribution            | outreach-agent | publication-service, design-service, distribution-service     | editorial.planned, publication.released              | editorial calendars, content submissions  | published magazine KOs, annual report KOs         | Medium | Editorial approval                            |
| OU06 | Website Content Management | receive-updates → review → publish → monitor-traffic → optimize-SEO          | content-management, SEO-optimization, analytics                 | outreach-agent | cms-service, analytics-service, notification-service          | content.updated, traffic.logged                      | content updates, SEO requirements         | updated web page KOs, traffic analytics KOs       | Medium | Content approval                              |
| OU07 | Crisis Communications      | detect-crisis → assess → draft-statements → distribute → monitor → debrief   | crisis-detection, statement-drafting, stakeholder-communication | outreach-agent | notification-service, pr-service, document-service            | crisis.detected, statement.distributed               | incident reports, social media monitoring | crisis statement KOs, media briefing KOs          | Low    | ALL — crisis decisions require human judgment |
| OU08 | Internal Communications    | collect-news → draft → distribute → track-engagement → report                | content-writing, distribution, engagement-tracking              | outreach-agent | email-service, notification-service, analytics-service        | newsletter.distributed, engagement.logged            | news items, policy updates                | email newsletter KOs, intranet update KOs         | Medium | Content approval                              |

**D19 Summary:** 8 capabilities, 5 Medium, 3 Low. Primary agent: outreach-agent.

---

### D20: Partnerships

| ID   | Capability              | Workflow                                                                                    | Skills                                                          | Agent             | Services                                                                    | Events                                                 | KO In                                              | KO Out                                                                 | Auto   | Human Approvals                                    |
| ---- | ----------------------- | ------------------------------------------------------------------------------------------- | --------------------------------------------------------------- | ----------------- | --------------------------------------------------------------------------- | ------------------------------------------------------ | -------------------------------------------------- | ---------------------------------------------------------------------- | ------ | -------------------------------------------------- |
| PA01 | Partnership Development | identify-needs → research-partners → outreach → negotiate → formalize → maintain → evaluate | partner-research, negotiation, relationship-management          | partnership-agent | notification-service, document-service, analytics-service                   | partner.identified, moU.signed, partnership.evaluated  | community needs assessments, partnership proposals | active partnership KOs, MOU KOs, impact assessment KOs                 | Low    | ALL — partnership decisions require human judgment |
| PA02 | Alumni Engagement       | maintain-database → plan-content → distribute → track-interactions → report                 | database-management, content-planning, engagement-tracking      | partnership-agent | crm-service, email-service, analytics-service, notification-service         | alumni.contact.updated, newsletter.sent, event.invited | alumni database, content calendar                  | engagement dashboard KOs, survey KOs                                   | High   | Content approval                                   |
| PA03 | Alumni Mentoring        | collect-volunteers → collect-students → match → facilitate → evaluate → adjust              | mentor-matching, program-facilitation, evaluation               | partnership-agent | matching-service, notification-service, analytics-service                   | mentor.matched, session.recorded, program.evaluated    | alumni volunteer pool, student applications        | mentoring pair KOs, program evaluation KOs                             | Medium | Matching approval                                  |
| PA04 | Alumni Donations        | plan-campaigns → identify-donors → solicit → process → recognize → report                   | campaign-planning, donor-solicitation, gift-processing          | partnership-agent | crm-service, finance-service, notification-service, document-service        | campaign.launched, gift.received, donor.recognized     | campaign lists, donor records                      | gift receipt KOs, donor recognition KOs, campaign progress report KOs  | High   | Campaign approval                                  |
| PA05 | Foundation Relations    | identify-foundations → develop-proposals → submit → manage-awards → report → renew          | foundation-research, proposal-development, compliance-reporting | partnership-agent | document-service, finance-service, notification-service, compliance-service | proposal.submitted, grant.awarded, report.submitted    | foundation portfolios, project proposals           | funded grant KOs, foundation partnership KOs, reporting compliance KOs | Low    | Proposal approval                                  |

**D20 Summary:** 5 capabilities, 2 Low, 2 High, 1 Medium. Primary agent: partnership-agent.

---

### D21: Sustainability

| ID  | Capability              | Workflow                                                                              | Skills                                                            | Agent                | Services                                                   | Events                                                       | KO In                                               | KO Out                                                                        | Auto     | Human Approvals               |
| --- | ----------------------- | ------------------------------------------------------------------------------------- | ----------------------------------------------------------------- | -------------------- | ---------------------------------------------------------- | ------------------------------------------------------------ | --------------------------------------------------- | ----------------------------------------------------------------------------- | -------- | ----------------------------- |
| S01 | Environmental Reporting | collect-data → calculate-metrics → benchmark → visualize → report → publish           | environmental-data-collection, metrics-calculation, visualization | sustainability-agent | analytics-service, visualization-service, document-service | data.collected, metrics.calculated, report.published         | energy data, waste data, water usage                | environmental report KOs, sustainability dashboard KOs, ESG score KOs         | Assisted | Report publication approval   |
| S02 | Carbon Accounting       | collect-emissions → calculate-footprint → set-targets → implement-reductions → report | carbon-accounting, emissions-calculation, target-setting          | sustainability-agent | analytics-service, compliance-service, document-service    | emissions.calculated, footprint.reported, target.set         | emission sources, energy consumption                | carbon footprint report KOs, reduction target KOs, offset record KOs          | Assisted | Target approval               |
| S03 | Sustainable Operations  | audit → identify-opportunities → implement → measure → report → improve               | sustainability-auditing, green-procurement, waste-reduction       | sustainability-agent | compliance-service, procurement-service, analytics-service | audit.completed, improvement.implemented, reduction.measured | energy audits, waste audits, procurement policies   | green procurement record KOs, waste reduction metric KOs, LEED compliance KOs | Medium   | Procurement decision approval |
| S04 | Social Impact Reporting | collect-beneficiary-data → analyze → calculate-impact → visualize → report → share    | impact-analysis, beneficiary-tracking, visualization              | sustainability-agent | analytics-service, visualization-service, document-service | data.collected, impact.calculated, report.shared             | beneficiary data, volunteer hours, program outcomes | social impact report KOs, community benefit statement KOs                     | Assisted | Report publication approval   |

**D21 Summary:** 4 capabilities, 2 Assisted, 1 Medium, 1 High. Primary agent: sustainability-agent.

---

## 4. Execution Statistics

### 4.1 Capabilities by Automation Level

| Automation Level | Count | %     | Capabilities                                                                                                                                                                                                                                                                       |
| ---------------- | ----- | ----- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Autonomous**   | 38    | 24.4% | KM01-KM08, E01-E06, AI01, AI02, AI05, M01, M02, M03, M05, V03, V04, CO01, P05                                                                                                                                                                                                      |
| **High**         | 32    | 20.5% | A02, A04, A06, A10, AC05, AC10, L01, L03, L06, P01, P03, P06, D02, O01, O04, O08, I01, I02, PA02, PA04, M04, M06, F02, F03, F04, F05, F07, E02                                                                                                                                     |
| **Medium**       | 42    | 26.9% | A03, A07, A08, A09, A12, AC03, AC04, AC07, AC09, AC12, AC13, AC14, R02, R06, R07, R09, L02, L04, L05, L07, L09, L10, P04, C02, C04, C05, V01, V02, F01, F06, F08, F09, F10, LE05, O02, O03, O05, O06, O07, I04, I05, I06, I07, OU01, OU02, OU04, OU05, OU06, OU08, PA03, S03, AC15 |
| **Assisted**     | 24    | 15.4% | G01, G03, G04, G05, G06, G07, A01, A05, A13, AC01, AC02, AC15, R01, R04, R10, R11, R12, KM05, AN01-AN05, LE03, LE06, CO04, S01, S02, S04                                                                                                                                           |
| **Low (Manual)** | 20    | 12.8% | G02, G08, A11, AC06, AC08, AC11, R03, R05, R08, L08, C01, C03, C06, LE01, LE02, LE04, CO03, CO05, I03, OU03, OU07, PA01, PA05, AI04                                                                                                                                                |

### 4.2 Primary Agent Load

| Agent                | Capabilities Served     | % of Total |
| -------------------- | ----------------------- | ---------- |
| knowledge-agent      | 8 (KM01-KM08)           | 5.1%       |
| curriculum-agent     | 15 (AC01-AC15)          | 9.6%       |
| research-agent       | 12 (R01-R12)            | 7.7%       |
| admin-agent          | 11 (A01-A11, A13)       | 7.7%       |
| library-agent        | 10 (L01-L10)            | 6.4%       |
| publications-agent   | 6 (P01-P06)             | 3.8%       |
| video-agent          | 3 (M01, M02, M05)       | 1.9%       |
| design-agent         | 3 (M03, M04, M06)       | 1.9%       |
| governance-agent     | 8 (G01-G08)             | 5.1%       |
| community-agent      | 6 (C01-C06)             | 3.8%       |
| volunteer-agent      | 5 (V01-V05)             | 3.2%       |
| finance-agent        | 10 (F01-F10)            | 6.4%       |
| legal-agent          | 6 (LE01-LE06)           | 3.8%       |
| compliance-agent     | 5 (CO02-CO05)           | 3.2%       |
| quality-agent        | 1 (CO01)                | 0.6%       |
| operations-agent     | 8 (O01-O08)             | 5.1%       |
| infrastructure-agent | 7 (I01-I07)             | 4.5%       |
| ai-agent             | 5 (AI01-AI05)           | 3.2%       |
| pipeline-agent       | 1 (E01)                 | 0.6%       |
| orchestration-agent  | 1 (E02)                 | 0.6%       |
| deploy-agent         | 1 (E03)                 | 0.6%       |
| monitoring-agent     | 1 (E04)                 | 0.6%       |
| devops-agent         | 2 (E05, E06)            | 1.3%       |
| analytics-agent      | 7 (A12, AN01-AN05, E04) | 4.5%       |
| outreach-agent       | 8 (OU01-OU08)           | 5.1%       |
| partnership-agent    | 5 (PA01-PA05)           | 3.2%       |
| sustainability-agent | 4 (S01-S04)             | 2.6%       |
| **TOTAL**            | **156**                 | **100%**   |

### 4.3 Capabilities by Domain

| Domain             | Count   | Autonomous | High   | Medium | Assisted | Low    |
| ------------------ | ------- | ---------- | ------ | ------ | -------- | ------ |
| D01 Governance     | 8       | 0          | 0      | 2      | 6        | 2      |
| D02 Administration | 13      | 0          | 5      | 4      | 2        | 2      |
| D03 Academics      | 15      | 0          | 2      | 5      | 4        | 3      |
| D04 Research       | 12      | 0          | 1      | 5      | 3        | 2      |
| D05 Knowledge Mgmt | 8       | 5          | 1      | 1      | 1        | 0      |
| D06 Library        | 10      | 0          | 3      | 5      | 0        | 1      |
| D07 Publications   | 6       | 0          | 4      | 1      | 1        | 0      |
| D08 Media          | 6       | 3          | 2      | 1      | 0        | 0      |
| D09 Community      | 6       | 0          | 0      | 3      | 0        | 3      |
| D10 Volunteers     | 5       | 2          | 0      | 2      | 1        | 0      |
| D11 Finance        | 10      | 0          | 6      | 4      | 0        | 0      |
| D12 Legal          | 6       | 0          | 0      | 1      | 2        | 3      |
| D13 Compliance     | 5       | 1          | 0      | 1      | 1        | 2      |
| D14 Operations     | 8       | 0          | 3      | 4      | 0        | 1      |
| D15 Infrastructure | 7       | 0          | 2      | 4      | 0        | 1      |
| D16 AI             | 5       | 3          | 0      | 0      | 1        | 1      |
| D17 Engineering    | 6       | 6          | 0      | 0      | 0        | 0      |
| D18 Analytics      | 5       | 0          | 0      | 0      | 5        | 0      |
| D19 Outreach       | 8       | 0          | 0      | 5      | 0        | 3      |
| D20 Partnerships   | 5       | 0          | 2      | 1      | 0        | 2      |
| D21 Sustainability | 4       | 0          | 1      | 1      | 2        | 0      |
| **TOTAL**          | **156** | **38**     | **32** | **42** | **24**   | **20** |

---

## 5. Execution Matrices

### 5.1 Matrix 1: Capability → Workflow

| Capability | Primary Workflow                                                                                                 | Workflow ID |
| ---------- | ---------------------------------------------------------------------------------------------------------------- | ----------- |
| G01        | collect-agenda → distribute-packet → conduct-meeting → record-minutes → publish-resolutions → track-action-items | WF-G01      |
| G02        | gather-data → swot-analysis → stakeholder-input → draft-plan → board-review → publish → assign-kpis              | WF-G02      |
| G03        | identify-need → draft → legal-review → committee → board → publish → train → monitor → sunset                    | WF-G03      |
| G04        | map-standards → collect-evidence → draft-self-study → review → submit → feedback → remediate                     | WF-G04      |
| G05        | collect-risk → assess-impact → prioritize → assign-mitigation → track → report                                   | WF-G05      |
| G06        | collect-metrics → benchmark → analyze-gaps → draft-report → board-review → assign-actions                        | WF-G06      |
| G07        | collect-topics → agenda → conduct-meeting → minutes → publish → feedback → respond                               | WF-G07      |
| G08        | review-deed → check-compliance → draft-amendments → board → file → archive                                       | WF-G08      |
| A01        | receive → validate → route → score → decide → notify → enroll                                                    | WF-A01      |
| A02        | receive → validate → record → maintain → respond → audit                                                         | WF-A02      |
| A03        | collect → map-rooms → resolve-conflicts → optimize → publish → swap-requests                                     | WF-A03      |
| A04        | receive → prereq-check → capacity-check → confirm-waitlist → add-drop → update                                   | WF-A04      |
| A05        | post-job → screen → interview → hire → onboard → benefits → reviews                                              | WF-A05      |
| A06        | requisition → approve → quotes → evaluate → award → receive → pay → track                                        | WF-A06      |
| A07        | collect → assess-availability → assign → optimize → track-utilization → plan                                     | WF-A07      |
| A08        | analyze → set-targets → design-strategies → execute → measure-yield → adjust                                     | WF-A08      |
| A09        | assign-mentors → schedule → orientation → clear-holds → plans → follow-up                                        | WF-A09      |
| A10        | inventory → classify → apply-schedule → dispose → archive → report                                               | WF-A10      |
| A11        | assess-threats → update-plans → drills → respond → debrief → update                                              | WF-A11      |
| A12        | receive → query → analyze → visualize → report → recommend                                                       | WF-A12      |
| A13        | receive → investigate → determine → remedies → train → survey → report                                           | WF-A13      |
| AC01       | identify → research → draft → committee → approve → publish → implement                                          | WF-AC01     |
| AC02       | prepare → deliver → engage → assess → feedback → iterate                                                         | WF-AC02     |
| AC03       | collect → rubric → grade → feedback → record → release                                                           | WF-AC03     |
| AC04       | pull-records → audit → meet → plan → recommend → document → follow-up                                            | WF-AC04     |
| AC05       | apply → audit → verify → deficiencies → certify → diploma → transcript                                           | WF-AC05     |
| AC06       | report → investigate → interview → determine → sanction → educate → monitor                                      | WF-AC06     |
| AC07       | template → submit → review → approve → archive → report                                                          | WF-AC07     |
| AC08       | petition → review → committee → decide → update → notify                                                         | WF-AC08     |
| AC09       | draft → input → board → publish → distribute                                                                     | WF-AC09     |
| AC10       | configure → distribute → collect → analyze → report → share                                                      | WF-AC10     |
| AC11       | applications → review → admit → mentors → thesis → designate                                                     | WF-AC11     |
| AC12       | partners → recruit → apply → approve → prepare → place → monitor → reimport                                      | WF-AC12     |
| AC13       | set-milestones → track → submit → committee → record → progression                                               | WF-AC13     |
| AC14       | needs → match → verify → assign → contract → onboard                                                             | WF-AC14     |
| AC15       | load-standards → map → analyze → gaps → remediate → verify → report                                              | WF-AC15     |
| R01        | funding → draft → budget → compliance → review → submit → track                                                  | WF-R01      |
| R02        | award → setup → track → report → submit → close-out                                                              | WF-R02      |
| R03        | submit → assign → review → determine → communicate → monitor → continuing                                        | WF-R03      |
| R04        | prepare → submit → review → revise → accept → publish → index → citations                                        | WF-R04      |
| R05        | disclose → evaluate → patent → market → license → royalties                                                      | WF-R05      |
| R06        | inspect → hazards → remediate → train → monitor → report                                                         | WF-R06      |
| R07        | DMP → storage → metadata → share → preserve → archive                                                            | WF-R07      |
| R08        | allegation → assess → investigate → determine → sanctions → notify → monitor                                     | WF-R08      |
| R09        | request → availability → schedule → train → maintain → usage                                                     | WF-R09      |
| R10        | data → impact → case-studies → visualize → report → share                                                        | WF-R10      |
| R11        | curate → metadata → quality → deposit → DOI → publish                                                            | WF-R11      |
| R12        | plan → papers → review → schedule → register → host → proceedings                                                | WF-R12      |
| KM01       | input → validate → structure → enrich → store → index → version                                                  | WF-KM01     |
| KM02       | source → extract → parse → concepts → generate → validate → store                                                | WF-KM02     |
| KM03       | load-KOs → concepts → relationships → edges → cluster → index → visualize                                        | WF-KM03     |
| KM04       | query → expand → search-index → search-vectors → merge-rank → format → return                                    | WF-KM04     |
| KM05       | select → quality-rules → score → flag → expert → validate → update                                               | WF-KM05     |
| KM06       | request → authenticate → policy → synchronize → validate → log                                                   | WF-KM06     |
| KM07       | load-graph → scope → layout → render → interact → track                                                          | WF-KM07     |
| KM08       | detect → diff → summarize → archive → notify → update-index                                                      | WF-KM08     |
| L01        | receive → classify → describe → record → index → publish-discovery                                               | WF-L01      |
| L02        | requests → gaps → options → acquire → assess → renew                                                             | WF-L02      |
| L03        | request → verify → lender → request → receive → deliver → return → track                                         | WF-L03      |
| L04        | select → digitize → describe → quality → ingest → preserve → access                                              | WF-L04      |
| L05        | question → assess → search →指导 → guide → track                                                                 | WF-L05      |
| L06        | checkout → due-date → reminders → returns → holds → stats                                                        | WF-L06      |
| L07        | request → availability → reserve → digitize → notify → returns                                                   | WF-L07      |
| L08        | offer → evaluate → acquire → process → finding-aid → preserve → access                                           | WF-L08      |
| L09        | request → design → deliver → assess → tutorial → track                                                           | WF-L09      |
| L10        | inquiry → research → advise → deposit → track                                                                    | WF-L10      |
| P01        | submit → editorial → peer-review → accept → produce → publish → index → usage                                    | WF-P01      |
| P02        | assign → invite → reviews → compile → decide → communicate                                                       | WF-P02      |
| P03        | papers → format → review → produce → publish → index → archive                                                   | WF-P03      |
| P04        | manuscript → peer-review → accept → copyedit → design → produce → distribute                                     | WF-P04      |
| P05        | manuscript → validate → DOI → post → citations                                                                   | WF-P05      |
| P06        | mandate → compliance → deposit → track → report                                                                  | WF-P06      |
| M01        | request → load-KO → script → visual-spec → render → captions → transcript → publish                              | WF-M01      |
| M02        | script → TTS → audio → mix → transcribe → publish                                                                | WF-M02      |
| M03        | brief → generate → brand-check → refine → export → publish                                                       | WF-M03      |
| M04        | requirement → token → component → test → document → publish                                                      | WF-M04      |
| M05        | media → transcript → timing → captions → embed → accessibility → publish                                         | WF-M05      |
| M06        | media → tag → organize → store → serve → usage → analyze                                                         | WF-M06      |
| C01        | needs → partners → design → deliver → impact → maintain                                                          | WF-C01      |
| C02        | proposal → evaluate → schedule → promote → host → feedback → report                                              | WF-C02      |
| C03        | needs → courses → design → deliver → hours → impact → report                                                     | WF-C03      |
| C04        | needs → design → market → enroll → deliver → assess → certify                                                    | WF-C04      |
| C05        | elections → drives → promote → register → educate → participation                                                | WF-C05      |
| C06        | partners → design → deliver → participants → enrollment → maintain                                               | WF-C06      |
| V01        | advertise → applications → screen → onboard → assign → track                                                     | WF-V01      |
| V02        | design → schedule → deliver → assess → certify → track                                                           | WF-V02      |
| V03        | needs → analyze → match → assign → monitor → adjust                                                              | WF-V03      |
| V04        | hours → impact → recognize → distribute → track                                                                  | WF-V04      |
| V05        | data → analyze → ROI → report → share                                                                            | WF-V05      |
| F01        | requests → forecast → allocate → draft → review → approve → publish                                              | WF-F01      |
| F02        | transactions → journalize → reconcile → close → statements → publish                                             | WF-F02      |
| F03        | charges → aid → invoices → send → collect → reconcile                                                            | WF-F03      |
| F04        | invoice → match-PO → verify → approve → schedule → process                                                       | WF-F04      |
| F05        | timesheets → calculate → withhold → process → remit → report                                                     | WF-F05      |
| F06        | track → rules → balances → reports → submit                                                                      | WF-F06      |
| F07        | FAFSA → policy → package → notify → disburse → SAP                                                               | WF-F07      |
| F08        | cashflow → invest → monitor → distribute → report                                                                | WF-F08      |
| F09        | collect → prepare → file → track → report                                                                        | WF-F09      |
| F10        | records → controls → document → respond → implement                                                              | WF-F10      |
| LE01       | draft → review → redline → negotiate → approve → execute → track → renew                                         | WF-LE01     |
| LE02       | disclose → evaluate → file → prosecute → license → royalties                                                     | WF-LE02     |
| LE03       | scan → assess → update → train → monitor → report                                                                | WF-LE03     |
| LE04       | claim → assess → counsel → litigate → settle → archive                                                           | WF-LE04     |
| LE05       | proposal → review → approve → publish → version → sunset                                                         | WF-LE05     |
| LE06       | audit → gaps → remediate → train → monitor → report                                                              | WF-LE06     |
| CO01       | artifact → rules → score → pass/fail → suggest → report                                                          | WF-CO01     |
| CO02       | data → prepare → review → submit → track → archive                                                               | WF-CO02     |
| CO03       | plan → scope → fieldwork → report → follow-up → close                                                            | WF-CO03     |
| CO04       | inventory → impact → controls → train → monitor → breach-response                                                | WF-CO04     |
| CO05       | report → triage → investigate → protect → resolve → close                                                        | WF-CO05     |
| O01        | configure → upload → access → usage → report                                                                     | WF-O01      |
| O02        | monitor → detect → respond → upgrade → patch → report                                                            | WF-O02      |
| O03        | monitor → detect → contain → eradicate → recover → report → improve                                              | WF-O03      |
| O04        | ticket → triage → diagnose → resolve → close → KB-update                                                         | WF-O04      |
| O05        | monitor → patch → integrate → migrate → report                                                                   | WF-O05      |
| O06        | request → diagnose → repair → maintain → replace                                                                 | WF-O06      |
| O07        | define → profile → cleanse → monitor → report → improve                                                          | WF-O07      |
| O08        | provision → authenticate → authorize → review → deprovision → report                                             | WF-O08      |
| I01        | schedule → assign → complete → inspect → report → reschedule                                                     | WF-I01      |
| I02        | request → triage → assign → complete → close → survey                                                            | WF-I02      |
| I03        | plan → design → bid → award → construct → inspect → close-out                                                    | WF-I03      |
| I04        | schedule → assign → complete → inspect → report → adjust                                                         | WF-I04      |
| I05        | inspect → hazards → remediate → train → monitor → report                                                         | WF-I05      |
| I06        | meters → usage → optimize → report → upgrade                                                                     | WF-I06      |
| I07        | audit → targets → implement → measure → report → improve                                                         | WF-I07      |
| AI01       | register → deploy → monitor → evaluate → update → deprecate                                                      | WF-AI01     |
| AI02       | input → preprocess → predict → postprocess → return → log                                                        | WF-AI02     |
| AI03       | task → design → test → iterate → version → deploy                                                                | WF-AI03     |
| AI04       | audit → bias → safety → mitigate → certify → monitor                                                             | WF-AI04     |
| AI05       | query → embed → retrieve → generate → cite → return                                                              | WF-AI05     |
| E01        | request → resolve → load-skills → pre-validate → execute → post-validate → publish                               | WF-E01      |
| E02        | task → resolve-agent → assign → monitor → collect → aggregate → report                                           | WF-E02      |
| E03        | build → test → stage → deploy → verify → monitor → rollback                                                      | WF-E03      |
| E04        | metrics → logs → traces → analyze → alert → dashboard                                                            | WF-E04      |
| E05        | commit → validate → merge → tag → release → archive                                                              | WF-E05      |
| E06        | push → lint → test → build → deploy → notify                                                                     | WF-E06      |
| AN01       | data → clean → analyze → visualize → report → intervene                                                          | WF-AN01     |
| AN02       | usage → analyze → identify-gaps → recommend → report                                                             | WF-AN02     |
| AN03       | outcomes → analyze → calculate → visualize → report → share                                                      | WF-AN03     |
| AN04       | historical → build-model → validate → deploy → monitor → update                                                  | WF-AN04     |
| AN05       | transactions → analyze → forecast → visualize → report                                                           | WF-AN05     |
| OU01       | define → create-assets → distribute → monitor-compliance → update                                                | WF-OU01     |
| OU02       | audience → creative → launch → track → optimize → report                                                         | WF-OU02     |
| OU03       | monitor → drafts → distribute → track-coverage → manage-crisis                                                   | WF-OU03     |
| OU04       | plan → create → schedule → publish → engage → analyze → report                                                   | WF-OU04     |
| OU05       | editorial → commission → collect → edit → design → publish → distribute                                          | WF-OU05     |
| OU06       | updates → review → publish → traffic → SEO → optimize                                                            | WF-OU06     |
| OU07       | detect → assess → draft → distribute → monitor → debrief                                                         | WF-OU07     |
| OU08       | news → draft → distribute → engagement → report                                                                  | WF-OU08     |
| PA01       | needs → research → outreach → negotiate → formalize → maintain → evaluate                                        | WF-PA01     |
| PA02       | database → content → distribute → track → report                                                                 | WF-PA02     |
| PA03       | volunteers → students → match → facilitate → evaluate → adjust                                                   | WF-PA03     |
| PA04       | campaigns → donors → solicit → process → recognize → report                                                      | WF-PA04     |
| PA05       | foundations → proposals → submit → manage → report → renew                                                       | WF-PA05     |
| S01        | collect → metrics → benchmark → visualize → report → publish                                                     | WF-S01      |
| S02        | emissions → footprint → targets → reductions → report                                                            | WF-S02      |
| S03        | audit → opportunities → implement → measure → report → improve                                                   | WF-S03      |
| S04        | data → analyze → impact → visualize → report → share                                                             | WF-S04      |

---

### 5.2 Matrix 2: Capability → Skill

| Capability | Primary Skills                                                                                                                     | Secondary Skills                                 |
| ---------- | ---------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| G01-G08    | document-generation, meeting-management, compliance-checking                                                                       | data-analysis, reporting, notification           |
| A01        | document-processing, scoring, notification                                                                                         | enrollment                                       |
| A02        | record-management, degree-audit, transcript-generation                                                                             | —                                                |
| A03        | constraint-scheduling, optimization, conflict-resolution                                                                           | —                                                |
| A04        | prerequisite-checking, enrollment-processing                                                                                       | notification                                     |
| A05        | applicant-tracking, benefits-management, performance-tracking                                                                      | —                                                |
| A06        | vendor-management, PO-processing, contract-tracking                                                                                | —                                                |
| A07        | space-optimization, utilization-tracking, capacity-planning                                                                        | —                                                |
| A08        | data-analysis, yield-modeling, strategy-design                                                                                     | —                                                |
| A09        | event-management, student-onboarding, mentor-matching                                                                              | —                                                |
| A10        | document-management, classification, disposition                                                                                   | —                                                |
| A11        | emergency-notification, incident-management, plan-maintenance                                                                      | —                                                |
| A12        | data-analysis, visualization, report-generation, statistical-modeling                                                              | —                                                |
| A13        | investigation-management, compliance-tracking, training-management                                                                 | —                                                |
| AC01       | curriculum-design, document-generation, standards-mapping                                                                          | —                                                |
| AC02       | lesson-delivery, engagement-tracking, assessment-administration                                                                    | —                                                |
| AC03       | rubric-scoring, feedback-generation, grade-recording                                                                               | —                                                |
| AC04       | degree-audit, academic-planning, student-advising                                                                                  | —                                                |
| AC05       | degree-audit, certification, document-generation                                                                                   | —                                                |
| AC06       | investigation-management, evidence-analysis, case-management                                                                       | —                                                |
| AC07       | document-management, compliance-checking, repository-management                                                                    | —                                                |
| AC08       | case-management, grade-audit, decision-documentation                                                                               | —                                                |
| AC09       | calendar-management, document-generation, notification                                                                             | —                                                |
| AC10       | survey-administration, data-analysis, report-generation                                                                            | —                                                |
| AC11       | application-processing, thesis-evaluation, student-tracking                                                                        | —                                                |
| AC12       | partner-management, application-processing, credit-transfer, safety-monitoring                                                     | —                                                |
| AC13       | milestone-tracking, committee-management, progress-recording                                                                       | —                                                |
| AC14       | credential-verification, contract-management, course-assignment                                                                    | —                                                |
| AC15       | standards-mapping, gap-analysis, curriculum-design, NLP-analysis                                                                   | —                                                |
| R01        | grant-writing, budget-building, compliance-checking, document-generation                                                           | —                                                |
| R02        | financial-tracking, report-generation, compliance-monitoring                                                                       | —                                                |
| R03        | protocol-review, compliance-monitoring, notification                                                                               | —                                                |
| R04        | manuscript-preparation, submission-processing, citation-tracking                                                                   | —                                                |
| R05        | patent-analysis, market-assessment, license-management                                                                             | —                                                |
| R06        | safety-inspection, training-management, incident-tracking                                                                          | —                                                |
| R07        | data-management, metadata-application, repository-management                                                                       | —                                                |
| R08        | investigation-management, evidence-analysis, case-management                                                                       | —                                                |
| R09        | equipment-scheduling, usage-tracking, maintenance-management                                                                       | —                                                |
| R10        | bibliometric-analysis, impact-assessment, visualization, report-generation                                                         | —                                                |
| R11        | data-curation, metadata-application, repository-management                                                                         | —                                                |
| R12        | event-management, paper-review, proceedings-publication                                                                            | —                                                |
| KM01-KM08  | knowledge-structuring, graph-construction, vector-search, quality-scoring, federation-protocol, version-control                    | document-processing, visualization               |
| L01-L10    | cataloging, metadata-creation, ILL-processing, digitization, reference-interview, circulation-processing, archival-processing      | —                                                |
| P01-P06    | editorial-management, reviewer-matching, proceedings-production, DOI-minting, preprint-posting, compliance-checking                | —                                                |
| M01-M06    | hyperframes, media-use, captions-overlay, tts-generation, image-generation, design-system, asset-management                        | faceless-explainer, general-video, banner-design |
| C01-C06    | needs-assessment, partner-management, program-design, event-management, enrollment-tracking                                        | —                                                |
| V01-V05    | recruitment, skill-matching, training-design, impact-calculation, ROI-calculation                                                  | —                                                |
| F01-F10    | budget-modeling, accounting, billing, payroll-processing, tax-preparation, aid-packaging, cash-projection                          | —                                                |
| LE01-LE06  | contract-review, patent-analysis, regulatory-scanning, case-management, policy-management, accessibility-audit                     | —                                                |
| CO01-CO05  | quality-scoring, filing-preparation, audit-planning, privacy-impact-assessment, investigation                                      | —                                                |
| O01-O08    | lms-configuration, network-monitoring, threat-detection, ticket-triage, system-administration, data-profiling, identity-management | supabase                                         |
| I01-I07    | maintenance-scheduling, project-management, energy-monitoring, sustainability-planning                                             | —                                                |
| AI01-AI05  | model-deployment, inference-serving, prompt-design, bias-audit, vector-search, context-retrieval                                   | —                                                |
| E01-E06    | capability-engine, agent-coordination, deployment-automation, metrics-collection, git-operations, ci-automation                    | —                                                |
| AN01-AN05  | data-analysis, visualization, statistical-modeling, forecasting, impact-analysis                                                   | —                                                |
| OU01-OU08  | brand-guidelines, campaign-design, media-monitoring, crisis-management, content-planning, editorial-planning                       | brand, design, ui-styling                        |
| PA01-PA05  | partner-research, negotiation, relationship-management, CRM, campaign-planning, foundation-research                                | —                                                |
| S01-S04    | environmental-data-collection, carbon-accounting, sustainability-auditing, impact-analysis                                         | —                                                |

---

### 5.3 Matrix 3: Capability → Agent

| Domain | Agent                | Capabilities  | Load |
| ------ | -------------------- | ------------- | ---- |
| D01    | governance-agent     | G01-G08       | 8    |
| D02    | admin-agent          | A01-A11, A13  | 12   |
| D02    | analytics-agent      | A12           | 1    |
| D03    | curriculum-agent     | AC01-AC15     | 15   |
| D04    | research-agent       | R01-R12       | 12   |
| D05    | knowledge-agent      | KM01-KM08     | 8    |
| D06    | library-agent        | L01-L10       | 10   |
| D07    | publications-agent   | P01-P06       | 6    |
| D08    | video-agent          | M01, M02, M05 | 3    |
| D08    | design-agent         | M03, M04, M06 | 3    |
| D09    | community-agent      | C01-C06       | 6    |
| D10    | volunteer-agent      | V01-V05       | 5    |
| D11    | finance-agent        | F01-F10       | 10   |
| D12    | legal-agent          | LE01-LE06     | 6    |
| D13    | quality-agent        | CO01          | 1    |
| D13    | compliance-agent     | CO02-CO05     | 4    |
| D14    | operations-agent     | O01-O08       | 8    |
| D15    | infrastructure-agent | I01-I07       | 7    |
| D16    | ai-agent             | AI01-AI05     | 5    |
| D17    | pipeline-agent       | E01           | 1    |
| D17    | orchestration-agent  | E02           | 1    |
| D17    | deploy-agent         | E03           | 1    |
| D17    | monitoring-agent     | E04           | 1    |
| D17    | devops-agent         | E05, E06      | 2    |
| D18    | analytics-agent      | AN01-AN05     | 5    |
| D19    | outreach-agent       | OU01-OU08     | 8    |
| D20    | partnership-agent    | PA01-PA05     | 5    |
| D21    | sustainability-agent | S01-S04       | 4    |

---

### 5.4 Matrix 4: Capability → Service

| Service                 | Count                     | Key Capabilities                             |
| ----------------------- | ------------------------- | -------------------------------------------- |
| notification-service    | 80+                       | All domains — cross-cutting                  |
| document-service        | 60+                       | All domains — cross-cutting                  |
| finance-service         | 13                        | F01-F10, A06, LE02, PA04                     |
| compliance-service      | 12                        | G03-G05, R03, R06, LE03, CO02-CO04, O03, O08 |
| analytics-service       | 12                        | A07, A08, A12, AN01-AN05, R10, OU02          |
| storage-service         | 15                        | KM01-KM03, KM06, L04, L08, M01-M06, R07, R11 |
| knowledge-service       | 10                        | KM01-KM08, AI05, E01                         |
| visualization-service   | 8                         | KM07, R10, AN01-AN05, S01                    |
| monitoring-service      | 8                         | E03, E04, O02, O03, O05, AI01, AI04, AN04    |
| enrollment-service      | 6                         | A01, A04, A08, A09, AC05, AC14               |
| sis-service             | 6                         | A02, A04, AC04, AC05, AC08, AC13             |
| publication-service     | 6                         | P01-P06                                      |
| repository-service      | 5                         | L04, R07, R11, P06, L10                      |
| scheduling-service      | 5                         | A03, A07, V01, I01, R09                      |
| training-service        | 5                         | G03, A13, V02, R06, LE06                     |
| quality-gates-service   | 4                         | CO01, KM05, G05, E01                         |
| catalog-service         | 4                         | L01, L02, L03, L07                           |
| metadata-service        | 4                         | L01, L04, R07, R11                           |
| partnership-service     | 4                         | C01, C03, C06, PA01                          |
| logging-service         | 4                         | KM06, E04, AI02, AI05                        |
| vector-service          | 3                         | KM04, AI05                                   |
| search-service          | 3                         | KM04, L05, R12                               |
| index-service           | 3                         | KM01, KM03, KM04                             |
| inference-service       | 3                         | AI01, AI02, AI05                             |
| lms-service             | 3                         | AC02, L09, O01                               |
| DOI-service             | 3                         | P01, P03, P05                                |
| crm-service             | 2                         | PA02, PA04                                   |
| matching-service        | 2                         | V03, PA03                                    |
| email-service           | 2                         | PA02, OU08                                   |
| pr-service              | 2                         | OU03, OU07                                   |
| brand-service           | 2                         | OU01, M03                                    |
| ticketing-service       | 2                         | O04, I02                                     |
| graph-service           | 2                         | KM03, KM07                                   |
| version-service         | 2                         | KM08, AI03                                   |
| evaluation-service      | 2                         | AI03, AI04                                   |
| deployment-service      | 2                         | E03, E06                                     |
| ci-cd-service           | 2                         | E05, E06                                     |
| certification-service   | 2                         | C04, V02                                     |
| marketing-service       | 2                         | C04, OU02                                    |
| degree-audit-service    | 2                         | AC04, AC05                                   |
| assessment-service      | 2                         | AC02, AC03                                   |
| image-service           | 1                         | M03                                          |
| audio-service           | 1                         | M02                                          |
| transcription-service   | 1                         | M02                                          |
| video-service           | 1                         | M01                                          |
| caption-service         | 1                         | M05                                          |
| dam-service             | 1                         | M06                                          |
| discovery-service       | 1                         | L01                                          |
| ils-service             | 1                         | L06                                          |
| archive-service         | 2                         | P03, L08                                     |
| ISBN-service            | 1                         | P04                                          |
| distribution-service    | 1                         | P04                                          |
| federation-service      | 1                         | KM06                                         |
| auth-service            | 2                         | KM06, O08                                    |
| alerting-service        | 1                         | E04                                          |
| dashboard-service       | 1                         | E04                                          |
| git-service             | 1                         | E05                                          |
| testing-service         | 1                         | E06                                          |
| agent-service           | 1                         | E02                                          |
| capability-service      | 1                         | E01                                          |
| provenance-service      | 1                         | E01                                          |
| venue-service           | 1                         | C02                                          |
| social-media-service    | 1                         | OU04                                         |
| cms-service             | 1                         | OU06                                         |
| iam-service             | 1                         | O08                                          |
| data-governance-service | 1                         | O07                                          |
| project-service         | 1                         | I03                                          |
| **TOTAL**               | **~95 distinct services** | —                                            |

---

### 5.5 Matrix 5: Capability → Package

| Package                | Capabilities | Agent(s)                                                                          | Service(s)                                                                                          |
| ---------------------- | ------------ | --------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| governance-package     | G01-G08      | governance-agent                                                                  | document, compliance, notification, analytics                                                       |
| admin-package          | A01-A13      | admin-agent, analytics-agent                                                      | application, sis, enrollment, scheduling, hr, facilities, notification                              |
| curriculum-package     | AC01-AC15    | curriculum-agent                                                                  | document, compliance, assessment, degree-audit, lms, notification                                   |
| research-package       | R01-R12      | research-agent                                                                    | document, compliance, finance, legal, storage, metadata, repository, notification                   |
| knowledge-package      | KM01-KM08    | knowledge-agent                                                                   | knowledge, quality-gates, storage, graph, index, search, vector, visualization, version, federation |
| library-package        | L01-L10      | library-agent                                                                     | catalog, metadata, discovery, ils, repository, notification                                         |
| publications-package   | P01-P06      | publications-agent                                                                | publication, DOI, archive, notification                                                             |
| media-package          | M01-M06      | video-agent, design-agent                                                         | video, audio, image, caption, dam, brand, storage                                                   |
| community-package      | C01-C06      | community-agent                                                                   | partnership, event, enrollment, analytics, notification                                             |
| volunteer-package      | V01-V05      | volunteer-agent                                                                   | notification, training, scheduling, matching, analytics                                             |
| finance-package        | F01-F10      | finance-agent                                                                     | finance, compliance, notification, analytics                                                        |
| legal-package          | LE01-LE06    | legal-agent                                                                       | contract, compliance, notification, document                                                        |
| compliance-package     | CO01-CO05    | quality-agent, compliance-agent                                                   | quality-gates, compliance, notification, training, document                                         |
| operations-package     | O01-O08      | operations-agent                                                                  | lms, monitoring, ticketing, knowledge, iam, data-governance                                         |
| infrastructure-package | I01-I07      | infrastructure-agent                                                              | scheduling, ticketing, compliance, analytics, notification                                          |
| ai-package             | AI01-AI05    | ai-agent                                                                          | inference, monitoring, vector, knowledge, evaluation, storage                                       |
| engineering-package    | E01-E06      | pipeline-agent, orchestration-agent, deploy-agent, monitoring-agent, devops-agent | capability, quality-gates, provenance, agent, deployment, monitoring, ci-cd, alerting               |
| analytics-package      | AN01-AN05    | analytics-agent                                                                   | analytics, visualization, notification, ai-agent                                                    |
| outreach-package       | OU01-OU08    | outreach-agent                                                                    | marketing, pr, social-media, cms, email, brand, analytics                                           |
| partnership-package    | PA01-PA05    | partnership-agent                                                                 | crm, finance, notification, analytics, compliance                                                   |
| sustainability-package | S01-S04      | sustainability-agent                                                              | analytics, compliance, visualization, document                                                      |

---

### 5.6 Matrix 6: Capability → Application

| Application              | Capabilities              | Package(s)                        |
| ------------------------ | ------------------------- | --------------------------------- |
| Knowledge Browser        | KM01-KM08                 | knowledge-package                 |
| Lesson Studio            | AC01-AC02, M01-M06        | curriculum-package, media-package |
| Assessment Studio        | AC03, AC06, AC08          | curriculum-package                |
| Teacher Dashboard        | AC04, AC07, AC10, AC14    | curriculum-package                |
| Student Portal           | A04, A09, AC05, AC11-AC13 | admin-package, curriculum-package |
| Research Hub             | R01-R12                   | research-package                  |
| Library Portal           | L01-L10                   | library-package                   |
| Publications Portal      | P01-P06                   | publications-package              |
| Admin Dashboard          | A01-A13                   | admin-package                     |
| Governance Hub           | G01-G08                   | governance-package                |
| Financial Dashboard      | F01-F10                   | finance-package                   |
| Compliance Dashboard     | CO01-CO05                 | compliance-package                |
| Operations Console       | O01-O08                   | operations-package                |
| Infrastructure Monitor   | I01-I07                   | infrastructure-package            |
| AI Console               | AI01-AI05                 | ai-package                        |
| Engineering Dashboard    | E01-E06                   | engineering-package               |
| Analytics Dashboard      | AN01-AN05                 | analytics-package                 |
| Community Portal         | C01-C06                   | community-package                 |
| Volunteer Portal         | V01-V05                   | volunteer-package                 |
| Outreach Dashboard       | OU01-OU08                 | outreach-package                  |
| Partnership Hub          | PA01-PA05                 | partnership-package               |
| Sustainability Dashboard | S01-S04                   | sustainability-package            |

---

### 5.7 Matrix 7: Capability → Knowledge Object

| KO Type              | Produced By    | Consumed By               |
| -------------------- | -------------- | ------------------------- |
| meeting-minutes      | G01, G07       | G03, G07, A11             |
| resolution           | G01, G02       | G03, G05                  |
| action-item          | G01, G02, G06  | G01, G06, A12             |
| policy               | G03, LE05      | G04, G05, CO02-CO04, LE03 |
| strategic-plan       | G02            | G06, F01                  |
| risk-assessment      | G05            | G05, CO03                 |
| effectiveness-report | G06            | G02, G04                  |
| admission-decision   | A01            | A04, A08, AC05            |
| enrollment           | A01, A04       | AC02, AC03, F03, F07      |
| transcript           | A02            | AC05, R04                 |
| degree-audit         | AC05           | AC04, AC05                |
| course-schedule      | A03            | A04, L07, O01             |
| employee             | A05            | F05, O08                  |
| purchase-order       | A06            | F04, LE01                 |
| space-assignment     | A07            | A03, I01                  |
| course-proposal      | AC01           | AC07, AC15                |
| syllabus             | AC07           | AC02, L07, CO01           |
| grade                | AC03           | AC05, AN01, F07           |
| academic-plan        | AC04           | AC05, AC13                |
| integrity-case       | AC06           | AC06, CO05                |
| proposal             | R01            | R02, PA05                 |
| publication          | R04, P01-P06   | R10, AN02, L10            |
| dataset              | R07, R11       | AI05, AN04                |
| patent               | R05, LE02      | PA05, F06                 |
| safety-report        | R06, I05       | CO03, R06                 |
| KO                   | KM01-KM08      | KM01-KM08, AI05, E01      |
| graph-edge           | KM03           | KM04, KM07                |
| catalog-record       | L01            | L02-L10, KM04             |
| digital-collection   | L04            | L05, L08, KM04            |
| finding-aid          | L08            | L05, R04                  |
| reserve-list         | L07            | L07, AC02                 |
| issue                | P01            | P02-P06, L10              |
| review-report        | P02            | P01, R04                  |
| video                | M01            | OU04, OU06                |
| audio                | M02            | M01, OU08                 |
| image                | M03            | OU04, OU06, M04           |
| token                | M04            | M03, OU06                 |
| event                | C02, R12       | V01, C03                  |
| partnership          | PA01, C01      | C03, C06, PA03            |
| volunteer            | V01            | V03, V05, C01             |
| recognition          | V04            | V04, PA02                 |
| budget               | F01            | F02-F10, G02              |
| financial-statement  | F02            | G06, G08                  |
| aid-package          | F07            | A01, A04                  |
| contract             | LE01, A06      | A06, LE01, PA01           |
| audit-report         | CO03, F10      | G05, CO02                 |
| compliance-record    | CO02-CO04      | G05, LE03                 |
| security-incident    | O03            | CO04, O03                 |
| work-order           | I02            | I01, I04                  |
| maintenance-log      | I01, R09       | I06, R09                  |
| deployment-log       | E03            | E04, E06                  |
| metric               | E04            | AN01-AN05, E04            |
| alert                | E04            | O03, E04                  |
| dashboard            | E04, AN01-AN05 | G06, A12                  |
| impact-report        | AN03, V05, S04 | G06, PA05                 |
| forecast             | AN04, AN05     | F01, A08                  |

---

### 5.8 Matrix 8: Capability → Event

| Event Category | Events                                                     | Emitted By                    | Consumed By              |
| -------------- | ---------------------------------------------------------- | ----------------------------- | ------------------------ |
| Lifecycle      | *.created, *.updated, *.deleted, *.published, *.deprecated | KM01-KM08, AC01, P01-P06      | All downstream           |
| Workflow       | *.started, *.completed, *.failed, *.retrying               | E01, E06, KM02, O03           | Monitoring, alerting     |
| Decision       | *.approved, *.rejected, *.escalated, *.deferred            | G01-G08, A01, AC06, R03, CO03 | Audit, notification      |
| Notification   | *.notified, *.reminded, *.overdue                          | notification-service          | UIs, dashboards          |
| Quality        | *.validated, *.scored, *.flagged, *.passed, *.failed       | CO01, KM05                    | Knowledge, compliance    |
| Access         | *.accessed, *.downloaded, *.shared, *.exported             | KM04, KM06, L06, M06          | Analytics, audit         |
| Financial      | *.invoiced, *.paid, *.overdue, *.reconciled                | F01-F10                       | Finance dashboards       |
| Security       | *.detected, *.contained, *.resolved, *.escalated           | O03, CO04, CO05               | Incident response        |
| Deployment     | *.built, *.deployed, *.verified, *.rolled-back             | E03, E06                      | Monitoring               |
| Social         | *.shared, *.liked, *.commented, *.followed                 | OU04, C02                     | Outreach analytics       |
| Impact         | *.measured, *.reported, *.shared                           | AN03, V05, S01-S04            | Governance, partnerships |

~85 distinct event types across 11 categories.

---

### 5.9 Matrix 9: Capability → Permission

| Permission Group | Permissions                                                                                                  | Capabilities  |
| ---------------- | ------------------------------------------------------------------------------------------------------------ | ------------- |
| Knowledge        | knowledge:read/write/delete/validate/flag/version/deprecate                                                  | KM01-KM08     |
| Governance       | governance:read/write/approve, strategy:read/write, policy:read/write/approve/publish                        | G01-G08       |
| Admissions       | admissions:read/write, decisions:approve, enrollment:read/write/modify                                       | A01, A04, A08 |
| Registrar        | registrar:read/write, records:release, transcript:request                                                    | A02, AC05     |
| Academic         | curriculum:read/write/approve, grading:read/write, grades:release, advising:read/write                       | AC01-AC15     |
| Research         | research:read/submit/publish, grants:read/write/administer, irb:read/review/approve, data:read/share/archive | R01-R12       |
| Library          | catalog:read/write, collection:read/acquire, ill:read/request, digital:read/ingest, dam:read/write           | L01-L10       |
| Publications     | journal:read/edit/publish, review:read/assign/decide, proceedings:read/publish, preprint:read/post           | P01-P06       |
| Media            | media:read/create/publish/caption, brand:read/write                                                          | M01-M06       |
| Community        | outreach:read/execute, events:read/create/manage, pipeline:read/execute                                      | C01-C06       |
| Volunteers       | volunteers:read/recruit/assign, training:read/deliver/certify                                                | V01-V05       |
| Finance          | finance:read/write/approve/spend, budget:create, payroll:modify, benefits:enroll                             | F01-F10       |
| Legal            | legal:read/write, contract:execute, ip:read/file/license, compliance:read/write/report                       | LE01-LE06     |
| Compliance       | compliance:read/write/verify, audit:read/investigate/decide, privacy:read/investigate                        | CO01-CO05     |
| Operations       | ops:read/write, system:configure/patch, security:monitor/respond, access:read/grant/revoke                   | O01-O08       |
| Infrastructure   | facilities:read/assign/maintain, construction:read/manage                                                    | I01-I07       |
| AI               | ai:read/deploy/monitor, prompt:read/write/deploy                                                             | AI01-AI05     |
| Engineering      | pipeline:read/execute, agent:read/assign, deploy:read/execute, monitor:read/alert                            | E01-E06       |
| Analytics        | analytics:read/query/publish, report:read/publish                                                            | AN01-AN05     |
| Outreach         | brand:read/write, marketing:read/execute, pr:read/write, social:read/publish, content:read/publish           | OU01-OU08     |
| Partnerships     | partnership:read/form/manage, donor:read/write, foundation:read/write                                        | PA01-PA05     |
| Sustainability   | sustainability:read/report, carbon:read/report                                                               | S01-S04       |

~120 distinct permissions across 21 groups.

---

### 5.10 Matrix 10: Capability → UI Surface

| UI Surface                 | Capabilities             | Application                     |
| -------------------------- | ------------------------ | ------------------------------- |
| Dashboard Home             | G06, A12, AN01-AN05, E04 | Admin/Analytics Dashboards      |
| Knowledge Search Bar       | KM04                     | Knowledge Browser               |
| Knowledge Graph Viewer     | KM03, KM07               | Knowledge Browser               |
| KO Editor                  | KM01, KM02, KM05         | Knowledge Browser               |
| Ingestion Form             | KM02                     | Knowledge Browser               |
| Lesson Builder             | AC01, AC02               | Lesson Studio                   |
| Assessment Builder         | AC03, AC06               | Assessment Studio               |
| Workbook Builder           | AC07                     | Teacher Dashboard               |
| Teacher Guide Builder      | AC04                     | Teacher Dashboard               |
| Video Builder              | M01, M02, M05            | Lesson Studio                   |
| Design System Viewer       | M04                      | Design System App               |
| Media Library              | M06                      | Media Package                   |
| Course Catalog             | A03, A04                 | Student Portal                  |
| Registration Portal        | A04                      | Student Portal                  |
| Degree Audit View          | AC05                     | Student Portal                  |
| Gradebook                  | AC03                     | Teacher Dashboard               |
| Syllabus Manager           | AC07                     | Teacher Dashboard               |
| Evaluation Dashboard       | AC10                     | Teacher Dashboard               |
| Honors Dashboard           | AC11                     | Student Portal                  |
| Study Abroad Portal        | AC12                     | Student Portal                  |
| Graduate Milestones        | AC13                     | Student Portal                  |
| Admissions Queue           | A01                      | Admin Dashboard                 |
| Registrar Console          | A02                      | Admin Dashboard                 |
| HR Dashboard               | A05                      | Admin Dashboard                 |
| Procurement Console        | A06                      | Admin Dashboard                 |
| Space Map                  | A07                      | Admin Dashboard                 |
| Enrollment Analytics       | A08                      | Admin Dashboard                 |
| Orientation Tracker        | A09                      | Admin Dashboard                 |
| Records Manager            | A10                      | Admin Dashboard                 |
| Emergency Console          | A11                      | Admin Dashboard                 |
| Title IX Console           | A13                      | Admin Dashboard                 |
| Grant Pipeline             | R01, R02                 | Research Hub                    |
| IRB Console                | R03                      | Research Hub                    |
| Publication Manager        | R04, P01-P06             | Publications Portal             |
| IP Portfolio               | R05, LE02                | Research Hub                    |
| Lab Safety Dashboard       | R06                      | Research Hub                    |
| Data Repository            | R07, R11                 | Research Hub                    |
| Core Facilities Booking    | R09                      | Research Hub                    |
| Impact Dashboard           | R10, AN03                | Analytics Dashboard             |
| Catalog Browser            | L01, L02                 | Library Portal                  |
| ILL Request Form           | L03                      | Library Portal                  |
| Digital Collections Viewer | L04                      | Library Portal                  |
| Reference Desk             | L05                      | Library Portal                  |
| Circulation Console        | L06                      | Library Portal                  |
| Reserves Manager           | L07                      | Library Portal                  |
| Special Collections        | L08                      | Library Portal                  |
| Instruction Scheduler      | L09                      | Library Portal                  |
| Scholarly Comm Guide       | L10                      | Library Portal                  |
| Journal Dashboard          | P01                      | Publications Portal             |
| Peer Review Console        | P02                      | Publications Portal             |
| Proceedings Publisher      | P03                      | Publications Portal             |
| Book Publisher             | P04                      | Publications Portal             |
| Preprint Server            | P05                      | Publications Portal             |
| OA Compliance Dashboard    | P06                      | Publications Portal             |
| Budget Dashboard           | F01, F02                 | Financial Dashboard             |
| Billing Portal             | F03                      | Financial Dashboard             |
| AP Console                 | F04                      | Financial Dashboard             |
| Payroll Console            | F05                      | Financial Dashboard             |
| Grants Accounting          | F06                      | Financial Dashboard             |
| Financial Aid Console      | F07                      | Financial Dashboard             |
| Cash Management            | F08                      | Financial Dashboard             |
| Tax Console                | F09                      | Financial Dashboard             |
| Audit Console              | F10, CO03                | Financial/Compliance Dashboards |
| Contract Manager           | LE01                     | Legal Package                   |
| Policy Library             | LE05, G03                | Governance Hub                  |
| Compliance Dashboard       | CO01-CO04                | Compliance Dashboard            |
| Whistleblower Portal       | CO05                     | Compliance Dashboard            |
| Help Desk Console          | O04                      | Operations Console              |
| Network Monitor            | O02                      | Operations Console              |
| Security Operations        | O03                      | Operations Console              |
| System Admin               | O05                      | Operations Console              |
| IAM Console                | O08                      | Operations Console              |
| Data Governance Console    | O07                      | Operations Console              |
| Maintenance Scheduler      | I01, I02                 | Infrastructure Monitor          |
| Construction Tracker       | I03                      | Infrastructure Monitor          |
| Sustainability Dashboard   | I07, S01-S04             | Sustainability Dashboard        |
| Carbon Tracker             | S02                      | Sustainability Dashboard        |
| Community Portal           | C01-C06                  | Community Portal                |
| Volunteer Portal           | V01-V05                  | Volunteer Portal                |
| Event Manager              | C02                      | Community Portal                |
| Outreach Dashboard         | OU01-OU08                | Outreach Dashboard              |
| Partnership Hub            | PA01-PA05                | Partnership Hub                 |
| Pipeline Orchestrator      | E01                      | Engineering Dashboard           |
| Agent Orchestrator         | E02                      | Engineering Dashboard           |
| Deployment Console         | E03                      | Engineering Dashboard           |
| Monitoring Dashboard       | E04                      | Engineering Dashboard           |
| CI/CD Console              | E05, E06                 | Engineering Dashboard           |
| AI Console                 | AI01-AI05                | AI Console                      |
| Prompt Manager             | AI03                     | AI Console                      |
| RAG Explorer               | AI05                     | AI Console                      |
| Command Palette            | ALL                      | All Applications                |

~100 distinct UI surfaces across 22 applications.

---

## 6. Gap Analysis

### 6.1 Existing Implementation Coverage

| Component    | Implemented | Missing | Coverage |
| ------------ | ----------- | ------- | -------- |
| Capabilities | 20          | 136     | 12.8%    |
| Skills       | 33          | ~67     | 33%      |
| Agents       | 0           | 27      | 0%       |
| Services     | ~8          | ~87     | 8.4%     |
| Packages     | 0           | 22      | 0%       |
| Applications | 12          | 10      | 55%      |
| KO Types     | ~15         | ~60     | 20%      |
| Events       | ~5          | ~80     | 6%       |
| Permissions  | ~10         | ~110    | 8%       |
| UI Surfaces  | ~30         | ~70     | 30%      |

### 6.2 Missing Skills

**P0 (28 weeks, parallelizable to 12):** document-processing, text-extraction, concept-identification, graph-construction, relationship-extraction, vector-search, keyword-search, query-expansion, result-ranking, quality-scoring, agent-coordination, task-distribution, inference-serving, context-retrieval, response-generation, citation

**P1 (26 weeks, parallelizable to 10):** budget-modeling, financial-forecasting, accounting, billing, aid-packaging, skill-matching, partner-research, negotiation-tracking, contract-review, audit-planning, data-mapping, breach-response, model-deployment, performance-monitoring, prompt-design, bias-audit

**P2 (22 weeks, parallelizable to 8):** cataloging, ILL-processing, digitization, archival-processing, editorial-management, reviewer-matching, proceedings-production, brand-guidelines, campaign-design, crisis-management, content-planning, environmental-data-collection, carbon-accounting, sustainability-auditing

### 6.3 Missing Agents (27 total)

**P0:** knowledge-agent (4w), curriculum-agent (4w), research-agent (4w), video-agent (2w), quality-agent (1w), ai-agent (3w), pipeline-agent (2w), orchestration-agent (3w), deploy-agent (1w), monitoring-agent (2w), devops-agent (2w)

**P1:** governance-agent (3w), admin-agent (4w), design-agent (2w), community-agent (2w), volunteer-agent (2w), finance-agent (3w), compliance-agent (2w), analytics-agent (3w)

**P2:** library-agent (3w), publications-agent (3w), legal-agent (2w), operations-agent (3w), infrastructure-agent (2w), outreach-agent (3w), partnership-agent (2w), sustainability-agent (2w)

### 6.4 Missing Services (~65 total)

**P0 (25 weeks):** knowledge-service, quality-gates-service, notification-service, document-service, analytics-service, storage-service, graph-service, index-service, search-service, vector-service, monitoring-service, logging-service, inference-service, agent-service, deployment-service, ci-cd-service, alerting-service, capability-service, provenance-service, version-service, evaluation-service, auth-service, image-service, audio-service, transcription-service, video-service, caption-service

**P1 (25 weeks):** visualization-service, enrollment-service, sis-service, scheduling-service, training-service, partnership-service, lms-service, finance-service, compliance-service, federation-service, matching-service, email-service, brand-service, dam-service, degree-audit-service, assessment-service, ticketing-service, iam-service, data-governance-service, venue-service, marketing-service, certification-service

**P2 (20 weeks):** publication-service, repository-service, catalog-service, metadata-service, discovery-service, ils-service, archive-service, DOI-service, ISBN-service, distribution-service, crm-service, pr-service, social-media-service, cms-service, project-service

### 6.5 Missing Applications (15)

**P0:** Knowledge Browser (4w), Research Hub (4w), AI Console (3w)

**P1:** Governance Hub (3w), Financial Dashboard (4w), Compliance Dashboard (3w), Community Portal (3w), Volunteer Portal (2w)

**P2:** Library Portal (4w), Publications Portal (3w), Operations Console (3w), Infrastructure Monitor (3w), Outreach Dashboard (3w), Partnership Hub (2w), Sustainability Dashboard (2w)

---

## 7. Dependency Graphs

### 7.1 Domain Dependency Graph

`
LAYER 0 (Foundation):
D05 Knowledge D14 Operations D17 Engineering D16 AI

LAYER 1 (Core Operations):
D06 Library D08 Media D15 Infrastructure D18 Analytics

LAYER 2 (Institutional Core):
D03 Academics D04 Research D11 Finance D13 Compliance

LAYER 3 (Administrative):
D01 Governance D02 Administration D07 Publications D12 Legal

LAYER 4 (External):
D09 Community D10 Volunteers D19 Outreach D20 Partnerships

LAYER 5 (Strategic):
D21 Sustainability
`

### 7.2 Critical Path

`D05 (Knowledge) -> D17 (Engineering) -> D16 (AI) -> D08 (Media) -> D03 (Academics) -> D18 (Analytics)
D05 (Knowledge) -> D05.KM02 (Ingestion) -> D05.KM03 (Graph) -> D05.KM04 (Search)
D05 (Knowledge) -> D16.AI05 (RAG) -> D18.AN01 (Learning Analytics)
D17 (Engineering) -> E01 (Pipeline) -> D08.M01 (Video) -> D19 (Outreach)`

**Most Depended-On:** D05 (Knowledge) — 8 downstream domains
**Longest Chain:** 6 layers deep
**Critical Path:** D05 -> D17 -> D16 -> D03 -> D18

### 7.3 Implementation Order by Dependency Depth

**Depth 0 — Foundation (Weeks 1-8):**

| #   | Domain          | Capabilities | Est. Weeks |
| --- | --------------- | ------------ | ---------- |
| 1   | D17 Engineering | E01-E06      | 6          |
| 2   | D05 Knowledge   | KM01-KM08    | 8          |
| 3   | D14 Operations  | O01-O08      | 8          |
| 4   | D16 AI          | AI01-AI05    | 6          |

**Depth 1 — Core Operations (Weeks 9-16):**

| #   | Domain             | Capabilities | Est. Weeks |
| --- | ------------------ | ------------ | ---------- |
| 5   | D08 Media          | M01-M06      | 4          |
| 6   | D18 Analytics      | AN01-AN05    | 6          |
| 7   | D06 Library        | L01-L10      | 8          |
| 8   | D15 Infrastructure | I01-I07      | 6          |

**Depth 2 — Institutional Core (Weeks 17-28):**

| #   | Domain         | Capabilities | Est. Weeks |
| --- | -------------- | ------------ | ---------- |
| 9   | D03 Academics  | AC01-AC15    | 12         |
| 10  | D04 Research   | R01-R12      | 10         |
| 11  | D11 Finance    | F01-F10      | 8          |
| 12  | D13 Compliance | CO01-CO05    | 4          |

**Depth 3 — Administrative (Weeks 29-38):**

| #   | Domain             | Capabilities | Est. Weeks |
| --- | ------------------ | ------------ | ---------- |
| 13  | D02 Administration | A01-A13      | 10         |
| 14  | D01 Governance     | G01-G08      | 6          |
| 15  | D07 Publications   | P01-P06      | 6          |
| 16  | D12 Legal          | LE01-LE06    | 4          |

**Depth 4 — External (Weeks 39-46):**

| #   | Domain           | Capabilities | Est. Weeks |
| --- | ---------------- | ------------ | ---------- |
| 17  | D09 Community    | C01-C06      | 4          |
| 18  | D10 Volunteers   | V01-V05      | 3          |
| 19  | D19 Outreach     | OU01-OU08    | 6          |
| 20  | D20 Partnerships | PA01-PA05    | 4          |

**Depth 5 — Strategic (Weeks 47-49):**

| #   | Domain             | Capabilities | Est. Weeks |
| --- | ------------------ | ------------ | ---------- |
| 21  | D21 Sustainability | S01-S04      | 3          |

**Total:** ~49 weeks sequential, ~20 weeks parallelized (4-6 workstreams)

### 7.4 Optimal Implementation Sequence

`
PHASE 1 (Weeks 1-8): Foundation
D17 Engineering + D05 Knowledge + D14 Operations + D16 AI

PHASE 2 (Weeks 9-16): Core Operations
D08 Media + D18 Analytics + D06 Library + D15 Infrastructure

PHASE 3 (Weeks 17-28): Institutional Core
D03 Academics + D04 Research + D11 Finance + D13 Compliance

PHASE 4 (Weeks 29-38): Administrative
D02 Administration + D01 Governance + D07 Publications + D12 Legal

PHASE 5 (Weeks 39-46): External
D09 Community + D10 Volunteers + D19 Outreach + D20 Partnerships

PHASE 6 (Weeks 47-49): Strategic
D21 Sustainability
`

---

## 8. Recommendations

### 8.1 Immediate Actions

1. Create foundation agents: knowledge-agent, pipeline-agent, quality-agent, monitoring-agent, devops-agent
2. Create foundation services: knowledge-service, quality-gates-service, notification-service, document-service, storage-service
3. Begin KM02 Knowledge Ingestion — highest-impact missing capability
4. Begin E02 Agent Orchestration — enables all multi-agent workflows

### 8.2 Architecture Principles

1. Every component traces to a capability — no orphan services, agents, or UIs
2. Services are cross-cutting — notification, document, analytics serve multiple domains
3. Agents are domain-specific — one agent per domain
4. Packages compose agents + services — deployable units per domain
5. Applications expose packages to users — one app per user persona

### 8.3 Next ADRs

1. ADR-007: Agent Architecture
2. ADR-008: Service Architecture
3. ADR-009: Workflow Architecture
4. ADR-010: Event Architecture
5. ADR-011: Knowledge Object Architecture
6. ADR-012: Application Architecture

---

**End of ADR-006**
