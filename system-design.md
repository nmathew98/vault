## Microservices

- General principles are rules of thumb not law

- Dumb tools, smart applications

- SOLID

	- S: Single Responsibility, A class should change for one reason only
	- O: Open/Closed Principle, Open for extension and closed for changes
	- L: Liskov Substitution, Subclasses should exhibit the same behaviour as the superclass, they should be interchangeable
	- I: Interface Segregation, Classes should not have empty methods because of an interface
	- D: Dependency Inversion, Superiors should not depend on dependents

- Principles of Component Cohesion:

	- REP: Reuse/Release Equivalency Principle, The granule of reuse is the granule of release
	- CRP: Common Reuse Principle, Classes that tend to be reused together belong in the same component
	- CCP: Common Closure Principle, Components in a class should be affected by the same kind of changes

- Principles of Component Coupling:

	- ADP: Acyclic Dependencies Principle, No cycles in dependency graph
	- SDP: Stable-Dependency Principle, Depend in the direction of stability
	- SAP: Stable-Abstractions Principle, More abstract = more stable

- How to determine the scope and responsibility of a service

	- A service performs a set of operations on an entity. Multiple services can see different versions of said entity (bounded context)
	- Group the different operations which are performed on the entity together by their effects (This will also usually mean that these operations have similar scalability requirements)

- Prefer vertical slicing over horizontal slicing when it comes to system architecture. Horizontal layers do not change at the same rate and any breaking changes can easily spill over into other boundaries.

	- Layers (horizontal slices) in code bases come at a cost, things are so spread out its hard to see a clear picture (clean architecture)
	- Vertical slices might be better it depends. If the system or service is so big that you're not going to see a clear picture then horizontal slices might be more appropriate
	- If the system or service is so big that there is no clear picture is it a microservice?

- How to determine the boundaries

	- Boundaries are difficult to determine in design, a perfectly planned design will most likely not be an ideal design after implementation. The best way to determine boundaries is after implementation
	- Better to build in a modular manner and let reality dictate the exact architectural boundaries. Once that is done, stronger encapsulation between boundaries can be implemented
	- Boundaries change as functional and non-functional requirements change

- Testing

	- Most of the time enough: Inject mock data and test things happen as they should on each service individually
	- Prefer tests with broad scope over fine-grained scope
	- Edge case: Orchestrate the entire system and test, this becomes unsustainable quite quickly

- Security

	- Protect the data at a network level, protect services at an application level unless absolutely necessary, most of the time this will suffice
	- Reason is because network hops are expensive and introduce points of failure

- Failures

	- Ideally coupling between microservices should be kept to a minimum
	- Application: Use something like BFF to orchestrate flows required for use cases, if any microservice fails propagate that failure to the user. In the absence of BFF, you would want to return which microservice failed (if one microservice depends on another microservice) or if the orchestration is done on the frontend then that information is already accessible
	- Network: Automatic retry, manual retry. Whenever there is retry + mutation, we need to be idempotent
	- Fire: :'(

- Technologies/Frameworks

	- Message brokers: Kafka (event streams), RabbitMQ (queues, rpc)
	- System interface: REST, GraphQL, gRPC. Guiding principle: Keep to existing standards and protocols (HTTP), everybody knows it and it keeps things simple
		- REST: Traditional request response, easy to cache server side. If overfetching is not a major issue this is fine and preferred
		- GraphQL: Caching done client side usually because of single POST entrypoint. If mobile devices are concerned, prefer GraphQL
		- RPC: High performance, be wary that the RPC is hiding a network call and errors can include network errors (things are broken and don't know why). Good for intercommunication between microservices and then use something like BFF for client access so that it does not complicate client code
	- Databases
		- NoSQL: Unstructured data. Good for document dumps like receipts
		- Relational: Structured data. Data integrity and validity is important, constraints are important
		- Time-series: Tracking
		- Graph: Data which forms a network and the relationships in the network are important
	- Monitoring/Observability
		- ElasticStack (Elasticsearch, Kibana, Beats, Logstash): Log aggregation
			- Elasticsearch: Indexing & Storage (optimized for text search)
			- Logstash: Data aggregating & pipelining
			- Kibana: Analysis & visualization
			- Beats: Data collection
		- Grafana: Analytics
		- Sentry: Error monitoring
		- Jaegar: Optimized for distributed tracing across multiple microservices so you can see where a flow broke down across multiple microservices
		- Prometheus: Event monitoring and alerting
	- Containerization
		- Docker/Podman: Build a fence around the host
		- VM: Build a wall around the host
		- Kubernetes: Orchestrates containers, provides: automatic deployment, scaling, load balancing, monitoring (if service dies then restart), incremental updates to nodes
		- Docker Swarm: Cluster of same containers not multiple containers, provides: scaling, load balancing, incremental updates to nodes
	- Technologies
		- AWS: Services for fine grained use cases are sticky, stick to the broad use case services, good for flexibility
		- GCP: Good for build systems and getting started quickly
			- GCP Cloud Functions <=> AWS Lambda
			- GCP Cloud Run <=> AWS Fargate
			- GCP App Engine <=> AWS ECS
	- Juggling workflows
		- Design for one and make that juggle instead of designing to juggle using something like GNU Parallel (at the level of system tools) or message brokers (Kafka, RabbitMQ) for services
	- Event driven/RPC/Request-Response
		- Blocking or non blocking interservice communication models depends 
		- Non blocking style is good for fault tolerance and where performance is not that much of a concern
		- Blocking style is good for high performance but highly available environments (serverless, cloud, etc)

## Internet

- Request/response is the name of the game

- Status codes

	- Informational responses: 100 - 199
	- Successful responses: 200 - 299
	- Redirection responses: 300 - 399
	- Client error responses: 400 - 499
	- Server error responses: 500 - 599

- Compress responses for production (gzip is common)

- When implementing SSL, prefer SSL/TLS offloading, this is when SSL/TLS is handled by a reverse proxy

- Reverse proxy: Sits behind a firewall and directs traffic to the API

- CORS: Tells the server which origins are able to load its resources, no way around it

- Authentication

	- JWT: Two tokes authorization and refresh. Authorization is short lived (accessible by client), refresh is long lived (only accessible by backend). Stateless
	- Sessions: Everyone gets a session cookie, cookie can be invalidated by API which will block access. Stateful

- OSI Model

	- 1: Physical - Transmit raw bit stream over physical medium (Fiber, Wireless, Routers, Network Adapters)
	- 2: Data link - Define the format of data on network (Ethernet)
	- 3: Network - Decide which path data will take (Packets, IP)
	- 4: Transport - Trasmit data using protocols (TCP, UDP)
	- 5: Session - Maintains connections and is responsible for controlling ports and sessions (API, Sockets)
	- 6: Presentation - Ensure data is in a usable format and is where encryption occurs (SSL, SSH)
	- 7: Application - Human-computer interaction layer (HTTP, DNS, FTP)

	![TCP vs UDP](https://www.netburner.com/wp-content/uploads/2020/06/TCP-vs-UDP.png)
