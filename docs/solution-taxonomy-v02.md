# SolutionTaxonomy — Assigna

> Built & designed by Deciwa

## Schema Definition

Every category in this taxonomy conforms to the following structure:

```json
{
  "category_id": "string",
  "category_name": "string",
  "category_type": "product_category | service_delivery_model | hybrid",
  "parent_category": "string",
  "description": "string",

  "buyer_problem_patterns": ["string"],
  "diagnostic_triggers": {
    "positive_signals": ["string"],
    "negative_signals": ["string"],
    "minimum_thresholds": {},
    "disqualifiers": ["string"]
  },

  "typical_use_cases": ["string"],
  "not_for": ["string"],
  "required_buyer_inputs": ["string"],
  "typical_integrations": ["string"],
  "buyer_roles": ["string"],
  "success_metrics": ["string"],

  "implementation_complexity": "low | low-medium | medium | medium-high | high",
  "typical_timeline_weeks": { "min": "number", "max": "number" },

  "budget_band": {
    "min": "number",
    "max": "number",
    "currency": "EUR",
    "model": "string"
  },

  "evidence_requirements": [
    {
      "type": "string",
      "description": "string",
      "weight": "0.0-1.0",
      "required": "boolean"
    }
  ],

  "red_flags_for_buyer": ["string"],
  "red_flags_for_vendor": ["string"],
  "vendor_capability_requirements": ["string"],
  "decision_questions": ["string"],

  "adjacent_categories": ["category_id"],
  "differentiation_from_adjacent": {}
}
```

### Category Type Definitions

- **product_category**: A class of off-the-shelf software products that solve a defined problem space. Vendors are comparable on features, pricing, integration.
- **service_delivery_model**: A way of delivering solutions (consulting, custom dev, managed services). Not directly comparable to SaaS products on the same dimensions.
- **hybrid**: Has both product and service characteristics. Some vendors offer platforms, others offer implementation-heavy solutions.

---

## Taxonomy Tree

```
Document Automation
├── [1] AI Document Processing & Extraction
├── [2] Email & Inbox Workflow Automation

Knowledge Management
├── [3] Internal Knowledge Search / Enterprise RAG

Customer Experience
├── [4] Customer Support Automation

Operations Automation
├── [5] Procurement & Supplier Workflow Automation
├── [6] Finance Back-Office Automation
├── [7] Compliance Document Review
├── [8] Workflow Orchestration / Process Automation

Revenue Operations
├── [9] Sales Operations Automation

Custom Solutions
├── [10] Custom AI Agent / AI Automation Consulting
```

---

## Category 1: AI Document Processing & Extraction

```json
{
  "category_id": "ai_document_processing",
  "category_name": "AI Document Processing & Extraction",
  "category_type": "product_category",
  "parent_category": "Document Automation",
  "description": "Automated extraction of structured data from unstructured documents (invoices, contracts, delivery notes, forms) using OCR + NLP/LLM. Converts paper/PDF-based manual data entry into machine-readable output fed into downstream systems.",

  "buyer_problem_patterns": [
    "We manually enter data from invoices/PDFs into our ERP",
    "Our team spends hours reading supplier documents",
    "We have high error rates in data entry",
    "We process hundreds of documents per week manually",
    "Invoice matching takes too long",
    "We receive documents in multiple formats and languages"
  ],

  "diagnostic_triggers": {
    "positive_signals": [
      "High document volume mentioned (>50/week)",
      "Manual data entry explicitly cited as pain",
      "ERP or target system exists to receive data",
      "Error rate or compliance mentioned",
      "Cost of current process quantified"
    ],
    "negative_signals": [
      "Buyer says 'we need AI' without specifying document types",
      "Problem is about workflow routing, not data extraction",
      "Documents are highly creative/unstructured (reports, marketing)"
    ],
    "minimum_thresholds": {
      "documents_per_week": 50,
      "has_target_system": true
    },
    "disqualifiers": [
      "Fewer than 20 documents per week (ROI negative)",
      "No target system to receive extracted data",
      "Documents are handwritten with no OCR-viable quality",
      "Buyer needs real-time streaming (this is batch/near-real-time)"
    ]
  },

  "typical_use_cases": [
    "Invoice data extraction → ERP",
    "Delivery note parsing",
    "Contract clause extraction",
    "Purchase order matching",
    "Customs/shipping document processing",
    "Form digitization",
    "Receipt processing for expense management"
  ],

  "not_for": [
    "Companies with fewer than 50 documents/week (ROI too low)",
    "Companies needing full workflow redesign (this is extraction only)",
    "Highly unstructured creative content (marketing, reports)",
    "Companies without target system to receive extracted data",
    "Real-time streaming document needs (this is batch/near-real-time)",
    "Companies that need human decision-making on content (this automates extraction, not judgement)"
  ],

  "required_buyer_inputs": [
    "Document types and volume per week/month",
    "Current manual process description and time spent",
    "Target system (ERP, database, spreadsheet)",
    "Languages in documents",
    "Accuracy tolerance (what error rate is acceptable?)",
    "Document format variety (PDF, scan, email, photo)",
    "Current cost of manual processing"
  ],

  "typical_integrations": [
    "SAP",
    "Oracle",
    "Microsoft Dynamics",
    "NetSuite",
    "CSV/API export",
    "Email inbox",
    "SharePoint",
    "Google Drive"
  ],

  "buyer_roles": [
    "Head of Operations",
    "Head of Finance",
    "CFO",
    "Procurement Director",
    "IT Manager",
    "Shared Services Manager"
  ],

  "success_metrics": [
    "Processing time reduction (%)",
    "Data entry error reduction (%)",
    "FTE hours saved per month",
    "Cost per document processed",
    "Straight-through processing rate (%)",
    "Exception rate (% needing human review)"
  ],

  "implementation_complexity": "medium",
  "typical_timeline_weeks": { "min": 4, "max": 12 },

  "budget_band": {
    "min": 15000,
    "max": 200000,
    "currency": "EUR",
    "model": "per_document or annual_subscription"
  },

  "evidence_requirements": [
    {
      "type": "accuracy_benchmark",
      "description": "Documented accuracy rate on similar document types in similar industry",
      "weight": 0.3,
      "required": true
    },
    {
      "type": "same_industry_case_study",
      "description": "Case study from same or adjacent industry with measurable volume/time outcomes",
      "weight": 0.25,
      "required": true
    },
    {
      "type": "integration_proof",
      "description": "Demonstrated integration with buyer's ERP/target system",
      "weight": 0.2,
      "required": true
    },
    {
      "type": "language_support",
      "description": "Verification of support for buyer's document languages",
      "weight": 0.1,
      "required": false
    },
    {
      "type": "pilot_availability",
      "description": "Ability to run POC on buyer's actual document samples",
      "weight": 0.15,
      "required": false
    }
  ],

  "red_flags_for_buyer": [
    "Vendor claims 99% accuracy without specifying document type or conditions",
    "No human-in-the-loop option for exceptions",
    "No clear integration path to buyer's existing systems",
    "Pricing unclear or usage-based without caps",
    "No demo on buyer's actual document samples",
    "Vendor conflates extraction with full process automation"
  ],

  "red_flags_for_vendor": [
    "Buyer has no standardized document types",
    "Buyer expects 100% automation with zero exceptions",
    "No IT contact or system access available",
    "Budget below €10K (not viable for quality solution)",
    "Buyer conflates document extraction with full workflow redesign"
  ],

  "vendor_capability_requirements": [
    "OCR engine (own or integrated)",
    "Template-free or adaptive extraction (not just fixed templates)",
    "Multi-language support",
    "Confidence scoring per extracted field",
    "Exception routing / human review UI",
    "API or direct ERP connector",
    "Audit trail for compliance"
  ],

  "decision_questions": [
    "What is your accuracy rate on [specific document type] in [our industry]?",
    "How do you handle documents that don't match expected formats?",
    "What is your pricing at our expected volume of [X] documents/week?",
    "Can you process documents in [languages needed]?",
    "What does integration with [our ERP] look like technically?",
    "What is the typical time from kickoff to production?",
    "Do you offer a pilot/POC on our real documents before commitment?",
    "What happens when extraction confidence is low — human review, reject, or flag?",
    "What is your STP (straight-through processing) rate for similar clients?"
  ],

  "adjacent_categories": [
    "email_workflow_automation",
    "procurement_workflow_automation",
    "workflow_orchestration"
  ],

  "differentiation_from_adjacent": {
    "vs_email_workflow_automation": "Document processing extracts structured data from files; email automation classifies and routes messages. Often co-deployed.",
    "vs_procurement_workflow_automation": "Document processing is a component within procurement automation — it handles the extraction layer, not the full procurement workflow.",
    "vs_workflow_orchestration": "Document processing extracts data; workflow orchestration routes tasks between systems. Complementary, not competing.",
    "vs_custom_ai_consulting": "Off-the-shelf document AI vs custom-built solution. Prefer off-the-shelf if document types are standard and volume justifies it."
  }
}
```

---

## Category 2: Email & Inbox Workflow Automation

```json
{
  "category_id": "email_workflow_automation",
  "category_name": "Email & Inbox Workflow Automation",
  "category_type": "product_category",
  "parent_category": "Document Automation",
  "description": "AI-powered classification, routing, extraction, and response automation for business email inboxes. Handles supplier emails, customer requests, internal requests — converting chaotic shared inboxes into structured, prioritized, auto-triaged workflows.",

  "buyer_problem_patterns": [
    "Our shared inbox receives hundreds of emails daily that need manual triage",
    "We miss important supplier communications in email noise",
    "Responding to routine inquiries takes too much staff time",
    "We can't prioritize urgent emails from routine ones",
    "Email attachments need to be manually saved and filed",
    "Staff spend 2+ hours daily sorting and routing emails"
  ],

  "diagnostic_triggers": {
    "positive_signals": [
      "Shared inbox mentioned with high volume",
      "Manual triage/sorting is the pain point",
      "Missed emails causing operational issues",
      "Response time SLAs not being met",
      "Clear categorization already exists (just not automated)"
    ],
    "negative_signals": [
      "Problem is about document data extraction (not routing)",
      "Buyer needs outbound marketing automation",
      "Low email volume with complex content requiring human judgement",
      "Problem is really CRM (relationship management, not inbox triage)"
    ],
    "minimum_thresholds": {
      "emails_per_day": 50,
      "shared_inbox_count": 1
    },
    "disqualifiers": [
      "Fewer than 30 emails/day per inbox (manual is still viable)",
      "No clear categories or routing logic exists",
      "All emails require unique human expert response",
      "Buyer needs full CRM, not inbox automation"
    ]
  },

  "typical_use_cases": [
    "Supplier email classification and routing to correct department",
    "Order confirmation extraction and filing",
    "Customer inquiry auto-response for FAQs",
    "Attachment extraction and filing to correct folder/system",
    "Escalation detection (urgent issues flagged immediately)",
    "SLA-based prioritization of response queue"
  ],

  "not_for": [
    "Companies with low email volume (<50/day per inbox)",
    "Companies that need full CRM (this is inbox automation, not relationship management)",
    "Highly sensitive/regulated communications requiring human-only handling at all times",
    "Marketing email campaigns (this is inbound processing, not outbound)",
    "Companies without clear routing rules or email categories",
    "1:1 executive communication (this is for operational/shared inboxes)"
  ],

  "required_buyer_inputs": [
    "Email volume per day/week per inbox",
    "Number of shared inboxes to automate",
    "Current routing/triage process and categories",
    "Most common email types and their handling rules",
    "Response templates if any exist",
    "Integration targets (CRM, ERP, ticketing system)",
    "Languages of incoming emails"
  ],

  "typical_integrations": [
    "Microsoft 365",
    "Google Workspace",
    "Salesforce",
    "Zendesk",
    "ServiceNow",
    "SAP",
    "Slack",
    "Microsoft Teams",
    "Jira"
  ],

  "buyer_roles": [
    "Head of Operations",
    "Customer Service Manager",
    "Office Manager",
    "Head of Procurement",
    "IT Manager",
    "Shared Services Lead"
  ],

  "success_metrics": [
    "Average response time reduction",
    "Correct classification rate (%)",
    "Emails handled without human intervention (%)",
    "Missed urgent email rate reduction",
    "Staff hours saved per week on triage",
    "SLA compliance rate improvement"
  ],

  "implementation_complexity": "low-medium",
  "typical_timeline_weeks": { "min": 2, "max": 6 },

  "budget_band": {
    "min": 5000,
    "max": 80000,
    "currency": "EUR",
    "model": "per_mailbox or per_email_volume or annual_subscription"
  },

  "evidence_requirements": [
    {
      "type": "classification_accuracy",
      "description": "Documented classification accuracy on similar email types/volumes",
      "weight": 0.3,
      "required": true
    },
    {
      "type": "email_platform_integration",
      "description": "Proven integration with buyer's email platform (M365/Gmail)",
      "weight": 0.25,
      "required": true
    },
    {
      "type": "volume_case_study",
      "description": "Case study showing volume handled and time savings achieved",
      "weight": 0.2,
      "required": false
    },
    {
      "type": "gdpr_compliance",
      "description": "Data privacy/GDPR compliance documentation and data residency clarity",
      "weight": 0.15,
      "required": true
    },
    {
      "type": "response_quality_samples",
      "description": "Examples of auto-generated responses showing quality/tone",
      "weight": 0.1,
      "required": false
    }
  ],

  "red_flags_for_buyer": [
    "No support for buyer's email platform",
    "Requires full email access without clear data boundaries or privacy controls",
    "No human fallback for misclassified emails",
    "Claims full automation without acknowledging edge cases",
    "No GDPR/data residency compliance documentation",
    "Cannot handle multi-language emails"
  ],

  "red_flags_for_vendor": [
    "Buyer has no categorization of email types (no routing logic to automate)",
    "Buyer expects AI to understand deeply nuanced context without any training data",
    "No IT support for email system integration/API access",
    "Highly varied email content with no recurring patterns",
    "Buyer confuses this with outbound email marketing automation"
  ],

  "vendor_capability_requirements": [
    "Email platform connector (M365 and/or Gmail)",
    "NLP classification engine (multi-label)",
    "Configurable routing rules and categories",
    "Attachment extraction and filing",
    "Response suggestion or auto-response capability",
    "Audit trail and compliance logging",
    "Multi-language classification",
    "Escalation/priority detection"
  ],

  "decision_questions": [
    "Do you support [our email platform: M365/Gmail/other]?",
    "How do you handle multi-language emails?",
    "What happens when classification confidence is low?",
    "Where is email data stored and processed (GDPR)?",
    "Can we define custom categories and routing rules without engineering?",
    "What is classification accuracy after initial training period?",
    "How do you handle attachments (extract, file, or ignore)?",
    "What does the human review interface look like for edge cases?",
    "Can rules be changed by business users or only admins?"
  ],

  "adjacent_categories": [
    "ai_document_processing",
    "customer_support_automation",
    "workflow_orchestration"
  ],

  "differentiation_from_adjacent": {
    "vs_ai_document_processing": "Email automation classifies and routes whole messages; document processing extracts structured fields from attachments/files.",
    "vs_customer_support_automation": "Email automation is broader (any business inbox); customer support automation is specifically for support tickets and customer-facing channels.",
    "vs_workflow_orchestration": "Email automation handles the inbox/triage layer; workflow orchestration handles downstream multi-step task routing across systems."
  }
}
```

---

## Category 3: Internal Knowledge Search / Enterprise RAG

```json
{
  "category_id": "enterprise_knowledge_search",
  "category_name": "Internal Knowledge Search / Enterprise RAG",
  "category_type": "product_category",
  "parent_category": "Knowledge Management",
  "description": "AI-powered search across internal documents, wikis, databases, and knowledge bases using retrieval-augmented generation (RAG). Answers employee questions from company data with source citations, replacing manual search across fragmented systems.",

  "buyer_problem_patterns": [
    "Our employees waste time searching for information across multiple systems",
    "Institutional knowledge is lost when people leave",
    "Our internal wiki/docs are outdated and hard to navigate",
    "New employees take months to find relevant internal information",
    "We answer the same internal questions repeatedly",
    "Information is scattered across SharePoint, Confluence, Drive, and email"
  ],

  "diagnostic_triggers": {
    "positive_signals": [
      "Multiple knowledge sources mentioned (wiki, drive, sharepoint)",
      "Onboarding pain explicitly cited",
      "Employee time wasted on search quantified",
      "Knowledge loss from turnover mentioned",
      "Repeated internal questions identified"
    ],
    "negative_signals": [
      "Problem is customer-facing (not internal)",
      "Company has very little documented knowledge",
      "Problem is about creating knowledge, not finding it",
      "Need is for real-time operational data, not documents"
    ],
    "minimum_thresholds": {
      "document_count": 100,
      "employee_count": 30
    },
    "disqualifiers": [
      "Fewer than 100 internal documents (not enough to justify RAG)",
      "Company has no documentation culture (AI can't search what doesn't exist)",
      "Need is customer-facing chatbot (use Customer Support Automation instead)",
      "Requirement for legally binding answers (RAG has hallucination risk)",
      "Need for real-time data from live systems (RAG is document-based)"
    ]
  },

  "typical_use_cases": [
    "Employee Q&A from internal knowledge base",
    "Policy/procedure lookup",
    "Technical documentation search for engineering teams",
    "Onboarding knowledge assistant for new hires",
    "Cross-system information retrieval (single search across all sources)",
    "Meeting notes and decision history search",
    "Regulatory/compliance information lookup"
  ],

  "not_for": [
    "Companies with very little documented knowledge (<100 documents)",
    "Companies needing customer-facing chatbot (that's Customer Support Automation)",
    "Companies without internal documentation culture or willingness to build one",
    "Highly regulated environments where AI answers must be legally binding",
    "Companies needing real-time operational data (this is document-based, not live-data)",
    "Small teams where asking a colleague is faster than searching"
  ],

  "required_buyer_inputs": [
    "Knowledge sources (Confluence, SharePoint, Google Drive, Notion, etc.)",
    "Approximate volume of documents",
    "Number of employees who would use the system",
    "Current search tools and their specific limitations",
    "Security/access control requirements (who can see what?)",
    "Languages of internal content",
    "Most common questions employees currently ask"
  ],

  "typical_integrations": [
    "SharePoint",
    "Confluence",
    "Google Drive",
    "Notion",
    "Slack",
    "Microsoft Teams",
    "Internal wikis",
    "File servers",
    "Jira",
    "GitHub/GitLab"
  ],

  "buyer_roles": [
    "CTO",
    "Head of IT",
    "Head of HR",
    "Head of Operations",
    "Knowledge Manager",
    "VP Engineering",
    "Chief of Staff"
  ],

  "success_metrics": [
    "Time to find information (before vs after)",
    "Internal support ticket reduction",
    "Employee satisfaction with knowledge access (survey)",
    "Onboarding time reduction",
    "Answer accuracy rate",
    "Adoption rate (% employees using regularly)",
    "Reduction in repeated questions to subject matter experts"
  ],

  "implementation_complexity": "medium-high",
  "typical_timeline_weeks": { "min": 6, "max": 16 },

  "budget_band": {
    "min": 20000,
    "max": 300000,
    "currency": "EUR",
    "model": "per_user or per_document_volume or annual_subscription"
  },

  "evidence_requirements": [
    {
      "type": "accuracy_benchmark",
      "description": "Documented answer accuracy on similar knowledge bases with hallucination rate disclosed",
      "weight": 0.25,
      "required": true
    },
    {
      "type": "connector_proof",
      "description": "Demonstrated integration with buyer's specific document systems",
      "weight": 0.25,
      "required": true
    },
    {
      "type": "access_control_demo",
      "description": "Security/access control demonstration showing permission-aware retrieval",
      "weight": 0.2,
      "required": true
    },
    {
      "type": "source_citation",
      "description": "Proof that answers include verifiable source citations",
      "weight": 0.15,
      "required": true
    },
    {
      "type": "adoption_case_study",
      "description": "Case study showing employee adoption rates and satisfaction improvement",
      "weight": 0.15,
      "required": false
    }
  ],

  "red_flags_for_buyer": [
    "No source citation in answers (answers appear without showing where info came from)",
    "No access control (all users see all documents regardless of permissions)",
    "Vendor doesn't address hallucination risk explicitly",
    "No support for buyer's specific document platforms",
    "Requires all documents in single format or single system",
    "No incremental indexing (can't handle new/updated documents)"
  ],

  "red_flags_for_vendor": [
    "Buyer has no structured documentation worth indexing",
    "Buyer expects AI to create knowledge that doesn't exist in documents",
    "No IT support for connector setup or API access",
    "Security requirements that prevent any cloud processing (and buyer won't self-host)",
    "Buyer conflates this with decision-making AI or process automation"
  ],

  "vendor_capability_requirements": [
    "Document connectors (multi-source, minimum: SharePoint OR Confluence OR Drive)",
    "RAG pipeline (embedding + retrieval + generation)",
    "Source citation in every answer",
    "Access control / permission-aware retrieval",
    "Incremental indexing (new docs auto-indexed without full re-index)",
    "Multi-language support",
    "Hallucination detection or confidence scoring",
    "Admin dashboard for monitoring usage and quality"
  ],

  "decision_questions": [
    "How do you handle access controls from our source systems?",
    "What is your approach to preventing hallucinated answers?",
    "Do all answers include clickable source citations?",
    "How are new or updated documents added to the index?",
    "What document formats and systems do you support?",
    "How do you handle outdated or conflicting information across sources?",
    "What is typical answer accuracy on first deployment?",
    "What does the admin dashboard show about usage and quality?",
    "Can users give feedback on answer quality (thumbs up/down)?"
  ],

  "adjacent_categories": [
    "customer_support_automation",
    "compliance_document_review"
  ],

  "differentiation_from_adjacent": {
    "vs_customer_support_automation": "Enterprise RAG is internal-facing for employees; customer support automation is external-facing for customers.",
    "vs_compliance_document_review": "RAG provides broad knowledge search across all topics; compliance review is narrowly focused on regulatory document analysis.",
    "vs_custom_ai_consulting": "RAG products are increasingly off-the-shelf; custom AI consulting builds bespoke solutions for unique needs."
  }
}
```

---

## Category 4: Customer Support Automation

```json
{
  "category_id": "customer_support_automation",
  "category_name": "Customer Support Automation",
  "category_type": "product_category",
  "parent_category": "Customer Experience",
  "description": "AI-powered automation of customer support interactions across chat, email, phone, and ticketing systems. Includes auto-resolution of common queries, intelligent routing, agent augmentation, and self-service — reducing response times and support costs while maintaining CSAT.",

  "buyer_problem_patterns": [
    "Support tickets are growing faster than our team can handle",
    "Repetitive questions consume senior agent time",
    "Response times are too slow and SLAs are missed",
    "We can't provide 24/7 support with current staff",
    "Ticket routing is manual and inconsistent",
    "Agents spend time looking up answers instead of helping customers"
  ],

  "diagnostic_triggers": {
    "positive_signals": [
      "High ticket/interaction volume mentioned (>500/month)",
      "Repetitive questions identified as major time sink",
      "SLA pressure or customer complaints about speed",
      "24/7 coverage desired but not staffed",
      "Existing knowledge base or FAQ content available to train on"
    ],
    "negative_signals": [
      "Problem is internal employee support (use Enterprise RAG)",
      "Very low volume with complex unique issues",
      "Support is purely relationship-driven (high-touch enterprise)",
      "No existing content/FAQs to train the AI on"
    ],
    "minimum_thresholds": {
      "support_interactions_per_month": 100,
      "repetitive_question_percentage": 30
    },
    "disqualifiers": [
      "Fewer than 100 support interactions per month (ROI too low)",
      "No existing knowledge base, FAQ, or support content to train on",
      "All interactions require deep human expertise with no repetition",
      "Buyer has no helpdesk system and doesn't want one"
    ]
  },

  "typical_use_cases": [
    "Chatbot for common customer questions (FAQ automation)",
    "Ticket classification and routing to correct team",
    "Agent-assist (suggested responses and information lookup)",
    "Self-service knowledge base with AI search",
    "Multi-channel support automation (chat + email + phone)",
    "SLA monitoring and automatic escalation",
    "Post-interaction summarization for agent handoff"
  ],

  "not_for": [
    "Companies with <100 support interactions/month (too low volume for ROI)",
    "Companies needing only internal employee support (use Enterprise RAG)",
    "Highly complex technical support requiring deep human expertise every time",
    "Companies without existing support content/FAQs to train on",
    "Companies that sell purely through human relationships (high-touch enterprise sales support)",
    "Startups without established support processes or ticket history"
  ],

  "required_buyer_inputs": [
    "Monthly support volume (tickets, chats, calls)",
    "Current channels (email, chat, phone, social media)",
    "Top 10-20 most common question categories",
    "Current tools (Zendesk, Intercom, Freshdesk, Salesforce Service Cloud, etc.)",
    "Current resolution rate and average handle time",
    "Languages needed for support",
    "Existing knowledge base content availability"
  ],

  "typical_integrations": [
    "Zendesk",
    "Intercom",
    "Freshdesk",
    "Salesforce Service Cloud",
    "HubSpot Service",
    "LiveChat",
    "Twilio",
    "Front",
    "Help Scout"
  ],

  "buyer_roles": [
    "Head of Support",
    "VP Customer Experience",
    "COO",
    "Head of Operations",
    "Customer Success Director"
  ],

  "success_metrics": [
    "Auto-resolution rate (% resolved without human)",
    "Average response time reduction",
    "CSAT score maintenance or improvement",
    "Ticket deflection rate",
    "Agent productivity (tickets/agent/day)",
    "Cost per resolution",
    "First contact resolution rate improvement"
  ],

  "implementation_complexity": "medium",
  "typical_timeline_weeks": { "min": 4, "max": 10 },

  "budget_band": {
    "min": 10000,
    "max": 150000,
    "currency": "EUR",
    "model": "per_resolution or per_agent_seat or monthly_subscription"
  },

  "evidence_requirements": [
    {
      "type": "auto_resolution_rate",
      "description": "Documented auto-resolution rates achieved in similar industry/volume",
      "weight": 0.3,
      "required": true
    },
    {
      "type": "csat_preservation",
      "description": "Proof that CSAT was maintained or improved after AI deployment",
      "weight": 0.25,
      "required": true
    },
    {
      "type": "helpdesk_integration",
      "description": "Demonstrated integration with buyer's specific helpdesk platform",
      "weight": 0.2,
      "required": true
    },
    {
      "type": "escalation_handling",
      "description": "Clear demonstration of human handoff process with context preservation",
      "weight": 0.15,
      "required": true
    },
    {
      "type": "multi_language",
      "description": "Proof of multi-language capability if buyer needs it",
      "weight": 0.1,
      "required": false
    }
  ],

  "red_flags_for_buyer": [
    "Vendor claims >80% auto-resolution without seeing your actual data",
    "No graceful handoff to human agents (customer gets stuck)",
    "No analytics on what AI couldn't answer (blind spots hidden)",
    "Requires complete replacement of existing helpdesk",
    "No way to review/correct AI responses or improve over time",
    "CSAT data not tracked or not shared transparently"
  ],

  "red_flags_for_vendor": [
    "Buyer has no existing knowledge base or FAQ content to train on",
    "Buyer expects zero human involvement from day one",
    "Highly technical product with no documentation or support history",
    "Buyer's current CSAT is already 95%+ (diminishing returns, high risk of degradation)"
  ],

  "vendor_capability_requirements": [
    "Multi-channel support (chat + email at minimum)",
    "Helpdesk platform integration (native connector)",
    "Knowledge base ingestion and training",
    "Human handoff with full context preservation",
    "Analytics and reporting dashboard",
    "Conversation design / flow builder for non-technical users",
    "Multi-language support",
    "Feedback loop (learn from corrections)"
  ],

  "decision_questions": [
    "What auto-resolution rate do similar companies in our industry achieve?",
    "How does handoff to human agents work — is context preserved?",
    "What data/content do you need from us to get started?",
    "How do you handle questions the AI can't answer?",
    "What is the training/ramp-up period before production?",
    "Can we review and override AI responses?",
    "How do you measure and report on CSAT impact?",
    "What does the improvement cycle look like (learning from failures)?"
  ],

  "adjacent_categories": [
    "email_workflow_automation",
    "enterprise_knowledge_search"
  ],

  "differentiation_from_adjacent": {
    "vs_email_workflow_automation": "Support automation is customer-facing with conversational interaction; email automation is back-office inbox triage without customer conversation.",
    "vs_enterprise_knowledge_search": "Support automation is external-facing for customers; enterprise RAG is internal-facing for employees.",
    "vs_workflow_orchestration": "Support automation handles the customer interaction layer; workflow orchestration handles internal task routing after the interaction."
  }
}
```

---

## Category 5: Procurement & Supplier Workflow Automation

```json
{
  "category_id": "procurement_workflow_automation",
  "category_name": "Procurement & Supplier Workflow Automation",
  "category_type": "hybrid",
  "parent_category": "Operations Automation",
  "description": "AI-powered automation of procurement workflows including supplier management, purchase order processing, spend analysis, supplier risk scoring, vendor evaluation, and approval routing. Ranges from focused tools (spend analytics) to comprehensive platforms (full source-to-pay).",

  "buyer_problem_patterns": [
    "Our procurement process is mostly manual spreadsheets and emails",
    "We have poor visibility into supplier performance and risk",
    "Maverick spending is a problem — people buy outside approved channels",
    "Supplier onboarding takes too long",
    "We can't effectively compare suppliers or track total costs",
    "Approval processes are slow and paper-based"
  ],

  "diagnostic_triggers": {
    "positive_signals": [
      "Multiple suppliers mentioned (>10 active)",
      "Spend visibility or cost control cited as pain",
      "Supplier risk or compliance mentioned",
      "Manual approval workflows described",
      "Procurement team or budget authority exists"
    ],
    "negative_signals": [
      "Problem is only about invoice data extraction (use AI Document Processing)",
      "Company has <10 suppliers (too simple for automation)",
      "Problem is strategic sourcing consulting (not tool)",
      "Buyer wants full ERP replacement (this augments ERP)"
    ],
    "minimum_thresholds": {
      "active_suppliers": 10,
      "annual_procurement_spend_eur": 500000
    },
    "disqualifiers": [
      "Fewer than 10 active suppliers (process too simple)",
      "No procurement budget authority (no one to champion it)",
      "Company needs full ERP replacement (this augments, not replaces)",
      "Buyer looking for strategic sourcing consulting only (this is tool, not advisory)",
      "Annual procurement spend below €200K (ROI unlikely)"
    ]
  },

  "typical_use_cases": [
    "Automated PO creation and three-way matching",
    "Supplier risk scoring and continuous monitoring",
    "Spend analytics and cost optimization recommendations",
    "Supplier onboarding workflow automation",
    "Contract compliance monitoring and alerting",
    "Approval workflow automation (routing, escalation)",
    "Vendor performance scorecards"
  ],

  "not_for": [
    "Companies with <10 active suppliers (too simple to justify)",
    "Companies that need full ERP replacement (this augments ERP, not replaces it)",
    "Companies looking for strategic sourcing consulting only (this is tool, not advisory)",
    "Companies without procurement budget authority or executive sponsor",
    "Direct-to-consumer companies without B2B procurement needs",
    "Companies whose procurement is purely commodity/spot-buy with no repeat suppliers"
  ],

  "required_buyer_inputs": [
    "Number of active suppliers",
    "Annual procurement spend",
    "Current procurement tools/process description",
    "Main pain points (cost, risk, speed, compliance, visibility)",
    "ERP/finance system in use",
    "Regulatory or audit requirements",
    "Current approval process and bottlenecks"
  ],

  "typical_integrations": [
    "SAP Ariba",
    "SAP S/4HANA",
    "Oracle Procurement",
    "Microsoft Dynamics",
    "NetSuite",
    "Coupa",
    "Excel/CSV",
    "Email"
  ],

  "buyer_roles": [
    "CPO",
    "Head of Procurement",
    "CFO",
    "COO",
    "Supply Chain Director",
    "Procurement Manager"
  ],

  "success_metrics": [
    "Procurement cycle time reduction",
    "Cost savings identified and realized (%)",
    "Supplier risk incidents prevented",
    "Maverick spend reduction (%)",
    "Supplier onboarding time reduction",
    "Process compliance rate (%)",
    "PO accuracy / exception rate"
  ],

  "implementation_complexity": "medium-high",
  "typical_timeline_weeks": { "min": 8, "max": 20 },

  "budget_band": {
    "min": 30000,
    "max": 500000,
    "currency": "EUR",
    "model": "annual_subscription or per_supplier or per_transaction"
  },

  "evidence_requirements": [
    {
      "type": "roi_case_study",
      "description": "ROI case study in similar industry/company size with quantified savings",
      "weight": 0.3,
      "required": true
    },
    {
      "type": "erp_integration_proof",
      "description": "Demonstrated integration with buyer's ERP system",
      "weight": 0.25,
      "required": true
    },
    {
      "type": "compliance_audit_trail",
      "description": "Compliance/audit trail capabilities demonstrated",
      "weight": 0.2,
      "required": true
    },
    {
      "type": "risk_model_explanation",
      "description": "Transparent explanation of how supplier risk scoring works",
      "weight": 0.15,
      "required": false
    },
    {
      "type": "implementation_reference",
      "description": "Reference from similar-sized implementation with timeline data",
      "weight": 0.1,
      "required": false
    }
  ],

  "red_flags_for_buyer": [
    "Vendor cannot explain how risk scoring algorithm works",
    "No integration with buyer's ERP (requires manual data transfer)",
    "Requires complete process re-engineering before deployment can start",
    "No audit trail or compliance reporting capabilities",
    "Hidden costs for implementation, data migration, or customization",
    "Vendor only sells full platform when buyer needs one module"
  ],

  "red_flags_for_vendor": [
    "Buyer has no standardized procurement process at all (chaos)",
    "Buyer expects tool to replace strategic procurement thinking/decisions",
    "No executive sponsor or change management commitment",
    "Legacy systems with no API access or export capability",
    "Buyer wants to start with all modules simultaneously (implementation risk)"
  ],

  "vendor_capability_requirements": [
    "ERP integration (at least buyer's primary system)",
    "Supplier database management",
    "Workflow engine (approvals, routing, escalation)",
    "Analytics/reporting dashboard with spend visibility",
    "Risk scoring model (preferably explainable)",
    "Document management (contracts, POs, invoices)",
    "Audit trail and compliance logging",
    "Modular deployment (start small, expand)"
  ],

  "decision_questions": [
    "How do you integrate with [our ERP system]?",
    "How is supplier risk calculated and how transparent is it?",
    "What does implementation look like for a company our size?",
    "Can we start with one module (e.g., spend analytics) and expand later?",
    "How do you handle our compliance/audit requirements?",
    "What change management support do you provide?",
    "What is typical ROI timeline for companies our size?",
    "How do you handle our specific industry's procurement regulations?",
    "What does the approval workflow configuration look like?"
  ],

  "adjacent_categories": [
    "ai_document_processing",
    "finance_backoffice_automation",
    "workflow_orchestration"
  ],

  "differentiation_from_adjacent": {
    "vs_ai_document_processing": "Procurement automation is the full workflow; document processing is just the data extraction component within it.",
    "vs_finance_backoffice_automation": "Procurement is buying-side (vendor management, POs, sourcing); finance back-office is broader (AP/AR, reconciliation, close, expenses).",
    "vs_workflow_orchestration": "Procurement automation is domain-specific with procurement logic built in; workflow orchestration is generic task routing without procurement semantics."
  }
}
```

---

## Category 6: Finance Back-Office Automation

```json
{
  "category_id": "finance_backoffice_automation",
  "category_name": "Finance Back-Office Automation",
  "category_type": "product_category",
  "parent_category": "Operations Automation",
  "description": "AI-powered automation of finance operations including accounts payable/receivable, bank reconciliation, expense management, financial close, and reporting. Reduces manual bookkeeping and accelerates month-end close while maintaining audit-grade accuracy.",

  "buyer_problem_patterns": [
    "Month-end close takes too long (5+ days)",
    "AP/AR processing is mostly manual and error-prone",
    "Bank reconciliation takes hours every week",
    "Expense reports are manually reviewed and frequently incorrect",
    "We can't get real-time visibility into financial position",
    "Finance team is overloaded with repetitive transactional work"
  ],

  "diagnostic_triggers": {
    "positive_signals": [
      "Month-end close duration quantified as pain (>3 days)",
      "Manual AP/AR processing mentioned with volume",
      "Reconciliation backlog or errors cited",
      "Finance team headcount vs transaction volume mismatch",
      "Audit readiness or compliance pressure mentioned"
    ],
    "negative_signals": [
      "Problem is about procurement/vendor management (not finance ops)",
      "Buyer needs full ERP replacement",
      "Problem is strategic financial planning/FP&A (not transactional)",
      "Issue is revenue recognition or complex accounting judgement"
    ],
    "minimum_thresholds": {
      "monthly_transactions": 500,
      "finance_team_size": 2,
      "has_accounting_system": true
    },
    "disqualifiers": [
      "Fewer than 200 monthly transactions (manual still viable)",
      "No accounting system in place (need ERP first, not automation)",
      "Buyer needs full ERP/accounting system replacement",
      "Problem is purely strategic FP&A (not back-office automation)",
      "Company is pre-revenue startup without financial ops complexity"
    ]
  },

  "typical_use_cases": [
    "Accounts payable automation (invoice receipt → approval → payment)",
    "Accounts receivable automation (invoicing → collection → matching)",
    "Bank reconciliation automation",
    "Expense report processing and policy enforcement",
    "Financial close acceleration",
    "Intercompany reconciliation",
    "Payment fraud detection",
    "Accrual and journal entry automation"
  ],

  "not_for": [
    "Companies without an existing accounting/ERP system (build foundation first)",
    "Companies needing full ERP replacement (this augments, not replaces)",
    "Strategic FP&A or financial planning needs (this is transactional automation)",
    "Companies with <200 monthly transactions (ROI unlikely)",
    "Startups pre-revenue without finance ops complexity",
    "Companies needing only invoice data extraction (use AI Document Processing for that component)"
  ],

  "required_buyer_inputs": [
    "Monthly transaction volume (AP invoices, payments, journal entries)",
    "Current accounting/ERP system",
    "Current close timeline (days to close)",
    "Finance team size and allocation of time",
    "Main pain points (speed, accuracy, visibility, compliance)",
    "Audit/compliance requirements (SOX, IFRS, local GAAP)",
    "Bank and payment systems used",
    "Multi-entity/multi-currency needs"
  ],

  "typical_integrations": [
    "SAP",
    "Oracle Financials",
    "NetSuite",
    "Xero",
    "QuickBooks",
    "Microsoft Dynamics",
    "Banking APIs",
    "Expense systems (Expensify, SAP Concur)"
  ],

  "buyer_roles": [
    "CFO",
    "Finance Director",
    "Controller",
    "Head of Accounting",
    "VP Finance",
    "Shared Services Director"
  ],

  "success_metrics": [
    "Days to close reduction",
    "AP/AR processing time reduction (%)",
    "Reconciliation time reduction",
    "Transaction error rate reduction (%)",
    "Finance FTE time freed for analysis (%)",
    "Audit preparation time reduction",
    "Cost per transaction processed"
  ],

  "implementation_complexity": "medium-high",
  "typical_timeline_weeks": { "min": 8, "max": 20 },

  "budget_band": {
    "min": 20000,
    "max": 300000,
    "currency": "EUR",
    "model": "annual_subscription or per_transaction or modular_pricing"
  },

  "evidence_requirements": [
    {
      "type": "close_reduction_case_study",
      "description": "Case study showing days-to-close reduction in similar company size",
      "weight": 0.25,
      "required": true
    },
    {
      "type": "erp_integration_proof",
      "description": "Demonstrated integration with buyer's accounting/ERP system",
      "weight": 0.25,
      "required": true
    },
    {
      "type": "compliance_certification",
      "description": "SOC2, ISO 27001, or relevant financial compliance certifications",
      "weight": 0.2,
      "required": true
    },
    {
      "type": "accuracy_metrics",
      "description": "Transaction processing accuracy rates with audit trail proof",
      "weight": 0.2,
      "required": true
    },
    {
      "type": "multi_entity_proof",
      "description": "Proof of multi-entity/multi-currency handling if buyer needs it",
      "weight": 0.1,
      "required": false
    }
  ],

  "red_flags_for_buyer": [
    "Vendor cannot demonstrate integration with buyer's ERP",
    "No audit trail or compliance logging built in",
    "Requires complete process redesign before any automation",
    "No handling of exceptions or edge cases (only happy path)",
    "Vendor lacks financial compliance certifications (SOC2, etc.)",
    "Cannot handle multi-entity or multi-currency if buyer needs it"
  ],

  "red_flags_for_vendor": [
    "Buyer has no standardized chart of accounts",
    "No executive sponsor in finance (automation champion needed)",
    "Buyer's ERP is heavily customized with no standard APIs",
    "Buyer expects 100% automation including judgement-heavy entries",
    "Buyer's compliance requirements are unclear or contradictory"
  ],

  "vendor_capability_requirements": [
    "ERP/accounting system connector",
    "Invoice processing (capture, match, approve, post)",
    "Bank reconciliation engine",
    "Approval workflow with role-based routing",
    "Exception handling and human review queue",
    "Audit trail (every transaction traceable)",
    "Reporting and analytics dashboard",
    "Multi-entity and multi-currency support",
    "Compliance framework alignment (SOX, IFRS, local GAAP)"
  ],

  "decision_questions": [
    "How do you integrate with [our ERP/accounting system]?",
    "What is your typical days-to-close improvement for companies our size?",
    "How do you handle exceptions and edge cases requiring human judgement?",
    "What compliance certifications do you hold?",
    "Can we start with one module (e.g., AP) and expand to others?",
    "How is the audit trail maintained and accessed?",
    "Do you support multi-entity and multi-currency?",
    "What does month-end close automation look like specifically?",
    "How do you handle our bank format/connectivity?"
  ],

  "adjacent_categories": [
    "ai_document_processing",
    "procurement_workflow_automation",
    "compliance_document_review"
  ],

  "differentiation_from_adjacent": {
    "vs_ai_document_processing": "Finance automation covers the full AP/AR/close workflow; document processing only extracts data from financial documents like invoices.",
    "vs_procurement_workflow_automation": "Finance back-office covers post-purchase financial operations (AP, reconciliation, close); procurement covers pre-purchase (sourcing, PO, supplier management).",
    "vs_compliance_document_review": "Finance automation handles transactional compliance (audit trail, controls); compliance review handles regulatory document analysis and policy checking."
  }
}
```

---

## Category 7: Compliance Document Review

```json
{
  "category_id": "compliance_document_review",
  "category_name": "Compliance Document Review & Regulatory Analysis",
  "category_type": "hybrid",
  "parent_category": "Operations Automation",
  "description": "AI-powered analysis of regulatory documents, contracts, policies, and compliance materials. Identifies risks, gaps, clause conflicts, regulatory requirements, and policy violations. Must be explainable and audit-grade — human-in-the-loop is mandatory, not optional.",

  "buyer_problem_patterns": [
    "We spend weeks reviewing contracts for compliance issues",
    "Regulatory changes require manual review of all affected policies",
    "We miss compliance gaps until audit time",
    "Legal/compliance team is bottleneck for document approvals",
    "We can't keep up with regulatory changes across jurisdictions",
    "Contract risk assessment is inconsistent across reviewers"
  ],

  "diagnostic_triggers": {
    "positive_signals": [
      "Regulatory obligations explicitly mentioned",
      "Contract volume requiring review is high (>50/month)",
      "Compliance team backlog or bottleneck cited",
      "Multi-jurisdiction complexity mentioned",
      "Audit findings or compliance failures referenced",
      "Regulatory change management is a pain point"
    ],
    "negative_signals": [
      "Problem is about general document search (use Enterprise RAG)",
      "Buyer needs generic OCR/extraction (use AI Document Processing)",
      "Company has no regulatory obligations",
      "Problem is about creating policies, not reviewing them"
    ],
    "minimum_thresholds": {
      "documents_requiring_review_per_month": 20,
      "has_regulatory_obligations": true,
      "has_compliance_team_or_function": true
    },
    "disqualifiers": [
      "Company has no regulatory obligations (no compliance need)",
      "Problem is generic document processing without compliance context",
      "Buyer expects AI to make final compliance decisions without human review",
      "No legal/compliance function exists in the company",
      "Document volume is too low to justify automation (<10/month)"
    ]
  },

  "typical_use_cases": [
    "Contract clause risk identification",
    "Regulatory change impact analysis",
    "Policy-to-regulation mapping and gap detection",
    "Due diligence document review acceleration",
    "Compliance checklist automation",
    "Third-party risk document screening",
    "Internal policy conflict detection",
    "Audit preparation and evidence gathering"
  ],

  "not_for": [
    "Companies without regulatory obligations (no compliance context needed)",
    "Generic document processing needs (use AI Document Processing)",
    "Companies expecting AI to replace legal judgement (human-in-loop is mandatory)",
    "Companies looking for general knowledge search (use Enterprise RAG)",
    "Very low document volume (<10 reviews/month)",
    "Companies that need contract authoring/generation (this is review, not creation)"
  ],

  "required_buyer_inputs": [
    "Types of documents reviewed (contracts, policies, regulatory filings)",
    "Volume of documents per month/quarter",
    "Regulatory frameworks applicable (GDPR, SOX, MiFID, HIPAA, ISO, etc.)",
    "Current review process and time per document",
    "Who reviews (legal, compliance, external counsel)",
    "Specific risks or clauses of concern",
    "Multi-jurisdiction requirements",
    "Output needed (risk report, gap analysis, checklist, annotations)"
  ],

  "typical_integrations": [
    "Contract management systems (Ironclad, DocuSign CLM)",
    "SharePoint",
    "Document management (iManage, NetDocuments)",
    "GRC platforms (ServiceNow GRC, Archer)",
    "Legal tech stacks"
  ],

  "buyer_roles": [
    "General Counsel",
    "Head of Compliance",
    "Chief Risk Officer",
    "Legal Operations Manager",
    "VP Legal",
    "Data Protection Officer"
  ],

  "success_metrics": [
    "Review time per document reduction (%)",
    "Compliance gaps identified before audit (%)",
    "False positive rate (flagged but not actual issue)",
    "Reviewer consistency improvement",
    "Time to respond to regulatory changes",
    "Audit preparation time reduction",
    "Risk identification rate vs manual review"
  ],

  "implementation_complexity": "high",
  "typical_timeline_weeks": { "min": 10, "max": 24 },

  "budget_band": {
    "min": 30000,
    "max": 250000,
    "currency": "EUR",
    "model": "annual_subscription or per_document or per_review_project"
  },

  "evidence_requirements": [
    {
      "type": "accuracy_on_regulatory_framework",
      "description": "Demonstrated accuracy on buyer's specific regulatory framework (GDPR, SOX, etc.)",
      "weight": 0.3,
      "required": true
    },
    {
      "type": "explainability_proof",
      "description": "Every AI finding must be traceable to source clause/regulation with reasoning shown",
      "weight": 0.25,
      "required": true
    },
    {
      "type": "false_positive_rate",
      "description": "Documented false positive/negative rates from similar deployments",
      "weight": 0.2,
      "required": true
    },
    {
      "type": "legal_industry_reference",
      "description": "Reference customer in regulated industry with compliance team endorsement",
      "weight": 0.15,
      "required": false
    },
    {
      "type": "security_certification",
      "description": "SOC2, ISO 27001, or relevant security/privacy certifications for handling sensitive legal documents",
      "weight": 0.1,
      "required": true
    }
  ],

  "red_flags_for_buyer": [
    "Vendor claims AI can replace legal/compliance review entirely",
    "No explainability — findings without source citations or reasoning",
    "Vendor cannot handle buyer's specific regulatory framework",
    "No human-in-the-loop workflow built into the product",
    "Data security inadequate for sensitive legal documents",
    "Vendor trained on generic data without legal/compliance specialization",
    "No false positive/negative rate transparency"
  ],

  "red_flags_for_vendor": [
    "Buyer expects AI to make final compliance decisions without human review",
    "Buyer's documents are in unusual formats or languages not supported",
    "No clear regulatory framework to review against (vague compliance goals)",
    "Buyer has no compliance function to own and validate outputs",
    "Buyer's risk tolerance is zero (any AI error unacceptable)"
  ],

  "vendor_capability_requirements": [
    "Regulatory framework knowledge base (updateable)",
    "Document parsing for legal/compliance documents",
    "Clause-level annotation and risk flagging",
    "Explainable AI (reasoning shown for every finding)",
    "Human review workflow with approval/reject/override",
    "Audit trail for all review decisions",
    "Multi-jurisdiction regulatory coverage",
    "Integration with GRC/CLM platforms",
    "Regular model updates for regulatory changes"
  ],

  "decision_questions": [
    "Which regulatory frameworks do you cover?",
    "How do you explain AI findings — can reviewers see the reasoning?",
    "What is your false positive rate on similar document types?",
    "How do you handle regulatory updates and changes?",
    "What does the human review workflow look like?",
    "Where is our data stored and processed?",
    "Can you handle [our specific document types and jurisdictions]?",
    "How does your system learn from reviewer corrections?",
    "What security certifications do you hold?"
  ],

  "adjacent_categories": [
    "ai_document_processing",
    "enterprise_knowledge_search",
    "finance_backoffice_automation"
  ],

  "differentiation_from_adjacent": {
    "vs_ai_document_processing": "Compliance review applies legal/regulatory intelligence to documents; document processing only extracts data without compliance context.",
    "vs_enterprise_knowledge_search": "Compliance review analyzes documents against regulatory requirements; RAG searches for answers across general knowledge bases.",
    "vs_finance_backoffice_automation": "Compliance review handles regulatory document analysis; finance automation handles transactional financial operations."
  }
}
```

---

## Category 8: Workflow Orchestration / Process Automation

```json
{
  "category_id": "workflow_orchestration",
  "category_name": "Workflow Orchestration & Process Automation",
  "category_type": "product_category",
  "parent_category": "Operations Automation",
  "description": "Generic cross-system task routing, approval workflows, and process automation combining RPA, API integration, and AI. Not domain-specific — connects existing systems and automates multi-step processes that span multiple tools and teams.",

  "buyer_problem_patterns": [
    "We have manual handoffs between systems that cause delays",
    "Approval processes are slow with no visibility into status",
    "Our teams use different tools that don't talk to each other",
    "Repetitive multi-step processes are done manually",
    "We lose track of tasks between departments",
    "Data is entered into multiple systems manually"
  ],

  "diagnostic_triggers": {
    "positive_signals": [
      "Multi-system/multi-tool environment described",
      "Manual handoffs or copy-paste between systems",
      "Approval bottlenecks with multiple stakeholders",
      "Process spans multiple departments",
      "Buyer mentions specific systems that need connecting",
      "Repetitive multi-step process explicitly described"
    ],
    "negative_signals": [
      "Problem is domain-specific (procurement, finance, support — use those categories)",
      "Single-system problem (just needs configuration, not orchestration)",
      "Buyer needs data extraction from documents (use AI Document Processing)",
      "Problem is about replacing a system, not connecting systems"
    ],
    "minimum_thresholds": {
      "systems_to_connect": 2,
      "process_steps": 3,
      "process_frequency_per_week": 10
    },
    "disqualifiers": [
      "Problem is entirely within one system (configure that system instead)",
      "Process runs fewer than 10 times per week (manual is still efficient)",
      "Buyer needs domain-specific intelligence (use domain category instead)",
      "No API access to any of the systems involved",
      "Process is undefined (no one knows the steps — need process consulting first)"
    ]
  },

  "typical_use_cases": [
    "Cross-system approval workflows (request → review → approve → action)",
    "Employee onboarding across HR, IT, facilities systems",
    "Order-to-fulfillment process automation",
    "Data synchronization between systems",
    "Notification and escalation automation",
    "Report generation from multiple data sources",
    "RPA + AI hybrid for semi-structured tasks",
    "Exception handling and routing"
  ],

  "not_for": [
    "Companies needing domain-specific intelligence (use domain category: procurement, finance, support, etc.)",
    "Single-system problems (just configure/customize that system)",
    "Process runs fewer than 10 times per week (ROI too low)",
    "Buyer has no API access to their existing systems",
    "Process is undefined — need process mapping/consulting before automation",
    "Companies looking to replace existing systems (this connects them, not replaces)"
  ],

  "required_buyer_inputs": [
    "Systems currently used (list all involved tools)",
    "Process to automate (step-by-step description)",
    "Volume (how often does this process run?)",
    "Current pain points (delays, errors, visibility)",
    "Who is involved at each step (roles/departments)",
    "API availability for existing systems",
    "Exception handling requirements",
    "Compliance/audit trail needs"
  ],

  "typical_integrations": [
    "Any system with API/webhook",
    "Salesforce",
    "SAP",
    "Microsoft 365",
    "Google Workspace",
    "Slack",
    "Jira",
    "ServiceNow",
    "HubSpot",
    "Custom databases"
  ],

  "buyer_roles": [
    "COO",
    "Head of Operations",
    "Head of IT",
    "Process Owner",
    "VP Digital Transformation",
    "CTO"
  ],

  "success_metrics": [
    "Process cycle time reduction (%)",
    "Manual steps eliminated (count)",
    "Error rate reduction from manual handoffs",
    "Visibility improvement (can track process status?)",
    "Time saved per process run",
    "Exception handling time reduction",
    "Employee satisfaction with process"
  ],

  "implementation_complexity": "medium",
  "typical_timeline_weeks": { "min": 3, "max": 12 },

  "budget_band": {
    "min": 15000,
    "max": 200000,
    "currency": "EUR",
    "model": "per_workflow or per_user or annual_subscription"
  },

  "evidence_requirements": [
    {
      "type": "integration_breadth",
      "description": "Proof of integration with buyer's specific systems (not just 'we support 1000+ apps')",
      "weight": 0.3,
      "required": true
    },
    {
      "type": "similar_process_case_study",
      "description": "Case study of similar multi-step process automated with measured time savings",
      "weight": 0.25,
      "required": true
    },
    {
      "type": "ease_of_change",
      "description": "Demonstration that business users can modify workflows without engineering",
      "weight": 0.2,
      "required": false
    },
    {
      "type": "error_handling_demo",
      "description": "Clear demonstration of exception handling, retry logic, and failure notifications",
      "weight": 0.15,
      "required": true
    },
    {
      "type": "scalability_proof",
      "description": "Evidence of handling buyer's expected volume without degradation",
      "weight": 0.1,
      "required": false
    }
  ],

  "red_flags_for_buyer": [
    "Vendor claims '1000+ integrations' but can't demonstrate buyer's specific systems",
    "No error handling or failure notification built in",
    "Requires dedicated developer to build and maintain every workflow",
    "No visibility into running process status",
    "Vendor locks buyer into proprietary format (no export/migration path)",
    "Cannot handle conditional logic or branching (only linear processes)"
  ],

  "red_flags_for_vendor": [
    "Buyer has no documented process (steps unclear, people disagree)",
    "Buyer's systems have no API access and won't allow integration",
    "Buyer expects 100% automation of a process with heavy human judgement",
    "No process owner who can validate automation logic",
    "Buyer's process changes weekly (too unstable to automate)"
  ],

  "vendor_capability_requirements": [
    "Visual workflow builder (low-code/no-code preferred)",
    "API connectors for common and custom systems",
    "Conditional logic, branching, and loops",
    "Error handling (retry, escalation, notification)",
    "Approval steps with role-based routing",
    "Process monitoring dashboard (status, bottlenecks, failures)",
    "Audit trail",
    "Version control for workflow definitions",
    "AI-enhanced steps (classification, extraction, decision support)"
  ],

  "decision_questions": [
    "Can you demonstrate integration with [our specific systems]?",
    "Can business users modify workflows or is developer required?",
    "How do you handle failures and exceptions mid-process?",
    "What visibility do we have into running process instances?",
    "Is there an audit trail for compliance?",
    "How do you handle conditional logic and branching?",
    "What happens if we need to change a live workflow?",
    "What is your pricing model at our expected volume?",
    "Can we start with one process and expand?"
  ],

  "adjacent_categories": [
    "procurement_workflow_automation",
    "finance_backoffice_automation",
    "email_workflow_automation",
    "sales_operations_automation"
  ],

  "differentiation_from_adjacent": {
    "vs_procurement_workflow_automation": "Workflow orchestration is generic multi-system routing; procurement automation has procurement-specific logic (PO matching, supplier risk, spend analysis).",
    "vs_finance_backoffice_automation": "Workflow orchestration connects any systems; finance automation understands accounting rules, reconciliation, and close processes.",
    "vs_email_workflow_automation": "Workflow orchestration handles downstream multi-step processes; email automation handles the inbox triage layer.",
    "vs_sales_operations_automation": "Workflow orchestration is generic; sales ops understands pipeline, leads, and revenue logic."
  }
}
```

---

## Category 9: Sales Operations Automation

```json
{
  "category_id": "sales_operations_automation",
  "category_name": "Sales Operations Automation",
  "category_type": "product_category",
  "parent_category": "Revenue Operations",
  "description": "AI-powered automation of sales workflows including CRM automation, lead scoring, pipeline management, proposal generation, meeting scheduling, and sales analytics. Revenue-focused with short feedback loops — optimizes for conversion, not just efficiency.",

  "buyer_problem_patterns": [
    "Sales reps spend more time on admin than selling",
    "CRM data is incomplete or outdated because reps don't update it",
    "We can't prioritize leads effectively — everything looks the same",
    "Proposal/quote creation is manual and slow",
    "Pipeline visibility is poor — forecasting is guesswork",
    "Follow-up timing is inconsistent and opportunities slip"
  ],

  "diagnostic_triggers": {
    "positive_signals": [
      "CRM already in use but underutilized",
      "Sales team size >5 reps",
      "Lead volume mentioned with poor conversion",
      "Admin time quantified as pain (>30% of rep time)",
      "Revenue goals missed due to process issues"
    ],
    "negative_signals": [
      "No CRM and no interest in getting one",
      "Sales process is purely relationship/referral (no pipeline)",
      "Problem is about customer support (not sales)",
      "Buyer needs marketing automation (not sales ops)"
    ],
    "minimum_thresholds": {
      "sales_team_size": 3,
      "monthly_leads_or_opportunities": 50,
      "has_crm": true
    },
    "disqualifiers": [
      "No CRM in place and no willingness to adopt one",
      "Sales team of 1-2 (manual works fine at this scale)",
      "No repeatable sales process exists (need sales consulting first)",
      "Buyer conflates this with marketing automation or demand gen",
      "Product is pre-market (no established sales motion yet)"
    ]
  },

  "typical_use_cases": [
    "Automatic CRM data entry and enrichment",
    "AI lead scoring and prioritization",
    "Pipeline management and forecast automation",
    "Proposal/quote generation automation",
    "Meeting scheduling and follow-up automation",
    "Deal risk scoring and next-best-action suggestions",
    "Sales activity logging and coaching insights",
    "Territory and account assignment optimization"
  ],

  "not_for": [
    "Companies without a CRM (need foundation before automation)",
    "Sales teams of 1-2 (overhead not justified)",
    "Companies without repeatable sales process (need sales consulting first)",
    "Marketing automation needs (demand gen, campaigns, nurturing)",
    "Customer support automation (post-sale, not sales process)",
    "Pre-product startups without established sales motion"
  ],

  "required_buyer_inputs": [
    "Current CRM system",
    "Sales team size and structure",
    "Monthly lead/opportunity volume",
    "Current sales process (stages, handoffs)",
    "Biggest time sinks for reps",
    "Win rate and conversion metrics",
    "Existing tools in sales stack (outreach, scheduling, etc.)",
    "Average deal size and cycle length"
  ],

  "typical_integrations": [
    "Salesforce",
    "HubSpot",
    "Pipedrive",
    "Microsoft Dynamics CRM",
    "Outreach",
    "Salesloft",
    "Calendly",
    "Gong",
    "LinkedIn Sales Navigator",
    "Slack"
  ],

  "buyer_roles": [
    "VP Sales",
    "Head of Revenue Operations",
    "CRO",
    "Sales Director",
    "RevOps Manager"
  ],

  "success_metrics": [
    "Rep selling time increase (%)",
    "CRM data completeness improvement (%)",
    "Lead-to-opportunity conversion rate change",
    "Average deal cycle time reduction",
    "Forecast accuracy improvement",
    "Proposal generation time reduction",
    "Pipeline coverage improvement",
    "Revenue per rep improvement"
  ],

  "implementation_complexity": "low-medium",
  "typical_timeline_weeks": { "min": 2, "max": 8 },

  "budget_band": {
    "min": 10000,
    "max": 150000,
    "currency": "EUR",
    "model": "per_user_per_month or annual_subscription"
  },

  "evidence_requirements": [
    {
      "type": "conversion_improvement",
      "description": "Case study showing measurable conversion rate or win rate improvement",
      "weight": 0.3,
      "required": true
    },
    {
      "type": "crm_integration",
      "description": "Native integration with buyer's CRM (not just generic API)",
      "weight": 0.25,
      "required": true
    },
    {
      "type": "time_savings_proof",
      "description": "Documented rep time savings (hours/week freed from admin)",
      "weight": 0.2,
      "required": true
    },
    {
      "type": "data_quality_impact",
      "description": "Proof of CRM data completeness improvement after deployment",
      "weight": 0.15,
      "required": false
    },
    {
      "type": "similar_team_size_reference",
      "description": "Reference from team of similar size and deal complexity",
      "weight": 0.1,
      "required": false
    }
  ],

  "red_flags_for_buyer": [
    "Vendor doesn't integrate natively with buyer's CRM",
    "Heavy setup required with no immediate value (6+ month ROI)",
    "Requires reps to change entire workflow (adoption risk)",
    "Lead scoring model is opaque with no explanation",
    "Vendor focused on volume outbound (spray and pray) not quality",
    "No analytics showing actual revenue impact"
  ],

  "red_flags_for_vendor": [
    "Buyer has no CRM or refuses to adopt one",
    "No repeatable sales process (different every deal)",
    "Sales team resistant to any technology change",
    "Buyer expects tool to fix a people/process problem",
    "Very low lead volume (not enough data for AI scoring)"
  ],

  "vendor_capability_requirements": [
    "CRM native integration (read + write)",
    "AI lead/deal scoring with explainable reasoning",
    "Activity capture and automatic logging",
    "Pipeline analytics and forecasting",
    "Workflow automation (follow-ups, tasks, notifications)",
    "Proposal/quote generation or templates",
    "Reporting dashboard",
    "Low friction for rep adoption (minimal behavior change)"
  ],

  "decision_questions": [
    "How do you integrate with [our CRM]?",
    "How does your lead scoring work and can reps see why?",
    "What is the typical adoption rate among sales reps?",
    "How much admin time does this realistically save per rep per week?",
    "What data do you need from us to start showing value?",
    "How long before we see measurable impact on conversion?",
    "Can reps override or adjust AI suggestions?",
    "What does onboarding look like for a team of [our size]?",
    "What analytics show actual revenue impact, not just activity metrics?"
  ],

  "adjacent_categories": [
    "workflow_orchestration",
    "customer_support_automation",
    "email_workflow_automation"
  ],

  "differentiation_from_adjacent": {
    "vs_workflow_orchestration": "Sales ops understands pipeline, leads, deals, and revenue context; workflow orchestration is generic task routing without sales semantics.",
    "vs_customer_support_automation": "Sales ops is pre-sale (pipeline, conversion); customer support is post-sale (tickets, retention).",
    "vs_email_workflow_automation": "Sales ops automates the full sales workflow; email automation handles inbox triage as one component."
  }
}
```

---

## Category 10: Custom AI Agent / AI Automation Consulting

```json
{
  "category_id": "custom_ai_consulting",
  "category_name": "Custom AI Agent / AI Automation Consulting",
  "category_type": "service_delivery_model",
  "parent_category": "Custom Solutions",
  "description": "Bespoke AI solutions built by agencies, consultants, or system integrators. For problems that no off-the-shelf product solves — multi-agent systems, custom integrations, AI strategy, unique workflows. Delivery model is project/retainer, not SaaS subscription. Requires buyer to have internal product owner and clear process understanding.",

  "buyer_problem_patterns": [
    "We have a unique process that no standard product covers",
    "We tried off-the-shelf solutions and they don't fit our workflow",
    "We need AI integrated deeply into our proprietary systems",
    "We need a multi-step AI workflow that combines several capabilities",
    "We want to build competitive advantage through proprietary AI",
    "Our industry/domain is too specialized for generic tools"
  ],

  "diagnostic_triggers": {
    "positive_signals": [
      "Buyer has tried and rejected off-the-shelf solutions with specific reasons",
      "Process is genuinely unique or proprietary",
      "Internal technical counterpart available",
      "Budget allows for custom development (>€50K)",
      "Clear process documentation exists",
      "Competitive advantage from AI is strategic goal"
    ],
    "negative_signals": [
      "Buyer hasn't explored off-the-shelf options yet",
      "Problem is standard (document processing, support, etc.)",
      "No internal technical counterpart or product owner",
      "Budget expects SaaS pricing for custom work",
      "Process is undefined (need consulting before building)"
    ],
    "minimum_thresholds": {
      "budget_eur": 50000,
      "has_technical_counterpart": true,
      "has_process_documentation": true
    },
    "disqualifiers": [
      "Standard problem that off-the-shelf products solve (check other categories first)",
      "Budget below €40K (not viable for quality custom work)",
      "No internal product owner or technical counterpart to collaborate with",
      "Process is undefined — buyer says 'we want AI' without knowing for what",
      "Buyer expects SaaS-like pricing/timeline for custom development",
      "No willingness to invest in ongoing maintenance after initial build"
    ]
  },

  "typical_use_cases": [
    "Multi-agent AI systems for complex workflows",
    "Proprietary AI integrated into buyer's core product",
    "Industry-specific AI that no generic vendor covers",
    "AI strategy consulting + implementation",
    "Custom RAG/LLM deployment on proprietary data",
    "Legacy system AI augmentation (no API, needs custom integration)",
    "AI proof-of-concept / prototyping for strategic initiatives",
    "Complex data pipeline + AI inference architecture"
  ],

  "not_for": [
    "Companies with standard problems solved by existing products (always check categories 1-9 first)",
    "Companies without technical counterpart or internal product ownership",
    "Companies expecting SaaS pricing for custom development",
    "Companies with unclear processes (need process consulting first, not AI building)",
    "Companies unwilling to invest in ongoing maintenance/iteration",
    "Companies wanting 'AI' without a specific use case or business outcome",
    "Low-budget projects (<€40K) — quality custom AI requires investment"
  ],

  "required_buyer_inputs": [
    "Specific problem description and why off-the-shelf doesn't work",
    "Current process documentation",
    "Technical environment (systems, languages, infrastructure)",
    "Internal team available for collaboration (who is product owner?)",
    "Budget range and timeline expectations",
    "Success criteria (what does 'done' look like?)",
    "Data availability and sensitivity",
    "Ongoing maintenance expectations and budget",
    "Previous AI/automation attempts and why they failed"
  ],

  "typical_integrations": [
    "Buyer's proprietary systems",
    "Custom APIs",
    "Cloud platforms (AWS, GCP, Azure)",
    "On-premise infrastructure",
    "Legacy systems",
    "Internal databases"
  ],

  "buyer_roles": [
    "CTO",
    "VP Engineering",
    "Head of Product",
    "Chief Digital Officer",
    "Innovation Lead",
    "CEO (in smaller companies)"
  ],

  "success_metrics": [
    "Specific business KPI improvement tied to use case",
    "Project delivered on time and within scope",
    "System reliability and uptime post-deployment",
    "Internal team ability to maintain/extend without vendor",
    "User adoption of the custom system",
    "ROI realized within expected timeline",
    "Knowledge transfer completeness"
  ],

  "implementation_complexity": "high",
  "typical_timeline_weeks": { "min": 8, "max": 40 },

  "budget_band": {
    "min": 50000,
    "max": 500000,
    "currency": "EUR",
    "model": "project_based or retainer or time_and_materials"
  },

  "evidence_requirements": [
    {
      "type": "relevant_portfolio",
      "description": "Portfolio of similar custom projects with outcomes documented",
      "weight": 0.3,
      "required": true
    },
    {
      "type": "technical_depth_proof",
      "description": "Demonstrated deep expertise in buyer's required technology stack",
      "weight": 0.25,
      "required": true
    },
    {
      "type": "client_reference",
      "description": "Referenceable client from similar project scope/complexity",
      "weight": 0.2,
      "required": true
    },
    {
      "type": "delivery_methodology",
      "description": "Clear project delivery methodology with milestones, checkpoints, and risk management",
      "weight": 0.15,
      "required": true
    },
    {
      "type": "knowledge_transfer_plan",
      "description": "Explicit plan for handoff to buyer's internal team post-project",
      "weight": 0.1,
      "required": false
    }
  ],

  "red_flags_for_buyer": [
    "Vendor has no portfolio of similar work",
    "No clear methodology or milestone structure proposed",
    "Vendor avoids fixed scope and only offers time-and-materials",
    "No knowledge transfer plan — creates permanent vendor dependency",
    "Team presented in proposal is different from team that actually delivers",
    "Vendor promises unrealistic timelines for complex work",
    "No maintenance/support plan for post-deployment",
    "Vendor cannot explain technical approach in buyer's terms"
  ],

  "red_flags_for_vendor": [
    "Buyer has no internal product owner or technical counterpart",
    "Buyer cannot articulate what 'success' looks like",
    "Buyer expects SaaS pricing and timeline for custom work",
    "Process is undefined — 'just build us something with AI'",
    "Buyer has unrealistic expectations about AI capabilities",
    "No data available for the proposed AI use case",
    "Buyer unwilling to commit time for collaboration/feedback",
    "Scope keeps expanding without budget discussion"
  ],

  "vendor_capability_requirements": [
    "Deep technical expertise in relevant AI/ML domain",
    "Experience with buyer's infrastructure/systems",
    "Project delivery methodology (agile/structured hybrid)",
    "Clear communication and expectation management",
    "Knowledge transfer and documentation capability",
    "Post-delivery support and maintenance option",
    "Security-aware development practices",
    "Ability to start with POC before full commitment"
  ],

  "decision_questions": [
    "Can you show me 2-3 similar projects you've delivered?",
    "Who exactly will be on the team delivering our project?",
    "What is your project methodology — how do we track progress?",
    "What happens if the project needs to change scope mid-way?",
    "What does knowledge transfer look like — can we maintain this ourselves?",
    "What is your approach to AI safety and testing?",
    "Can we start with a paid POC before committing to full project?",
    "What does post-delivery support look like?",
    "How do you handle data privacy and security during development?",
    "What happens if the AI doesn't perform as expected?"
  ],

  "adjacent_categories": [
    "enterprise_knowledge_search",
    "workflow_orchestration",
    "all_product_categories"
  ],

  "differentiation_from_adjacent": {
    "vs_all_product_categories": "Custom consulting is for problems NO off-the-shelf product solves. Always check categories 1-9 first. Custom is last resort, not first choice.",
    "vs_workflow_orchestration": "Workflow orchestration uses existing platforms; custom consulting builds from scratch when platforms can't handle the requirement.",
    "vs_enterprise_knowledge_search": "RAG products are increasingly off-the-shelf; custom consulting builds bespoke solutions only when unique requirements (data, security, integration) prevent using a product."
  }
}
```

---

## Cross-Category Diagnosis Rules

When the system diagnoses buyer need, these meta-rules apply:

1. **Always check product categories (1-9) before recommending custom (10)**. Custom AI consulting is the fallback, not the default.

2. **If buyer problem spans multiple categories**, assign primary + secondary. Example: "invoice processing with approval workflow" = primary: AI Document Processing + secondary: Workflow Orchestration.

3. **If diagnostic_triggers show disqualifiers for all product categories**, either:
   - Recommend custom consulting (category 10)
   - Or flag that buyer needs to fix prerequisites first (e.g., "get a CRM before automating sales")

4. **category_type matters for comparison**:
   - `product_category` vendors can be compared on features/price/integration
   - `service_delivery_model` vendors are compared on portfolio/methodology/team
   - `hybrid` vendors need both comparisons

5. **Evidence weights are per-category, not universal**. A case study matters more for procurement (high complexity) than for email automation (low complexity).

6. **Budget thresholds in diagnostic_triggers are soft gates**, not hard rules. A company below threshold CAN still proceed, but system should flag ROI risk.
