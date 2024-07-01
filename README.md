First task:
There is an issue in this like of code:

```
const refreshedToken = await invokeTokenService(data.value.key);
```

Recommendation - use TypeScript

Second task:
Added hook - "onRequest"
For output added - `reply.header('correlationId', correlationId);`

Thirds task:
I added two function in generateNewWorker.js - "createWorker" and "getWorker". First one create worker which will be terminated after 15 minutes of inactivity. "getWorker" is wrapper which check if we have existing worker. Also I updated index.js to fetch worker every http call.
