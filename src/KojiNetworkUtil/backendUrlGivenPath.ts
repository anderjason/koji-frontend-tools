let backend: string;
if (window.location.origin === "http://localhost:8080") {
  backend = "http://localhost:3333";
} else if (window.location.origin.indexOf("192.168") !== -1) {
  backend = `http://${window.location.hostname}:3333`;
} else if (process.env.backendUrl) {
  backend = process.env.backendUrl;
} else {
  backend = window.location.origin
    .replace("//8080-", "//3333-")
    .replace("//frontend-", "//backend-");
}

export function backendUrlGivenPath(relativeUrl: string, params?: any): string {
  const url = new URL(relativeUrl, backend);

  if (params != null) {
    Object.keys(params).forEach((key) => {
      let value = params[key];
      if (typeof value === "object" || Array.isArray(value)) {
        value = JSON.stringify(value);
      }

      if (value != null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  return url.toString();
}
