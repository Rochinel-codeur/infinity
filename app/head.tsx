import { APP_STORE_URL, PLAY_STORE_URL, SIGNUP_URL } from "@/config/site";

function originOf(url: string): string | null {
  try {
    return new URL(url).origin;
  } catch {
    return null;
  }
}

export default function Head() {
  const origins = Array.from(
    new Set(
      [PLAY_STORE_URL, APP_STORE_URL, SIGNUP_URL]
        .map(originOf)
        .filter((v): v is string => Boolean(v))
    )
  );

  return (
    <>
      <script
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html:
            "(function(){try{var t=localStorage.getItem('theme');var d=t==='dark'||(t!=='light'&&window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',!!d);}catch(e){}})();"
        }}
      />
      {origins.map((origin) => (
        <link key={`${origin}-dns`} rel="dns-prefetch" href={origin} />
      ))}
      {origins.map((origin) => (
        <link key={`${origin}-pc`} rel="preconnect" href={origin} crossOrigin="anonymous" />
      ))}
    </>
  );
}
