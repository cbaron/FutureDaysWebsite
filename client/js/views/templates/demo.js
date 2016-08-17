module.exports = (p) => `
<div class="demo" data-js="container">
    <aside class="sidebar">
        <div data-view="sidebar"></div>
    </aside>
    <div class="demo-content">
        <h2>Lists</h2>
        <p>Organize your content into neat groups with our lists.</p>
        <div class="example">
            <div class="inline-view">
                <div data-view="list"></div>
            </div>
        </div>
        <h2>Forms</h2>
        <p>Our forms are customizable to suit the needs of your project. Here, for example, are 
        Login and Register forms, each using different input styles.</p>
        <div class="example">
            <div class="inline-view">
                <div data-view="login"></div>
            </div>
            <div class="inline-view">
                <div data-view="register"></div>
            </div>
        </div>
    </div>
</div>
`
