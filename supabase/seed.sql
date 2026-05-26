-- ProvenSkills Seed Data
-- Run this after the initial schema migration

-- ============================================
-- SEED PROFILES (Test Creators)
-- Note: These use fixed UUIDs for development
-- In production, profiles are created via auth trigger
-- ============================================

-- First, we need to insert into auth.users (this works in local dev, not in production)
-- For production, these profiles will be created when users sign up

-- Insert test profiles directly (for development)
INSERT INTO public.profiles (id, username, full_name, avatar_url, bio, website_url, github_url, is_creator, is_verified, total_sales, total_earnings)
VALUES
  ('11111111-1111-1111-1111-111111111111', 'seomaster', 'SEO Master', 'https://api.dicebear.com/7.x/avataaars/svg?seed=seomaster', 'Building the best SEO tools for developers and marketers.', 'https://seomaster.dev', 'https://github.com/seomaster', true, true, 500, 7470.00),
  ('22222222-2222-2222-2222-222222222222', 'docgen', 'Doc Generator', 'https://api.dicebear.com/7.x/avataaars/svg?seed=docgen', 'Making documentation easy for everyone.', null, 'https://github.com/docgen', true, true, 0, 0),
  ('33333333-3333-3333-3333-333333333333', 'testcraft', 'Test Craft', 'https://api.dicebear.com/7.x/avataaars/svg?seed=testcraft', 'Automated testing solutions for modern development.', 'https://testcraft.io', 'https://github.com/testcraft', true, true, 200, 3998.00),
  ('44444444-4444-4444-4444-444444444444', 'reviewbot', 'Review Bot', 'https://api.dicebear.com/7.x/avataaars/svg?seed=reviewbot', 'AI-powered code review assistant.', null, 'https://github.com/reviewbot', true, false, 350, 8747.50),
  ('55555555-5555-5555-5555-555555555555', 'datacraft', 'Data Craft', 'https://api.dicebear.com/7.x/avataaars/svg?seed=datacraft', 'Database design and optimization tools.', null, 'https://github.com/datacraft', true, true, 100, 999.00),
  ('66666666-6666-6666-6666-666666666666', 'regexmaster', 'Regex Master', 'https://api.dicebear.com/7.x/avataaars/svg?seed=regexmaster', 'Making regex easy to understand.', null, 'https://github.com/regexmaster', true, true, 0, 0),
  ('77777777-7777-7777-7777-777777777777', 'devopsmaster', 'DevOps Master', 'https://api.dicebear.com/7.x/avataaars/svg?seed=devopsmaster', 'DevOps automation and containerization expert.', 'https://devopsmaster.io', 'https://github.com/devopsmaster', true, false, 150, 1948.50),
  ('88888888-8888-8888-8888-888888888888', 'securedev', 'Secure Dev', 'https://api.dicebear.com/7.x/avataaars/svg?seed=securedev', 'Enterprise security tools and consulting.', 'https://securedev.io', null, true, true, 400, 11996.00)
ON CONFLICT (id) DO UPDATE SET
  username = EXCLUDED.username,
  full_name = EXCLUDED.full_name,
  avatar_url = EXCLUDED.avatar_url,
  bio = EXCLUDED.bio,
  is_creator = EXCLUDED.is_creator,
  is_verified = EXCLUDED.is_verified;

-- ============================================
-- GET CATEGORY IDs
-- ============================================
-- Categories are already seeded in the migration

-- ============================================
-- SEED SKILLS
-- ============================================
INSERT INTO public.skills (id, name, slug, description, long_description, price, is_free, category_id, creator_id, install_command, github_url, version, downloads, rating, review_count, security_score, security_grade, badges, tags, is_published, is_featured, scanned_at)
VALUES
  -- SEO Audit Pro
  (
    'skill-0001-0001-0001-000000000001',
    'SEO Audit Pro',
    'seo-audit-pro',
    'Comprehensive SEO analysis with actionable recommendations for your website. Analyzes meta tags, content, and technical SEO factors.',
    E'# SEO Audit Pro\n\nA comprehensive SEO analysis tool that provides actionable recommendations for your website.\n\n## Features\n\n- **Meta Tag Analysis**: Checks title, description, and Open Graph tags\n- **Content Analysis**: Analyzes heading structure, keyword density, and readability\n- **Technical SEO**: Checks robots.txt, sitemap, canonical URLs, and more\n- **Performance Metrics**: Core Web Vitals and page speed analysis\n- **Mobile Friendliness**: Responsive design and mobile usability checks\n- **Structured Data**: Schema.org markup validation\n\n## Usage\n\nSimply provide a URL and the skill will analyze the page and provide a detailed report with prioritized recommendations.',
    14.99,
    false,
    (SELECT id FROM public.categories WHERE slug = 'frontend'),
    '11111111-1111-1111-1111-111111111111',
    'claude skill install @seomaster/seo-audit-pro',
    'https://github.com/seomaster/seo-audit-pro',
    '2.1.0',
    2340,
    4.9,
    128,
    95,
    'A',
    ARRAY['security-certified', 'top-rated'],
    ARRAY['seo', 'audit', 'marketing', 'analytics'],
    true,
    true,
    NOW() - INTERVAL '2 days'
  ),
  -- API Documentation Generator
  (
    'skill-0002-0002-0002-000000000002',
    'API Documentation Generator',
    'api-documentation',
    'Auto-generate beautiful API docs from your OpenAPI specs, GraphQL schemas, or code comments.',
    E'# API Documentation Generator\n\nGenerate professional API documentation automatically.\n\n## Supported Formats\n\n- OpenAPI 3.0 / Swagger\n- GraphQL schemas\n- JSDoc / TSDoc comments\n- Python docstrings\n\n## Features\n\n- Interactive API explorer\n- Code examples in multiple languages\n- Authentication documentation\n- Webhook documentation',
    0,
    true,
    (SELECT id FROM public.categories WHERE slug = 'documentation'),
    '22222222-2222-2222-2222-222222222222',
    'claude skill install @docgen/api-docs',
    'https://github.com/docgen/api-docs',
    '3.0.0',
    5621,
    4.7,
    234,
    92,
    'A',
    ARRAY['security-certified'],
    ARRAY['api', 'documentation', 'openapi', 'graphql'],
    true,
    true,
    NOW() - INTERVAL '3 days'
  ),
  -- Test Generator AI
  (
    'skill-0003-0003-0003-000000000003',
    'Test Generator AI',
    'test-generator',
    'Generate comprehensive unit tests, integration tests, and e2e tests from your code automatically.',
    E'# Test Generator AI\n\nAI-powered test generation for modern codebases.\n\n## Supported Frameworks\n\n- Jest / Vitest\n- Pytest\n- JUnit\n- Playwright / Cypress\n\n## Features\n\n- Analyzes code structure and generates meaningful tests\n- Edge case detection\n- Mock generation\n- Coverage optimization suggestions',
    19.99,
    false,
    (SELECT id FROM public.categories WHERE slug = 'testing'),
    '33333333-3333-3333-3333-333333333333',
    'claude skill install @testcraft/test-generator',
    'https://github.com/testcraft/test-generator',
    '1.5.0',
    1892,
    5.0,
    89,
    98,
    'A+',
    ARRAY['security-certified', 'top-rated', 'enterprise-ready'],
    ARRAY['testing', 'unit-tests', 'automation', 'tdd'],
    true,
    true,
    NOW() - INTERVAL '1 day'
  ),
  -- Code Review AI
  (
    'skill-0004-0004-0004-000000000004',
    'Code Review AI',
    'code-review-ai',
    'AI-powered code review that catches bugs, security issues, performance problems, and style inconsistencies.',
    E'# Code Review AI\n\nGet instant, intelligent code reviews.\n\n## What It Checks\n\n- Security vulnerabilities (OWASP Top 10)\n- Performance anti-patterns\n- Code style and consistency\n- Best practices violations\n- Potential bugs and edge cases\n\n## Integrations\n\n- GitHub PR comments\n- GitLab MR integration\n- VS Code extension',
    24.99,
    false,
    (SELECT id FROM public.categories WHERE slug = 'backend'),
    '44444444-4444-4444-4444-444444444444',
    'claude skill install @reviewbot/code-review',
    'https://github.com/reviewbot/code-review',
    '2.0.0',
    3104,
    4.8,
    156,
    88,
    'B+',
    ARRAY['security-certified', 'enterprise-ready'],
    ARRAY['code-review', 'security', 'quality', 'linting'],
    true,
    true,
    NOW() - INTERVAL '5 days'
  ),
  -- Database Schema Designer
  (
    'skill-0005-0005-0005-000000000005',
    'Database Schema Designer',
    'database-schema',
    'Design and visualize database schemas with AI-powered suggestions for normalization and indexing.',
    E'# Database Schema Designer\n\nDesign better databases with AI assistance.\n\n## Features\n\n- Visual ERD generation\n- Normalization suggestions\n- Index recommendations\n- Migration script generation\n- Multi-database support (PostgreSQL, MySQL, SQLite)',
    9.99,
    false,
    (SELECT id FROM public.categories WHERE slug = 'data'),
    '55555555-5555-5555-5555-555555555555',
    'claude skill install @datacraft/schema-designer',
    null,
    '1.2.0',
    987,
    4.6,
    45,
    91,
    'A',
    ARRAY['security-certified'],
    ARRAY['database', 'schema', 'design', 'sql', 'postgresql'],
    true,
    false,
    NOW() - INTERVAL '7 days'
  ),
  -- Regex Builder
  (
    'skill-0006-0006-0006-000000000006',
    'Regex Builder',
    'regex-builder',
    'Build and test complex regular expressions using natural language descriptions.',
    E'# Regex Builder\n\nWrite regex without the headache.\n\n## How It Works\n\n1. Describe what you want to match in plain English\n2. Get a working regex with explanation\n3. Test against your sample data\n4. Export to your language of choice\n\n## Supported Languages\n\n- JavaScript\n- Python\n- Go\n- Java\n- Ruby',
    0,
    true,
    (SELECT id FROM public.categories WHERE slug = 'backend'),
    '66666666-6666-6666-6666-666666666666',
    'claude skill install @regexmaster/builder',
    'https://github.com/regexmaster/builder',
    '1.0.0',
    4230,
    4.9,
    312,
    94,
    'A',
    ARRAY['security-certified', 'top-rated'],
    ARRAY['regex', 'patterns', 'strings', 'validation'],
    true,
    false,
    NOW() - INTERVAL '10 days'
  ),
  -- Docker Compose Generator
  (
    'skill-0007-0007-0007-000000000007',
    'Docker Compose Generator',
    'docker-compose-gen',
    'Generate Docker Compose files for complex multi-service architectures with best practices.',
    E'# Docker Compose Generator\n\nCreate production-ready Docker Compose configurations.\n\n## Features\n\n- Multi-service architecture support\n- Network configuration\n- Volume management\n- Environment variable handling\n- Health checks\n- Resource limits',
    12.99,
    false,
    (SELECT id FROM public.categories WHERE slug = 'devops'),
    '77777777-7777-7777-7777-777777777777',
    'claude skill install @devops/docker-compose',
    'https://github.com/devops/docker-compose',
    '2.3.0',
    1567,
    4.5,
    67,
    89,
    'B+',
    ARRAY['security-certified'],
    ARRAY['docker', 'devops', 'containers', 'infrastructure'],
    true,
    false,
    NOW() - INTERVAL '6 days'
  ),
  -- Security Audit Scanner
  (
    'skill-0008-0008-0008-000000000008',
    'Security Audit Scanner',
    'security-audit',
    'Comprehensive security scanning for your codebase. Detects vulnerabilities, secrets, and compliance issues.',
    E'# Security Audit Scanner\n\nEnterprise-grade security scanning.\n\n## Scan Types\n\n- **SAST**: Static Application Security Testing\n- **Secrets Detection**: API keys, passwords, tokens\n- **Dependency Audit**: Known vulnerabilities in packages\n- **Compliance**: OWASP, PCI-DSS, HIPAA checks\n\n## Reports\n\n- Detailed findings with remediation steps\n- SARIF export for CI/CD integration\n- Executive summary for stakeholders',
    29.99,
    false,
    (SELECT id FROM public.categories WHERE slug = 'security'),
    '88888888-8888-8888-8888-888888888888',
    'claude skill install @securedev/audit-scanner',
    null,
    '3.1.0',
    2891,
    4.9,
    198,
    99,
    'A+',
    ARRAY['security-certified', 'top-rated', 'enterprise-ready'],
    ARRAY['security', 'audit', 'vulnerability', 'compliance', 'sast'],
    true,
    true,
    NOW() - INTERVAL '1 day'
  ),
  -- React Component Generator
  (
    'skill-0009-0009-0009-000000000009',
    'React Component Generator',
    'react-component-gen',
    'Generate production-ready React components with TypeScript, tests, and Storybook stories.',
    E'# React Component Generator\n\nScaffold React components the right way.\n\n## What You Get\n\n- TypeScript component with proper types\n- Unit tests (Jest/Vitest)\n- Storybook stories\n- CSS Modules / Tailwind styles\n- Accessibility built-in',
    7.99,
    false,
    (SELECT id FROM public.categories WHERE slug = 'frontend'),
    '11111111-1111-1111-1111-111111111111',
    'claude skill install @seomaster/react-gen',
    'https://github.com/seomaster/react-gen',
    '1.0.0',
    1234,
    4.4,
    56,
    90,
    'A',
    ARRAY['security-certified'],
    ARRAY['react', 'components', 'typescript', 'frontend'],
    true,
    false,
    NOW() - INTERVAL '4 days'
  ),
  -- ML Model Explainer
  (
    'skill-0010-0010-0010-000000000010',
    'ML Model Explainer',
    'ml-explainer',
    'Understand and explain machine learning model predictions with SHAP values and feature importance.',
    E'# ML Model Explainer\n\nMake your ML models interpretable.\n\n## Supported Models\n\n- Scikit-learn\n- XGBoost / LightGBM\n- TensorFlow / PyTorch\n- Custom models\n\n## Explanations\n\n- SHAP values\n- LIME\n- Feature importance\n- Partial dependence plots',
    34.99,
    false,
    (SELECT id FROM public.categories WHERE slug = 'ai-ml'),
    '55555555-5555-5555-5555-555555555555',
    'claude skill install @datacraft/ml-explainer',
    'https://github.com/datacraft/ml-explainer',
    '2.0.0',
    876,
    4.7,
    34,
    93,
    'A',
    ARRAY['security-certified', 'enterprise-ready'],
    ARRAY['machine-learning', 'ai', 'explainability', 'shap'],
    true,
    false,
    NOW() - INTERVAL '8 days'
  )
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  downloads = EXCLUDED.downloads,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count;

-- ============================================
-- SEED SECURITY SCANS
-- ============================================
INSERT INTO public.security_scans (id, skill_id, overall_score, grade, checks, scanned_at)
VALUES
  (
    'scan-0001-0001-0001-000000000001',
    'skill-0001-0001-0001-000000000001',
    95,
    'A',
    '[
      {"name": "Prompt Injection Detection", "passed": true, "severity": "critical"},
      {"name": "Data Exfiltration Patterns", "passed": true, "severity": "critical"},
      {"name": "Hardcoded Secrets/API Keys", "passed": true, "severity": "critical"},
      {"name": "Dangerous Shell Commands", "passed": true, "severity": "high"},
      {"name": "Obfuscated Code Detection", "passed": true, "severity": "high"},
      {"name": "External URL Fetches", "passed": false, "severity": "medium"},
      {"name": "Credential Access Patterns", "passed": true, "severity": "high"},
      {"name": "Privilege Escalation", "passed": true, "severity": "critical"},
      {"name": "Dependency Vulnerabilities", "passed": true, "severity": "high"},
      {"name": "License Compliance", "passed": true, "severity": "low"},
      {"name": "Sandbox Behavior Test", "passed": true, "severity": "high"},
      {"name": "AI Content Analysis", "passed": true, "severity": "medium"}
    ]'::jsonb,
    NOW() - INTERVAL '2 days'
  ),
  (
    'scan-0002-0002-0002-000000000002',
    'skill-0002-0002-0002-000000000002',
    92,
    'A',
    '[
      {"name": "Prompt Injection Detection", "passed": true, "severity": "critical"},
      {"name": "Data Exfiltration Patterns", "passed": true, "severity": "critical"},
      {"name": "Hardcoded Secrets/API Keys", "passed": true, "severity": "critical"},
      {"name": "Dangerous Shell Commands", "passed": true, "severity": "high"},
      {"name": "Obfuscated Code Detection", "passed": true, "severity": "high"},
      {"name": "External URL Fetches", "passed": true, "severity": "medium"},
      {"name": "Credential Access Patterns", "passed": true, "severity": "high"},
      {"name": "Privilege Escalation", "passed": true, "severity": "critical"},
      {"name": "Dependency Vulnerabilities", "passed": false, "severity": "high"},
      {"name": "License Compliance", "passed": true, "severity": "low"},
      {"name": "Sandbox Behavior Test", "passed": true, "severity": "high"},
      {"name": "AI Content Analysis", "passed": true, "severity": "medium"}
    ]'::jsonb,
    NOW() - INTERVAL '3 days'
  ),
  (
    'scan-0003-0003-0003-000000000003',
    'skill-0003-0003-0003-000000000003',
    98,
    'A+',
    '[
      {"name": "Prompt Injection Detection", "passed": true, "severity": "critical"},
      {"name": "Data Exfiltration Patterns", "passed": true, "severity": "critical"},
      {"name": "Hardcoded Secrets/API Keys", "passed": true, "severity": "critical"},
      {"name": "Dangerous Shell Commands", "passed": true, "severity": "high"},
      {"name": "Obfuscated Code Detection", "passed": true, "severity": "high"},
      {"name": "External URL Fetches", "passed": true, "severity": "medium"},
      {"name": "Credential Access Patterns", "passed": true, "severity": "high"},
      {"name": "Privilege Escalation", "passed": true, "severity": "critical"},
      {"name": "Dependency Vulnerabilities", "passed": true, "severity": "high"},
      {"name": "License Compliance", "passed": true, "severity": "low"},
      {"name": "Sandbox Behavior Test", "passed": true, "severity": "high"},
      {"name": "AI Content Analysis", "passed": true, "severity": "medium"}
    ]'::jsonb,
    NOW() - INTERVAL '1 day'
  ),
  (
    'scan-0008-0008-0008-000000000008',
    'skill-0008-0008-0008-000000000008',
    99,
    'A+',
    '[
      {"name": "Prompt Injection Detection", "passed": true, "severity": "critical"},
      {"name": "Data Exfiltration Patterns", "passed": true, "severity": "critical"},
      {"name": "Hardcoded Secrets/API Keys", "passed": true, "severity": "critical"},
      {"name": "Dangerous Shell Commands", "passed": true, "severity": "high"},
      {"name": "Obfuscated Code Detection", "passed": true, "severity": "high"},
      {"name": "External URL Fetches", "passed": true, "severity": "medium"},
      {"name": "Credential Access Patterns", "passed": true, "severity": "high"},
      {"name": "Privilege Escalation", "passed": true, "severity": "critical"},
      {"name": "Dependency Vulnerabilities", "passed": true, "severity": "high"},
      {"name": "License Compliance", "passed": true, "severity": "low"},
      {"name": "Sandbox Behavior Test", "passed": true, "severity": "high"},
      {"name": "AI Content Analysis", "passed": true, "severity": "medium"}
    ]'::jsonb,
    NOW() - INTERVAL '1 day'
  )
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- SEED REVIEWS
-- ============================================
INSERT INTO public.reviews (id, skill_id, user_id, rating, comment, created_at)
VALUES
  ('review-001', 'skill-0001-0001-0001-000000000001', '22222222-2222-2222-2222-222222222222', 5, 'Excellent tool! The recommendations are actionable and the reports are comprehensive. Saved me hours of manual work.', NOW() - INTERVAL '10 days'),
  ('review-002', 'skill-0001-0001-0001-000000000001', '33333333-3333-3333-3333-333333333333', 5, 'Finally an SEO tool that actually works with AI assistants. The integration is seamless.', NOW() - INTERVAL '8 days'),
  ('review-003', 'skill-0001-0001-0001-000000000001', '44444444-4444-4444-4444-444444444444', 4, 'Great for quick audits. Would love to see more detailed technical SEO checks in future updates.', NOW() - INTERVAL '5 days'),
  ('review-004', 'skill-0002-0002-0002-000000000002', '11111111-1111-1111-1111-111111111111', 5, 'The best documentation generator I have used. Supports all my projects.', NOW() - INTERVAL '15 days'),
  ('review-005', 'skill-0003-0003-0003-000000000003', '11111111-1111-1111-1111-111111111111', 5, 'Incredible test coverage. The AI understands edge cases better than I do!', NOW() - INTERVAL '12 days'),
  ('review-006', 'skill-0003-0003-0003-000000000003', '22222222-2222-2222-2222-222222222222', 5, 'Worth every penny. Our test coverage went from 40% to 90% in a week.', NOW() - INTERVAL '7 days'),
  ('review-007', 'skill-0008-0008-0008-000000000008', '33333333-3333-3333-3333-333333333333', 5, 'Enterprise-grade security scanning at a fraction of the cost. Highly recommended.', NOW() - INTERVAL '3 days'),
  ('review-008', 'skill-0008-0008-0008-000000000008', '44444444-4444-4444-4444-444444444444', 5, 'Found vulnerabilities that other tools missed. The compliance reports are excellent.', NOW() - INTERVAL '2 days')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- UPDATE CATEGORY COUNTS
-- ============================================
UPDATE public.categories c
SET skill_count = (
  SELECT COUNT(*)
  FROM public.skills s
  WHERE s.category_id = c.id AND s.is_published = true
);

-- Verify the data
SELECT 'Profiles:' as table_name, COUNT(*) as count FROM public.profiles
UNION ALL
SELECT 'Categories:', COUNT(*) FROM public.categories
UNION ALL
SELECT 'Skills:', COUNT(*) FROM public.skills
UNION ALL
SELECT 'Security Scans:', COUNT(*) FROM public.security_scans
UNION ALL
SELECT 'Reviews:', COUNT(*) FROM public.reviews;
