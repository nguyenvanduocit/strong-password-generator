var Background = function () {
    this.contexts = ["editable"];
    this.menus = [];
    /**
     * Default option
     */
    this.defaultOptions = {
        type: 'reqevery',
        canUpper: true,
        canLower: true,
        canDigital: true,
        canSpecial: false,
        mindigits: 2,
        length: 12,
        ambig: false
    };
    this.currentOptions = {};
};
Background.prototype.init = function () {
    var self = this;
    chrome.storage.sync.get(this.defaultOptions, function(items){
        self.currentOptions = items;
    });
    chrome.storage.onChanged.addListener(function(changes, areaName){
        for (var key in changes) {
            if (changes.hasOwnProperty(key)) {
                var change = changes[key];
                self.currentOptions[key] = change.newValue;
            }
        }
    });
    this.createMenus();
    this.listenContentMessage()
};
Background.prototype.listenContentMessage = function(){
    var self = this;
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
            if(sender.tab){
                if (request.action == "getOptions")
                {
                    sendResponse({options: self.currentOptions});
                }
            }
        });
};
Background.prototype.createMenus = function () {
    var id = chrome.contextMenus.create({"title": "Generate password", "contexts": this.contexts, "onclick": this.onGeneratePasswordClicked});
    this.menus.push(id);
};
Background.prototype.onGeneratePasswordClicked = function (info, tab) {
    chrome.tabs.executeScript(tab.id, {file: 'js/random.js'}, function() {
        chrome.tabs.executeScript(tab.id, {file: 'js/gpw.js'}, function() {
            chrome.tabs.executeScript(tab.id, {file: 'js/generator.js'}, function() {
                chrome.tabs.executeScript(tab.id, {file: 'js/clipboard.js'}, function() {
                    chrome.tabs.executeScript(tab.id, {file: 'js/content.js'}, function() {

                    });
                });
            });
        });
    });
};

var background = new Background();
background.init();