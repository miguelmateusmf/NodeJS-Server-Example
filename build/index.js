"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const url_1 = __importDefault(require("url"));
function requestListener(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const parsedUrl = url_1.default.parse(req.url || "");
        let data = "";
        let statusCode = 200;
        try {
            let pathName = parsedUrl.pathname;
            if (pathName === "/")
                pathName = "/index";
            const filePath = path_1.default.join(__dirname, `static${pathName}.html`);
            data = yield promises_1.default.readFile(filePath, "utf-8");
        }
        catch (_a) {
            data = yield promises_1.default.readFile(path_1.default.join(__dirname, "static/404.html"), "utf-8");
            statusCode = 404;
        }
        if (parsedUrl.pathname === "/dad-joke") {
            const response = yield fetch("https://icanhazdadjoke.com", {
                headers: {
                    accept: "application/json",
                    "user-agent": "NodeJS Server",
                },
            });
            const jake = (yield response.json());
            data = data.replace(/{{joke}}/gm, jake.joke);
        }
        res.writeHead(statusCode, {
            "Content-type": "text/html",
            "content-length": data.length,
        });
        res.write(data);
        res.end();
    });
}
http_1.default.createServer(requestListener).listen(3000, () => {
    console.log("HTTP Server listening on port 3000");
});
