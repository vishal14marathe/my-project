// public/sw.js
self.addEventListener("fetch", (event) => {
  // Only intercept API calls
  if (event.request.url.includes("/api/auth/me")) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // If it's a 401, return a 200 with null data instead
          if (response.status === 401) {
            return new Response(
              JSON.stringify({
                success: false,
                data: null,
                _suppressed: true,
              }),
              {
                status: 200,
                statusText: "OK",
                headers: {
                  "Content-Type": "application/json",
                  "X-Suppressed-Error": "true",
                },
              },
            );
          }
          return response;
        })
        .catch((error) => {
          // Return a fake successful response on error
          return new Response(
            JSON.stringify({
              success: false,
              data: null,
              _suppressed: true,
            }),
            {
              status: 200,
              statusText: "OK",
              headers: {
                "Content-Type": "application/json",
              },
            },
          );
        }),
    );
  } else {
    // Pass through all other requests
    event.respondWith(fetch(event.request));
  }
});
