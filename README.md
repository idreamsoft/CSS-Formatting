# css-format-st3 
This extension is converted from Sublime-CSS-Format ([https://github.com/mutian/Sublime-CSS-Format](https://github.com/mutian/Sublime-CSS-Format/)).


**Example:**

* Expanded:

    ```css
    body {
        background: #fff;
        font: 12px/2em Arial, Helvetica, sans-serif;
    }
    ol, ul, li {
        margin: 0;
        padding: 0;
    }
    a {
        color: rgba(65, 131, 196, 0.8);
    }
    ```

* Expanded (Break Selectors):

    ```css
    body {
        background: #fff;
        font: 12px/2em Arial, Helvetica, sans-serif;
    }

    ol,
    ul,
    li {
        margin: 0;
        padding: 0;
    }
    
    a {
        color: rgba(65, 131, 196, 0.8);
    }
    ```

* Compact:

    ```css
    body { background: #fff; font: 12px/2em Arial, Helvetica, sans-serif; }
    ol, ul, li { margin: 0; padding: 0; }
    a { color: rgba(65, 131, 196, 0.8); }
    ```

* Compact (No Spaces):

    ```css
    body{background:#fff;font:12px/2em Arial,Helvetica,sans-serif;}
    ol,ul,li{margin:0;padding:0;}
    a{color:rgba(65,131,196,0.8);}
    ```

* Compact (Break Selectors):

    ```css
    body { background: #fff; font: 12px/2em Arial, Helvetica, sans-serif; }
    ol,
    ul,
    li { margin: 0; padding: 0; }
    a { color: rgba(65, 131, 196, 0.8); }
    ```

* Compact (Break Selectors, No Spaces):

    ```css
    body{background:#fff;font:12px/2em Arial,Helvetica,sans-serif;}
    ol,
    ul,
    li{margin:0;padding:0;}
    a{color:rgba(65,131,196,0.8);}
    ```

* Compressed:

    ```css
    body{background:#fff;font:12px/2em Arial,Helvetica,sans-serif}ol,ul,li{margin:0;padding:0}a{color:rgba(65,131,196,0.8)}
    ```
## Extension Settings

This extension contributes the following settings:

* `cssFormatSt3.formattingAction`: Document Formatting Action.
* `cssFormatSt3.indentation`: Format indentation, you can set it to `"  "`. By default, this is set to `"\t"`.
* `cssFormatSt3.expandBlockBreak`: Set the line breaks after each rules block under `Expanded` format. By default, this is set to `"\n\n"`..
* `cssFormatSt3.formatOnSave`: Set to `true` to trigger format on save. By default, this is set to `false`.
* `cssFormatSt3.formatOnSaveAction`: Format action. You can refer to **Settings - Default**. By default, this is set to `"expand"`.
* `cssFormatSt3.formatOnSaveFilter`: CSS Format matches the type of the file being saved against this defined to determine if a build should be triggered. By default, the setting has a value of `"css|sass|scss|less"`.


## keyboard shortcuts

* Expanded (`cmd+alt+f e` on macOS or `ctrl+alt+f e` on Windows and Linux).
* Compact (`cmd+alt+f c` on macOS or `ctrl+alt+f c` on Windows and Linux).
* Compressed (`cmd+alt+f s` on macOS or `ctrl+alt+f s` on Windows and Linux).

Author
------

Created by **Mutian** ([http://mutian.wang](http://mutian.wang/)).


**Enjoy!**
