# Backend Web APIs

## HTTPS Certs

```
openssl req -nodes -new -x509 -keyout server.key -out server.cert
```

## JWT Tokens

```
openssl genpkey -algorithm RSA -out private.key -pkeyopt rsa_keygen_bits:2048
openssl rsa -pubout -in private.key -out public.key
```