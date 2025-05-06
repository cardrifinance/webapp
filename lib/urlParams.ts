export const addUrlParam = (key: string, value: string) => {
  const url = new URL(window.location.href);
  url.searchParams.set(key, value);
  window.history.pushState({}, "", url.toString());
};

export const removeUrlParam = (key: string) => {
  const url = new URL(window.location.href);
  url.searchParams.delete(key);
  window.history.pushState({}, "", url.toString());
};

export const getUrlParam = (key: string) => {
  if (typeof window === "undefined") return null;
  return new URLSearchParams(window.location.search).get(key);
};

export const updateUrlParams = (params: Record<string, string | null>) => {
  const url = new URL(window.location.href);

  Object.entries(params).forEach(([key, value]) => {
    if (value === null) {
      url.searchParams.delete(key);
    } else {
      url.searchParams.set(key, value);
    }
  });

  window.history.pushState({}, "", url.toString());
};
