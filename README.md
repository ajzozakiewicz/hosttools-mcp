# @ajz/hosttools-mcp

A free and open source MCP server for the [Host Tools](https://hosttools.com) platform.

## Setup

### 1. Install & Build

```bash
npm install
npm run build
```

### 2. Configure your MCP client

Add to your MCP client config (e.g. Claude Desktop `~/.config/Claude/claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "hosttools": {
      "command": "node",
      "args": ["/path/to/hosttools-mcp/dist/index.js"]
    }
  }
}
```

No environment variables required.

### 3. Authenticate

Call the **`auth_login`** tool. It will:
1. Dynamically register an OAuth client with Host Tools (once — persisted to `~/.config/hosttools-mcp/client.json`)
2. Return a browser URL for you to open and approve
3. Complete automatically after you authorize, saving tokens to `~/.config/hosttools-mcp/tokens.json`

Access tokens auto-refresh using the stored refresh token (no re-login needed for 30 days).

## Tools

### Auth
| Tool | Description |
|------|-------------|
| `auth_login` | Start OAuth flow, open returned URL in browser |
| `auth_status` | Check token status and expiry |
| `auth_logout` | Delete stored tokens |

### Listings
| Tool | Description |
|------|-------------|
| `get_listings` | List all active listings |
| `get_listing` | Get a listing by ID |
| `get_calendar` | Get per-date pricing and availability |
| `set_prices` | Set per-date price overrides |

### Reservations
| Tool | Description |
|------|-------------|
| `get_reservations` | Get reservations for a listing in a date range |
| `get_reservation` | Get a single reservation by ID |
| `create_reservation` | Create a direct reservation |
| `update_reservation` | Update guest info, times, access codes |
| `cancel_reservation` | Cancel a direct reservation |
| `get_pricing_quote` | Get a pricing quote for dates |

### Messaging & Reviews
| Tool | Description |
|------|-------------|
| `send_message` | Send a message to a guest |
| `get_reviews` | Get Airbnb reviews for a listing |


## Stored Files

| File | Purpose |
|------|---------|
| `~/.config/hosttools-mcp/client.json` | Registered OAuth client credentials |
| `~/.config/hosttools-mcp/tokens.json` | Access + refresh tokens (chmod 600) |
