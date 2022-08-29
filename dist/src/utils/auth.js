"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeAuthHeader = exports.APP_SECRET = void 0;
const jwt = require("jsonwebtoken");
exports.APP_SECRET = "GraphQL-is-aw3some";
function decodeAuthHeader(authHeader) {
    const token = authHeader.replace("Bearer ", "");
    if (!token) {
        throw new Error("No token found");
    }
    return jwt.verify(token, exports.APP_SECRET);
}
exports.decodeAuthHeader = decodeAuthHeader;
//# sourceMappingURL=auth.js.map