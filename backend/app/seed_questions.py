import json

def get_questions_seed():
    """Generates 30+ high-frequency company & topic-wise interview questions."""
    return [
        # Google
        {
            "company": "Google",
            "role": "SDE",
            "round": "Technical",
            "topic": "DSA",
            "difficulty": "Medium",
            "question_text": "How do you detect a cycle in a Directed Graph vs an Undirected Graph?",
            "expected_concepts_json": json.dumps(["Kahn's Algorithm (BFS)", "DFS Recursion Stack", "Disjoint Set (Union Find)"]),
            "sample_answer": "For Undirected Graphs, use Union-Find or DFS keeping track of parent node. For Directed Graphs, use DFS with a recursion stack array (or 3-color graph coloring) or Kahn's Topological Sort algorithm."
        },
        {
            "company": "Google",
            "role": "SDE",
            "round": "Technical",
            "topic": "System Design",
            "difficulty": "Hard",
            "question_text": "How would you design Google Docs real-time collaborative text editing with low latency?",
            "expected_concepts_json": json.dumps(["Operational Transformation (OT)", "CRDTs", "WebSockets", "Conflict Resolution", "Version Vector"]),
            "sample_answer": "Use either Conflict-free Replicated Data Types (CRDTs) like Yjs/Automerge or Operational Transformation (OT) over bidirectional WebSockets. A central sequencer orders concurrent edits."
        },
        {
            "company": "Google",
            "role": "SDE",
            "round": "Technical",
            "topic": "Operating Systems",
            "difficulty": "Medium",
            "question_text": "What is the difference between Mutex, Semaphore, and Spinlock? When does each cause CPU starvation?",
            "expected_concepts_json": json.dumps(["Mutual Exclusion", "Counting Semaphore", "Busy Waiting", "Context Switching Overhead"]),
            "sample_answer": "A Mutex is a locking mechanism for a single thread. A Semaphore allows N threads access. A Spinlock repeatedly polls without context-switching, useful for very short critical sections in kernel mode."
        },
        {
            "company": "Google",
            "role": "SDE",
            "round": "Behavioral",
            "topic": "Googleyness",
            "difficulty": "Medium",
            "question_text": "Describe a situation where you had a strong disagreement with a peer or team lead on architecture. How did you resolve it?",
            "expected_concepts_json": json.dumps(["Data-driven trade-offs", "Active listening", "Disagree and commit", "Objective benchmarks"]),
            "sample_answer": "Focus on data and user latency metrics rather than opinions. Created a POC benchmark comparing both database approaches, reviewed memory and throughput tradeoffs together, and aligned with team goals."
        },

        # Amazon
        {
            "company": "Amazon",
            "role": "SDE",
            "round": "Behavioral",
            "topic": "Leadership Principles",
            "difficulty": "Medium",
            "question_text": "Tell me about a time you had to make an urgent engineering decision with incomplete data (Bias for Action).",
            "expected_concepts_json": json.dumps(["Type 1 vs Type 2 Decisions", "Risk mitigation", "Two-way doors", "Reversibility"]),
            "sample_answer": "Distinguished between one-way and two-way door decisions. With 70% data, rolled out a feature flag gated behind an automated rollback trigger to avoid delaying launch while guarding uptime."
        },
        {
            "company": "Amazon",
            "role": "SDE",
            "round": "Behavioral",
            "topic": "Leadership Principles",
            "difficulty": "Medium",
            "question_text": "Give an example of when you demonstrated Customer Obsession by sacrificing short-term engineering convenience.",
            "expected_concepts_json": json.dumps(["Customer pain point", "Root cause analysis", "End-to-end user experience"]),
            "sample_answer": "A backend batch job caused 500ms checkout stalls during peak flash sales. Instead of a temporary restart cron, refactored the pipeline to asynchronous SQS consumers to keep customer checkouts sub-50ms."
        },
        {
            "company": "Amazon",
            "role": "SDE",
            "round": "Technical",
            "topic": "System Design",
            "difficulty": "Hard",
            "question_text": "How would you design a distributed unique ID generator like Snowflake at Amazon scale (100k IDs/sec)?",
            "expected_concepts_json": json.dumps(["Epoch Timestamp (41 bits)", "Node ID / Worker ID (10 bits)", "Sequence Number (12 bits)", "Clock drift mitigation"]),
            "sample_answer": "Use a 64-bit ID split into 41-bit millisecond timestamp, 10-bit machine/datacenter ID, and 12-bit per-machine sequence number. Handles clock drift using NTP synchronization or error backoff."
        },
        {
            "company": "Amazon",
            "role": "SDE",
            "round": "Technical",
            "topic": "DSA",
            "difficulty": "Medium",
            "question_text": "Explain how Dijkstra's Algorithm works and compare its time complexity with Bellman-Ford for negative edge weights.",
            "expected_concepts_json": json.dumps(["Min-Heap Priority Queue", "Greedy approach", "O((V + E) log V)", "Negative cycle detection"]),
            "sample_answer": "Dijkstra uses a Min-Heap greedy approach with O((V+E) log V) complexity, failing on negative weights. Bellman-Ford relaxes all edges V-1 times in O(V*E) and detects negative cycles."
        },

        # Microsoft
        {
            "company": "Microsoft",
            "role": "SDE",
            "round": "Technical",
            "topic": "DBMS",
            "difficulty": "Hard",
            "question_text": "Explain ACID properties and how Isolation levels (Read Uncommitted to Serializable) prevent anomalies like Phantom Reads.",
            "expected_concepts_json": json.dumps(["Atomicity", "Consistency", "Isolation", "Durability", "MVCC", "Two-Phase Locking"]),
            "sample_answer": "Isolation levels mitigate Dirty Reads (Read Committed), Non-Repeatable Reads (Repeatable Read), and Phantom Reads (Serializable). Modern databases use MVCC (Multi-Version Concurrency Control) or Range Locks."
        },
        {
            "company": "Microsoft",
            "role": "SDE",
            "round": "Technical",
            "topic": "System Design",
            "difficulty": "Medium",
            "question_text": "What is the difference between SQL vs NoSQL, and when would you choose Cassandra over PostgreSQL for cloud storage?",
            "expected_concepts_json": json.dumps(["ACID vs BASE", "Consistent Hashing", "Horizontal Scalability", "LSM Trees write throughput"]),
            "sample_answer": "Choose Cassandra for massive write-heavy timeseries/logging workloads with peer-to-peer masterless replication across multi-region datacenters. Choose Postgres for relational complex joins and transactional guarantees."
        },
        {
            "company": "Microsoft",
            "role": "SDE",
            "round": "Technical",
            "topic": "Computer Networks",
            "difficulty": "Medium",
            "question_text": "Walk through the TCP 3-Way Handshake and explain what happens when a SYN Flood attack occurs.",
            "expected_concepts_json": json.dumps(["SYN, SYN-ACK, ACK", "Sequence numbers", "SYN Queue exhaustion", "SYN Cookies defense"]),
            "sample_answer": "Client sends SYN, Server replies with SYN-ACK, Client sends ACK. In SYN Flood, attacker sends SYNs without ACK, exhausting half-open connection queues. Defended using SYN Cookies and rate limiting."
        },

        # Meta
        {
            "company": "Meta",
            "role": "SDE",
            "round": "Technical",
            "topic": "System Design",
            "difficulty": "Hard",
            "question_text": "Design Instagram's News Feed system. How do you handle celebrity accounts with millions of followers (Fan-out on Read vs Write)?",
            "expected_concepts_json": json.dumps(["Push model (Fan-out on write)", "Pull model (Fan-out on read)", "Hybrid model", "Redis caching"]),
            "sample_answer": "For normal users, use fan-out on write into follower feed caches. For celebrity accounts (e.g. 50M followers), use fan-out on read (hybrid approach) merged at feed fetch time to avoid cache stampede."
        },
        {
            "company": "Meta",
            "role": "SDE",
            "round": "Technical",
            "topic": "DSA",
            "difficulty": "Medium",
            "question_text": "Explain the LRU (Least Recently Used) cache data structure. Why is a Doubly Linked List paired with a Hash Map required for O(1) ops?",
            "expected_concepts_json": json.dumps(["Hash Map for O(1) key lookup", "Doubly Linked List for O(1) node deletion and head insertion", "Sentinel head/tail nodes"]),
            "sample_answer": "Hash map provides O(1) reference lookups. Doubly linked list allows node removal from anywhere in O(1) when given a pointer, unlike singly linked list which requires O(n) traversal to find previous node."
        },

        # Adobe
        {
            "company": "Adobe",
            "role": "SDE",
            "round": "Technical",
            "topic": "Object Oriented Design",
            "difficulty": "Medium",
            "question_text": "Explain SOLID principles with real-world examples and design a notification system using the Observer and Factory patterns.",
            "expected_concepts_json": json.dumps(["Single Responsibility", "Open/Closed", "Liskov Substitution", "Interface Segregation", "Dependency Inversion"]),
            "sample_answer": "Single Responsibility ensures one reason to change. Open/Closed allows adding SMS/Email/Push notification channels without modifying base notification dispatchers using Factory + Observer subscribers."
        },
        {
            "company": "Adobe",
            "role": "SDE",
            "round": "Technical",
            "topic": "DSA",
            "difficulty": "Hard",
            "question_text": "How does Trie data structure optimize auto-complete search engines, and what is its space-time complexity?",
            "expected_concepts_json": json.dumps(["Prefix tree", "O(L) search time where L is prefix length", "Memory overhead mitigation", "Radix tree"]),
            "sample_answer": "Trie provides O(L) search where L is word length, independent of dictionary size N. Can be compressed using Radix Tree / Patricia Trie to eliminate single-child nodes."
        },

        # TCS / Service Majors
        {
            "company": "TCS",
            "role": "SDE",
            "round": "Technical",
            "topic": "DBMS",
            "difficulty": "Easy",
            "question_text": "What is Database Normalization? Explain 1NF, 2NF, 3NF, and BCNF with simple examples.",
            "expected_concepts_json": json.dumps(["Atomicity (1NF)", "No partial dependency (2NF)", "No transitive dependency (3NF)", "Super key determinant (BCNF)"]),
            "sample_answer": "1NF eliminates repeating groups. 2NF removes partial functional dependencies on candidate keys. 3NF removes transitive dependencies (non-key attributes depending on non-key attributes)."
        },
        {
            "company": "TCS",
            "role": "SDE",
            "round": "Technical",
            "topic": "Core Java / OOP",
            "difficulty": "Easy",
            "question_text": "What is the difference between Abstract Class and Interface in Java? When do you use each?",
            "expected_concepts_json": json.dumps(["Multiple inheritance in interfaces", "State / Instance variables in abstract classes", "Default methods in Java 8+"]),
            "sample_answer": "An interface defines a contract ('can-do'). An abstract class represents a base identity ('is-a') that can hold non-static mutable state and constructor logic."
        },
        {
            "company": "TCS",
            "role": "HR",
            "round": "Behavioral",
            "topic": "HR",
            "difficulty": "Easy",
            "question_text": "Where do you see yourself in 3 to 5 years, and why are you interested in joining our digital transformation team?",
            "expected_concepts_json": json.dumps(["Career progression", "Technical mastery", "Contribution to client delivery", "Continuous learning"]),
            "sample_answer": "In 3-5 years, I aim to grow into a Senior Full-Stack Engineer guiding junior developers, mastering distributed architecture and delivering high-impact business products."
        }
    ]
