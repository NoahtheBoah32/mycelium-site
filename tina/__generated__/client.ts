import { createClient } from "tinacms/dist/client";
import { queries } from "./types.ts";
export const client = createClient({ cacheDir: 'C:/Users/User/Documents/CLAUDE CODE/mycelium/tina/__generated__/.cache/1778408583291', url: 'http://localhost:4001/graphql', token: '', queries,  });
export default client;
  