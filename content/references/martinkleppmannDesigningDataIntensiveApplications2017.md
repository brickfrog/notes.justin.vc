---
title: "Martin Kleppmann :: Designing Data-Intensive Applications: The Big Ideas Behind Reliable, Scalable, and Maintainable Systems"
author: ["Justin"]
date: 2024-07-17T19:55:00-04:00
lastmod: 2024-08-15T23:16:40-04:00
tags: ["oreilly", "software-architecture", "software-engineering", "book"]
draft: false
creator: "Emacs 29.4 (Org mode 9.8 + ox-hugo)"
---

Apparently this is getting a second edition soon(?) - so will wait off on doing
notes for the first edition.

<div class="outline-1 jvc">

## Designing Data-Intensive Applications {#designing-data-intensive-applications}

<div class="outline-2 jvc">

### Part I. Foundations of Data Systems {#part-i-dot-foundations-of-data-systems}

<div class="outline-3 jvc">

#### Chapter 1. Reliable, Scalable, and Maintainable Applications {#chapter-1-dot-reliable-scalable-and-maintainable-applications}

<div class="outline-4 jvc">

##### Thinking About Data Systems {#thinking-about-data-systems}


</div>

<div class="outline-4 jvc">

##### Reliability {#reliability}

<div class="outline-5 jvc">

###### Hardware Faults {#hardware-faults}


</div>

<div class="outline-5 jvc">

###### Software Errors {#software-errors}


</div>

<div class="outline-5 jvc">

###### Human Errors {#human-errors}


</div>

<div class="outline-5 jvc">

###### How Important Is Reliability? {#how-important-is-reliability}


</div>

</div>

<div class="outline-4 jvc">

##### Scalability {#scalability}

<div class="outline-5 jvc">

###### Describing Load {#describing-load}


</div>

<div class="outline-5 jvc">

###### Describing Performance {#describing-performance}


</div>

<div class="outline-5 jvc">

###### Approaches for Coping with Load {#approaches-for-coping-with-load}


</div>

</div>

<div class="outline-4 jvc">

##### Maintainability {#maintainability}

<div class="outline-5 jvc">

###### Operability: Making Life Easy for Operations {#operability-making-life-easy-for-operations}


</div>

<div class="outline-5 jvc">

###### Simplicity: Managing Complexity {#simplicity-managing-complexity}


</div>

<div class="outline-5 jvc">

###### Evolvability: Making Change Easy {#evolvability-making-change-easy}


</div>

</div>

<div class="outline-4 jvc">

##### Summary {#summary}


</div>

</div>

<div class="outline-3 jvc">

#### Chapter 2. Data Models and Query Languages {#chapter-2-dot-data-models-and-query-languages}

<div class="outline-4 jvc">

##### Relational Model Versus Document Model {#relational-model-versus-document-model}

<div class="outline-5 jvc">

###### The Birth of NoSQL {#the-birth-of-nosql}


</div>

<div class="outline-5 jvc">

###### The Object-Relational Mismatch {#the-object-relational-mismatch}


</div>

<div class="outline-5 jvc">

###### Many-to-One and Many-to-Many Relationships {#many-to-one-and-many-to-many-relationships}


</div>

<div class="outline-5 jvc">

###### Are Document Databases Repeating History? {#are-document-databases-repeating-history}


</div>

<div class="outline-5 jvc">

###### Relational Versus Document Databases Today {#relational-versus-document-databases-today}


</div>

</div>

<div class="outline-4 jvc">

##### Query Languages for Data {#query-languages-for-data}

<div class="outline-5 jvc">

###### Declarative Queries on the Web {#declarative-queries-on-the-web}


</div>

<div class="outline-5 jvc">

###### MapReduce Querying {#mapreduce-querying}


</div>

</div>

<div class="outline-4 jvc">

##### Graph-Like Data Models {#graph-like-data-models}

<div class="outline-5 jvc">

###### Property Graphs {#property-graphs}


</div>

<div class="outline-5 jvc">

###### The Cypher Query Language {#the-cypher-query-language}


</div>

<div class="outline-5 jvc">

###### Graph Queries in SQL {#graph-queries-in-sql}


</div>

<div class="outline-5 jvc">

###### Triple-Stores and SPARQL {#triple-stores-and-sparql}


</div>

<div class="outline-5 jvc">

###### The Foundation: Datalog {#the-foundation-datalog}


</div>

</div>

<div class="outline-4 jvc">

##### Summary {#summary}


</div>

</div>

<div class="outline-3 jvc">

#### Chapter 3. Storage and Retrieval {#chapter-3-dot-storage-and-retrieval}

<div class="outline-4 jvc">

##### Data Structures That Power Your Database {#data-structures-that-power-your-database}

<div class="outline-5 jvc">

###### Hash Indexes {#hash-indexes}


</div>

<div class="outline-5 jvc">

###### SSTables and LSM-Trees {#sstables-and-lsm-trees}


</div>

<div class="outline-5 jvc">

###### B-Trees {#b-trees}


</div>

<div class="outline-5 jvc">

###### Comparing B-Trees and LSM-Trees {#comparing-b-trees-and-lsm-trees}


</div>

<div class="outline-5 jvc">

###### Other Indexing Structures {#other-indexing-structures}


</div>

</div>

<div class="outline-4 jvc">

##### Transaction Processing or Analytics? {#transaction-processing-or-analytics}

<div class="outline-5 jvc">

###### Data Warehousing {#data-warehousing}


</div>

<div class="outline-5 jvc">

###### Stars and Snowflakes: Schemas for Analytics {#stars-and-snowflakes-schemas-for-analytics}


</div>

</div>

<div class="outline-4 jvc">

##### Column-Oriented Storage {#column-oriented-storage}

<div class="outline-5 jvc">

###### Column Compression {#column-compression}


</div>

<div class="outline-5 jvc">

###### Sort Order in Column Storage {#sort-order-in-column-storage}


</div>

<div class="outline-5 jvc">

###### Writing to Column-Oriented Storage {#writing-to-column-oriented-storage}


</div>

<div class="outline-5 jvc">

###### Aggregation: Data Cubes and Materialized Views {#aggregation-data-cubes-and-materialized-views}


</div>

</div>

<div class="outline-4 jvc">

##### Summary {#summary}


</div>

</div>

<div class="outline-3 jvc">

#### Chapter 4. Encoding and Evolution {#chapter-4-dot-encoding-and-evolution}

<div class="outline-4 jvc">

##### Formats for Encoding Data {#formats-for-encoding-data}

<div class="outline-5 jvc">

###### Language-Specific Formats {#language-specific-formats}


</div>

<div class="outline-5 jvc">

###### JSON, XML, and Binary Variants {#json-xml-and-binary-variants}


</div>

<div class="outline-5 jvc">

###### Thrift and Protocol Buffers {#thrift-and-protocol-buffers}


</div>

<div class="outline-5 jvc">

###### Avro {#avro}


</div>

<div class="outline-5 jvc">

###### The Merits of Schemas {#the-merits-of-schemas}


</div>

</div>

<div class="outline-4 jvc">

##### Modes of Dataflow {#modes-of-dataflow}

<div class="outline-5 jvc">

###### Dataflow Through Databases {#dataflow-through-databases}


</div>

<div class="outline-5 jvc">

###### Dataflow Through Services: REST and RPC {#dataflow-through-services-rest-and-rpc}


</div>

<div class="outline-5 jvc">

###### Message-Passing Dataflow {#message-passing-dataflow}


</div>

</div>

<div class="outline-4 jvc">

##### Summary {#summary}


</div>

</div>

</div>

<div class="outline-2 jvc">

### Part II. Distributed Data {#part-ii-dot-distributed-data}

<div class="outline-3 jvc">

#### Chapter 5. Replication {#chapter-5-dot-replication}

<div class="outline-4 jvc">

##### Leaders and Followers {#leaders-and-followers}

<div class="outline-5 jvc">

###### Synchronous Versus Asynchronous Replication {#synchronous-versus-asynchronous-replication}


</div>

<div class="outline-5 jvc">

###### Setting Up New Followers {#setting-up-new-followers}


</div>

<div class="outline-5 jvc">

###### Handling Node Outages {#handling-node-outages}


</div>

<div class="outline-5 jvc">

###### Implementation of Replication Logs {#implementation-of-replication-logs}


</div>

</div>

<div class="outline-4 jvc">

##### Problems with Replication Lag {#problems-with-replication-lag}

<div class="outline-5 jvc">

###### Reading Your Own Writes {#reading-your-own-writes}


</div>

<div class="outline-5 jvc">

###### Monotonic Reads {#monotonic-reads}


</div>

<div class="outline-5 jvc">

###### Consistent Prefix Reads {#consistent-prefix-reads}


</div>

<div class="outline-5 jvc">

###### Solutions for Replication Lag {#solutions-for-replication-lag}


</div>

</div>

<div class="outline-4 jvc">

##### Multi-Leader Replication {#multi-leader-replication}

<div class="outline-5 jvc">

###### Use Cases for Multi-Leader Replication {#use-cases-for-multi-leader-replication}


</div>

<div class="outline-5 jvc">

###### Handling Write Conflicts {#handling-write-conflicts}


</div>

<div class="outline-5 jvc">

###### Multi-Leader Replication Topologies {#multi-leader-replication-topologies}


</div>

</div>

<div class="outline-4 jvc">

##### Leaderless Replication {#leaderless-replication}

<div class="outline-5 jvc">

###### Writing to the Database When a Node Is Down {#writing-to-the-database-when-a-node-is-down}


</div>

<div class="outline-5 jvc">

###### Limitations of Quorum Consistency {#limitations-of-quorum-consistency}


</div>

<div class="outline-5 jvc">

###### Sloppy Quorums and Hinted Handoff {#sloppy-quorums-and-hinted-handoff}


</div>

<div class="outline-5 jvc">

###### Detecting Concurrent Writes {#detecting-concurrent-writes}


</div>

</div>

<div class="outline-4 jvc">

##### Summary {#summary}


</div>

</div>

<div class="outline-3 jvc">

#### Chapter 6. Partitioning {#chapter-6-dot-partitioning}

<div class="outline-4 jvc">

##### Partitioning and Replication {#partitioning-and-replication}


</div>

<div class="outline-4 jvc">

##### Partitioning of Key-Value Data {#partitioning-of-key-value-data}

<div class="outline-5 jvc">

###### Partitioning by Key Range {#partitioning-by-key-range}


</div>

<div class="outline-5 jvc">

###### Partitioning by Hash of Key {#partitioning-by-hash-of-key}


</div>

<div class="outline-5 jvc">

###### Skewed Workloads and Relieving Hot Spots {#skewed-workloads-and-relieving-hot-spots}


</div>

</div>

<div class="outline-4 jvc">

##### Partitioning and Secondary Indexes {#partitioning-and-secondary-indexes}

<div class="outline-5 jvc">

###### Partitioning Secondary Indexes by Document {#partitioning-secondary-indexes-by-document}


</div>

<div class="outline-5 jvc">

###### Partitioning Secondary Indexes by Term {#partitioning-secondary-indexes-by-term}


</div>

</div>

<div class="outline-4 jvc">

##### Rebalancing Partitions {#rebalancing-partitions}

<div class="outline-5 jvc">

###### Strategies for Rebalancing {#strategies-for-rebalancing}


</div>

<div class="outline-5 jvc">

###### Operations: Automatic or Manual Rebalancing {#operations-automatic-or-manual-rebalancing}


</div>

</div>

<div class="outline-4 jvc">

##### Request Routing {#request-routing}

<div class="outline-5 jvc">

###### Parallel Query Execution {#parallel-query-execution}


</div>

</div>

<div class="outline-4 jvc">

##### Summary {#summary}


</div>

</div>

<div class="outline-3 jvc">

#### Chapter 7. Transactions {#chapter-7-dot-transactions}

<div class="outline-4 jvc">

##### The Slippery Concept of a Transaction {#the-slippery-concept-of-a-transaction}

<div class="outline-5 jvc">

###### The Meaning of ACID {#the-meaning-of-acid}


</div>

<div class="outline-5 jvc">

###### Single-Object and Multi-Object Operations {#single-object-and-multi-object-operations}


</div>

</div>

<div class="outline-4 jvc">

##### Weak Isolation Levels {#weak-isolation-levels}

<div class="outline-5 jvc">

###### Read Committed {#read-committed}


</div>

<div class="outline-5 jvc">

###### Snapshot Isolation and Repeatable Read {#snapshot-isolation-and-repeatable-read}


</div>

<div class="outline-5 jvc">

###### Preventing Lost Updates {#preventing-lost-updates}


</div>

<div class="outline-5 jvc">

###### Write Skew and Phantoms {#write-skew-and-phantoms}


</div>

</div>

<div class="outline-4 jvc">

##### Serializability {#serializability}

<div class="outline-5 jvc">

###### Actual Serial Execution {#actual-serial-execution}


</div>

<div class="outline-5 jvc">

###### Two-Phase Locking (2PL) {#two-phase-locking--2pl}


</div>

<div class="outline-5 jvc">

###### Serializable Snapshot Isolation (SSI) {#serializable-snapshot-isolation--ssi}


</div>

</div>

<div class="outline-4 jvc">

##### Summary {#summary}


</div>

</div>

<div class="outline-3 jvc">

#### Chapter 8. The Trouble with Distributed Systems {#chapter-8-dot-the-trouble-with-distributed-systems}

<div class="outline-4 jvc">

##### Faults and Partial Failures {#faults-and-partial-failures}

<div class="outline-5 jvc">

###### Cloud Computing and Supercomputing {#cloud-computing-and-supercomputing}


</div>

</div>

<div class="outline-4 jvc">

##### Unreliable Networks {#unreliable-networks}

<div class="outline-5 jvc">

###### Network Faults in Practice {#network-faults-in-practice}


</div>

<div class="outline-5 jvc">

###### Detecting Faults {#detecting-faults}


</div>

<div class="outline-5 jvc">

###### Timeouts and Unbounded Delays {#timeouts-and-unbounded-delays}


</div>

<div class="outline-5 jvc">

###### Synchronous Versus Asynchronous Networks {#synchronous-versus-asynchronous-networks}


</div>

</div>

<div class="outline-4 jvc">

##### Unreliable Clocks {#unreliable-clocks}

<div class="outline-5 jvc">

###### Monotonic Versus Time-of-Day Clocks {#monotonic-versus-time-of-day-clocks}


</div>

<div class="outline-5 jvc">

###### Clock Synchronization and Accuracy {#clock-synchronization-and-accuracy}


</div>

<div class="outline-5 jvc">

###### Relying on Synchronized Clocks {#relying-on-synchronized-clocks}


</div>

<div class="outline-5 jvc">

###### Process Pauses {#process-pauses}


</div>

</div>

<div class="outline-4 jvc">

##### Knowledge, Truth, and Lies {#knowledge-truth-and-lies}

<div class="outline-5 jvc">

###### The Truth Is Defined by the Majority {#the-truth-is-defined-by-the-majority}


</div>

<div class="outline-5 jvc">

###### Byzantine Faults {#byzantine-faults}


</div>

<div class="outline-5 jvc">

###### System Model and Reality {#system-model-and-reality}


</div>

</div>

<div class="outline-4 jvc">

##### Summary {#summary}


</div>

</div>

<div class="outline-3 jvc">

#### Chapter 9. Consistency and Consensus {#chapter-9-dot-consistency-and-consensus}

<div class="outline-4 jvc">

##### Consistency Guarantees {#consistency-guarantees}


</div>

<div class="outline-4 jvc">

##### Linearizability {#linearizability}

<div class="outline-5 jvc">

###### What Makes a System Linearizable? {#what-makes-a-system-linearizable}


</div>

<div class="outline-5 jvc">

###### Relying on Linearizability {#relying-on-linearizability}


</div>

<div class="outline-5 jvc">

###### Implementing Linearizable Systems {#implementing-linearizable-systems}


</div>

<div class="outline-5 jvc">

###### The Cost of Linearizability {#the-cost-of-linearizability}


</div>

</div>

<div class="outline-4 jvc">

##### Ordering Guarantees {#ordering-guarantees}

<div class="outline-5 jvc">

###### Ordering and Causality {#ordering-and-causality}


</div>

<div class="outline-5 jvc">

###### Sequence Number Ordering {#sequence-number-ordering}


</div>

<div class="outline-5 jvc">

###### Total Order Broadcast {#total-order-broadcast}


</div>

</div>

<div class="outline-4 jvc">

##### Distributed Transactions and Consensus {#distributed-transactions-and-consensus}

<div class="outline-5 jvc">

###### Atomic Commit and Two-Phase Commit (2PC) {#atomic-commit-and-two-phase-commit--2pc}


</div>

<div class="outline-5 jvc">

###### Distributed Transactions in Practice {#distributed-transactions-in-practice}


</div>

<div class="outline-5 jvc">

###### Fault-Tolerant Consensus {#fault-tolerant-consensus}


</div>

<div class="outline-5 jvc">

###### Membership and Coordination Services {#membership-and-coordination-services}


</div>

</div>

<div class="outline-4 jvc">

##### Summary {#summary}


</div>

</div>

</div>

<div class="outline-2 jvc">

### Part III. Derived Data {#part-iii-dot-derived-data}

<div class="outline-3 jvc">

#### Chapter 10. Batch Processing {#chapter-10-dot-batch-processing}

<div class="outline-4 jvc">

##### Batch Processing with Unix Tools {#batch-processing-with-unix-tools}

<div class="outline-5 jvc">

###### Simple Log Analysis {#simple-log-analysis}


</div>

<div class="outline-5 jvc">

###### The Unix Philosophy {#the-unix-philosophy}


</div>

</div>

<div class="outline-4 jvc">

##### MapReduce and Distributed Filesystems {#mapreduce-and-distributed-filesystems}

<div class="outline-5 jvc">

###### MapReduce Job Execution {#mapreduce-job-execution}


</div>

<div class="outline-5 jvc">

###### Reduce-Side Joins and Grouping {#reduce-side-joins-and-grouping}


</div>

<div class="outline-5 jvc">

###### Map-Side Joins {#map-side-joins}


</div>

<div class="outline-5 jvc">

###### The Output of Batch Workflows {#the-output-of-batch-workflows}


</div>

<div class="outline-5 jvc">

###### Comparing Hadoop to Distributed Databases {#comparing-hadoop-to-distributed-databases}


</div>

</div>

<div class="outline-4 jvc">

##### Beyond MapReduce {#beyond-mapreduce}

<div class="outline-5 jvc">

###### Materialization of Intermediate State {#materialization-of-intermediate-state}


</div>

<div class="outline-5 jvc">

###### Graphs and Iterative Processing {#graphs-and-iterative-processing}


</div>

<div class="outline-5 jvc">

###### High-Level APIs and Languages {#high-level-apis-and-languages}


</div>

</div>

<div class="outline-4 jvc">

##### Summary {#summary}


</div>

</div>

<div class="outline-3 jvc">

#### Chapter 11. Stream Processing {#chapter-11-dot-stream-processing}

<div class="outline-4 jvc">

##### Transmitting Event Streams {#transmitting-event-streams}

<div class="outline-5 jvc">

###### Messaging Systems {#messaging-systems}


</div>

<div class="outline-5 jvc">

###### Partitioned Logs {#partitioned-logs}


</div>

</div>

<div class="outline-4 jvc">

##### Databases and Streams {#databases-and-streams}

<div class="outline-5 jvc">

###### Keeping Systems in Sync {#keeping-systems-in-sync}


</div>

<div class="outline-5 jvc">

###### Change Data Capture {#change-data-capture}


</div>

<div class="outline-5 jvc">

###### Event Sourcing {#event-sourcing}


</div>

<div class="outline-5 jvc">

###### State, Streams, and Immutability {#state-streams-and-immutability}


</div>

</div>

<div class="outline-4 jvc">

##### Processing Streams {#processing-streams}

<div class="outline-5 jvc">

###### Uses of Stream Processing {#uses-of-stream-processing}


</div>

<div class="outline-5 jvc">

###### Reasoning About Time {#reasoning-about-time}


</div>

<div class="outline-5 jvc">

###### Stream Joins {#stream-joins}


</div>

<div class="outline-5 jvc">

###### Fault Tolerance {#fault-tolerance}


</div>

</div>

<div class="outline-4 jvc">

##### Summary {#summary}


</div>

</div>

<div class="outline-3 jvc">

#### Chapter 12. The Future of Data Systems {#chapter-12-dot-the-future-of-data-systems}

<div class="outline-4 jvc">

##### Data Integration {#data-integration}

<div class="outline-5 jvc">

###### Combining Specialized Tools by Deriving Data {#combining-specialized-tools-by-deriving-data}


</div>

<div class="outline-5 jvc">

###### Batch and Stream Processing {#batch-and-stream-processing}


</div>

</div>

<div class="outline-4 jvc">

##### Unbundling Databases {#unbundling-databases}

<div class="outline-5 jvc">

###### Composing Data Storage Technologies {#composing-data-storage-technologies}


</div>

<div class="outline-5 jvc">

###### Designing Applications Around Dataflow {#designing-applications-around-dataflow}


</div>

<div class="outline-5 jvc">

###### Observing Derived State {#observing-derived-state}


</div>

</div>

<div class="outline-4 jvc">

##### Aiming for Correctness {#aiming-for-correctness}

<div class="outline-5 jvc">

###### The End-to-End Argument for Databases {#the-end-to-end-argument-for-databases}


</div>

<div class="outline-5 jvc">

###### Enforcing Constraints {#enforcing-constraints}


</div>

<div class="outline-5 jvc">

###### Timeliness and Integrity {#timeliness-and-integrity}


</div>

<div class="outline-5 jvc">

###### Trust, but Verify {#trust-but-verify}


</div>

</div>

<div class="outline-4 jvc">

##### Doing the Right Thing {#doing-the-right-thing}

<div class="outline-5 jvc">

###### Predictive Analytics {#predictive-analytics}


</div>

<div class="outline-5 jvc">

###### Privacy and Tracking {#privacy-and-tracking}


</div>

</div>

<div class="outline-4 jvc">

##### Summary {#summary}


</div>

</div>

</div>

</div>
