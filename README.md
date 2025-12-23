# Web3 test task

The program provides several configuration options using environment variables. The file ".env.example" lists the available options. You can override them by creating a copy of this file named ".env" or by providing the program with environment variables in some other way.

The "TOKEN_ADDRESS" environment variable specifies which token should be sent.

The "WAIT_FOR_CONFIRMATION" environment variable specifies whether the program should wait for a transaction to be confirmed.

Before running the program, you need to compile it. This can be done using the following command:

```sh
npm run build
```

After this, the program can be run as follows, substituting the required data:

```sh
node dist/index.js <private key> <amount> <public key>
```
