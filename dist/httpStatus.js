"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpCodeStatus = void 0;
var httpCodeStatus;
(function (httpCodeStatus) {
    httpCodeStatus[httpCodeStatus["OK"] = 200] = "OK";
    httpCodeStatus[httpCodeStatus["CREATED"] = 201] = "CREATED";
    httpCodeStatus[httpCodeStatus["NOT_FOUND"] = 404] = "NOT_FOUND";
    httpCodeStatus[httpCodeStatus["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    httpCodeStatus[httpCodeStatus["NOT_AUTHENTICATED"] = 401] = "NOT_AUTHENTICATED";
    httpCodeStatus[httpCodeStatus["NOT_AUTHORIZED"] = 403] = "NOT_AUTHORIZED";
    httpCodeStatus[httpCodeStatus["NO_CONTENT"] = 204] = "NO_CONTENT";
    httpCodeStatus[httpCodeStatus["INTERNAL_SERVER_ERROR"] = 500] = "INTERNAL_SERVER_ERROR";
})(httpCodeStatus || (exports.httpCodeStatus = httpCodeStatus = {}));
