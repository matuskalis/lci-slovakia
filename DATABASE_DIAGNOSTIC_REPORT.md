# LCI-SK Database & Code Diagnostic Report
**Generated:** 2025-01-26
**Database Project:** tintxajnzqamsgjeplsk (lci-fresh)

## Database Information

### Connection Details
- **Project ID:** tintxajnzqamsgjeplsk
- **Project URL:** https://tintxajnzqamsgjeplsk.supabase.co
- **Region:** EU Central (Frankfurt)
- **Status:** Active
- **RLS:** Disabled (for debugging)

### Database Schema

#### `blogs` Table (Slovak-only, simple structure)
\`\`\`sql
CREATE TABLE blogs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  image_url TEXT,
  published BOOLEAN DEFAULT false,
  category TEXT DEFAULT 'Ochrana',
  author TEXT DEFAULT 'Admin',
  excerpt TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
\`\`\`

**Current Data:** 3 blog posts (all published)
- ochrana-medveda-hnedeho
- vlk-dravy-navrat
- rys-ostrovid

#### `photos` Table
\`\`\`sql
CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  filename TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  public_url TEXT NOT NULL,
  category TEXT CHECK (category IN ('medved', 'vlk', 'rys', 'other')),
  description TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
\`\`\`

**Current Data:** 9 photos (3 medved, 3 vlk, 3 rys)

### RLS Policies
Currently DISABLED for debugging. All data is publicly accessible.

## Code Configuration

### Supabase Client Files
All files correctly point to `tintxajnzqamsgjeplsk.supabase.co`:

1. **lib/supabase/client.ts** - Browser client (CORRECT)
2. **lib/supabase/server.ts** - Server client (CORRECT)
3. **lib/supabase-config.ts** - Admin client (CORRECT)
4. **app/galeria/page.tsx** - Gallery page (CORRECT)
5. **.env.local** - Environment variables (NOW UPDATED)

### Admin Dashboard

**Location:** `/admin/dashboard`
**Login:** Password = "LciSk2025"

**Server Actions** (app/admin/dashboard/actions.ts):
- `getAllBlogs()` - Fetches all blogs
- `createBlog(formData)` - Creates new blog
- `updateBlog(id, formData)` - Updates existing blog
- `deleteBlog(id)` - Deletes blog
- `togglePublish(id, published)` - Publishes/unpublishes blog

**Blog Manager** (app/admin/dashboard/blog-manager.tsx):
- Imports server actions from `./actions`
- Provides UI for creating, editing, deleting blogs
- Includes publish/unpublish toggle
- Simple Slovak-only form (title required, all else optional)

### API Routes
- **app/blog/page.tsx** - Lists all published blogs
- **app/blog/[slug]/page.tsx** - Individual blog post display
- **app/galeria/page.tsx** - Photo gallery by category
- **app/page.tsx** - Homepage with latest blogs

## Known Issues Fixed

1. ✅ Database schema mismatch - Added missing `category`, `author`, `excerpt` columns
2. ✅ RLS blocking access - Disabled temporarily for debugging
3. ✅ Wrong table name - Changed `blog_posts` to `blogs` everywhere
4. ✅ Photos column mismatch - Changed `created_at` to `uploaded_at`
5. ✅ Blog manager imports - Fixed to import from correct `./actions` file
6. ✅ Environment variables - Updated anon key to current version

## How to Use for Debugging

### Test Blog Editing
1. Navigate to `/admin/login`
2. Enter password: `LciSk2025`
3. Go to Admin Dashboard
4. Try creating/editing/deleting a blog post

### Check Database Directly
\`\`\`sql
-- See all blogs
SELECT id, slug, title, category, published FROM blogs;

-- See all photos
SELECT id, filename, category, description FROM photos;

-- Check if RLS is enabled
SELECT tablename, rowsecurity FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('blogs', 'photos');
\`\`\`

### Common Errors to Watch For
- "column does not exist" - Schema mismatch
- "Neautorizovany pristup" - RLS policy blocking
- "relation does not exist" - Wrong table name
- Connection errors - Wrong Supabase URL/key

## Next Steps

1. Test blog editing functionality
2. If working, re-enable RLS with proper policies
3. Add image upload functionality using Supabase Storage
4. Create proper authentication for admin users
