---
title: "Joe Reis and Matt Housley :: Fundamentals of Data Engineering"
author: ["Justin"]
date: 2024-07-19T15:32:00-04:00
lastmod: 2024-07-23T18:22:52-04:00
draft: false
---

[O'reilly]({{< relref "../main/o_reilly.md" >}})  book from 2022. I haven't heard as much praise (or anything at all,
compared to old standards) - but as most of my career has been data, I thought
I'd give it a skim.

<div class="outline-1 jvc">

## Fundamentals of Data Engineering {#fundamentals-of-data-engineering}

<div class="outline-2 jvc">

### Part I. Foundation and Building Blocks {#part-i-dot-foundation-and-building-blocks}

<div class="outline-3 jvc">

#### Chapter 1. Data Engineering Described {#chapter-1-dot-data-engineering-described}

<div class="outline-4 jvc">

##### What Is Data Engineering? {#what-is-data-engineering}

<div class="outline-5 jvc">

###### Data Engineering Defined {#data-engineering-defined}


</div>

<div class="outline-5 jvc">

###### The Data Engineering Lifecycle {#the-data-engineering-lifecycle}


</div>

<div class="outline-5 jvc">

###### Evolution of the Data Engineer {#evolution-of-the-data-engineer}


</div>

<div class="outline-5 jvc">

###### Data Engineering and Data Science {#data-engineering-and-data-science}


</div>

</div>

<div class="outline-4 jvc">

##### Data Engineering Skills and Activities {#data-engineering-skills-and-activities}

<div class="outline-5 jvc">

###### Data Maturity and the Data Engineer {#data-maturity-and-the-data-engineer}


</div>

<div class="outline-5 jvc">

###### The Background and Skills of a Data Engineer {#the-background-and-skills-of-a-data-engineer}


</div>

<div class="outline-5 jvc">

###### Business Responsibilities {#business-responsibilities}


</div>

<div class="outline-5 jvc">

###### Technical Responsibilities {#technical-responsibilities}


</div>

<div class="outline-5 jvc">

###### The Continuum of Data Engineering Roles, from A to B {#the-continuum-of-data-engineering-roles-from-a-to-b}


</div>

</div>

<div class="outline-4 jvc">

##### Data Engineers Inside an Organization {#data-engineers-inside-an-organization}

<div class="outline-5 jvc">

###### Internal-Facing Versus External-Facing Data Engineers {#internal-facing-versus-external-facing-data-engineers}


</div>

<div class="outline-5 jvc">

###### Data Engineers and Other Technical Roles {#data-engineers-and-other-technical-roles}


</div>

<div class="outline-5 jvc">

###### Data Engineers and Business Leadership {#data-engineers-and-business-leadership}


</div>

</div>

<div class="outline-4 jvc">

##### Conclusion {#conclusion}


</div>

<div class="outline-4 jvc">

##### Additional Resources {#additional-resources}


</div>

</div>

<div class="outline-3 jvc">

#### Chapter 2. The Data Engineering Lifecycle {#chapter-2-dot-the-data-engineering-lifecycle}

<div class="outline-4 jvc">

##### What Is the Data Engineering Lifecycle? {#what-is-the-data-engineering-lifecycle}

<div class="outline-5 jvc">

###### The Data Lifecycle Versus the Data Engineering Lifecycle {#the-data-lifecycle-versus-the-data-engineering-lifecycle}


</div>

<div class="outline-5 jvc">

###### Generation: Source Systems {#generation-source-systems}


</div>

<div class="outline-5 jvc">

###### Storage {#storage}


</div>

<div class="outline-5 jvc">

###### Ingestion {#ingestion}


</div>

<div class="outline-5 jvc">

###### Transformation {#transformation}


</div>

<div class="outline-5 jvc">

###### Serving Data {#serving-data}


</div>

</div>

<div class="outline-4 jvc">

##### Major Undercurrents Across the Data Engineering Lifecycle {#major-undercurrents-across-the-data-engineering-lifecycle}

<div class="outline-5 jvc">

###### Security {#security}


</div>

<div class="outline-5 jvc">

###### Data Management {#data-management}


</div>

<div class="outline-5 jvc">

###### DataOps {#dataops}


</div>

<div class="outline-5 jvc">

###### Data Architecture {#data-architecture}


</div>

<div class="outline-5 jvc">

###### Orchestration {#orchestration}


</div>

<div class="outline-5 jvc">

###### Software Engineering {#software-engineering}


</div>

</div>

<div class="outline-4 jvc">

##### Conclusion {#conclusion}


</div>

<div class="outline-4 jvc">

##### Additional Resources {#additional-resources}


</div>

</div>

<div class="outline-3 jvc">

#### Chapter 3. Designing Good Data Architecture {#chapter-3-dot-designing-good-data-architecture}

<div class="outline-4 jvc">

##### What Is Data Architecture? {#what-is-data-architecture}

<div class="outline-5 jvc">

###### Enterprise Architecture Defined {#enterprise-architecture-defined}


</div>

<div class="outline-5 jvc">

###### Data Architecture Defined {#data-architecture-defined}


</div>

<div class="outline-5 jvc">

###### “Good” Data Architecture {#good-data-architecture}


</div>

</div>

<div class="outline-4 jvc">

##### Principles of Good Data Architecture {#principles-of-good-data-architecture}

<div class="outline-5 jvc">

###### Principle 1: Choose Common Components Wisely {#principle-1-choose-common-components-wisely}


</div>

<div class="outline-5 jvc">

###### Principle 2: Plan for Failure {#principle-2-plan-for-failure}


</div>

<div class="outline-5 jvc">

###### Principle 3: Architect for Scalability {#principle-3-architect-for-scalability}


</div>

<div class="outline-5 jvc">

###### Principle 4: Architecture Is Leadership {#principle-4-architecture-is-leadership}


</div>

<div class="outline-5 jvc">

###### Principle 5: Always Be Architecting {#principle-5-always-be-architecting}


</div>

<div class="outline-5 jvc">

###### Principle 6: Build Loosely Coupled Systems {#principle-6-build-loosely-coupled-systems}


</div>

<div class="outline-5 jvc">

###### Principle 7: Make Reversible Decisions {#principle-7-make-reversible-decisions}


</div>

<div class="outline-5 jvc">

###### Principle 8: Prioritize Security {#principle-8-prioritize-security}


</div>

<div class="outline-5 jvc">

###### Principle 9: Embrace FinOps {#principle-9-embrace-finops}


</div>

</div>

<div class="outline-4 jvc">

##### Major Architecture Concepts {#major-architecture-concepts}

<div class="outline-5 jvc">

###### Domains and Services {#domains-and-services}


</div>

<div class="outline-5 jvc">

###### Distributed Systems, Scalability, and Designing for Failure {#distributed-systems-scalability-and-designing-for-failure}


</div>

<div class="outline-5 jvc">

###### Tight Versus Loose Coupling: Tiers, Monoliths, and Microservices {#tight-versus-loose-coupling-tiers-monoliths-and-microservices}


</div>

<div class="outline-5 jvc">

###### User Access: Single Versus Multitenant {#user-access-single-versus-multitenant}


</div>

<div class="outline-5 jvc">

###### Event-Driven Architecture {#event-driven-architecture}


</div>

<div class="outline-5 jvc">

###### Brownfield Versus Greenfield Projects {#brownfield-versus-greenfield-projects}


</div>

</div>

<div class="outline-4 jvc">

##### Examples and Types of Data Architecture {#examples-and-types-of-data-architecture}

<div class="outline-5 jvc">

###### Data Warehouse {#data-warehouse}


</div>

<div class="outline-5 jvc">

###### Data Lake {#data-lake}


</div>

<div class="outline-5 jvc">

###### Convergence, Next-Generation Data Lakes, and the Data Platform {#convergence-next-generation-data-lakes-and-the-data-platform}


</div>

<div class="outline-5 jvc">

###### Modern Data Stack {#modern-data-stack}


</div>

<div class="outline-5 jvc">

###### Lambda Architecture {#lambda-architecture}


</div>

<div class="outline-5 jvc">

###### Kappa Architecture {#kappa-architecture}


</div>

<div class="outline-5 jvc">

###### The Dataflow Model and Unified Batch and Streaming {#the-dataflow-model-and-unified-batch-and-streaming}


</div>

<div class="outline-5 jvc">

###### Architecture for IoT {#architecture-for-iot}


</div>

<div class="outline-5 jvc">

###### Data Mesh {#data-mesh}


</div>

<div class="outline-5 jvc">

###### Other Data Architecture Examples {#other-data-architecture-examples}


</div>

</div>

<div class="outline-4 jvc">

##### Who’s Involved with Designing a Data Architecture? {#who-s-involved-with-designing-a-data-architecture}


</div>

<div class="outline-4 jvc">

##### Conclusion {#conclusion}


</div>

<div class="outline-4 jvc">

##### Additional Resources {#additional-resources}


</div>

</div>

<div class="outline-3 jvc">

#### Chapter 4. Choosing Technologies Across the Data Engineering Lifecycle {#chapter-4-dot-choosing-technologies-across-the-data-engineering-lifecycle}

<div class="outline-4 jvc">

##### Team Size and Capabilities {#team-size-and-capabilities}


</div>

<div class="outline-4 jvc">

##### Speed to Market {#speed-to-market}


</div>

<div class="outline-4 jvc">

##### Interoperability {#interoperability}


</div>

<div class="outline-4 jvc">

##### Cost Optimization and Business Value {#cost-optimization-and-business-value}

<div class="outline-5 jvc">

###### Total Cost of Ownership {#total-cost-of-ownership}


</div>

<div class="outline-5 jvc">

###### Total Opportunity Cost of Ownership {#total-opportunity-cost-of-ownership}


</div>

<div class="outline-5 jvc">

###### FinOps {#finops}


</div>

</div>

<div class="outline-4 jvc">

##### Today Versus the Future: Immutable Versus Transitory Technologies {#today-versus-the-future-immutable-versus-transitory-technologies}

<div class="outline-5 jvc">

###### Our Advice {#our-advice}


</div>

</div>

<div class="outline-4 jvc">

##### Location {#location}

<div class="outline-5 jvc">

###### On Premises {#on-premises}


</div>

<div class="outline-5 jvc">

###### Cloud {#cloud}


</div>

<div class="outline-5 jvc">

###### Hybrid Cloud {#hybrid-cloud}


</div>

<div class="outline-5 jvc">

###### Multicloud {#multicloud}


</div>

<div class="outline-5 jvc">

###### Decentralized: Blockchain and the Edge {#decentralized-blockchain-and-the-edge}


</div>

<div class="outline-5 jvc">

###### Our Advice {#our-advice}


</div>

<div class="outline-5 jvc">

###### Cloud Repatriation Arguments {#cloud-repatriation-arguments}


</div>

</div>

<div class="outline-4 jvc">

##### Build Versus Buy {#build-versus-buy}

<div class="outline-5 jvc">

###### Open Source Software {#open-source-software}


</div>

<div class="outline-5 jvc">

###### Proprietary Walled Gardens {#proprietary-walled-gardens}


</div>

<div class="outline-5 jvc">

###### Our Advice {#our-advice}


</div>

</div>

<div class="outline-4 jvc">

##### Monolith Versus Modular {#monolith-versus-modular}

<div class="outline-5 jvc">

###### Monolith {#monolith}


</div>

<div class="outline-5 jvc">

###### Modularity {#modularity}


</div>

<div class="outline-5 jvc">

###### The Distributed Monolith Pattern {#the-distributed-monolith-pattern}


</div>

<div class="outline-5 jvc">

###### Our Advice {#our-advice}


</div>

</div>

<div class="outline-4 jvc">

##### Serverless Versus Servers {#serverless-versus-servers}

<div class="outline-5 jvc">

###### Serverless {#serverless}


</div>

<div class="outline-5 jvc">

###### Containers {#containers}


</div>

<div class="outline-5 jvc">

###### How to Evaluate Server Versus Serverless {#how-to-evaluate-server-versus-serverless}


</div>

<div class="outline-5 jvc">

###### Our Advice {#our-advice}


</div>

</div>

<div class="outline-4 jvc">

##### Optimization, Performance, and the Benchmark Wars {#optimization-performance-and-the-benchmark-wars}

<div class="outline-5 jvc">

###### Big Data...for the 1990s {#big-data-dot-dot-dot-for-the-1990s}


</div>

<div class="outline-5 jvc">

###### Nonsensical Cost Comparisons {#nonsensical-cost-comparisons}


</div>

<div class="outline-5 jvc">

###### Asymmetric Optimization {#asymmetric-optimization}


</div>

<div class="outline-5 jvc">

###### Caveat Emptor {#caveat-emptor}


</div>

</div>

<div class="outline-4 jvc">

##### Undercurrents and Their Impacts on Choosing Technologies {#undercurrents-and-their-impacts-on-choosing-technologies}

<div class="outline-5 jvc">

###### Data Management {#data-management}


</div>

<div class="outline-5 jvc">

###### DataOps {#dataops}


</div>

<div class="outline-5 jvc">

###### Data Architecture {#data-architecture}


</div>

<div class="outline-5 jvc">

###### Orchestration Example: Airflow {#orchestration-example-airflow}


</div>

<div class="outline-5 jvc">

###### Software Engineering {#software-engineering}


</div>

</div>

<div class="outline-4 jvc">

##### Conclusion {#conclusion}


</div>

<div class="outline-4 jvc">

##### Additional Resources {#additional-resources}


</div>

</div>

</div>

<div class="outline-2 jvc">

### Part II. The Data Engineering Lifecycle in Depth {#part-ii-dot-the-data-engineering-lifecycle-in-depth}

<div class="outline-3 jvc">

#### Chapter 5. Data Generation in Source Systems {#chapter-5-dot-data-generation-in-source-systems}

<div class="outline-4 jvc">

##### Sources of Data: How Is Data Created? {#sources-of-data-how-is-data-created}


</div>

<div class="outline-4 jvc">

##### Source Systems: Main Ideas {#source-systems-main-ideas}

<div class="outline-5 jvc">

###### Files and Unstructured Data {#files-and-unstructured-data}


</div>

<div class="outline-5 jvc">

###### APIs {#apis}


</div>

<div class="outline-5 jvc">

###### Application Databases (OLTP Systems) {#application-databases--oltp-systems}


</div>

<div class="outline-5 jvc">

###### Online Analytical Processing System {#online-analytical-processing-system}


</div>

<div class="outline-5 jvc">

###### Change Data Capture {#change-data-capture}


</div>

<div class="outline-5 jvc">

###### Logs {#logs}


</div>

<div class="outline-5 jvc">

###### Database Logs {#database-logs}


</div>

<div class="outline-5 jvc">

###### CRUD {#crud}


</div>

<div class="outline-5 jvc">

###### Insert-Only {#insert-only}


</div>

<div class="outline-5 jvc">

###### Messages and Streams {#messages-and-streams}


</div>

<div class="outline-5 jvc">

###### Types of Time {#types-of-time}


</div>

</div>

<div class="outline-4 jvc">

##### Source System Practical Details {#source-system-practical-details}

<div class="outline-5 jvc">

###### Databases {#databases}


</div>

<div class="outline-5 jvc">

###### APIs {#apis}


</div>

<div class="outline-5 jvc">

###### Data Sharing {#data-sharing}


</div>

<div class="outline-5 jvc">

###### Third-Party Data Sources {#third-party-data-sources}


</div>

<div class="outline-5 jvc">

###### Message Queues and Event-Streaming Platforms {#message-queues-and-event-streaming-platforms}


</div>

</div>

<div class="outline-4 jvc">

##### Whom You’ll Work With {#whom-you-ll-work-with}


</div>

<div class="outline-4 jvc">

##### Undercurrents and Their Impact on Source Systems {#undercurrents-and-their-impact-on-source-systems}

<div class="outline-5 jvc">

###### Security {#security}


</div>

<div class="outline-5 jvc">

###### Data Management {#data-management}


</div>

<div class="outline-5 jvc">

###### DataOps {#dataops}


</div>

<div class="outline-5 jvc">

###### Data Architecture {#data-architecture}


</div>

<div class="outline-5 jvc">

###### Orchestration {#orchestration}


</div>

<div class="outline-5 jvc">

###### Software Engineering {#software-engineering}


</div>

</div>

<div class="outline-4 jvc">

##### Conclusion {#conclusion}


</div>

<div class="outline-4 jvc">

##### Additional Resources {#additional-resources}


</div>

</div>

<div class="outline-3 jvc">

#### Chapter 6. Storage {#chapter-6-dot-storage}

<div class="outline-4 jvc">

##### Raw Ingredients of Data Storage {#raw-ingredients-of-data-storage}

<div class="outline-5 jvc">

###### Magnetic Disk Drive {#magnetic-disk-drive}


</div>

<div class="outline-5 jvc">

###### Solid-State Drive {#solid-state-drive}


</div>

<div class="outline-5 jvc">

###### Random Access Memory {#random-access-memory}


</div>

<div class="outline-5 jvc">

###### Networking and CPU {#networking-and-cpu}


</div>

<div class="outline-5 jvc">

###### Serialization {#serialization}


</div>

<div class="outline-5 jvc">

###### Compression {#compression}


</div>

<div class="outline-5 jvc">

###### Caching {#caching}


</div>

</div>

<div class="outline-4 jvc">

##### Data Storage Systems {#data-storage-systems}

<div class="outline-5 jvc">

###### Single Machine Versus Distributed Storage {#single-machine-versus-distributed-storage}


</div>

<div class="outline-5 jvc">

###### Eventual Versus Strong Consistency {#eventual-versus-strong-consistency}


</div>

<div class="outline-5 jvc">

###### File Storage {#file-storage}


</div>

<div class="outline-5 jvc">

###### Block Storage {#block-storage}


</div>

<div class="outline-5 jvc">

###### Object Storage {#object-storage}


</div>

<div class="outline-5 jvc">

###### Cache and Memory-Based Storage Systems {#cache-and-memory-based-storage-systems}


</div>

<div class="outline-5 jvc">

###### The Hadoop Distributed File System {#the-hadoop-distributed-file-system}


</div>

<div class="outline-5 jvc">

###### Streaming Storage {#streaming-storage}


</div>

<div class="outline-5 jvc">

###### Indexes, Partitioning, and Clustering {#indexes-partitioning-and-clustering}


</div>

</div>

<div class="outline-4 jvc">

##### Data Engineering Storage Abstractions {#data-engineering-storage-abstractions}

<div class="outline-5 jvc">

###### The Data Warehouse {#the-data-warehouse}


</div>

<div class="outline-5 jvc">

###### The Data Lake {#the-data-lake}


</div>

<div class="outline-5 jvc">

###### The Data Lakehouse {#the-data-lakehouse}


</div>

<div class="outline-5 jvc">

###### Data Platforms {#data-platforms}


</div>

<div class="outline-5 jvc">

###### Stream-to-Batch Storage Architecture {#stream-to-batch-storage-architecture}


</div>

</div>

<div class="outline-4 jvc">

##### Big Ideas and Trends in Storage {#big-ideas-and-trends-in-storage}

<div class="outline-5 jvc">

###### Data Catalog {#data-catalog}


</div>

<div class="outline-5 jvc">

###### Data Sharing {#data-sharing}


</div>

<div class="outline-5 jvc">

###### Schema {#schema}


</div>

<div class="outline-5 jvc">

###### Separation of Compute from Storage {#separation-of-compute-from-storage}


</div>

<div class="outline-5 jvc">

###### Data Storage Lifecycle and Data Retention {#data-storage-lifecycle-and-data-retention}


</div>

<div class="outline-5 jvc">

###### Single-Tenant Versus Multitenant Storage {#single-tenant-versus-multitenant-storage}


</div>

</div>

<div class="outline-4 jvc">

##### Whom You’ll Work With {#whom-you-ll-work-with}


</div>

<div class="outline-4 jvc">

##### Undercurrents {#undercurrents}

<div class="outline-5 jvc">

###### Security {#security}


</div>

<div class="outline-5 jvc">

###### Data Management {#data-management}


</div>

<div class="outline-5 jvc">

###### DataOps {#dataops}


</div>

<div class="outline-5 jvc">

###### Data Architecture {#data-architecture}


</div>

<div class="outline-5 jvc">

###### Orchestration {#orchestration}


</div>

<div class="outline-5 jvc">

###### Software Engineering {#software-engineering}


</div>

</div>

<div class="outline-4 jvc">

##### Conclusion {#conclusion}


</div>

<div class="outline-4 jvc">

##### Additional Resources {#additional-resources}


</div>

</div>

<div class="outline-3 jvc">

#### Chapter 7. Ingestion {#chapter-7-dot-ingestion}

<div class="outline-4 jvc">

##### What Is Data Ingestion? {#what-is-data-ingestion}


</div>

<div class="outline-4 jvc">

##### Key Engineering Considerations for the Ingestion Phase {#key-engineering-considerations-for-the-ingestion-phase}

<div class="outline-5 jvc">

###### Bounded Versus Unbounded Data {#bounded-versus-unbounded-data}


</div>

<div class="outline-5 jvc">

###### Frequency {#frequency}


</div>

<div class="outline-5 jvc">

###### Synchronous Versus Asynchronous Ingestion {#synchronous-versus-asynchronous-ingestion}


</div>

<div class="outline-5 jvc">

###### Serialization and Deserialization {#serialization-and-deserialization}


</div>

<div class="outline-5 jvc">

###### Throughput and Scalability {#throughput-and-scalability}


</div>

<div class="outline-5 jvc">

###### Reliability and Durability {#reliability-and-durability}


</div>

<div class="outline-5 jvc">

###### Payload {#payload}


</div>

<div class="outline-5 jvc">

###### Push Versus Pull Versus Poll Patterns {#push-versus-pull-versus-poll-patterns}


</div>

</div>

<div class="outline-4 jvc">

##### Batch Ingestion Considerations {#batch-ingestion-considerations}

<div class="outline-5 jvc">

###### Snapshot or Differential Extraction {#snapshot-or-differential-extraction}


</div>

<div class="outline-5 jvc">

###### File-Based Export and Ingestion {#file-based-export-and-ingestion}


</div>

<div class="outline-5 jvc">

###### ETL Versus ELT {#etl-versus-elt}


</div>

<div class="outline-5 jvc">

###### Inserts, Updates, and Batch Size {#inserts-updates-and-batch-size}


</div>

<div class="outline-5 jvc">

###### Data Migration {#data-migration}


</div>

</div>

<div class="outline-4 jvc">

##### Message and Stream Ingestion Considerations {#message-and-stream-ingestion-considerations}

<div class="outline-5 jvc">

###### Schema Evolution {#schema-evolution}


</div>

<div class="outline-5 jvc">

###### Late-Arriving Data {#late-arriving-data}


</div>

<div class="outline-5 jvc">

###### Ordering and Multiple Delivery {#ordering-and-multiple-delivery}


</div>

<div class="outline-5 jvc">

###### Replay {#replay}


</div>

<div class="outline-5 jvc">

###### Time to Live {#time-to-live}


</div>

<div class="outline-5 jvc">

###### Message Size {#message-size}


</div>

<div class="outline-5 jvc">

###### Error Handling and Dead-Letter Queues {#error-handling-and-dead-letter-queues}


</div>

<div class="outline-5 jvc">

###### Consumer Pull and Push {#consumer-pull-and-push}


</div>

<div class="outline-5 jvc">

###### Location {#location}


</div>

</div>

<div class="outline-4 jvc">

##### Ways to Ingest Data {#ways-to-ingest-data}

<div class="outline-5 jvc">

###### Direct Database Connection {#direct-database-connection}


</div>

<div class="outline-5 jvc">

###### Change Data Capture {#change-data-capture}


</div>

<div class="outline-5 jvc">

###### APIs {#apis}


</div>

<div class="outline-5 jvc">

###### Message Queues and Event-Streaming Platforms {#message-queues-and-event-streaming-platforms}


</div>

<div class="outline-5 jvc">

###### Managed Data Connectors {#managed-data-connectors}


</div>

<div class="outline-5 jvc">

###### Moving Data with Object Storage {#moving-data-with-object-storage}


</div>

<div class="outline-5 jvc">

###### EDI {#edi}


</div>

<div class="outline-5 jvc">

###### Databases and File Export {#databases-and-file-export}


</div>

<div class="outline-5 jvc">

###### Practical Issues with Common File Formats {#practical-issues-with-common-file-formats}


</div>

<div class="outline-5 jvc">

###### Shell {#shell}


</div>

<div class="outline-5 jvc">

###### SSH {#ssh}


</div>

<div class="outline-5 jvc">

###### SFTP and SCP {#sftp-and-scp}


</div>

<div class="outline-5 jvc">

###### Webhooks {#webhooks}


</div>

<div class="outline-5 jvc">

###### Web Interface {#web-interface}


</div>

<div class="outline-5 jvc">

###### Web Scraping {#web-scraping}


</div>

<div class="outline-5 jvc">

###### Transfer Appliances for Data Migration {#transfer-appliances-for-data-migration}


</div>

<div class="outline-5 jvc">

###### Data Sharing {#data-sharing}


</div>

</div>

<div class="outline-4 jvc">

##### Whom You’ll Work With {#whom-you-ll-work-with}

<div class="outline-5 jvc">

###### Upstream Stakeholders {#upstream-stakeholders}


</div>

<div class="outline-5 jvc">

###### Downstream Stakeholders {#downstream-stakeholders}


</div>

</div>

<div class="outline-4 jvc">

##### Undercurrents {#undercurrents}

<div class="outline-5 jvc">

###### Security {#security}


</div>

<div class="outline-5 jvc">

###### Data Management {#data-management}


</div>

<div class="outline-5 jvc">

###### DataOps {#dataops}


</div>

<div class="outline-5 jvc">

###### Orchestration {#orchestration}


</div>

<div class="outline-5 jvc">

###### Software Engineering {#software-engineering}


</div>

</div>

<div class="outline-4 jvc">

##### Conclusion {#conclusion}


</div>

<div class="outline-4 jvc">

##### Additional Resources {#additional-resources}


</div>

</div>

<div class="outline-3 jvc">

#### Chapter 8. Queries, Modeling, and Transformation {#chapter-8-dot-queries-modeling-and-transformation}

<div class="outline-4 jvc">

##### Queries {#queries}

<div class="outline-5 jvc">

###### What Is a Query? {#what-is-a-query}


</div>

<div class="outline-5 jvc">

###### The Life of a Query {#the-life-of-a-query}


</div>

<div class="outline-5 jvc">

###### The Query Optimizer {#the-query-optimizer}


</div>

<div class="outline-5 jvc">

###### Improving Query Performance {#improving-query-performance}


</div>

<div class="outline-5 jvc">

###### Queries on Streaming Data {#queries-on-streaming-data}


</div>

</div>

<div class="outline-4 jvc">

##### Data Modeling {#data-modeling}

<div class="outline-5 jvc">

###### What Is a Data Model? {#what-is-a-data-model}


</div>

<div class="outline-5 jvc">

###### Conceptual, Logical, and Physical Data Models {#conceptual-logical-and-physical-data-models}


</div>

<div class="outline-5 jvc">

###### Normalization {#normalization}


</div>

<div class="outline-5 jvc">

###### Techniques for Modeling Batch Analytical Data {#techniques-for-modeling-batch-analytical-data}


</div>

<div class="outline-5 jvc">

###### Modeling Streaming Data {#modeling-streaming-data}


</div>

</div>

<div class="outline-4 jvc">

##### Transformations {#transformations}

<div class="outline-5 jvc">

###### Batch Transformations {#batch-transformations}


</div>

<div class="outline-5 jvc">

###### Materialized Views, Federation, and Query Virtualization {#materialized-views-federation-and-query-virtualization}


</div>

<div class="outline-5 jvc">

###### Streaming Transformations and Processing {#streaming-transformations-and-processing}


</div>

</div>

<div class="outline-4 jvc">

##### Whom You’ll Work With {#whom-you-ll-work-with}

<div class="outline-5 jvc">

###### Upstream Stakeholders {#upstream-stakeholders}


</div>

<div class="outline-5 jvc">

###### Downstream Stakeholders {#downstream-stakeholders}


</div>

</div>

<div class="outline-4 jvc">

##### Undercurrents {#undercurrents}

<div class="outline-5 jvc">

###### Security {#security}


</div>

<div class="outline-5 jvc">

###### Data Management {#data-management}


</div>

<div class="outline-5 jvc">

###### DataOps {#dataops}


</div>

<div class="outline-5 jvc">

###### Data Architecture {#data-architecture}


</div>

<div class="outline-5 jvc">

###### Orchestration {#orchestration}


</div>

<div class="outline-5 jvc">

###### Software Engineering {#software-engineering}


</div>

</div>

<div class="outline-4 jvc">

##### Conclusion {#conclusion}


</div>

<div class="outline-4 jvc">

##### Additional Resources {#additional-resources}


</div>

</div>

<div class="outline-3 jvc">

#### Chapter 9. Serving Data for Analytics, Machine Learning, and Reverse ETL {#chapter-9-dot-serving-data-for-analytics-machine-learning-and-reverse-etl}

<div class="outline-4 jvc">

##### General Considerations for Serving Data {#general-considerations-for-serving-data}

<div class="outline-5 jvc">

###### Trust {#trust}


</div>

<div class="outline-5 jvc">

###### What’s the Use Case, and Who’s the User? {#what-s-the-use-case-and-who-s-the-user}


</div>

<div class="outline-5 jvc">

###### Data Products {#data-products}


</div>

<div class="outline-5 jvc">

###### Self-Service or Not? {#self-service-or-not}


</div>

<div class="outline-5 jvc">

###### Data Definitions and Logic {#data-definitions-and-logic}


</div>

<div class="outline-5 jvc">

###### Data Mesh {#data-mesh}


</div>

</div>

<div class="outline-4 jvc">

##### Analytics {#analytics}

<div class="outline-5 jvc">

###### Business Analytics {#business-analytics}


</div>

<div class="outline-5 jvc">

###### Operational Analytics {#operational-analytics}


</div>

<div class="outline-5 jvc">

###### Embedded Analytics {#embedded-analytics}


</div>

</div>

<div class="outline-4 jvc">

##### Machine Learning {#machine-learning}


</div>

<div class="outline-4 jvc">

##### What a Data Engineer Should Know About ML {#what-a-data-engineer-should-know-about-ml}


</div>

<div class="outline-4 jvc">

##### Ways to Serve Data for Analytics and ML {#ways-to-serve-data-for-analytics-and-ml}

<div class="outline-5 jvc">

###### File Exchange {#file-exchange}


</div>

<div class="outline-5 jvc">

###### Databases {#databases}


</div>

<div class="outline-5 jvc">

###### Streaming Systems {#streaming-systems}


</div>

<div class="outline-5 jvc">

###### Query Federation {#query-federation}


</div>

<div class="outline-5 jvc">

###### Data Sharing {#data-sharing}


</div>

<div class="outline-5 jvc">

###### Semantic and Metrics Layers {#semantic-and-metrics-layers}


</div>

<div class="outline-5 jvc">

###### Serving Data in Notebooks {#serving-data-in-notebooks}


</div>

</div>

<div class="outline-4 jvc">

##### Reverse ETL {#reverse-etl}


</div>

<div class="outline-4 jvc">

##### Whom You’ll Work With {#whom-you-ll-work-with}


</div>

<div class="outline-4 jvc">

##### Undercurrents {#undercurrents}

<div class="outline-5 jvc">

###### Security {#security}


</div>

<div class="outline-5 jvc">

###### Data Management {#data-management}


</div>

<div class="outline-5 jvc">

###### DataOps {#dataops}


</div>

<div class="outline-5 jvc">

###### Data Architecture {#data-architecture}


</div>

<div class="outline-5 jvc">

###### Orchestration {#orchestration}


</div>

<div class="outline-5 jvc">

###### Software Engineering {#software-engineering}


</div>

</div>

<div class="outline-4 jvc">

##### Conclusion {#conclusion}


</div>

<div class="outline-4 jvc">

##### Additional Resources {#additional-resources}


</div>

</div>

</div>

<div class="outline-2 jvc">

### Part III. Security, Privacy, and the Future of Data Engineering {#part-iii-dot-security-privacy-and-the-future-of-data-engineering}

<div class="outline-3 jvc">

#### Chapter 10. Security and Privacy {#chapter-10-dot-security-and-privacy}

<div class="outline-4 jvc">

##### People {#people}

<div class="outline-5 jvc">

###### The Power of Negative Thinking {#the-power-of-negative-thinking}


</div>

<div class="outline-5 jvc">

###### Always Be Paranoid {#always-be-paranoid}


</div>

</div>

<div class="outline-4 jvc">

##### Processes {#processes}

<div class="outline-5 jvc">

###### Security Theater Versus Security Habit {#security-theater-versus-security-habit}


</div>

<div class="outline-5 jvc">

###### Active Security {#active-security}


</div>

<div class="outline-5 jvc">

###### The Principle of Least Privilege {#the-principle-of-least-privilege}


</div>

<div class="outline-5 jvc">

###### Shared Responsibility in the Cloud {#shared-responsibility-in-the-cloud}


</div>

<div class="outline-5 jvc">

###### Always Back Up Your Data {#always-back-up-your-data}


</div>

<div class="outline-5 jvc">

###### An Example Security Policy {#an-example-security-policy}


</div>

</div>

<div class="outline-4 jvc">

##### Technology {#technology}

<div class="outline-5 jvc">

###### Patch and Update Systems {#patch-and-update-systems}


</div>

<div class="outline-5 jvc">

###### Encryption {#encryption}


</div>

<div class="outline-5 jvc">

###### Logging, Monitoring, and Alerting {#logging-monitoring-and-alerting}


</div>

<div class="outline-5 jvc">

###### Network Access {#network-access}


</div>

<div class="outline-5 jvc">

###### Security for Low-Level Data Engineering {#security-for-low-level-data-engineering}


</div>

</div>

<div class="outline-4 jvc">

##### Conclusion {#conclusion}


</div>

<div class="outline-4 jvc">

##### Additional Resources {#additional-resources}


</div>

</div>

<div class="outline-3 jvc">

#### Chapter 11. The Future of Data Engineering {#chapter-11-dot-the-future-of-data-engineering}

<div class="outline-4 jvc">

##### The Data Engineering Lifecycle Isn’t Going Away {#the-data-engineering-lifecycle-isn-t-going-away}


</div>

<div class="outline-4 jvc">

##### The Decline of Complexity and the Rise of Easy-to-Use Data Tools {#the-decline-of-complexity-and-the-rise-of-easy-to-use-data-tools}


</div>

<div class="outline-4 jvc">

##### The Cloud-Scale Data OS and Improved Interoperability {#the-cloud-scale-data-os-and-improved-interoperability}


</div>

<div class="outline-4 jvc">

##### “Enterprisey” Data Engineering {#enterprisey-data-engineering}


</div>

<div class="outline-4 jvc">

##### Titles and Responsibilities Will Morph... {#titles-and-responsibilities-will-morph-dot-dot-dot}


</div>

<div class="outline-4 jvc">

##### Moving Beyond the Modern Data Stack, Toward the Live Data Stack {#moving-beyond-the-modern-data-stack-toward-the-live-data-stack}

<div class="outline-5 jvc">

###### The Live Data Stack {#the-live-data-stack}


</div>

<div class="outline-5 jvc">

###### Streaming Pipelines and Real-Time Analytical Databases {#streaming-pipelines-and-real-time-analytical-databases}


</div>

<div class="outline-5 jvc">

###### The Fusion of Data with Applications {#the-fusion-of-data-with-applications}


</div>

<div class="outline-5 jvc">

###### The Tight Feedback Between Applications and ML {#the-tight-feedback-between-applications-and-ml}


</div>

<div class="outline-5 jvc">

###### Dark Matter Data and the Rise of...Spreadsheets?! {#dark-matter-data-and-the-rise-of-dot-dot-dot-spreadsheets}


</div>

</div>

<div class="outline-4 jvc">

##### Conclusion {#conclusion}


</div>

</div>

</div>

<div class="outline-2 jvc">

### Appendix A. Serialization and Compression Technical Details {#appendix-a-dot-serialization-and-compression-technical-details}

<div class="outline-3 jvc">

#### Serialization Formats {#serialization-formats}

<div class="outline-4 jvc">

##### Row-Based Serialization {#row-based-serialization}


</div>

<div class="outline-4 jvc">

##### Columnar Serialization {#columnar-serialization}


</div>

<div class="outline-4 jvc">

##### Hybrid Serialization {#hybrid-serialization}


</div>

</div>

<div class="outline-3 jvc">

#### Database Storage Engines {#database-storage-engines}


</div>

<div class="outline-3 jvc">

#### Compression: gzip, bzip2, Snappy, Etc. {#compression-gzip-bzip2-snappy-etc-dot}


</div>

</div>

<div class="outline-2 jvc">

### Appendix B. Cloud Networking {#appendix-b-dot-cloud-networking}

<div class="outline-3 jvc">

#### Cloud Network Topology {#cloud-network-topology}

<div class="outline-4 jvc">

##### Data Egress Charges {#data-egress-charges}


</div>

<div class="outline-4 jvc">

##### Availability Zones {#availability-zones}


</div>

<div class="outline-4 jvc">

##### Regions {#regions}


</div>

<div class="outline-4 jvc">

##### GCP-Specific Networking and Multiregional Redundancy {#gcp-specific-networking-and-multiregional-redundancy}


</div>

<div class="outline-4 jvc">

##### Direct Network Connections to the Clouds {#direct-network-connections-to-the-clouds}


</div>

</div>

<div class="outline-3 jvc">

#### CDNs {#cdns}


</div>

<div class="outline-3 jvc">

#### The Future of Data Egress Fees {#the-future-of-data-egress-fees}

\*

</div>

</div>

</div>
