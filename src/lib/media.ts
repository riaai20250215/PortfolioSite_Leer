export const getVisibleSorted = <T extends { visible: boolean; order: number }>(items: T[]) =>
  items.filter((item) => item.visible).sort((a, b) => a.order - b.order);

export const getYouTubeVideoId = (value: string) => {
  if (!value) {
    return "";
  }

  const trimmed = value.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed);
    if (url.hostname.includes("youtu.be")) {
      return url.pathname.replace("/", "").slice(0, 11);
    }

    if (url.hostname.includes("youtube.com")) {
      const watchId = url.searchParams.get("v");
      if (watchId) {
        return watchId.slice(0, 11);
      }

      const embedMatch = url.pathname.match(/\/embed\/([a-zA-Z0-9_-]{11})/);
      if (embedMatch) {
        return embedMatch[1];
      }
    }
  } catch {
    return "";
  }

  return "";
};
