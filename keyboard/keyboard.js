(function () {
    let opened = false;
    function virtualKeyboard() {
        if (opened) return;
        opened = true;
        const container = document.createElement("div");
        container.setAttribute("id", "keyboard_container");

        container.innerHTML = `
        <div id="keyboard_container_header">
            Виртуальная клавиатура<span id="keyboard_close">X</span>
            <span id="keyboard_switcher">ENG</span>
        </div>
        <div class="simple-keyboard"></div>
        `;

        document.body.appendChild(container);
        document.getElementById("keyboard_container_header").onmousedown = initDrag(document.getElementById("keyboard_container"));

        const Keyboard = window.SimpleKeyboard.default;
        const KeyboardLayouts = window.SimpleKeyboardLayouts.default;

        const kbd = new Keyboard({
            onKeyPress,
            preventMouseDownDefault: true,
            preventMouseUpDefault: true,
            ...new KeyboardLayouts().get("russian"),
        });

        document.getElementById("keyboard_close").onclick = () => {
            kbd.destroy();
            opened = false;
            container.remove();
        };
        let eng = false;
        const switcher = document.getElementById("keyboard_switcher");
        switcher.onclick = () => {
            kbd.setOptions({
                ...new KeyboardLayouts().get(eng ? "russian" : "english"),
            });
            switcher.innerHTML = eng ? "RUS" : "ENG";
            eng = !eng;
        };

        let caps = false;
        function onKeyPress(button) {
            if (button === "{lock}") {
                kbd.setOptions({
                    layoutName: caps ? "default" : "shift",
                });
                caps = !caps;
            }
            let code;
            let key = button;
            if (button.length > 1 && button[0] === "{") {
                key = undefined;
                if (button === "{space}") {
                    code = key = "Space";
                } else if (button === "{bksp}") {
                    code = key = "Backspace";
                }
            }
            const e = new KeyboardEvent("keydown", {
                bubbles: true,
                cancelable: true,
                key,
                code,
                shiftKey: false,
                view: window,
            });
            document.body.dispatchEvent(e);
        }
    }

    function initDrag(container) {
        var pos1 = 0,
            pos2 = 0,
            pos3 = 0,
            pos4 = 0;
        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            container.style.top = container.offsetTop - pos2 + "px";
            container.style.left = container.offsetLeft - pos1 + "px";
        }

        function closeDragElement() {
            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
        }

        return dragMouseDown;
    }
    window.virtualKeyboard = virtualKeyboard;
})();
