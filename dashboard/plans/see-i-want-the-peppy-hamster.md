# Implementation Plan: Data Table Application with Sidebar Navigation

## Context

The user has provided a design screenshot of a data table application that needs to be recreated with exact visual fidelity - matching all colors, sizes, spacing, and fonts. The design shows a professional contact management interface with:

- Left sidebar navigation with collapsible sections
- Top metrics dashboard with line charts showing key statistics
- Advanced filtering and search capabilities
- A comprehensive data table with sortable columns and row selection
- Status badges and pagination controls

The existing project has a complete Shadcn/ui component library built on Radix UI primitives, which provides all necessary components. The implementation will leverage these pre-built components while ensuring pixel-perfect alignment with the provided design.

## Design Analysis

### Layout Structure
1. **Sidebar** (left, ~240px width when expanded)
   - Logo/branding at top: "Databolt" with icon
   - Navigation items with icons
   - Collapsible sections (e.g., "Team management")
   - Footer with user profile
   
2. **Main Content Area**
   - Top header with "Default" title and tabs
   - Metrics row with 4 metric cards
   - Filters and search bar
   - Data table with pagination

### Color Palette (extracted from design)
- **Background**: White/light gray (`--background`)
- **Sidebar**: Slightly darker gray (`--sidebar`)
- **Primary accent**: Green for "Active" status badges (`hsl(142.1 76.2% 36.3%)`)
- **Secondary**: Gray for "New" badges
- **Tertiary**: Purple/blue for "Unqualified" badges
- **Borders**: Light gray (`--border`)
- **Text**: Dark gray for primary, lighter gray for secondary

### Typography
- **Headings**: Medium weight (500)
- **Body text**: Regular weight (400)
- **Labels**: Small, uppercase with spacing
- **Numbers**: Prominent for metrics

### Component Specifications

#### Metrics Cards
- Display: Total contacts (1,536), Active contacts (1,142), Recent activity (82%), Date health (85%)
- Each card includes:
  - Label (muted, small text)
  - Large number/percentage
  - Small trend indicator (+2 from last month, etc.)
  - Mini line chart (4-5 data points)
  
#### Data Table
- **Columns**: 
  1. Checkbox (selection)
  2. Name
  3. Job title  
  4. Email
  5. Department
  6. Location
  7. Current status (badge)

- **Sample Data** (from image):
  - Amelia Evans | Glacé & Glam | LH Researcher | Napolje Falls | Active
  - Isabella Carter | Agua Coral | Project Manager | Louisville | Active
  - Benjamin Taylor | Extra Media | Software Developer | Troy | Active
  - Ava Williams | Unidesk | Customer Success Specialist | Unqualified
  - Emma Collins | TrendForce | Project Manager | Bradeview | Active
  - Jacob Anderson | Lightware | Operations Coordinator | Erica Forks | Active
  - Isabella Stewart | LaraCore | Marketing Coordinator | Birgittalyn | Active
  - Ava Parker | Creative Edge | Lead Analyst | Rochester | New
  - Liam Parker | Sports Edge | Lead Analyst | Rochester | New
  - Mia Johnson | Vera Loops | Product Developer | Lake Ricardo | Active
  - Mason Brooks | Embler Solutions | Data Analyst | Shermandale | Active
  - Noah Wilson | Enrichment Systems | Product Owner | West Rancho | Unqualified
  - Oliver Sutton | Neuralflow | Product Owner | West Rancho | Unqualified

- **Status Badge Variants**:
  - Active: Green background
  - New: Gray background  
  - Unqualified: Purple/blue background

#### Sidebar Navigation Items
- Dashboard (active/selected)
- Quick actions
- My hub
- Contacts (with dropdown)
  - All
  - Dashboard
  - Email
  - Analytics
  - Reports & reports
  - Documents
- Members
- Tasks
- Team management (collapsible section)
  - Entity Data (with expand icon)

#### Pagination
- Format: "Contacts 1-10 of 195"
- Previous/Next buttons
- Page number selector
- Rows per page selector

## Critical Files

### Primary Implementation
- `/workspaces/default/code/src/app/App.tsx` - Main application component

### Component Imports (already available)
- `/workspaces/default/code/src/app/components/ui/sidebar.tsx` - Sidebar navigation
- `/workspaces/default/code/src/app/components/ui/table.tsx` - Data table
- `/workspaces/default/code/src/app/components/ui/button.tsx` - Buttons
- `/workspaces/default/code/src/app/components/ui/badge.tsx` - Status badges
- `/workspaces/default/code/src/app/components/ui/card.tsx` - Metric cards
- `/workspaces/default/code/src/app/components/ui/checkbox.tsx` - Table row selection
- `/workspaces/default/code/src/app/components/ui/input.tsx` - Search input
- `/workspaces/default/code/src/app/components/ui/pagination.tsx` - Table pagination
- `/workspaces/default/code/src/app/components/ui/chart.tsx` - Line charts for metrics
- `/workspaces/default/code/src/app/components/ui/separator.tsx` - Visual dividers

### Styling
- `/workspaces/default/code/src/styles/theme.css` - Design tokens (already configured)

## Implementation Approach

### 1. Application Shell
Build the main layout structure in `App.tsx`:
- Wrap entire app in `SidebarProvider` for sidebar state management
- Create left sidebar with navigation items
- Create main content area with proper spacing

### 2. Sidebar Navigation
Using the existing `Sidebar` component from `/workspaces/default/code/src/app/components/ui/sidebar.tsx`:
- Logo/brand at top ("Databolt" with icon)
- Navigation menu with icons (use `lucide-react` for icons)
- Collapsible sections for grouped items
- Active state styling for selected "Dashboard" item
- Footer with user profile section
- Mobile responsive with collapse toggle

### 3. Top Metrics Dashboard
Create metric cards showing:
- Total contacts: 1,536 (+2 from last month)
- Active contacts: 1,142 (+2 from last month)  
- Recent activity: 82% (+2 from last month)
- Date health: 85% (+2 from last month)

Each card includes:
- `Card` component from ui library
- Label, value, trend indicator
- Mini `LineChart` from Recharts showing 4-5 data points
- Use `--chart-1`, `--chart-2`, etc. color tokens

### 4. Filters Section
- Search input with icon (use `Input` component)
- "Filters" button with filter icon
- "Customize" button
- Proper spacing and alignment

### 5. Data Table
Using `Table` component with:
- Header row with column titles
- `Checkbox` in first column for row selection
- Status badges using `Badge` component with custom variants:
  - `variant="default"` styled green for "Active"
  - `variant="secondary"` styled gray for "New"  
  - Custom variant styled purple for "Unqualified"
- Sample data matching the screenshot (13 visible rows)
- Hover states on rows
- Proper cell padding and alignment

### 6. Pagination
Using `Pagination` component:
- Display "Contacts 1-10 of 195"
- Previous/Next navigation
- Page numbers
- Rows per page selector (dropdown)

### 7. Responsive Behavior
- Sidebar collapses on mobile
- Table becomes horizontally scrollable on small screens
- Metric cards stack vertically on mobile

## Data Structure

Create mock data arrays for:

```typescript
// Contact data
interface Contact {
  id: string;
  name: string;
  jobTitle: string;
  email: string;
  department: string;
  location: string;
  status: 'Active' | 'New' | 'Unqualified';
}

// Metrics data
interface Metric {
  label: string;
  value: string | number;
  change: string;
  chartData: { value: number }[];
}
```

## Styling Specifications

### Exact Measurements from Design
- **Sidebar width**: ~240px (expanded), ~60px (collapsed)
- **Content padding**: 24px
- **Metric card spacing**: 16px gap between cards
- **Table row height**: ~52px
- **Border radius**: Use `--radius` token (appears to be ~6-8px)
- **Font sizes**:
  - Metric values: Large (2xl)
  - Table text: Base (sm)
  - Labels: xs with muted foreground

### Color Matching
Use existing theme tokens where possible:
- Background: `bg-background`
- Sidebar: `bg-sidebar`
- Borders: `border-border`
- Muted text: `text-muted-foreground`
- Primary text: `text-foreground`

Custom badge colors (add to Badge variants):
```css
.badge-active {
  background: hsl(142.1 76.2% 36.3%);
  color: white;
}
.badge-new {
  background: hsl(210 40% 96.1%);
  color: hsl(222.2 47.4% 11.2%);
}
.badge-unqualified {
  background: hsl(221 83% 53%);
  color: white;
}
```

## State Management

Use React `useState` for:
- Selected rows (checkboxes)
- Sidebar collapsed state
- Current page
- Search query
- Active filters

No complex state management needed - keep it simple with local state.

## Icon Usage

Use `lucide-react` icons matching the design:
- Home icon for Dashboard
- Zap icon for Quick actions  
- Layout icon for My hub
- Users icon for Contacts
- Calendar icon for Tasks
- Settings icon for configuration
- Search icon for search input
- Filter icon for filters button
- ChevronDown for expandable sections
- ChevronRight for collapsed sections
- MoreHorizontal for actions menu

## Verification Steps

After implementation:

1. **Visual Comparison**
   - Compare side-by-side with the original design image
   - Check spacing, sizes, colors match exactly
   - Verify font weights and sizes
   - Confirm icon sizes and positions

2. **Functional Testing**
   - Sidebar collapse/expand works
   - Checkboxes select/deselect rows
   - Pagination navigation works
   - Search input accepts text
   - Hover states display correctly

3. **Responsive Testing**
   - Test on mobile viewport (sidebar collapses)
   - Verify table scrolls horizontally on small screens
   - Confirm metric cards stack properly

4. **Accessibility**
   - Keyboard navigation works
   - Screen reader labels are present
   - Color contrast meets WCAG standards

5. **Dev Server Check**
   - Start dev server (already running)
   - View in browser
   - Check console for errors
   - Verify charts render correctly

## Component Reuse Strategy

All components are imported from the existing UI library:
- DO NOT create custom table, sidebar, or form components
- Use the pre-built Shadcn/ui components from `/workspaces/default/code/src/app/components/ui/`
- Only create application-specific components (e.g., MetricCard, ContactRow) that compose the UI primitives
- Leverage existing design tokens from `theme.css`

## Expected Outcome

A pixel-perfect recreation of the provided design with:
- Fully functional sidebar navigation with collapsible state
- Four metric cards with mini line charts
- Searchable, filterable data table with 13 sample contacts
- Working pagination controls
- Proper status badges with color coding
- Responsive layout that works on all screen sizes
- Clean, maintainable code using existing component library
