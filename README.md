# Deeplink Management Tool

A TypeScript-based tool built with Bun for batch processing and generating deep links for movies and TV shows. This tool takes a list of titles from an input file, searches for them via an API, and generates administrative deep links along with a convenient launch script.

## Features

- Batch processing of movie/show titles
- API integration for content search
- Generates administrative deep links
- Creates a JavaScript launch script for opening multiple links
- Supports both movies and TV shows
- Environment-based configuration

## Prerequisites

- [Bun](https://bun.sh/) runtime
- Node.js environment
- API access token (configured in `.env`)

## Setup

1. Install dependencies:
```bash
bun install
```

2. Configure the `.env` file with your credentials:
```env
baseUrl=api-services.freecast
stagingUrl=stvstaging.freecast
searchVersion=v5
token=your_api_token
```

3. Place your input titles in `inputSample/input.json` (one title per line)

## Usage

Run the tool with one of the following commands:

```bash
# For movies
bun run start:movie

# For TV shows
bun run start:series
```

The tool will:
1. Read titles from `inputSample/input.json`
2. Search for each title via the API
3. Generate administrative deep links
4. Create a launch script for batch opening links
5. Save results to `outputSample/output.json`

## Output

The tool generates a JSON file containing:
- Unique ID for each item
- Slug ID from the API
- Title
- Slug
- Administrative deep link
- JavaScript launch script for opening all links

## Environment Variables

- `baseUrl`: Base URL for the API
- `stagingUrl`: Staging URL for administrative interface
- `searchVersion`: API version
- `token`: API authentication token
