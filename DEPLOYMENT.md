# Deployment

## Internal IIS/static web site
Copy the full contents of this folder to the web root or virtual directory. Make sure `.json`, `.js`, `.css`, `.svg`, `.woff` and `.woff2` static content is allowed by the server.

The application uses relative paths, so both of these patterns are valid:
- `https://test.example.fo/hagvarp/`
- `https://example.fo/internal/hagvarp/`

No server-side runtime is required.

## GitHub Pages/test hosting
The included `.nojekyll` file makes the repository suitable for direct static publishing. Publish the repository root (or this folder as the Pages root). Relative URLs allow it to work under a repository path.

## External/live services used by Hagvarp
The browser still needs network access to the Hagstova Statbank API, the internal publication calendar API and analytics endpoint used by the existing Hagvarp implementation.
