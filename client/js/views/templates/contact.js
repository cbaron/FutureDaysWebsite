module.exports = p => `
    <div data-js="container" class="contact">
        <div class="fd-info">
            <div class="info-box">
                <h2>Let's Get In Touch</h2>
                <p>Feel free to contact us by phone or email with any project ideas or questions,
                or send us a quick message.</p>
                <div class="contact-details">
                    <dl>
                        <dt>Email</dt>
                        <dd><a href="topher.baron@gmail.com">topher.baron@gmail.com</a></dd>
                        <dt>Phone</dt>
                        <dd>123-456-7890</dd>
                    </dl>
                </div>
            </div>
        </div>
        <div class="contact-form">
            <form>
                <div class="form-group">
                    <input class="input-borderless" type="email" id="from" placeholder="From">
                </div>
                <div class="form-group">
                    <input class="input-borderless" type="text" id="subject" placeholder="Subject">
                </div>
                <div class="form-group">
                    <textarea rows="10" class="input-borderless" type="email" id="message" placeholder="Message"></textarea>
                </div>
            </form>
            <button data-js="sendBtn" class="btn-ghost">Send</button>
        </div>
    </div>`