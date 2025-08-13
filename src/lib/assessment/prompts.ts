import { ToolPrompt, AssessmentInput } from '@/types/assessment'

export const toolPrompts: Record<string, ToolPrompt> = {
  lovable: {
    toolType: 'lovable',
    name: 'Lovable',
    description: 'For React/Next.js apps built with Lovable',
    prompt: `# ProtoReady.ai Assessment - Lovable Project Analysis

Run this command in your terminal and paste the complete output:

\`\`\`bash
echo "=== PROTOREADY ANALYSIS START ===" && \\
echo "=== PROJECT STRUCTURE ===" && \\
find . -type f \\( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" \\) | head -30 && \\
echo "=== PACKAGE DEPENDENCIES ===" && \\
cat package.json | grep -A 50 '"dependencies"' && \\
echo "=== BUILD CONFIGURATION ===" && \\
ls -la | grep -E "(webpack|vite|next|build)" && \\
echo "=== SECURITY SCAN ===" && \\
grep -r "API_KEY\\|SECRET\\|PASSWORD\\|console\\.log" . --include="*.js" --include="*.jsx" --include="*.ts" --include="*.tsx" | head -10 && \\
echo "=== DATABASE USAGE ===" && \\
grep -r "mongodb\\|postgresql\\|mysql\\|firebase\\|supabase" . --include="*.js" --include="*.ts" | head -5 && \\
echo "=== STATE MANAGEMENT ===" && \\
grep -r "useState\\|useEffect\\|redux\\|zustand\\|context" . --include="*.js" --include="*.ts" | wc -l && \\
echo "=== ERROR HANDLING ===" && \\
grep -r "try\\|catch\\|throw\\|Error" . --include="*.js" --include="*.ts" | wc -l && \\
echo "=== PERFORMANCE PATTERNS ===" && \\
grep -r "useMemo\\|useCallback\\|React\\.memo\\|lazy" . --include="*.js" --include="*.ts" | wc -l && \\
echo "=== PROTOREADY ANALYSIS END ==="
\`\`\`

**Alternative for Windows/PowerShell:**
\`\`\`powershell
Write-Host "=== PROTOREADY ANALYSIS START ==="
Write-Host "=== PROJECT STRUCTURE ==="
Get-ChildItem -Recurse -Include *.js,*.jsx,*.ts,*.tsx | Select-Object -First 30 | ForEach-Object { $_.FullName }
Write-Host "=== PACKAGE DEPENDENCIES ==="
Get-Content package.json | Select-String -Pattern '"dependencies"' -Context 0,50
Write-Host "=== SECURITY SCAN ==="
Select-String -Path . -Pattern "API_KEY|SECRET|PASSWORD|console\.log" -Include *.js,*.jsx,*.ts,*.tsx -Recurse | Select-Object -First 10
Write-Host "=== PROTOREADY ANALYSIS END ==="
\`\`\``,
    expectedOutput: [
      'Project file structure',
      'Package.json dependencies',
      'Build configuration files',
      'Security pattern analysis',
      'Database integration detection',
      'State management usage',
      'Error handling patterns',
      'Performance optimization indicators'
    ]
  },

  replit: {
    toolType: 'replit',
    name: 'Replit',
    description: 'For Python/JavaScript apps in Replit',
    prompt: `# ProtoReady.ai Assessment - Replit Project Analysis

Run this in your Replit console and paste the output:

**For Python projects:**
\`\`\`python
import subprocess
import os
import glob

print("=== PROTOREADY ANALYSIS START ===")

# Project structure
print("=== PROJECT STRUCTURE ===")
for root, dirs, files in os.walk('.'):
    for file in files:
        if file.endswith(('.py', '.js', '.html', '.css')):
            print(os.path.join(root, file))

# Dependencies
print("=== DEPENDENCIES ===")
if os.path.exists('requirements.txt'):
    with open('requirements.txt', 'r') as f:
        print("requirements.txt:")
        print(f.read()[:1000])

if os.path.exists('package.json'):
    with open('package.json', 'r') as f:
        print("package.json:")
        print(f.read()[:1000])

# Security scan
print("=== SECURITY SCAN ===")
try:
    result = subprocess.run(['grep', '-r', 'password\\|secret\\|key\\|token', '.'], 
                          capture_output=True, text=True)
    if result.stdout:
        print("Potential secrets found:")
        print(result.stdout[:500])
    else:
        print("No obvious secrets detected")
except:
    print("Security scan completed")

# Database usage
print("=== DATABASE USAGE ===")
try:
    result = subprocess.run(['grep', '-r', 'sqlite\\|postgres\\|mysql\\|mongo', '.'], 
                          capture_output=True, text=True)
    if result.stdout:
        print("Database usage detected:")
        print(result.stdout[:300])
    else:
        print("No database usage detected")
except:
    print("Database scan completed")

print("=== PROTOREADY ANALYSIS END ===")
\`\`\`

**For JavaScript/Node.js projects:**
\`\`\`javascript
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log("=== PROTOREADY ANALYSIS START ===");

// Project structure
console.log("=== PROJECT STRUCTURE ===");
function walkDir(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      if (!file.startsWith('.') && file !== 'node_modules') {
        walkDir(filePath, fileList);
      }
    } else if (file.endsWith('.js') || file.endsWith('.ts') || file.endsWith('.jsx') || file.endsWith('.tsx')) {
      fileList.push(filePath);
    }
  });
  return fileList;
}

const files = walkDir('.').slice(0, 30);
files.forEach(file => console.log(file));

// Package.json
console.log("=== DEPENDENCIES ===");
if (fs.existsSync('package.json')) {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  console.log("Dependencies:", Object.keys(pkg.dependencies || {}));
  console.log("DevDependencies:", Object.keys(pkg.devDependencies || {}));
}

console.log("=== PROTOREADY ANALYSIS END ===");
\`\`\``,
    expectedOutput: [
      'Project file structure',
      'Dependencies and requirements',
      'Security pattern detection',
      'Database usage analysis',
      'Framework detection',
      'Code organization patterns'
    ]
  },

  bolt: {
    toolType: 'bolt',
    name: 'Bolt/Claude',
    description: 'For apps built with Bolt or Claude Artifacts',
    prompt: `# ProtoReady.ai Assessment - Bolt/Claude Project Analysis

Since Bolt and Claude Artifacts generate code directly, please provide:

**Step 1: Project Structure**
Copy and paste the complete file structure from your project, including all folders and files.

**Step 2: Main Code Files**
Copy the contents of your main files (max 3-5 key files):
- Main component/page file
- Package.json (if available)
- Configuration files (vite.config, next.config, etc.)
- Any API/backend code

**Step 3: Run this analysis if you have a terminal:**
\`\`\`bash
# If you can export your Bolt project to a folder:
echo "=== PROTOREADY ANALYSIS START ===" && \\
echo "=== PROJECT FILES ===" && \\
find . -type f \\( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" -o -name "*.vue" \\) && \\
echo "=== DEPENDENCIES ===" && \\
cat package.json 2>/dev/null || echo "No package.json found" && \\
echo "=== CODE PATTERNS ===" && \\
grep -r "useState\\|useEffect\\|fetch\\|axios" . --include="*.js" --include="*.jsx" --include="*.ts" --include="*.tsx" 2>/dev/null | wc -l && \\
echo "=== PROTOREADY ANALYSIS END ==="
\`\`\`

**What to include:**
1. Complete code of your main application file(s)
2. Any configuration files (package.json, etc.)
3. Database connection code (if any)
4. API endpoint implementations
5. Authentication/security code
6. State management implementation`,
    expectedOutput: [
      'Complete project code structure',
      'Framework and library usage',
      'Component architecture',
      'State management patterns',
      'API integration approach',
      'Security implementation',
      'Performance optimization usage'
    ]
  },

  cursor: {
    toolType: 'cursor',
    name: 'Cursor',
    description: 'For projects built with Cursor IDE',
    prompt: `# ProtoReady.ai Assessment - Cursor Project Analysis

Run this in your Cursor terminal and paste the output:

\`\`\`bash
echo "=== PROTOREADY ANALYSIS START ===" && \\
echo "=== PROJECT OVERVIEW ===" && \\
echo "Project: $(basename $(pwd))" && \\
echo "Files: $(find . -type f \\( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" -o -name "*.py" -o -name "*.go" -o -name "*.java" \\) | wc -l)" && \\
echo "=== PROJECT STRUCTURE ===" && \\
tree -I 'node_modules|.git|dist|build' -L 3 || find . -type d -not -path './node_modules*' -not -path './.git*' | head -20 && \\
echo "=== PACKAGE CONFIGURATION ===" && \\
cat package.json 2>/dev/null || cat requirements.txt 2>/dev/null || cat go.mod 2>/dev/null || echo "No package file found" && \\
echo "=== FRAMEWORK DETECTION ===" && \\
grep -r "react\\|vue\\|angular\\|next\\|svelte\\|express\\|fastapi\\|django\\|spring" . --include="*.json" --include="*.js" --include="*.ts" --include="*.py" | head -5 && \\
echo "=== SECURITY ANALYSIS ===" && \\
grep -r "process\\.env\\|API_KEY\\|SECRET\\|PASSWORD" . --include="*.js" --include="*.ts" --include="*.py" --exclude-dir=node_modules | head -10 && \\
echo "=== DATABASE INTEGRATION ===" && \\
grep -r "mongoose\\|prisma\\|sqlite\\|postgres\\|mysql\\|redis" . --include="*.js" --include="*.ts" --include="*.py" --exclude-dir=node_modules | head -5 && \\
echo "=== TESTING SETUP ===" && \\
grep -r "test\\|spec\\|jest\\|pytest" . --include="*.json" --include="*.js" --include="*.py" | head -5 && \\
echo "=== BUILD CONFIGURATION ===" && \\
ls -la | grep -E "(webpack|vite|next|build|dist)" && \\
echo "=== PROTOREADY ANALYSIS END ==="
\`\`\`

**For detailed code analysis, also run:**
\`\`\`bash
echo "=== CODE QUALITY METRICS ===" && \\
echo "Total lines of code:" && \\
find . -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" -o -name "*.py" | xargs wc -l 2>/dev/null | tail -1 && \\
echo "Function count:" && \\
grep -r "function\\|def\\|const.*=" . --include="*.js" --include="*.ts" --include="*.py" --exclude-dir=node_modules | wc -l && \\
echo "Component count:" && \\
grep -r "export.*function\\|export.*class\\|export default" . --include="*.js" --include="*.jsx" --include="*.ts" --include="*.tsx" --exclude-dir=node_modules | wc -l
\`\`\``,
    expectedOutput: [
      'Project overview and metrics',
      'Directory structure',
      'Package configuration',
      'Framework detection',
      'Security pattern analysis',
      'Database integration',
      'Testing setup',
      'Build configuration',
      'Code quality metrics'
    ]
  },

  github: {
    toolType: 'github',
    name: 'GitHub Repository',
    description: 'Upload from any GitHub repository',
    prompt: `# ProtoReady.ai Assessment - GitHub Repository Analysis

**Option 1: Repository URL (Recommended)**
Provide your GitHub repository URL:
\`https://github.com/username/repository-name\`

We'll automatically clone and analyze your repository.

**Option 2: Manual Analysis**
If your repository is private, run this analysis locally and paste the output:

\`\`\`bash
# Navigate to your project directory first
cd /path/to/your/project

echo "=== PROTOREADY GITHUB ANALYSIS START ===" && \\
echo "=== REPOSITORY INFO ===" && \\
git remote -v && \\
git log --oneline -10 && \\
echo "=== PROJECT METRICS ===" && \\
echo "Total files: $(find . -type f \\( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" -o -name "*.py" -o -name "*.go" -o -name "*.java" \\) | wc -l)" && \\
echo "Commits: $(git rev-list --count HEAD)" && \\
echo "Contributors: $(git shortlog -sn | wc -l)" && \\
echo "=== PROJECT STRUCTURE ===" && \\
tree -I 'node_modules|.git|dist|build|__pycache__' -L 3 || find . -type d -not -path './node_modules*' -not -path './.git*' -not -path './dist*' -not -path './build*' | head -30 && \\
echo "=== CONFIGURATION FILES ===" && \\
ls -la | grep -E "package\\.json|requirements\\.txt|go\\.mod|pom\\.xml|Cargo\\.toml|composer\\.json" && \\
echo "=== DEPENDENCIES ===" && \\
cat package.json 2>/dev/null | grep -A 20 '"dependencies"' || \\
cat requirements.txt 2>/dev/null || \\
cat go.mod 2>/dev/null || \\
echo "No standard dependency file found" && \\
echo "=== CI/CD SETUP ===" && \\
ls -la .github/workflows/ 2>/dev/null || echo "No GitHub Actions found" && \\
echo "=== DOCUMENTATION ===" && \\
ls -la | grep -i readme && \\
ls -la docs/ 2>/dev/null | head -5 || echo "No docs directory" && \\
echo "=== SECURITY FILES ===" && \\
ls -la | grep -E "\\.env.*|config.*|secrets.*" && \\
echo "=== DATABASE MIGRATIONS ===" && \\
find . -name "*migration*" -o -name "*migrate*" -o -name "schema*" | head -10 && \\
echo "=== TESTING SETUP ===" && \\
find . -name "*test*" -o -name "*spec*" | head -10 && \\
echo "=== BUILD ARTIFACTS ===" && \\
ls -la | grep -E "dist|build|target|bin" && \\
echo "=== PROTOREADY GITHUB ANALYSIS END ==="
\`\`\`

**Option 3: Automated GitHub Analysis**
We can also connect directly to your GitHub repository with read-only access for comprehensive analysis.`,
    expectedOutput: [
      'Repository metadata and history',
      'Project structure and organization',
      'Dependency management',
      'CI/CD pipeline configuration',
      'Documentation coverage',
      'Security configuration',
      'Database schema and migrations',
      'Testing infrastructure',
      'Build and deployment setup',
      'Code quality metrics'
    ]
  }
}

export function getToolPrompt(toolType: string): ToolPrompt | null {
  return toolPrompts[toolType] || null
}

export function getAllToolPrompts(): ToolPrompt[] {
  return Object.values(toolPrompts)
}

export function getPromptInstructions(toolType: string): string {
  const prompt = getToolPrompt(toolType)
  if (!prompt) return 'Tool not supported'
  
  return `## ${prompt.name} Analysis Instructions

${prompt.description}

${prompt.prompt}

### Expected Output
This analysis will provide:
${prompt.expectedOutput.map(item => `- ${item}`).join('\n')}

### Next Steps
1. Copy and paste the complete output from the commands above
2. Provide any additional context about your project
3. Submit for analysis to receive your production readiness report
`
}

// Helper function to validate assessment input
export function validateAssessmentInput(input: Partial<AssessmentInput>): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  if (!input.toolType) {
    errors.push('Tool type is required')
  } else if (!Object.keys(toolPrompts).includes(input.toolType)) {
    errors.push('Invalid tool type')
  }

  if (!input.codeOutput || input.codeOutput.trim().length < 100) {
    errors.push('Code output is required and must be substantial (minimum 100 characters)')
  }

  if (!input.projectType) {
    errors.push('Project type is required')
  }

  return {
    valid: errors.length === 0,
    errors
  }
}