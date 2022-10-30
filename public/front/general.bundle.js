/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./front/general.ts":
/*!**************************!*\
  !*** ./front/general.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, exports) => {


Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getCookie = exports.chequear = exports.flash = void 0;
const flash = (m) => {
    $('#flash p').text(m.mensaje);
    $('#flash').addClass('expandido');
    window.flash_last_updated = Date.now();
    setTimeout(exports.chequear, 3000);
};
exports.flash = flash;
const chequear = (t = 3000) => {
    if (Date.now() - window.flash_last_updated >= t) {
        $('#flash').removeClass('expandido');
    }
    else {
        setTimeout(exports.chequear, t);
    }
};
exports.chequear = chequear;
const getCookie = (name) => {
    var match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    if (match)
        return JSON.parse(match[2]);
};
exports.getCookie = getCookie;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./front/general.ts"](0, __webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhbC5idW5kbGUuanMiLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQU1PLE1BQU0sS0FBSyxHQUFHLENBQUMsQ0FBb0IsRUFBRSxFQUFFO0lBQzVDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztJQUM3QixDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQztJQUNqQyxNQUFNLENBQUMsa0JBQWtCLEdBQUcsSUFBSSxDQUFDLEdBQUcsRUFBRTtJQUN0QyxVQUFVLENBQUMsZ0JBQVEsRUFBRSxJQUFJLENBQUM7QUFDNUIsQ0FBQztBQUxZLGFBQUssU0FLakI7QUFFTSxNQUFNLFFBQVEsR0FBRyxDQUFDLENBQUMsR0FBRyxJQUFJLEVBQUUsRUFBRTtJQUNuQyxJQUFJLElBQUksQ0FBQyxHQUFHLEVBQUUsR0FBRyxNQUFNLENBQUMsa0JBQWtCLElBQUksQ0FBQyxFQUFDO1FBQzlDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxXQUFXLENBQUMsV0FBVyxDQUFDO0tBQ3JDO1NBQUk7UUFDSCxVQUFVLENBQUMsZ0JBQVEsRUFBRSxDQUFDLENBQUM7S0FDeEI7QUFDSCxDQUFDO0FBTlksZ0JBQVEsWUFNcEI7QUFFTSxNQUFNLFNBQVMsR0FBRyxDQUFDLElBQVksRUFBRSxFQUFFO0lBQ3hDLElBQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksTUFBTSxDQUFDLE9BQU8sR0FBRyxJQUFJLEdBQUcsVUFBVSxDQUFDLENBQUMsQ0FBQztJQUMzRSxJQUFJLEtBQUs7UUFBRSxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDekMsQ0FBQztBQUhZLGlCQUFTLGFBR3JCOzs7Ozs7OztVRXhCRDtVQUNBO1VBQ0E7VUFDQTtVQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vZXNkZS8uL2Zyb250L2dlbmVyYWwudHMiLCJ3ZWJwYWNrOi8vZXNkZS93ZWJwYWNrL2JlZm9yZS1zdGFydHVwIiwid2VicGFjazovL2VzZGUvd2VicGFjay9zdGFydHVwIiwid2VicGFjazovL2VzZGUvd2VicGFjay9hZnRlci1zdGFydHVwIl0sInNvdXJjZXNDb250ZW50IjpbImRlY2xhcmUgZ2xvYmFsIHtcbiAgaW50ZXJmYWNlIFdpbmRvdyB7XG4gICAgZmxhc2hfbGFzdF91cGRhdGVkOiBhbnk7XG4gIH1cbn1cblxuZXhwb3J0IGNvbnN0IGZsYXNoID0gKG06IHttZW5zYWplOiBzdHJpbmd9KSA9PiB7XG4gICQoJyNmbGFzaCBwJykudGV4dChtLm1lbnNhamUpXG4gICQoJyNmbGFzaCcpLmFkZENsYXNzKCdleHBhbmRpZG8nKVxuICB3aW5kb3cuZmxhc2hfbGFzdF91cGRhdGVkID0gRGF0ZS5ub3coKVxuICBzZXRUaW1lb3V0KGNoZXF1ZWFyLCAzMDAwKVxufVxuXG5leHBvcnQgY29uc3QgY2hlcXVlYXIgPSAodCA9IDMwMDApID0+IHtcbiAgaWYgKERhdGUubm93KCkgLSB3aW5kb3cuZmxhc2hfbGFzdF91cGRhdGVkID49IHQpe1xuICAgICQoJyNmbGFzaCcpLnJlbW92ZUNsYXNzKCdleHBhbmRpZG8nKVxuICB9ZWxzZXtcbiAgICBzZXRUaW1lb3V0KGNoZXF1ZWFyLCB0KVxuICB9XG59XG5cbmV4cG9ydCBjb25zdCBnZXRDb29raWUgPSAobmFtZTogc3RyaW5nKSA9PiB7XG4gIHZhciBtYXRjaCA9IGRvY3VtZW50LmNvb2tpZS5tYXRjaChuZXcgUmVnRXhwKCcoXnwgKScgKyBuYW1lICsgJz0oW147XSspJykpO1xuICBpZiAobWF0Y2gpIHJldHVybiBKU09OLnBhcnNlKG1hdGNoWzJdKTtcbn1cbiIsIiIsIi8vIHN0YXJ0dXBcbi8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuLy8gVGhpcyBlbnRyeSBtb2R1bGUgaXMgcmVmZXJlbmNlZCBieSBvdGhlciBtb2R1bGVzIHNvIGl0IGNhbid0IGJlIGlubGluZWRcbnZhciBfX3dlYnBhY2tfZXhwb3J0c19fID0ge307XG5fX3dlYnBhY2tfbW9kdWxlc19fW1wiLi9mcm9udC9nZW5lcmFsLnRzXCJdKDAsIF9fd2VicGFja19leHBvcnRzX18pO1xuIiwiIl0sIm5hbWVzIjpbXSwic291cmNlUm9vdCI6IiJ9