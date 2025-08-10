#!/usr/bin/env node
import { FastMCP } from "fastmcp";
import { z } from "zod";

const BASEURL = "https://api.ganjinex.com";
const TOKEN = process.argv[2];

if (!TOKEN) {
  console.error("Error: TOKEN is required");
  process.exit(1);
}

const BASEHEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
  "X-Token": TOKEN,
};

const server = new FastMCP({
  name: "Ganjinex",
  version: "1.0.0",
});

server.addTool({
  name: "get_currencies",
  description: "Fetch cryptocurrency data from the currencies API",
  parameters: z.object({}),
  execute: async () => {
    const response = await fetch(`${BASEURL}/currencies`, {
      mode: "cors",
      headers: BASEHEADERS,
    });

    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${response.status} - ` + (await response.text())
      );
    }

    return response.text();
  },
});

server.addTool({
  name: "get_asset_list",
  description:
    "Fetch asset list with optional type filter (spot, futures, etc.)",
  parameters: z.object({
    type: z
      .string()
      .optional()
      .default("spot")
      .describe("Asset type filter (e.g., 'spot', 'futures')"),
  }),
  execute: async (params) => {
    const { type = "spot" } = params || {};
    const url = new URL(`${BASEURL}/v1/asset/index`);
    url.searchParams.append("type", type);

    const response = await fetch(url.toString(), {
      mode: "cors",
      headers: BASEHEADERS,
    });

    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${response.status} - ` + (await response.text())
      );
    }

    return response.text();
  },
});

server.addTool({
  name: "create_spot_order",
  description: "Create a new spot trading order",
  parameters: z.object({
    symbol: z.string().describe("Trading symbol (e.g., 'BTC')"),
    pair: z.string().describe("Trading pair (e.g., 'IRT')"),
    type: z.enum(["buy", "sell"]).describe("Order type ('buy' or 'sell')"),
    order_type: z
      .enum(["market", "limit"])
      .describe("Order execution type ('market' or 'limit')"),
    price: z
      .number()
      .describe(
        "Order price (required for limit orders) - 0 for market orders"
      ),
    amount: z
      .number()
      .describe(
        "Order amount in pair currency (e.g., for ETH/USDT, amount should be in USDT - if you want $10 worth of ETH, enter 10)"
      ),
  }),
  execute: async (params) => {
    const { symbol, pair, type, order_type, price, amount } = params;

    const response = await fetch(`${BASEURL}/v1/order/spot`, {
      method: "POST",
      mode: "cors",
      headers: BASEHEADERS,
      body: JSON.stringify({
        symbol,
        pair,
        type,
        order_type,
        price: price.toString(),
        amount,
      }),
    });

    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${response.status} - ` + (await response.text())
      );
    }

    return response.text();
  },
});

server.addTool({
  name: "delete_order",
  description: "Delete an existing order by ID",
  parameters: z.object({
    id: z.number().describe("Order ID to delete"),
  }),
  execute: async (params) => {
    const { id } = params;

    const response = await fetch(`${BASEURL}/v1/order/delete`, {
      method: "DELETE",
      mode: "cors",
      headers: BASEHEADERS,
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${response.status} - ` + (await response.text())
      );
    }

    return response.text();
  },
});

server.addTool({
  name: "get_order_history",
  description: "Fetch order history with optional filters",
  parameters: z.object({
    symbol: z.string().optional().describe("Trading symbol filter"),
    pair: z.string().optional().describe("Trading pair filter"),
    order_type: z.string().optional().default("").describe("Order type filter"),
    active: z
      .number()
      .optional()
      .default(1)
      .describe("Active status filter (0 or 1)"),
    convert: z
      .number()
      .optional()
      .default(0)
      .describe("Include convert currency (0 or 1)"),
    page: z.number().describe("Page number for pagination"),
  }),
  execute: async (params) => {
    const { symbol, pair, order_type, active, convert, page } = params || {};
    const url = new URL(`${BASEURL}/v1/order/orderHistory`);

    if (symbol) url.searchParams.append("symbol", symbol);
    if (pair) url.searchParams.append("pair", pair);
    url.searchParams.append("order_type", order_type);
    if (active !== undefined)
      url.searchParams.append("active", active.toString());
    url.searchParams.append("convert", String(convert));
    if (page !== undefined) url.searchParams.append("page", page.toString());

    const response = await fetch(url.toString(), {
      mode: "cors",
      headers: BASEHEADERS,
    });

    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${response.status} - ${url.toString()}  - ` +
          (await response.text())
      );
    }

    return response.text();
  },
});

server.addTool({
  name: "get_user_cards",
  description: "Fetch user's bank cards",
  parameters: z.object({}),
  execute: async () => {
    const response = await fetch(`${BASEURL}/v1/bank/getUserCards`, {
      mode: "cors",
      headers: BASEHEADERS,
    });

    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${response.status} - ` + (await response.text())
      );
    }

    return response.text();
  },
});

server.addTool({
  name: "add_user_bank",
  description: "Add a new bank card for the user",
  parameters: z.object({
    card_number: z.string().describe("Bank card number"),
  }),
  execute: async (params) => {
    const { card_number } = params;

    const response = await fetch(`${BASEURL}/v1/bank/addUserBank`, {
      method: "POST",
      mode: "cors",
      headers: BASEHEADERS,
      body: JSON.stringify({ card_number }),
    });

    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${response.status} - ` + (await response.text())
      );
    }

    return response.text();
  },
});

server.addTool({
  name: "delete_user_card",
  description: "Delete a user's bank card by ID",
  parameters: z.object({
    id: z.number().describe("Bank card ID to delete"),
  }),
  execute: async (params) => {
    const { id } = params;

    const response = await fetch(`${BASEURL}/v1/bank/deleteUserCard`, {
      method: "DELETE",
      mode: "cors",
      headers: BASEHEADERS,
      body: JSON.stringify({ id }),
    });

    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${response.status} - ` + (await response.text())
      );
    }

    return response.text();
  },
});

server.addTool({
  name: "get_watch_list",
  description: "Fetch user's watchlist symbols",
  parameters: z.object({}),
  execute: async () => {
    const response = await fetch(`${BASEURL}/v1/asset/getWatchList`, {
      mode: "cors",
      headers: BASEHEADERS,
    });

    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${response.status} - ` + (await response.text())
      );
    }

    return response.text();
  },
});

server.addTool({
  name: "add_to_watch_list",
  description: "Add a symbol to user's watchlist",
  parameters: z.object({
    symbol: z.string().describe("Trading symbol to add to watchlist"),
  }),
  execute: async (params) => {
    const { symbol } = params;

    const response = await fetch(`${BASEURL}/v1/asset/addToWatchList`, {
      method: "POST",
      mode: "cors",
      headers: BASEHEADERS,
      body: JSON.stringify({ symbol }),
    });

    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${response.status} - ` + (await response.text())
      );
    }

    return response.text();
  },
});

server.addTool({
  name: "delete_from_watch_list",
  description: "Remove a symbol from user's watchlist",
  parameters: z.object({
    symbol: z.string().describe("Trading symbol to remove from watchlist"),
  }),
  execute: async (params) => {
    const { symbol } = params;

    const response = await fetch(`${BASEURL}/v1/asset/deleteFromWatchList`, {
      method: "DELETE",
      mode: "cors",
      headers: BASEHEADERS,
      body: JSON.stringify({ symbol }),
    });

    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${response.status} - ` + (await response.text())
      );
    }

    return response.text();
  },
});

server.addTool({
  name: "withdraw",
  description: "Create a withdrawal request",
  parameters: z.object({
    amount: z.number().describe("Withdrawal amount"),
    network: z.string().describe("Network for withdrawal"),
    target_address: z.string().describe("Target address for withdrawal"),
    tag: z.string().optional().describe("Optional tag for withdrawal"),
    symbol: z.string().describe("Symbol to withdraw"),
  }),
  execute: async (params) => {
    const { amount, network, target_address, tag, symbol } = params;

    const body: any = {
      amount,
      network,
      target_address,
      symbol,
    };

    if (tag) {
      body.tag = tag;
    }

    const response = await fetch(`${BASEURL}/v1/accounting/withdraw`, {
      method: "POST",
      mode: "cors",
      headers: BASEHEADERS,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${response.status} - ` + (await response.text())
      );
    }

    return response.text();
  },
});

server.addTool({
  name: "settle",
  description: "Create a settlement request",
  parameters: z.object({
    amount: z.number().describe("Settlement amount"),
    card_id: z.number().describe("Bank card ID for settlement"),
    two_factor_secret: z.string().describe("Two-factor authentication secret"),
  }),
  execute: async (params) => {
    const { amount, card_id, two_factor_secret } = params;

    const response = await fetch(`${BASEURL}/v1/accounting/settle`, {
      method: "POST",
      mode: "cors",
      headers: BASEHEADERS,
      body: JSON.stringify({ amount, card_id, two_factor_secret }),
    });

    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${response.status} - ` + (await response.text())
      );
    }

    return response.text();
  },
});

server.addTool({
  name: "get_wallet_address",
  description:
    "Get wallet address for a specific symbol and network to deposit crypto currency",
  parameters: z.object({
    symbol: z.string().describe("Trading symbol"),
    network: z.string().describe("Network name"),
  }),
  execute: async (params) => {
    const { symbol, network } = params;

    const response = await fetch(`${BASEURL}/v1/wallet/getWalletAddress`, {
      method: "POST",
      mode: "cors",
      headers: BASEHEADERS,
      body: JSON.stringify({ symbol, network }),
    });

    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${response.status} - ` + (await response.text())
      );
    }

    return response.text();
  },
});

server.addTool({
  name: "charge_irt",
  description: "Charge IRT to account using bank card",
  parameters: z.object({
    amount: z.number().describe("Amount to charge"),
    card_id: z.number().describe("Bank card ID to use for charging"),
  }),
  execute: async (params) => {
    const { amount, card_id } = params;

    const response = await fetch(`${BASEURL}/v1/accounting/chargeIrt`, {
      method: "POST",
      mode: "cors",
      headers: BASEHEADERS,
      body: JSON.stringify({ amount, card_id }),
    });

    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${response.status} - ` + (await response.text())
      );
    }

    return response.text();
  },
});

server.start({
  transportType: "stdio",
});
