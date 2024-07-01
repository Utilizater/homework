First task:
There is an issue in this line of code:

```
const refreshedToken = await invokeTokenService(data.value.key);
```

Recommendation - use TypeScript

Second task:
Added hook - "onRequest"
For output added - `reply.header('correlationId', correlationId);`

Third task:
I added two functions in generateNewWorker.js: "createWorker" and "getWorker". The first one creates a worker that will be terminated after 15 minutes of inactivity. "getWorker" is a wrapper that checks if we have an existing worker. I also updated index.js to fetch the worker for every HTTP call.
