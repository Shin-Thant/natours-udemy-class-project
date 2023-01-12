# Pug Shortcuts and Notes

1. ## render template

    You have to _**render**_ your file with `res.render(path)` if you use template engine in your server for frontend. If you don't use template engine, you can just _**send file**_ with `res.sendFile(path)`.

    ```javascript
    // Argument must be a file path that use template engine.

    const path = path.join(__dirname, "views");
    res.render(path);
    ```

    You can pass _**data**_ as _**second argument**_ in `render(path, data)`.

    ```javascript
    res.render(path, { tour: "Short Trip", user: "Shin Thant" });
    ```

    ***

2. ## create html template

    This **shortcut** will create _**html boilerplate**_.

    ```pug
    html:5
    ```

    ***

3. ## create `<link>` tag

    Use `link(...)` to create `<link>` tag in html.

    ```pug
    head
        <!-- ... -->
        link(rel="stylesheet", href="css/style.css")
    ```

    ***

4. ## syntax example

    ```pug
    body
        h1 Hello World
        h2 this is heading2
    ```

    This code will generate this elements.

    ```html
    <body>
    	<h1>Hello World</h1>
    	<h2>this is heading2</h2>
    </body>
    ```

    ***

5. ## Buffered Code

    **Buffered code** starts with `=` and they will be _**transformed**_ and _**include**_ in outputs.

    ```pug
    h1= "Hello: " + name
    ```

    ***

6. ## Unbuffered Code

    **Unbuffered code** starts with `-` and they will _**not directly include**_ in output.

    ```pug
    - const num = 10;
    h1 Num #{num}
    ```

    ***

7. ## Element's class syntax

    ```pug
    h1.heading Hello World
    ```

    This is equivalent to this.

    ```html
    <h1 class="heading">Hello World</h1>
    ```

    But for `<div>` element's class, you don't need to type _**div**_.

    ```pug
    <!-- Without class -->
    div this is div ele

    <!-- With class -->
    .box this is div ele with class
    ```

    ***

8. ## Attribute Syntax
    ```pug
    img.profile-img(src="img/profile.png", alt="Profile img")
    ```
    This is equivalent to this.
    ```html
    <img class="profile-img" src="img/profile.png" alt="Profile img" />
    ```

9. ## Inheritance: block and extends
    ```pug
    <!-- base.pug -->

    body
        h1 This is from base

        block content
            <!-- default content -->
            p default content 
    ```

    ```pug
    <!-- first.pug -->

    extends base

    block content
        div
            h1 This is from first
            p content of first
    ```

10. ## Iteration

11. ## Mixins