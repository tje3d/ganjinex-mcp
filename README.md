# Ganjinex MCP Server

An unofficial MCP (Model Context Protocol) server for [Ganjinex.com](https://ganjinex.com) cryptocurrency exchange. This server provides AI assistants with the ability to interact with Ganjinex trading APIs.

## Installation

The package is published on [npmjs.com](https://npmjs.com) as `ganjinex-mcp` and should be run using `bunx`.

### Claude Desktop

Add to your Claude Desktop configuration file:

**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`
**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "ganjinex": {
      "command": "bunx",
      "args": ["ganjinex-mcp", "YOUR_API_TOKEN"]
    }
  }
}
```

### Cursor IDE / Trae / Windsurf

Add to your MCP configuration:

```json
{
  "mcpServers": {
    "ganjinex": {
      "command": "bunx",
      "args": ["ganjinex-mcp", "YOUR_API_TOKEN"]
    }
  }
}
```

## Authentication

You need to provide your Ganjinex API token as the first argument. Get your API token from your Ganjinex account settings.

## Available Tools

This MCP server provides the following tools for interacting with Ganjinex:

### Market Data
- **get_currencies** - Fetch cryptocurrency data from the currencies API
- **get_asset_list** - Fetch asset list with optional type filter (spot, futures, etc.)

### Trading
- **create_spot_order** - Create a new spot trading order (buy/sell, market/limit)
- **delete_order** - Delete an existing order by ID
- **get_order_history** - Fetch order history with optional filters

### Wallet & Banking
- **get_user_cards** - Fetch user's bank cards
- **add_user_bank** - Add a new bank card for the user
- **delete_user_card** - Delete a user's bank card by ID
- **get_wallet_address** - Get wallet address for deposits (specific symbol and network)
- **withdraw** - Create a withdrawal request
- **settle** - Create a settlement request
- **charge_irt** - Charge IRT to account using bank card

### Watchlist
- **get_watch_list** - Fetch user's watchlist symbols
- **add_to_watch_list** - Add a symbol to user's watchlist
- **delete_from_watch_list** - Remove a symbol from user's watchlist

## Usage Example

Once configured, you can ask your AI assistant to:
- "Show me my current watchlist"
- "Buy 100 USDT worth of Bitcoin at market price"
- "Check my order history"
- "Get my wallet address for USDT deposits"
- "Add Ethereum to my watchlist"

## Security Note

⚠️ **Important:** This is an unofficial server. Always verify API calls and never share your API tokens. Use at your own risk.

## Requirements

- [Bun](https://bun.sh) runtime
- Valid Ganjinex API token
- MCP-compatible client (Claude Desktop, Cursor, etc.)

## License

MIT