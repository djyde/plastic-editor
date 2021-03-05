import { InMemoryAdapter } from "../editor/adapters/InMemory";
import adapter from "./adapter";

class AppService {
  constructor(public adapter: InMemoryAdapter) {}
}

export default new AppService(adapter)
