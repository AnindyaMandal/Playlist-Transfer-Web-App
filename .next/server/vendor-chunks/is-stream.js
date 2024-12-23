"use strict";
/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
exports.id = "vendor-chunks/is-stream";
exports.ids = ["vendor-chunks/is-stream"];
exports.modules = {

/***/ "(action-browser)/./node_modules/is-stream/index.js":
/*!*****************************************!*\
  !*** ./node_modules/is-stream/index.js ***!
  \*****************************************/
/***/ ((module) => {

eval("\nconst isStream = (stream)=>stream !== null && typeof stream === \"object\" && typeof stream.pipe === \"function\";\nisStream.writable = (stream)=>isStream(stream) && stream.writable !== false && typeof stream._write === \"function\" && typeof stream._writableState === \"object\";\nisStream.readable = (stream)=>isStream(stream) && stream.readable !== false && typeof stream._read === \"function\" && typeof stream._readableState === \"object\";\nisStream.duplex = (stream)=>isStream.writable(stream) && isStream.readable(stream);\nisStream.transform = (stream)=>isStream.duplex(stream) && typeof stream._transform === \"function\";\nmodule.exports = isStream;\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiKGFjdGlvbi1icm93c2VyKS8uL25vZGVfbW9kdWxlcy9pcy1zdHJlYW0vaW5kZXguanMiLCJtYXBwaW5ncyI6IkFBQUE7QUFFQSxNQUFNQSxXQUFXQyxDQUFBQSxTQUNoQkEsV0FBVyxRQUNYLE9BQU9BLFdBQVcsWUFDbEIsT0FBT0EsT0FBT0MsSUFBSSxLQUFLO0FBRXhCRixTQUFTRyxRQUFRLEdBQUdGLENBQUFBLFNBQ25CRCxTQUFTQyxXQUNUQSxPQUFPRSxRQUFRLEtBQUssU0FDcEIsT0FBT0YsT0FBT0csTUFBTSxLQUFLLGNBQ3pCLE9BQU9ILE9BQU9JLGNBQWMsS0FBSztBQUVsQ0wsU0FBU00sUUFBUSxHQUFHTCxDQUFBQSxTQUNuQkQsU0FBU0MsV0FDVEEsT0FBT0ssUUFBUSxLQUFLLFNBQ3BCLE9BQU9MLE9BQU9NLEtBQUssS0FBSyxjQUN4QixPQUFPTixPQUFPTyxjQUFjLEtBQUs7QUFFbENSLFNBQVNTLE1BQU0sR0FBR1IsQ0FBQUEsU0FDakJELFNBQVNHLFFBQVEsQ0FBQ0YsV0FDbEJELFNBQVNNLFFBQVEsQ0FBQ0w7QUFFbkJELFNBQVNVLFNBQVMsR0FBR1QsQ0FBQUEsU0FDcEJELFNBQVNTLE1BQU0sQ0FBQ1IsV0FDaEIsT0FBT0EsT0FBT1UsVUFBVSxLQUFLO0FBRTlCQyxPQUFPQyxPQUFPLEdBQUdiIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vc3BvdGlmeS10by15b3V0dWJlLy4vbm9kZV9tb2R1bGVzL2lzLXN0cmVhbS9pbmRleC5qcz8xOWQ4Il0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcblxuY29uc3QgaXNTdHJlYW0gPSBzdHJlYW0gPT5cblx0c3RyZWFtICE9PSBudWxsICYmXG5cdHR5cGVvZiBzdHJlYW0gPT09ICdvYmplY3QnICYmXG5cdHR5cGVvZiBzdHJlYW0ucGlwZSA9PT0gJ2Z1bmN0aW9uJztcblxuaXNTdHJlYW0ud3JpdGFibGUgPSBzdHJlYW0gPT5cblx0aXNTdHJlYW0oc3RyZWFtKSAmJlxuXHRzdHJlYW0ud3JpdGFibGUgIT09IGZhbHNlICYmXG5cdHR5cGVvZiBzdHJlYW0uX3dyaXRlID09PSAnZnVuY3Rpb24nICYmXG5cdHR5cGVvZiBzdHJlYW0uX3dyaXRhYmxlU3RhdGUgPT09ICdvYmplY3QnO1xuXG5pc1N0cmVhbS5yZWFkYWJsZSA9IHN0cmVhbSA9PlxuXHRpc1N0cmVhbShzdHJlYW0pICYmXG5cdHN0cmVhbS5yZWFkYWJsZSAhPT0gZmFsc2UgJiZcblx0dHlwZW9mIHN0cmVhbS5fcmVhZCA9PT0gJ2Z1bmN0aW9uJyAmJlxuXHR0eXBlb2Ygc3RyZWFtLl9yZWFkYWJsZVN0YXRlID09PSAnb2JqZWN0JztcblxuaXNTdHJlYW0uZHVwbGV4ID0gc3RyZWFtID0+XG5cdGlzU3RyZWFtLndyaXRhYmxlKHN0cmVhbSkgJiZcblx0aXNTdHJlYW0ucmVhZGFibGUoc3RyZWFtKTtcblxuaXNTdHJlYW0udHJhbnNmb3JtID0gc3RyZWFtID0+XG5cdGlzU3RyZWFtLmR1cGxleChzdHJlYW0pICYmXG5cdHR5cGVvZiBzdHJlYW0uX3RyYW5zZm9ybSA9PT0gJ2Z1bmN0aW9uJztcblxubW9kdWxlLmV4cG9ydHMgPSBpc1N0cmVhbTtcbiJdLCJuYW1lcyI6WyJpc1N0cmVhbSIsInN0cmVhbSIsInBpcGUiLCJ3cml0YWJsZSIsIl93cml0ZSIsIl93cml0YWJsZVN0YXRlIiwicmVhZGFibGUiLCJfcmVhZCIsIl9yZWFkYWJsZVN0YXRlIiwiZHVwbGV4IiwidHJhbnNmb3JtIiwiX3RyYW5zZm9ybSIsIm1vZHVsZSIsImV4cG9ydHMiXSwic291cmNlUm9vdCI6IiJ9\n//# sourceURL=webpack-internal:///(action-browser)/./node_modules/is-stream/index.js\n");

/***/ })

};
;