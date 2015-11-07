var StrongPasswordGeneratorContent = function(){
    this.options = {
        type: 'reqevery',
        canUpper: true,
        canLower: true,
        canDigital: true,
        canSpecial: false,
        mindigits: 2,
        length: 12,
        ambig: false
    };

};
StrongPasswordGeneratorContent.prototype.setUp =function(){
    this.addCopyButton();
    var self  =this;
    this.clipboard = new Clipboard('#StrongPassWordGeneratorCopyButton', {
        text: function (trigger) {
            var focusedElement =self.getFocusedElement();
            var password = Generator.generate(self.options);
            focusedElement.value = password;
            return password;
        }
    });

    /**
     * Update text box
     */
    this.clipboard.on('success', function (e) {
        e.clearSelection();
    });
};
StrongPasswordGeneratorContent.prototype.tearDown = function(){
    this.clipboard.destroy();
    document.body.removeChild(this.copyButton);

};
StrongPasswordGeneratorContent.prototype.addCopyButton = function(){

    this.copyButton = document.createElement('button');
    this.copyButton.setAttribute('id', 'StrongPassWordGeneratorCopyButton');
    this.copyButton.setAttribute('style', 'display:none');
    this.copyButton.innerHTML = 'copyPassword';
    document.body.appendChild(this.copyButton);
};
StrongPasswordGeneratorContent.prototype.getFocusedElement = function(){
    var focused = document.activeElement;
    if (!focused || focused == document.body) {
        focused = null;
    }
    else if (document.querySelector) {
        focused = document.querySelector(":focus");
    }
    if( (focused.tagName =="INPUT") || (focused.tagName =="TEXTAREA")){
        return focused;
    }
    return false;
};
StrongPasswordGeneratorContent.prototype.generatePassword = function(){
    var self = this;
    chrome.runtime.sendMessage({action: "getOptions"}, function(response) {
        contentScript.setUp();
        self.options = response.options;
        self.copyButton.click();
        contentScript.tearDown();
    });
};


var contentScript = new StrongPasswordGeneratorContent();
contentScript.generatePassword();