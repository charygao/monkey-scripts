// ==UserScript==
// @name                jav download control panel
// @name:zh-CN          Jav 下载控制台
// @description         Use javlibrary as your video download control panel
// @description:zh-CN   把 javlibrary 作为下载控制台
// @version             0.2.0
// @author              jferroal
// @license             GPL-3.0
// @updateURL           https://github.com/ezirmusitua/my-tamper-monkey-scripts/raw/master/jav-download-control-panel.user.js
// @require             https://greasyfork.org/scripts/31793-jmul/code/JMUL.js?version=209567
// @include             http://www.javlibrary.com/*
// @grant               GM_xmlhttpRequest
// @run-at              document-end
// @namespace           https://greasyfork.org/users/34556
// ==/UserScript==

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const {Element} = window.JMUL || {Element: {}};
const {ClickActionFactory} = require('./elements.logic');

class PanelButton {
    constructor(type, label) {
        this.type = type;
        this.btn = new Element('button');
        this.btn.setInnerText(label);
        this.initStyle();
    }

    initStyle() {
        this.btn.setCss({
            width: '22px',
            height: '22px',
            boxSizing: 'border-box',
            marginLeft: '4px',
            cursor: 'pointer',
        });
    }

    bindClick(task) {
        const gfn = new (ClickActionFactory.create(this.type))(task).cb;
        this.btn.listen('click', (e) => gfn(e, task));
    }

    updateCss(styles) {
        this.btn.setCss(styles);
    }

    appendTo(parent) {
        return this.btn.appendTo(parent);
    }
}

class PanelButtonFactory {
    constructor() {}
    static create(type) {
        switch (type) {
            case 'active':
                return new PanelButton(type, '⏩');
            case 'waiting':
                return new PanelButton(type, '•');
            case 'Paused':
                return new PanelButton(type, '⏸');
            case 'Removed':
                return new PanelButton(type, '⌦');
            case 'Completed':
                return new PanelButton(type, '🛆');
            case 'Error':
                return new PanelButton(type, '❌');
            case 'unknown':
            default:
                const button = new PanelButton(type, '?');
                button.updateCss({
                    color: 'white',
                    backgroundColor: 'grey',
                    borderRadius: '50%',
                });
                return button;
        }
    }
}

PanelButton.instance = undefined;

const TaskStatusBtnCandidates = {
    'unknown': ['unknown'],
    'active': ['paused', 'removed'],
    'waiting': ['removed'],
    'paused': ['active', 'removed'],
    'removed': ['active'],
    'complete': ['active', 'complete'],
    'error': ['error'],
};

class Panel {
    constructor(task) {
        this.element = new Element('section');
        this.initStyles();
        this.initButton(task);
    }

    initStyles() {
        this.element.setCss({
            display: 'flex',
            margin: '-4px 0',
        });
    }

    initButton(task) {
        for (const type of TaskStatusBtnCandidates[task.status]) {
            const button = PanelButtonFactory.create(type);
            button.bindClick(task);
            button.appendTo(this.element);
        }
    }

    appendTo(parent) {
        parent.setCss({
            display: 'flex',
            margin: '4px 15%'
        });
        parent.appendChild(this.element);
    }
}

class ProgressBar {
    constructor(task) {
        const percentage = (task.completedLength / task.totalLength) * 100;
        this.element = new Element('div');
        this.already = new Element('div');
        this.initStyles(percentage);
        this.element.appendChild(this.already);
    }

    initStyles(percentage) {
        this.element.setCss({
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '4px',
            backgroundColor: 'grey',
        });
        this.already.setCss({
            width: percentage + '%',
            height: 'inherit',
            backgroundColor: 'green',
        })
    }

    appendTo(parent) {
        return this.element.appendTo(parent);
    }
}

module.exports = {ProgressBar, Panel};
},{"./elements.logic":2}],2:[function(require,module,exports){
const {TokyoToSho, TaskPanel} = require('./requests');
const {Utils} = require('./utils');

class UnknownClickAction {
    constructor(task) {
        this.task = task;
    }

    get cb() {
        return (event) => {
            event.preventDefault();
            new TokyoToSho().search(this.task.name).then((response) => {
                // FIXME: Fix JMRequest then change here
                const magnets = (new Utils.TokyoToShoParser(response.responseText)).matchAll();
                if (magnets && magnets.length) {
                    this.task.chooseBestMagnet(magnets);
                    new TaskPanel().start(this.task);
                } else {
                    alert('无可用资源');
                }
            });
        }
    }
}

class ActiveClickAction {
    constructor(task) {
        this.task = task;
    }
    get cb() {
        return (event) => {
            event.preventDefault();
            console.log('resume');
        }
    }
}

class WaitingClickAction {
    constructor(task) {
        this.task = task;
    }
    get cb() {
        return (event) => {
            event.preventDefault();
            console.log('resume');
        }
    }
}

class PausedClickAction {
    constructor(task) {
        this.task = task;
    }
    get cb() {
        return (event) => {
            event.preventDefault();
            console.log('resume');
        }
    }
}

class RemovedClickAction {
    constructor(task) {
        this.task = task;
    }
    get cb() {
        return (event) => {
            event.preventDefault();
            console.log('resume');
        }
    }
}

class ErrorClickAction {
    constructor(task) {
        this.task = task;
    }
    get cb() {
        return (event) => {
            event.preventDefault();
            console.log('resume');
        }
    }
}

class CompletedClickAction {
    constructor(task) {
        this.task = task;
    }
    get cb() {
        return (event) => {
            event.preventDefault();
            console.log('resume');
        }
    }
}

class ClickActionFactory {
    constructor() {}

    static create(type) {
        if (!ClickActionFactory.caches[type]) {
            switch (type) {
                case 'active':
                    ClickActionFactory.caches[type] = ActiveClickAction;
                    break;
                case 'waiting':
                    ClickActionFactory.caches[type] = WaitingClickAction;
                    break;
                case 'Paused':
                    ClickActionFactory.caches[type] = PausedClickAction;
                    break;
                case 'Removed':
                    ClickActionFactory.caches[type] = RemovedClickAction;
                    break;
                case 'Completed':
                    ClickActionFactory.caches[type] = CompletedClickAction;
                    break;
                case 'Error':
                    ClickActionFactory.caches[type] = ErrorClickAction;
                    break;
                case 'unknown':
                default:
                    ClickActionFactory.caches[type] = UnknownClickAction;
            }
        }
        return ClickActionFactory.caches[type];
    }
}

ClickActionFactory.caches = {};

module.exports = {ClickActionFactory};
},{"./requests":4,"./utils":6}],3:[function(require,module,exports){
const {Utils} = require('./utils');
const {TaskPanel} = require('./requests');
const {Panel, ProgressBar} = require('./elements');
const {Task} = require('./task');

(function () {
    const href = window.location.href;
    const tasks = Utils.generateTasks(href);
    init(tasks);
    function init(tasks) {
        const taskRequest = new TaskPanel();
        taskRequest.list(Task.joinName(tasks)).then(function (res) {
            // FIXME: Fix JMRequest then change here
            const serverTaskNameMap = JSON.parse(res.responseText);
            tasks.forEach((task) => {
                task.setServerStatus(serverTaskNameMap[task.name]);
                const statusBar = new Panel(task);
                statusBar.appendTo(task.panelParent);
                const progressBar = new ProgressBar(task);
                progressBar.appendTo(task.progressBarParent);
            })
        });
    }
}());


},{"./elements":1,"./requests":4,"./task":5,"./utils":6}],4:[function(require,module,exports){
// Search result from tokyotosho
const {Request, Header} = window.JMUL || {Request: {}, Header: {}};

class TokyoToSho {
    constructor(_options = {}) {
        if (!TokyoToSho.instance) {
            this.options = _options;
            this.initHeaders();
            this.host = 'https://www.tokyotosho.info';
            TokyoToSho.instance = this;
        }
        return TokyoToSho.instance;
    }

    initHeaders() {
        this.options.headers = new Header({
            ':authority': 'www.tokyotosho.info',
            ':scheme': 'https',
            'accept': 'text / html, application/xhtml+xml,application/xml;q=0.9, image/webp,*/*;q=0.8',
            'accept-encoding;': 'gzip, deflate, sdch, br',
            'accept-language': 'zh-CN, en-US;q=0.8, en;q=0.6, zh;q=0.4',
            'cache-control': 'no-cache',
        });
    }

    search(target) {
        const request = new Request(this.options);
        request.setMethod('GET');
        request.setUrl(this.host + `/search.php?terms=${target}`, ``);
        return request.send();
    }
}

TokyoToSho.instance = undefined;

class TaskPanel {
    constructor(_options = {}) {
        if (!TaskPanel.instance) {
            this.options = _options;
            this.initHeaders();
            this.host = 'http://localhost:5000/downloader/api/v0.1.0/task';
            TaskPanel.instance = this;
        }
        return TaskPanel.instance;
    }

    initHeaders() {
        this.options.headers = new Header({'Content-Type': 'application/json'});
    }

    start(task) {
        const request = new Request(this.options);
        request.setMethod('POST');
        request.setUrl(this.host);
        request.setData(task.json());
        return request.send();
    }

    list(taskStr) {
        const request = new Request(this.options);
        request.setMethod('GET');
        request.setUrl(`${this.host}?names=${taskStr}`);
        return request.send();
    }
}

TaskPanel.instance = undefined;

module.exports = { TokyoToSho, TaskPanel};

},{}],5:[function(require,module,exports){
const {Element} = window.JMUL || {JMElement: {}};

class Task {
    constructor(name = '') {
        this.name = name;
    }

    setName(name) {
        this.name = name;
    }

    setPanelParent(el) {
        this.panelParent = new Element(el);
    }

    setProgressBarParent(el) {
        this.progressBarParent = new Element(el);
    }

    setMagnetLink(magnet) {
        this.magnet = magnet;
    }

    chooseBestMagnet(magnets) {
        this.setMagnetLink(magnets.reduce((best, magnet) => {
            const current = {
                link: magnet.link,
                score: (magnet.sCount || 0) * 10 + (magnet.cCount || 0) * 5 + (magnet.lCount || 0) * 2,
                size: parseInt(magnet.size.slice(0, -2), 10) * (magnet.size.indexOf('GB') > -1 ? 1000 : 1),
            };
            if (current.score < best.score) return best;
            if (current.score > best.score) return current;
            if (current.size < best.size) return best;
            return current;
        }, {link: '', score: 0, size: 0}));
    }

    setServerStatus(serverTask) {
        this.completedLength = serverTask.completedLength;
        this.totalLength = serverTask.totalLength;
        this.status = serverTask.status;
    }

    json() {
        return {
            name: this.name,
            magnet: this.magnet.link
        }
    }

    static joinName(tasks) {
        return tasks.reduce((res, t) => res += t.name + ';', '');
    }

    static fromSingleElem(elem) {
        const task = new Task();
        task.setName(elem.children[0].children[0].children[0].children[1].textContent);
        task.setPanelParent(elem);
        task.setProgressBarParent(elem.children[0].children[0].children[0].children[1]);
        return task;
    }

    static fromListElem(elem) {
        const task = new Task();
        task.setName(elem.children[0].children[0].textContent);
        task.setPanelParent(elem);
        task.setProgressBarParent(elem.children[0].children[0]);
        return task;
    }

    static fromHomeElem(elem) {
        const task = new Task();
        task.setName(elem.children[0].textContent);
        task.setPanelParent(elem);
        task.setProgressBarParent(elem.children[0]);
        return task;
    }
}

module.exports = {Task};
},{}],6:[function(require,module,exports){
const {Task} = require('./task');
function convertHTMLElementsToArray(elements) {
    const result = [];
    if (elements && !elements.length) {
        for (let i = 0; i < elements.length; i += 1) {
            result.push(elements.item(i));
        }
    }
    return result;

}
const PageType = {
    SINGLE_VIEW: 100,
    VIDEO_LIST: 200,
    HOMEPAGE: 300,
};

class Utils {
    static pageType(href) {
        if (/http:\/\/www\.javlibrary\.com\/.*\/\?v=.*/.test(href)) {
            return PageType.SINGLE_VIEW;
        }
        if (/http:\/\/www\.javlibrary\.com\/.*\/vl_.*/.test(href)) {
            return PageType.VIDEO_LIST;
        }
        return PageType.HOMEPAGE;
    }

    static getTaskElements(type) {
        switch (type) {
            case PageType.SINGLE_VIEW:
                return [document.getElementById('video_id')];
            case PageType.VIDEO_LIST:
                return convertHTMLElementsToArray(document.getElementsByClassName('video'));
            case PageType.HOMEPAGE:
            default:
                return convertHTMLElementsToArray(document.getElementsByClassName('post-headline'));
        }
    }

    static generateTasks(href) {
        const type = Utils.pageType(href);
        const elements = Utils.getTaskElements(type);
        return elements.reduce((res, e) => {
            switch (type) {
                case PageType.SINGLE_VIEW:
                    res.push(Task.fromSingleElem(e));
                    break;
                case PageType.VIDEO_LIST:
                    res.push(Task.fromListElem(e));
                    break;
                case PageType.HOMEPAGE:
                default:
                    res.push(Task.fromHomeElem(e));
                    break;
            }
            return res;
        }, []);
    }
}

Utils.PageType = PageType;
Utils.TokyoToShoParser = class TokyoToShoParser {
    constructor(pageContent) {
        this.pageContent = pageContent;
        this.magnetLinkPattern = /<a href="(magnet:\?xt=urn:btih:.*?)">/gi;
        this.seederCountPattern = /S: <span style="color: .*?">(\d+)<\/span>/gi;
        this.leederCountPattern = /L: <span style="color: .*?">(\d+)<\/span>/gi;
        this.completedCountPattern = /C: <span style="color: .*?">(\d+)<\/span>/gi;
        this.sizePattern = /\| Size: (.*?) \|/gi;
    }

    matchAll() {
        const result = [];
        let [mlMatch, scMatch, lcMatch, ccMatch, szMatch] = [undefined, undefined, undefined, undefined, undefined];
        do {
            [mlMatch, scMatch, lcMatch, ccMatch, szMatch] = [
                this.magnetLinkPattern.exec(this.pageContent),
                this.seederCountPattern.exec(this.pageContent),
                this.leederCountPattern.exec(this.pageContent),
                this.completedCountPattern.exec(this.pageContent),
                this.sizePattern.exec(this.pageContent),
            ];
            if (mlMatch) {
                result.push({
                    link: mlMatch[1].trim(),
                    sCount: scMatch[1],
                    lCount: lcMatch[1],
                    cCount: ccMatch[1],
                    size: (szMatch && szMatch[1]) || '0MB',
                });
            }
        } while (mlMatch);
        this.magnetLinkPattern.index = this.seederCountPattern.index = this.leederCountPattern.index = 0;
        this.completedCountPattern.index = this.sizePattern.index = 0;
        return result;
    }
};

module.exports = {Utils};
},{"./task":5}]},{},[3]);
