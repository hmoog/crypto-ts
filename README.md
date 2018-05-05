# crypto-ts

Typescript library of crypto standards. Ready for AOT and treeshaking in combination with Angular and other modern typescript frameworks.

## Node.js (Install)

Requirements:

- Node.js
- npm (Node.js package manager)

```bash
npm install crypto-ts
```

### Usage

ES6 import for typical API call signing use case:

```javascript
import { AES } from 'crypto-ts';

const encryptedMessage = AES.encrypt('message', 'test').toString();
```

Modular include:

```javascript
var AES = require("crypto-ts").AES;
var SHA256 = require("crypto-ts").SHA256;
...
console.log(SHA256("Message"));
```

Including all libraries, for access to extra methods:

```javascript
var CryptoTS = require("crypto-ts");
...
console.log(CryptoTS.HmacSHA1("Message", "Key"));
```

## Client (browser)

Requirements:

- Node.js
- Bower (package manager for frontend)

```bash
bower install crypto-ts
```

### Usage

Modular include:

```javascript
require.config({
    packages: [
        {
            name: 'crypto-ts',
            location: 'path-to/bower_components/crypto-ts',
            main: 'index'
        }
    ]
});

require(["crypto-ts/algo/aes", "crypto-ts/algo/sha256"], function (AES, SHA256) {
    console.log(SHA256("Message"));
});
```

Including all libraries, for access to extra methods:

```javascript
// Above-mentioned will work or use this simple form
require.config({
    paths: {
        'crypto-ts': 'path-to/bower_components/crypto-ts/crypto-ts'
    }
});

require(["crypto-ts"], function (CryptoTS) {
    console.log(CryptoTS.MD5("Message"));
});
```

### Usage without RequireJS

```html
<script type="text/javascript" src="path-to/bower_components/crypto-ts/crypto-ts.js"></script>
<script type="text/javascript">
    var encrypted = CryptoTS.AES(...);
    var encrypted = CryptoTS.SHA256(...);
</script>
```

### AES Encryption

#### Plain text encryption

```javascript
var CryptoTS = require("crypto-ts");

// Encrypt
var ciphertext = CryptoTS.AES.encrypt('my message', 'secret key 123');

// Decrypt
var bytes  = CryptoTS.AES.decrypt(ciphertext.toString(), 'secret key 123');
var plaintext = bytes.toString(CryptoTS.enc.Utf8);

console.log(plaintext);
```

#### Object encryption

```javascript
var CryptoTS = require("crypto-ts");

var data = [{id: 1}, {id: 2}]

// Encrypt
var ciphertext = CryptoTS.AES.encrypt(JSON.stringify(data), 'secret key 123');

// Decrypt
var bytes  = CryptoTS.AES.decrypt(ciphertext.toString(), 'secret key 123');
var decryptedData = JSON.parse(bytes.toString(CryptoTS.enc.Utf8));

console.log(decryptedData);
```

### List of modules


- ```crypto-ts/core```
- ```crypto-ts/x64-core```
- ```crypto-ts/lib-typedarrays```

---

- ```crypto-ts/md5```
- ```crypto-ts/sha1```
- ```crypto-ts/sha256```
- ```crypto-ts/sha224```
- ```crypto-ts/sha512```
- ```crypto-ts/sha384```
- ```crypto-ts/sha3```
- ```crypto-ts/ripemd160```

---

- ```crypto-ts/hmac-md5```
- ```crypto-ts/hmac-sha1```
- ```crypto-ts/hmac-sha256```
- ```crypto-ts/hmac-sha224```
- ```crypto-ts/hmac-sha512```
- ```crypto-ts/hmac-sha384```
- ```crypto-ts/hmac-sha3```
- ```crypto-ts/hmac-ripemd160```

---

- ```crypto-ts/pbkdf2```

---

- ```crypto-ts/aes```
- ```crypto-ts/tripledes```
- ```crypto-ts/rc4```
- ```crypto-ts/rabbit```
- ```crypto-ts/rabbit-legacy```
- ```crypto-ts/evpkdf```

---

- ```crypto-ts/format-openssl```
- ```crypto-ts/format-hex```

---

- ```crypto-ts/enc-latin1```
- ```crypto-ts/enc-utf8```
- ```crypto-ts/enc-hex```
- ```crypto-ts/enc-utf16```
- ```crypto-ts/enc-base64```

---

- ```crypto-ts/mode-cfb```
- ```crypto-ts/mode-ctr```
- ```crypto-ts/mode-ctr-gladman```
- ```crypto-ts/mode-ofb```
- ```crypto-ts/mode-ecb```

---

- ```crypto-ts/pad-pkcs7```
- ```crypto-ts/pad-ansix923```
- ```crypto-ts/pad-iso10126```
- ```crypto-ts/pad-iso97971```
- ```crypto-ts/pad-zeropadding```
- ```crypto-ts/pad-nopadding```