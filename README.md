# crypto-ts

本项目是基于 crypto-ts 构建的一个标准的 ESM 格式的 crypto.js ，可以用于 avm 等支持 esm 的环境。

### Usage

将 `dist/avm` 目录下的 `crypto.min.js` 复制到项目中 `script` 目录下。

全量引入：
```javascript

import CryptoJS from '../../script/crypto.min';
const encryptedMessage = CryptoJS.AES.encrypt('message', 'test').toString();

```

按需引入：

```javascript

import {AES} from '../../script/crypto.min';
const encryptedMessage = AES.encrypt('message', 'test').toString();

```
### Build
从源码中构建：

```bash
node ./build-esm
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
