"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.schema = void 0;
const nexus_1 = require("nexus");
const path_1 = require("path");
const types = require("./graphql");
exports.schema = (0, nexus_1.makeSchema)({
    types,
    outputs: {
        typegen: (0, path_1.join)(process.cwd(), "nexus-typegen.ts"),
        schema: (0, path_1.join)(process.cwd(), "schema.graphql"),
    },
    contextType: {
        module: (0, path_1.join)(process.cwd(), "./src/context.ts"),
        export: "Context",
    },
});
//# sourceMappingURL=schema.js.map