# Welcome to Remix + Vite!

📖 See the [Remix docs](https://remix.run/docs) and the [Remix Vite docs](https://remix.run/docs/en/main/future/vite) for details on supported features.

## Setup

1. Clone the repository
2. Install dependencies:
```sh
npm install
```
3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the following variables:
     - `NEO4J_HOST`: Neo4j database host
     - `NEO4J_PORT`: Neo4j database port
     - `NEO4J_USER`: Neo4j username
     - `NEO4J_PASS`: Neo4j password
     - `PORT`: Application port

## Development

Run the Express server with Vite dev middleware:

```sh
npm run dev
```

## Building for Production

1. Ensure environment variables are properly set
2. Build the application:
```sh
npm run build
```

The build output will be generated in:
- `build/server` - Server-side code
- `build/client` - Client-side assets

## Running in Production

Start the production server:

```sh
npm start
```

## Deployment

### Manual Deployment

1. Copy the following to your deployment server:
   - `build/` directory
   - `package.json`
   - `package-lock.json`
   - `.env` (configured for production)

2. On the deployment server:
   ```sh
   npm install --production
   npm start
   ```

## Troubleshooting

- Ensure all environment variables are properly set
- Check Neo4j connection if database-related errors occur
- Verify network ports are available
