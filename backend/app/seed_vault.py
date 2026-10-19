def get_vault_resources_seed():
    """Generates rich, comprehensive study notes, cheat sheets, and architecture breakdowns for Material Vault."""
    return [
        {
            "title": "DBMS Indexing, B-Trees & Query Optimization",
            "topic": "DBMS",
            "category": "Cheat Sheet",
            "difficulty": "Medium",
            "summary": "Master Clustered vs Non-Clustered Indexes, B-Tree lookups, Composite Index ordering, and EXPLAIN ANALYZE execution plans.",
            "content": """### Database Indexing & B-Trees
- **Clustered Index**: Determines the physical ordering of data rows on disk. Only ONE clustered index per table (typically the Primary Key).
- **Non-Clustered Index**: Separate structure with pointers to the data rows. Multiple allowed per table.
- **B+ Tree Mechanics**:
  - Balanced tree with fanout ~100-500.
  - All values stored in leaf nodes connected as a doubly linked list, providing lightning-fast range queries `BETWEEN`.
- **Composite Index Leftmost Prefix Rule**:
  - Index on `(A, B, C)` can serve queries on `(A)`, `(A, B)`, and `(A, B, C)`, but NOT `(B, C)` alone.
- **Query Optimization Tip**: Always run `EXPLAIN ANALYZE` to check for Seq Scan vs Index Scan and avoid functions on indexed columns (e.g. `WHERE YEAR(created_at) = 2026`).""",
            "read_time": "12 min",
            "tags": "DBMS, SQL, B-Trees, Indexing, Performance"
        },
        {
            "title": "Top 15 System Design Patterns for SDE Roles",
            "topic": "System Design",
            "category": "Notes",
            "difficulty": "Hard",
            "summary": "Comprehensive architecture guide covering Load Balancers, Consistent Hashing, Caching (Redis/Memcached), Database Sharding, and Event Queues.",
            "content": """### Core System Design Patterns
1. **Load Balancing**:
   - Algorithms: Round Robin, Weighted Least Connections, IP Hash.
   - Layer 4 (TCP) vs Layer 7 (HTTP/Application reverse proxy like Nginx, Envoy).
2. **Caching Strategies**:
   - *Cache-Aside (Lazy Loading)*: App queries cache; on miss, queries DB and writes to cache.
   - *Write-Through*: Write to cache and DB simultaneously.
   - *Write-Back (Write-Behind)*: Write to cache; asynchronously flush to DB.
3. **Database Sharding & Consistent Hashing**:
   - Distribute keys across N nodes using a hash ring with virtual nodes to prevent hot spots.
4. **Message Queues (Kafka vs RabbitMQ)**:
   - RabbitMQ: Smart broker, dumb consumer (push-based AMQP).
   - Kafka: Dumb broker, smart consumer (pull-based distributed append-only log with partitioned offset tracking).""",
            "read_time": "25 min",
            "tags": "System Design, Scalability, Architecture, Distributed Systems"
        },
        {
            "title": "Operating Systems - Memory Virtualization & Deadlock Mechanics",
            "topic": "Operating Systems",
            "category": "Notes",
            "difficulty": "Medium",
            "summary": "Virtual Memory, Paging, Page Fault handling, TLB, and Banker's Algorithm for deadlock avoidance.",
            "content": """### Operating Systems Core Notes
- **Virtual Memory**: Decouples process address space from physical RAM via page tables.
- **TLB (Translation Lookaside Buffer)**: Hardware cache for virtual-to-physical address mappings. TLB misses cause page table walks.
- **Page Faults**:
  1. CPU references page not in physical RAM.
  2. MMU triggers page fault interrupt.
  3. OS swaps page from disk to an open frame (using LRU / Clock page replacement).
- **Deadlocks (Coffman Conditions)**:
  1. Mutual Exclusion
  2. Hold and Wait
  3. No Preemption
  4. Circular Wait
- **Banker's Algorithm**: Resource allocation graph check ensuring the system remains in a safe state before granting requests.""",
            "read_time": "15 min",
            "tags": "OS, Kernels, Virtual Memory, Paging, Deadlocks"
        },
        {
            "title": "Computer Networks - TCP/IP, HTTP/3, and DNS Deep Dive",
            "topic": "Computer Networks",
            "category": "Cheat Sheet",
            "difficulty": "Medium",
            "summary": "From URL to page render: DNS resolution, TCP 3-way handshake, TLS 1.3, HTTP/2 multiplexing, and HTTP/3 QUIC over UDP.",
            "content": """### Networking Cheatsheet
- **What happens when you type `google.com` into your browser?**:
  1. Browser checks cache (Browser -> OS -> Router -> ISP DNS recursive resolver -> Root -> TLD -> Authoritative).
  2. TCP 3-Way Handshake: SYN -> SYN-ACK -> ACK.
  3. TLS 1.3 Handshake: 1-RTT negotiation of cryptographic cipher suites.
  4. HTTP GET request sent.
  5. Server returns response; Browser parses DOM, CSSOM, and runs JS engine.
- **HTTP/1.1 vs HTTP/2 vs HTTP/3**:
  - HTTP/1.1: Head-of-line blocking on single TCP connection per request.
  - HTTP/2: Binary framing and stream multiplexing over a single TCP connection.
  - HTTP/3: Operates over QUIC (UDP) eliminating TCP head-of-line packet loss stalls.""",
            "read_time": "18 min",
            "tags": "Networks, TCP, HTTP3, DNS, TLS"
        },
        {
            "title": "Object-Oriented Design & Clean Architecture Patterns",
            "topic": "System Design",
            "category": "Notes",
            "difficulty": "Medium",
            "summary": "SOLID principles in practice, Factory, Strategy, Observer, Decorator, and Singleton patterns with clean code guidelines.",
            "content": """### OOP & Design Patterns
- **SOLID Breakdown**:
  - **S**: Single Responsibility Principle.
  - **O**: Open for extension, closed for modification.
  - **L**: Liskov Substitution - Subtypes must be substitutable for base types.
  - **I**: Interface Segregation - Don't force clients to implement unused methods.
  - **D**: Dependency Inversion - Depend on abstractions, not concrete implementations.
- **Top Interview Patterns**:
  - *Strategy Pattern*: Interchangeable algorithms (e.g. payment processors: Stripe, PayPal, Razorpay).
  - *Observer Pattern*: Pub/Sub event messaging across decoupled components.
  - *Factory Pattern*: Encapsulates object instantiation logic.""",
            "read_time": "14 min",
            "tags": "OOP, SOLID, Design Patterns, Clean Code"
        },
        {
            "title": "STAR Framework for Behavioral & HR Leadership Rounds",
            "topic": "HR",
            "category": "Cheat Sheet",
            "difficulty": "Easy",
            "summary": "How to structure Situation, Task, Action, and Result for Amazon Leadership Principles, Googleyness, and behavioral interviews.",
            "content": """### Master the STAR Method
- **S - Situation (15% of time)**:
  Set the scene with concise context. Mention team size, project scope, and constraints.
- **T - Task (10% of time)**:
  Clarify your specific responsibility in the challenge.
- **A - Action (55% of time)**:
  The meat of your answer! Use 'I' instead of 'we'. Explain the technical reasoning, trade-offs, and initiative you took.
- **R - Result (20% of time)**:
  Quantify business & engineering impact! (e.g. 'Reduced latency by 32%', 'Saved \$14,000/month on AWS bills', 'Delivered 3 days ahead of deadline').""",
            "read_time": "10 min",
            "tags": "HR, Behavioral, STAR, Communication, Interview Prep"
        }
    ]
