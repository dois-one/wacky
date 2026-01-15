# Wacky

A platform to capture, organize, and refine ideas visually. Wacky automates idea management with background agents, creating mind maps, sketches, and implementation plans. A product experience prioritizing seamless input, self-organization, and prioritization.

## Features

### 🎯 Input Simplicity
- **Multiple Input Types**: Notes, photos, and audio recordings
- **Seamless Capture**: Quick and intuitive input creation
- **File Upload**: Support for images and audio files
- **Mobile-to-Portal Flow**: Designed for capturing on mobile and refining on desktop

### 🤖 Automated Organization
- **Smart Tagging**: Automatically extracts relevant tags from content
- **Category Assignment**: Classifies inputs into technical, design, business, ideas, tasks, or general
- **Priority Scoring**: Calculates priority based on urgency keywords and recency
- **Connection Discovery**: Finds relationships between inputs based on shared tags and categories

### 🗺️ Auto-Expanding Mind Maps
- **Visual Organization**: Interactive mind map visualization of your ideas
- **Expandable Nodes**: Click to reveal connections and related inputs
- **Category-Based Layout**: Automatically groups related inputs
- **Dynamic Updates**: Mind maps evolve as you add more inputs

### 📝 Implementation-Ready Drafts
- **Automated Generation**: Converts inputs into structured implementation documents
- **Execution Plans**: Creates detailed step-by-step plans with effort estimates
- **Draft Refinement**: Tools to enhance and detail your drafts
- **Status Tracking**: Track progress from draft to ready to completed

### 👋 Welcome Back Experience
- **Dashboard Overview**: See your recent activity and statistics at a glance
- **Prioritized Tasks**: View your most important drafts and action items
- **Suggested Connections**: Discover relationships between your inputs
- **Quick Actions**: Fast access to create notes, upload photos, or record audio

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Frontend**: React with CSS Modules
- **Backend**: Next.js API Routes
- **Storage**: In-memory data store (easily replaceable with database)
- **Styling**: Modern CSS with mobile-responsive design

## Getting Started

### Installation

1. Clone the repository:
```bash
git clone https://github.com/dois-one/wacky.git
cd wacky
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## Project Structure

```
wacky/
├── app/                      # Next.js app directory
│   ├── api/                 # API routes
│   │   ├── inputs/         # Input creation and retrieval
│   │   ├── mindmaps/       # Mind map management
│   │   ├── drafts/         # Draft generation and refinement
│   │   ├── welcome/        # Welcome back dashboard data
│   │   └── upload/         # File upload handling
│   ├── inputs/             # Inputs pages
│   ├── drafts/             # Drafts pages
│   ├── mindmaps/           # Mind maps pages
│   └── page.tsx            # Welcome back dashboard
├── lib/                     # Core business logic
│   ├── store.ts            # Data store
│   ├── organization.ts     # Auto-organization service
│   ├── mindmap.ts          # Mind map generation
│   └── draft.ts            # Draft generation
├── types/                   # TypeScript type definitions
└── public/                  # Static assets
```

## API Endpoints

### Inputs
- `POST /api/inputs` - Create a new input
- `GET /api/inputs` - Get all inputs (supports filtering)

### Mind Maps
- `POST /api/mindmaps` - Create a mind map from inputs
- `GET /api/mindmaps` - Get all mind maps
- `POST /api/mindmaps/[id]/expand` - Expand a node in a mind map

### Drafts
- `POST /api/drafts` - Create a draft from inputs
- `GET /api/drafts` - Get all drafts
- `POST /api/drafts/[id]/refine` - Refine a draft with additional content

### Upload
- `POST /api/upload` - Upload a file (photo or recording)

### Welcome Back
- `GET /api/welcome` - Get dashboard data (recent inputs, prioritized tasks, connections)

## Usage Guide

### Creating Inputs

1. From the dashboard, click one of the quick action buttons:
   - 📝 Add Note
   - 📷 Upload Photo
   - 🎤 Record Audio

2. Fill in the title and content

3. For photos or recordings, upload your file

4. Click "Create Input" - it will be automatically organized!

### Viewing Organized Inputs

1. Navigate to "View All Inputs" from the dashboard

2. Filter by category using the filter buttons

3. See your inputs organized with:
   - Auto-generated tags
   - Category classification
   - Priority scores
   - Status indicators

### Creating Mind Maps

Mind maps are created from your inputs and visualize the connections between them:

1. Navigate to Mind Maps page

2. View existing mind maps or create a new one

3. Click on nodes with "+ Expand" to reveal related inputs

4. Watch as your ideas connect visually!

### Generating Drafts

Drafts convert your ideas into actionable implementation plans:

1. Select multiple inputs related to a project

2. Create a draft from those inputs

3. Review the automatically generated:
   - Structured content organized by category
   - Execution plan with detailed steps
   - Effort estimates for each step

4. Refine the draft with additional details as needed

## Key Concepts

### Automated Organization

When you create an input, the system automatically:

1. **Extracts Tags**: Scans content for keywords related to categories
2. **Assigns Category**: Classifies as technical, design, business, ideas, tasks, or general
3. **Calculates Priority**: Scores based on urgency keywords and recency
4. **Updates Status**: Marks as "organized" after processing

### Mind Map Auto-Expansion

Mind maps grow intelligently:

1. **Initial Structure**: Creates root node with category branches
2. **Input Nodes**: Adds nodes for each input under its category
3. **Expansion**: Click any node to reveal related inputs based on:
   - Shared tags
   - Same category
   - Content similarity

### Draft Generation

Drafts are implementation-ready:

1. **Content Assembly**: Organizes input content by category
2. **Execution Planning**: Generates steps based on:
   - Input categories present
   - Project complexity
   - Standard implementation phases
3. **Effort Estimation**: Provides time estimates for each step

## Future Enhancements

- **Database Integration**: Replace in-memory store with PostgreSQL/MongoDB
- **Real-time Sync**: WebSocket support for live updates
- **AI Integration**: Use LLMs for smarter content analysis and draft generation
- **Collaboration**: Multi-user support with sharing and permissions
- **Mobile App**: Native mobile applications for iOS and Android
- **Voice Recording**: In-browser audio recording without file upload
- **Export**: PDF and Markdown export for drafts
- **Search**: Full-text search across all inputs and drafts

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - see LICENSE file for details
