module.exports = ( options ) => `

<form>
	<label class="form-label" for="name">Name</label>
	<input class="form-input" type="text" id="name">
    <label class="form-label" for="address">Address</label>
    <input class="form-input" type="text" id="address">
    <input class="input-borderless" type="text" id="city" placeholder="City">
    <label class="form-label" for="fave">Fave Can Album</label>
    <select class="input-borderless" id="fave">
        <option>Monster Movie</option>
        <option>Soundtracks</option>
        <option>Tago Mago</option>
        <option>Ege Bamyasi</option>
        <option>Future Days</option>
    </select>
    <input class="input-flat" type="text" id="email" placeholder="Email">
    <button class="btn-default" type="submit">Submit</button>
    <button class="btn-ghost" type="submit">Submit</button>
</form>
`