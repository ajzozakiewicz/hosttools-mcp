#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ApiError } from "./api/client.js";
import { getValidAccessToken } from "./auth/tokens.js";
import { readClient, readTokens } from "./auth/storage.js";
import { DEFAULT_CALLBACK_PORT } from "./auth/flow.js";

// Tool Imports
import * as AuthLogin from "./tools/auth-login.js";
import * as AuthStatus from "./tools/auth-status.js";
import * as AuthLogout from "./tools/auth-logout.js";
import * as GetListings from "./tools/get-listings.js";
import * as GetListing from "./tools/get-listing.js";
import * as GetCalendar from "./tools/get-calendar.js";
import * as SetPrices from "./tools/set-prices.js";
import * as GetReservations from "./tools/get-reservations.js";
import * as GetReservation from "./tools/get-reservation.js";
import * as CreateReservation from "./tools/create-reservation.js";
import * as UpdateReservation from "./tools/update-reservation.js";
import * as CancelReservation from "./tools/cancel-reservation.js";
import * as GetPricingQuote from "./tools/get-pricing-quote.js";
import * as SendMessage from "./tools/send-message.js";
import * as GetReviews from "./tools/get-reviews.js";

function makeGetToken() {
  return async (): Promise<string> => {
    const client = readClient();
    if (!client) {
      throw new Error("Not authenticated. Use the auth_login tool to connect your Host Tools account.");
    }
    return getValidAccessToken(client);
  };
}

const getToken = makeGetToken();

const server = new McpServer({
  name: "hosttools-mcp",
  version: "1.0.0",
});

type ToolResult = { content: Array<{ type: "text"; text: string }>; isError?: boolean };

function wrap<TInput>(
  handler: (input: TInput) => Promise<ToolResult>
): (input: TInput) => Promise<ToolResult> {
  return async (input: TInput): Promise<ToolResult> => {
    try {
      return await handler(input);
    } catch (err) {
      if (err instanceof ApiError) {
        return {
          content: [{
            type: "text" as const,
            text: JSON.stringify({ error: err.message, status: err.status, detail: err.body }),
          }],
          isError: true,
        };
      }
      return {
        content: [{ type: "text" as const, text: `Error: ${String(err)}` }],
        isError: true,
      };
    }
  };
}

// Auth tools
server.tool("auth_login", "Start the OAuth flow. Returns a browser URL to authorize access. Completes automatically after you approve in the browser.", AuthLogin.schema.shape, wrap((i) => AuthLogin.handler(i)));
server.tool("auth_status", "Check whether you are currently authenticated and when the access token expires.", AuthStatus.schema.shape, wrap((i) => AuthStatus.handler(i)));
server.tool("auth_logout", "Revoke the stored access tokens and log out.", AuthLogout.schema.shape, wrap((i) => AuthLogout.handler(i)));

// Listing tools
server.tool("get_listings", "List all active listings. Optionally filter by availability date range.", GetListings.schema.shape, wrap((i) => GetListings.handler(i, getToken)));
server.tool("get_listing", "Get detailed information for a specific listing.", GetListing.schema.shape, wrap((i) => GetListing.handler(i, getToken)));
server.tool("get_calendar", "Get per-date pricing and availability for a listing within a date range.", GetCalendar.schema.shape, wrap((i) => GetCalendar.handler(i, getToken)));
server.tool("set_prices", "Set per-date price overrides for a listing.", SetPrices.schema.shape, wrap((i) => SetPrices.handler(i, getToken)));

// Reservation tools
server.tool("get_reservations", "Get all reservations for a listing within a date range.", GetReservations.schema.shape, wrap((i) => GetReservations.handler(i, getToken)));
server.tool("get_reservation", "Get a single reservation by ID.", GetReservation.schema.shape, wrap((i) => GetReservation.handler(i, getToken)));
server.tool("create_reservation", "Create a new internal/direct reservation.", CreateReservation.schema.shape, wrap((i) => CreateReservation.handler(i, getToken)));
server.tool("update_reservation", "Update guest info, check-in/out times, notes, or access codes on a reservation.", UpdateReservation.schema.shape, wrap((i) => UpdateReservation.handler(i, getToken)));
server.tool("cancel_reservation", "Cancel an internal or direct reservation.", CancelReservation.schema.shape, wrap((i) => CancelReservation.handler(i, getToken)));
server.tool("get_pricing_quote", "Calculate a pricing quote for given dates including fees, taxes, and availability.", GetPricingQuote.schema.shape, wrap((i) => GetPricingQuote.handler(i, getToken)));

// Messaging tools
server.tool("send_message", "Send a message to a guest for a specific reservation.", SendMessage.schema.shape, wrap((i) => SendMessage.handler(i, getToken)));

// Reviews tools
server.tool("get_reviews", "Get Airbnb reviews for a listing.", GetReviews.schema.shape, wrap((i) => GetReviews.handler(i, getToken)));

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  const hasTokens = Boolean(readTokens());
  process.stderr.write(
    `[hosttools-mcp] Server started (OAuth callback port: ${DEFAULT_CALLBACK_PORT}). ${hasTokens ? "Authenticated — token present." : "Not authenticated — run auth_login."}\n`
  );
}

main().catch((err) => {
  process.stderr.write(`[hosttools-mcp] Fatal error: ${String(err)}\n`);
  process.exit(1);
});
