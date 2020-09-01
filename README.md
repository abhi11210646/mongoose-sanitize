
## Usage

```javascript
const sanitizer = require('mongoose-sanitize');

mongooseSchema.plugin(sanitizer, options);  // `options` optional field

```

### Options

```
let options = { skip:[], include:[] }
```
 - **Skip** Array indicating which fields should be excluded from being sanitized. If omitted or empty, every field in the document will be sanitized.
 - **Include** Array indicating which fields should be included to be sanitized. If omitted or empty, every field in the document will be sanitized.

