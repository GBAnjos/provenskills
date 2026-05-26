// Only export browser client from index
// Server client should be imported directly from ./server
export { createClient as createBrowserClient } from "./client";
